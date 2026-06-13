from crewai.tools import tool
from duckduckgo_search import DDGS


@tool("Web Search")
def web_search(query: str) -> str:
    """Searches the web using DuckDuckGo and returns the top 5 results with title, URL, and summary."""
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))
        if not results:
            return f"No results found for: {query}"
        lines = []
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. **{r['title']}**\n   URL: {r['href']}\n   {r['body']}\n")
        return "\n".join(lines)
    except Exception as e:
        return f"Search failed: {e}. Try rephrasing the query."
