# Design reference — Certificate Generator UI

Visual spec for the frontend, paired with [`docs/plan.md`](../plan.md) (the functional spec). These are static mockups only — no wiring, no state, no JS logic. Read this file for *why* a value is what it is; read the HTML files under `desktop/` and `mobile/` for the literal markup/CSS to build from.

## Files

```
docs/mockups/
  DESIGN.md                        — this file
  desktop/
    login.html                     — sign in (username + email + avatar, no password)
    wizard.html                    — new-certificate wizard, step 3 of 5 (qualification rules)
    review-dashboard.html          — review list tab (aging buckets, status, approve all)
    chat-commands.html             — chat-command tab (same shell, second tab)
  mobile/
    review-dashboard.html          — review list at 390×844 (phone breakpoint)
```

Every file is standalone flat HTML/CSS — open any of them directly in a browser, no build step, no dependencies beyond a Google Fonts `<link>`. All five screens (four desktop + one mobile) also exist as a live, editable canvas at the Artifact link shared in this conversation, kept in sync with these files.

## Visual concept

"Institutional ledger" — a registrar's desk, not a startup dashboard. Warm paper ground, ink-dark type, thin hairline rules. The certificate itself carries the visual weight; chrome (nav, tables, forms) stays quiet and typographic. Deliberately avoids: purple gradients, glassmorphism, cards-everywhere, decorative illustration, oversized rounded corners, marketing-site hero sections.

## Color tokens

```css
--cream:         #FAF7F0;  /* page background */
--cream-deep:    #F1EBDD;  /* sidebar, bucket-header, hover surfaces */
--paper:         #FFFFFF;  /* elevated surfaces: cards, cert paper, login card */

--ink:           #211D14;  /* primary text */
--ink-soft:      #4A4436;  /* secondary text, field labels */
--ink-muted:     #6B6455;  /* tertiary/metadata text (5.5:1 on cream — AA safe) */
--ink-faint:     #A39C89;  /* decorative only — do not use for text (2.6:1, fails AA) */

--hairline:        #E4DCC8;
--hairline-strong: #D2C7AC;

--accent:      #2F4F46;  /* primary actions, links, active nav, focus rings */
--accent-ink:  #1E332E;  /* accent hover/active */
--accent-soft: #E3EAE7;  /* accent tint background */

--gold:      #9C7A2E;  /* seals, decorative fills only */
--gold-ink:  #7A5A1C;  /* gold TEXT on gold-soft — passes 5.2:1 (raw --gold on --gold-soft is only 3.3:1) */
--gold-soft: #F1E9D3;

--green: #3F7D52;  --green-soft: #E6EFE3;  /* status: sent / qualified */
--amber: #B8862E;  --amber-soft: #F5EEDC;  /* status: pending */
--rust:  #B23B2E;  --rust-soft:  #F6E7E2;  /* status: not qualified */
```

**Important — `--ink-faint` is decorative-only.** It fails WCAG AA (≈2.6:1 on cream/white) and must never be used for real text — not body copy, not metadata, not counts, not timestamps. It's reserved for non-textual ornament (the hairline lines inside the certificate-thumbnail motif). Every place actual copy needs to look "quiet," use `--ink-muted` instead (5.5:1, passes AA). This distinction was a real bug caught and fixed across all five screens during this pass — don't reintroduce `--ink-faint` on text when building the real frontend.

Status color always pairs a dot **and** a text label — never color alone (accessibility: don't rely on hue to convey state).

## Typography

- **Public Sans** — all UI body text, labels, buttons, table data. (Deliberately not Inter/Roboto/Arial — those read as generic AI-SaaS.)
- **Source Serif 4** — page titles, section headings, wizard step titles, the "S" wordmark.
- **IBM Plex Mono** — timestamps, chat commands, tabular/stat figures.
- Google Fonts import (one line, used identically in every file):
  `https://fonts.googleapis.com/css2?family=Source+Serif+4:wght@500;600;700&family=Public+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap`

**Minimum body text size is 12px.** Short all-caps kicker/eyebrow labels (field labels, bucket headers, chat actor labels — uppercase, letter-spaced, ≤11px) are an intentional exception to that floor; they're a label convention, not continuous-reading copy. Anything meant to be read as a sentence or a data value (email addresses, timestamps, counts) is 12px minimum.

Scale in use: 11 (kicker labels only) / 12 / 12.5 / 13 / 13.5 / 14 / 15 / 16 / 19 / 22 / 27px.

## Spacing / radius / shadow

- Spacing grid: 4px base — 4 / 8 / 12 / 16 / 22 / 24 / 28 / 32 / 40 / 48 / 64 / 96
- Radius, capped deliberately low: **2px** inputs, **4px** buttons/chips, **6–8px** cards/modals. No pill buttons, no oversized rounding.
- Shadow reserved for true overlays (login card, dropdowns) — table rows and bucket containers separate with 1px hairlines, not shadow.

## Layout

- Desktop app shell: fixed 232px left rail (`--cream-deep` bg, brand mark, nav, user chip at bottom) + content column with a 64px top bar and, on the review screen, an underline-tab row (Review List / Chat Commands — same two tabs, different active state between `review-dashboard.html` and `chat-commands.html`).
- Wizard drops the sidebar entirely for a focused, centered 640px column (one decision per page).
- Mobile collapses the sidebar to a hamburger, stacks stat chips into a horizontally-scrollable row, and turns each table row into a stacked card (name/status on top, email + value + thumbnail below, single overflow-menu button instead of two icon buttons).

## Signature visual element

A recurring **certificate-thumbnail motif** (`.cert-thumb`): a small bordered card with an inset hairline "double rule" and a tiny brass seal dot — pure CSS, no illustration. Used at thumbnail size in every review row so the certificate itself, not a logo, is the thing that ties the screens together.

## Component principles

- Real `<button>` / `<a>` / `<input>` + `<label>` everywhere — no `div onClick`.
- Icons are inline stroke SVG, 12–16px, functional only (chevrons, checks, edit/delete, menu) — never decorative illustration, never emoji.
- Visible 2px `--accent` focus ring (`outline: 2px solid var(--accent); outline-offset: 2px`) on every interactive element.
- Transitions: 140–260ms ease, used for hover states and the wizard's progress-bar fill — respects `prefers-reduced-motion` in intent (not yet wired, since these are static mockups).

## Known gaps for implementation

- These are single-state snapshots (e.g. review-dashboard shows buckets already expanded/collapsed as a fixed illustration of the pattern, not a working toggle). The real frontend needs to implement expand/collapse, tab switching, form validation, etc. — see `docs/plan.md` section 4 and 7 for the exact behavioral spec.
- Only one mobile screen exists so far (`mobile/review-dashboard.html`). Login, wizard, and chat-commands haven't been adapted to the phone breakpoint yet.
