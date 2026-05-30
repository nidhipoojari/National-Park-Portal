"""Thin client over the Express backend (Phase 2), which calls Oracle PL/SQL.

Each method maps to one stored-procedure-backed endpoint. The AI tools in
tools.py call these so the LLM never touches the database directly.
"""
from __future__ import annotations

from typing import Any
from urllib.parse import quote

import httpx

from .config import settings

TIMEOUT = httpx.Timeout(30.0, connect=10.0)


class BackendError(RuntimeError):
    pass


def _request(method: str, path: str, *, params: dict | None = None, json: dict | None = None) -> Any:
    url = f"{settings.backend_api_url}{path}"
    try:
        with httpx.Client(timeout=TIMEOUT) as client:
            resp = client.request(method, url, params=params, json=json)
    except httpx.HTTPError as exc:  # network/connection problem
        raise BackendError(f"Could not reach backend API: {exc}") from exc

    if resp.status_code >= 400:
        try:
            detail = resp.json().get("error", resp.text)
        except Exception:  # noqa: BLE001
            detail = resp.text
        raise BackendError(f"Backend returned {resp.status_code}: {detail}")

    if not resp.content:
        return None
    return resp.json()


# ---------- Read endpoints ----------

def list_parks() -> list[dict]:
    return _request("GET", "/api/parks") or []


def get_park(park_id: int) -> dict:
    return _request("GET", f"/api/parks/{park_id}")


def available_campsites(park_name: str, start: str, end: str, people: int = 1) -> list[str]:
    data = _request(
        "GET",
        "/api/campsites/available",
        params={"parkName": park_name, "start": start, "end": end, "people": people},
    )
    return (data or {}).get("output", [])


def park_tours(park_name: str) -> list[str]:
    data = _request("GET", f"/api/tours/by-park/{quote(park_name)}")
    return (data or {}).get("output", [])


def available_tours(name: str, date: str, spots: int = 1) -> list[str]:
    data = _request(
        "GET", "/api/tours/available", params={"name": name, "date": date, "spots": spots}
    )
    return (data or {}).get("output", [])


def parking_lots(park_name: str) -> list[str]:
    data = _request("GET", f"/api/parking/by-park/{quote(park_name)}")
    return (data or {}).get("output", [])


def visitor_transactions(name: str) -> list[str]:
    data = _request("GET", f"/api/visitors/{quote(name)}/transactions")
    return (data or {}).get("output", [])


def statistics_report(start: str, end: str) -> list[str]:
    data = _request("GET", "/api/stats", params={"start": start, "end": end})
    return (data or {}).get("output", [])


# ---------- Write endpoints ----------

def reserve_campsite(
    facility_id: int, visitor_id: int, start_date: str, num_days: int, adults: int = 1, children: int = 0
) -> list[str]:
    data = _request(
        "POST",
        "/api/campsites/reserve",
        json={
            "facilityId": facility_id,
            "visitorId": visitor_id,
            "startDate": start_date,
            "numDays": num_days,
            "adults": adults,
            "children": children,
        },
    )
    return (data or {}).get("output", [])


def reserve_tour(
    facility_id: int, visitor_id: int, start_time: str, adults: int = 1, children: int = 0
) -> list[str]:
    data = _request(
        "POST",
        "/api/tours/reserve",
        json={
            "facilityId": facility_id,
            "visitorId": visitor_id,
            "startTime": start_time,
            "adults": adults,
            "children": children,
        },
    )
    return (data or {}).get("output", [])


def cancel_transaction(transaction_id: int) -> list[str]:
    data = _request("POST", f"/api/transactions/{transaction_id}/cancel")
    return (data or {}).get("output", [])
