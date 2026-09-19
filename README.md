# Automated Certificate Generator

A website that lets a teacher take one draft certificate, auto-generate a
linked Google Sheet + Form for student submissions, check qualification via
an LLM-assisted column detector, and email certificates as the teacher
(Gmail API, send-only scope) — with a server-side review/approval flow
before anything goes out.

Full spec: [docs/plan.md](docs/plan.md)

## Structure

- `backend/` — scheduling, Sheets/Forms/Gmail API integration, LLM integration
- `frontend/` — initialization wizard, review list, chat-command tab
- `templates/` — email templates, certificate template references
- `config/` — per-certificate settings, cached LLM results, font metadata
- `users/` — login/profile JSON storage
- `docs/` — spec and decisions log

## Status

Pre-implementation. No application code yet — see `docs/plan.md` for the
full working spec and open decisions.
