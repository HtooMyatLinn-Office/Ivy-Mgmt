import { Module } from '@nestjs/common';
import { PrismaModule } from '../../common/database/prisma.module';
import { InventoryController } from './controllers/inventory.controller';
import { ItemsController } from './controllers/items.controller';
import { PurchasesController } from './controllers/purchases.controller';
import { SuppliersController } from './controllers/suppliers.controller';
import { INVENTORY_REPOSITORY } from './repositories/inventory.repository.interface';
import { PrismaInventoryRepository } from './repositories/prisma-inventory.repository';
import { INVENTORY_SERVICE } from './services/inventory.service.interface';
import { InventoryService } from './services/inventory.service';

@Module({
  imports: [PrismaModule],
  controllers: [ItemsController, SuppliersController, PurchasesController, InventoryController],
  providers: [
    {
      provide: INVENTORY_REPOSITORY,
      useClass: PrismaInventoryRepository,
    },
    {
      provide: INVENTORY_SERVICE,
      useClass: InventoryService,
    },
  ],
  exports: [INVENTORY_SERVICE],
})
export class InventoryModule {}
