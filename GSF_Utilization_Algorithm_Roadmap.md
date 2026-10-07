# GSF Utilization — Algorithm Roadmap

How Roads Export job-days become GSF Utilization office percentages.

## Goal
Produce (and explain) GU metrics from Roads Export rows for an office/period, plus inventory that Roads does not contain.

## Inputs
1. **Roads Export Copy** — one row per job per Assignment Date, filtered to office + dates  
2. **Physical set count** — how many GSF unit-sets the office owns (e.g. Washington = 6)  
3. **Optional known Utilization %** — for validation only  

## Roadmap

### A. Align grain
REC/OX/MD views are often **one day**. GU is a **multi-day office rollup**. Aggregate all job-days in the period before comparing to GU.

### B. Map columns (identity)
| GU | Roads source |
|----|----------------|
| Offices | Dispatching |
| Total Jobs | Count of job-days |
| GSF Jobs | GSF Job = Yes |
| In Field Sets / People Saved | GSF deployments (GSF Job / GSF AFAD) |
| Flagging / Total Crews | Assignment Count (rules provisional) |
| Sets on Hand | Inventory × weekdays (not in Roads) |

### C. In Field Sets
```
In Field Sets = COUNT(job-days where GSF Job = "Yes")
People Saved  = In Field Sets
```
- Count **sets**, not each `AFD-####` device (often 2 devices = 1 set)  
- Weekend GSF job-days **do** count  

### D. Sets on Hand
```
Sets on Hand = physical_sets × weekday_working_days
```
Weekdays = Mondays–Fridays in the inclusive period. Weekends do not add capacity.

### E. Utilization
```
GSF Utilization % = In Field Sets ÷ Sets on Hand
```
**Validated — Washington Aug 17–23:**  
`14 ÷ (6 × 5) = 14 ÷ 30 = 46.67% → 47%`

### F. Job mix
```
GSF infield set/total jobs % = GSF Jobs ÷ Total Jobs
```

### G. Crew metrics (provisional)
```
Flagging Crews     ≈ SUM(Assignment Count) [excl. Internal Labour?] [/ 2?]
Total Crews        ≈ SUM(Assignment Count) [all jobs] [same unit basis]
Fulfillment %      = In Field Sets ÷ Flagging Crews
Integration %      = Sets on Hand ÷ Flagging Crews
```

### H. Totals
Sum count columns by office → company/grand; **recompute % from sums** (do not average %).

## Generic prediction recipe
1. Filter Roads to office + date range  
2. `Total Jobs = row count`  
3. `GSF Jobs = In Field Sets = People Saved = count(GSF Job=Yes)`  
4. Obtain physical set count `S`  
5. `W = Mon–Fri days in period`  
6. `Sets on Hand = S × W`  
7. `Utilization % = In Field Sets ÷ Sets on Hand`  
8. `Mix % = GSF Jobs ÷ Total Jobs`  
9. Optionally apply crew rules when confirmed  

## Method used to discover this
1. Read GU PDF formulas/footer checks (which columns divide which)  
2. Crosswalk REC ↔ OX ↔ MD ↔ GU columns  
3. Separate single-day sources from multi-day GU  
4. Propose counter candidates (devices vs job-days; ×5 vs ×7; ÷2 crews)  
5. Validate with known office result + inventory (Washington 47% / 6 sets)  
6. Reject near-misses (43%, 33%, 93%, etc.)  

## Solid vs open
**Solid:** Utilization denominator (sets×weekdays); In Field Sets from GSF Job=Yes; Mix %; multi-day grain  
**Open:** Exact Flagging/Total Crews definition; holiday handling; cancellation exclusions  
