# SPECORY

Learn the source. Prove the skill.

- Live application: https://aipath.dongle.chatgpt.site
- GitHub Pages entry: https://eastlighting1.github.io/AIPath/
- Synced from Sites v104, source commit `c7ee3549241e4af8edcfcee1b8ea197dfa19539f`.

## Included

12 certification paths, 1,300 exam questions, 27 learning paths and 358 bilingual lessons. This snapshot includes SPECORY branding and badges, continuous lessons, progress restoration, server-side exam grading, completion artwork, sharing, and dismissible resume reminders.

## Hosting

The application requires a Cloudflare-compatible Worker and an R2 bucket named `BUCKET` for exam attempts and result sharing. GitHub Pages cannot run that backend. Its workflow therefore publishes a small gateway to the live application, preserving the path, language, query and fragment. It does not publish a second client-side answer bank or a broken static copy.

Progress stored on the old GitHub Pages origin does not automatically transfer to the live origin. Old fragment-based result links are not supported by the server-based result flow.

## Development

Use Node.js 22. To build locally, create an untracked `.openai/hosting.json` with your deployment project's configuration (the live site's identity and access configuration are not included here), then run:

```sh
node scripts/build-learning.cjs
node scripts/build-worker.cjs
node scripts/verify-shell.mjs
node scripts/verify-secure-exam.mjs
node scripts/preview-secure.mjs
```

The preview serves at http://127.0.0.1:4327. `dist/` is generated output. A production deployment needs the runtime R2 binding; the preview uses an in-memory test bucket.

For the GitHub Pages gateway:

```sh
node scripts/build-pages.cjs
```

`public/` contains frontend sources and generated content; `content/` contains editable curriculum and question sources; `scripts/` contains builders and checks; `worker/` contains the server. Some source files contain answer keys for maintainers; production routes restrict access to exam answers. This public source repository is not a confidential examination bank. Internal review reports and reference-audit documents are excluded.

## Synchronization

This is a snapshot of the deployed Sites source. Publishing in Sites does not automatically push to GitHub. The GitHub Pages workflow updates the gateway when `main` changes; it does not deploy the Worker application.

## License

The existing MIT LICENSE is retained. Third-party materials retain their own terms, including Inter and Pretendard licenses in `public/fonts/`.
