import { Module } from '@nestjs/common';
import { PrismaModule } from './common/database/prisma.module';
import { InventoryModule } from './modules/inventory/inventory.module';

@Module({
  imports: [PrismaModule, InventoryModule],
})
export class AppModule {}
