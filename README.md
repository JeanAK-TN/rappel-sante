# Rappel Santé

> Votre santé, simplifiée.

Application mobile de **gestion des maladies chroniques** au Togo : rappels de
médicaments intelligents, suivi des indicateurs de santé (glycémie, tension,
poids), coaching nutritionnel/sportif et alertes préventives.

Projet Intégrateur : **Groupe 20, PI 2026**.

---

## Stack technique

- **React 18** + **TypeScript**
- **Vite 6** (serveur de développement et build)
- **Tailwind CSS v4** + composants **shadcn/ui**
- **react-router v7** (navigation entre écrans)
- Icônes **lucide-react**, graphiques **recharts**

La base visuelle provient d'un export **Figma Make**.

---

## Démarrer le projet

Prérequis : **Node.js 18+** et **npm**.

```bash
# 1. Installer les dépendances
npm install

# 2. Lancer le serveur de développement
npm run dev
```

L'application est ensuite disponible sur **http://localhost:5173/**.

```bash
# Construire la version de production
npm run build
```

---

## Organisation du code

```
src/
├── main.tsx                  Point d'entrée
├── app/
│   ├── App.tsx               Routeur de l'application
│   ├── Gallery.tsx           Vue d'ensemble des maquettes (route /gallery)
│   ├── layouts/
│   │   └── PhoneFrame.tsx     Cadre « téléphone » autour de chaque écran
│   └── components/
│       ├── BottomNav.tsx      Barre de navigation du bas (5 onglets)
│       ├── StatusBar.tsx      Barre de statut Android
│       ├── screens/           Les écrans de l'application
│       └── ui/                Composants shadcn/ui réutilisables
└── styles/                   Feuilles de style globales
```

### Les routes

| Route             | Écran                          |
|-------------------|--------------------------------|
| `/`               | Splash (puis onboarding)       |
| `/onboarding/1-3` | Présentation (3 slides)        |
| `/register`       | Inscription                    |
| `/otp`            | Vérification du code           |
| `/setup-profile`  | Profil de santé                |
| `/home`           | Accueil (tableau de bord)      |
| `/medications`    | Mes médicaments                |
| `/tracking`       | Mon suivi                      |
| `/coaching`       | Coaching IA                    |
| `/profile`        | Mon profil                     |
| `/gallery`        | Toutes les maquettes (présentation) |

---

## Conventions du projet

- Interface en français
- Format mobile de référence : **390 × 844 px**.
- Branche principale : `main`.

---

## Équipe

Groupe 20, PI 2026 : M'BOUEKE Kevin, ZATO Alim, COMBEY Clétus, ADJAYI Rosalie,
GNAKADE Cyrus, GAGOU David, KODIO Jean, AWANYA Gracia, AMEGNAGLO Scyana,
LAYIBO Belinda.
