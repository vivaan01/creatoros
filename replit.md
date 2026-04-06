# CreatorOS — Workspace

## Overview

CreatorOS is a Conversational Sales & Attribution Engine for Bharat's creator economy. It's a full-stack web dashboard for Indian micro-to-mid-tier creators who run AI-powered "digital avatars" that speak authentic Hinglish, convert public comments into private DMs, and track every sale to prove exact brand ROI.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React + Vite (artifacts/creator-os) — dark saffron/orange theme
- **API framework**: Express 5 (artifacts/api-server)
- **Database**: PostgreSQL + Drizzle ORM (lib/db)
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in lib/api-spec)
- **Build**: esbuild (CJS bundle for API server)

## Features

- **Dashboard** ("The Face Value"): Revenue totals, DMs handled, conversion rate, revenue trend chart, top converting products
- **C.O.R.E. Avatar Engine**: 4-quadrant personality setup (Conversational, Operational, Relational, Ethos), slang editor, live Hinglish chat preview
- **Brand Campaigns**: Full campaign management with status, funnel stats, ROI tracking per brand deal
- **Product Catalog**: Creator product grid with stock management
- **Linkrunner Hub**: Unique tracking link generation with click/conversion attribution
- **DM Conversations**: AI-handled conversation history with Hinglish chat replay
- **Brand Report**: Exportable ROI report for negotiating higher brand fees

## Database Tables

- `creator_profiles` — Creator avatar vibe and profile config
- `campaigns` — Brand deal campaigns with metrics
- `products` — Creator product catalog
- `tracking_links` — Linkrunner short-code tracking links with attribution
- `conversations` — AI DM conversation records
- `messages` — Individual messages per conversation

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Routes

- `/` — Dashboard (Face Value metrics)
- `/avatar` — C.O.R.E. Avatar Engine
- `/campaigns` — Brand Campaigns
- `/products` — Product Catalog
- `/links` — Linkrunner Hub
- `/conversations` — DM Conversations
- `/report` — Brand Report

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
