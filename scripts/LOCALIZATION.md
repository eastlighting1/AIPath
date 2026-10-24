# Korean and English content

## Learning content

- Korean authored curricula remain the source of truth. `content/learning/english/memory.jsonl` stores English drafts keyed by exact Korean text; `overrides.json` holds editorial corrections, terminology, and adapted teaching examples.
- `build-learning.cjs` generates Korean lessons first, then `build-learning-english.cjs` generates matching English files in `public/learning/en`. A missing translation fails the build; visitors never call a translation service.
- Lesson IDs, completion records, quiz answer indices and navigation sections are shared across languages. Both language files use content hashes for selective cache invalidation.
- Code syntax and line structure stay intact. Translate comments and display strings, not identifiers. English teaching examples must preserve the distinction tested by their quiz; literal word-for-word translation is insufficient for case-sensitive labels and character-count exercises.
- Inline glossary terms are protected while translating their paragraphs, then restored with matching English labels so term interactions keep working.
- Validate with `verify-learning-english.cjs`, `verify-english-code.py`, `verify-learning.cjs`, and `verify-learning-cache.cjs`. These check content structure, language coverage, answer keys, code structure, glossary binding and localized asset delivery. They do not replace editorial review of meaning.
- Initial drafts use Google Translate and locally run Qwen3-4B-Instruct-2507, followed by automated checks and targeted editorial corrections. No audit documents or private reference lists are sent to translation services or added to public lesson files.

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
