import { PrismaClient, PurchaseStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const cement = await prisma.item.create({
    data: {
      name: 'Portland Cement',
      category: 'Cement',
      unit: 'bag',
      costPrice: '310.00',
      sellingPrice: '360.00',
      minStockLevel: '120.00',
      createdBy: 'seed-script',
      updatedBy: 'seed-script',
    },
  });

  const steel = await prisma.item.create({
    data: {
      name: 'Rebar 12mm',
      category: 'Steel',
      unit: 'ton',
      costPrice: '49000.00',
      sellingPrice: '53500.00',
      minStockLevel: '8.00',
      createdBy: 'seed-script',
      updatedBy: 'seed-script',
    },
  });

  const supplier = await prisma.supplier.create({
    data: {
      name: 'BuildMax Supplies',
      phone: '+91-9876543210',
      address: 'Industrial Area Phase 2',
      createdBy: 'seed-script',
      updatedBy: 'seed-script',
    },
  });

  await prisma.purchase.create({
    data: {
      supplierId: supplier.id,
      orderDate: new Date(),
      status: PurchaseStatus.ORDERED,
      createdBy: 'seed-script',
      updatedBy: 'seed-script',
      items: {
        create: [
          {
            itemId: cement.id,
            quantity: '200.00',
            costPrice: '305.00',
            createdBy: 'seed-script',
          },
          {
            itemId: steel.id,
            quantity: '10.00',
            costPrice: '48500.00',
            createdBy: 'seed-script',
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
