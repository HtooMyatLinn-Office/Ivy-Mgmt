import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PurchaseStatus, StockMovementType, StockReferenceType } from '@prisma/client';
import { PrismaService } from '../../../common/database/prisma.service';
import { AuditContext } from '../../../common/interfaces/audit-context.interface';
import { CreateItemDto } from '../dto/create-item.dto';
import { CreateDeliveryDto, DeliveryStatusDto } from '../dto/create-delivery.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { ReceiveDeliveryDto } from '../dto/receive-delivery.dto';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { InventoryRepository } from './inventory.repository.interface';

@Injectable()
export class PrismaInventoryRepository implements InventoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  private readonly deliveryStatus = DeliveryStatusDto;

  createItem(dto: CreateItemDto, audit: AuditContext) {
    const normalizedName = dto.name.trim();
    const normalizedCategory = dto.category.trim();
    const normalizedUnit = dto.unit.trim();

    return this.prisma.$transaction(async (tx) => {
      const existing = await tx.item.findFirst({
        where: {
          name: { equals: normalizedName, mode: 'insensitive' },
          category: { equals: normalizedCategory, mode: 'insensitive' },
        },
      });

      if (existing) {
        throw new ConflictException(
          `Item "${normalizedName}" already exists in category "${normalizedCategory}"`,
        );
      }

      return tx.item.create({
      data: {
        ...dto,
        name: normalizedName,
        category: normalizedCategory,
        unit: normalizedUnit,
        createdBy: audit.actorId,
        updatedBy: audit.actorId,
      },
    });
    });
  }

  listItems(skip: number, take: number) {
    return this.prisma.item.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  countItems() {
    return this.prisma.item.count();
  }

  async getItemById(itemId: string) {
    const item = await this.prisma.item.findUnique({ where: { id: itemId } });
    if (!item) {
      throw new NotFoundException(`Item ${itemId} not found`);
    }
    return item;
  }

  async updateItem(itemId: string, dto: UpdateItemDto, audit: AuditContext) {
    await this.getItemById(itemId);
    const name = dto.name?.trim();
    const category = dto.category?.trim();
    const unit = dto.unit?.trim();

    if (name || category) {
      const current = await this.prisma.item.findUnique({ where: { id: itemId } });
      const finalName = name ?? current?.name ?? '';
      const finalCategory = category ?? current?.category ?? '';
      const duplicate = await this.prisma.item.findFirst({
        where: {
          id: { not: itemId },
          name: { equals: finalName, mode: 'insensitive' },
          category: { equals: finalCategory, mode: 'insensitive' },
        },
      });
      if (duplicate) {
        throw new ConflictException(
          `Item "${finalName}" already exists in category "${finalCategory}"`,
        );
      }
    }

    return this.prisma.item.update({
      where: { id: itemId },
      data: {
        ...dto,
        name,
        category,
        unit,
        updatedBy: audit.actorId,
      },
    });
  }

  async deleteItem(itemId: string) {
    await this.getItemById(itemId);
    const [purchaseItemCount, stockMovementCount] = await Promise.all([
      this.prisma.purchaseItem.count({ where: { itemId } }),
      this.prisma.stockMovement.count({ where: { itemId } }),
    ]);
    if (purchaseItemCount > 0 || stockMovementCount > 0) {
      throw new BadRequestException('Item cannot be deleted because it has existing transactions');
    }
    await this.prisma.inventory.deleteMany({ where: { itemId } });
    await (this.prisma as any).deliveryItem?.deleteMany?.({ where: { itemId } });
    return this.prisma.item.delete({ where: { id: itemId } });
  }

  createSupplier(dto: CreateSupplierDto, audit: AuditContext) {
    return this.prisma.supplier.create({
      data: {
        ...dto,
        createdBy: audit.actorId,
        updatedBy: audit.actorId,
      },
    });
  }

  listSuppliers(skip: number, take: number) {
    return this.prisma.supplier.findMany({
      skip,
      take,
      orderBy: { createdAt: 'desc' },
    });
  }

  countSuppliers() {
    return this.prisma.supplier.count();
  }

  async getSupplierById(supplierId: string) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) {
      throw new NotFoundException(`Supplier ${supplierId} not found`);
    }
    return supplier;
  }

  async updateSupplier(supplierId: string, dto: UpdateSupplierDto, audit: AuditContext) {
    await this.getSupplierById(supplierId);
    return this.prisma.supplier.update({
      where: { id: supplierId },
      data: {
        ...dto,
        name: dto.name?.trim(),
        phone: dto.phone?.trim(),
        address: dto.address?.trim(),
        updatedBy: audit.actorId,
      },
    });
  }

  async deleteSupplier(supplierId: string) {
    await this.getSupplierById(supplierId);
    const purchaseCount = await this.prisma.purchase.count({ where: { supplierId } });
    if (purchaseCount > 0) {
      throw new BadRequestException('Supplier cannot be deleted because linked purchases exist');
    }
    return this.prisma.supplier.delete({ where: { id: supplierId } });
  }

  async createPurchase(dto: CreatePurchaseDto, audit: AuditContext) {
    const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplierId } });
    if (!supplier) {
      throw new NotFoundException(`Supplier ${dto.supplierId} not found`);
    }

    const itemIds = dto.items.map((x) => x.itemId);
    const existingItems = await this.prisma.item.findMany({ where: { id: { in: itemIds } } });
    if (existingItems.length !== itemIds.length) {
      throw new BadRequestException('One or more purchase items reference invalid item ids');
    }

    return this.prisma.purchase.create({
      data: {
        supplierId: dto.supplierId,
        orderDate: new Date(),
        deliveryDate: null,
        status: PurchaseStatus.ORDERED,
        createdBy: audit.actorId,
        updatedBy: audit.actorId,
        items: {
          create: dto.items.map((item) => ({
            itemId: item.itemId,
            quantity: item.quantity,
            costPrice: item.costPrice,
            createdBy: audit.actorId,
          })),
        },
      },
      include: {
        items: true,
      },
    });
  }

  listPurchases(skip: number, take: number) {
    return this.prisma.purchase.findMany({
      skip,
      take,
      include: {
        supplier: true,
        items: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  countPurchases() {
    return this.prisma.purchase.count();
  }

  async getPurchaseById(purchaseId: string) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { items: true, supplier: true },
    });
    if (!purchase) {
      throw new NotFoundException(`Purchase ${purchaseId} not found`);
    }
    return purchase;
  }

  async updatePurchase(purchaseId: string, dto: UpdatePurchaseDto, audit: AuditContext) {
    const purchase = await this.getPurchaseById(purchaseId);
    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Received purchase cannot be edited');
    }

    if (dto.supplierId) {
      const supplier = await this.prisma.supplier.findUnique({ where: { id: dto.supplierId } });
      if (!supplier) {
        throw new NotFoundException(`Supplier ${dto.supplierId} not found`);
      }
    }

    return this.prisma.purchase.update({
      where: { id: purchaseId },
      data: {
        supplierId: dto.supplierId,
        orderDate: dto.orderDate ? new Date(dto.orderDate) : undefined,
        deliveryDate: dto.deliveryDate ? new Date(dto.deliveryDate) : undefined,
        updatedBy: audit.actorId,
      },
      include: { items: true, supplier: true },
    });
  }

  async deletePurchase(purchaseId: string) {
    const purchase = await this.getPurchaseById(purchaseId);
    if (purchase.status === PurchaseStatus.RECEIVED) {
      throw new BadRequestException('Received purchase cannot be deleted');
    }
    await (this.prisma as any).delivery?.deleteMany?.({ where: { purchaseId } });
    await this.prisma.purchaseItem.deleteMany({ where: { purchaseId } });
    return this.prisma.purchase.delete({ where: { id: purchaseId } });
  }

  async receivePurchase(purchaseId: string, receivedDate: Date, audit: AuditContext) {
    return this.prisma.$transaction(async (tx) => {
      const purchase = await tx.purchase.findUnique({
        where: { id: purchaseId },
        include: { items: true },
      });

      if (!purchase) {
        throw new NotFoundException(`Purchase ${purchaseId} not found`);
      }
      if (purchase.status === PurchaseStatus.RECEIVED) {
        throw new BadRequestException('Purchase already received');
      }

      await tx.purchase.update({
        where: { id: purchaseId },
        data: {
          status: PurchaseStatus.RECEIVED,
          receivedDate,
          updatedBy: audit.actorId,
        },
      });

      for (const line of purchase.items) {
        await tx.stockMovement.create({
          data: {
            itemId: line.itemId,
            type: StockMovementType.IN,
            quantity: line.quantity,
            referenceType: StockReferenceType.PURCHASE,
            referenceId: purchaseId,
            createdBy: audit.actorId,
          },
        });

        await tx.inventory.upsert({
          where: { itemId: line.itemId },
          create: {
            itemId: line.itemId,
            currentStock: line.quantity,
            createdBy: audit.actorId,
            updatedBy: audit.actorId,
          },
          update: {
            currentStock: {
              increment: line.quantity,
            },
            updatedBy: audit.actorId,
          },
        });
      }

      return tx.purchase.findUnique({
        where: { id: purchaseId },
        include: { items: true, supplier: true },
      });
    });
  }

  async createDelivery(purchaseId: string, dto: CreateDeliveryDto, audit: AuditContext) {
    const purchase = await this.prisma.purchase.findUnique({
      where: { id: purchaseId },
      include: { items: true },
    });

    if (!purchase) {
      throw new NotFoundException(`Purchase ${purchaseId} not found`);
    }

    if (dto.supplierId !== purchase.supplierId) {
      throw new BadRequestException('Delivery supplierId must match purchase supplierId');
    }

    const purchaseItemIds = new Set(purchase.items.map((item) => item.itemId));
    for (const line of dto.items) {
      if (!purchaseItemIds.has(line.itemId)) {
        throw new BadRequestException(`Item ${line.itemId} is not part of purchase ${purchaseId}`);
      }
    }

    const prismaUnsafe = this.prisma as any;
    return prismaUnsafe.delivery.create({
      data: {
        purchaseId,
        supplierId: dto.supplierId,
        buyerId: dto.buyerId.trim(),
        shopId: dto.shopId.trim(),
        vehicleType: dto.vehicleType.trim(),
        vehicleNumber: dto.vehicleNumber.trim(),
        driverName: dto.driverName.trim(),
        driverPhone: dto.driverPhone.trim(),
        status: dto.status ?? this.deliveryStatus.PENDING,
        deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : null,
        notes: dto.notes?.trim(),
        createdBy: audit.actorId,
        updatedBy: audit.actorId,
        items: {
          create: dto.items.map((item) => ({
            itemId: item.itemId,
            orderedQty: item.orderedQty,
            deliveredQty: item.deliveredQty,
            acceptedQty: item.acceptedQty,
            damagedQty: item.damagedQty ?? '0',
            remarks: item.remarks?.trim(),
            createdBy: audit.actorId,
          })),
        },
      },
      include: {
        items: true,
        supplier: true,
      },
    });
  }

  listDeliveries(purchaseId: string, skip: number, take: number) {
    const prismaUnsafe = this.prisma as any;
    return prismaUnsafe.delivery.findMany({
      where: { purchaseId },
      skip,
      take,
      include: {
        items: {
          include: {
            item: true,
          },
        },
        supplier: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  countDeliveries(purchaseId: string) {
    const prismaUnsafe = this.prisma as any;
    return prismaUnsafe.delivery.count({
      where: { purchaseId },
    });
  }

  async getDeliveryById(deliveryId: string) {
    const delivery = await (this.prisma as any).delivery.findUnique({
      where: { id: deliveryId },
      include: {
        items: { include: { item: true } },
        supplier: true,
        purchase: true,
      },
    });
    if (!delivery) {
      throw new NotFoundException(`Delivery ${deliveryId} not found`);
    }
    return delivery;
  }

  async updateDelivery(deliveryId: string, dto: UpdateDeliveryDto, audit: AuditContext) {
    const delivery = await this.getDeliveryById(deliveryId);
    if (delivery.status === this.deliveryStatus.RECEIVED) {
      throw new BadRequestException('Received delivery cannot be edited');
    }
    if (dto.supplierId && dto.supplierId !== delivery.purchase.supplierId) {
      throw new BadRequestException('Delivery supplierId must match purchase supplierId');
    }

    const tx = this.prisma as any;
    return tx.$transaction(async (trx: any) => {
      if (dto.items?.length) {
        const purchaseItems = await this.prisma.purchaseItem.findMany({
          where: { purchaseId: delivery.purchaseId },
          select: { itemId: true },
        });
        const purchaseItemIds = new Set(purchaseItems.map((item) => item.itemId));
        for (const line of dto.items) {
          if (!purchaseItemIds.has(line.itemId)) {
            throw new BadRequestException(
              `Item ${line.itemId} is not part of purchase ${delivery.purchaseId}`,
            );
          }
        }
        await trx.deliveryItem.deleteMany({ where: { deliveryId } });
        await trx.deliveryItem.createMany({
          data: dto.items.map((item) => ({
            deliveryId,
            itemId: item.itemId,
            orderedQty: item.orderedQty,
            deliveredQty: item.deliveredQty,
            acceptedQty: item.acceptedQty,
            damagedQty: item.damagedQty ?? '0',
            remarks: item.remarks?.trim(),
            createdBy: audit.actorId,
          })),
        });
      }

      await trx.delivery.update({
        where: { id: deliveryId },
        data: {
          supplierId: dto.supplierId,
          buyerId: dto.buyerId?.trim(),
          shopId: dto.shopId?.trim(),
          vehicleType: dto.vehicleType?.trim(),
          vehicleNumber: dto.vehicleNumber?.trim(),
          driverName: dto.driverName?.trim(),
          driverPhone: dto.driverPhone?.trim(),
          status: dto.status,
          deliveredAt: dto.deliveredAt ? new Date(dto.deliveredAt) : undefined,
          notes: dto.notes?.trim(),
          updatedBy: audit.actorId,
        },
      });

      return trx.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          items: { include: { item: true } },
          supplier: true,
          purchase: true,
        },
      });
    });
  }

  async deleteDelivery(deliveryId: string) {
    const delivery = await this.getDeliveryById(deliveryId);
    if (delivery.status === this.deliveryStatus.RECEIVED) {
      throw new BadRequestException('Received delivery cannot be deleted');
    }
    const prismaUnsafe = this.prisma as any;
    await prismaUnsafe.deliveryItem.deleteMany({ where: { deliveryId } });
    return prismaUnsafe.delivery.delete({ where: { id: deliveryId } });
  }

  async receiveDelivery(deliveryId: string, dto: ReceiveDeliveryDto, audit: AuditContext) {
    return this.prisma.$transaction(async (tx) => {
      const txUnsafe = tx as any;
      const delivery = await txUnsafe.delivery.findUnique({
        where: { id: deliveryId },
        include: { items: true, purchase: true },
      });

      if (!delivery) {
        throw new NotFoundException(`Delivery ${deliveryId} not found`);
      }

      if (delivery.status === this.deliveryStatus.RECEIVED) {
        throw new BadRequestException('Delivery already received');
      }

      const updatesByItemId = new Map(dto.items?.map((item) => [item.itemId, item]) ?? []);
      const acceptedPositiveItemIds: string[] = [];

      for (const existingLine of delivery.items) {
        const requestedUpdate = updatesByItemId.get(existingLine.itemId);
        const acceptedQty = requestedUpdate?.acceptedQty ?? existingLine.acceptedQty.toString();
        const damagedQty = requestedUpdate?.damagedQty ?? existingLine.damagedQty.toString();

        const acceptedDecimal = new Prisma.Decimal(acceptedQty);
        const deliveredDecimal = existingLine.deliveredQty;
        if (acceptedDecimal.greaterThan(deliveredDecimal)) {
          throw new BadRequestException(
            `Accepted quantity cannot exceed delivered quantity for item ${existingLine.itemId}`,
          );
        }

        await txUnsafe.deliveryItem.update({
          where: { id: existingLine.id },
          data: {
            acceptedQty,
            damagedQty,
            remarks: requestedUpdate?.remarks?.trim() ?? existingLine.remarks,
          },
        });

        if (acceptedDecimal.greaterThan(0)) {
          acceptedPositiveItemIds.push(existingLine.itemId);
          await txUnsafe.stockMovement.create({
            data: {
              itemId: existingLine.itemId,
              type: StockMovementType.IN,
              quantity: acceptedQty,
              referenceType: StockReferenceType.PURCHASE,
              referenceId: delivery.id,
              createdBy: audit.actorId,
            },
          });

          await txUnsafe.inventory.upsert({
            where: { itemId: existingLine.itemId },
            create: {
              itemId: existingLine.itemId,
              currentStock: acceptedQty,
              createdBy: audit.actorId,
              updatedBy: audit.actorId,
            },
            update: {
              currentStock: { increment: acceptedQty },
              updatedBy: audit.actorId,
            },
          });
        }
      }

      const status = acceptedPositiveItemIds.length === delivery.items.length
        ? this.deliveryStatus.RECEIVED
        : acceptedPositiveItemIds.length > 0
          ? this.deliveryStatus.PARTIAL
          : this.deliveryStatus.CANCELLED;

      await txUnsafe.delivery.update({
        where: { id: deliveryId },
        data: {
          status,
          receivedAt: dto.receivedAt ? new Date(dto.receivedAt) : new Date(),
          notes: dto.notes?.trim() ?? delivery.notes,
          updatedBy: audit.actorId,
        },
      });

      // Mark purchase as received once all linked deliveries are fully received.
      const remaining = await txUnsafe.delivery.count({
        where: {
          purchaseId: delivery.purchaseId,
          status: {
            in: [this.deliveryStatus.PENDING, this.deliveryStatus.IN_TRANSIT, this.deliveryStatus.PARTIAL],
          },
        },
      });

      if (remaining === 0) {
        await txUnsafe.purchase.update({
          where: { id: delivery.purchaseId },
          data: {
            status: PurchaseStatus.RECEIVED,
            receivedDate: dto.receivedAt ? new Date(dto.receivedAt) : new Date(),
            updatedBy: audit.actorId,
          },
        });
      }

      return txUnsafe.delivery.findUnique({
        where: { id: deliveryId },
        include: {
          items: {
            include: {
              item: true,
            },
          },
          supplier: true,
          purchase: true,
        },
      });
    });
  }

  getInventory(skip: number, take: number) {
    return this.prisma.inventory.findMany({
      skip,
      take,
      include: {
        item: true,
      },
      orderBy: { lastUpdated: 'desc' },
    });
  }

  countInventory() {
    return this.prisma.inventory.count();
  }

  getLowStock(skip: number, take: number) {
    return this.prisma.$queryRaw<
      Array<{
        itemId: string;
        currentStock: string;
        lastUpdated: Date;
        itemName: string;
        category: string;
        unit: string;
        minStockLevel: string;
      }>
    >`
      SELECT
        i.item_id AS "itemId",
        i.current_stock::text AS "currentStock",
        i.last_updated AS "lastUpdated",
        it.name AS "itemName",
        it.category AS "category",
        it.unit AS "unit",
        it.min_stock_level::text AS "minStockLevel"
      FROM inventory i
      INNER JOIN items it ON it.id = i.item_id
      WHERE i.current_stock < it.min_stock_level
      ORDER BY i.current_stock ASC
      OFFSET ${skip}
      LIMIT ${take}
    `;
  }

  async countLowStock() {
    const rows = await this.prisma.$queryRaw<Array<{ total: bigint }>>`
      SELECT COUNT(*)::bigint AS total
      FROM inventory i
      INNER JOIN items it ON it.id = i.item_id
      WHERE i.current_stock < it.min_stock_level
    `;
    return Number(rows[0]?.total ?? 0);
  }
}
