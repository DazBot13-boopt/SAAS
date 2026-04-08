# Guide de Dépannage - Bot Twitter Ne Fonctionne Pas

## Problèmes Identifiés

### 1. ✅ Playwright Browsers - RÉSOLU
**Problème:** Les navigateurs Playwright n'étaient pas installés
**Solution:** Exécuté `npx playwright install chromium`

### 2. ⚠️ Identifiants Manquants - ACTION REQUISE
**Problème:** Le compte Twitter n'a pas de mot de passe configuré
- Username: `DlnHack1`
- Password: `DlnHack1` (même que username, donc invalide)
- Email: `null`
- Session Cookies: `[]` (vide)

**Le bot ne peut PAS se connecter automatiquement sans:**
- Soit un mot de passe valide
- Soit des cookies valides (auth_token + ct0)

### 3. ✅ Gestion d'Erreurs Améliorée - RÉSOLU
**Amélioration:** Le code détecte maintenant les identifiants manquants et affiche des messages clairs

---

## Solutions Possibles

### Option 1: Ajouter le Mot de Passe (Recommandé pour tests)

1. Modifiez le fichier `worker/update_credentials.js`
2. Ajoutez vos vrais identifiants:
```javascript
const username = 'DlnHack1';
const email = 'votre-email@example.com'; // Optionnel mais recommandé
const password = 'votre-vrai-mot-de-passe'; // OBLIGATOIRE
```

3. Exécutez:
```bash
cd d:\SAAS\worker
node update_credentials.js
```

### Option 2: Fournir des Cookies Valides (Plus sûr)

1. Connectez-vous à Twitter dans votre navigateur
2. Ouvrez DevTools (F12) → Application → Cookies
3. Copiez TOUS les cookies de `x.com` et `twitter.com`
4. Ajoutez le compte via l'API avec les cookies

**OU utilisez le fichier HTML extrait:**
- Ouvrez `extract-token.html` dans votre navigateur
- Suivez les instructions pour extraire auth_token et ct0
- Ajoutez le compte avec ces cookies

### Option 3: Connexion Manuelle (Temporaire)

Le bot ouvrira une fenêtre Chrome et attendra 15 minutes que vous vous connectiez manuellement.

---

## Comment Tester le Bot

### Étape 1: Vérifier les Services

```bash
# Vérifier que Redis fonctionne
redis-cli ping
# Doit répondre: PONG

# Vérifier que le backend fonctionne
curl http://localhost:4000/health
# Doit répondre: {"status":"ok","service":"backend"}
```

### Étape 2: Démarrer le Worker

```bash
cd d:\SAAS\worker
npm run dev
# ou
npx ts-node src/index.ts
```

### Étape 3: Vérifier les Logs

Vous devriez voir:
```
Worker Booted! Waiting for jobs...
✅ Twitter Worker is successfully connected to Redis and ready for jobs!
🕐 Twitter Scheduler démarré
```

### Étape 4: Tester une Action Manuelle

```bash
# Dans un autre terminal
curl -X POST http://localhost:4000/api/twitter-accounts/DlnHack1-ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "warmUp"}'
```

Remplacez `DlnHack1-ID` par le vrai ID du compte (trouvé avec `node check_accounts.js`)

### Étape 5: Surveiller l'Exécution

Les logs afficheront:
- 🚀 Initialisation de la session
- 🍪 Chargement des cookies (ou tentative de login)
- ⚡ Exécution de l'action
- ✅ Succès ou ❌ Erreur

---

## Problèmes Fréquents

### Le Scheduler ne lance rien?

**Cause:** Le scheduler attend 30-120 minutes entre les actions

**Solution:** Forcer une action manuelle via l'API (voir Étape 4)

### Le bot échoue avec "Timeout"?

**Causes possibles:**
1. Proxy invalide ou lent
2. Twitter bloque la connexion
3. Identifiants incorrects

**Solution:** 
- Vérifiez les logs détaillés
- Testez sans proxy
- Vérifiez que les credentials sont corrects

### Le bot dit "Session valide" mais ne fait rien?

**Cause:** Les cookies sont expirés

**Solution:** 
```bash
# Supprimer la session sauvegardée
rm -rf worker/sessions/*
# Relancer le worker pour forcer une nouvelle connexion
```

---

## Architecture du Système

```
Frontend (Next.js)
    ↓ HTTP
Backend (Express + Socket.io)
    ↓ BullMQ Queue
Redis
    ↓ Worker
Twitter Bot (Playwright)
```

### Files d'Attente (Queues)

1. **twitter-actions** - Actions Twitter (like, follow, post, etc.)
2. **instagram-actions** - Actions Instagram (pas utilisé actuellement)

### Scheduler Automatique

Le scheduler (`worker/src/utils/scheduler.ts`):
- Vérifie toutes les minutes
- Attend 30-120 min entre les actions
- Ne fonctionne pas entre 1h et 6h du matin
- Choisit l'action selon l'heure et des poids probabilistes

**Distribution des actions:**
- warmUp: 30%
- autoLike: 25%
- autoComment: 15%
- autoRetweet: 15%
- autoFollow: 10%
- autoPost: 5%

---

## Commandes Utiles

```bash
# Vérifier les comptes
cd worker
node check_accounts.js

# Mettre à jour les credentials
node update_credentials.js

# Voir les jobs en attente
npx ts-node -e "
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const redis = new IORedis('redis://127.0.0.1:6379', { maxRetriesPerRequest: null });
const queue = new Queue('twitter-actions', { connection: redis });
queue.getJobs().then(jobs => {
  console.log('Jobs:', jobs.length);
  jobs.forEach(j => console.log(j.id, j.data.action, j.state));
});
"

# Vider la file d'attente
npx ts-node -e "
const { Queue } = require('bullmq');
const IORedis = require('ioredis');
const redis = new IORedis('redis://127.0.0.1:6379', { maxRetriesPerRequest: null });
const queue = new Queue('twitter-actions', { connection: redis });
queue.obliterate({ force: true }).then(() => console.log('Queue vidée'));
"

# Redémarrer tous les services (Docker)
docker-compose restart
```

---

## Prochaines Étapes

1. **MAINTENANT:** Configurer les identifiants du compte (Option 1, 2 ou 3)
2. Tester avec une action manuelle `warmUp`
3. Vérifier que le bot peut se connecter
4. Laisser le scheduler fonctionner automatiquement

---

## Besoin d'Aide?

Vérifiez toujours:
1. ✅ Redis fonctionne? (`redis-cli ping`)
2. ✅ Backend fonctionne? (`curl http://localhost:4000/health`)
3. ✅ Worker démarré? (voir les logs)
4. ✅ Compte a des credentials? (`node check_accounts.js`)
5. ✅ Playwright installé? (`npx playwright install`)

Logs importants:
- `worker/worker_safe.log`
- `worker/worker_test.log`
- Console du worker en temps réel
