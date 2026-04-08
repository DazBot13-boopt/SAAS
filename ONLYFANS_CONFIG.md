# 🎯 Configuration OnlyFans/Adult Content - Bot Twitter

## ✅ Bot Optimisé pour OnlyFans et Contenu pour Adultes

Le bot a été entièrement reconfiguré pour cibler spécifiquement:
- **Créateurs OnlyFans**
- **Modèles**
- **Influenceurs contenu adulte**
- **Comptes NSFW**

---

## 📊 Stratégie d'Actions

### Distribution des Actions (Optimisée)

| Action | Pourcentage | Description |
|--------|-------------|-------------|
| **Auto-Like** | 30% | Like 5-12 posts par session |
| **Warm-Up** | 25% | Navigation naturelle |
| **Auto-Follow** | 20% | Suit 3-7 comptes ciblés |
| **Auto-Comment** | 15% | Commente 2-4 posts |
| **Auto-Retweet** | 5% | Retweete 1-3 posts |
| **Auto-Post** | 5% | Publie des tweets |

### Horaires Optimisés

| Période | Stratégie |
|---------|-----------|
| **20h - 1h** | 🔥 Maximum engagement (pic contenu adulte) |
| **12h - 16h** | 📈 Bonne engagement (pause déjeuner) |
| **Week-end** | 📊 +20% follow et like |
| **2h - 7h** | ⏸️ Pause (repos du compte) |

---

## 🎯 Ciblage par Mots-Clés

Le bot recherche automatiquement ces termes:
- `onlyfans`
- `model`
- `babe`
- `sexy`
- `hot`
- `nsfw`
- `adult`
- `18+`
- `content creator`
- `influencer`

---

## 💬 Commentaires Adaptés

### Exemples de Commentaires Automatiques:
```
🔥🔥🔥 Absolutely stunning!
Wow, you look incredible 😍
This is pure perfection 💯
Goddess 👑✨
You're on fire today! 🔥😍
Absolutely gorgeous 😘
Queen behavior 👑💋
Stunning as always 💖
```

### Exemples de Tweets Automatiques:
```
Late night vibes 🌙✨ Who else is awake?
Feeling myself today 💋🔥
New content dropping soon... stay tuned 😏
Who wants to see more? 😈🔥
Just posted something special... link in bio 😏💋
```

---

## 🚀 Actions par Session

### Warm-Up
- Navigation naturelle sur le feed
- Like des posts de modèles/créateurs
- Scroll organique

### Auto-Like (5-12 likes)
- Cible: Contenu OnlyFans/modèles
- Timing: 2-5 secondes entre chaque like
- Anti-détection activé

### Auto-Follow (3-7 follows)
- Recherche: "onlyfans model content creator"
- Cible: Créateurs actifs
- Timing: 3-7 secondes entre chaque follow

### Auto-Comment (2-4 comments)
- Commentaires flatteurs et engageants
- Timing naturel (4-10 secondes)
- Emojis adaptés au contenu adulte

### Auto-Retweet (1-3 retweets)
- Retweete du contenu viral
- Confirmation de dialogue
- Timing: 3-8 secondes

### Auto-Post
- Tweets engageants et suggestifs
- Call-to-action pour le bio link
- Emojis attractifs

---

## 📈 Stratégie de Croissance

### Phase 1: Warm-Up (Semaine 1-2)
- 20-30 likes/jour
- 10-15 follows/jour
- 5-10 commentaires/jour
- Objectif: Chauffer le compte

### Phase 2: Growth (Semaine 3-4)
- 40-60 likes/jour
- 20-30 follows/jour
- 10-15 commentaires/jour
- 2-3 posts/semaine
- Objectif: Gagner en visibilité

### Phase 3: Scale (Mois 2+)
- 80-100 likes/jour
- 30-50 follows/jour
- 15-20 commentaires/jour
- 1 post/jour
- Objectif: Maximiser l'audience

---

## ⚙️ Configuration Actuelle

### Scheduler
- **Vérification:** Toutes les 1 minute
- **Intervalle actions:** 30-120 minutes (aléatoire)
- **Pause nocturne:** 2h - 7h
- **Week-end:** Plus agressif

### Anti-Détection
- ✅ Navigation humaine simulée
- ✅ Délais aléatoires
- ✅ Mouse movements réalistes
- ✅ Scroll naturel
- ✅ Typos aléatoires (3%)
- ✅ Fingerprint unique
- ✅ User-Agent mobile réaliste

---

## 🎮 Contrôle du Bot

### Voir les logs en temps réel
Le worker affiche:
```
[DlnHack1] ❤️ Auto-Like : Ciblage de 8 posts (OnlyFans/Model content)...
[DlnHack1] ❤️ Liked post #1/8 (model/OF content)
[DlnHack1] ❤️ Liked post #2/8 (model/OF content)
[DlnHack1] 👥 Auto-Follow : Recherche de "onlyfans model" pour suivre 5 comptes...
[DlnHack1] 👤 Followed account #1/5 (OnlyFans niche)
```

### Forcer une action manuelle
```bash
# Warm-Up
curl -X POST http://localhost:4000/api/twitter-accounts/ACCOUNT_ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "warmUp"}'

# Auto-Like
curl -X POST http://localhost:4000/api/twitter-accounts/ACCOUNT_ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "autoLike"}'

# Auto-Follow
curl -X POST http://localhost:4000/api/twitter-accounts/ACCOUNT_ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "autoFollow"}'

# Auto-Comment
curl -X POST http://localhost:4000/api/twitter-accounts/ACCOUNT_ID/action \
  -H "Content-Type: application/json" \
  -d '{"action": "autoComment"}'
```

---

## ⚠️ Précautions Importantes

### Limites à respecter
- **Max likes/jour:** 100-150
- **Max follows/jour:** 50-75
- **Max comments/jour:** 30-40
- **Max posts/jour:** 3-5

### Signes de danger
- Compte en CHECKPOINT → Arrêter immédiatement
- Erreurs de connexion répétées → Changer les cookies
- Tweets supprimés → Réduire la fréquence

### Bonnes pratiques
1. ✅ Utiliser des proxies résidentiels
2. ✅ Varier les horaires d'actions
3. ✅ Ne pas dépasser les limites
4. ✅ Surveiller les logs régulièrement
5. ✅ Mettre à jour les cookies chaque semaine

---

## 📊 Monitoring

### Vérifier l'activité
```bash
# Voir les jobs en attente
# Utiliser l'interface web http://localhost:3000

# Voir les logs du worker
# Terminal du worker (en cours d'exécution)
```

### Stats à surveiller
- Likes donnés/reçus
- Follows donnés
- Tweets publiés
- Commentaires postés
- Vues de profil

---

## 🔧 Personnalisation

### Modifier les keywords
Dans `worker/src/utils/scheduler.ts`, ligne ~156:
```typescript
keyword: ['onlyfans', 'model', 'babe', 'sexy', 'hot', 'nsfw', 'adult', '18+', 'content creator', 'influencer']
```

### Modifier les commentaires
Dans `worker/src/twitter.ts`, ligne ~789:
```typescript
const AUTO_COMMENTS = [
    // Ajoutez vos commentaires personnalisés
];
```

### Modifier les tweets
Dans `worker/src/twitter.ts`, ligne ~862:
```typescript
const AUTO_TWEETS = [
    // Ajoutez vos tweets personnalisés
];
```

### Ajuster les horaires
Dans `worker/src/utils/scheduler.ts`, ligne ~112:
```typescript
// Modifier les heures de pause
if (hour >= 2 && hour <= 7) return null;

// Modifier les pics d'activité
if (hour >= 20 || hour <= 1) {
    // Evening/Night strategy
}
```

---

## 🚀 Prochaines Étapes

1. ✅ Bot configuré pour OnlyFans/adult content
2. ✅ Scheduler optimisé pour les pics d'engagement
3. ✅ Commentaires et tweets adaptés
4. 📝 Ajouter des cookies valides (si pas fait)
5. 📝 Laisser le bot tourner 24/7
6. 📝 Surveiller les performances
7. 📝 Ajuster selon les résultats

---

## 🆘 Support

Si le bot ne fonctionne pas comme prévu:
1. Vérifiez les logs du worker
2. Vérifiez que les cookies sont valides
3. Réduisez la fréquence des actions
4. Changez de proxy si nécessaire
5. Extrayez de nouveaux cookies

**Le bot est maintenant 100% optimisé pour OnlyFans et le contenu pour adultes!** 🔥
