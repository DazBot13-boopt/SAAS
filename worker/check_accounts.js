const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAccounts() {
    try {
        const accounts = await prisma.twitterAccount.findMany();
        console.log('Twitter accounts in database:', accounts.length);
        console.log(JSON.stringify(accounts, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

checkAccounts();
