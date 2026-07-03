"""
One-off recovery script (v2): the first attempt picked the wrong commit
because it filtered by commit *title* ("Sync from GitLab..."), and since
every historical sync used a similar title, it walked too far back and
restored an ancient v1.0 (4 agents, no password) instead of the real
pre-overwrite v1.1 (7 agents incl. Gasp Tree/Vigor AI, password-protected).

This version instead inspects the actual app.py *content* at each past
commit and picks the newest one that has both the Gasp Tree agent and the
password gate — a much more reliable signal than commit titles.
"""
import os
import shutil
import sys

from huggingface_hub import HfApi, hf_hub_download, snapshot_download

REPO_ID = "GucciTommy/vikturi-ai"
REPO_TYPE = "space"

token = os.environ["HF_TOKEN"]
api = HfApi(token=token)

commits = api.list_repo_commits(repo_id=REPO_ID, repo_type=REPO_TYPE)
print(f"Found {len(commits)} commits (newest first):")
for c in commits[:25]:
    print(f"  {c.commit_id[:10]}  {c.created_at}  {c.title!r}")

good_commit = None
for c in commits:
    try:
        path = hf_hub_download(
            repo_id=REPO_ID,
            repo_type=REPO_TYPE,
            filename="app.py",
            revision=c.commit_id,
            token=token,
        )
        content = open(path, encoding="utf-8").read()
    except Exception as e:
        print(f"  skip {c.commit_id[:10]}: {e}")
        continue

    has_gasp = "Gasp Tree" in content
    has_pw = "APP_PASSWORD" in content
    print(f"  check {c.commit_id[:10]} ({c.title!r}): gasp_tree={has_gasp} password={has_pw}")
    if has_gasp and has_pw:
        good_commit = c
        break

if good_commit is None:
    print("ERROR: could not find a commit with Gasp Tree + password gate.", file=sys.stderr)
    sys.exit(1)

print(f"\nRestoring verified revision {good_commit.commit_id} ({good_commit.title!r})")

local_dir = "recovered"
shutil.rmtree(local_dir, ignore_errors=True)
snapshot_download(
    repo_id=REPO_ID,
    repo_type=REPO_TYPE,
    revision=good_commit.commit_id,
    local_dir=local_dir,
    token=token,
)

# Sanity check the downloaded snapshot before publishing it anywhere
downloaded_app = open(os.path.join(local_dir, "app.py"), encoding="utf-8").read()
assert "Gasp Tree" in downloaded_app and "APP_PASSWORD" in downloaded_app, \
    "Downloaded snapshot failed sanity check!"

api.upload_folder(
    folder_path=local_dir,
    repo_id=REPO_ID,
    repo_type=REPO_TYPE,
    commit_message="Rollback: restore verified v1.1 (7 agents + password gate)",
)
print("Restored HF Space to verified v1.1.")
