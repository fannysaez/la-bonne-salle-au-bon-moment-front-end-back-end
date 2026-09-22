# La Bonne Salle au Bon Moment — Front-end

Interface utilisateur de l'application de réservation de salles.  
Construite avec **React · TypeScript · Vite · TailwindCSS**

---

## Stack technique

| Technologie | Rôle |
|---|---|
| **React 19** | Bibliothèque UI |
| **TypeScript** | Typage statique |
| **Vite** | Bundler et serveur de développement |
| **TailwindCSS** | Styles utilitaires |
| **React Router** | Navigation entre les pages |

---

## Installation

```bash
git clone https://github.com/fannysaez/la-bonne-salle-au-bon-moment-front-end.git
cd la-bonne-salle-au-bon-moment-front-end
npm install
```

---

## Lancement

```bash
npm run dev
```

Front-end sur `http://localhost:5173`

> ⚠️ Le back-end doit tourner sur `http://localhost:3000` pour que l'API fonctionne.

---

## Connexion avec le back-end

Le front-end communique avec l'API REST via des requêtes HTTP.  
Il ne se connecte **jamais directement à MongoDB**.

```
React (localhost:5173)
        │
        │  fetch('/api/rooms')
        ▼
Express (localhost:3000)
        │
        │  Mongoose
        ▼
MongoDB
```

---

## Pages

| Page | Route | Description |
|---|---|---|
| Login | `/login` | Connexion utilisateur |
| Dashboard | `/dashboard` | Tableau de bord |
| Salles | `/rooms` | Liste des salles |
| Réservations | `/reservations` | Liste des réservations |
| Utilisateurs | `/users` | Gestion des utilisateurs |

---

## Prochaines étapes

- [ ] Authentification JWT (bcrypt + login)
- [ ] Connexion réelle des pages avec l'API back-end
- [ ] Protection des routes (ProtectedRoute)

---

*Mise à jour le 22 Septembre 2026*