"""Concierge agent: a tool-calling loop over the park booking API.

Implemented with stable langchain-core primitives (bind_tools + manual loop)
so it works regardless of the high-level agent API churn between LangChain
0.x / 1.x.
"""
from __future__ import annotations

from datetime import date

from langchain_core.messages import (
    AIMessage,
    HumanMessage,
    SystemMessage,
    ToolMessage,
)

from .llm import make_llm
from .tools import build_tools

MAX_STEPS = 6

SYSTEM_PROMPT = """You are the National Park Service Portal concierge — a warm, \
concise assistant that helps visitors discover parks, find campsites and tours, \
check parking, and (when signed in) make or cancel reservations.

Today's date is {today}. Resolve relative dates ("next weekend", "next month") \
against it and always pass dates to tools as YYYY-MM-DD (datetimes as \
"YYYY-MM-DD HH:MI", 24-hour).

Parks and their ids: 100 Patapsco Valley State Park (MD), 101 Shenandoah \
National Park (VA), 102 Great Falls Park (VA), 103 Centennial Park (MD), \
104 Patterson Park (MD).

Guidelines:
- Use tools to get real data; never invent availability, prices, ids or facility names.
- To search campsites/tours you usually need the exact park name — call search_parks first if unsure.
- BEFORE booking or cancelling, restate the exact details (facility, dates, party size, price if known) and ask the user to confirm. Only call book_* / cancel_reservation after an explicit yes.
- If the user is not signed in, you can search and recommend, but explain they must sign in to book.
- Keep replies short and friendly. Use simple formatting (short lists), not large tables.
"""


def run_concierge(
    messages: list[dict], visitor_id: int | None, visitor_name: str | None
) -> str:
    """Run the tool-calling loop over a chat history and return the reply.

    `messages` is a list of {"role": "user"|"assistant", "content": str}.
    """
    tools = build_tools(visitor_id, visitor_name)
    tools_by_name = {t.name: t for t in tools}
    llm = make_llm().bind_tools(tools)

    signed_in = (
        f"The visitor is signed in as {visitor_name} (visitor id {visitor_id})."
        if visitor_id is not None
        else "The visitor is NOT signed in (search only, no bookings)."
    )

    convo: list = [
        SystemMessage(
            content=SYSTEM_PROMPT.format(today=date.today().isoformat()) + "\n" + signed_in
        )
    ]
    for m in messages:
        role = m.get("role")
        content = m.get("content", "")
        if role == "user":
            convo.append(HumanMessage(content=content))
        elif role == "assistant":
            convo.append(AIMessage(content=content))

    for _ in range(MAX_STEPS):
        ai_msg: AIMessage = llm.invoke(convo)
        convo.append(ai_msg)

        if not ai_msg.tool_calls:
            return ai_msg.content if isinstance(ai_msg.content, str) else str(ai_msg.content)

        for call in ai_msg.tool_calls:
            tool = tools_by_name.get(call["name"])
            if tool is None:
                result = f"Unknown tool: {call['name']}"
            else:
                try:
                    result = tool.invoke(call.get("args", {}))
                except Exception as exc:  # noqa: BLE001 — surface to the LLM
                    result = f"Tool error: {exc}"
            convo.append(
                ToolMessage(content=str(result), tool_call_id=call["id"])
            )

    # Ran out of steps — ask the model for a final answer without more tools.
    final = make_llm().invoke(
        convo + [HumanMessage(content="Please give your best final answer now.")]
    )
    return final.content if isinstance(final.content, str) else str(final.content)
