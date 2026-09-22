# Shopping

Monorepo for the Pehnawa shopping storefront and its FastAPI backend.

## Structure

```text
shopping/
├── frontend/   # Next.js storefront
└── backend/    # FastAPI API and Alembic migrations
```

## Prerequisites

- Node.js 20 or newer
- Python 3.11 or newer
- npm (or pnpm) for the frontend

## Run the backend

From the repository root, create and activate a virtual environment, then install dependencies:

### PowerShell

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
```

Start FastAPI on port 8000:

```powershell
python -m uvicorn app.main:app --reload --port 8000
```

The API is available at `http://localhost:8000` and its interactive docs are at `http://localhost:8000/docs`.

If the backend uses a local environment file, create `backend/.env` from the values required by `app/core/config.py`. Environment files are intentionally ignored by Git.

## Run the frontend

Open a second terminal at the repository root:

```powershell
cd frontend
npm install
npm run dev
```

The storefront is available at `http://localhost:3000`.

Set `frontend/.env.local` when the frontend needs to point to a different API URL, for example:

```text
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Database migrations

Run Alembic from `backend/` after activating the backend virtual environment:

```powershell
cd backend
alembic upgrade head
```

## GitHub

After creating the GitHub repository named `shopping`, configure its remote and push the initial branch:

```powershell
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>
git branch -M main
git push -u origin main
```
