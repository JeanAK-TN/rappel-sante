# PROMPT FIGMA MAKE — RAPPEL SANTÉ
## Application Mobile de Gestion des Maladies Chroniques (Togo)

---

## INSTRUCTIONS GÉNÉRALES

Create a complete, high-fidelity mobile UI design for **Rappel Santé**, an AI-powered health reminder app for chronic disease patients in Togo, West Africa. The design should feel warm, trustworthy, and accessible — inspired by Material Design 3, with an African cultural identity layer.

**Output format:** Mobile screens at 390×844px (iPhone 14 equivalent, scaled for Android). Design all screens as individual frames organized in a single Figma page.

---

## DESIGN SYSTEM

### Color Palette
Define these as Figma color styles:

- **Primary / Vert Médical:** `#1E7D5C` — Main CTA buttons, active navigation, headers
- **Primary Light / Vert Clair:** `#D6EFE6` — Card backgrounds, highlights, chips
- **Primary Dark:** `#145C40` — Pressed states, hover
- **Accent Blue:** `#2196F3` — Info badges, links
- **Warning Orange:** `#FF9800` — Pending reminders, limit values
- **Danger Red:** `#E53935` — Critical alerts, missed medication, abnormal values
- **Success Green:** `#43A047` — Confirmed intake, achieved goals
- **Text Primary:** `#1A2E3B` — All main body text
- **Text Secondary:** `#607D8B` — Labels, subtitles, metadata
- **Background:** `#F4F6F7` — Screen backgrounds
- **Surface White:** `#FFFFFF` — Cards, modals, inputs
- **Border:** `#B2CEBF` — Card borders, dividers

### Typography (define as Figma text styles)
Use **Inter** font family throughout.

- **H1 — Screen Title:** Inter Bold 24sp, `#1A2E3B`
- **H2 — Card Title:** Inter SemiBold 18sp, `#1A2E3B`
- **H3 — Section Label:** Inter SemiBold 14sp, `#607D8B`, uppercase, letter-spacing 0.8
- **Body 1:** Inter Regular 16sp, `#1A2E3B`
- **Body 2:** Inter Regular 14sp, `#607D8B`
- **Button Label:** Inter SemiBold 16sp
- **Caption:** Inter Regular 12sp, `#607D8B`
- **Value Display:** Inter Bold 32sp — for health metrics (blood pressure, glucose)
- **Badge:** Inter Medium 11sp

### Spacing & Grid
- 8px base grid
- Screen horizontal padding: 20px
- Card padding: 16px
- Component gap: 12px
- Section spacing: 24px

### Border Radius
- Cards: 16px
- Buttons: 12px
- Inputs: 8px
- Chips/Tags: 20px (pill)
- Bottom Sheet: 24px top corners only

### Shadows
- Card shadow: `0px 2px 12px rgba(0,0,0,0.08)`
- FAB shadow: `0px 4px 16px rgba(30,125,92,0.35)`
- Modal overlay: `rgba(0,0,0,0.5)`

---

## COMPONENTS TO BUILD

Build these as reusable Figma components with variants:

### 1. Health Metric Card
A compact card showing one health parameter.
- Width: Full width or half width (2 variants)
- Content: Icon (left) + Parameter name + Current value (large, colored) + Trend arrow
- States: `Normal (green)` / `Warning (orange)` / `Critical (red)`
- Background: White, radius 16px, shadow

### 2. Medication Reminder Card
- Left colored stripe (by medication category)
- Content: Medication name (H2) + Dosage + Next intake time
- Right: Checkbox (confirmed / pending) or countdown
- States: `Upcoming` / `Confirmed` / `Missed` / `Snoozed`

### 3. Primary Button
- Full width, height 52px, radius 12px
- Background: `#1E7D5C`, text white Inter SemiBold 16sp
- States: `Default` / `Pressed (#145C40)` / `Disabled (opacity 40%)` / `Loading (spinner)`

### 4. Secondary Button
- Full width, height 52px, radius 12px
- Border: 2px `#1E7D5C`, background transparent, text `#1E7D5C`
- States: `Default` / `Pressed` / `Disabled`

### 5. Text Input Field
- Height 56px, background `#F4F6F7`, radius 8px
- Floating label (small, top-left when filled)
- Unit label on right (e.g., "g/L", "mmHg", "kg")
- States: `Idle` / `Focused (green border 2px)` / `Filled` / `Error (red border + error message)`

### 6. Bottom Navigation Bar
- Height 80px, background white, top border `#E0E0E0`
- 5 tabs: Home / Medications / Tracking / Coaching / Profile
- Icons: outlined Material icons
- Active state: icon filled `#1E7D5C` + label `#1E7D5C` + green dot indicator
- Inactive: `#607D8B`

### 7. Health Chart Card
- White card, full width
- Header: Title + period selector (7D / 30D / 3M as pill buttons)
- Chart area: 180px height line chart placeholder
- Color zones: red (danger) / orange (warning) / green (normal) bands behind the line
- Stats row: Min / Avg / Max in 3 equal columns

### 8. FAB (Floating Action Button)
- 56×56px circle, background `#1E7D5C`, shadow
- Icon: white "+" 24px
- Position: bottom-right, 24px from edges

### 9. Tip / Coaching Card
- Background `#D6EFE6`, radius 16px
- Left accent bar: `#1E7D5C` 4px width
- Icon + Title + Short description text
- Category chip top-right: Nutrition / Sport / Prevention

### 10. Streak Badge
- Horizontal pill: flame emoji + "X jours consécutifs" + green background
- States: `Active` / `Broken (grey)`

### 11. Pathology Chip
- Pill shape, background `#D6EFE6`, text `#1E7D5C`
- States: `Selected (#1E7D5C bg, white text)` / `Unselected`
- Options: Hypertension / Diabète / Insuffisance cardiaque / Asthme / Autre

### 12. Status Bar (Android)
- Height 24px, time left, icons right (wifi, battery, signal)
- Dark and light variants

---

## SCREENS TO CREATE

### FLOW 1: ONBOARDING

**Frame 1.1 — Splash Screen**
- Full screen, background `#1E7D5C`
- Center: App logo (white leaf/heart cross icon, 80px) + "Rappel Santé" wordmark (white, Inter Bold 32sp) + tagline "Votre santé, simplifiée." (white, 16sp, opacity 80%)
- Bottom: subtle loading dots animation placeholder

**Frame 1.2 — Onboarding Slide 1**
- White background, status bar dark
- Top 55% area: illustration placeholder (rounded rect `#D6EFE6`) with caption "Patient prenant son médicament, check vert animé"
- Progress dots: 3 dots, first active (green)
- Title: "Plus d'oublis de médicaments" — Inter Bold 24sp
- Subtitle: "Des rappels intelligents, adaptés à votre traitement et vos horaires." — Body 1, `#607D8B`
- Bottom: Primary button "Suivant" + text link "Passer"

**Frame 1.3 — Onboarding Slide 2**
- Same layout
- Illustration: health chart with green ascending line
- Dot 2 active
- Title: "Suivez votre santé au quotidien"
- Subtitle: "Tension, glycémie, poids : tout votre historique en un coup d'œil."

**Frame 1.4 — Onboarding Slide 3**
- Illustration: personage africain avec coach IA (phone + light bulb)
- Dot 3 active
- Title: "Un coaching personnalisé"
- Subtitle: "Des conseils adaptés à votre pathologie, votre âge et vos habitudes alimentaires."
- Bottom: Primary button "Commencer" (no skip link)

**Frame 1.5 — Inscription**
- Title "Créer un compte", subtitle "Entrez vos informations de base."
- Inputs: Prénom / Numéro de téléphone (with +228 flag prefix) / Mot de passe (with eye toggle)
- Checkbox: "J'accepte les conditions d'utilisation"
- Primary button "Créer mon compte"
- Bottom text: "Déjà inscrit ? Se connecter" — link style

**Frame 1.6 — Vérification OTP**
- Title "Vérification"
- Subtitle "Un code à 6 chiffres a été envoyé au +228 XX XX XX XX"
- 6 individual digit input boxes (large, 48x56px each), centered
- Primary button "Confirmer" (disabled until 6 digits)
- "Renvoyer le code (59s)" — countdown link

**Frame 1.7 — Profil Médical Setup**
- Title "Votre profil de santé"
- Subtitle "Ces informations permettent de personnaliser vos rappels."
- Fields: Âge (number input) / Sexe (2 chips: Homme / Femme) 
- Section "Mes pathologies" — multi-select chips: Hypertension / Diabète / Insuffisance cardiaque / Asthme / Autre
- Section "Mon médecin traitant (optionnel)" — text input with search icon
- Primary button "Continuer" + text link "Passer pour l'instant"

---

### FLOW 2: NAVIGATION PRINCIPALE

**Frame 2.1 — Dashboard / Accueil**
Layout (top to bottom):
- Status bar (light)
- Header row: "Bonjour, Kofi 👋" (H1) + Avatar (40px circle, initials "KA", green bg) — space-between
- Subheader: Date today (Body 2, secondary color)
- **Alert Card** (if upcoming med): Medication reminder card — "Prochaine prise : Amlodipine 5mg — dans 45 min" — Warning Orange accent
- Section title "MES INDICATEURS" (H3 uppercase)
- 2-column grid of Health Metric Cards: Tension (128/82 mmHg, green) / Glycémie (1.45 g/L, orange) + full-width card: Poids (74.5 kg, green)
- Streak badge: "🔥 7 jours consécutifs"
- Section title "ACCÈS RAPIDE" (H3)
- Row of 3 circular icon buttons (64px): "Saisir valeur" / "Médicament" / "Médecin" — green icon + label below
- **Conseil du Jour** — Tip card: "💡 Conseil nutrition : L'akpan est riche en fibres. Idéal pour équilibrer votre glycémie."
- Bottom nav bar
- FAB bottom-right

**Frame 2.2 — Mes Médicaments**
- Status bar + header "Mes Médicaments" + "+" icon button top right
- Progress bar row: "3/5 prises effectuées aujourd'hui" — green filled progress bar
- Section "AUJOURD'HUI"
- List of 3 medication reminder cards with different states:
  - Amlodipine 5mg — 08:00 — Confirmed (green check)
  - Metformine 500mg — 12:00 — Upcoming (orange, 1h countdown)
  - Aspirine 100mg — 20:00 — Scheduled (grey)
- Section "CETTE SEMAINE" 
- 7-day calendar strip: Mon-Sun with colored dots (green/orange/red/grey)
- Bottom nav (Medications tab active)

**Frame 2.3 — Détail Médicament (Modal / Sheet)**
- Bottom sheet (slides up): radius 24px top corners
- Drag handle at top
- Medication name H1 + category chip
- Info rows: Dosage / Fréquence / Depuis / Prescripteur
- Section "Rappels programmés" — list of time chips (editables)
- Section "Notice" — truncated text + "Lire plus" link
- 2 buttons: "Modifier" (secondary) + "Marquer comme pris" (primary)

**Frame 2.4 — Mon Suivi**
- Header "Mon Suivi" + export icon
- 3 Tabs: Glycémie (active) / Tension / Poids
- **Active tab content (Glycémie):**
  - Value display: "1.45 g/L" in 32sp bold, orange color + "↑ +0.12 vs hier" caption
  - Period selector: 7J (active) / 30J / 3M
  - Chart card with line graph, colored zones
  - Stats row: Min 1.10 / Moy 1.38 / Max 1.72
  - "Dernières mesures" list: 3 rows with date + time + value + color dot
- FAB for new entry
- Bottom nav (Tracking tab active)

**Frame 2.5 — Saisie Nouvelle Valeur (Modal)**
- Bottom sheet
- Title "Saisir une glycémie"
- Large number input with "g/L" unit, big font (48sp)
- Slider below: min 0.5 — max 3.0, colored zones
- Date/time picker row: "Maintenant" (default) / custom
- Contextual note input: "Contexte : À jeun / Après repas / Autre" — chips
- Primary button "Enregistrer"

**Frame 2.6 — Coaching IA**
- Header "Mon Coaching"
- 3 horizontal tabs: Nutrition (active) / Sport / Prévention

- **Nutrition tab:**
  - "Votre plan du jour" section title
  - 2 recipe cards (half width): photo placeholder + recipe name + tag (Diabète adapté) + calories
  - "Conseils alimentaires" section — 2 tip cards with green accent

- **Sport tab:**
  - "Programme du jour" card: 30 min — intensité légère
  - List of 3 exercise items: icon + name + duration + intensity chip
  - CTA button "Commencer la séance"

- **Prévention tab:**
  - 2 alert-style cards based on recent data:
    - "⚠️ Votre glycémie est légèrement élevée ce matin. Évitez les sucres rapides au déjeuner."
    - "✅ Votre tension est stable depuis 5 jours. Continuez ainsi !"
  - H3 "Rappels santé du mois"
  - 2 educational cards with icon

- Bottom nav (Coaching tab active)

**Frame 2.7 — Mon Profil**
- Header "Mon Profil" + settings icon
- Profile section: Avatar (64px) + Name + pathology chips
- Sections as list items with chevrons:
  - Mes informations personnelles
  - Mes pathologies
  - Mon médecin traitant
  - Partage de données (toggle ON)
  - Notifications (settings)
  - Langue (Français)
  - Mode hors ligne (toggle)
  - Aide & Support
  - À propos de Rappel Santé
- Danger zone: "Se déconnecter" (red text)
- Bottom nav (Profile tab active)

---

### FLOW 3: ÉTATS SPÉCIAUX

**Frame 3.1 — Notification Push (Android Lock Screen mock)**
- Dark lock screen background
- Standard Android notification card:
  - App icon (green) + "Rappel Santé" + "Maintenant"
  - Title: "💊 Heure de prise !"
  - Body: "Metformine 500mg — Dose du midi"
  - Action buttons: "✓ Pris" (green) | "⏰ Rappeler" (grey)

**Frame 3.2 — Alerte Valeur Critique**
- Full screen overlay (semi-transparent dark)
- White modal card, center
- Red top band with ⚠️ icon
- Title: "Valeur inhabituelle détectée"
- Body: "Votre glycémie de 2.10 g/L est supérieure au seuil critique. Nous recommandons de contacter votre médecin."
- 2 buttons: "Contacter mon médecin" (primary red) + "Compris" (secondary)

**Frame 3.3 — Empty State: Mes Médicaments**
- Centered layout
- Illustration placeholder: pill with friendly face (120px)
- Title: "Aucun traitement enregistré"
- Body: "Ajoutez vos médicaments pour recevoir des rappels personnalisés."
- Primary button "Ajouter un médicament"

**Frame 3.4 — Espace Médecin — Dashboard**
- Header "Tableau de bord" (different visual from patient app — more clinical)
- "Mes patients" section: list of 3 patient cards with: name + pathology + last contact + alert badge
- Alert section: "1 patient nécessite votre attention" — red card
- Navigation different: Patients / Alertes / Messages / Paramètres

---

## PROTOTYPE CONNECTIONS (if applying interactions)

Connect these flows:
1. Splash → Onboarding Slide 1 → 2 → 3 → Inscription → OTP → Profil Setup → Dashboard
2. Dashboard → tap medication card → Mes Médicaments → tap card → Detail Sheet
3. Dashboard → tap "Saisir valeur" → Saisie Modal → back to Dashboard with updated value
4. Any bottom nav → corresponding screen

---

## ADDITIONAL DESIGN GUIDELINES

**Illustration style:** Flat vector style. African characters with varied warm skin tones. Togolese urban/rural environments. Warm, friendly expressions. Color palette consistent with design system.

**Photography placeholder style:** Use `#D6EFE6` filled rectangles with `#1E7D5C` thin border for all image placeholders. Add a small camera or image icon centered.

**Icons:** Use Material Symbols Outlined style throughout. Key icons needed: pill, heart-pulse, chart-line, fork-knife, running-person, bell, user, home, plus-circle, check-circle, alert-triangle, calendar, share, settings, phone, doctor/stethoscope.

**Micro-copy tone:** French language. Warm, encouraging, never alarming. Examples:
- "Bravo, votre prise est enregistrée ! 👍" (not "Confirmation reçue")
- "Il vous reste 2 prises aujourd'hui." (not "2 notifications pending")
- "Votre tension semble stable. Continuez ainsi !" (not "Normal range detected")

**Data displayed in mocks:** Use realistic Togolese names (Kofi, Afiwa, Yao, Ama). Local phone format: +228 XX XX XX XX. Medications common for hypertension/diabetes: Amlodipine, Metformine, Losartan, Glibenclamide. Date format: "Lundi 19 mai 2026".

---

## DELIVERABLE ORGANIZATION

Organize all frames in Figma in these sections:
1. **🎨 Design System** — Colors / Typography / Components
2. **📱 Onboarding** — Frames 1.1 to 1.7
3. **🏠 Navigation Principale** — Frames 2.1 to 2.7
4. **⚡ États Spéciaux** — Frames 3.1 to 3.4
5. **🔗 Prototype Flow** — Connected prototype version

Name all frames clearly: `[Section] — [Screen Name]` (e.g., "Onboarding — 03 Profil Médical")
