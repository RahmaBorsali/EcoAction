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

Le projet est configuré avec `"strict": true`. Aucun type `any` n'est toléré.

**Gestion des types complexes** :
- **Utilisation d'Omit** : Pour la création de missions, nous utilisons `Omit<Mission, 'id' | 'createdAt'>` pour garantir que les données envoyées correspondent au modèle attendu sans les champs générés par le serveur.
- **Select Option** : Utilisation du générique `select` dans TanStack Query pour transformer/filtrer les données avant qu'elles n'atteignent le composant, assurant un typage strict même après filtrage.
- **Interférences de types** : Les types sont centralisés dans `src/types/index.ts` et réutilisés de l'API jusqu'à la présentation.

---

## 3. Stratégie de Mise en Cache & Performance

### Filtrage Côté Client (Client-Side Filtering)
Pour résoudre les problèmes de latence et de perte de focus du clavier (focus loss), une stratégie de filtrage local a été adoptée :
1. **Fetch Global** : `useMissions` récupère toutes les missions et les stocke dans le cache TanStack (`queryKey: ['missions']`).
2. **Filtrage via `select`** : La recherche et le filtrage par catégorie sont effectués localement via la fonction `select`.
3. **Avantage** : Recherche instantanée, pas de chargement réseau pendant la saisie (clavier reste ouvert), et expérience utilisateur fluide.

### Optimistic UI – Inscription aux Missions
L'Optimistic UI est implémenté pour l'enrôlement :
```
onMutate -> Snapshot du cache -> Update immédiat -> HTTP Request -> (Success: Invalidate | Error: Rollback)
```

### Invalidation de Cache – Création de Mission
Lors de la création d'une nouvelle mission (`useCreateMission`), nous utilisons `queryClient.invalidateQueries({ queryKey: ['missions'] })`. Cela force l'application à rafraîchir la liste globale en arrière-plan, garantissant que la nouvelle mission s'affiche dès le retour à l'écran d'accueil sans intervention manuelle de l'utilisateur.

---

*EcoAction v1.0 – Mini-projet React Native · ISET 2026*
