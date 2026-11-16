# Security policy

## Supported versions

The default branch of this repository receives security fixes. Older commits, forks
and vendored copies are not maintained; if you are running one, say so in your report
so we can tell you whether the issue still applies to the current tree.

The site is served as static files by GitHub Pages. There is no server component, no
database and no build step. One page loads a third-party script:
`interactive.html` pulls `https://d3js.org/d3.v7.min.js`. That single URL is the whole
external dependency, and it is the most likely vector for injected script on the site;
a report about it (pin, subresource integrity, vendoring) is in scope.

## Reporting a vulnerability

**Please do not open a public issue for a security problem.**

Use GitHub's private vulnerability reporting for this repository:

<https://github.com/myzticalbabe/myzticalbabe.github.io/security/advisories/new>

If that page is unavailable to you, open a minimal public issue that asks for a private
channel and contains *no* details of the vulnerability, and a maintainer will follow up.

A useful report contains:

- the affected commit or branch;
- the smallest reproduction you can manage;
- what an attacker gains — code execution, data disclosure, denial of service,
  escaping a documented boundary;
- any fix or mitigation you already have in mind.

## What to expect

- We aim to acknowledge a report within 7 days.
- We aim to give an assessment (confirmed / not reproducible / by design) within 14 days.
- For a confirmed issue we will agree a disclosure date with you and credit you in the
  advisory unless you prefer otherwise.

This is a small, volunteer-maintained project; those are targets, not a paid support
contract.

## Scope

This repository is an education site. Anything that lets a third party run code they
should not in a visitor's browser, read data they should not, or escape a boundary the
documentation claims, is in scope — including injected script in any file served from
the Pages root. Missing hardening headers on a documentation page, or a dependency
advisory with no reachable path, is usually out of scope — but report it anyway if you
are unsure.
