# Evidence scaling v1

All newly started exams use the versioned `public/scaling.js` engine on the
browser and Worker. Each certification has a hash of its model and answer keys.
The Korean canonical metadata builds both language models.

Difficulty is the within-bank midrank of L1–L4, converted to `-log(1-rank)`.
Evidence is divided across domain, type, and explicitly reviewed concept IDs.
Feature weights are bank membership proportions, not hand-written multipliers.
The score is 1000 times the ratio of weighted log1p earned evidence to weighted
log1p available evidence. The displayed integer is floored after 12-decimal
floating-point cleanup. Pass/fail uses that integer and the existing threshold
times ten. Correct counts and domain accuracy remain unweighted.

Search tags currently come from keyword rules and are not reviewed scoring
concepts. They are deliberately excluded. Only `scoringConceptIds`, explicitly
reviewed stable IDs, may add concepts. At release there are no such annotations;
the current models use domain and type features. Do not relabel keyword tags as
reviewed without checking their assignment against each question.

Contributions distribute earned feature score proportionally among correct
items. They are not fixed points or counterfactual penalties. Integer allocations
use the largest-remainder method with question-ID tie breaks.

This is a deterministic content-based heuristic, not empirical equating, IRT,
percentile ranking, or proof of comparable ability across certifications.
One hundred percent correct earns 1000 and all wrong earns zero. Wrong answers
receive no inferred partial credit. Increasing correct answers cannot lower the
score on the same form.

Sites preserves its legacy equal/difficulty scoring branches for already-open
old clients and stored old reports. New-version mismatches are rejected. Pages
links include the exact model version; legacy/version-mismatched links are
rejected rather than silently rescored. Model changes require a fresh attempt.
