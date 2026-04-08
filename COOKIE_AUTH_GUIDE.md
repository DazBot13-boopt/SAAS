# 🍪 Guide Complet: Extraire les Cookies Twitter

## 📋 Qu'est-ce que les Cookies Twitter?

Les cookies sont des informations de session qui permettent de rester connecté à Twitter/X. En les extrayant, vous pouvez les donner au bot pour qu'il utilise votre compte sans avoir à se connecter.

## 🔍 Cookies Requis

Pour que le bot fonctionne, vous devez fournir **au minimum**:
- `auth_token` - Token d'authentification principal (**OBLIGATOIRE**)
- `ct0` - Token CSRF (**recommandé** pour les requêtes API)

## 📖 Méthode: Extraction depuis le Navigateur

### Étape 1: Connectez-vous à Twitter

1. Ouvrez **Chrome** ou **Edge**
2. Allez sur https://x.com
3. Connectez-vous avec vos identifiants

### Étape 2: Ouvrez les DevTools

1. Appuyez sur **F12** (ou clic droit → Inspecter)
2. Allez dans l'onglet **Application** (Chrome) ou **Stockage** (Firefox)

### Étape 3: Trouvez les Cookies

1. Dans la barre latérale gauche, développez **Cookies**
2. Cliquez sur **https://x.com**

### Étape 4: Copiez les Valeurs

**Pour auth_token (OBLIGATOIRE):**
1. Cherchez `auth_token` dans la liste des cookies
2. Double-cliquez sur la valeur dans la colonne "Value"
3. Copiez la valeur (Ctrl+C)

**Pour ct0 (recommandé):**
1. Cherchez `ct0` dans la liste des cookies
2. Double-cliquez sur la valeur
3. Copiez la valeur

### Étape 5: Collez dans le Bot

C'est tout! Vous n'avez pas besoin de formater en JSON. Le bot le fait automatiquement.

## ⚡ Méthode 2: Extraction Rapide via Console

### Script Automatique

1. Connectez-vous à https://x.com
2. Appuyez sur **F12**
3. Allez dans l'onglet **Console**
4. Collez ce script:

```javascript
// Script pour extraire tous les cookies Twitter
const cookies = document.cookie.split(';').map(c => c.trim());
const requiredCookies = ['auth_token', 'ct0', 'twid'];

const extractedCookies = requiredCookies
  .map(name => {
    const cookie = cookies.find(c => c.startsWith(name + '='));
    if (cookie) {
      const value = cookie.split('=').slice(1).join('=');
      return {
        name: name,
        value: value,
        domain: '.x.com',
        path: '/',
        secure: true,
        httpOnly: name === 'auth_token',
        sameSite: 'Lax'
      };
    }
    return null;
  })
  .filter(c => c !== null);

// Affiche le JSON formaté
console.log('=== COPIEZ CE JSON ===');
console.log(JSON.stringify(extractedCookies, null, 2));
console.log('======================');
```

5. Appuyez sur **Enter**
6. **Copiez le JSON affiché**

### ⚠️ Limitation de cette méthode

Ce script ne peut extraire que les cookies **non httpOnly**. Le cookie `auth_token` est httpOnly et ne sera pas accessible via JavaScript.

**Solution**: Utilisez la **Méthode 1** (Application tab) pour `auth_token`.

## 🎯 Méthode 3: Extension de Navigateur (Recommandée)

### Installation de l'extension

1. Installez **EditThisCookie** (Chrome) ou **Cookie-Editor** (Firefox)
2. Allez sur https://x.com
3. Cliquez sur l'icône de l'extension
4. Exportez tous les cookies au format JSON

### Filtrer les cookies nécessaires

Gardez uniquement:
- `auth_token`
- `ct0`
- `twid` (optionnel)

## 📝 Comment Ajouter les Cookies au Bot

### Étape 1: Ouvrez le Formulaire

1. Allez sur http://localhost:3001
2. Cliquez sur le bouton **"+"** (Add Account) dans la sidebar
3. Sélectionnez **Twitter** (icône Twitter/X)

### Étape 2: Remplissez le Formulaire

1. **Username**: Votre username Twitter (sans @)
2. **Account Role**: MAIN ou SUPPORT
3. **Auth Token**: Collez la valeur du cookie auth_token
4. **CT0** (optionnel): Collez la valeur du cookie ct0

### Étape 3: Exemple

```
Username: mon_compte_twitter
Auth Token: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
CT0: 1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

C'est tout! Le bot construit automatiquement le format de cookies requis.

### Étape 4: Validez

Cliquez sur **"Initialize Node"** et le compte sera ajouté avec le statut **ACTIVE**.

## ✅ Vérification

Après avoir ajouté le compte:

1. Le compte devrait apparaître dans la liste avec le statut **ACTIVE**
2. Vous pouvez lancer des actions immédiatement
3. Le bot utilisera vos cookies pour interagir avec Twitter

## 🔒 Sécurité

### Bonnes Pratiques

- ✅ **Ne partagez jamais vos cookies** publiquement
- ✅ **Utilisez des proxies** pour éviter les bans
- ✅ **Limitez les actions** pour rester sous les radars
- ✅ **Rotation de cookies**: Extrayez de nouveaux cookies régulièrement

### Durée de Vie des Cookies

- Les cookies Twitter durent généralement **plusieurs mois**
- Le bot les **met à jour automatiquement** après chaque action
- Si un cookie expire, extrayez-en de nouveaux et mettez à jour le compte

## 🐛 Résolution de Problèmes

### Erreur: "auth_token cookie is required"

**Cause**: Le JSON ne contient pas de cookie nommé `auth_token`

**Solution**: Vérifiez que votre JSON contient:
```json
{
  "name": "auth_token",
  "value": "votre_token"
}
```

### Erreur: "Cookies array is required"

**Cause**: Le champ cookies est vide ou le JSON est invalide

**Solution**: 
1. Vérifiez que le JSON est bien formé
2. Utilisez un validateur JSON en ligne
3. Assurez-vous que c'est un tableau `[]` et non un objet `{}`

### Le compte est ajouté mais les actions échouent

**Cause**: Cookies invalides ou expirés

**Solution**:
1. Reconnectez-vous à Twitter dans votre navigateur
2. Extrayez de nouveaux cookies
3. Supprimez l'ancien compte du bot
4. Recréez-le avec les nouveaux cookies

## 💡 Astuces Pro

### 1. Gardez une sauvegarde de vos cookies

Stockez vos cookies dans un fichier sécurisé pour pouvoir les restaurer rapidement.

### 2. Utilisez plusieurs comptes

Créez plusieurs comptes Twitter et ajoutez-les tous au bot avec leurs cookies respectifs.

### 3. Testez avant de lancer

Après avoir ajouté un compte, lancez une action simple (Warm Up) pour vérifier que les cookies fonctionnent.

### 4. Surveillez les logs

Consultez les logs du worker pour voir si les cookies sont correctement utilisés:
```
🍪 Chargement des cookies de session...
✅ Session valide - Accès direct accordé!
```

## 📚 Ressources

- [Documentation Twitter Cookies](https://developer.twitter.com/en/docs/authentication/overview)
- [EditThisCookie Extension](https://chrome.google.com/webstore/detail/editthiscookie)
- [Cookie-Editor Extension](https://addons.mozilla.org/firefox/addon/cookie-editor)

---

**Besoin d'aide?** Consultez les logs du backend ou contactez le support.
