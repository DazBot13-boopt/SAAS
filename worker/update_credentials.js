const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateAccountCredentials() {
    try {
        // Update the account with actual credentials
        // IMPORTANT: Replace these with your actual Twitter credentials
        const username = 'DlnHack1';
        const email = null; // Add your email if you have one
        const password = null; // Add your password here
        
        const updated = await prisma.twitterAccount.update({
            where: { username: username },
            data: {
                ...(email && { email: email }),
                ...(password && { password: password })
            }
        });
        
        console.log('Account updated:', updated.username);
        console.log('Has email:', !!updated.email);
        console.log('Has password:', !!updated.password && updated.password !== updated.username);
        
        if (!updated.email || !updated.password || updated.password === updated.username) {
            console.log('\n⚠️  WARNING: Credentials are still missing!');
            console.log('To enable automatic login, you need to:');
            console.log('1. Update this script with your actual email and password');
            console.log('2. Or provide valid cookies (auth_token + ct0)');
        } else {
            console.log('\n✅ Credentials configured! Automatic login should work now.');
        }
    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateAccountCredentials();
