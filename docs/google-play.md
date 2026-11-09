# Vydání Hudebního kvízu na Google Play

Aplikace pro Android je jen „obal“ (Trusted Web Activity) kolem webu na Netlify. Hra tedy dál běží z Netlify a každá aktualizace webu se projeví i v aplikaci – nové vydání v Google Play je potřeba jen při změně ikony, názvu apod.

> **Monetizace:** podmínky Deezer API zakazují komerční použití (reklamy, placená verze, nákupy). Aplikaci proto vydávej **zdarma a bez reklam**, dokud nebudeš mít s Deezerem dohodu.

## Co je už připravené v repozitáři

| Co | Kde |
|---|---|
| Manifest webové aplikace (název, ikony, barvy, orientace) | `manifest.json` |
| Zásady ochrany osobních údajů + postup smazání účtu | `privacy.html` → `https://TVOJE-DOMENA/privacy.html` (smazání účtu: `#smazani-uctu`) |
| Ikona 512×512 | `icon-512.png` |
| Grafika pro obchod 1024×500 | `docs/play/feature-graphic.png` |
| Snímky obrazovky telefonu 1080×1920 | `docs/play/screenshot-*.png` |
| Šablona ověřovacího souboru | `docs/assetlinks.template.json` |
| Nahlášení a blokování hráčů (vyžaduje Google u obsahu od uživatelů) | v aplikaci: profil soupeře → 🚩 Nahlásit / 🚫 Blokovat |

**Před vydáním doplň kontaktní e-mail** v `privacy.html` (místo `[DOPLŇTE KONTAKTNÍ E-MAIL]` a `[ADD CONTACT E-MAIL]`).

## Krok 1 – Účet vývojáře
1. Na <https://play.google.com/console> si založ vývojářský účet (jednorázově 25 USD, ověření totožnosti).
2. Nový **osobní** účet musí před vydáním aplikaci **14 dní uzavřeně testovat s nejméně 12 testery** (stačí kamarádi z kvízu – potřebují účet Google a Android). Firemní účet tuto povinnost nemá, ale potřebuje D-U-N-S číslo.

## Krok 2 – Vytvoření balíčku pro Android (PWABuilder)
1. Otevři <https://www.pwabuilder.com>, zadej adresu hry na Netlify a klikni **Package For Stores → Android → Generate Package**.
2. V nastavení:
   - **Package ID:** např. `cz.hudebnikviz.app` (později už nejde změnit),
   - **App name:** Hudební Kvíz, **Launcher name:** Hudební Kvíz,
   - **Signing key:** *New* (vytvoří se nový podpisový klíč).
3. Stáhni ZIP. Obsahuje:
   - `*.aab` – soubor, který nahraješ do Google Play,
   - `*.apk` – na vyzkoušení v telefonu,
   - `signing.keystore` + `signing-key-info.txt` – **podpisový klíč. Ulož ho bezpečně a nikam nesdílej (ani do GitHubu).** Bez něj nepůjde vydat aktualizaci.
   - `assetlinks.json` – ověřovací soubor (viz krok 3).

## Krok 3 – Propojení webu s aplikací (assetlinks.json)
Aby aplikace běžela na celou obrazovku bez adresního řádku, musí web prokázat, že aplikace patří k němu:
1. Pošli mi obsah `assetlinks.json` z PWABuilderu – nahraju ho do repozitáře jako `.well-known/assetlinks.json`.
2. Po nahrání aplikace do Play Console zkopíruj v **Nastavení → Integrita aplikace → Podepisování aplikací** otisk **SHA-256 klíče pro podepisování aplikací** (Google aplikaci podepisuje vlastním klíčem). Ten se musí do `assetlinks.json` **přidat** vedle otisku z PWABuilderu – pošli mi ho, doplním ho.
3. Po nasazení na Netlify musí fungovat `https://TVOJE-DOMENA/.well-known/assetlinks.json`.

## Krok 4 – Aplikace v Play Console
Vytvoř aplikaci (jazyk čeština, typ **Hra**, **Zdarma**) a vyplň:

### Obsah aplikace (App content)
- **Zásady ochrany osobních údajů:** `https://TVOJE-DOMENA/privacy.html`
- **Přístup k aplikaci:** „Některé funkce jsou omezené“ → popiš: *Hra s přáteli vyžaduje přezdívku a heslo. Testovací účet: přezdívka `googlereview`, heslo `<zvol>`* (účet si předem vytvoř v aplikaci). Trénink funguje bez účtu.
- **Reklamy:** Ne.
- **Hodnocení obsahu (dotazník IARC):** kategorie *Hra → kvíz / trivia*; násilí, sex, hazard ne; **uživatelé spolu komunikují / sdílejí obsah: ano** (přezdívky, vlastní avatary); nákupy ne.
  - Pozn.: předvolba „CZ/SK scéna“ má obrázek pivních korbelů – v dotazníku uveď „zmínky o alkoholu“, nebo mi řekni a obrázek vyměním.
- **Cílová skupina:** 16–17 a 18+ (zásady uvádějí účet od 15 let; skupinu 13–15 vyber jen pokud chceš i mladší hráče – pak pozor na pravidla pro rodiny).
- **Zpravodajská aplikace:** Ne. **Vládní aplikace:** Ne. **Finanční funkce:** Ne. **Zdraví:** Ne.
- **Smazání účtu:** Ano, uživatelé mohou účet smazat v aplikaci; webový odkaz: `https://TVOJE-DOMENA/privacy.html#smazani-uctu`.

### Bezpečnost údajů (Data safety)
| Otázka | Odpověď |
|---|---|
| Shromažďuje aplikace údaje? | Ano |
| Šifrování při přenosu | Ano (HTTPS) |
| Mohou uživatelé požádat o smazání? | Ano |
| **Osobní údaje → Jméno** (přezdívka) | Shromažďováno, nesdíleno; účel: funkce aplikace, správa účtu; povinné pro hru s přáteli |
| **Fotky a videa → Fotky** (vlastní avatar) | Shromažďováno, volitelné; účel: funkce aplikace |
| **Aktivita v aplikaci → Jiný obsah vytvořený uživatelem / Akce v aplikaci** (odpovědi, skóre) | Shromažďováno; účel: funkce aplikace |
| **ID zařízení nebo jiná ID** (anonymní ID přihlášení, token notifikací) | Shromažďováno; účel: funkce aplikace (notifikace) |
| Poloha | Ne (zemi si hráč volí sám – lze uvést jako „Jiné osobní údaje“, pokud se chceš jistit) |
| Sdílení s třetími stranami | Ne (Firebase je zpracovatel, ne „sdílení“) |

### Hlavní záznam v obchodu (Store listing)
- **Název (max. 30 znaků):** `Hudební Kvíz`
- **Krátký popis (max. 80 znaků):** `Poznej písničku podle ukázky a vyzvi přátele na hudební souboj!`
- **Úplný popis:**

```
Poznáš písničku podle pár vteřin? Hudební Kvíz prověří tvůj sluch i hudební paměť.

🎧 TRÉNINK
Nekonečný režim, ve kterém hádáš interpreta a název skladby. Vyber si konkrétního interpreta nebo náhodný mix a zkrať ukázku třeba na jedinou vteřinu.

⚔️ SOUBOJE S PŘÁTELI
Vyzvi kamaráda nebo náhodného hráče. Oba dostanete stejné skladby a kdo jich pozná víc, vyhrává. Hrát můžete každý, kdy se vám to hodí – aplikace ti dá vědět, až budeš na tahu.

🎸 VYBER SI STYL
Rock, pop, rap, metal, filmová hudba, jazz… 80. léta, 90. léta i aktuální hity. Česká a slovenská scéna i hudba z celého světa. Odpovídej výběrem ze 4 možností, nebo piš odpovědi sám.

🏆 ŽEBŘÍČEK A HODNOSTI
Sbírej výhry, postupuj v hodnostech a dostaň se do Síně slávy.

Hudební ukázky poskytuje veřejné API služby Deezer. Aplikace je nekomerční, bez reklam a není se společností Deezer nijak spřízněna.
```

- **Ikona:** `icon-512.png` · **Grafika:** `docs/play/feature-graphic.png` · **Snímky telefonu:** `docs/play/screenshot-1…5.png`
- **Kategorie:** Hry → Kvízy (Trivia) · **Kontaktní e-mail:** tvůj e-mail

## Krok 5 – Testování a vydání
1. **Testování → Uzavřené testování:** vytvoř stopu, nahraj `.aab`, přidej e-maily min. 12 testerů a pošli jim odkaz pro přihlášení k testu. Musí zůstat přihlášení 14 dní.
2. Po 14 dnech v Play Console požádej o **přístup k produkci** (vyplníš krátký dotazník o testování).
3. **Produkce → Vytvořit vydání** → stejný `.aab` → odeslat ke kontrole (obvykle hodiny až pár dní).

## Moderování nahlášení
Nahlášení hráčů se ukládají ve Firebase konzoli: **Firestore → artifacts → music-quiz-netlify → public → data → reports**. Každý záznam obsahuje, kdo koho nahlásil, důvod (`nickname`, `avatar`, `other`) a čas. Nevhodný profil můžeš smazat nebo mu v dokumentu profilu změnit `avatar` na `owl`. Google očekává, že nahlášení budeš průběžně řešit.

## Žádost o smazání e-mailem
V Firestore smaž dokument hráče v `profiles` (podle pole `email` = přezdívka). Záznamy her (`games`) s jeho přezdívkou můžeš anonymizovat přepsáním `player1_email`/`player2_email` např. na `smazany-hrac`.

## Doporučeno před vydáním: pravidla Firestore
Databáze je teď chráněná jen tím, že klient je přihlášený anonymně – technicky zdatný uživatel může data měnit přímo. Pro větší veřejné vydání doporučuju přejít na přihlášení přes Firebase Authentication a pravidla navázaná na účet. Je to větší změna (migrace všech hráčů), řekni, až ji budeš chtít připravit.
