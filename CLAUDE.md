# Hudební kvíz

Statická aplikace (index.html + obrázky), na Netlify se nasazuje větev `main` bez build kroku (`netlify.toml`).

## Pravidla nasazování
- Uživatel má omezený limit na Netlify. Každý merge do `main` = jeden deploy.
- Drobné úpravy sbírej na pracovní větvi; PR do `main` vytvoř a slouč až když uživatel řekne, že chce nasadit (nebo u větší ucelené změny).
