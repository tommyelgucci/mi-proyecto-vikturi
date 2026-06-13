import sys
import argparse
from config.settings import settings
from crew.ecosystem_crew import EcosystemCrew


def main():
    parser = argparse.ArgumentParser(
        description="Multi-Agent Ecosystem: Dimelis AI · Yvannia AI · Teriania",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Examples:
  python main.py "¿Cómo organizo un proyecto FastAPI?"
  python main.py "Explícame qué es una clase en Python"
  python main.py "¿Cuáles son las diferencias entre CrewAI y LangGraph?"
  python main.py --train "Procesa mis notas y prepara a los agentes"
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
        help="Training mode: reads your context/ files and enriches all agents",
    )
    args = parser.parse_args()

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
