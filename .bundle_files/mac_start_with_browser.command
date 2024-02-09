#!/bin/bash

# Aller dans le dossier du fichier actuel
cd "$(dirname "$0")"

sh ./mac_start.command & ../browsers/chrome-mac/Chromium.app/Contents/MacOS/Chromium --args --autoplay-policy=no-user-gesture-required --disable-pinch --kiosk --incognito --noerrdialogs --disable-features=TranslateUI,Translate,InterestFeedContentSuggestions --no-first-run --overscroll-history-navigation=0 --ash-no-nudges --hide-scrollbars --disable-infobars --disable-translate --kiosk http://localhost:3000