import { PurchaseStatus } from '../../../common/enums/purchase-status.enum';

export interface PurchaseItemEntity {
  id: string;
  purchaseId: string;
  itemId: string;
  quantity: string;
  costPrice: string;
}

export interface PurchaseEntity {
  id: string;
  supplierId: string;
  orderDate: Date;
  deliveryDate: Date | null;
  receivedDate: Date | null;
  status: PurchaseStatus;
  createdAt: Date;
  items?: PurchaseItemEntity[];
}
