# Hudební kvíz

Hudební kvíz pro trénink i souboje s přáteli. Ukázky skladeb poskytuje veřejné API služby Deezer, hráči a hry jsou uložené ve Firebase Firestore.

## Úpravy a sestavení

Zdrojový kód je v `src/index.html`. Soubory `index.html`, `app.js` a `app.css` v kořeni se z něj generují:

```bash
cd tools
npm install      # jen poprvé
npm run build
```

Vygenerované soubory se commitují; Netlify je jen zveřejní (žádný build na Netlify).

## Google Play

Postup vydání jako aplikace pro Android je v [docs/google-play.md](docs/google-play.md).
