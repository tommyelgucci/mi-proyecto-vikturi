"""
One-off recovery script: an earlier sync overwrote the HuggingFace Space
with an outdated local copy (v1.0, 4 agents) that clobbered a newer version
(v1.1, 7 agents: Vikturi AI, DrewAI, Gasp Tree, Vigor AI, Dimelis AI,
Yvannia AI, Teriania) that only ever existed on the HF Space itself.

This script finds the commit right before that overwrite, downloads its
full snapshot, re-uploads it to HF main (restoring the live app), and also
saves it locally so it can be committed back into this GitLab repo.
"""
import os
import shutil
import sys

from huggingface_hub import HfApi, snapshot_download

REPO_ID = "GucciTommy/vikturi-ai"
REPO_TYPE = "space"
BAD_COMMIT_TITLES = {"Sync from GitLab CI", "Sync from GitLab"}

token = os.environ["HF_TOKEN"]
api = HfApi(token=token)

commits = api.list_repo_commits(repo_id=REPO_ID, repo_type=REPO_TYPE)
print("Commit history (newest first):")
for c in commits:
    print(f"  {c.commit_id[:10]}  {c.title!r}")

good_commit = None
for c in commits:
    if c.title not in BAD_COMMIT_TITLES:
        good_commit = c
        break

if good_commit is None:
    print("ERROR: could not find a pre-overwrite commit.", file=sys.stderr)
    sys.exit(1)

print(f"\nRestoring revision {good_commit.commit_id} ({good_commit.title!r})")

local_dir = "recovered"
shutil.rmtree(local_dir, ignore_errors=True)
snapshot_download(
    repo_id=REPO_ID,
    repo_type=REPO_TYPE,
    revision=good_commit.commit_id,
    local_dir=local_dir,
    token=token,
)

# 1) Restore the live Space immediately
api.upload_folder(
    folder_path=local_dir,
    repo_id=REPO_ID,
    repo_type=REPO_TYPE,
    commit_message="Rollback: restore pre-sync version (v1.1, 7 agents)",
)
print("Restored HF Space to previous version.")
