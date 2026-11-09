# Hudební kvíz

Statická webová aplikace (React + Firebase Firestore + Deezer API), nasazovaná na Netlify z větve `main` bez build kroku na Netlify.

## Struktura
- `src/index.html` – **zdrojový kód** (jeden soubor s JSX). Všechny úpravy dělej tady.
- `index.html`, `app.js`, `app.css` v kořeni – **vygenerované** příkazem `cd tools && npm install && npm run build`. Needitovat ručně; po každé změně `src/index.html` znovu sestavit a commitnout i vygenerované soubory.
- `tools/` – sestavovací skript (Babel pro JSX, Tailwind CLI v3). `package.json` je schválně v `tools/`, aby ho Netlify nenašel a nespouštěl instalaci.
- `profiles/`, `presets/`, `ranks/` – obrázky; `firebase-messaging-sw.js` – service worker pro notifikace.
- `privacy.html`, `.well-known/assetlinks.json`, `docs/` – podklady pro Google Play.

## Data a kompatibilita (důležité – aplikaci aktivně hraje hodně hráčů)
- Firestore cesta `artifacts/music-quiz-netlify/public/data/{profiles,games}` se nesmí měnit.
- Profil: `email` = přezdívka (malými písmeny), `pinHash` (PBKDF2-SHA256, 100k iterací, sůl `hudebni-kviz:` + přezdívka), `pin` = jen náhodná značka `#h:…` u převedených profilů. Starší profily mají v `pin` čitelné heslo a převádějí se automaticky (při přihlášení / na pozadí).
- ID avatarů (`lp`, `metallica`, `basic_101`…) se nesmí mazat – stávající profily na ně odkazují.

## Pravidla nasazování
- Uživatel má omezený limit na Netlify. Každý merge do `main` = jeden deploy.
- Drobné úpravy sbírej na pracovní větvi; PR do `main` vytvoř a slouč až když uživatel řekne, že chce nasadit (nebo u větší ucelené změny).
