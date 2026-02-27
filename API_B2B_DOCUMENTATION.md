# API B2B Kilolab - Documentation

## Introduction

L'API B2B Kilolab permet aux partenaires (hôtels, Airbnb hosts, gyms, entreprises) d'intégrer notre service de laverie directement dans leur système.

## Base URL

```
https://kilolab.fr/api/b2b
```

## Authentification

Toutes les requêtes doivent inclure votre clé API dans le header :

```
X-API-Key: votre_cle_api
```

## Endpoints

### 1. Obtenir les tarifs

```http
GET /api/b2b?action=get-pricing
```

**Réponse:**
```json
{
  "success": true,
  "currency": "EUR",
  "partner_discount": "15%",
  "pricing": {
    "standard": {
      "price_per_kg": 2.55,
      "delivery_time": "48-72h",
      "description": "Lavage, séchage et pliage standard"
    },
    "express": {
      "price_per_kg": 4.25,
      "delivery_time": "24h",
      "description": "Service prioritaire avec livraison J+1"
    },
    "express_2h": {
      "price_per_kg": 6.80,
      "delivery_time": "24h (collecte en 2h)",
      "description": "Collecte en 2h chrono, livraison J+1"
    }
  },
  "minimum_weight_kg": 3,
  "maximum_weight_kg": 50
}
```

### 2. Vérifier la couverture

```http
GET /api/b2b?action=get-coverage
```

**Réponse:**
```json
{
  "success": true,
  "coverage": {
    "cities": ["Paris", "Lyon", "Marseille", "..."],
    "postal_codes": ["75001", "75002", "69001", "..."],
    "total_washers": 127
  }
}
```

### 3. Créer une commande

```http
POST /api/b2b?action=create-order
Content-Type: application/json

{
  "guest_name": "Jean Dupont",
  "guest_email": "jean.dupont@email.com",
  "guest_phone": "+33612345678",
  "pickup_address": "123 Rue de l'Hôtel, 75001 Paris",
  "delivery_address": "123 Rue de l'Hôtel, 75001 Paris",
  "weight_kg": 7,
  "formula": "express",
  "notes": "Chambre 402, départ le 25/12",
  "room_number": "402",
  "checkout_date": "2025-12-25",
  "preferred_pickup_date": "2025-12-23",
  "preferred_pickup_slot": "14h-16h"
}
```

**Paramètres obligatoires:**
- `guest_name` - Nom du client
- `pickup_address` - Adresse de collecte
- `weight_kg` - Poids estimé (3-50 kg)

**Paramètres optionnels:**
- `guest_email` - Email du client
- `guest_phone` - Téléphone du client
- `delivery_address` - Adresse de livraison (défaut: pickup_address)
- `formula` - `standard` | `express` | `express_2h` (défaut: standard)
- `notes` - Notes pour le Washer
- `room_number` - Numéro de chambre
- `checkout_date` - Date de checkout
- `preferred_pickup_date` - Date de collecte souhaitée
- `preferred_pickup_slot` - Créneau horaire souhaité

**Réponse:**
```json
{
  "success": true,
  "order": {
    "id": "uuid-de-la-commande",
    "reference": "HOTEL-1703512345678",
    "status": "pending",
    "total_price": 29.75,
    "currency": "EUR",
    "estimated_delivery": "24h"
  },
  "message": "Order created successfully"
}
```

### 4. Obtenir une commande

```http
GET /api/b2b?action=get-order&order_id=uuid-de-la-commande
```

**Réponse:**
```json
{
  "success": true,
  "order": {
    "id": "uuid-de-la-commande",
    "reference": "HOTEL-1703512345678",
    "status": "washing",
    "guest_name": "Jean Dupont",
    "weight_kg": 7,
    "total_price": 29.75,
    "currency": "EUR",
    "created_at": "2025-12-23T14:30:00Z",
    "picked_up_at": "2025-12-23T15:45:00Z",
    "completed_at": null,
    "washer_assigned": true
  }
}
```

### 5. Lister les commandes

```http
GET /api/b2b?action=list-orders&status=completed&limit=20&offset=0
```

**Paramètres de filtrage:**
- `status` - Filtrer par statut
- `limit` - Nombre de résultats (défaut: 50, max: 100)
- `offset` - Pagination
- `from_date` - Date de début (ISO 8601)
- `to_date` - Date de fin (ISO 8601)

**Réponse:**
```json
{
  "success": true,
  "orders": [
    {
      "id": "uuid-1",
      "reference": "HOTEL-1703512345678",
      "status": "completed",
      "guest_name": "Jean Dupont",
      "weight_kg": 7,
      "total_price": 29.75,
      "created_at": "2025-12-23T14:30:00Z"
    }
  ],
  "pagination": {
    "total": 156,
    "limit": 20,
    "offset": 0
  }
}
```

## Statuts de commande

| Statut | Description |
|--------|-------------|
| `pending` | En attente d'assignation |
| `assigned` | Washer assigné |
| `picked_up` | Linge collecté |
| `washing` | Lavage en cours |
| `ready` | Prêt pour livraison |
| `completed` | Livré |
| `cancelled` | Annulé |

## Codes d'erreur

| Code | Description |
|------|-------------|
| 400 | Requête invalide |
| 401 | Clé API invalide ou manquante |
| 404 | Ressource non trouvée |
| 405 | Méthode non autorisée |
| 500 | Erreur serveur |

## Webhooks (Coming Soon)

Bientôt disponible : notifications automatiques lors des changements de statut.

## Support

Pour obtenir votre clé API ou pour toute question :
- Email: b2b@kilolab.fr
- Documentation: https://kilolab.fr/api-docs

---

*Version API: 1.0*
*Dernière mise à jour: Décembre 2025*
