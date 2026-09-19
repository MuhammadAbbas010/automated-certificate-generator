# Certificate Automation Bot — Working Spec v2

*Compiled from the initial planning conversation. Platform decision, template
format, and folder layout are locked in; everything else reflects decisions
made so far and can still be revised as implementation proceeds.*

## 0. Platform Decision
**Website, not desktop app.**
- The replay/scheduling logic is server-side and must keep re-checking the
  Sheet every 4+ hours for up to a week even when the teacher isn't at her
  computer — that requires an always-on backend regardless of desktop vs.
  web, so a desktop app would only add an install step without removing the
  need for a server.
- Google API access (Sheets, Forms, Gmail) needs OAuth consent-screen
  verification either way.
- A website avoids the code-signing/SmartScreen warning problem (no signing
  license currently) and needs no per-machine reinstall for updates.
- Not permanently ruled out — desktop could make sense later if a fully
  offline mode is ever wanted, but nothing currently in scope needs it.

## 1. Certificate Template
- **Format: Google Slides.** Most API-editable option (text/font/layout all
  read/writable via the Slides API), and the only format that cleanly
  supports the font-metadata editor below. Avoids the fragility of
  image-based overlay (font-matching, positioning).
- One draft certificate per cert type; app duplicates it per student and
  swaps in the name.
- **Name handling**: first-name field may contain spaces (covers middle
  names) — treated as one string, never split.
- **Course name / date**: not auto-detected (no reliable way to infer from a
  form) — surfaced as a `(!)` reminder to the teacher during initialization
  instead.
- **Font/style metadata editor**: pulls font family, size, and style flags
  (bold/italic/spacing) from the Slides template into a separate metadata
  file; shown at initialization as a small panel with dropdowns so the
  teacher can tweak it (e.g. turn off bold) without opening Slides directly.

## 2. Google Sheet + Form Auto-Linking
- **One Sheet+Form pair per certificate** — fully isolated data source per
  cert type.
- **Duplicate submissions**: verify it's the same student first (match on
  email, ideally name too), then keep only the latest entry and drop the
  earlier one.
- **Status column** added to the Sheet so the app never has to guess who's
  already been processed (color scheme below).
- **Replayability**: not one-shot. Teacher sets a run window (< 1 week) and
  a check interval (≥ 4 hours) at initialization; the app re-checks the
  Sheet on that schedule to catch late submissions, then stops. Manual
  "resend / re-check now" button included for on-demand runs.
- **Auto-send vs. manual approval**: presented as two explicit, side-by-side
  options the teacher must choose between at initialization.

## 3. Qualification / "Positive Statement" Check
- The LLM (section 4) picks the qualifying column and candidate positive
  values — not hardcoded to one column named "work."
- **Status color-coding**, shown on student name in the review list and
  written back to a Sheet column:
  - `#e64d39` — did not qualify
  - `#dbdb44` — pending / not yet reviewed or sent
  - `#57e31b` — accepted and already sent

## 4. LLM-Assisted Column Detection & Initialization Wizard UX
- App sends the LLM all column names from the Sheet; LLM returns its best
  guess for the qualifying column plus 5–10 likely positive values.
- Teacher confirms/edits this guess rather than it being an automatic gate
  (avoids silent misclassification).
- Result is **cached per certificate** — not re-queried every run.

**Wizard UX** (this needed real design substance, not just restating the idea):
- **Multi-page wizard**, not one long form: template/font → data source
  confirmation → qualification rules → email setup → scheduling. One
  focused decision per page.
- **Progress bar starts around 10–20%, not 0%** — "endowed progress" effect;
  people finish things that already show partial credit more often than
  things that start empty.
- **Mascot** that moves along the progress bar on page transitions — delight
  layer, not functional; respects `prefers-reduced-motion`.
- **Placeholder example values** in every input (e.g. greyed-out "e.g.
  yes/done/y") — concrete examples cut input errors more than a label alone.
- **Auto-scroll to the next section** (not page) on completion — reversible/
  interruptible, a brief pause/animation cue rather than an instant jump.
- **Inline validation as you type**, not just on submit.
- **Autosave/draft state** — closing the tab mid-wizard shouldn't lose
  progress.

## 5. Login / Authentication & Avatars
- Basic login: **username + avatar selection + email, no password** at this
  stage.
- Avatars: Windows XP-style, **recreated as SVGs** — original XP avatar art
  is Microsoft's IP, so "recreated" only avoids infringement if genuinely
  redrawn, not traced/recolored. A generic retro-avatar set inspired by that
  era is the safer fallback if this becomes a concern later.
- User info stored in its **own JSON file**, separate from certificate/
  student data.

## 6. Emailing as the Teacher
- **Gmail API, `gmail.send` scope only** via OAuth — no password storage, no
  full-mailbox access.
- **Org email format detection**: teacher inputs the pattern directly, or
  the app infers it by scanning existing addresses on record and flags/
  auto-corrects mismatches. Given the risk of "correcting" to the wrong
  inbox, corrected addresses should be shown to the teacher for confirmation
  rather than applied silently, at least initially.
- Quota: not addressed yet — fine at current scale.

## 7. Delay / Timer / Review List Flow
- **Server-side timer**, set per-certificate at initialization (teacher can
  choose a delay, or "no timer" — in which case the clock icon reads
  something like "Sending once you're done").
- Review list: every cert shown with edit/delete icons, an **"Approve All"**
  button bottom-right.
- **Editing a row does not pause the timer.** A `checked/approved` flag per
  student decides inclusion instead: unchecked rows don't send this batch
  and roll into the next scheduled run; "Approve All" sends everyone
  checked/qualified.
- **"Just Arrived" aging buckets** (Downloads-folder style): new submissions
  land in "Just Arrived," then age into buckets like "Last 6 Hours,"
  "Yesterday," "Last Week."

## 8. Chat-Command Tab
- Second tab in the verification stage, chat-UI style, with commands like
  `/send-all`, `/add-time(1)`.
- `/help` command; confirmation step before destructive commands
  (`/send-all`); audit trail if more than one person has access.
- Kept in its own file for easy editing. Login/avatars (section 5) built
  first; this comes after.

## 9. Email Templates & Error Handling
- 3–5 pre-made templates the teacher can choose from (or supply her own),
  with merge fields (name, course, date, etc.). No cert templates — only
  email templates.
- **Non-qualification email**: AI-generated, with a merge field for the
  *specific* reason the student didn't qualify — not a generic rejection.
- **Delivery-failure / non-send reasons**, each surfaced to the student with
  the teacher's email linked (pulled from her login/profile JSON):
  - Invalid/undeliverable email address
  - Didn't meet qualifying criteria
  - Manually removed from the list by the teacher — distinct message, asks
    them to contact the teacher for the reason
  - Unknown — generic fallback asking them to email the teacher directly

## 10. Resolved Gaps
- **Preview/test-send**: auto-generate one certificate with dummy data
  ("Jordan A. Sample") and show it in the wizard before any real batch — no
  email sent. Optional "send a test copy to my own email" button.
- **Send history & resend**: no separate history DB — the Sheet's status +
  timestamp columns *are* the record. The manual resend button doubles as
  the "I lost my certificate" fix.
- **Data privacy**: student PII stays in the teacher's own Google Sheet,
  never in an app-run database. Backend stays as stateless as possible
  (caches only non-personal operational data — last-processed row pointer,
  cached LLM guess). Sidesteps most FERPA/GDPR retention concerns by design.
- **Failure isolation**: each student's cert generation/send wrapped in its
  own try/catch — one failure marks that row with a specific error and
  moves on, never stops the batch.
- **Scale**: soft cap of a few hundred rows with pagination on the review
  list; throttle sends to stay under Gmail's daily quota. Revisit if class
  sizes grow — not over-built for now.

## 11. Project Organization

```
/backend    -> scheduling, Sheets/Forms/Gmail API calls, LLM integration
/frontend   -> wizard, review list, chat tab
/templates  -> email templates, cert template refs
/config     -> per-certificate settings, cached LLM results, font metadata
/users      -> login/profile JSON storage
/docs       -> this spec, decisions log
```

## Status
No code written yet. Next step: scaffold the folder structure above and
start a first pass at the initialization wizard.
