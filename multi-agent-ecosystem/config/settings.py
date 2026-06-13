import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    anthropic_api_key: str = os.environ.get("ANTHROPIC_API_KEY", "")
    model: str = os.getenv("MODEL", "claude-sonnet-4-6")
    max_tokens: int = int(os.getenv("MAX_TOKENS", "4096"))

    @property
    def llm(self) -> str:
        # crewai >=0.63 uses litellm — pass model as "provider/model-name"
        return f"anthropic/{self.model}"

    def validate(self):
        if not self.anthropic_api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key."
            )


settings = Settings()
