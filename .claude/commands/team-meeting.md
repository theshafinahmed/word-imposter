---
description: Have the relevant team members discuss a problem or idea before implementation starts, then produce a synthesized decision. Use for nontrivial or ambiguous work where more than one role's perspective would change the approach.
argument-hint: "<topic, problem, or idea to discuss>"
disable-model-invocation: true
---

## Team meeting: $ARGUMENTS

Run a moderated discussion among the relevant subagents in `.claude/agents/`
before any implementation starts. This happens entirely by calling the
`Agent` tool in sequence — there is no dashboard, server, or background
process involved.

### 1. Pick attendees

Rubaiya (`rubaiya-pm`) always attends and moderates. Invite whichever of the
rest are actually relevant to the topic — don't invite all seven by default:

- `soumi-uiux` — if the topic touches UI, UX, or user-facing flow
- `mithi-frontend` — if it touches client-side implementation
- `bishal-backend` — if it touches server, data, or API design
- `sraboni-qa` — if testability, edge cases, or acceptance criteria are in
  question
- `mahir-reviewer` — if there's a correctness or security risk worth
  weighing before committing to an approach

`ridwan-docs` does not attend live; he logs the outcome afterward (step 4).

### 2. Run the round-robin — post it live, in chat, as it happens

This step is a visible dialogue script, not a silent background process.
Post each line to the user in the main chat response as soon as you get it
— do not batch the whole discussion and reveal it at the end. Format every
turn the same way, on its own line:

```
**<Name> (<role>):** <what they said>
```

e.g. `**Rubaiya (PM):** Here's how I'd frame this...`

1. Call Rubaiya first, with the topic, asking her to frame the problem: what
   needs to be decided, and what questions the other attendees should weigh
   in on. Post her line to chat immediately after the call returns.
2. Call each invited attendee in turn (one `Agent` call per attendee), each
   time passing the full transcript so far and asking them to respond from
   their role's perspective — agree, disagree, or raise a concern, and say
   why. Keep the instruction explicit that responses should be a few
   sentences to a short paragraph, in character, not an essay — this is
   dialogue, not a report. Post each attendee's line to chat right after
   their call returns, before calling the next one, so the user sees the
   conversation unfold turn by turn rather than all at once.
3. If attendees disagree in a way that changes the approach, run a second
   round with just the disagreeing parties plus Rubaiya to resolve it —
   post those lines too, as they happen. Don't loop indefinitely — two
   rounds is the practical ceiling.
4. Close with Rubaiya synthesizing: the decision reached, the reasoning, and
   any open question that only the user can answer. Post this line too, then
   add a short **Decision:** line summarizing the outcome in plain terms
   outside the dialogue format.

### 3. Save the transcript

After the live discussion in chat is complete, write the same dialogue to
`.claude/meetings/<YYYY-MM-DD>-<short-topic-slug>.md` (create the
`meetings/` directory if it doesn't exist), formatted as:

```markdown
# Meeting: <topic>
<date>

**Attendees:** <list>

## Discussion
**Rubaiya:** ...
**<Attendee>:** ...
...

## Decision
<Rubaiya's closing synthesis>

## Open questions
<anything only the user can resolve, or "none">
```

### 4. Log it

Call `ridwan-docs` to add a short entry to `.claude/PROGRESS.md` referencing
the meeting file and the decision reached — not the full transcript.

### 5. Wrap up

The discussion itself was already shown live in step 2, so don't repeat it.
After saving the file and logging with Ridwan, close with a brief pointer to
where the transcript was saved and, if any open questions remain, ask them
directly.
