from crewai import Crew, Task, Process
from agents.master_agent import make_master_agent
from agents.dimelis_agent import make_dimelis_agent
from agents.yvannia_agent import make_yvannia_agent
from agents.teriania_agent import make_teriania_agent
from agents.drewai_agent import make_drewai_agent
from memory.session_memory import save_interaction, get_recent_context


class EcosystemCrew:
    def __init__(self):
        self.master = make_master_agent()
        self.dimelis = make_dimelis_agent()
        self.yvannia = make_yvannia_agent()
        self.teriania = make_teriania_agent()
        self.drew = make_drewai_agent()

    def run(self, user_request: str, training_mode: bool = False) -> str:
        recent_memory = get_recent_context(n=5)
        memory_block = f"\n\n{recent_memory}" if recent_memory else ""

        if training_mode:
            description = (
                "Training mode activated. "
                "Use the Context Loader tool to read all files in the context/ folder "
                "(including session_memory.md and knowledge_base/ entries if they exist). "
                "Then produce a structured enriched briefing for each agent — "
                "Dimelis, Yvannia, Teriania, and DrewAI — "
                "based on the user's notes, preferences, and previous session history. "
                f"Additional user instruction: {user_request}"
                f"{memory_block}"
            )
        else:
            description = (
                f"User request: '{user_request}'\n\n"
                "Identify which specialist should handle this request:\n"
                "- Dimelis AI: code, project structure, developer tools, best practices\n"
                "- Yvannia AI: explanations, tutorials, learning, step-by-step teaching\n"
                "- Teriania: research, documentation, comparisons, web search\n"
                "- DrewAI: visual creativity, image analysis, social media content, "
                "advertising briefs, image generation prompts, TikTok/reel hooks\n\n"
                "Delegate to the correct agent and return their complete response."
                f"{memory_block}"
            )

        master_task = Task(
            description=description,
            agent=self.master,
            expected_output="A complete, helpful, and well-structured response to the user's request",
        )

        crew = Crew(
            agents=[self.master, self.dimelis, self.yvannia, self.teriania, self.drew],
            tasks=[master_task],
            process=Process.sequential,
            verbose=True,
        )

        result = crew.kickoff()
        result_str = str(result)

        save_interaction(user_request, result_str, training_mode=training_mode)

        return result_str
