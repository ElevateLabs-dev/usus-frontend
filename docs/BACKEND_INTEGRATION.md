# Backend integration guide

What is already connected to the backend, what is left, and which routes to use.

- **Live API:** `https://usus-api-utc7.onrender.com/api/v1`
- **Interactive docs (every route, request and response shape):** https://usus-api-utc7.onrender.com/docs
- The free Render instance sleeps after 15 minutes idle; the first request after that can take up to a minute.

---

## 1. How the frontend talks to the backend

| Thing | How it works |
|---|---|
| **Proxy** | The browser only calls `/api/backend/...` (`src/app/api/backend/[...path]/route.ts`). The Next.js server forwards to the backend, so there are no CORS issues. |
| **Backend address** | `BACKEND_URL` in `.env.local` (see `.env.example`). Defaults to `http://127.0.0.1:8000/api/v1`. |
| **Requests** | Use `apiClient` from `src/services/api-client.ts`. It adds the token, sets JSON headers (not for `FormData`), and throws `Error(detail)` on failure. |
| **Pattern** | One service file per area in `src/services/`. The service calls the API and maps the response to the shape the components already use; pages and components stay simple. |
| **Client pages only** | The token is in `localStorage`, so pages that load user data must be client components (`"use client"` + `useEffect`), not `async` server components. |

### Authentication rules

- **Sign in:** `POST /auth/token` (form fields `username` = email, `password`). Already done in `auth-service.ts`.
- **Token contents:** `user_id`, `email`, `role`, `tenant_id`, and `pwd_change` while a temporary password is in use.
- **Roles:** `trainee`, `manager`, `company_admin`, `platform_admin`.
- **No self sign-up.** Organisations add their own users. The `/signup` page has no backend and should be removed or turned into "ask your organisation for an invite".
- **First sign-in:** invited users get `must_change_password: true` and are sent to `/change-password` (done). Until they change it, every route except `GET /users/me` and `POST /auth/change-password` returns `403 Password change required`.
- **Deactivation is immediate.** A deactivated user gets `401`; a user of a deactivated organisation gets `403 Your organization has been deactivated`. Suggested: on any `401`, clear the token and go to `/login` (not implemented yet).
- **Platform admins** have no organisation. To use organisation routes (scenarios, users, progress) they sign in with `POST /auth/token?tenant_id=<organisation id>`. The organisation routes under `/organizations` need no tenant.

### Good to know

- **Evaluations are generated in the background.** `POST /simulations/{id}/end` returns immediately with `status: "completed"`. Poll `GET /simulations/{id}/evaluation`: it returns `404 "Evaluation is still being generated."` until ready (usually 10–30 s). Already handled in `evaluation-service.ts`.
- **Scores are 0–100** everywhere (overall and each of the 7 dimensions: Accuracy, Empathy, Clarity, Policy, Resolution, De-escalation, Efficiency).
- **Nothing is hard-deleted.** Users and organisations are deactivated (`is_active: false`); scenarios are archived.
- **Invite emails** are sent in the background. `invite_sent_at` is `null` until the email has gone out (or if it failed) — use "Resend invite".

---

## 2. Already connected (no dummy data)

| Page | Routes used | Service |
|---|---|---|
| Login | `POST /auth/token` | `auth-service.ts` |
| First-login password change (`/change-password`) | `POST /auth/change-password` | `auth-service.ts` |
| Scenario browser | `GET /scenarios/` | `scenario-service.ts` |
| Scenario brief | `GET /scenarios/{id}` | `scenario-service.ts` |
| Role-play | `POST /simulations/start`, `POST /simulations/{id}/message`, `POST /simulations/{id}/end` | `simulation-service.ts` |
| Evaluation | `GET /simulations/{id}/evaluation` (polled) | `evaluation-service.ts` |
| History list / detail | `GET /simulations/`, `GET /simulations/{id}` | `history.ts` |
| Dashboard | `GET /progress/me`, `GET /scenarios/`, `GET /simulations/` | `dashboard-service.ts` |
| Learning path | `GET /scenarios/`, `GET /scenarios/categories` | `learning-path-service.ts` |
| Company admin → Trainees | `GET /users/?role=trainee`, `POST /users/`, `POST /users/trainees/import`, `GET /users/trainees/import-template`, `POST /users/{id}/resend-invite`, `PATCH /users/{id}` | `users-service.ts` |

---

## 3. Still to build

### 3.1 Trainee area

| Task | Route | Notes |
|---|---|---|
| **Profile page** — show and edit name | `GET /users/me`, `PATCH /users/me` `{ "full_name": "..." }` | The page currently only shows what is in the token. |
| **Settings** — change password | `POST /auth/change-password` `{ current_password, new_password }` | Returns a new token: store it (use `changePassword()` in `auth-service.ts`). The page is a placeholder. |
| **Scenario cards** — real category, skills, progress | already in `GET /scenarios/` | Cards show a fixed "Customer Scenario" label. Each scenario has `category {id,name}`, `skills [{id,name}]`, `estimated_minutes`, and `progress { status: "new" \| "in_progress" \| "completed", attempts, best_score, last_score }`. |
| **Filter by category / difficulty** | `GET /scenarios/?category=de_escalation&difficulty=beginner` | Category ids come from `GET /scenarios/categories`. |
| **Learning path → category link** | same as above | "View scenarios" could open `/scenarios` filtered by that category. |
| **History detail** — show the conversation and feedback | already in `GET /simulations/{id}` | The response also has `messages [{ role: "user" \| "model", content, created_at }]` and the full `evaluation` (strengths, improvements, missed_opportunities, recommendations). |
| **Progress over time** chart | `GET /progress/me` | `score_history [{ completed_at, overall_score, scenario_name }]`, `dimensions [{ name, average, latest, change }]`, `score_change`, `improving`, `total_practice_minutes`. |
| **Notifications bell** | none | No backend yet; still uses `src/data/notifications.ts`. Hide it or keep it static. |
| **Forgot password** | none | No self-service reset yet. For now a manager/company admin uses "Resend invite". The page should say "contact your organisation admin". |

### 3.2 Company admin area (`/company-admin/...`)

The sidebar links to these pages; only **Trainees** exists. `company-admin/trainees/page.tsx` is the reference implementation to copy.

| Page | Routes | Notes |
|---|---|---|
| **Dashboard** (`/company-admin`) | `GET /progress/team`, `GET /users/` | Team size, sessions completed, average score. Placeholder today. |
| **Users** (`/company-admin/users`) | `GET /users/` | Everyone in the organisation; optional `?role=`. |
| **Managers** (`/company-admin/managers`) | `GET /users/?role=manager`, `POST /users/` `{ email, full_name, role: "manager" \| "company_admin" }`, `PATCH /users/{id}` `{ role? , is_active?, full_name? }`, `POST /users/{id}/resend-invite` | Same as the Trainees page plus a role selector. Errors to show: `400` (cannot deactivate yourself / change your own role), `409` (an organisation needs at least one active company admin). |
| **Performance** (`/company-admin/performance`) | `GET /progress/team`, `GET /progress/users/{user_id}` | Team list: `sessions_completed`, `average_score`, `latest_score`, `last_active_at`, `must_change_password` (true = has not signed in yet). Clicking a trainee shows the same report as `GET /progress/me`. |
| **Training** (`/company-admin/training`) — scenario management | `GET /scenarios/manage`, `GET /scenarios/{id}/manage`, `POST /scenarios/`, `PATCH /scenarios/{id}`, `DELETE /scenarios/{id}` | The `manage` routes include the hidden fields (`escalation_behavior`, `success_criteria`, `system_prompt`) and archived scenarios. `DELETE` archives; restore with `PATCH { "is_archived": false }`. `409` = name already used. Required on create: `name`, `description`, `category`, `difficulty`, `persona`, `situation`, `trainee_objective`. |
| **Re-run an evaluation** (optional) | `POST /evaluations/{session_id}/generate` | For a session whose evaluation failed. |
| **Settings** | — | Nothing organisation-specific on the backend yet. |

Bulk add without a file: `POST /users/trainees/bulk` `{ "trainees": [{ "email", "full_name" }] }` (max 500).

### 3.3 Manager area (`/manager/...`)

Managers can do everything a company admin can **for trainees only**, and cannot change roles.

| Page | Routes |
|---|---|
| **My Team** | `GET /users/?role=trainee`, `POST /users/` (role `trainee`), import, resend invite, `PATCH /users/{id}` (trainees only) — the Trainees page can be reused. Note `company-admin/layout.tsx` only allows `company_admin`. |
| **Performance** | `GET /progress/team`, `GET /progress/users/{user_id}` |
| **Training** | Same scenario routes as the company admin. |

### 3.4 Platform admin area (`/platform-admin/...`)

These pages exist as static UI only.

| Page | Routes | Notes |
|---|---|---|
| **Organisations** list | `GET /organizations/` | `name`, `is_active`, `users_count`, `trainees_count`, `scenarios_count`, `sessions_completed`. |
| **New organisation** | `POST /organizations/` `{ name, admin_email, admin_full_name }` | One call creates the organisation, its starter scenarios and its company admin (invited by email). `409` = name or email already used. |
| **Organisation detail / Company accounts** | `GET /organizations/{id}` | Adds `staff` (company admins and managers). |
| **Rename / deactivate** | `PATCH /organizations/{id}` `{ name?, is_active? }` | Deactivating blocks all of the organisation's users immediately. |
| **Monitoring** | `GET /organizations/` | Totals can be summed from the list; there is no dedicated endpoint. |
| **Platform users** | none | Platform admins are created from the backend command line (`uv run seed-admin`). |

---

## 4. Not available on the backend yet

Do not build against these; they need backend work first.

- Self-service forgot/reset password
- Notifications
- Recommended scenarios (the dashboard currently suggests untried scenarios)
- Knowledge base
- Voice role-play

---

## 5. Clean-up

- `src/data/history.ts`, `src/data/scenario-brief.ts`, `src/data/dashboard.ts`, `src/data/learning-path.ts`, `src/data/evaluation.ts`, `src/data/role-play.ts`, `src/data/scenarios.ts` are no longer imported and can be deleted. `src/data/notifications.ts` is still used.
- `src/lib/api/*` is unused (the app uses `src/services/*`).
- The UI kit (`Modal`, `Input`, `Button`, `Badge`, `Table`) uses fixed light colours rather than the `--usus-*` theme variables, so those components do not follow dark mode.
