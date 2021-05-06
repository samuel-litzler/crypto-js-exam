# JavaScript Blockchain
> ### Projet par Morgan MERCIER, Vincent LALO, Samuel LITZLER du 3 au 6 mai 2021

## Installation des dépendances
Nous utilisons les librairies (voir [package.json](./package.json)): 
### Librairie pour la création d'une Blockchain js facilement : 
- crypto-js (v4) : https://www.npmjs.com/package/crypto-js

### Faire un serveur web rapidement : 
- express (v4.17.1) : https://www.npmjs.com/package/express

### Intégrer la fonction fetch(): 
- node-fetch (v2.6.1) : https://www.npmjs.com/package/node-fetch

### Faire un serveur web rapidement : 
- socket.io / socket.io-client (v4.0.1) : https://www.npmjs.com/package/socket.io

## Lancement de le BlockChain
Ouvrir deux console dont une où le port doit être 3002

Lancement des serveurs :
> node ./index.js

Pour utiliser les routes, on va aller sur Postman.
Sur Postman il faut bien ajout le body (raw & JSON) : 
``` 
{
    "host" : "localhost", (nom du serveur, ici le local)
    "port" : "3001" (si on fait un appel vers 3002, et inversement)
}
``` 