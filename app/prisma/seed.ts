import prisma from '../src/prisma/client';

async function main() {
  const admin = await prisma.role.upsert({
    where: { bitMask: '10000000' },
    update: {},
    create: {
      bitMask: '10000000',
      title: 'Admin'
    },
  })
  const moderator = await prisma.role.upsert({
    where: { bitMask: '01000000' },
    update: {},
    create: {
      bitMask: '01000000',
      title: 'Moderator'
    },
  })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })