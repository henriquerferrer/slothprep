# slothprep

Interview practice studio, built on [career-ops](https://github.com/career-ops-hq/career-ops).

It reads your career-ops folder and adds the practice side: a story bank with
coverage per competency, a prep page per company, timed multi-level coding
drills with hidden tests, and mock interviews that are scored and bring your
weak spots back on a schedule. It runs locally; your data stays in your
career-ops folder and nothing is sent anywhere except through your own Claude
Code.

Status: early. See `ROADMAP.md`.

## Run

```bash
pnpm install
cp .env.example .env   # set CAREER_OPS_DIR to your career-ops checkout
pnpm dev               # http://localhost:3100
```

## License

MIT. Not affiliated with career-ops.
