# Discord Moderation Bot V2

![Version](https://img.shields.io/badge/version-2.0.0-blue)
![Discord.js](https://img.shields.io/badge/discord.js-v14-green)
![Status](https://img.shields.io/badge/status-production_ready-success)

Un bot Discord professionnel, complet, et sans bugs, avec un système anti-raid avancé, des journaux multi-niveaux, et un tableau de bord 100% interactif via des boutons Discord.

## 🚀 Fonctionnalités

- **50 Commandes Essentielles** :
  - **Modération** : ban, kick, mute, unmute, warn, unwarn, timeout, untimeout, clear, lock, unlock, slowmode, freeze, unfreeze, nick
  - **Configuration** : raid, logs-level, whitelist-add, whitelist-remove, whitelist-list, alert-channel, log-channel, derank-delay, prefix, settings, reset-config, status
  - **Information** : user-info, server-info, bot-stats, logs, warnings, bans, mutes, modqueue, help, about
  - **Utilitaires** : ping, uptime, report, suggest, invite, avatar, server-icon, role-info, channel-info, member-count, created-at, joined-at, test
- **🛡️ Système Anti-Raid Complet** :
  - Protection contre les bots (uniquement les bots whitelistés autorisés)
  - Détection avancée par seuils (spams canaux, bans de masse, kicks, spam)
  - Tableau de bord de configuration interactif `/raid`
- **📝 Système de Logs Multi-Niveaux** :
  - **Normal** : #mod-logs, #user-logs, #server-logs
  - **Moyen** : + #message-logs, #channel-logs
  - **Extrême** : + #role-logs, #raid-logs
- **⚙️ Base de Données Persistante** : Structure JSON ultra rapide.
- **🚀 Prêt pour la Production** : Code propre, orienté objet, support PM2.

## 🛠️ Installation

```sh
# Cloner le dépôt
git clone https://github.com/votre-depot/discord-moderation-bot-v2.git
cd discord-moderation-bot-v2

# Installer les dépendances
npm install

# Copier le fichier d'environnement et le configurer
cp .env.example .env

# Démarrer le bot !
npm start
```