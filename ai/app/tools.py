"""LangChain tools the concierge agent can call.

Tools are built per-request so the signed-in visitor's id/name can be closed
over — the LLM never has to (and cannot) supply someone else's identity for
write actions like booking or cancelling.
"""
from __future__ import annotations

import json

from langchain_core.tools import StructuredTool
from pydantic import BaseModel, Field

from . import backend_client as be


def _fmt(lines: list[str]) -> str:
    return "\n".join(lines) if lines else "(no results)"


# ---------- argument schemas ----------

class Empty(BaseModel):
    pass


class ParkId(BaseModel):
    park_id: int = Field(description="Numeric park id, e.g. 100-104")


class CampsiteSearch(BaseModel):
    park_name: str = Field(description="Exact park name, e.g. 'Shenandoah National Park'")
    start: str = Field(description="Check-in date, format YYYY-MM-DD")
    end: str = Field(description="Check-out date, format YYYY-MM-DD")
    people: int = Field(default=1, description="Total number of people")


class ParkName(BaseModel):
    park_name: str = Field(description="Exact park name")


class TourSearch(BaseModel):
    name: str = Field(description="Tour name to search for")
    date: str = Field(description="Date, format YYYY-MM-DD")
    spots: int = Field(default=1, description="Number of spots needed")


class CampsiteBooking(BaseModel):
    facility_id: int = Field(description="Campsite facility id from a prior search")
    start_date: str = Field(description="Check-in date YYYY-MM-DD")
    num_days: int = Field(description="Number of nights")
    adults: int = Field(default=1)
    children: int = Field(default=0)


class TourBooking(BaseModel):
    facility_id: int = Field(description="Tour facility id from a prior search")
    start_time: str = Field(description="Start datetime, YYYY-MM-DD HH:MI (24h)")
    adults: int = Field(default=1)
    children: int = Field(default=0)


class CancelArgs(BaseModel):
    transaction_id: int = Field(description="Transaction id to cancel")


def build_tools(visitor_id: int | None, visitor_name: str | None) -> list[StructuredTool]:
    """Return the tool set, scoped to the current visitor for write actions."""

    # ---- read tools (always available) ----
    def search_parks() -> str:
        parks = be.list_parks()
        return json.dumps(parks)

    def get_park_details(park_id: int) -> str:
        return json.dumps(be.get_park(park_id))

    def find_campsites(park_name: str, start: str, end: str, people: int = 1) -> str:
        return _fmt(be.available_campsites(park_name, start, end, people))

    def find_park_tours(park_name: str) -> str:
        return _fmt(be.park_tours(park_name))

    def find_available_tours(name: str, date: str, spots: int = 1) -> str:
        return _fmt(be.available_tours(name, date, spots))

    def check_parking(park_name: str) -> str:
        return _fmt(be.parking_lots(park_name))

    tools: list[StructuredTool] = [
        StructuredTool.from_function(
            func=search_parks,
            name="search_parks",
            description="List all national parks with id, name, address and state.",
            args_schema=Empty,
        ),
        StructuredTool.from_function(
            func=get_park_details,
            name="get_park_details",
            description="Get a park's facilities (campsites, tours, parking) by park id.",
            args_schema=ParkId,
        ),
        StructuredTool.from_function(
            func=find_campsites,
            name="find_campsites",
            description="Find available campsites in a park for a date range and party size.",
            args_schema=CampsiteSearch,
        ),
        StructuredTool.from_function(
            func=find_park_tours,
            name="find_park_tours",
            description="List tours offered at a given park.",
            args_schema=ParkName,
        ),
        StructuredTool.from_function(
            func=find_available_tours,
            name="find_available_tours",
            description="Check availability of a specific tour on a date.",
            args_schema=TourSearch,
        ),
        StructuredTool.from_function(
            func=check_parking,
            name="check_parking",
            description="Show live parking-lot status for a park.",
            args_schema=ParkName,
        ),
    ]

    # ---- write tools (only when signed in) ----
    if visitor_id is not None:
        def book_campsite(
            facility_id: int, start_date: str, num_days: int, adults: int = 1, children: int = 0
        ) -> str:
            return _fmt(
                be.reserve_campsite(facility_id, visitor_id, start_date, num_days, adults, children)
            )

        def book_tour(
            facility_id: int, start_time: str, adults: int = 1, children: int = 0
        ) -> str:
            return _fmt(be.reserve_tour(facility_id, visitor_id, start_time, adults, children))

        def list_my_reservations() -> str:
            if not visitor_name:
                return "Cannot look up reservations without the visitor name."
            return _fmt(be.visitor_transactions(visitor_name))

        def cancel_reservation(transaction_id: int) -> str:
            return _fmt(be.cancel_transaction(transaction_id))

        tools.extend(
            [
                StructuredTool.from_function(
                    func=book_campsite,
                    name="book_campsite",
                    description=(
                        "Reserve a campsite for the signed-in visitor. Only call after the "
                        "user has explicitly confirmed the facility, dates and party size."
                    ),
                    args_schema=CampsiteBooking,
                ),
                StructuredTool.from_function(
                    func=book_tour,
                    name="book_tour",
                    description=(
                        "Reserve a tour for the signed-in visitor. Only call after the user "
                        "has explicitly confirmed the details."
                    ),
                    args_schema=TourBooking,
                ),
                StructuredTool.from_function(
                    func=list_my_reservations,
                    name="list_my_reservations",
                    description="List the signed-in visitor's reservations/transactions.",
                    args_schema=Empty,
                ),
                StructuredTool.from_function(
                    func=cancel_reservation,
                    name="cancel_reservation",
                    description=(
                        "Cancel a reservation by transaction id. Only call after the user "
                        "confirms they want to cancel that specific transaction."
                    ),
                    args_schema=CancelArgs,
                ),
            ]
        )

    return tools
