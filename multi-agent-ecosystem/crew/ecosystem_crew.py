from crewai import Crew, Task, Process
from agents.master_agent import make_master_agent
from agents.dimelis_agent import make_dimelis_agent
from agents.yvannia_agent import make_yvannia_agent
from agents.teriania_agent import make_teriania_agent


class EcosystemCrew:
    def __init__(self):
        self.master = make_master_agent()
        self.dimelis = make_dimelis_agent()
        self.yvannia = make_yvannia_agent()
        self.teriania = make_teriania_agent()

    def run(self, user_request: str, training_mode: bool = False) -> str:
        if training_mode:
            description = (
                "Training mode activated. "
                "Use the Context Loader tool to read all files in the context/ folder. "
                "Then produce a structured enriched briefing for each agent — Dimelis, Yvannia, and Teriania — "
                "based on the user's notes and preferences found in those files. "
                f"Additional user instruction: {user_request}"
            )
        else:
            description = (
                f"User request: '{user_request}'\n\n"
                "Identify which specialist should handle this request:\n"
                "- Dimelis AI: code, project structure, developer tools, best practices\n"
                "- Yvannia AI: explanations, tutorials, learning, step-by-step teaching\n"
                "- Teriania: research, documentation, comparisons, web search\n\n"
                "Delegate to the correct agent and return their complete response to the user."
            )

        master_task = Task(
            description=description,
            agent=self.master,
            expected_output="A complete, helpful, and well-structured response to the user's request",
        )

        crew = Crew(
            agents=[self.master, self.dimelis, self.yvannia, self.teriania],
            tasks=[master_task],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff()
        return str(result)
