# Internal chatbot knowledge

Aggregates car model, soil type, price, and prefecture from the private order workbook so a chatbot can answer with the patterns that actually show up. This is not an Astro page, it is not imported by the site, and it is not copied into `dist/`.

Generated JSON goes to `tools/chatbot-knowledge/output/` (gitignored, mode `0600`). Do not publish that directory, do not paste it into a landing page, and do not commit it.

## What is stored

- Normalized model, vehicle class, soil type, job scope, service line
- Price median and quartiles only when at least 3 jobs share the bucket
- Prefecture counts
- Short answer guides built from those labels and the internal rate card

## What is never stored

Customer name, phone, email, postal code, street address, building name, and free-text notes. The reader drops those columns before classification. Notes are scanned for keywords (vomit, insurance, ozone) and then discarded. Partner sheets `加盟一覧` and `集計一覧` are skipped because they are contact directories. `2609集計用` is a working copy of `2609` and is skipped so jobs are not counted twice.

## Run

```bash
python3 ./tools/chatbot-knowledge/test_classify.py
python3 ./tools/chatbot-knowledge/classify_orders.py --xlsx /path/to/private.xlsx
```

The workbook stays outside the repo. Pass `--out` only for another path under this tool's `output/` directory. The writer refuses `src/`, `public/`, and `dist/`.

## Dialogflow / Vertex embed

`dialogflow-playbook.ja.md` is the text to paste into a Conversational Agents playbook. It uses the public site price list plus the question order learned from the aggregates. Do not upload the workbook or `output/knowledge.json` to Google Cloud.

The site shows the chat bubble only when `src/data/chatWidget.ts` has a valid `projectId` and `agentId` (or the same values are passed as non-empty `PUBLIC_DIALOGFLOW_*` build variables). Cloudflare's Build variables and secrets panel is optional and often missing from the dashboard; do not require it. The dashboard block 「ランタイム変数とシークレット」 does not change the already built HTML. Those IDs are not secret keys. Do not put a service-account JSON or an API key in `PUBLIC_*` variables or in `chatWidget.ts`.
