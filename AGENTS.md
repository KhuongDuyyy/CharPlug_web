# CharPlug Web Agent Rules

`ChargePlug_user` is the only UI source of truth.

Priority order:
1. Mobile must feel like the same product as the app.
2. Do not render extra field or extra text.
3. Repeated patterns must reuse parity-first shared components.
4. Motion, loading, and error states must follow app behavior.
5. Tablet and desktop may only re-layout existing content.

Non-negotiable rules:
- Do not redesign hierarchy, spacing rhythm, density, CTA emphasis, or card composition.
- Do not infer visible UI from entities, types, or mock models.
- Read JSX render sites first, then build view-models from rendered fields only.
- Use app wording when present. Do not rewrite copy for polish.
- All bilingual UI text must live in `lib/constants/i18n.ts`.
- Mock content must live in `lib/mock/data.ts`, not inside `i18n` or page components.
- Do not expose mock/debug/scenario UI in the main shell.
- Desktop/tablet cannot add metadata sidebars, overview panels, helper paragraphs, analytics blocks, or extra notes.
- If a shared pattern exists in app code, implement the shared component first.
- If unsure whether a field belongs on screen, hide it.
