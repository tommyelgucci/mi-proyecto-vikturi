import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    anthropic_api_key: str = os.environ.get("ANTHROPIC_API_KEY", "")
    model: str = os.getenv("MODEL", "claude-sonnet-4-6")
    max_tokens: int = int(os.getenv("MAX_TOKENS", "4096"))

    def validate(self):
        if not self.anthropic_api_key:
            raise EnvironmentError(
                "ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key."
            )


settings = Settings()
