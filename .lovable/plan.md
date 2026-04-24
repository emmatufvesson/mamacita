

## Sprint 4 — Tillägg (reviderat): köksvyer per produkt, lämna serveringsvyn orörd

Mål: filtrera grill- och tillbehörsvyerna per produkt via `station`, ta bort allergener i dessa två vyer, och uppdatera rusningstiderna. **`ServingStation` lämnas helt orörd** (samma layout, samma logik, samma kolumner som idag).

---

### 1. `GrillStation` — per produkt på `station === "grill"`

- Bygg listan genom att iterera alla aktiva ordrar och plocka ut varje `OrderItem` där `findProduct(item.productId)?.station === "grill"`. En rad per item.
- Sortering: `createdAt` stigande (FIFO). Ordernumret visas på varje rad.
- Visa endast `customizations` och `extras` som hör till just det item:et (ingen läckage från andra items i samma order).
- **Ta bort kolumnen "Allergener"** helt.
- Klar-knapp per rad (lokal UI-state). När alla grill-rader för en order är toggled, anropa befintlig `markGrillDone(orderId)` automatiskt. Datamodellen är oförändrad.

### 2. `SidesStation` — per produkt på `station === "tillbehör"`

- En rad per `OrderItem` där `findProduct(item.sideId)?.station === "tillbehör"`. Items utan `sideId` visas inte.
- Visa tillbehörets namn och kvantitet. **Inga** anpassningar/tillägg från huvudburgaren visas (de hör till grillen). Markeringskolumnen döljs eller lämnas tom.
- **Ta bort kolumnen "Allergener"** helt.
- Behåll befintlig markering "⚠ Grill klar – väntar på tillbehör" på relevanta rader.
- Klar-knapp per rad med samma aggregeringslogik som grillvyn → anropar `markSidesDone(orderId)` när alla tillbehörsrader för ordern är klara.

### 3. `ServingStation` — **ingen ändring**

Lämnas helt orörd. Samma kolumner, samma per-order-logik, samma allergener (om några visas där idag), samma knappar `markServingReady` / `markPickedUp`. Inga refaktoreringar, inga sammanställningsblock, inga drycksrader.

### 4. Uppdatera rusningstider

I `src/data/menu.json`, ersätt `config.rushHours`:
```text
[
  { "start": "10:10", "end": "11:00" },
  { "start": "13:30", "end": "14:30" }
]
```
Ingen kodändring i `src/lib/rush.ts`.

---

### Filer som påverkas

- `src/data/menu.json` — endast `config.rushHours`.
- `src/pages/GrillStation.tsx` — per-item-rendering på `station === "grill"`, ta bort allergenkolumn, per-rad-klar med order-aggregering.
- `src/pages/SidesStation.tsx` — per-item-rendering på `findProduct(sideId)?.station === "tillbehör"`, dölj burgar-mods, ta bort allergenkolumn, per-rad-klar med order-aggregering.

`ServingStation.tsx`, `OrderContext`, `PickupScreen` och kundvy: oförändrade.

---

### Vad som saknas i underlaget

- **Per-rad vs per-order klarmarkering**: vi tolkar att en station räknas klar för en order när alla dess rader är klara. Säg till om varje rad ska kunna stängas helt fristående (kräver utökning av datamodellen).
- **Tillbehör utan grill-koppling**: i nuvarande JSON är tillbehör alltid kopplade till en burgare via `sideId`; lösa tillbehörs-ordrar finns inte i flödet.

---

### Tidsuppskattning för en junior utvecklare

| Uppgift | Tid |
|---|---|
| Refaktorera `GrillStation` (per-item, ta bort allergener) | 2–3h |
| Refaktorera `SidesStation` (filtrera på sideId-station, mods bort, allergener bort) | 2–3h |
| Per-rad-klar-logik som aggregerar till order-status (delas mellan grill + sides) | 2–3h |
| Uppdatera `rushHours` i JSON + verifiering | 0,5h |
| Testning (alla flöden, ordrar med/utan skip, rusning) och buggfix | 1,5–2h |
| **Totalt** | **8–11,5h (ca 1–1,5 arbetsdag)** |

