# Ametikohtade hindamise tööriist

Töö hindamise tööriist Eesti Majandus- ja Kommunikatsiooniministeeriumi metoodika alusel. Aitab täita EL palgaõigluse direktiivi (2023/970) nõudeid.

## Funktsioonid

- 4 faktorite gruppi, 12 alamfaktorit, 6 taset (1000p)
- Kohandatavad faktorite kaalud (lubatud vahemikes)
- Mitme ametikoha hindamine ja võrdlus
- Palgaastmete skaala: lineaarne või proportsionaalne
- PDF ja CSV eksport
- Seansi automaatsalvestus (localStorage)
- Eesti / inglise keel

## Paigaldus

```bash
npm install
npm run dev
```

Ava [http://localhost:3000](http://localhost:3000)

## Vercel deploy

```bash
npm install -g vercel
vercel
```

Või ühenda GitHub repo Verceliga — iga push main-branchi deployb automaatselt.

## Tehnoloogia

- Next.js 14 (App Router)
- React 18
- TypeScript
- Vercel (hosting)
