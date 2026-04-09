# Timberland Regional Library: Anatomy of a Financial Crisis

**[Read the report](https://ecwilsonaz.github.io/trl-crisis-reports/)**

A fiscal analysis of Timberland Regional Library built from public budget documents, 280 board and committee meeting transcripts, peer governance policies, and Washington state library data, covering fiscal years 2017–2026.

By Eric Wilson, a Thurston County resident and TRL patron.

## What This Shows

Thirteen exhibits across two parts, built from public records:

**Part 1: Anatomy of a Financial Crisis (Exhibits A–H)**
- **Exhibit A** — Revenue vs. expenditures: the "scissors" that opened in 2023
- **Exhibit B** — Leadership quotes alongside the financial data from the same period
- **Exhibit C** — Fund balance collapse, breaching the board's own 30% policy threshold
- **Exhibit D** — Where each revenue dollar goes: salaries and benefits from 70¢ to 77¢
- **Exhibit E** — Fewer staff, more money: headcount down 9%, salaries up 46%
- **Exhibit F** — The structural mismatch: per-employee costs outpacing revenue
- **Exhibit G** — The levy rate option never pursued (current rate is less than half the statutory max)
- **Exhibit H** — All 61 layoffs were frontline staff; executive raises were implemented as scheduled

**Part 2: What Went Wrong and What Comes Next (Exhibits I–M)** *(in draft)*
- **Exhibit I** — Where the money went: Service Center salary spending doubled while frontline staff were cut
- **Exhibit J** — TRL vs. peers: fastest per-person salary growth among all comparable systems
- **Exhibit K** — The revenue TRL left on the table: 17 years without a levy attempt
- **Exhibit L** — Why no one caught it: the governance gap
- **Exhibit M** — What the board can do: ten recommended actions

## Sources

All data comes from public records:

- TRL Final Budget documents ([trl.org/budget](https://www.trl.org/budget))
- Board meeting minutes and recordings (280 meetings transcribed, 2012–2026)
- Washington Public Library Statistical Report ([bellinghampubliclibrary.org/wplsr-merged](https://bellinghampubliclibrary.org/wplsr-merged))
- BLS CPI-U data (Seattle-Tacoma-Bellevue)
- Washington Secretary of State election results

All source documents, including WhisperX-generated transcripts of 280 board and committee meetings, are [archived in `/sources`](./sources/).

For full source documentation and methodology, see [`sources/README.md`](./sources/README.md).

## Technical Details

Both pages use Chart.js for interactive charts. Typography: IBM Plex Serif (narrative), Plex Sans (UI/headings), Plex Mono (data). No build tools, no external dependencies beyond Chart.js. Fonts (IBM Plex family) are self-hosted. Just open in a browser or visit the [live site](https://ecwilsonaz.github.io/trl-crisis-reports/).

## Accessibility

Both pages target WCAG 2.1 Level AA conformance.

- Every chart has a screen-reader-accessible data table (`<details>` disclosure) and a descriptive ARIA label
- Timestamp links include screen-reader-only context (meeting type and date)
- All color pairings meet AA contrast ratios in both light and dark themes
- Light/dark mode with `prefers-color-scheme` support
- Chart animations respect `prefers-reduced-motion`
- Skip navigation, semantic HTML, proper heading hierarchy
- No auto-playing media

## License

This work is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You are free to share and adapt it with attribution.

The underlying data is from public records.
