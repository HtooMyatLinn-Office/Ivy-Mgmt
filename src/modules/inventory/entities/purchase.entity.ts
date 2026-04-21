import { PurchaseStatus } from '../../../common/enums/purchase-status.enum';

export class PurchaseItem {
  id!: string;
  purchaseId!: string;
  itemId!: string;
  quantity!: string;
  costPrice!: string;
}

export class Purchase {
  id!: string;
  supplierId!: string;
  orderDate!: Date;
  deliveryDate!: Date | null;
  receivedDate!: Date | null;
  status!: PurchaseStatus;
  createdAt!: Date;
  items!: PurchaseItem[];
}
