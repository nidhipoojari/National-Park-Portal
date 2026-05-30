"""Admin insights: turn a statistics_report into an executive summary."""
from __future__ import annotations

from langchain_core.messages import HumanMessage, SystemMessage

from . import backend_client as be
from .llm import make_llm

SYSTEM = """You are a data analyst for the National Park Service Portal. You are \
given the raw output of an Oracle `statistics_report` stored procedure for a date \
range. Write a crisp executive summary for park management.

Rules:
- Base every statement strictly on the numbers provided; never invent figures.
- Lead with one headline sentence, then 3-5 bullet insights (busiest park, revenue, \
notable zeros, tour vs campsite mix).
- End with one short, actionable recommendation.
- Plain professional prose, no markdown headers."""


def generate_insights(start: str, end: str) -> dict:
    lines = be.statistics_report(start, end)
    report_text = "\n".join(lines) if lines else "(no data)"

    llm = make_llm(temperature=0.3)
    resp = llm.invoke(
        [
            SystemMessage(content=SYSTEM),
            HumanMessage(
                content=f"Date range: {start} to {end}\n\nstatistics_report output:\n{report_text}"
            ),
        ]
    )
    return {"summary": resp.content, "report": lines, "start": start, "end": end}
