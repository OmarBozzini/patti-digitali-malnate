# Patti Digitali Malnate

Sito del Patto Digitale di Malnate: informazioni, calendario degli incontri per genitori e risorse per un uso consapevole della tecnologia.

Sito statico (HTML, CSS e un po' di JavaScript), senza strumenti di build. Pensato prima per smartphone, poi per laptop.

## Pagine

| File | Contenuto |
| --- | --- |
| `index.html` | Home |
| `il-patto.html` | Le regole, età per età |
| `calendario.html` | Incontri mese per mese |
| `materiali.html` | Guide, manifesti, libri, siti utili, 5 passi verso il primo smartphone |
| `newsletter.html` | Iscrizione e archivio dei numeri |
| `chi-siamo.html` | La nostra strada, sondaggio, contatti |
| `404.html` | Pagina non trovata |

Intestazione e piè di pagina sono scritti in ogni pagina: se cambi un link del menu, cambialo in tutte.

## Come aggiornare

- **Calendario**: modifica `data/eventi.json`. Per aggiungere una data scrivi `"data": "2027-01-20"` e `"ora": "20:30"`; per il luogo, `"luogo"`. Gli stati possibili sono `Da organizzare`, `In preparazione`, `Confermato`, `Svolto`. Il primo incontro non ancora svolto compare come "Prossimo".
- **Newsletter**: aggiungi i numeri in `data/newsletter.json`.
- **Testi e link**: direttamente nei file `.html`.
- **Colori e caratteri**: in cima a `assets/css/style.css` (variabili `--navy`, `--orange`, ...).

## Provarlo sul proprio computer

Il calendario legge i file in `data/`, quindi serve un piccolo server locale (aprire il file con doppio clic non basta):

```
python3 -m http.server 8000
```

poi apri http://localhost:8000.

## Stile

- Colori: blu notte `#13294B`, arancio `#EE7D1B`, pesca `#F4B27A` / `#FCE7D3`, crema `#FBF8F3`, azzurro `#E3F0FA`.
- Caratteri: Bricolage Grotesque (titoli) e Figtree (testi), ospitati nel sito (`assets/fonts/`), senza richieste a Google.
- Nessuna foto di persone o bambini: solo illustrazioni e icone.
- Il sito non usa cookie né strumenti di tracciamento.

## Pubblicazione

Sono tutti file statici: vanno bene Netlify, Cloudflare Pages o GitHub Pages. Quando il sito avrà un indirizzo definitivo, in ogni pagina conviene rendere assoluto il link dell'immagine di anteprima (`og:image`) per le condivisioni sui social.

## Loghi

I loghi di Patti Digitali, Città di Malnate e Patto Educativo di Comunità appartengono ai rispettivi titolari.
