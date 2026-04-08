const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function updateCookies() {
    try {
        // Vous devez extraire TOUS les cookies de Twitter depuis votre navigateur
        // Ouvrez x.com → F12 → Application → Cookies → Copiez tous les cookies
        
        // Exemple de structure (REMPLACEZ avec vos vrais cookies):
        const cookies = [
            {
                name: 'auth_token',
                value: 'ac9dfe545737930dc426b3ffe1012b33aff88800', // Votre auth_token
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: 'Lax'
            },
            {
                name: 'ct0',
                value: 'VOTRE_CT0_ICI', // ⚠️ REMPLACEZ CECI avec votre vrai ct0
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Lax'
            },
            // Ajoutez TOUS les autres cookies de x.com
            {
                name: 'guest_id',
                value: 'v1%3A1234567890', // Exemple
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false
            },
            {
                name: 'guest_id_ads',
                value: 'v1%3A1234567890',
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false
            },
            {
                name: 'guest_id_marketing',
                value: 'v1%3A1234567890',
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false
            },
            {
                name: 'personalization_id',
                value: '"v1_abcdef123456"',
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false
            },
            {
                name: '_twitter_sess',
                value: 'BAh7CS...', // Votre session
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: true
            },
            {
                name: 'lang',
                value: 'en',
                domain: '.x.com',
                path: '/',
                secure: false,
                httpOnly: false
            }
        ];

        const updated = await prisma.twitterAccount.update({
            where: { username: 'DlnHack1' },
            data: {
                sessionCookies: cookies,
                ct0: 'VOTRE_CT0_ICI' // ⚠️ REMPLACEZ avec votre vrai ct0
            }
        });

        console.log('✅ Cookies mis à jour pour:', updated.username);
        console.log('Nombre de cookies:', cookies.length);
        console.log('\n⚠️  IMPORTANT:');
        console.log('1. Remplacez "VOTRE_CT0_ICI" par votre vrai ct0');
        console.log('2. Ajoutez TOUS les cookies de x.com depuis votre navigateur');
        console.log('3. Ouvrez x.com → F12 → Application → Cookies → x.com');
        console.log('4. Copiez chaque cookie avec: name, value, domain, path');
    } catch (error) {
        console.error('❌ Erreur:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

updateCookies();
