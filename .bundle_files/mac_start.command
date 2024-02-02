#!/bin/bash

# Aller dans le dossier du fichier actuel
cd "$(dirname "$0")"
cd caddy

# Fonction pour arrêter le serveur proprement
stop_server() {
    echo "Arrêt du serveur Caddy..."
    ./caddy_darwin_amd64 stop
    exit 0
}

# Intercepter les signaux de fermeture (ex: fermeture de fenêtre) pour arrêter le serveur
trap 'stop_server' 0 3 6 15

# Lancer le serveur 
./caddy_darwin_amd64 run