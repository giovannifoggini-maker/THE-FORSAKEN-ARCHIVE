# The Forsaken Archive — FogLabs

Wiki statica indipendente dedicata a **Forsaken** su Roblox. Costruita con HTML5, CSS3, JavaScript Vanilla, dataset JSON e LocalStorage. Nessun framework, backend o API key richiesti.

> **Stato del contenuto:** questa consegna è una prima edizione navigabile, non un catalogo completo del gioco. Le fonti consultate non concordano su tutti i conteggi e alcuni dati provengono da snapshot community precedenti alla patch 5.4.2. Il sito espone fonte, data e stato del record; non inventa i valori mancanti.

## Avvio locale

1. Estrai la cartella del progetto.
2. Apri `index.html` con un browser moderno.
3. La modalità `file://` usa `data/local-data.js` come fallback perché i browser normalmente bloccano `fetch()` di file JSON locali per motivi di sicurezza.

La build include anche i JSON canonici in `data/`. Per aggiornare il database mentre apri direttamente `index.html`:

1. Modifica il relativo file `.json` dentro `data/`.
2. Esegui dalla cartella del progetto:

   ```bash
   python tools/generate-local-bundle.py
   ```

3. Riapri `index.html`.

In alternativa, l'**Editor database locale** (pulsante `FL` in alto) consente di importare, modificare, validare ed esportare un dataset. Le modifiche dell'editor sono salvate soltanto nel LocalStorage del browser corrente. Per pubblicarle bisogna esportare il JSON e sostituire il file nel progetto.

## Pubblicazione

### GitHub Pages

- Carica il contenuto della cartella nel branch `main`.
- Abilita GitHub Pages dalla root `/` del branch.
- Nessuna build è necessaria.

### Cloudflare Pages

- Framework preset: **None**.
- Build command: **vuoto**.
- Build output directory: **/** (root del progetto).
- Root directory: `/`.
- Nessuna variabile d'ambiente richiesta.

Sulla versione pubblicata, `app.js` legge i file JSON in `data/`; se un JSON non è disponibile usa il bundle locale come fallback.

## Aspetto e comportamento

La palette scura è stata alleggerita con superfici graphite più chiare, bordi più leggibili e un hero con overlay meno intenso; il tema chiaro resta disponibile dal selettore in alto. Il progetto mantiene l’atmosfera horror attraverso gli accenti rossi e viola, senza usare un contrasto eccessivamente cupo.

## Funzionalità incluse

- Navigazione SPA tramite hash route, senza ricaricare la pagina.
- 14 categorie enciclopediche, più pagine strumenti, fonti e editor locale.
- Ricerca globale istantanea con suggerimenti.
- Ricerca interna, filtri e ordinamento nelle categorie.
- Preferiti e cronologia tramite LocalStorage.
- Confronto tra qualsiasi coppia di personaggi (Survivor o Killer); i valori assenti sono indicati come non disponibili.
- Tema scuro/chiaro e interfaccia italiana/inglese.
- Schede personaggio e schede dettagli per le voci del database.
- Collegamenti interni tra personaggi, abilità e categorie.
- Layout responsive con menu mobile.
- Pagina 404 interna.
- Import, validazione, salvataggio locale ed esportazione dei dataset JSON.

## Struttura

```text
the-forsaken-archive/
├── index.html
├── styles.css
├── app.js
├── data/
│   ├── manifest.json
│   ├── local-data.js
│   ├── characters.json
│   ├── survivors.json
│   ├── killers.json
│   ├── skins.json
│   ├── abilities.json
│   ├── maps.json
│   ├── items.json
│   ├── effects.json
│   ├── emotes.json
│   ├── lore.json
│   ├── badges.json
│   ├── events.json
│   ├── updates.json
│   ├── guides.json
│   ├── tierlists.json
│   └── sources.json
├── assets/
│   ├── images/
│   │   ├── character-placeholder.svg
│   │   └── hero-texture.svg
│   ├── icons/
│   │   └── archive-icon.png
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-64.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
└── tools/
    └── generate-local-bundle.py
```

## Schema dei record

I dataset usano la forma `{ "meta": {...}, "items": [...] }`. Ogni voce deve avere un `id` stabile e campi di attendibilità (`status`, `sourceIds`, `lastVerified`). Per i personaggi si usano anche `side`, `role`, `unlock`, `stats`, `abilities`, `skins`, `milestones` e `gameVersion`. I campi non verificati vanno lasciati `null` oppure descritti con una nota esplicita.

Stati consigliati:

- `verified-community`: riscontrato in una fonte community nominata; non equivale a conferma ufficiale.
- `partial`: dati incompleti, fonte datata o informazioni da aggiornare.
- `flagged`: conflitto o valore anomalo che richiede revisione.
- `confirmed-update`: voce riportata in una nota di aggiornamento community.

## Fonti, immagini e diritti

- Il gioco e i relativi marchi appartengono ai rispettivi titolari; questa wiki è fan-made e non è affiliata agli sviluppatori o a Roblox.
- I dati sono sintesi originali e collegamenti a fonti community. Le schede non riproducono intere pagine di altre wiki.
- Le due immagini personaggio attualmente collegate sono caricate dal percorso pubblico della wiki community rowikis e vengono mostrate con fallback locale se non raggiungibili. Non sono incluse come file binari nel progetto. Per ampliare il catalogo immagini, usare soltanto render con provenienza e diritti verificati, includendo l'attribuzione nel record.
- La pagina About di `forsakenwiki.com` dichiara che i contenuti adattati dalla wiki originale sono disponibili sotto CC BY-SA 4.0; verificare la licenza della singola immagine prima di redistribuirla.
- L'archivio attuale è stato predisposto con fonti controllate il **18 novembre 2026**. Il dato patch più recente trovato durante la ricerca è **5.4.2**; la copertura dei singoli campi non è uniforme.

## Controlli effettuati

Verifica di manutenzione eseguita con Chromium sulla build HTML/CSS/JavaScript e sul bundle JSON:

- Tutte le 14 rotte di categoria sono state aperte e controllate.
- Tutte le 174 schede dei dataset enciclopedici (escluse le copie del roster) sono state aperte; nessuna ha restituito la pagina 404.
- Tutte le 21 schede personaggio sono state controllate, inclusi i link di ritorno alla categoria.
- Verificati collegamenti diretti alle abilità, confronto avviato da una scheda, selezione di due personaggi distinti, ricerca e suggerimenti, filtri, preferiti, cronologia, editor JSON, fonti e pagina 404.
- Controllati i percorsi mobile principali a 375 px: nessun overflow orizzontale e menu laterale funzionante.
- Nessun errore JavaScript rilevato nei test desktop e mobile.

### Correzioni di manutenzione (18 novembre 2026)

- Corretti i link di ritorno dai personaggi: ora puntano a `#survivors` e `#killers`.
- Le schede evidenziano la sezione corretta nella navigazione laterale e nel breadcrumb.
- Le abilità dei personaggi aprono la relativa scheda quando esiste un collegamento nel database.
- Il pulsante di confronto trasferisce il personaggio scelto e impedisce il confronto di un personaggio con sé stesso.
- Le schede compatte sono collegamenti HTML accessibili anche da tastiera.
- Corretta la visualizzazione dei valori `null` e mancanti, incluso il Terror Radius.
- Ripristinate le icone nella homepage e l'icona hamburger su smartphone.
- Rafforzato lo shading rosso ambientale su tutte le rotte e mantenuto un livello più tenue nel tema chiaro.
- Risolto un SVG di ricerca sovradimensionato nelle barre filtro: l’icona ora è vincolata a 16×16 px, evitando la macchia circolare nera visibile in tutte le pagine di categoria.
- Reso più evidente e coerente il placeholder locale dei personaggi non disponibili, con silhouette geometrica e senza testa circolare nera.

Il test grafico usa il bundle locale e placeholder ripetibili; le immagini remote possono non essere raggiungibili in anteprima e vengono sostituite dal placeholder SVG. Nel sito pubblicato il browser prova a caricare gli URL immagine indicati dai record.


## Identità visiva FogLabs (18 novembre 2026)

- Applicato l'emblema originale FA/book generato per The Forsaken Archive al marchio nella sidebar e al footer.
- Aggiunte favicon ICO multi-risoluzione, PNG 16/32/64 px, icona 512 px e Apple Touch Icon 180 px.
- Aggiunto `site.webmanifest` per supportare le icone del sito su browser e dispositivi compatibili.
- L'immagine sorgente è stata ottimizzata e ridimensionata per il web; non vengono caricati asset remoti.
