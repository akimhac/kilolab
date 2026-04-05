# KiloLab - Product Requirements Document

## Vision
Le 1er service de laverie a domicile en France et Belgique.

## Architecture
- Frontend: React 18 + TypeScript + Vite + TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, RLS, Storage)
- Serverless: Vercel Functions (/api/)
- Paiements: Stripe | Emails: Resend | Push: Firebase
- i18n: react-i18next (FR/EN) | Maps: React-Leaflet

## Sprint 20 - Abonnement + Smart Assignment + Commercial (05/04/2026)
- [x] Page Abonnement dédiée (/subscription) - Formulaire 4 étapes avec AddressAutocomplete
- [x] Bouton "Créer mon abonnement" redirige vers /subscription (ClientDashboard)
- [x] Algorithme d'assignation intelligent par distance (Haversine) dans AdminDashboard
- [x] Washers triés par proximité GPS (vert <5km, orange <15km, rouge >15km)
- [x] Section réassignation aussi triée par distance avec affichage km
- [x] Purge du mot "voisins" de tout le codebase
- [x] Texte commercial intégré dans Landing.tsx (Parcours Client 5 étapes + "Pourquoi nos clients adorent Kilolab")
- [x] Texte commercial intégré dans BecomeWasher.tsx (Revenus 800€/mois, Liberté totale, Missions régulières + 4 étapes enrichies)
- [x] Tests: iteration_21.json + iteration_22.json - 100% pass

## Sprint 19 - Mega Bug Fix + Admin Enhanced (05/04/2026)
- [x] Fix avatar_url column error (ClientDashboard washer join)
- [x] WasherDashboard robustness (maybeSingle au lieu de single)
- [x] Validation adresse France + Belgique (data.gouv.fr + Nominatim OSM)
- [x] NewOrder rejette les adresses invalides (API verification obligatoire)
- [x] AccountSettings: adresse avec AddressAutocomplete
- [x] Securite: mot de passe avec loading + suppression compte dans meme onglet
- [x] Remboursement Stripe automatique (/api/stripe-refund.js)
- [x] Admin: modal washer enrichi (documents, commandes, disponibilite, supprimer)
- [x] Admin: modal client NOUVEAU (infos, commandes, envoyer message, supprimer)
- [x] Admin: tableaux responsives (cartes mobile)
- [x] Admin: changement de statut, reassignation, retrait washer
- [x] Tests: iteration_20.json - 100% pass

## Sprint 17-18 (01-03/04/2026)
- [x] Fix page blanche ClientDashboard, traductions FR/EN, preferences client, nettoyage RLS

## Sprint 1-16 (28/02-28/03/2026)
- [x] Landing, i18n, BecomeWasher, Heatmap, B2B, Admin, PWA, GPS, Auto-assignment, PhotoCapture, Rating, Invoice

## Flux de commande
1. Client commande -> pending -> paid (Stripe)
2. Washer voit (pending/confirmed/paid) et accepte -> assigned
3. Admin peut assigner/reassigner + notification email (washers triés par distance GPS)
4. picked_up -> washing -> ready -> completed
5. Annulation admin -> remboursement Stripe auto + email client

## Actions Admin
- Clients: voir details, commandes, envoyer message, supprimer
- Washers: voir documents, commandes, approuver/rejeter/bloquer, supprimer
- Commandes: assigner/reassigner/retirer washer (TRI PAR DISTANCE), changer statut, annuler+refund
- Vue responsive mobile (cartes au lieu de tableaux)

## Pages commerciales
- Landing.tsx: Parcours Client en 5 étapes + section "Pourquoi nos clients adorent Kilolab" + badge -15% abo
- BecomeWasher.tsx: 3 arguments forts (800€/mois, liberté, missions) + 4 étapes détaillées + simulateur revenus

## Backlog
- [ ] Traduction EN AdminDashboard (P2)
- [ ] SMS Twilio (P2)
- [ ] App mobile React Native (P3)

---
*Derniere MAJ: 05/04/2026 - Sprint 20*
