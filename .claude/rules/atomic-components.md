---
description: Build software Lego-brick style — small, single-purpose components, one file/one job
---

# Build like Lego bricks

Everything we build is made of small, atomic pieces that combine into the
whole — the same way Lego bricks combine into a model. This applies to how
Rubaiya scopes work, how Soumi designs components, and how Mithi/Bishal
implement them.

- **One file, one job.** A file should perform exactly one atomic task. If
  a file is doing two different jobs (e.g. handling data AND rendering UI,
  or validating input AND saving it to a database), split it into two files.
- A component/module should be small enough to describe in one sentence
  without using the word "and" to join two unrelated responsibilities.
- Prefer composing several small, clearly-named pieces over one large piece
  that does everything. The whole feature is the sum of its bricks, not one
  big block carved to look like several.
- This is about genuine separation of responsibility, not artificial
  fragmentation — don't split something into pieces that are never useful
  apart from each other just to satisfy "smaller files." Three lines that
  belong together stay together; two unrelated jobs in one file don't.
- When Rubaiya breaks a task down and when Soumi specs a design, name the
  individual pieces (brick by brick) so Mithi and Bishal know the intended
  boundaries before writing code, rather than discovering the split
  afterward.
