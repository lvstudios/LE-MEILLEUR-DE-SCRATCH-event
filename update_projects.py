import scratchattach as scratch3
import json

USERNAME = "Meilleur_De_SCRATCH"
PASSWORD = "3xBR9rX3n6zL6Nf"
STUDIO_ID = 37057539
JSON_FILE = "projects.json"

# Connexion
session = scratch3.ScratchSession(USERNAME, PASSWORD)

# Récupérer tous les projets du studio
projects_list = []
studio = session.connect_studio(STUDIO_ID)
for project in studio.projects:
    projects_list.append({
        "id": project.id,
        "title": project.title,
        "author": project.creator.username,
        "url": f"https://scratch.mit.edu/projects/{project.id}"
    })

# Écrire dans projects.json
with open(JSON_FILE, "w", encoding="utf-8") as f:
    json.dump(projects_list, f, ensure_ascii=False, indent=2)

print(f"{len(projects_list)} projets ont été ajoutés dans {JSON_FILE}.")
