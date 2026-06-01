# Construire l'application mobile (Capacitor)

L'application web est empaquetée en application mobile avec **Capacitor 6**.
La même base de code sert à Android et à iOS.

> Versions du projet Android : **AGP 8.2.1**, **Gradle 8.2.1**, **JDK 17**,
> compileSdk 34. Compatibles avec Android Studio Iguana (2023.2) et plus récent.
> Dans Android Studio, le JDK de Gradle doit être en **17**
> (Settings → Build Tools → Gradle → Gradle JDK ; le JDK intégré convient).

- `appId` : `tg.rappelsante.app`
- `appName` : Rappel Santé
- Dossier web compilé : `dist/`
- Config : [capacitor.config.json](capacitor.config.json)

## Comment ça marche

1. On compile l'app web : `vite build` → dossier `dist/`.
2. Capacitor copie `dist/` dans le projet natif (`cap sync`).
3. On ouvre le projet natif dans Android Studio (ou Xcode) pour produire l'APK (ou l'IPA).

Scripts utiles (déjà ajoutés) :

```bash
npm run cap:sync       # compile le web + synchronise les projets natifs
npm run cap:android    # compile + synchronise + ouvre Android Studio
npm run cap:ios        # idem pour iOS (nécessite un Mac)
```

---

## Android (APK)

### Prérequis (à installer une fois)

- **Android Studio** : https://developer.android.com/studio
  (installe aussi le SDK Android et un JDK 17 intégré)
- Lors du premier lancement d'Android Studio : laisser installer le **SDK Android** et les **build-tools** proposés.

> Remarque : ce poste a actuellement un JDK 8 et pas de SDK Android.
> Capacitor (Android moderne) exige **JDK 17**. Android Studio le fournit.

### Première fois après un clone du dépôt

Le dossier natif `android/` n'est pas versionné (il se régénère). Après un
`git clone`, le générer une fois :

```bash
npm install
npm run build
npx cap add android
```

### Produire l'APK

```bash
# 1. Compiler le web + synchroniser + ouvrir Android Studio
npm run cap:android
```

Puis dans **Android Studio** :

1. Laisser Gradle se synchroniser (première fois : quelques minutes).
2. Menu **Build → Build Bundle(s) / APK(s) → Build APK(s)**.
3. À la fin, cliquer sur **locate** : l'APK est dans
   `android/app/build/outputs/apk/debug/app-debug.apk`.
4. Copier cet APK sur un téléphone Android et l'installer
   (autoriser « sources inconnues »).

> L'APK **debug** suffit pour la démo. Pour une publication Play Store,
> il faut signer un APK/AAB **release** (clé de signature).

### Après chaque modification du code

```bash
npm run cap:sync   # recompile le web et met à jour le projet Android
```

---

## PWA (installer sur iPhone/Android sans store, sans Mac)

L'application est aussi une **PWA** (Progressive Web App) : installable depuis le
navigateur, fonctionne hors-ligne (le shell est mis en cache par un service worker).
Idéal pour tester sur iPhone **sans Mac ni App Store**.

### Étapes

1. Compiler : `npm run build` (génère `dist/` avec `manifest.webmanifest` + `sw.js`).
2. Héberger `dist/` sur une URL **HTTPS** (obligatoire pour installer une PWA) :
   - **Netlify Drop** (glisser-déposer le dossier `dist` sur app.netlify.com/drop)
   - **Vercel**, **GitHub Pages**, **Firebase Hosting**, etc.
3. Sur le téléphone, ouvrir l'URL :
   - **iPhone (Safari)** : bouton Partager → **« Sur l'écran d'accueil »**.
   - **Android (Chrome)** : menu → **« Installer l'application »**.

L'app s'ouvre alors en plein écran, avec l'icône Rappel Santé.

> Icônes : générées depuis `public/icon.svg` via `node scripts/gen-icons.mjs`
> (recrée `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`).

> Limites iOS : les notifications push sont restreintes sur iOS pour les PWA.
> Pour des notifications complètes, viser l'app native (Capacitor + Mac).

## iOS (IPA) — nécessite un Mac

Le code est **prêt pour iOS**, mais Apple impose **macOS + Xcode** pour compiler.
Impossible depuis Windows.

Sur un Mac :

```bash
npm install
npx cap add ios        # génère le projet iOS (une seule fois)
npm run cap:ios        # compile + ouvre Xcode
```

Puis dans Xcode : choisir un simulateur ou un appareil, et lancer.
Pour installer sur un vrai iPhone ou publier sur l'App Store :
**compte Apple Developer** (99 $/an).

Sans Mac, on peut utiliser un **build cloud** (Codemagic, Ionic Appflow,
GitHub Actions runners macOS).
