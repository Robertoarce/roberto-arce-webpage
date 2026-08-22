"""Upload the quantized fine-tuned models to a public HuggingFace repo.
Reads HUGGINGFACE_API_KEY from .env (never prints it).
"""
import os
import re
import sys

os.environ.setdefault("HF_HUB_ENABLE_HF_TRANSFER", "1")

from huggingface_hub import HfApi  # noqa: E402

env_text = open(".env", encoding="utf-8").read()
m = re.search(r"(?im)^\s*HUGGINGFACE_API_KEY\s*=\s*[\"']?([^\"'\r\n]+)", env_text)
if not m:
    sys.exit("HUGGINGFACE_API_KEY not found in .env")
key = m.group(1).strip()

api = HfApi(token=key)
me = api.whoami()
print("logged in as:", me["name"])

repo_id = f"{me['name']}/roberto-cv-models"
api.create_repo(repo_id=repo_id, repo_type="model", private=False, exist_ok=True)
print("repo:", repo_id)

for folder in ["llama-3-2-3b-ft-q4", "llama-3-2-1b-ft-q4"]:
    local = os.path.join("finetuning", "output", folder)
    print(f"uploading {folder} -> {repo_id}/{folder}")
    api.upload_folder(
        folder_path=local,
        repo_id=repo_id,
        repo_type="model",
        path_in_repo=folder,
        commit_message=f"Upload {folder} (q4f16_1, fine-tuned CV model)",
    )
    print("done:", folder)

print("UPLOAD COMPLETE")
