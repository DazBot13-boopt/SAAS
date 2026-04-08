// Test: Vérifier toutes les fonctionnalités implémentées
const testAllFeatures = async () => {
    const baseUrl = 'http://localhost:4000';
    
    console.log('🧪 TEST DES FONCTIONNALITÉS\n');
    console.log('=' .repeat(50));

    // Test 1: Health Check
    console.log('\n1️⃣  Health Check');
    try {
        const res = await fetch(`${baseUrl}/health`);
        const data = await res.json();
        console.log('   ✅ Backend:', data.status);
    } catch (error) {
        console.log('   ❌ Backend inaccessible');
    }

    // Test 2: Groups API
    console.log('\n2️⃣  Groupes de Comptes');
    try {
        const res = await fetch(`${baseUrl}/api/groups`);
        const groups = await res.json();
        console.log('   ✅ GET /api/groups:', groups.length, 'groupes');
        
        // Create a test group
        const createRes = await fetch(`${baseUrl}/api/groups`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Group',
                description: 'Groupe de test',
                taskType: 'warmup'
            })
        });
        if (createRes.ok) {
            const newGroup = await createRes.json();
            console.log('   ✅ POST /api/groups: créé', newGroup.id);
        }
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 3: Templates API
    console.log('\n3️⃣  Templates de Contenu');
    try {
        const res = await fetch(`${baseUrl}/api/templates`);
        const templates = await res.json();
        console.log('   ✅ GET /api/templates:', templates.length, 'templates');
        
        // Create a test template
        const createRes = await fetch(`${baseUrl}/api/templates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Post',
                content: 'Ceci est un test de template',
                type: 'post',
                hashtags: ['test', 'automation']
            })
        });
        if (createRes.ok) {
            const newTemplate = await createRes.json();
            console.log('   ✅ POST /api/templates: créé', newTemplate.id);
        }
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 4: Activities API
    console.log('\n4️⃣  Historique des Activités');
    try {
        const res = await fetch(`${baseUrl}/api/activities?limit=10`);
        const activities = await res.json();
        console.log('   ✅ GET /api/activities:', activities.length, 'activités');
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 5: Comment Requests API
    console.log('\n5️⃣  Distribution de Commentaires');
    try {
        const res = await fetch(`${baseUrl}/api/comment-requests`);
        const requests = await res.json();
        console.log('   ✅ GET /api/comment-requests:', requests.length, 'demandes');
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 6: Ban Alerts API
    console.log('\n6️⃣  Alertes de Ban');
    try {
        const res = await fetch(`${baseUrl}/api/ban-alerts`);
        const alerts = await res.json();
        console.log('   ✅ GET /api/ban-alerts:', alerts.length, 'alertes');
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 7: Notifications API
    console.log('\n7️⃣  Notifications');
    try {
        const res = await fetch(`${baseUrl}/api/notifications`);
        const notifications = await res.json();
        console.log('   ✅ GET /api/notifications:', notifications.length, 'notifications');
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    // Test 8: Twitter Accounts
    console.log('\n8️⃣  Comptes Twitter');
    try {
        const res = await fetch(`${baseUrl}/api/twitter-accounts`);
        const accounts = await res.json();
        console.log('   ✅ GET /api/twitter-accounts:', accounts.length, 'comptes');
        
        if (accounts.length > 0) {
            const account = accounts[0];
            console.log('   📝 Premier compte:', account.username);
            console.log('   📊 Statut:', account.status);
            console.log('   🏷️  Niche:', account.niche || 'Non définie');
        }
    } catch (error) {
        console.log('   ❌ Erreur:', error.message);
    }

    console.log('\n' + '=' .repeat(50));
    console.log('✅ TEST TERMINÉ\n');
};

testAllFeatures();
