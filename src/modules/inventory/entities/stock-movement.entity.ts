import { StockMovementType } from '../../../common/enums/stock-movement-type.enum';
import { StockReferenceType } from '../../../common/enums/stock-reference-type.enum';

export class StockMovement {
  id!: string;
  itemId!: string;
  type!: StockMovementType;
  quantity!: string;
  referenceType!: StockReferenceType;
  referenceId!: string;
  createdAt!: Date;
}
