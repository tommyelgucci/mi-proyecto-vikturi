from crewai.tools import tool
from duckduckgo_search import DDGS

_NO_RESULTS_MSG = (
    "No encontré información verificada sobre este tema en las fuentes web consultadas. "
    "Te recomiendo consultar la documentación oficial del proyecto o recurso directamente."
)


@tool("Web Search")
def web_search(query: str) -> str:
    """
    Searches the web using DuckDuckGo and returns the top 5 verified results.
    If no reliable results are found, returns an explicit 'not found' message
    instead of guessing or inventing information.
    """
    try:
        with DDGS() as ddgs:
            results = list(ddgs.text(query, max_results=5))

        if not results:
            return _NO_RESULTS_MSG

        lines = ["Resultados verificados de búsqueda web:\n"]
        for i, r in enumerate(results, 1):
            lines.append(f"{i}. **{r['title']}**")
            lines.append(f"   Fuente: {r['href']}")
            lines.append(f"   {r['body']}\n")

        lines.append(
            "\n⚠️ Nota: estos resultados provienen de búsqueda web en tiempo real. "
            "Verifica siempre en la fuente oficial antes de aplicar la información."
        )
        return "\n".join(lines)

    except Exception as e:
        return (
            f"La búsqueda web falló con el error: {e}. "
            "No puedo proporcionar información verificada en este momento. "
            "Por favor consulta la documentación oficial directamente."
        )
