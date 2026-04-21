import { Inject, Injectable, Logger } from '@nestjs/common';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { AuditContext } from '../../../common/interfaces/audit-context.interface';
import { getSkipTake, toPaginatedResult } from '../../../common/utils/pagination.util';
import { CreateItemDto } from '../dto/create-item.dto';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { ReceiveDeliveryDto } from '../dto/receive-delivery.dto';
import { ReceivePurchaseDto } from '../dto/receive-purchase.dto';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';
import { INVENTORY_REPOSITORY, InventoryRepository } from '../repositories/inventory.repository.interface';
import { InventoryServiceContract } from './inventory.service.interface';

@Injectable()
export class InventoryService implements InventoryServiceContract {
  private readonly logger = new Logger(InventoryService.name);

  constructor(
    @Inject(INVENTORY_REPOSITORY)
    private readonly repository: InventoryRepository,
  ) {}

  async createItem(dto: CreateItemDto, audit: AuditContext) {
    this.logger.log(`Creating item: ${dto.name} by ${audit.actorId}`);
    return this.repository.createItem(dto, audit);
  }

  async getItemById(itemId: string) {
    return this.repository.getItemById(itemId);
  }

  async updateItem(itemId: string, dto: UpdateItemDto, audit: AuditContext) {
    this.logger.log(`Updating item: ${itemId} by ${audit.actorId}`);
    return this.repository.updateItem(itemId, dto, audit);
  }

  async deleteItem(itemId: string) {
    this.logger.log(`Deleting item: ${itemId}`);
    return this.repository.deleteItem(itemId);
  }

  async listItems(query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.listItems(skip, take),
      this.repository.countItems(),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }

  async createSupplier(dto: CreateSupplierDto, audit: AuditContext) {
    this.logger.log(`Creating supplier: ${dto.name} by ${audit.actorId}`);
    return this.repository.createSupplier(dto, audit);
  }

  async getSupplierById(supplierId: string) {
    return this.repository.getSupplierById(supplierId);
  }

  async updateSupplier(supplierId: string, dto: UpdateSupplierDto, audit: AuditContext) {
    this.logger.log(`Updating supplier: ${supplierId} by ${audit.actorId}`);
    return this.repository.updateSupplier(supplierId, dto, audit);
  }

  async deleteSupplier(supplierId: string) {
    this.logger.log(`Deleting supplier: ${supplierId}`);
    return this.repository.deleteSupplier(supplierId);
  }

  async listSuppliers(query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.listSuppliers(skip, take),
      this.repository.countSuppliers(),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }

  async createPurchase(dto: CreatePurchaseDto, audit: AuditContext) {
    this.logger.log(`Creating purchase for supplier: ${dto.supplierId} by ${audit.actorId}`);
    return this.repository.createPurchase(dto, audit);
  }

  async getPurchaseById(purchaseId: string) {
    return this.repository.getPurchaseById(purchaseId);
  }

  async updatePurchase(purchaseId: string, dto: UpdatePurchaseDto, audit: AuditContext) {
    this.logger.log(`Updating purchase: ${purchaseId} by ${audit.actorId}`);
    return this.repository.updatePurchase(purchaseId, dto, audit);
  }

  async deletePurchase(purchaseId: string) {
    this.logger.log(`Deleting purchase: ${purchaseId}`);
    return this.repository.deletePurchase(purchaseId);
  }

  async listPurchases(query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.listPurchases(skip, take),
      this.repository.countPurchases(),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }

  async receivePurchase(purchaseId: string, dto: ReceivePurchaseDto, audit: AuditContext) {
    this.logger.log(`Receiving purchase: ${purchaseId} by ${audit.actorId}`);
    const receivedDate = dto.receivedDate ? new Date(dto.receivedDate) : new Date();
    return this.repository.receivePurchase(purchaseId, receivedDate, audit);
  }

  async createDelivery(purchaseId: string, dto: CreateDeliveryDto, audit: AuditContext) {
    this.logger.log(`Creating delivery for purchase: ${purchaseId} by ${audit.actorId}`);
    return this.repository.createDelivery(purchaseId, dto, audit);
  }

  async listDeliveries(purchaseId: string, query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.listDeliveries(purchaseId, skip, take),
      this.repository.countDeliveries(purchaseId),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }

  async getDeliveryById(deliveryId: string) {
    return this.repository.getDeliveryById(deliveryId);
  }

  async updateDelivery(deliveryId: string, dto: UpdateDeliveryDto, audit: AuditContext) {
    this.logger.log(`Updating delivery: ${deliveryId} by ${audit.actorId}`);
    return this.repository.updateDelivery(deliveryId, dto, audit);
  }

  async deleteDelivery(deliveryId: string) {
    this.logger.log(`Deleting delivery: ${deliveryId}`);
    return this.repository.deleteDelivery(deliveryId);
  }

  async receiveDelivery(deliveryId: string, dto: ReceiveDeliveryDto, audit: AuditContext) {
    this.logger.log(`Receiving delivery: ${deliveryId} by ${audit.actorId}`);
    return this.repository.receiveDelivery(deliveryId, dto, audit);
  }

  async getInventory(query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.getInventory(skip, take),
      this.repository.countInventory(),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }

  async getLowStock(query: PaginationQueryDto) {
    const { skip, take } = getSkipTake(query.page, query.limit);
    const [data, total] = await Promise.all([
      this.repository.getLowStock(skip, take),
      this.repository.countLowStock(),
    ]);
    return toPaginatedResult(data, query.page, query.limit, total);
  }
}
