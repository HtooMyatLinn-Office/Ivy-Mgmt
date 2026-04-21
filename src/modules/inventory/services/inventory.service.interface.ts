import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { AuditContext } from '../../../common/interfaces/audit-context.interface';
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

export const INVENTORY_SERVICE = Symbol('INVENTORY_SERVICE');

export interface InventoryServiceContract {
  createItem(dto: CreateItemDto, audit: AuditContext): Promise<unknown>;
  listItems(query: PaginationQueryDto): Promise<unknown>;
  getItemById(itemId: string): Promise<unknown>;
  updateItem(itemId: string, dto: UpdateItemDto, audit: AuditContext): Promise<unknown>;
  deleteItem(itemId: string): Promise<unknown>;

  createSupplier(dto: CreateSupplierDto, audit: AuditContext): Promise<unknown>;
  listSuppliers(query: PaginationQueryDto): Promise<unknown>;
  getSupplierById(supplierId: string): Promise<unknown>;
  updateSupplier(supplierId: string, dto: UpdateSupplierDto, audit: AuditContext): Promise<unknown>;
  deleteSupplier(supplierId: string): Promise<unknown>;

  createPurchase(dto: CreatePurchaseDto, audit: AuditContext): Promise<unknown>;
  listPurchases(query: PaginationQueryDto): Promise<unknown>;
  getPurchaseById(purchaseId: string): Promise<unknown>;
  updatePurchase(purchaseId: string, dto: UpdatePurchaseDto, audit: AuditContext): Promise<unknown>;
  deletePurchase(purchaseId: string): Promise<unknown>;
  receivePurchase(purchaseId: string, dto: ReceivePurchaseDto, audit: AuditContext): Promise<unknown>;
  createDelivery(purchaseId: string, dto: CreateDeliveryDto, audit: AuditContext): Promise<unknown>;
  listDeliveries(purchaseId: string, query: PaginationQueryDto): Promise<unknown>;
  getDeliveryById(deliveryId: string): Promise<unknown>;
  updateDelivery(deliveryId: string, dto: UpdateDeliveryDto, audit: AuditContext): Promise<unknown>;
  deleteDelivery(deliveryId: string): Promise<unknown>;
  receiveDelivery(deliveryId: string, dto: ReceiveDeliveryDto, audit: AuditContext): Promise<unknown>;

  getInventory(query: PaginationQueryDto): Promise<unknown>;
  getLowStock(query: PaginationQueryDto): Promise<unknown>;
}
