# CTrade Frontend Testing

## Setup

1. Install dependencies from the monorepo root:
   ```bash
   cd /home/ubuntu/repos/CTrade && bun install
   ```

2. Start the frontend dev server:
   ```bash
   cd apps/fe && bun run dev
   ```
   - Vite will pick an available port (default 5173, but may increment if ports are in use)
   - Watch the terminal output for the actual URL (e.g., `http://localhost:5173/`)

3. The backend (`apps/http-backend`) requires:
   - `DATABASE_URL` environment variable pointing to a MongoDB instance
   - `JWT_SECRET` environment variable
   - Run with: `bun run apps/http-backend/index.ts`
   - Without the backend, frontend pages will render but API calls will fail gracefully

## Frontend Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Home page with CTrade branding and navigation |
| `/auth` | Auth | Sign in / sign up form |
| `/dashboard` | Dashboard | Lists user's workflows |
| `/create-workflow` | CreateWorkflow | ReactFlow-based workflow builder |
| `/workflow/:workflowId` | WorkflowDetail | View/edit a specific workflow |
| `/workflow/:workflowId/executions` | WorkflowExecutions | List executions for a workflow |

## Testing Approach

### Frontend-only testing (no backend)
- All pages render and route correctly without the backend
- API failures show graceful empty states (e.g., "No workflows yet", "No executions found")
- Auth page shows error messages on failed API calls
- Navigation between pages via buttons works correctly

### Full-stack testing (requires backend + MongoDB)
- Sign up → Sign in → Create workflow → Save → View in dashboard → Check executions
- Requires MongoDB connection string and JWT secret

## Lint

```bash
cd apps/fe && bun run lint
```

Note: There may be pre-existing lint errors in files like `Trigger.tsx`, `ActionSheet.tsx`, `http.ts`, `button.tsx`, `PriceTrigger.tsx` that are not related to new changes.

## Tech Stack
- React 19 + Vite 8 + TypeScript
- TailwindCSS 4 + shadcn/ui components
- ReactFlow for workflow visualization
- Axios for API calls (`lib/http.ts`)
- react-router-dom v7 for routing

## Devin Secrets Needed
- `DATABASE_URL` - MongoDB connection string (for full-stack testing)
- `JWT_SECRET` - JWT signing secret (for full-stack testing)
