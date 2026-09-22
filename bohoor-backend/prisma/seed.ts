import { PrismaClient, SellerType, DeliveryStatus, UnitStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 بدء إضافة البيانات الوهمية...');

  // ═══════════════════════════════════════════════════════
  // 0. تنظيف البيانات القديمة (بالترتيب الصحيح للـ FK)
  // ═══════════════════════════════════════════════════════
  await prisma.unit.deleteMany();
  await prisma.project.deleteMany();
  await prisma.developer.deleteMany();
  await prisma.unitTypeModel.deleteMany();
  await prisma.location.deleteMany();
  console.log('🗑️  تم مسح البيانات القديمة');

  // ═══════════════════════════════════════════════════════
  // 1. Admin
  // ═══════════════════════════════════════════════════════
  const hashedPassword = await bcrypt.hash('123456', 10);
  await prisma.admin.upsert({
    where: { email: 'admin@bohoor.com' },
    update: {},
    create: { email: 'admin@bohoor.com', name: 'System Admin', password: hashedPassword },
  });

  // ═══════════════════════════════════════════════════════
  // 2. Locations
  // ═══════════════════════════════════════════════════════
  const locGouna = await prisma.location.create({
    data: {
      name: 'الجونة',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locZayed = await prisma.location.create({
    data: {
      name: 'الشيخ زايد',
      governorate: 'الجيزة',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locSahel = await prisma.location.create({
    data: {
      name: 'الساحل الشمالي',
      governorate: 'مطروح',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locNasr = await prisma.location.create({
    data: {
      name: 'مدينة نصر',
      governorate: 'القاهرة',
      imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locTajammu = await prisma.location.create({
    data: {
      name: 'التجمع الخامس',
      governorate: 'القاهرة',
      imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locAdm = await prisma.location.create({
    data: {
      name: 'العاصمة الإدارية',
      governorate: 'القاهرة',
      imageUrl: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locNewCairo = await prisma.location.create({
    data: {
      name: 'القاهرة الجديدة',
      governorate: 'القاهرة',
      imageUrl: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locMaadi = await prisma.location.create({
    data: {
      name: 'المعادي',
      governorate: 'القاهرة',
      imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locAlexandria = await prisma.location.create({
    data: {
      name: 'الإسكندرية',
      governorate: 'الإسكندرية',
      imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locHurghada = await prisma.location.create({
    data: {
      name: 'الغردقة',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locSahlHasheesh = await prisma.location.create({
    data: {
      name: 'سهل حشيش',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1572913017567-02f06497ceea?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locSomaBay = await prisma.location.create({
    data: {
      name: 'سوما باي',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1534068590799-09895a709e86?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locMakadi = await prisma.location.create({
    data: {
      name: 'مكادي هايتس',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locMarsaAlam = await prisma.location.create({
    data: {
      name: 'مرسى علم',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locSokhna = await prisma.location.create({
    data: {
      name: 'العين السخنة',
      governorate: 'السويس',
      imageUrl: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1000',
    },
  });
  const locPortGhalib = await prisma.location.create({
    data: {
      name: 'بورت غالب',
      governorate: 'البحر الأحمر',
      imageUrl: 'https://images.unsplash.com/photo-1580414057403-c5f451f30e1c?auto=format&fit=crop&q=80&w=1000',
    },
  });
  console.log('✅ تم إضافة المناطق مع صورها والمحافظات التابعة لها');

  // ═══════════════════════════════════════════════════════
  // 3. Unit Types
  // ═══════════════════════════════════════════════════════
  const typeChalet = await prisma.unitTypeModel.create({ data: { name: 'شاليه' } });
  const typeVilla = await prisma.unitTypeModel.create({ data: { name: 'فيلا مستقلة' } });
  const typeApt = await prisma.unitTypeModel.create({ data: { name: 'شقة سكنية' } });
  const typeDuplex = await prisma.unitTypeModel.create({ data: { name: 'دوبلكس' } });
  const typePenthouse = await prisma.unitTypeModel.create({ data: { name: 'بنتهاوس' } });
  const typeTownhouse = await prisma.unitTypeModel.create({ data: { name: 'تاون هاوس' } });
  const typeStudio = await prisma.unitTypeModel.create({ data: { name: 'استوديو' } });
  const typeTwin = await prisma.unitTypeModel.create({ data: { name: 'توين هاوس' } });
  console.log('✅ تم إضافة أنواع الوحدات');

  // ═══════════════════════════════════════════════════════
  // 4. Developers (8 مطورين)
  // ═══════════════════════════════════════════════════════
  const devSodic        = await prisma.developer.create({ data: { name: 'سوديك',               slug: 'sodic',           logoUrl: 'https://placehold.co/150?text=SODIC',    bio: 'إحدى أكبر شركات التطوير العقاري في مصر، تأسست عام 1996.',                           phone: '01000000001' } });
  const devEmaar        = await prisma.developer.create({ data: { name: 'إعمار مصر',           slug: 'emaar',           logoUrl: 'https://placehold.co/150?text=EMAAR',    bio: 'الذراع المصرية لمجموعة إعمار العالمية، صاحبة مشاريع عالمية المستوى.',              phone: '01000000002' } });
  const devOrascom      = await prisma.developer.create({ data: { name: 'أوراسكوم للتطوير',   slug: 'orascom',         logoUrl: 'https://placehold.co/150?text=ORA',      bio: 'مطور مدينة الجونة ومكادي هايتس وسلطنة جبل السفح.',                                phone: '01000000003' } });
  const devMountainView = await prisma.developer.create({ data: { name: 'ماونتن فيو',         slug: 'mountain-view',   logoUrl: 'https://placehold.co/150?text=MV',       bio: 'صاحبة مشروع هايد بارك وماونتن فيو الغردقة.',                                      phone: '01000000004' } });
  const devTalaat       = await prisma.developer.create({ data: { name: 'طلعت مصطفى',         slug: 'talaat-mostafa',  logoUrl: 'https://placehold.co/150?text=TMG',      bio: 'مجموعة طلعت مصطفى، صاحبة مدينتي ومشروع الرحاب.',                                  phone: '01000000005' } });
  const devPalmHills    = await prisma.developer.create({ data: { name: 'بالم هيلز',           slug: 'palm-hills',      logoUrl: 'https://placehold.co/150?text=PH',       bio: 'بالم هيلز للتطوير العقاري، صاحبة مشاريع فاخرة في القاهرة الجديدة والساحل.',       phone: '01000000006' } });
  const devDamnhour     = await prisma.developer.create({ data: { name: 'دامنهور للتطوير',    slug: 'damnhour-dev',    logoUrl: 'https://placehold.co/150?text=DD',       bio: 'شركة متخصصة في مشاريع الدلتا والإسكندرية.',                                       phone: '01000000007' } });
  const devCityEdge     = await prisma.developer.create({ data: { name: 'سيتي إيدج',          slug: 'city-edge',       logoUrl: 'https://placehold.co/150?text=CE',       bio: 'سيتي إيدج للتطوير العقاري، صاحبة مشروع ذا سيتي إيدج بالعاصمة.',                  phone: '01000000008' } });
  console.log('✅ تم إضافة 8 مطورين');

  // ═══════════════════════════════════════════════════════
  // 5. Projects (12 مشروع)
  // ═══════════════════════════════════════════════════════
  const projSodicWest   = await prisma.project.create({ data: { name: 'سوديك ويست',         developerId: devSodic.id,        location: 'الشيخ زايد',          description: 'مجمع سكني فاخر على أرقى مناطق الشيخ زايد.',                       coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600' } });
  const projSodicEast   = await prisma.project.create({ data: { name: 'سوديك إيست',         developerId: devSodic.id,        location: 'التجمع الخامس',        description: 'مشروع متكامل في قلب التجمع الخامس.',                               coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600' } });
  const projEmaarMireas = await prisma.project.create({ data: { name: 'ميراس',               developerId: devEmaar.id,        location: 'العاصمة الإدارية',     description: 'مشروع سكني راقٍ في العاصمة الإدارية الجديدة.',                     coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600' } });
  const projEmaarUptown = await prisma.project.create({ data: { name: 'أبتاون كايرو',        developerId: devEmaar.id,        location: 'القاهرة الجديدة',      description: 'حياة راقية على قمة القاهرة الجديدة.',                              coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600' } });
  const projGouna       = await prisma.project.create({ data: { name: 'الجونة',              developerId: devOrascom.id,      location: 'الجونة',               description: 'مدينة الجونة السياحية، جنة على ساحل البحر الأحمر.',               coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600' } });
  const projMakadi      = await prisma.project.create({ data: { name: 'مكادي هايتس',         developerId: devOrascom.id,      location: 'الغردقة',              description: 'مشروع فاخر في قلب الغردقة مع إطلالات بحرية خلابة.',              coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600' } });
  const projHydePark    = await prisma.project.create({ data: { name: 'هايد بارك',           developerId: devMountainView.id, location: 'التجمع الخامس',        description: 'مشروع سكني فاخر بالتجمع، مستوحى من الطبيعة.',                     coverImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600' } });
  const projMadinaty    = await prisma.project.create({ data: { name: 'مدينتي',              developerId: devTalaat.id,       location: 'مدينة نصر',            description: 'مدينة متكاملة تضم فلل وشقق وخدمات متكاملة.',                      coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=600' } });
  const projAlRehab     = await prisma.project.create({ data: { name: 'الرحاب',              developerId: devTalaat.id,       location: 'القاهرة الجديدة',      description: 'مدينة الرحاب، مجتمع متكامل بالقاهرة الجديدة.',                    coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600' } });
  const projPalmParks   = await prisma.project.create({ data: { name: 'بالم باركس',          developerId: devPalmHills.id,    location: 'الشيخ زايد',          description: 'بالم باركس، ملاذ الطبيعة والهدوء في الشيخ زايد.',                  coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600' } });
  const projCityEdge    = await prisma.project.create({ data: { name: 'ذا سيتي إيدج',       developerId: devCityEdge.id,     location: 'العاصمة الإدارية',     description: 'مشروع عصري متكامل في قلب العاصمة الإدارية الجديدة.',              coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600' } });
  const projAlexView    = await prisma.project.create({ data: { name: 'الإسكندرية فيو',     developerId: devDamnhour.id,     location: 'الإسكندرية',          description: 'مشروع ساحلي رائع على البحر المتوسط في الإسكندرية.',               coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600' } });
  console.log('✅ تم إضافة 12 مشروعاً');

  // ═══════════════════════════════════════════════════════
  // 6. Units – Developer (وحدات المطورين)
  // ═══════════════════════════════════════════════════════
  const developerUnits: any[] = [
    // سوديك ويست
    { title: 'فيلا كورنر في سوديك ويست – تقسيط 10 سنوات',     sellerType: SellerType.DEVELOPER, developerId: devSodic.id,        projectId: projSodicWest.id,   locationId: locZayed.id,     unitTypeId: typeVilla.id,       area: 380, floor: null, bedrooms: 5, bathrooms: 5, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage: 12, expectedRentalRoi: 10.5, originalContractPrice: 18000000, cashPaidToSeller: 1800000, remainingInstallments: 16200000, monthlyEquivalentInstallment: 135000,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2028, coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600', status: UnitStatus.APPROVED },
    { title: 'تاون هاوس في سوديك ويست – موقع متميز',           sellerType: SellerType.DEVELOPER, developerId: devSodic.id,        projectId: projSodicWest.id,   locationId: locZayed.id,     unitTypeId: typeTownhouse.id,   area: 250, floor: null, bedrooms: 4, bathrooms: 3, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage: 10, expectedRentalRoi: 11.0, originalContractPrice: 11000000, cashPaidToSeller: 1100000, remainingInstallments: 9900000,  monthlyEquivalentInstallment: 82500,   contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2027, coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600', status: UnitStatus.APPROVED },

    // سوديك إيست
    { title: 'شقة 3 غرف في سوديك إيست – دور مرتفع',            sellerType: SellerType.DEVELOPER, developerId: devSodic.id,        projectId: projSodicEast.id,   locationId: locTajammu.id,   unitTypeId: typeApt.id,         area: 175, floor: 5,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  8, expectedRentalRoi: 12.5, originalContractPrice:  8500000, cashPaidToSeller:  850000, remainingInstallments:  7650000, monthlyEquivalentInstallment:  63750,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2026, coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600', status: UnitStatus.APPROVED },
    { title: 'دوبلكس في سوديك إيست – واجهة حديقة',             sellerType: SellerType.DEVELOPER, developerId: devSodic.id,        projectId: projSodicEast.id,   locationId: locTajammu.id,   unitTypeId: typeDuplex.id,      area: 220, floor: 2,    bedrooms: 4, bathrooms: 3, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  9, expectedRentalRoi: 14.5, originalContractPrice: 13000000, cashPaidToSeller: 1950000, remainingInstallments: 11050000, monthlyEquivalentInstallment:  92083,  contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600', status: UnitStatus.APPROVED },

    // إعمار – ميراس
    { title: 'بنتهاوس ميراس – إطلالة بانورامية',                sellerType: SellerType.DEVELOPER, developerId: devEmaar.id,        projectId: projEmaarMireas.id, locationId: locAdm.id,       unitTypeId: typePenthouse.id,   area: 310, floor: 14,   bedrooms: 4, bathrooms: 4, finishingStatus: 'سوبر لوكس',        isCashOnly: false, cashDiscountPercentage: 12, expectedRentalRoi: 15.0, originalContractPrice: 26000000, cashPaidToSeller: 5200000, remainingInstallments: 20800000, monthlyEquivalentInstallment: 173333,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2026, coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600', status: UnitStatus.PENDING_REVIEW },
    { title: 'دوبلكس فاخر ميراس – 4 غرف',                     sellerType: SellerType.DEVELOPER, developerId: devEmaar.id,        projectId: projEmaarMireas.id, locationId: locAdm.id,       unitTypeId: typeDuplex.id,      area: 280, floor: 6,    bedrooms: 4, bathrooms: 3, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage: 12, expectedRentalRoi: 13.5, originalContractPrice: 12000000, cashPaidToSeller: 2400000, remainingInstallments:  9600000, monthlyEquivalentInstallment: 100000,  contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600', status: UnitStatus.APPROVED },

    // إعمار – أبتاون
    { title: 'شقة استوديو في أبتاون – استثمار مثالي',           sellerType: SellerType.DEVELOPER, developerId: devEmaar.id,        projectId: projEmaarUptown.id, locationId: locNewCairo.id,  unitTypeId: typeStudio.id,      area:  60, floor: 8,    bedrooms: 1, bathrooms: 1, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  7, expectedRentalRoi: 16.5, originalContractPrice:  4200000, cashPaidToSeller:  630000, remainingInstallments:  3570000, monthlyEquivalentInstallment:  29750,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2027, coverImage: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=600', status: UnitStatus.APPROVED },

    // أوراسكوم – الجونة
    { title: 'شاليه فيو البحر – الجونة',                        sellerType: SellerType.DEVELOPER, developerId: devOrascom.id,      projectId: projGouna.id,       locationId: locGouna.id,     unitTypeId: typeChalet.id,      area: 130, floor: 1,    bedrooms: 2, bathrooms: 2, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  5, expectedRentalRoi: 18.5, originalContractPrice:  7000000, cashPaidToSeller:  700000, remainingInstallments:  6300000, monthlyEquivalentInstallment:  52500,  contractYear: 2024, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', status: UnitStatus.APPROVED },
    { title: 'توين هاوس في الجونة – حي البحيرات',              sellerType: SellerType.DEVELOPER, developerId: devOrascom.id,      projectId: projGouna.id,       locationId: locGouna.id,     unitTypeId: typeTwin.id,        area: 200, floor: null, bedrooms: 3, bathrooms: 3, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage:  8, expectedRentalRoi: 14.0, originalContractPrice: 10000000, cashPaidToSeller: 2000000, remainingInstallments:  8000000, monthlyEquivalentInstallment:  66666,  contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600', status: UnitStatus.APPROVED },

    // أوراسكوم – مكادي
    { title: 'شاليه في مكادي هايتس – إطلالة أمامية',           sellerType: SellerType.DEVELOPER, developerId: devOrascom.id,      projectId: projMakadi.id,      locationId: locHurghada.id,  unitTypeId: typeChalet.id,      area: 100, floor: null, bedrooms: 2, bathrooms: 1, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  6, expectedRentalRoi: 17.0, originalContractPrice:  5500000, cashPaidToSeller:  825000, remainingInstallments:  4675000, monthlyEquivalentInstallment:  38958,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2026, coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', status: UnitStatus.PENDING_REVIEW },

    // ماونتن فيو – هايد بارك
    { title: 'تاون هاوس في هايد بارك – حديقة كبيرة',          sellerType: SellerType.DEVELOPER, developerId: devMountainView.id, projectId: projHydePark.id,    locationId: locTajammu.id,   unitTypeId: typeTownhouse.id,   area: 240, floor: null, bedrooms: 3, bathrooms: 3, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage: 10, expectedRentalRoi: 12.0, originalContractPrice:  9500000, cashPaidToSeller:  950000, remainingInstallments:  8550000, monthlyEquivalentInstallment:  71250,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2027, coverImage: 'https://images.unsplash.com/photo-1449844908441-8829872d2607?q=80&w=600', status: UnitStatus.APPROVED },
    { title: 'فيلا مزدوجة في هايد بارك',                        sellerType: SellerType.DEVELOPER, developerId: devMountainView.id, projectId: projHydePark.id,    locationId: locTajammu.id,   unitTypeId: typeVilla.id,       area: 320, floor: null, bedrooms: 4, bathrooms: 4, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage: 11, expectedRentalRoi: 11.5, originalContractPrice: 15000000, cashPaidToSeller: 2250000, remainingInstallments: 12750000, monthlyEquivalentInstallment: 106250,  contractYear: 2023, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2026, coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600', status: UnitStatus.PENDING_REVIEW },

    // طلعت مصطفى – مدينتي
    { title: 'فيلا فاخرة في مدينتي',                             sellerType: SellerType.DEVELOPER, developerId: devTalaat.id,       projectId: projMadinaty.id,    locationId: locNasr.id,      unitTypeId: typeVilla.id,       area: 400, floor: null, bedrooms: 5, bathrooms: 5, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage: 15, expectedRentalRoi: 10.0, originalContractPrice: 22000000, cashPaidToSeller: 3300000, remainingInstallments: 18700000, monthlyEquivalentInstallment: 155833,  contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=600', status: UnitStatus.APPROVED },
    { title: 'شقة 2 غرف في مدينتي – تشطيب ممتاز',              sellerType: SellerType.DEVELOPER, developerId: devTalaat.id,       projectId: projMadinaty.id,    locationId: locNasr.id,      unitTypeId: typeApt.id,         area: 120, floor: 3,    bedrooms: 2, bathrooms: 2, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage: 10, expectedRentalRoi: 13.0, originalContractPrice:  5500000, cashPaidToSeller:  825000, remainingInstallments:  4675000, monthlyEquivalentInstallment:  38958,  contractYear: 2024, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600', status: UnitStatus.APPROVED },

    // طلعت مصطفى – الرحاب
    { title: 'شقة في الرحاب – قريبة من الخدمات',                sellerType: SellerType.DEVELOPER, developerId: devTalaat.id,       projectId: projAlRehab.id,     locationId: locNewCairo.id,  unitTypeId: typeApt.id,         area: 140, floor: 2,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  8, expectedRentalRoi: 12.0, originalContractPrice:  6000000, cashPaidToSeller:  900000, remainingInstallments:  5100000, monthlyEquivalentInstallment:  42500,  contractYear: 2024, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600', status: UnitStatus.APPROVED },

    // بالم هيلز
    { title: 'فيلا في بالم باركس – إطلالة على الحديقة',         sellerType: SellerType.DEVELOPER, developerId: devPalmHills.id,    projectId: projPalmParks.id,   locationId: locZayed.id,     unitTypeId: typeVilla.id,       area: 350, floor: null, bedrooms: 4, bathrooms: 4, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage: 10, expectedRentalRoi: 11.0, originalContractPrice: 17000000, cashPaidToSeller: 2550000, remainingInstallments: 14450000, monthlyEquivalentInstallment: 120416,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2027, coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600', status: UnitStatus.APPROVED },

    // سيتي إيدج
    { title: 'شقة في ذا سيتي إيدج – تصميم عصري',               sellerType: SellerType.DEVELOPER, developerId: devCityEdge.id,     projectId: projCityEdge.id,    locationId: locAdm.id,       unitTypeId: typeApt.id,         area: 160, floor: 7,    bedrooms: 3, bathrooms: 2, finishingStatus: 'نصف تشطيب',       isCashOnly: false, cashDiscountPercentage:  9, expectedRentalRoi: 14.0, originalContractPrice:  9000000, cashPaidToSeller: 1350000, remainingInstallments:  7650000, monthlyEquivalentInstallment:  63750,  contractYear: 2024, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2028, coverImage: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600', status: UnitStatus.PENDING_REVIEW },

    // دامنهور – الإسكندرية
    { title: 'شقة مطلة على البحر – الإسكندرية',                 sellerType: SellerType.DEVELOPER, developerId: devDamnhour.id,     projectId: projAlexView.id,    locationId: locAlexandria.id, unitTypeId: typeApt.id,        area: 180, floor: 4,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب كامل',       isCashOnly: false, cashDiscountPercentage:  7, expectedRentalRoi: 13.5, originalContractPrice:  7500000, cashPaidToSeller: 1125000, remainingInstallments:  6375000, monthlyEquivalentInstallment:  53125,  contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2025, coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600', status: UnitStatus.APPROVED },
  ];

  // ═══════════════════════════════════════════════════════
  // 7. Units – Individual (عقارات الأفراد)
  // ═══════════════════════════════════════════════════════
  const individualUnits: any[] = [
    { title: 'شاليه فيو البحر في الجونة – لقطة كاش',            sellerType: SellerType.INDIVIDUAL, locationId: locGouna.id,      unitTypeId: typeChalet.id,       area: 120, floor: null, bedrooms: 2, bathrooms: 2, finishingStatus: 'تشطيب كامل', isCashOnly: true,  expectedRentalRoi: 19.0, originalContractPrice: 0,        cashPaidToSeller: 5000000, remainingInstallments: 0,       monthlyEquivalentInstallment: 0,       contractYear: 2024, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'محمد أحمد',    submittedByPhone: '01012345678' },
    { title: 'شقة 3 غرف في مدينة نصر – تقسيط متبقي ممتاز',    sellerType: SellerType.INDIVIDUAL, locationId: locNasr.id,       unitTypeId: typeApt.id,          area: 160, floor: 4,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب كامل', isCashOnly: false, cashDiscountPercentage: 5, expectedRentalRoi: 11.5, originalContractPrice: 3000000, cashPaidToSeller:  800000, remainingInstallments: 2200000, monthlyEquivalentInstallment:  22916,  contractYear: 2022, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2023, coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'سارة محمود',   submittedByPhone: '01098765432' },
    { title: 'فيلا في الشيخ زايد – نصف تشطيب فرصة',           sellerType: SellerType.INDIVIDUAL, locationId: locZayed.id,      unitTypeId: typeVilla.id,        area: 300, floor: null, bedrooms: 4, bathrooms: 3, finishingStatus: 'نصف تشطيب',  isCashOnly: false, cashDiscountPercentage: 8, expectedRentalRoi: 10.0, originalContractPrice: 9000000, cashPaidToSeller: 4000000, remainingInstallments: 5000000, monthlyEquivalentInstallment:  52083,  contractYear: 2021, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2023, coverImage: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'أحمد خالد',    submittedByPhone: '01155667788' },
    { title: 'دوبلكس في التجمع الخامس – عقد 2020',              sellerType: SellerType.INDIVIDUAL, locationId: locTajammu.id,    unitTypeId: typeDuplex.id,       area: 210, floor: 6,    bedrooms: 3, bathrooms: 3, finishingStatus: 'تشطيب كامل', isCashOnly: false, cashDiscountPercentage: 12, expectedRentalRoi: 13.0, originalContractPrice: 6000000, cashPaidToSeller: 2500000, remainingInstallments: 3500000, monthlyEquivalentInstallment:  36458,  contractYear: 2020, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2023, coverImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'ياسمين علي',   submittedByPhone: '01223344556' },
    { title: 'شاليه في الساحل الشمالي – قابل للتفاوض',          sellerType: SellerType.INDIVIDUAL, locationId: locSahel.id,      unitTypeId: typeChalet.id,       area:  90, floor: null, bedrooms: 1, bathrooms: 1, finishingStatus: 'تشطيب كامل', isCashOnly: true,  expectedRentalRoi: 17.5, originalContractPrice: 0,        cashPaidToSeller: 3500000, remainingInstallments: 0,       monthlyEquivalentInstallment: 0,       contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'محمود سامي',   submittedByPhone: '01066778899' },
    { title: 'بنتهاوس في العاصمة – فرصة استثمارية نادرة',       sellerType: SellerType.INDIVIDUAL, locationId: locAdm.id,        unitTypeId: typePenthouse.id,    area: 260, floor: 10,   bedrooms: 4, bathrooms: 4, finishingStatus: 'سوبر لوكس',  isCashOnly: false, cashDiscountPercentage: 15, expectedRentalRoi: 15.5, originalContractPrice: 14000000, cashPaidToSeller: 6000000, remainingInstallments: 8000000, monthlyEquivalentInstallment:  83333,  contractYear: 2023, deliveryStatus: DeliveryStatus.UNDER_CONSTRUCTION, deliveryYear: 2026, coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=600', status: UnitStatus.PENDING_REVIEW, submittedByName: 'رنا عمر',      submittedByPhone: '01099887766' },
    { title: 'شقة في المعادي – هادئة ومميزة',                    sellerType: SellerType.INDIVIDUAL, locationId: locMaadi.id,      unitTypeId: typeApt.id,          area: 190, floor: 3,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب كامل', isCashOnly: false, cashDiscountPercentage: 5,  expectedRentalRoi: 10.5, originalContractPrice: 4000000, cashPaidToSeller: 1500000, remainingInstallments: 2500000, monthlyEquivalentInstallment:  26041,  contractYear: 2022, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'كريم نبيل',    submittedByPhone: '01011223344' },
    { title: 'فيلا في الغردقة – إيجار سنوي مضمون',              sellerType: SellerType.INDIVIDUAL, locationId: locHurghada.id,   unitTypeId: typeVilla.id,        area: 270, floor: null, bedrooms: 4, bathrooms: 4, finishingStatus: 'تشطيب كامل', isCashOnly: true,  expectedRentalRoi: 16.0, originalContractPrice: 0,        cashPaidToSeller: 8500000, remainingInstallments: 0,       monthlyEquivalentInstallment: 0,       contractYear: 2023, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'هبة مصطفى',    submittedByPhone: '01033445566' },
    { title: 'استوديو في الإسكندرية – للبيع أو الإيجار',         sellerType: SellerType.INDIVIDUAL, locationId: locAlexandria.id, unitTypeId: typeStudio.id,       area:  65, floor: 5,    bedrooms: 1, bathrooms: 1, finishingStatus: 'تشطيب كامل', isCashOnly: true,  expectedRentalRoi: 14.5, originalContractPrice: 0,        cashPaidToSeller: 1800000, remainingInstallments: 0,       monthlyEquivalentInstallment: 0,       contractYear: 2024, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=600', status: UnitStatus.PENDING_REVIEW, submittedByName: 'نور حسن',      submittedByPhone: '01077889900' },
    { title: 'شقة في القاهرة الجديدة – قريبة من الجامعة',       sellerType: SellerType.INDIVIDUAL, locationId: locNewCairo.id,   unitTypeId: typeApt.id,          area: 145, floor: 2,    bedrooms: 3, bathrooms: 2, finishingStatus: 'تشطيب جزئي', isCashOnly: false, cashDiscountPercentage: 6,  expectedRentalRoi: 12.0, originalContractPrice: 5200000, cashPaidToSeller: 1800000, remainingInstallments: 3400000, monthlyEquivalentInstallment:  35416,  contractYear: 2022, deliveryStatus: DeliveryStatus.READY,              deliveryYear: 2024, coverImage: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=600', status: UnitStatus.APPROVED,      submittedByName: 'طارق إبراهيم', submittedByPhone: '01044556677' },
  ];

  for (const unit of developerUnits)  await prisma.unit.create({ data: unit });
  console.log(`✅ تم إضافة ${developerUnits.length} وحدة للمطورين`);

  for (const unit of individualUnits) await prisma.unit.create({ data: unit });
  console.log(`✅ تم إضافة ${individualUnits.length} عقار للأفراد`);

  console.log('');
  console.log('═══════════════════════════════════════════════════');
  console.log('🎉 اكتمل إضافة جميع البيانات الوهمية بنجاح!');
  console.log(`   • ${8} مطورين`);
  console.log(`   • ${12} مشاريع`);
  console.log(`   • ${developerUnits.length} وحدة مطور`);
  console.log(`   • ${individualUnits.length} عقار فرد`);
  console.log('═══════════════════════════════════════════════════');
}

main()
  .catch((e) => { console.error('❌ خطأ:', e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
