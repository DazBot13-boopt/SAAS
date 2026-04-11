const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('YVeT6TFm', 10);
    const updated = await prisma.user.update({
        where: { email: 'ghost@centent.com' },
        data: { password: hashedPassword, isActive: true }
    });
    console.log("Updated", updated.email);
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); });
