# Source Documents

Primary source files for [TRL Crisis Report](https://ecwilsonaz.github.io/trl-crisis-reports/) Parts 1 and 2. Every claim in the report is derived from these public records. Archived March 2026.

## TRL Final Budget Documents

Location: [`trl-budgets/`](./trl-budgets/)

These are the primary source for nearly every number in both parts: salary data, FTE counts, fund balances, revenue, expenditures, and levy rates. Each annual budget includes audited actuals for 2-3 prior years, allowing cross-referencing across documents.

| File | Originally from | Key data |
|------|----------------|----------|
| `2012-Final-Budget.pdf` | archive.org | ED message (Crose). Pre-Heywood. |
| `2013-Final-Budget.pdf` | archive.org | ED message (Culp, Acting). "Aggressively managing expenditures is not a long-term strategy." |
| `2014-Final-Budget.pdf` | archive.org | First budget under Heywood. "Structural problems persist." |
| `2015-Final-Budget.pdf` | archive.org | "Long-term problems persist." |
| `2017-Preliminary-Budget.pdf` | archive.org | Preliminary only (final not available). Boilerplate ED message. |
| `2018-Final-Budget.pdf` | archive.org | First budget with Lowell as Finance Director. Levy rate: $0.38. |
| `2019-Final-Budget.pdf` | trl.org | 2016-2017 actuals, 2018 estimate, 2019 budget. "Not sustainable in the long term." Levy rate: $0.38. |
| `2020-Final-Budget.pdf` | trl.org | Hiring freeze, comp study. Levy rate: $0.36. |
| `2021-Final-Budget.pdf` | trl.org | "Expenditures continuing to outpace revenues." Levy rate: $0.340468. |
| `2022-Final-Budget.pdf` | trl.org | Same language as 2021. Levy rate: $0.323658. |
| `2023-Final-Budget.pdf` | trl.org | "Does not keep pace." Levy rate: $0.287998. |
| `2024-Final-Budget.pdf` | trl.org | Sustainability language dropped. Levy rate: $0.236007. |
| `2025-Final-Budget.pdf` | trl.org | Silent on revenue gap. Levy rate: $0.234024. |
| `2026-Final-Budget.pdf` | [trl.org](https://trl.org/wp-content/uploads/sites/140/2025/12/2026-Final-Budget.pdf) | Silent on $3.8M deficit. Levy rate as printed: $0.228924 (preliminary estimate; certified rate is $0.224404 per Res. 25-004). Position Inventory with admin salary increases (pp.18-22). |
| `Resolution 25-001 2025 Budget Adjustment.pdf` | TRL Board meeting, Feb 26, 2025 | Amends 2025 budget. Exhibit A reports 2024 actual fund balances (used in Exhibit C). |
| `Resolution 26-001 2026 Budget Adjustment.pdf` | TRL Board meeting, Feb 25, 2026 | Amends 2026 budget. Exhibit A reports 2025 actual fund balances (used in Exhibit C). |
| `Resolution 24-004 The 2025 Tax Levy Amount and Rate.pdf` | TRL Board meeting, Dec 18, 2024 | Certifies 2025 collection levy rate at $0.228924/1000. Used in Exhibit G. |
| `Resolution 25-004 The 2026 Tax Levy Amount and Rate.pdf` | TRL Board meeting, Dec 30, 2025 | Certifies 2026 collection levy rate at $0.224404/1000. Used in Exhibit G. |

### How Exhibit A expenditure data was sourced

Exhibit A uses the "Total Expenditures" line from the General Fund Expenditures detail tables in each Final Budget, with one adjustment: the 2020 figure excludes a $5.6M one-time transfer to the Building Fund for the Mountain View library build. This transfer would create a misleading spike on the revenue-vs-expenditures chart; the building spend is covered separately in Exhibit D. Routine annual transfers ($218K–$593K) are included in all other years for consistency with TRL's own Budget in a Page totals, including the $3.8M 2026 deficit figure.

Revenue data for both Exhibits A and C uses the same series from the 2026 Final Budget (the most current source): 2017–2024 actuals, 2025 year-end estimate, 2026 budget.

### How salary data was cross-referenced (Exhibit I)

For each year 2017-2024, the "Actual" column from the earliest subsequent budget document was used. Example: the 2021 salary actual comes from the 2023 Final Budget (which labels it "2021 Actual"), not from the 2021 Final Budget (which only has the 2021 adopted budget). Only 2025 (year-end estimate) and 2026 (adopted budget) are non-actual figures.

The six Service Center departments tracked are: Administration, Finance, Human Resources, Information Technology, Creative Services, and Facilities+Courier. These are the departments excluded from AFSCME bargaining unit coverage (except Courier staff, who are represented).

## Washington State Data

Location: [`state-data/`](./state-data/)

| File | Source | Key data |
|------|--------|----------|
| `Merged_WPLSR_data_2024.xlsx` | [Bellingham Public Library](https://bellinghampubliclibrary.org/wplsr-merged) | Washington Public Library Statistical Report, merged 2002-2024. Salary/FTE, expenditures, circulation, population for all WA library systems. Updated March 24, 2026. |
| `2024-WPLSR-report.pdf` | [WA Secretary of State](https://www.sos.wa.gov/sites/default/files/2025-09/2024stats.pdf) | Full 2024 Washington Public Library Statistical Report (September 2025). Table 11: TRL physical circ 2,678,605 + electronic 2,563,949 = 5,242,554 total. Glossary confirms "Total Circulation" = physical + electronic materials. |
| `2009_Election_Results_All_Counties.xlsx` | WA Secretary of State | County-by-county results for TRL's 2009 levy lid lift attempt. Mason 55.4% yes, Pacific 51.8%, Thurston 46.5%, Grays Harbor 44.3%, Lewis 29.2%. District-wide: 45.1% (failed). |
| `DOR_Levy_Detail_Pt2_YYYY.xlsx` (2012–2025) | [WA Dept. of Revenue](https://dor.wa.gov/property-tax-statistics) | Junior taxing district levy detail by county: assessed valuation, levy rate, and levy amount for Timberland Inter-Co Library (5 county entries per year). Used to compute foregone revenue in Exhibit K levy rate erosion table. |

### How peer comparison was computed (Exhibit J)

Salary per FTE = Total Salary Expenditures / Total FTE for each system and year, from the WPLSR merged dataset. The seven comparison systems: TRL, Fort Vancouver Regional, Kitsap Regional, Pierce County, Sno-Isle, Whatcom County, King County (KCLS, included for scale reference).

## BLS CPI Data

Location: [`bls/`](./bls/)

| File | Source | Key data |
|------|--------|----------|
| `seattle-cpi-u-CUUSA423SA0.csv` | [BLS](https://data.bls.gov/timeseries/CUUSA423SA0) | Seattle-Tacoma-Bellevue CPI-U, semiannual averages. Used for the CPI-adjusted baseline in Exhibit I. 2026 estimated at 3.5% YoY. |

### How the CPI baseline was computed (Exhibit I)

The 2017 Service Center salary total ($2,170,828) is grown at the annual CPI-U rate for each subsequent year: `baseline[year] = baseline[year-1] * (1 + annual_cpi_change)`. The gap between actual spending and this CPI-adjusted baseline is the annual difference shown in the trajectory chart.

## IMLS Public Libraries Survey

Location: [`imls/`](./imls/)

National public library data from the Institute of Museum and Library Services [Public Libraries Survey](https://www.imls.gov/research-evaluation/surveys/public-libraries-survey-pls). The PLS is a national census of approximately 9,000 U.S. public library systems, collected annually since 1988. IMLS circulation definitions (TOTCIR = PHYSCIR + ELMATCIR) match the WPLSR's "Total Circulation" formula (physical + electronic materials).

| File | Source | Key data |
|------|--------|----------|
| `fy19-pls-results.pdf` | [IMLS](https://www.imls.gov/publications/characteristics-public-libraries-united-states-results-fy-2019-public-libraries-survey) | FY2019 national summary (Table S1): 6.9 circ/person (physical 5.8 + electronic 1.1), $41.90 operating expenditure/person. Last pre-pandemic baseline. |
| `PLS-FY-2023-Data-Documentation-508.pdf` | [IMLS](https://www.imls.gov/sites/default/files/2025-08/PLS-FY-2023-Data-Documentation-508.pdf) | FY2023 data documentation with field definitions. |
| `PLS-FY-2022-Data-Documentation.pdf` | [IMLS](https://www.imls.gov/sites/default/files/2024-06/2022_pls_data_file_documentation.pdf) | FY2022 data documentation. |
| `imls-fy2023-bulletin.html` | [IMLS](https://content.govdelivery.com/accounts/USIMLS/bulletins/3f09e4a) | FY2023 per-capita circulation: physical 4.37 + electronic 1.68 per person (released August 2025). |

## Mason County BOCC Briefing Minutes

Location: [`bocc-briefings/`](./bocc-briefings/)

Mason County Board of County Commissioners briefing minutes documenting the intercounty standoff over TRL Board of Trustees appointments. Downloaded from the [Mason County Document Management System](https://masoncountywa.gov/commissioners/meeting-minutes.php).

| File | Date | Key content |
|------|------|-------------|
| `2025_07_21 - Mason County BOCC Briefing.pdf` | Jul 21, 2025 | Commissioner Trask withholds concurrence on Thurston County's appointment of Susan Hettinger until Thurston approves Mason County's appointee. Standoff begins. |
| `2025_08_04 - Mason County BOCC Briefing.pdf` | Aug 4, 2025 | Commissioner Tarzwell tables the concurrence, says he will reach out to Thurston County for additional information. Last action taken on the matter. |

## SAO Audit Documents

Location: [`sao-audits/`](./sao-audits/)

| File | Source | Key data |
|------|--------|----------|
| `2023-02-28_SAO-Management-Letter_2019-2021.pdf` | [WA State Auditor's Office](https://portal.sao.wa.gov/ReportSearch) (ML1032149) | Management letter covering Jan 2019–Dec 2021 audit period. Three findings: (1) Public works procurement violations — no competitive bidding procedures, no contractor records, no prevailing wage compliance (RCW 39.04.155); (2) City-owned property improvements — $41,672 flooring project and $21,672 restroom renovation exceeded $10,000 policy cap and lacked formal city requests; (3) Loss of public funds — $120,968 lost to cyberfraud in 2020, inadequate controls led to second $2,675 loss in 2022. |
| `2024-12-19_SAO-Accountability-Audit_2023_Report-1036255.pdf` | [WA State Auditor's Office](https://portal.sao.wa.gov/ReportSearch/Home/ViewReportFile?arn=1036255&isFinding=false&sp=false) (Report No. 1036255) | Follow-up accountability audit covering Jan–Dec 2023, published Dec 19, 2024. Re-examined procurement (public works), accounts payable (credit cards and EFTs), financial condition, and other areas. Result: compliance in all material respects. Confirms management letter findings were addressed. |

## Expense Reports

Location: [`expense-reports/`](./expense-reports/)

| File | Source | Key data |
|------|--------|----------|
| `2026-01-expense-approval-report.pdf` | TRL Board of Trustees February 25, 2026 meeting packet | Line-item expenditures for January 2026. Referenced in Exhibit L audit rationale. |

## Recordings

Board meeting recordings are public records available from TRL via [AV CaptureAll](https://media.avcaptureall.cloud/?customerGuid=88902c35-d211-42b4-8f18-59c7f3e44078&target=foo&view=thumbs&tabs=past%7Ctoday%7Cupcoming). 280 meetings from 2012 through March 2026 were transcribed. Quotes were initially transcribed using WhisperX automated speech recognition, then verified by the author against the original audio. Timestamps in the report reference specific moments for independent verification.

Full recordings are too large for GitHub hosting. Available from TRL as public records. The following meetings are referenced in Parts 1 and 2 and are available on YouTube (unlisted):

| Date | Meeting | YouTube |
|------|---------|---------|
| Nov 16, 2016 | Board meeting | [youtu.be/7JMwT2AYjvk](https://youtu.be/7JMwT2AYjvk) |
| Oct 24, 2018 | Board meeting | [youtu.be/8vKWHDU-K3c](https://youtu.be/8vKWHDU-K3c) |
| Dec 19, 2018 | Board meeting | [youtu.be/lfHr7Hdf8kw](https://youtu.be/lfHr7Hdf8kw) |
| Dec 18, 2019 | Board meeting | [youtu.be/_L4Dd4HmY4Y](https://youtu.be/_L4Dd4HmY4Y) |
| Feb 26, 2020 | Board meeting | [youtu.be/1tEmCZEpQlQ](https://youtu.be/1tEmCZEpQlQ) |
| Mar 25, 2020 | Board meeting | [youtu.be/c-CeaOWe6is](https://youtu.be/c-CeaOWe6is) |
| Nov 18, 2020 | Board meeting | [youtu.be/wRjpQeCrTO4](https://youtu.be/wRjpQeCrTO4) |
| Jul 27, 2021 | Executive committee | [youtu.be/X5zfPTDDgKA](https://youtu.be/X5zfPTDDgKA) |
| Nov 17, 2021 | Budget hearing | [youtu.be/L_a8Ubv0xl0](https://youtu.be/L_a8Ubv0xl0) |
| Nov 17, 2025 | Budget committee working session | [youtu.be/x948JaMAi14](https://youtu.be/x948JaMAi14) |
| Dec 22, 2021 | Board meeting | [youtu.be/_eBV94cp1U4](https://youtu.be/_eBV94cp1U4) |
| Apr 21, 2022 | Facilities committee | [youtu.be/bzdhqfjaU6M](https://youtu.be/bzdhqfjaU6M) |
| May 25, 2022 | Board meeting | [youtu.be/LZcvjXH6tHI](https://youtu.be/LZcvjXH6tHI) |
| Jun 22, 2022 | Board meeting | [youtu.be/h4R5TqOFviM](https://youtu.be/h4R5TqOFviM) |
| Nov 15, 2023 | Budget hearing | [youtu.be/fCDAW3HWQ6Y](https://youtu.be/fCDAW3HWQ6Y) |
| Aug 28, 2024 | Board meeting | [youtu.be/2gCu5hWJeVw](https://youtu.be/2gCu5hWJeVw) |
| Sep 25, 2024 | Board meeting | [youtu.be/p1ZufC6GoN4](https://youtu.be/p1ZufC6GoN4) |
| Dec 18, 2024 | Board meeting | [youtu.be/983UXhHdA7Y](https://youtu.be/983UXhHdA7Y) |
| Jan 22, 2025 | Board meeting | [youtu.be/yOEPYXGGc4M](https://youtu.be/yOEPYXGGc4M) |
| Feb 13, 2025 | Policy committee | [youtu.be/HLza58LqJFM](https://youtu.be/HLza58LqJFM) |
| Jun 25, 2025 | Board meeting | [youtu.be/alYjlW8HVDs](https://youtu.be/alYjlW8HVDs) |
| Oct 22, 2025 | Board meeting | [youtu.be/zEUTyWYvAiI](https://youtu.be/zEUTyWYvAiI) |
| Nov 19, 2025 | Board meeting | [youtu.be/wrq56W_EcB0](https://youtu.be/wrq56W_EcB0) |
| Jan 28, 2026 | Board meeting | [youtu.be/hDdxrcgOLKE](https://youtu.be/hDdxrcgOLKE) |
| Feb 10, 2026 | Board special meeting | [youtu.be/bpfbzUAVVB8](https://youtu.be/bpfbzUAVVB8) |
| Feb 25, 2026 | Board meeting | [youtu.be/LXNUnowSbTk](https://youtu.be/LXNUnowSbTk) |
| Mar 18, 2026 | Special board meeting | [youtu.be/Mj1vkjeuWk0](https://youtu.be/Mj1vkjeuWk0) |
| Mar 25, 2026 | Board meeting | [youtu.be/4PYxDYoFCuE](https://youtu.be/4PYxDYoFCuE) |

## Transcripts

Location: [`transcripts/`](./transcripts/)

WhisperX-generated transcripts with speaker diarization for 280 board and committee meetings (2012–2026). These are useful for searching but are not verbatim — any quote appearing in the report was manually verified against the original recording. See [`transcripts/README.md`](./transcripts/README.md) for details.

## What is NOT included here

- **News articles.** Copyrighted content from Chinook Observer, The Daily Chronicle, HeraldNet, Lynnwood Times, etc. is linked, not rehosted.
- **Full meeting recordings.** Too large for GitHub. The 24 meetings cited in the report are linked to YouTube above; the full archive of 280 meetings is available from TRL via [AV CaptureAll](https://media.avcaptureall.cloud/?customerGuid=88902c35-d211-42b4-8f18-59c7f3e44078&target=foo&view=thumbs&tabs=past%7Ctoday%7Cupcoming).

## Version

Sources archived March 2026. The Bellingham WPLSR dataset, BLS CPI data, and TRL budget documents may be updated in future years; the versions hosted here are the ones used in this report.
