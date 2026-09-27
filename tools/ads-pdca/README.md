# Internal ads PDCA report

Local report for click-through rate, inquiry rate, close rate, and cost per acquisition. It is not an Astro page, not linked from the landing pages, and not copied into `dist/`.

Generated files go to `tools/ads-pdca/output/` (gitignored, mode `0600`). Do not publish that directory or change the spreadsheet to "anyone with the link".

## Setup

Put these in `.env` (never commit it):

```bash
PDCA_SPREADSHEET_ID=
PDCA_SPREADSHEET_GID=
GOOGLE_SERVICE_ACCOUNT_JSON=
```

Share the spreadsheet with the service account email as Viewer. Enable the Google Sheets API on that Google Cloud project.

## Run

```bash
npm run pdca:report
npm run pdca:report -- --ads ./private/ads.csv --deals ./private/deals.csv
npm run pdca:test
```

The report uses the weekly rules in `docs/google-ads/bidding-rules.md`. Phone and LINE conversions stay "inquiries". Close rate comes from lead rows whose status is a won state, limited to ad sources when a source column exists.

Customer name, phone, email, and address columns are not read.
