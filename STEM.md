# STEM learning guide — myzticalbabe.github.io

This repository is the live site: a **Brain Explorer Kids** science track for ages 8–13,
an **Azazael Domain Atlas** explorer that turns a JSON corpus into something a person
can walk through, and a **forest index** of the wider project's shards. Everything is
plain HTML, CSS and JavaScript — there is no build step, no package manager and no
framework, which is exactly what makes it a good first subject for a classroom.

This guide is for teachers, mentors, club leaders, parents and students who want to
use this repository as a vehicle for real STEM learning — in particular for girls and
other groups still under-represented in computing, engineering and mathematics. It
says what the project actually teaches, how to run a session with it, and what to
remove so that nobody is excluded by accident.

## What this project teaches

**Subject areas**

- **Web platform engineering** — semantic HTML, CSS layout and custom properties, and
  vanilla JavaScript with no dependencies. Every line is readable by a beginner.
- **Graphs and networks** — nodes, edges, adjacency and traversal, taught through the
  `domain_atlas_*.json` corpus and the atlas explorer that renders it.
- **Data visualisation and science communication** — the real work here is not drawing
  a chart, it is deciding what a viewer should be able to *conclude* from it.
- **Brain science, as a model** — `kids.html` explains neurons, activation and load.
  Say plainly that a brain is not a computer: the analogy is a teaching tool, and the
  differences are part of the lesson.
- **Accessibility as engineering** — a page that a keyboard user cannot operate is a
  page that does not work, not a page with a cosmetic flaw.

**Skills practised**

- Opening a JSON file and answering a question by reading it.
- Editing a CSS custom property and predicting what changes on screen.
- Tracing which function runs when something is clicked.
- Describing what a visualisation shows in one sentence, in words.
- Testing your own work with the keyboard only, before handing it to anyone else.

## Prerequisites

A text editor and a modern browser. To serve the pages locally:

```bash
python -m http.server 8000     # then open http://localhost:8000/kids.html
```

Nothing else is assumed for the entry-level activity below: no prior programming
experience, no particular hardware, and no home internet connection.

## Six practices this repository is set up to support

These follow the published guidance on gender-equitable STEM education — connect the
work to learners' lives, let them investigate real problems, treat struggle as part of
the work, name and challenge stereotypes, make the work collaborative, and put
learners in front of diverse role models.

1. **Connect it to their lives.** The kids track is built on the one thing every
   learner already owns: word associations. "What do you think of when I say *dog*?"
   is data. Show them that the Word Web Adventure is that same question, recorded.
2. **Let them investigate.** Open `domain_atlas_ml.json` in a text editor and ask the
   room to find the most connected node **before** touching the explorer. Then check
   the answer in `interactive.html`. Prediction followed by evidence is the whole
   method.
3. **Make struggle normal.** Build the session so that the first attempt is *expected*
   to fail. Say out loud that debugging is the subject, not a penalty. Ask "what did
   that error tell you?" before offering the answer.
4. **Challenge the stereotype.** Name who does this work and why it is not a gendered
   skill. Praise the method ("you isolated the variable"), not the person ("you're a
   natural") — the second kind of praise teaches learners that ability is fixed.
5. **Make it social.** Run the atlas in pairs: one partner drives with the keyboard
   only, the other narrates what changed and why. Swap at the halfway mark. Nobody
   presents alone.
6. **Show diverse role models.** The **Real Scientists** view in `kids.html` is the
   canonical list — treat it as a starting point, and add a scientist working in your
   own region or language. A learner who sees one person like themselves in the list
   stops treating the field as somebody else's.

## A 90-minute session

| Time | Activity | What the learners do |
| --- | --- | --- |
| 0–10 | Frame it | "This site is a set of pages anyone can read. Today you change one and see it work." No slides. |
| 10–25 | Read the data | Open `domain_atlas_dev.json`. In pairs, list every node you can find and guess which has the most neighbours. Write the guesses down. |
| 25–40 | Check the guess | Load `interactive.html`. Click through the domains. Compare against the written guesses and record which were wrong — being wrong in writing is the point. |
| 40–55 | Play the kids track | `kids.html`, Word Web Adventure and Neuron Lab. Then ask: what is the game measuring, and what is it *not* measuring? |
| 55–75 | Change something | Edit one CSS custom property (a colour, a size) in `kids.html`, reload, describe the effect. Then fix the keyboard navigation for one control that has none. |
| 75–90 | Share | Each pair says one thing that surprised them and one thing they would change. Collect the second list as issues. |

If you have only 45 minutes, run the 10–40 block and stop after the guesses are
checked. Do not skip the guessing: it is the part that teaches the method.

## Vocabulary to define before the session

Specialist vocabulary is a hidden entry test if nobody explains it. Define each of
these the first time it appears, in one sentence, in the learners' own words:

- **node** — one thing in the picture; here, a domain or a word.
- **edge** — a line between two nodes, meaning "these are related".
- **graph** — nodes plus edges. Not a bar chart. Say this out loud; the word is
  overloaded and learners will otherwise picture the wrong thing.
- **adjacent** — directly connected by one edge.
- **JSON** — a text file of labelled data that both a person and a program can read.
- **canvas** — a rectangle a script draws into, pixel by pixel, where the drawing is
  not text and cannot be read aloud.
- **DOM** — the tree of elements a browser builds from the HTML; what JavaScript edits.
- **custom property** — a CSS variable (`--name: value`) set once and reused.
- **screen reader** — software that speaks the page to a blind user; it hears markup,
  not pixels.
- **`aria-live`** — a marker that tells a screen reader "this part changes; announce
  it" — without it, a keyboard user gets silence when the screen updates.

## Accessibility

Read [ACCESSIBILITY.md](ACCESSIBILITY.md) before running a session. Two rules matter
most in a mixed-ability room:

- Every activity must be completable with a keyboard alone, with a visible focus ring.
- Every instruction names the control or the heading ("the **Run** button in the
  toolbar"), never a colour or a position.

Pair learners rather than singling anyone out, and always offer a text-only route for
a visual step. In this repository the visual steps are the atlas and the four canvases
in `kids.html`; for each, read the underlying JSON or the on-screen numbers aloud
before asking anyone to interpret the picture.

## Contributing as a learner

Small, well-scoped contributions are the point, not a consolation prize:

- Browse issues labelled
  [`good first issue`](https://github.com/myzticalbabe/myzticalbabe.github.io/labels/good%20first%20issue).
- Read [CONTRIBUTING.md](CONTRIBUTING.md) — it has a section written for first-time
  contributors.
- Ask in [SUPPORT.md](SUPPORT.md) if anything is unclear. Asking is expected here; it
  is not a failure.

Good first changes in this repository are genuinely small: adding `aria-label` to one
control, adding `prefers-reduced-motion` handling to one animation, or writing the text
alternative for one canvas.

## Licence and classroom reuse

Classroom, club and workshop use is welcome. **This repository does not currently
carry a `LICENSE` file**, so the default "all rights reserved" applies: ask the owner
before redistributing modified copies or publishing derived classroom material. Adding
a licence is the owner's decision, not a maintainer's.
