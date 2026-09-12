import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    const dev = await prisma.developer.create({
      data: {
        bio: "نبذة عن المطور\n",
        logoUrl: "https://res.cloudinary.com/yczynhyi/image/upload/v1789209141/bohoor_admin/euvav8ih2ytkt8esi1x8.jpg",
        name: "اسم المطور",
        phone: "+201271617780",
        slug: "unique-slug-here"
      }
    });
    console.log("Success:", dev);
  } catch (e) {
    console.error("Prisma Error:", e);
  } finally {
    await prisma.$disconnect();
  }
}
main();
