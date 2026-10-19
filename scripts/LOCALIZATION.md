# Korean and English content

- `public/app.js` is the shared application source (Korean UI text and bilingual `tr` calls).
- `scripts/ui-translations.json` defines English equivalents for legacy UI strings.
- Run `node scripts/build-i18n.cjs` after editing the application source. This generates `public/app-ko.js` and `public/app-en.js`.
- `content/ko` and `content/en` contain the full question banks: 775 questions across nine courses. Run `node scripts/build-data.cjs` to generate `public/data.js` and `public/data-en.js` with the same schema.
- Question types, item IDs and grading keys intentionally keep their original internal values in both languages. `typeLabel` and `itemLabel` localize their display only.
- Run `node scripts/validate-content.cjs` before publishing. It rejects untranslated content, lost reference links and changed grading data.
- `public/language.js` selects the locale from `?lang=ko|en`, the saved preference, or the browser language. Language changes transfer mode, sampled questions, choice order, answers, and deadline through session storage.
- The report cache is scoped to the page language; image saving and sharing use the same cached report asset.

## Exams and publication

- Demo exams randomly sample 10 questions without replacement from the entire bank.
- Full exams randomly sample the guide count: ALF/WFA 60; ADA/SDA/SES/AGS/MOS 65; AEP/SDP 75. Guide durations and pass marks apply. Demo duration is proportional to the guide's per-question time, rounded up to minutes.
- Choices are shuffled with stable grading IDs. Explicit `{{option:A}}` references in translated explanations and option bodies resolve to the attempt's displayed label. Korean ordering IDs remain internal; English displays numeric labels.
- After data/UI generation and validation, run `node scripts/build-worker.cjs`. It embeds approved static assets and server grading metadata into `dist/server/index.js` and copies the hosting manifest.
- `worker/index.js` serves static assets and result-specific share pages. `POST /api/share` validates and grades the attempt, then saves the same 1200×630 PNG used by download/SNS into the `BUCKET` R2 binding with public result metadata. It does not retain submitted answers in the saved report metadata.
- Only a passing full exam uses certification-earned wording. Demo and failing results use participation wording in both languages. LinkedIn opens its share composer with the public `/share/<id>` URL; OG metadata points to that exact saved PNG. No LinkedIn post is sent automatically.
- Publish the built Worker through Sites; the source manifest declares its R2 binding. No credentials belong in source or build output.

- Regression checks: run `node scripts/verify-exams.cjs` after generating data/UI, then `node scripts/verify-sharing.cjs` after building the Worker.

- Full exams use a three-step registration flow: select exam, enter a 1–40 character display name, then review and begin. The timer starts only after confirmation. The name travels with the attempt and appears on results and shared report images. Demo attempts remain anonymous. Shared names are escaped and length-validated server-side.

- New attempts use difficulty-v1 scoring: L1/L2/L3/L4 earn 1/2/3/4 points, normalized to 100. Pass/fail compares unrounded weighted points. Domain performance and report images use the same weights; correct-answer counts remain separate. Existing equal-weight share records remain unchanged. Exam screens hide titles, domains and difficulty; review shows domain and points. Run node scripts/verify-weighted.cjs for grading and client/server consistency checks.
