import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ActorId } from '../../../common/decorators/actor-id.decorator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { CreateDeliveryDto } from '../dto/create-delivery.dto';
import { CreatePurchaseDto } from '../dto/create-purchase.dto';
import { ReceiveDeliveryDto } from '../dto/receive-delivery.dto';
import { ReceivePurchaseDto } from '../dto/receive-purchase.dto';
import { UpdateDeliveryDto } from '../dto/update-delivery.dto';
import { UpdatePurchaseDto } from '../dto/update-purchase.dto';
import { INVENTORY_SERVICE, InventoryServiceContract } from '../services/inventory.service.interface';

@ApiTags('Inventory')
@ApiHeader({ name: 'x-user-id', required: false, description: 'Actor identity for audit trail' })
@Controller('inventory/purchases')
export class PurchasesController {
  constructor(
    @Inject(INVENTORY_SERVICE)
    private readonly service: InventoryServiceContract,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create purchase order (no stock update)' })
  create(@Body() dto: CreatePurchaseDto, @ActorId() actorId: string) {
    return this.service.createPurchase(dto, { actorId });
  }

  @Get()
  @ApiOperation({ summary: 'List purchases with pagination' })
  list(@Query() query: PaginationQueryDto) {
    return this.service.listPurchases(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get purchase details by id' })
  getById(@Param('id') id: string) {
    return this.service.getPurchaseById(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update purchase information' })
  update(@Param('id') id: string, @Body() dto: UpdatePurchaseDto, @ActorId() actorId: string) {
    return this.service.updatePurchase(id, dto, { actorId });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a purchase' })
  remove(@Param('id') id: string) {
    return this.service.deletePurchase(id);
  }

  @Put(':id/receive')
  @ApiOperation({ summary: 'Receive purchase and post stock movements' })
  receive(@Param('id') id: string, @Body() dto: ReceivePurchaseDto, @ActorId() actorId: string) {
    return this.service.receivePurchase(id, dto, { actorId });
  }

  @Post(':id/deliveries')
  @ApiOperation({ summary: 'Create delivery information for a purchase' })
  createDelivery(@Param('id') id: string, @Body() dto: CreateDeliveryDto, @ActorId() actorId: string) {
    return this.service.createDelivery(id, dto, { actorId });
  }

  @Get(':id/deliveries')
  @ApiOperation({ summary: 'List delivery records for a purchase' })
  listDeliveries(@Param('id') id: string, @Query() query: PaginationQueryDto) {
    return this.service.listDeliveries(id, query);
  }

  @Get('deliveries/:deliveryId')
  @ApiOperation({ summary: 'Get delivery details by id' })
  getDeliveryById(@Param('deliveryId') deliveryId: string) {
    return this.service.getDeliveryById(deliveryId);
  }

  @Put('deliveries/:deliveryId')
  @ApiOperation({ summary: 'Update delivery information' })
  updateDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() dto: UpdateDeliveryDto,
    @ActorId() actorId: string,
  ) {
    return this.service.updateDelivery(deliveryId, dto, { actorId });
  }

  @Delete('deliveries/:deliveryId')
  @ApiOperation({ summary: 'Delete a delivery record' })
  removeDelivery(@Param('deliveryId') deliveryId: string) {
    return this.service.deleteDelivery(deliveryId);
  }

  @Put('deliveries/:deliveryId/receive')
  @ApiOperation({ summary: 'Receive a delivery and post stock movements by accepted quantity' })
  receiveDelivery(
    @Param('deliveryId') deliveryId: string,
    @Body() dto: ReceiveDeliveryDto,
    @ActorId() actorId: string,
  ) {
    return this.service.receiveDelivery(deliveryId, dto, { actorId });
  }
}
