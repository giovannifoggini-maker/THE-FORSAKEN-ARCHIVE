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

## Catalogo immagini locale (20 novembre 2026)

Ogni record nei dataset enciclopedici include una propria illustrazione SVG locale coordinata con la categoria. Le card, i dettagli, la home, i preferiti e il comparatore usano questi file. Per rigenerarli dopo aver aggiunto o cambiato record, esegui:

```bash
python tools/generate-archive-art.py
python tools/generate-local-bundle.py
```

Le grafiche sono chiaramente contrassegnate come **ARCHIVE ART · NON UFFICIALE**; sono un supporto visivo del progetto e non devono essere interpretate come screenshot del gioco.

## Funzionalità incluse

- Navigazione SPA tramite hash route, senza ricaricare la pagina.
- 14 categorie enciclopediche, più pagine strumenti, fonti e editor locale.
- Ricerca globale istantanea con suggerimenti.
- Ricerca interna, filtri e ordinamento nelle categorie.
- Preferiti e cronologia tramite LocalStorage.
- Confronto tra qualsiasi coppia di personaggi (Survivor o Killer); i valori assenti sono indicati come non disponibili.
- Tema scuro/chiaro e interfaccia italiana/inglese.
- Schede personaggio e schede dettagli per le voci del database, con una grafica locale dedicata a ogni record.
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
│   │   ├── hero-texture.svg
│   │   └── archive/                  # 195 illustrazioni SVG locali, una per record
│   ├── icons/
│   │   └── archive-icon.png
│   ├── favicon.ico
│   ├── favicon-16.png
│   ├── favicon-32.png
│   ├── favicon-64.png
│   ├── apple-touch-icon.png
│   └── site.webmanifest
└── tools/
    ├── generate-archive-art.py        # Rigenera i 195 visual originali FogLabs
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
- **Tutte le 195 voci attualmente presenti nei 14 dataset hanno ora un asset visivo locale** in `assets/images/archive/`. Sono illustrazioni vettoriali originali FogLabs create appositamente per questa interfaccia (avatar stilizzati, ambientazioni astratte e simboli di categoria): non sono render, screenshot o artwork ufficiali di Forsaken.
- Le illustrazioni locali non richiedono chiamate esterne e funzionano anche aprendo `index.html` offline. I record contengono `image`, `imageCredit` e `imageType` per indicare il tipo e la provenienza del visual.
- Ho rimosso gli hotlink a immagini Rowikis dalla homepage e dai dati personaggio. Le immagini ufficiali/community potranno sostituire le illustrazioni solo quando la licenza o l'autorizzazione del singolo file è verificabile e l'attribuzione può essere conservata.
- La pagina About di `forsakenwiki.com` dichiara il contenuto adattato sotto CC BY-SA 4.0, ma precisa che marchi e asset del gioco appartengono ai rispettivi titolari. Questo non è assunto come autorizzazione automatica a redistribuire ogni render o screenshot: la licenza del singolo asset va controllata. Riferimento: `https://forsakenwiki.com/about/`.
- Per l'indice mappe è stato aggiunto un riferimento community aggiornato il 10 novembre 2026. Non sono state copiate le sue data-card o immagini.
- L'archivio attuale conserva la copertura testuale iniziale e **non viene dichiarato completo**. Le illustrazioni sono complete per i record presenti, non per ogni elemento del gioco. I valori possono restare parziali o da verificare.

## Controlli effettuati

Verifica di manutenzione eseguita con Chromium sulla build HTML/CSS/JavaScript e sul bundle JSON:

- Tutte le 14 rotte di categoria sono state aperte e controllate.
- Tutte le 174 schede dei dataset enciclopedici (escluse le copie del roster) sono state aperte; nessuna ha restituito la pagina 404.
- Tutte le 21 schede personaggio sono state controllate, inclusi i link di ritorno alla categoria.
- Verificati collegamenti diretti alle abilità, confronto avviato da una scheda, selezione di due personaggi distinti, ricerca e suggerimenti, filtri, preferiti, cronologia, editor JSON, fonti e pagina 404.
- Controllati i percorsi mobile principali a 375 px: nessun overflow orizzontale e menu laterale funzionante.
- Nessun errore JavaScript rilevato nei test desktop e mobile nella manutenzione precedente.
- Per la revisione visuale del 20 novembre: tutti i 195 asset SVG caricati correttamente in Chromium nelle 14 sezioni; 0 immagini mancanti o rotte.
- Test interattivi finali: 15/15 superati (preferiti, cronologia, confronto, cambio lingua e tema, editor/validazione JSON, 404, menu e overflow mobile), senza errori JavaScript.

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

La verifica grafica offline incorpora temporaneamente il bundle locale e gli SVG per simulare il browser senza rete. Nel progetto pubblicabile, tutti i visual del catalogo risiedono nella cartella `assets/images/archive/` e non richiedono immagini remote.


## Identità visiva FogLabs (18 novembre 2026)

- Applicato l'emblema originale FA/book generato per The Forsaken Archive al marchio nella sidebar e al footer.
- Aggiunte favicon ICO multi-risoluzione, PNG 16/32/64 px, icona 512 px e Apple Touch Icon 180 px.
- Aggiunto `site.webmanifest` per supportare le icone del sito su browser e dispositivi compatibili.
- L'immagine sorgente è stata ottimizzata e ridimensionata per il web; non vengono caricati asset remoti.


### Catalogo visuale locale (20 novembre 2026)

- Generati 195 SVG originali FogLabs: 21 personaggi, 19 mappe, 90 abilità, 8 skin, 5 item, 12 effetti, 14 emote, 4 voci lore, 4 badge, 3 eventi, 7 aggiornamenti, 5 guide e 3 tier list.
- Ogni card di categoria e ogni scheda di dettaglio mostra il relativo visual locale; il comparatore mostra anche le due illustrazioni selezionate.
- Il selettore lingua aggiorna sia le etichette sia l'attributo `lang` del documento per accessibilità e strumenti di lettura.
- Preferiti, cronologia e homepage riutilizzano gli stessi asset locali.
- Rimossi i due vecchi hotlink immagine a Rowikis; nessuna API immagini esterna è necessaria.
- Aggiunto `tools/generate-archive-art.py` per rigenerare i visual quando si aggiornano i record JSON.
- Aggiunta al registro fonti la pagina About di Forsaken Wiki e il riferimento mappe ForsakenHub.
