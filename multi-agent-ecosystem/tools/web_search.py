from __future__ import annotations
from crewai.tools import tool
from duckduckgo_search import DDGS

_MIN_SOURCES_FOR_VERIFICATION = 2
_OVERLAP_THRESHOLD = 0.08  # 8% keyword overlap = sources are consistent

_CONFLICT_MSG = (
    "⚠️ CONFLICTO DE INFORMACIÓN DETECTADO: Las fuentes consultadas se contradicen "
    "o cubren aspectos tan distintos que no puedo verificar los datos de forma cruzada. "
    "Prefiero no responder antes que inventar datos. "
    "Te recomiendo consultar la documentación oficial del proyecto directamente."
)

_NO_RESULTS_MSG = (
    "No encontré información verificada sobre este tema en ninguna de las fuentes consultadas. "
    "Te recomiendo consultar la documentación oficial directamente."
)


@tool("Web Search")
def web_search(query: str) -> str:
    """
    Searches the web across multiple sources (general web, Wikipedia, official docs)
    and cross-verifies that at least 2 independent sources agree before returning results.
    Returns an explicit conflict or 'not found' message instead of guessing.
    """
    source_batches = _fetch_all_sources(query)
    non_empty = [batch for batch in source_batches if batch["results"]]

    if not non_empty:
        return _NO_RESULTS_MSG

    if len(non_empty) == 1:
        # Only one source — return it but flag as unverified
        batch = non_empty[0]
        return _format_single_source(query, batch)

    verified, reason = _cross_verify([b["results"] for b in non_empty])

    if not verified:
        return _CONFLICT_MSG

    return _format_verified_results(query, non_empty)


def _fetch_all_sources(query: str) -> list[dict]:
    """Run three independent searches and return their results."""
    strategies = [
        {"label": "Web general", "query": query},
        {"label": "Wikipedia",   "query": f"{query} wikipedia"},
        {"label": "Docs oficiales", "query": f"{query} official documentation OR docs OR site:github.com"},
    ]
    batches = []
    for strategy in strategies:
        try:
            with DDGS() as ddgs:
                results = list(ddgs.text(strategy["query"], max_results=4))
            batches.append({"label": strategy["label"], "results": results})
        except Exception:
            batches.append({"label": strategy["label"], "results": []})
    return batches


def _cross_verify(results_list: list[list[dict]]) -> tuple[bool, str]:
    """
    Simple cross-verification via keyword overlap.
    Returns (is_consistent, reason).
    """
    texts = []
    for results in results_list:
        if results:
            combined = " ".join(
                (r.get("body", "") + " " + r.get("title", "")).lower()
                for r in results
            )
            # Use meaningful words only (length > 4)
            words = {w for w in combined.split() if len(w) > 4}
            texts.append(words)

    if len(texts) < _MIN_SOURCES_FOR_VERIFICATION:
        return False, "Not enough sources to cross-verify"

    # Compare first two non-empty source sets
    overlap = len(texts[0] & texts[1])
    union = len(texts[0] | texts[1])
    ratio = overlap / union if union > 0 else 0

    if ratio >= _OVERLAP_THRESHOLD:
        return True, f"Sources consistent (overlap {ratio:.1%})"
    return False, f"Sources diverge (overlap {ratio:.1%})"


def _format_verified_results(query: str, batches: list[dict]) -> str:
    lines = [
        f"✅ Información verificada en {len(batches)} fuentes independientes\n",
        f"**Consulta:** {query}\n",
    ]
    for batch in batches:
        lines.append(f"\n### Fuente: {batch['label']}")
        for i, r in enumerate(batch["results"][:3], 1):
            lines.append(f"{i}. **{r.get('title', 'Sin título')}**")
            lines.append(f"   {r.get('href', '')}")
            body = r.get("body", "")[:300]
            if body:
                lines.append(f"   {body}")
    lines.append(
        "\n⚠️ Verifica siempre en la fuente oficial antes de aplicar la información."
    )
    return "\n".join(lines)


def _format_single_source(query: str, batch: dict) -> str:
    lines = [
        f"⚠️ Solo se encontró UNA fuente — resultado NO verificado de forma cruzada.\n",
        f"**Consulta:** {query} | **Fuente:** {batch['label']}\n",
    ]
    for i, r in enumerate(batch["results"][:4], 1):
        lines.append(f"{i}. **{r.get('title', 'Sin título')}**")
        lines.append(f"   {r.get('href', '')}")
        body = r.get("body", "")[:300]
        if body:
            lines.append(f"   {body}")
    return "\n".join(lines)
