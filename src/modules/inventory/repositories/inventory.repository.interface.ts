import { CreateItemDto } from '../dto/create-item.dto';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { ReceiveDeliveryDto } from '../dto/receive-delivery.dto';
import { CreateSupplierDto } from '../dto/create-supplier.dto';
import { AuditContext } from '../../../common/interfaces/audit-context.interface';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { UpdateItemDto } from '../dto/update-item.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { UpdateSupplierDto } from '../dto/update-supplier.dto';

export const INVENTORY_REPOSITORY = Symbol('INVENTORY_REPOSITORY');

export interface InventoryRepository {
  createItem(dto: CreateItemDto, audit: AuditContext): Promise<unknown>;
  listItems(skip: number, take: number): Promise<unknown[]>;
  countItems(): Promise<number>;
  getItemById(itemId: string): Promise<unknown>;
  updateItem(itemId: string, dto: UpdateItemDto, audit: AuditContext): Promise<unknown>;
  deleteItem(itemId: string): Promise<unknown>;

  createSupplier(dto: CreateSupplierDto, audit: AuditContext): Promise<unknown>;
  listSuppliers(skip: number, take: number): Promise<unknown[]>;
  countSuppliers(): Promise<number>;
  getSupplierById(supplierId: string): Promise<unknown>;
  updateSupplier(supplierId: string, dto: UpdateSupplierDto, audit: AuditContext): Promise<unknown>;
  deleteSupplier(supplierId: string): Promise<unknown>;

  createPurchase(dto: CreatePurchaseDto, audit: AuditContext): Promise<unknown>;
  listPurchases(skip: number, take: number): Promise<unknown[]>;
  countPurchases(): Promise<number>;
  getPurchaseById(purchaseId: string): Promise<unknown>;
  updatePurchase(purchaseId: string, dto: UpdatePurchaseDto, audit: AuditContext): Promise<unknown>;
  deletePurchase(purchaseId: string): Promise<unknown>;
  receivePurchase(purchaseId: string, receivedDate: Date, audit: AuditContext): Promise<unknown>;
  createDelivery(purchaseId: string, dto: CreateDeliveryDto, audit: AuditContext): Promise<unknown>;
  listDeliveries(purchaseId: string, skip: number, take: number): Promise<unknown[]>;
  countDeliveries(purchaseId: string): Promise<number>;
  getDeliveryById(deliveryId: string): Promise<unknown>;
  updateDelivery(deliveryId: string, dto: UpdateDeliveryDto, audit: AuditContext): Promise<unknown>;
  deleteDelivery(deliveryId: string): Promise<unknown>;
  receiveDelivery(deliveryId: string, dto: ReceiveDeliveryDto, audit: AuditContext): Promise<unknown>;

  getInventory(skip: number, take: number): Promise<unknown[]>;
  countInventory(): Promise<number>;
  getLowStock(skip: number, take: number): Promise<unknown[]>;
  countLowStock(): Promise<number>;
}
