# Inforemorquage - Cordova avec jQuery Mobile et Backbone.js

### Setup et SVN
Seuls les répertoires suivant ont été inclus dans le SVN : 

  - www/
  - plugins/

Il faut donc créer un nouvau projet avec le CLI de Cordova, et ensuite y copier les dossiers ci-haut. Ne pas ajouter d'ajouter les plateformes voulues (android, ios, etc.). Par la suite, vous allez pouvoir exécuter le projet localement. **Si après ces configurations, l'application ne s'exécute pas sur l'appareil, il faudra réinstaller (rm et add) les différents plugins Cordova utilisés.**

### Git
Le projet est aussi disponible sur github [todo: créer un fork et donner les accès à Martin]

### Configs de Cordova
Le fichier de config de cordova se trouve à la racine du projet : 
> /config.xml


### Configs de Phonegap Build
Le service Phonegap Build a été utilisé pour la compilation. Le fichier de configs du projet se trouve donc dans à cet endroit :  
> www/config.xml.

Rappel : Le service Phonegap Build ne nécessite que le dossier www pour compiler l'application.
