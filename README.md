# AIPath

AI certification practice platform, with Korean and English question banks.

- Website: https://eastlighting1.github.io/AIPath/
- About: https://eastlighting1.github.io/AIPath/about/
- Review, search, analysis and responsive preview: https://eastlighting1.github.io/AIPath/djemdls/

## GitHub Pages

Push to main to build and deploy automatically with GitHub Actions. Pages publishing source is GitHub Actions.

Build locally (Node.js 22):
    node scripts/build-pages.cjs

Output: _site/. Default base path: /AIPath/. Override PAGES_BASE_PATH for another repository or custom domain.
Serve the output beneath that path when testing locally.

## Included

10 certification paths, 969 question pairs in Korean and English, randomized demo/full tests, weighted scoring, explanations, pause, result images and sharing, and the question-bank admin tools.

## Static hosting differences

GitHub Pages cannot execute the optional Cloudflare Worker under worker/.
Scoring runs in the browser. Sharing puts attempt data (including the provided nickname and answers) in the link fragment; the receiving browser recomputes the result and generates the same report image. This is not a tamper-proof, identity-verified credential.
LinkedIn and other crawlers show the common site preview, not a personalized result image. Download and attach the result image for that presentation.
Saved links depend on the current question bank. Existing Sites-hosted share links remain on the original host.
Review notes are browser-local. They do not transfer automatically between hosting origins.
The admin URL is unlisted, not authenticated. Do not store private information there.

## Source

public/ contains the frontend, assets and served banks. content/ contains editable Korean and English content. scripts/ contains generation and validation tools.
After editing source content, run node scripts/build-data.cjs before committing generated data. GitHub Pages deployment builds from public/.

## License

The repository LICENSE is MIT. Third-party materials retain their original terms, including the bundled Inter and Pretendard font licenses in public/fonts/.
