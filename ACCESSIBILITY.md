# Accessibility

Accessibility is a condition of this project being usable in a classroom, not a
nice-to-have. This page states what we aim for, what has actually been tested, what we
already know is broken, and how to report a barrier.

## Target

We work toward **WCAG 2.2 Level AA** for anything a person reads or operates. That is a
goal that guides the work; it is not a claim of verified conformance.

## Priorities

- **Keyboard first.** Every interactive element is reachable and operable with a
  keyboard alone, with a visible focus indicator and a logical tab order.
- **Screen reader support.** Content uses semantic structure and a logical heading
  hierarchy so it can be navigated with NVDA, JAWS and VoiceOver.
- **Plain language.** Short sentences, defined terms, descriptive link text, and no
  meaning carried by colour alone.
- **Text before pictures.** A diagram is always accompanied by the same information in
  text, because a screenshot of a user interface cannot be read aloud.

## What has actually been tested

Stated exactly, because "accessible" without a method is a claim, not a measurement:

- All three pages declare `lang="en"` and are served as static files with no build step.
- The pages have been rendered and inspected in Chrome at desktop widths; they contain
  no server-side logic and no tracking scripts. `interactive.html` loads one third-party
  script (D3 v7 from `d3js.org`), which is a dependency worth reviewing and not an
  accessibility feature.
- `kids.html` carries 55 `aria-*` occurrences and 5 `tabindex` declarations, plus a
  `prefers-reduced-motion` block that collapses animation globally, so it has had
  deliberate accessibility work. All four canvases carry `role="img"` and an
  `aria-label`.
- **No NVDA, JAWS or VoiceOver pass has been recorded**, and **no automated audit
  (axe, Lighthouse, Pa11y) has been run and committed**. Until one is, this page should
  be read as "known intent plus known gaps", not as conformance.

## Known barriers

These are measured in the current files, not suspected:

- **`index.html` and `interactive.html` contain no `aria-*` attributes and no
  `tabindex`.** The atlas explorer is therefore not yet proven keyboard-operable, and a
  screen reader gets no state announcements when the selected domain changes.
- **No `aria-live` region anywhere in `kids.html` (0 occurrences).** The word web,
  the neuron spike raster, the thought-path result and the load meter all update
  *after* the user acts, and a screen reader is told nothing. A sighted learner sees
  the answer; a blind learner hears silence and cannot tell whether the click worked.
- **`kids.html` draws into four `<canvas>` elements.** Each has `role="img"` and an
  `aria-label` describing what it shows, which is the right first step — but a canvas
  is pixels, so the label is the *only* text a screen reader gets. Panning, zooming and
  clicking inside a canvas are pointer interactions; there is no keyboard equivalent.
- **Animation is gated globally, not per component.** One blanket
  `prefers-reduced-motion` rule sets every animation and transition to ~0 ms. That is
  safe, but it also means a reduced-motion user loses the informative motion (the spike
  raster) rather than getting a static equivalent.
- **Emoji are used as section labels** in the kids track ("🕸️ Word Web Adventure").
  The emoji sits inside the heading, so it is read aloud as a symbol name before the
  words; each needs a text equivalent or `aria-hidden`.

## Reporting a barrier

Open an issue at <https://github.com/myzticalbabe/myzticalbabe.github.io/issues/new> and include:

- your operating system and browser version;
- the assistive technology you were using, if any;
- the page (`index.html`, `interactive.html`, `kids.html`) and the step you were on,
  and what you expected instead;
- whether the barrier blocks the task or only slows it down.

An accessibility issue is not a cosmetic issue. If a keyboard trap blocks a workflow,
we treat that with the same priority as a crash.

## For contributors

- A change to any interface must be operable by keyboard before it is merged.
- New images, diagrams and canvases need a text alternative.
- Do not use colour alone to convey state.
- If you add animation, gate it behind `prefers-reduced-motion`.
- Do not "fix" an accessibility report by removing the feature.
