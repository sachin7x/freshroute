/*
 * FreshRoute Master Database Seed
 *
 * Seeds initial roles, cities, service zones, catalog, pricing rules,
 * operational hubs, partners, and test accounts.
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FreshRoute database seeding...');

  // 1. Roles
  const roles = [
    { name: 'ADMIN', permissions: ['*'] },
    { name: 'CUSTOMER', permissions: ['order:create', 'order:read', 'order:cancel', 'profile:manage'] },
    { name: 'VALET', permissions: ['valet:pickup', 'valet:deliver', 'valet:status'] },
    { name: 'PARTNER', permissions: ['partner:process', 'partner:qc', 'partner:status'] },
  ];

  const roleMap: Record<string, string> = {};
  for (const r of roles) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: {},
      create: { name: r.name, permissions: r.permissions },
    });
    roleMap[r.name] = role.id;
  }
  console.log('✅ Roles seeded');

  // 2. Cities
  const bhilwara = await prisma.city.upsert({
    where: { code: 'BHL' },
    update: {},
    create: {
      name: 'Bhilwara',
      state: 'Rajasthan',
      code: 'BHL',
      description: 'Pilot launch market - textile city',
    },
  });

  const kishangarh = await prisma.city.upsert({
    where: { code: 'KSG' },
    update: {},
    create: {
      name: 'Kishangarh',
      state: 'Rajasthan',
      code: 'KSG',
      description: 'Phase 2 market - marble hub',
    },
  });

  const jaipur = await prisma.city.upsert({
    where: { code: 'JPR' },
    update: {},
    create: {
      name: 'Jaipur',
      state: 'Rajasthan',
      code: 'JPR',
      description: 'Phase 3 expansion market - state capital',
    },
  });
  console.log('✅ Cities seeded (Bhilwara, Kishangarh, Jaipur)');

  // 3. Service Zones
  const bhlZone = await prisma.serviceZone.upsert({
    where: { code: 'BHL-CENTRAL' },
    update: {},
    create: {
      cityId: bhilwara.id,
      name: 'Bhilwara Central & Subhash Nagar',
      code: 'BHL-CENTRAL',
      capacity: 150,
    },
  });

  const jprMalviya = await prisma.serviceZone.upsert({
    where: { code: 'JPR-MALVIYA' },
    update: {},
    create: {
      cityId: jaipur.id,
      name: 'Malviya Nagar',
      code: 'JPR-MALVIYA',
      capacity: 200,
    },
  });

  const jprVaishali = await prisma.serviceZone.upsert({
    where: { code: 'JPR-VAISHALI' },
    update: {},
    create: {
      cityId: jaipur.id,
      name: 'Vaishali Nagar',
      code: 'JPR-VAISHALI',
      capacity: 200,
    },
  });
  console.log('✅ Service Zones seeded');

  // 4. Laundry Services
  const services = [
    {
      name: 'Wash & Fold',
      code: 'WASH_FOLD',
      description: 'Everyday laundry washed, dried, and neatly folded',
      unitType: 'KG',
      unitBase: 1,
    },
    {
      name: 'Wash & Iron',
      code: 'WASH_IRON',
      description: 'Washed, dried, and crisp steam-ironed',
      unitType: 'KG',
      unitBase: 1,
    },
    {
      name: 'Dry Cleaning',
      code: 'DRY_CLEAN',
      description: 'Delicate garments, suits, sarees, and jackets',
      unitType: 'PIECE',
      unitBase: 1,
    },
    {
      name: 'Steam Ironing',
      code: 'IRONING',
      description: 'Wrinkle-free pressing with hanger/fold option',
      unitType: 'PIECE',
      unitBase: 1,
    },
    {
      name: 'Premium Shoe Care',
      code: 'SHOE_CARE',
      description: 'Sneakers, formal shoes deep cleaned and deodorized',
      unitType: 'PAIR',
      unitBase: 1,
    },
  ];

  const serviceMap: Record<string, string> = {};
  for (const s of services) {
    const srv = await prisma.laundryService.upsert({
      where: { code: s.code },
      update: {},
      create: s,
    });
    serviceMap[s.code] = srv.id;
  }
  console.log('✅ Laundry Services catalog seeded');

  // 5. Pricing Rules
  // Documenting ₹49/₹59 discrepancy: Set Bhilwara base to ₹4900 (paise) / ₹49 with ₹10 adjustment option
  const pricingRules = [
    {
      cityId: bhilwara.id,
      serviceId: serviceMap['WASH_FOLD'],
      pricePerUnit: 4900, // ₹49.00
      cityAdjustment: 0,
      minQuantity: 4,
    },
    {
      cityId: jaipur.id,
      serviceId: serviceMap['WASH_FOLD'],
      pricePerUnit: 7900, // ₹79.00
      cityAdjustment: 0,
      minQuantity: 4,
    },
    {
      cityId: kishangarh.id,
      serviceId: serviceMap['WASH_FOLD'],
      pricePerUnit: 5900, // ₹59.00
      cityAdjustment: 0,
      minQuantity: 4,
    },
    {
      cityId: null,
      serviceId: serviceMap['WASH_IRON'],
      pricePerUnit: 8900, // ₹89.00
      cityAdjustment: 0,
      minQuantity: 3,
    },
    {
      cityId: null,
      serviceId: serviceMap['DRY_CLEAN'],
      pricePerUnit: 9900, // ₹99.00
      cityAdjustment: 0,
      minQuantity: 1,
    },
    {
      cityId: null,
      serviceId: serviceMap['IRONING'],
      pricePerUnit: 2500, // ₹25.00
      cityAdjustment: 0,
      minQuantity: 5,
    },
    {
      cityId: null,
      serviceId: serviceMap['SHOE_CARE'],
      pricePerUnit: 14900, // ₹149.00
      cityAdjustment: 0,
      minQuantity: 1,
    },
  ];

  for (const pr of pricingRules) {
    await prisma.pricingRule.create({
      data: {
        cityId: pr.cityId,
        serviceId: pr.serviceId,
        pricePerUnit: pr.pricePerUnit,
        cityAdjustment: pr.cityAdjustment,
        minQuantity: pr.minQuantity,
        effectiveFrom: new Date('2026-01-01'),
        isActive: true,
      },
    });
  }
  console.log('✅ Pricing Rules seeded');

  // 6. Pickup Slots (Today & Tomorrow 7pm - 10pm)
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const slotDate = new Date(now);
    slotDate.setDate(now.getDate() + i);

    const startTime = new Date(slotDate);
    startTime.setHours(19, 0, 0, 0); // 7:00 PM

    const endTime = new Date(slotDate);
    endTime.setHours(22, 0, 0, 0); // 10:00 PM

    await prisma.pickupSlot.create({
      data: {
        cityId: bhilwara.id,
        zoneId: bhlZone.id,
        startTime,
        endTime,
        capacity: 25,
        bookedCount: 0,
        daysOfWeek: [1, 2, 3, 4, 5, 6, 7],
        serviceCharge: 0,
        isActive: true,
      },
    });
  }
  console.log('✅ Pickup slots seeded for the week (7 PM - 10 PM)');

  // 7. Test Users
  const passwordHash = await bcrypt.hash('Password@123', 10);

  // Admin
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@freshroute.in' },
    update: {},
    create: {
      email: 'admin@freshroute.in',
      phone: '+919876543210',
      passwordHash,
      roleId: roleMap['ADMIN'],
      status: 'ACTIVE',
    },
  });

  // Valet
  const valetUser = await prisma.user.upsert({
    where: { email: 'valet@freshroute.in' },
    update: {},
    create: {
      email: 'valet@freshroute.in',
      phone: '+919876543211',
      passwordHash,
      roleId: roleMap['VALET'],
      status: 'ACTIVE',
    },
  });

  await prisma.valet.upsert({
    where: { userId: valetUser.id },
    update: {},
    create: {
      userId: valetUser.id,
      name: 'Ramesh Valet',
      phone: '+919876543211',
      email: 'valet@freshroute.in',
      assignedCity: 'Bhilwara',
      assignedCityId: bhilwara.id,
      status: 'AVAILABLE',
    },
  });

  // Customer
  const customerUser = await prisma.user.upsert({
    where: { email: 'customer@freshroute.in' },
    update: {},
    create: {
      email: 'customer@freshroute.in',
      phone: '+919876543212',
      passwordHash,
      roleId: roleMap['CUSTOMER'],
      status: 'ACTIVE',
    },
  });

  const customer = await prisma.customer.upsert({
    where: { userId: customerUser.id },
    update: {},
    create: {
      userId: customerUser.id,
      fullName: 'Vikram Sharma',
      businessName: 'Sharma Textiles',
      gstin: '08AAAAA0000A1Z5',
    },
  });

  // Customer Address
  await prisma.address.create({
    data: {
      customerId: customer.id,
      cityId: bhilwara.id,
      zoneId: bhlZone.id,
      line1: 'Flat 402, Royal Palms, Subhash Nagar',
      postalCode: '311001',
      landmark: 'Near Textile Market',
      isDefault: true,
    },
  });

  // Partner
  const partner = await prisma.partner.upsert({
    where: { code: 'PRT-BHL-01' },
    update: {},
    create: {
      name: 'Shree Ram Steam Laundry Works',
      code: 'PRT-BHL-01',
      email: 'partner.bhl@freshroute.in',
      phone: '+919876543213',
      status: 'ACTIVE',
    },
  });

  await prisma.partnerFacility.create({
    data: {
      partnerId: partner.id,
      name: 'Bhilwara Main Industrial Hub',
      cityId: bhilwara.id,
      capacity: 300,
      workingHours: '06:00 - 22:00',
      isActive: true,
    },
  });

  console.log('✅ Test Users, Customers, Valets, Addresses & Partners seeded');
  console.log('🎉 Seeding successfully completed!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
