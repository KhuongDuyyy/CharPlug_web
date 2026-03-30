# Assumptions

- No screenshot pack exists in the repo, so source-of-truth came from JSX render sites, tokens, and assets in `ChargePlug_user`.
- Camera, backend auth, MQTT, SignalR, payment confirmation, and API responses are mocked.
- English fallback is intentionally light; Vietnamese copy is the main parity target because app wording is Vietnamese-first.
- A few flows were simplified to browser-safe equivalents, but the visible field set stayed constrained to app patterns.
- Brand text `ChargePlug` remains hard-coded where it is the product name, not localized copy.
- Mock domain content such as station names, FAQ answers, and bank account info lives in `lib/mock/data.ts`, not in `i18n`.
