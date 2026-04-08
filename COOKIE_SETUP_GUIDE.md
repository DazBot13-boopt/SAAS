# 🍪 Configuration Cookies Twitter - Guide Rapide

## Le bot fonctionne maintenant en MODE COOKIES UNIQUEMENT ✅

### Comment extraire et appliquer vos cookies:

---

## Méthode 1: Utiliser l'outil visuel (Recommandé)

1. **Ouvrez l'extracteur:**
   ```
   Ouvrez: d:\SAAS\extract_cookies_easy.html dans votre navigateur
   ```

2. **Connectez-vous à Twitter:**
   - Allez sur https://x.com
   - Connectez-vous avec vos identifiants
   - **Restez connecté!**

3. **Extrayez les cookies:**
   - Sur l'onglet x.com, appuyez sur `F12`
   - Allez dans l'onglet **Console**
   - Copiez le code fourni par l'outil
   - Collez-le dans la console et appuyez sur Entrée

4. **Copiez le JSON résultant** et collez-le dans l'outil

5. **Générez et exécutez le script:**
   - L'outil va générer un script automatiquement
   - Copiez-le dans `d:\SAAS\worker\apply_cookies.js`
   - Exécutez: `node d:\SAAS\worker\apply_cookies.js`

---

## Méthode 2: Manuellement

### Étape 1: Extraire les cookies

1. Ouvrez https://x.com et connectez-vous
2. Appuyez sur `F12` (DevTools)
3. Allez dans **Application** → **Cookies** → **https://x.com**
4. Trouvez et copiez ces cookies:
   - `auth_token` (TRÈS IMPORTANT)
   - `ct0` (TRÈS IMPORTANT)
   - `guest_id`
   - `_twitter_sess`
   - `personalization_id`
   - `lang`
   - Tous les autres que vous voyez

### Étape 2: Mettre à jour le fichier

Éditez `d:\SAAS\worker\update_cookies.js` et remplacez:
- `VOTRE_CT0_ICI` par votre vrai ct0
- Les valeurs exemples par vos vrais cookies

### Étape 3: Appliquer

```bash
cd d:\SAAS\worker
node update_cookies.js
```

---

## Vérification

Après avoir appliqué les cookies:

```bash
# Vérifier que les cookies sont en base
cd d:\SAAS\worker
node check_accounts.js
```

Vous devriez voir:
- `sessionCookies`: [array avec plusieurs cookies]
- `ct0`: "votre_ct0"

---

## Tester le Bot

Une fois les cookies appliqués:

1. **Le scheduler va automatiquement** lancer des actions toutes les 30-120 min
2. **Ou forcez une action manuelle:**

```bash
curl -X POST http://localhost:4000/api/twitter-accounts/VOTRE_ACCOUNT_ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "warmUp"}'
```

Remplacez `VOTRE_ACCOUNT_ID` par l'ID trouvé avec `check_accounts.js`

---

## Logs du Worker

Surveillez les logs pour voir si ça fonctionne:

```
✅ Connexion réussie avec les cookies!
✅ Session furtive créée.
🔥 Warm Up : Navigation naturelle sur X...
✅ Warm Up terminé.
```

Si vous voyez ça, **ça marche!** 🎉

---

## Problèmes Fréquents

### ❌ "Cookies invalides ou expirés"
**Solution:** Les cookies ont expiré, extrayez-en de nouveaux

### ❌ "Cookie ct0 manquant"
**Solution:** Assurez-vous d'avoir copié le cookie `ct0`

### ❌ "auth_token manquant"
**Solution:** Connectez-vous à x.com et extrayez à nouveau les cookies

### ⚠️ Le bot ne fait rien
**Solution:** Le scheduler attend 30-120 min entre les actions. Forcez une action manuelle.

---

## IMPORTANT

- Les cookies expirent après quelques jours/semaines
- Vous devrez les mettre à jour régulièrement
- **Ne partagez JAMAIS vos cookies** (c'est comme donner votre mot de passe)
- Gardez-les en sécurité

---

## Files d'attente

Voir les jobs en attente:
```bash
npx ts-node -e "const { Queue } = require('bullmq'); const IORedis = require('ioredis'); const redis = new IORedis('redis://127.0.0.1:6379', { maxRetriesPerRequest: null }); const queue = new Queue('twitter-actions', { connection: redis }); queue.getJobs().then(jobs => console.log('Jobs:', jobs.length, jobs.map(j => ({id: j.id, action: j.data.action, state: j.state}))));"
```

Vider la file d'attente:
```bash
npx ts-node -e "const { Queue } = require('bullmq'); const IORedis = require('ioredis'); const redis = new IORedis('redis://127.0.0.1:6379', { maxRetriesPerRequest: null }); const queue = new Queue('twitter-actions', { connection: redis }); queue.obliterate({ force: true }).then(() => console.log('Queue vidée'));"
```
