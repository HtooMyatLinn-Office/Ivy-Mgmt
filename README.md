# Warehouse Management Module (NestJS + Prisma)

Production-ready inventory module for a POS modular monolith with clean boundaries and extraction-friendly design.

## Folder Structure

```txt
src/
  app.module.ts
  main.ts
  common/
    database/
      prisma.module.ts
      prisma.service.ts
    dto/
      pagination-query.dto.ts
    enums/
      purchase-status.enum.ts
      stock-movement-type.enum.ts
      stock-reference-type.enum.ts
    utils/
      pagination.util.ts
  modules/
    inventory/
      controllers/
        items.controller.ts
        suppliers.controller.ts
        purchases.controller.ts
        inventory.controller.ts
      dto/
        create-item.dto.ts
        create-supplier.dto.ts
        create-purchase.dto.ts
        receive-purchase.dto.ts
      entities/
        item.entity.ts
        supplier.entity.ts
        purchase.entity.ts
        stock-movement.entity.ts
        inventory.entity.ts
      interfaces/
        item.interface.ts
        supplier.interface.ts
        purchase.interface.ts
        inventory.interface.ts
      repositories/
        inventory.repository.interface.ts
        prisma-inventory.repository.ts
      services/
        inventory.service.interface.ts
        inventory.service.ts
      inventory.module.ts
prisma/
  schema.prisma
  seed.ts
```

## Key Business Rules Implemented

- Stock is never directly changed from purchase creation.
- Stock updates happen only via `stock_movements` during receive flow.
- `receivePurchase` runs inside a DB transaction.
- Inventory and low-stock APIs are paginated.
- Services and repositories are interface-driven for future microservice extraction.

## API Endpoints

- `POST /api/inventory/items`
- `GET /api/inventory/items?page=1&limit=20`
- `POST /api/inventory/suppliers`
- `GET /api/inventory/suppliers?page=1&limit=20`
- `POST /api/inventory/purchases`
- `GET /api/inventory/purchases?page=1&limit=20`
- `PUT /api/inventory/purchases/:id/receive`
- `GET /api/inventory/stock?page=1&limit=20`
- `GET /api/inventory/low-stock?page=1&limit=20`
- Swagger UI: `GET /api/docs`

## Audit Trail

- Send optional header `x-user-id` on write endpoints.
- If not provided, system stores actor as `system`.
- Audit columns are persisted on core write tables (`created_by`, `updated_by`).

## Example Responses

### Create Item

```json
{
  "id": "80fb4cad-2144-43c6-84eb-430c26d253f2",
  "name": "Portland Cement",
  "category": "Cement",
  "unit": "bag",
  "costPrice": "310.00",
  "sellingPrice": "360.00",
  "minStockLevel": "120.00",
  "createdAt": "2026-04-10T09:00:00.000Z"
}
```

### Get Inventory

```json
{
  "data": [
    {
      "itemId": "80fb4cad-2144-43c6-84eb-430c26d253f2",
      "currentStock": "200.00",
      "lastUpdated": "2026-04-10T11:00:00.000Z",
      "item": {
        "name": "Portland Cement",
        "category": "Cement",
        "unit": "bag"
      }
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

### Low Stock

```json
{
  "data": [
    {
      "itemId": "8ef9...",
      "currentStock": "4.00",
      "minStockLevel": "8.00",
      "itemName": "Rebar 12mm",
      "category": "Steel",
      "unit": "ton"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 1,
    "totalPages": 1
  }
}
```

## Setup

1. Copy `.env.example` to `.env`.
2. `npm install`
3. `npm run prisma:generate`
4. `npm run prisma:migrate -- --name init_inventory`
5. `npm run seed`
6. `npm run start:dev`

For audit + docs changes after initial setup:

7. `npm run prisma:migrate -- --name add_audit_fields`
