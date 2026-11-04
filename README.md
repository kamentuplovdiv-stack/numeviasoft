# Numevia — GitHub Pages
Static company website with a concise homepage, product directory and dedicated EngineerOne page.

## Structure
- `index.html`: company overview, concise product preview, company context and contact draft.
- `products.html`: product selection; currently lists the actual EngineerOne development only.
- `engineerone.html`: product overview, four interactive examples, searchable catalogue and proposed access plans.
- `modules-data.js`: centralized descriptions of 11 module groups.
- `lab-math.js`: pure educational models (2R kinematics, simply supported beam, two-resistor DC circuit and explicit fit limits).
- `lab.js` and `lab.css`: interactive SVG diagrams, controls, validation, keyboard alternatives and copyable results.
- `visuals/numevia-logo.png`: generated transparent brand logo, requested by the owner. Green N with an orange diagonal and a lowercase wordmark.
- `visuals/*.svg`: original code-authored engineering illustrations. No stock photography or third-party image assets.

Shared styles and navigation are in `style.css` and `app.js`. The homepage does not load engineering simulation scripts. Add future products as separate pages and list them in the product directory and homepage preview.

## Product evidence
Catalogue based on static contents of EngineerOne-V141-UX-FIXED-84.zip, dated 2026-11-02. Build 5008401, versionCode 6008401, source commit ebb993b38ce52ac710980646e93f82dd7c3f5aac. This is the latest packaged APK found in the accessible files, not a claim that no later development exists. Tolerances/fits were confirmed in its dynamically defined module. No APK or signing material is included in the site.

Company status and proposed pricing derive from Numevia_PROVEREN_FINAL.docx. Prices are proposals, not active purchases. The contact form only prepares copyable text; a verified business recipient and delivery service are required to send requests. This export is prepared for public GitHub Pages publication at the owner’s request.

## Interactive examples
- Robot: forward/inverse kinematics, movable XY target, link lengths and joint angles, elbow alternatives, unreachable-target feedback, user-controlled animation. Reduced-motion preference switches animation to a single pose step.
- Beam: point load or full-span distributed load, draggable point load, reactions, bending/shear/deflection graphs and a selectable cross-section with numeric/keyboard input.
- Circuit: series/parallel configuration, selectable resistors, voltage/resistance inputs, branch currents and power balance.
- Fits: manual hole/shaft limits, example clearance/transition/interference fits and a shaft-band slider. These are illustrative limits, not ISO table selections.

All examples expose their assumptions. They are independent idealized browser models, not the full Android application and not engineering certification or a real robot controller. Results can be copied; a downloaded drawing is not part of this release.

## Validation (2026-11-03)
`node tests/lab-math.test.cjs`: FK/IK round trips, unreachable targets and singular pose; central-load closed-form beam deflection, asymmetric reaction/moment continuity, distributed load; DC benchmark, Kirchhoff current and power balance; fit classification and invalid inputs.

Browser QA: home → product directory → detail → live example; desktop layout; embedded viewport checks at 320, 375 and 753 CSS px with no horizontal overflow. Tested mobile menu/Escape, robot coordinates and movement start/stop, keyboard tab switching, draggable beam load, diagram selection, decimal comma input, resistor selection and series/parallel calculations, fit presets and invalid bounds, reset and result clipboard. Catalogue search, empty state, clear action, engineering filter (6/11), keyboard disclosure and contact-text preparation passed. Local asset/anchor references, unique IDs, image dimensions/alternatives and JavaScript syntax checked. No application warnings/errors were observed in the checked browser logs.

Limits: viewport simulation, not a physical phone/Android test. Reduced-motion handling was reviewed in source, not tested with an OS accessibility setting. No Lighthouse/performance score or exhaustive APK validation is claimed. Form sending, payments and public APK download are intentionally not connected.

## GitHub Pages publication
Target repository: `kamentuplovdiv-stack/numeviasoft`.
Intended address: `https://kamentuplovdiv-stack.github.io/numeviasoft/`.
This address is a publication target, not proof of a completed deployment.

The site files are at the repository root. No dependency installation, build, server, or paid service is required. `.nojekyll` serves the static files unchanged. All local navigation and assets use relative URLs so the site works below the project path.

After uploading this folder to a public repository on branch `main`, select **Settings → Pages → Build and deployment → Deploy from a branch → main → / (root) → Save**. Wait for GitHub's Pages deployment to complete, then open the URL displayed in Settings.

Do not add a CNAME file until a custom domain is owned and its DNS is configured. The planned domain numeviasoft.com has not been registered by this workflow.

## Checks
Run `node tests/lab-math.test.cjs` to check the educational calculations. The Pages export changes local URLs and publication metadata; it preserves the previously reviewed design and interactive features.

### GitHub export verification (2026-11-04)
The 3 HTML pages and 84 local asset/navigation/fragment references resolve inside `/numeviasoft/`. JavaScript syntax checks and the existing numerical tests pass. In the local browser preview at the project subpath, the homepage → product directory → EngineerOne live-demo path works, logo and illustrations load, and the DC example shows 40 mA with 100 Ω + 200 Ω at 12 V. No application console errors were observed; browser-extension telemetry errors were excluded. This is local preview verification, not a live GitHub Pages deployment.
