# CORSAIR LEDGER — Game Design Document v0.1

> Browser-based fleet management game. Inspired by the Kenway's Fleet mini-game
> from Assassin's Creed IV: Black Flag, reimagined as a standalone experience.

---

## 1. Concept

**Genere:** Gestionale / Strategia leggera  
**Piattaforma:** Web (HTML/CSS/JS), desktop browser  
**Salvataggio:** localStorage con export JSON manuale  
**Monetizzazione:** Prevista in Fase 2 (freemium o one-time unlock)  
**Lingua:** Inglese (internazionale)  
**Tono:** Cartografico, stilizzato, anni '700 Caribbean

---

## 2. Logline

Sei un capitano corsaro del Settecento. Gestisci una flotta di navi
catturate, le mandi su rotte commerciali rischiose attraverso l'Atlantico,
raccogli risorse, sconfiggi avversari, e costruisci un impero marittimo
partendo da tre imbarcazioni scalcagnate.

---

## 3. Meccaniche Principali

### 3.1 La Mappa Navale
- Vista principale del gioco: mappa stilizzata dell'Atlantico (Caribbean,
  Nord America, Africa, Europa/Mediterraneo)
- Le **rotte** collegano porti tra loro come archi di un grafo
- Ogni rotta ha un **livello di pericolo**: Verde / Giallo / Arancione / Rosso
- Il pericolo si riduce vincendo battaglie navali su quella rotta
- Nuove rotte si sbloccano completando missioni

### 3.2 La Flotta
- Inizio: 3 navi
- Massimo: 15 navi (slot aggiuntivi da sbloccare con gemme)
- Ogni nave ha 4 statistiche:
  - **Cargo** — quantità di merci trasportabili
  - **Firepower** — potenza in battaglia
  - **Hull** — resistenza ai danni
  - **Speed** — riduce il tempo di completamento missione
- Tipi di nave (in ordine crescente di potenza):
  - Gunboat
  - Schooner
  - Brig
  - Frigate
  - Man O' War

### 3.3 Missioni Commerciali
- Si seleziona una rotta → si assegnano una o più navi → si avvia la missione
- La missione ha un **timer reale** (minuti/ore) al termine del quale
  si raccolgono le risorse
- Il tempo dipende dalla Speed delle navi assegnate
- Ogni missione richiede un carico specifico come "biglietto d'ingresso"
  (es. 10 casse di tabacco) e restituisce Reales + gemme + merci

### 3.4 Battaglie Navali
- Se la rotta è pericolosa, prima di commerciare si combatte
- Si selezionano le navi da schierare → il sistema calcola le **Odds of Success**
  in base a Firepower + Hull vs. forza nemica
- La battaglia si risolve automaticamente (no controllo diretto)
- Si può usare una **Fire Barrel** per aumentare le odds (risorsa rara)
- Risultato: Vittoria → rotta più sicura + gemme + merci random
  Sconfitta → navi danneggiate, nessun bottino

### 3.5 Risorse
| Risorsa | Uso |
|---------|-----|
| **Reales** | Valuta principale, guadagnata dalle missioni |
| **Gemmes** | Valuta secondaria, usata per riparazioni e nuovi dock |
| **Tabacco** | Cargo per missioni specifiche |
| **Vino** | Cargo per missioni specifiche |
| **Cacao** | Cargo per missioni specifiche |
| **Riso** | Cargo per missioni specifiche |
| **Olio d'oliva** | Cargo per missioni specifiche |
| **Fire Barrel** | Consumabile da battaglia, raro |

### 3.6 Progressione
- Completare missioni sblocca nuove rotte e nuovi porti
- Porti avanzati → missioni con reward maggiori
- Le navi non si upgradano direttamente: si sostituiscono con navi catturate
  (meccanica futura, Fase 2: acquisizione navi tramite eventi random)
- Milestone di flotta: 5 / 10 / 15 navi sbloccano bonus passivi

---

## 4. Economia di Gioco

```
FONTI DI ENTRATA:
  Missioni commerciali → Reales + cargo
  Battaglie vinte → Gemmes + cargo + Fire Barrels rare

USCITE:
  Riparazione navi → Gemmes
  Nuovi dock (slot flotta) → Gemmes
  Missioni con cargo richiesto → consumo merci in inventario

LOOP:
  Manda navi → aspetta timer → raccogli reward → ripara se necessario
  → sblocca rotta → manda navi migliori → repeat
```

---

## 5. Struttura UI

```
┌─────────────────────────────────────────────────────┐
│  CORSAIR LEDGER         [Reales: 0] [Gemmes: 0]    │
├─────────────────────────────────────────────────────┤
│                                                     │
│              MAPPA NAVALE (area principale)         │
│         nodi = porti, archi = rotte con colore      │
│                                                     │
├──────────────┬──────────────────────────────────────┤
│  FLOTTA      │  DETTAGLIO ROTTA / MISSIONE          │
│  [lista      │  (pannello laterale contestuale)     │
│   navi con   │  - info rotta selezionata            │
│   stats e    │  - missioni disponibili              │
│   stato]     │  - selezione navi da inviare         │
│              │  - odds of success                   │
│              │  - timer missioni attive             │
└──────────────┴──────────────────────────────────────┘
│  [Backup Save]  [Log eventi]  [Inventario merci]   │
└─────────────────────────────────────────────────────┘
```

---

## 6. Salvataggio e Persistenza

- **Salvataggio automatico** in localStorage ad ogni azione significativa
- **Export manuale** via pulsante "Save to File" → scarica `corsair-ledger-save.json`
- **Import** → carica file JSON per ripristinare progress
- Struttura save compatibile con futura migrazione Supabase (stessa struttura,
  diverso adapter)

```json
{
  "version": "1.0",
  "savedAt": "2025-05-10T...",
  "player": {
    "reales": 500,
    "gemmes": 20,
    "cargo": { "tobacco": 0, "wine": 5, "cocoa": 0, "rice": 10, "olive_oil": 0 },
    "fireBarrels": 1
  },
  "fleet": [
    { "id": "ship_001", "name": "La Speranza", "type": "schooner",
      "cargo": 20, "firepower": 8, "hull": 15, "speed": 12,
      "status": "docked", "damage": 0 }
  ],
  "routes": [
    { "id": "route_nassau_havana", "dangerLevel": 1, "unlocked": true }
  ],
  "activeMissions": [
    { "routeId": "route_nassau_havana", "shipIds": ["ship_001"],
      "completesAt": 1715000000000, "reward": { "reales": 200 } }
  ],
  "unlockedPorts": ["nassau", "havana"],
  "dockSlots": 5
}
```

---

## 7. Monetizzazione (Fase 2)

- **Free:** prime 5 rotte, max 8 navi, 1 missione attiva per volta
- **Captain's Edition (one-time ~4,99€):** tutte le rotte, 15 navi,
  missioni illimitate simultanee, skin cartografica alternativa
- Pagamenti: Paddle (gestione IVA EU inclusa)
- Nessun pay-to-win: il pagamento sblocca contenuto, non potenza

---

## 8. Stack Tecnico

| Layer | Tecnologia |
|-------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JS (ES modules) |
| Persistenza locale | localStorage + export JSON |
| Hosting MVP | GitHub Pages |
| Hosting Fase 2 | Netlify (con form/funzioni) |
| Backend Fase 2 | Supabase (auth + DB) |
| Pagamenti Fase 2 | Paddle |
| Dev tool | Claude Code |

---

## 9. Estetica e Art Direction

- **Palette:** carta invecchiata (beige/ocra), inchiostro scuro, accenti rosso-
  mattone e oro
- **Font:** serif antico per titoli, monospace leggero per stats e numeri
- **Mappa:** stile cartografia nautica '700, linee a mano, rosa dei venti
- **Icone navi:** silhouette SVG stilizzate, non realistiche
- **No asset Ubisoft:** tutto originale o royalty-free (OpenGameArt, itch.io)
- **Animazioni:** minimali ma presenti (nave che "naviga" sulla rotta,
  timer che scorre, danger level che cambia colore)

---

## 10. Roadmap

### Fase 1 — MVP (obiettivo: giocabile)
- [ ] Mappa navale con 5 rotte e 4 porti
- [ ] 3 tipi di nave (Gunboat, Schooner, Brig)
- [ ] Missioni commerciali con timer reale
- [ ] Battaglie con odds of success
- [ ] Economia base (Reales + Gemmes + 3 tipi cargo)
- [ ] Salvataggio localStorage + export JSON
- [ ] Deploy su GitHub Pages

### Fase 2 — Espansione
- [ ] 15+ rotte, mappa completa Atlantico
- [ ] 5 tipi di nave, acquisizione tramite eventi
- [ ] Inventario merci completo
- [ ] Account Supabase + migrazione save
- [ ] Monetizzazione Paddle
- [ ] Mobile responsive

### Fase 3 — Se scala
- [ ] Leaderboard globali
- [ ] Eventi stagionali (tempeste, pirati leggendari)
- [ ] Modalità sandbox senza timer reali

---

## 11. Note di Design

1. **Il timer reale è il cuore del gioco** — crea tensione passiva e invoglia
   a tornare. Non va eliminato, va calibrato (missioni base: 5-15 minuti;
   missioni avanzate: 1-4 ore).

2. **Le odds of success devono essere leggibili** — il giocatore deve capire
   subito se sta rischiando troppo. Usare linguaggio chiaro + colori.

3. **Non è un idle game** — richiede decisioni tattiche (quali navi inviare,
   quale rotta prioritizzare, quando riparare). Ma non è nemmeno stressante:
   si possono lasciare le navi in missione e tornare dopo.

4. **Il cheating su localStorage è accettabile in Fase 1** — chi bara si rovina
   il gioco da solo. In Fase 2 il server è fonte di verità.

5. **Ispirazione estetica:** Sunless Sea (cartografia dark), Slay the Spire
   (UI leggibile e densa), Kenway's Fleet originale (mappa a costellazioni).
