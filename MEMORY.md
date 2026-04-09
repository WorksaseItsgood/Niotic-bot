# Memory & Architecture

## Architecture Globale

Le bot est structuré avec un chargeur de commandes et d'événements automatique dans `src/bot.js`.
Il fonctionne avec `discord.js v14` et utilise les `SlashCommands` ainsi que des boutons pour l'interface de modération / configureur.

- `src/bot.js` : Point d'entrée, gestion des collections Discord.js, gestionnaire d'événements et de commandes.
- `src/config.js` : Gestion des interactions avec la base de données JSON (`src/database.json`). Gère la persistance de l'Anti-Raid, Logs et Whitelist.
- `src/utils/` : (Si nécessaire) pour les fonctions complexes (logger, dashboard).

## 50 Commandes

### Modération (15)
- /ban, /kick, /mute, /unmute, /warn, /unwarn, /timeout, /untimeout, /clear, /lock, /unlock, /slowmode, /freeze, /unfreeze, /nick

### Configuration (12)
- /raid : Affiche le dashboard anti-raid via des boutons (Status anti-raid, Seuils, Paramètres).
- /logs-level : Sélection intuitive du niveau (Normal, Moyen, Extrême) via Menu / Boutons.
- /whitelist-add, /whitelist-remove, /whitelist-list : Ajoute/retire/consulte les IDs des membres protégés.
- /alert-channel, /log-channel, /derank-delay, /prefix, /settings, /reset-config, /status

### Info (10)
- /user-info, /server-info, /bot-stats, /logs, /warnings, /bans, /mutes, /modqueue, /help, /about

### Utility (13)
- /ping, /uptime, /report, /suggest, /invite, /avatar, /server-icon, /role-info, /channel-info, /member-count, /created-at, /joined-at, /test

## Base de données JSON
Structure recommandée :
```json
{
  "guildId": {
    "prefix": "!",
    "logsLevel": "normal",
    "antiRaid": {
      "enabled": true,
      "channels": 5,
      "bans": 3,
      "kicks": 3,
      "spam": 10
    },
    "whitelist": ["userid"],
    "channels": {
      "mod-logs": "id",
      "user-logs": "id",
      "server-logs": "id"
    }
  }
}
```
