# Note Technique – EcoAction
## Application Mobile de Bénévolat Environnemental

**Technologies** : React Native + Expo SDK 54 · TypeScript · TanStack Query v5 · Expo Router v4 · NativeWind v4 · JSON-Server

---

## 1. Architecture & Justification

### Architecture en couches (Layered Architecture)

```
┌─────────────────────────────────┐
│   Presentation  (app/)          │  Expo Router screens + Composants UI
├─────────────────────────────────┤
│   Application   (src/hooks/)    │  TanStack Query · useQuery · useMutation
├─────────────────────────────────┤
│   Domaine       (src/types/)    │  Interfaces TypeScript (Mission, User, Participation...)
├─────────────────────────────────┤
│   Infrastructure (src/api/)     │  Axios client · API calls
└─────────────────────────────────┘
```

**Expo Router** a été choisi pour sa navigation **file-based** (similaire à Next.js), qui simplifie la structure des routes et offre le deep linking automatique. La navigation est organisée en deux groupes : `(auth)` (login/register) et `(tabs)` (explore/my-missions/profile), avec un garde d'authentification dans chaque layout.

**NativeWind** permet d'utiliser la syntaxe Tailwind CSS directement dans React Native, assurant une cohérence visuelle et une rapidité de développement. La palette de couleurs personnalisée (vert forêt `#2D6A4F`, menthe `#52B788`) est centralisée dans `tailwind.config.js`.

**SecureStore** (Expo) assure la persistance du token et des données utilisateur entre les sessions de manière sécurisée (chiffré sur le device), sans exposer les données dans AsyncStorage non chiffré.

---

## 2. Typage TypeScript Strict

Le projet est configuré avec `"strict": true` et `"noImplicitAny": true`. Aucun type `any` n'est utilisé dans le code source.

**Interfaces principales** :

```ts
interface Mission {
  id: string;
  category: 'beach' | 'forest' | 'waste' | 'education'; // union type, pas d'any
  spotsLeft: number;
  requirements: string[];  // tableau typé
  // ... 20 champs typés strictement
}

interface Participation {
  status: 'confirmed' | 'cancelled'; // littéral union au lieu de string libre
}
```

**Gestion des types complexes** :
- Les mutations `useMutation` sont paramétrées avec 4 génériques : `<TData, TError, TVariables, TContext>` permettant un type safe complet du contexte de rollback optimiste.
- Les erreurs API sont typées via l'interface `ApiError { message, status, code }` et interceptées dans le client Axios.
- Les paramètres de route Expo Router sont typés avec `useLocalSearchParams<{ id: string }>()`.

---

## 3. Stratégie de Mise en Cache – TanStack Query

### Configuration globale (QueryClient)

| Paramètre | Valeur | Justification |
|---|---|---|
| `staleTime` | **5 minutes** | Les missions ne changent pas toutes les secondes. Évite des requêtes réseau inutiles sur chaque navigation entre écrans. |
| `gcTime` | **10 minutes** | Le cache subsiste 10 min après démontage, permettant un retour rapide sans rechargement. |
| `retry` | **2** | Deux tentatives automatiques sur erreur réseau (instabilité réseau réelle). |
| `refetchOnWindowFocus` | **false** | Évite les refetch non nécessaires à chaque activation de l'app. |

### Optimistic UI – Inscription aux Missions

L'Optimistic UI est l'un des points forts de l'architecture :

```
User tape "S'inscrire"
    ↓
onMutate : Annulation des requêtes en cours + snapshot du cache
    ↓
Mise à jour IMMÉDIATE du cache local (spotsLeft - 1) → UI réagit instantanément
    ↓  
Requête HTTP envoyée en arrière-plan
    ↓
  ✅ Succès → invalidateQueries → re-fetch propre depuis serveur
  ❌ Erreur → rollback vers les données sauvegardées (snapshot)
```

**Deux caches distincts** sont gérés simultanément lors d'une inscription :
1. `['missions']` : décrémente `spotsLeft` de la mission concernée
2. `['participations', userId]` : ajoute une participation optimiste temporaire

Ce pattern garantit une expérience **fluide même sur réseau instable**, en restant cohérent avec la réalité serveur grâce au rollback automatique.

---

*EcoAction v1.0 – Mini-projet React Native · ISET 2026*
