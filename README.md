# Fit · Elena

App di allenamento personale: schede Posturale, Giorno 1 e Giorno 2, con animazioni,
timer, contatori e calendario. I dati sono salvati sul dispositivo (localStorage).

## Provarla in locale

```bash
npm install
npm run dev
```

Poi apri l'indirizzo mostrato nel terminale (es. http://localhost:5173).

## Metterla online (GitHub + Vercel)

### 1. Carica su GitHub
- Crea un nuovo repository vuoto su github.com (senza README, per evitare conflitti).
- Nella cartella del progetto:

```bash
git init
git add .
git commit -m "Prima versione app allenamento"
git branch -M main
git remote add origin https://github.com/TUO-UTENTE/NOME-REPO.git
git push -u origin main
```

### 2. Deploy su Vercel
- Vai su vercel.com e accedi con l'account GitHub.
- "Add New… → Project" e scegli il repository appena creato.
- Vercel riconosce Vite in automatico: lascia tutte le impostazioni predefinite
  (Framework: Vite · Build command: `vite build` · Output: `dist`).
- Premi "Deploy". In circa un minuto avrai un indirizzo pubblico.

### 3. Sul telefono
- Apri l'indirizzo Vercel dal browser del telefono.
- Su iPhone: tasto Condividi → "Aggiungi alla schermata Home".
- Su Android: menu ⋮ → "Installa app" / "Aggiungi a schermata Home".
  Così si comporta come un'app a tutto schermo.

## Nota sui dati
Gli allenamenti segnati sono salvati nel browser del dispositivo. Se cambi telefono
o cancelli i dati del browser, lo storico non viene trasferito.
