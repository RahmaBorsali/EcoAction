# EcoAction 🌱 – Plateforme de Bénévolat Environnemental

Application mobile React Native permettant aux citoyens de découvrir, s'inscrire et gérer des missions de bénévolat environnementales locales.

## ✨ Fonctionnalités

- **Authentification** : Connexion / Inscription avec persistance sécurisée (SecureStore)
- **Exploration des missions** : Liste avec filtres par catégorie et recherche textuelle
- **Détails de mission** : Description complète, places restantes, exigences
- **Inscription/Annulation** : Avec **Optimistic UI** (TanStack Query)
- **Mes Missions** : Vue personnelle des inscriptions à venir et passées
- **Profil** : Statistiques dynamiques (missions complétées, heures, impact)

## 🚀 Stack Technique

| Technologie | Usage |
|---|---|
| **Expo SDK 54** | Framework mobile cross-platform |
| **Expo Router v4** | Navigation file-based |
| **TypeScript (strict)** | Typage statique sans `any` |
| **TanStack Query v5** | Data fetching + cache + Optimistic UI |
| **NativeWind v4** | Tailwind CSS pour React Native |
| **Axios** | Client HTTP avec intercepteurs |
| **JSON-Server** | API REST mock |
| **expo-secure-store** | Stockage sécurisé du token |

## 📁 Structure du projet

```
EcoAction/
├── app/
│   ├── _layout.tsx          # Root layout (providers)
│   ├── index.tsx            # Redirect (auth guard)
│   ├── (auth)/
│   │   ├── login.tsx        # Écran de connexion
│   │   └── register.tsx     # Écran d'inscription
│   ├── (tabs)/
│   │   ├── index.tsx        # Explorer les missions
│   │   ├── my-missions.tsx  # Mes missions
│   │   └── profile.tsx      # Profil utilisateur
│   └── mission/
│       └── [id].tsx         # Détail d'une mission
├── src/
│   ├── api/                 # Appels API (client, missions, auth, participations)
│   ├── components/          # Composants réutilisables
│   ├── context/             # AuthContext
│   ├── hooks/               # useQuery & useMutation hooks
│   └── types/               # Interfaces TypeScript
├── server/
│   └── db.json              # Base de données mock JSON-Server
└── package.json
```

## 🛠️ Installation & Lancement

### 1. Prérequis
- Node.js 18+
- Expo Go sur votre téléphone (Android/iOS)
- Les deux appareils sur le **même réseau Wi-Fi**

### 2. Installation des dépendances
```bash
npm install
```

### 3. Démarrer le serveur JSON-Server

**Option A – Android Emulator :**
```bash
npm run server        # écoute sur localhost:3001
```
Dans `src/api/client.ts`, utilisez : `http://10.0.2.2:3001`

**Option B – Expo Go sur téléphone physique :**
```bash
npm run server:host   # écoute sur 0.0.0.0:3001
```
Dans `src/api/client.ts`, mettez l'IP locale de votre machine :
```ts
const BASE_URL = 'http://192.168.X.X:3001'; // votre IP locale
```
> Trouvez votre IP locale avec : `ipconfig` (Windows) → `IPv4 Address`

### 4. Démarrer Expo
Dans un **second terminal** :
```bash
npm start
```
Scannez le QR code avec **Expo Go**.

### 5. Compte de démonstration
```
Email    : demo@ecoaction.fr
Password : demo123
```

## 🎨 Design

- **Palette** : Vert forêt (#2D6A4F), Menthe (#52B788), Orange (#F4A261), Fond (#F0F7F4)
- **Composants** : Cards avec ombres, badges de catégorie, progress bars, shimmer skeletons
- **Animations** : Feedback haptique, transitions de navigation

## 🔧 Configuration TanStack Query

| Paramètre | Valeur | Explication |
|---|---|---|
| `staleTime` | 5 minutes | Données fraîches pendant 5 min (pas de refetch inutile) |
| `gcTime` | 10 minutes | Cache conservé 10 min après démontage |
| `retry` | 2 | Deux tentatives en cas d'erreur réseau |
| Optimistic UI | ✅ | Mise à jour instantanée + rollback si erreur |
