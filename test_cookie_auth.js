// Test: Ajouter un compte Twitter avec cookies (format simple)
const testAddTwitterAccount = async () => {
    // Simulate what the frontend does: build cookies array from simple values
    const authTokenValue = 'test_token_12345';  // Just the value
    const ct0Value = 'test_ct0_67890';          // Just the value

    const testAccount = {
        username: `test_user_${Date.now()}`,
        type: 'MAIN',
        cookies: [
            {
                name: 'auth_token',
                value: authTokenValue,
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: true,
                sameSite: 'Lax'
            },
            {
                name: 'ct0',
                value: ct0Value,
                domain: '.x.com',
                path: '/',
                secure: true,
                httpOnly: false,
                sameSite: 'Lax'
            }
        ]
    };

    try {
        console.log('🧪 Test: Ajout de compte Twitter avec cookies (format simple)...');
        console.log('\n📝 Valeurs saisies:');
        console.log('   auth_token:', authTokenValue);
        console.log('   ct0:', ct0Value);
        console.log('\n📦 Cookies générés automatiquement:');
        console.log(JSON.stringify(testAccount.cookies, null, 2));

        const response = await fetch('http://localhost:4000/api/twitter-accounts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testAccount)
        });

        const data = await response.json();

        if (response.ok) {
            console.log('\n✅ SUCCÈS!');
            console.log('Compte créé avec ID:', data.id);
            console.log('Status:', data.status);
            console.log('\n🎉 L\'utilisateur saisit juste les valeurs, le backend reçoit le format complet!');
        } else {
            console.log('\n❌ ÉCHEC!');
            console.log('Erreur:', data.error);
        }
    } catch (error) {
        console.log('\n❌ ERREUR:', error.message);
    }
};

testAddTwitterAccount();
