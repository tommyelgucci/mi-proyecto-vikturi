import sys
import argparse
from config.settings import settings
from crew.ecosystem_crew import EcosystemCrew
from memory.session_memory import get_stats, get_recent_context


def main():
    parser = argparse.ArgumentParser(
        description="Multi-Agent Ecosystem: Dimelis AI · Yvannia AI · Teriania",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py "¿Cómo organizo un proyecto FastAPI?"
  python main.py "Explícame qué es un decorador en Python"
  python main.py "¿Cuáles son las diferencias entre CrewAI y LangGraph?"
  python main.py --train "Procesa mis notas y prepara a los agentes"
  python main.py --history
        """,
    )
    parser.add_argument(
        "request",
        nargs="?",
        default="",
        help="Your question or task for the agent ecosystem",
    )
    parser.add_argument(
        "--train",
        action="store_true",
        help="Training mode: reads context/ files and enriches all agents",
    )
    parser.add_argument(
        "--history",
        action="store_true",
        help="Show memory stats and recent interaction history",
    )
    args = parser.parse_args()

    if args.history:
        stats = get_stats()
        print("\n" + "=" * 60)
        print("  MEMORIA DEL ECOSISTEMA")
        print("=" * 60)
        print(f"  Total interacciones : {stats['total']}")
        print(f"  Consultas           : {stats['queries']}")
        print(f"  Entrenamientos      : {stats['trainings']}")
        print(f"  Última sesión       : {stats['last_date']}")
        print("=" * 60)
        recent = get_recent_context(n=5)
        if recent:
            print(recent)
        else:
            print("  No hay historial todavía.")
        print("=" * 60 + "\n")
        return

    if not args.request and not args.train:
        parser.print_help()
        sys.exit(0)

    settings.validate()

    request = args.request or "Read and process all my context files."
    crew = EcosystemCrew()
    result = crew.run(request, training_mode=args.train)

    print("\n" + "=" * 60)
    print("  ECOSYSTEM RESPONSE")
    print("=" * 60)
    print(result)
    print("=" * 60 + "\n")


if __name__ == "__main__":
    main()
