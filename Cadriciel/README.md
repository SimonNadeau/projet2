# Log2990
Projet généré avec [Angular CLI](https://github.com/angular/angular-cli) version 1.3.2.

## Développement du client
Pour lancer le client, il suffit d'exécuter: `ng serve`. Vous pouvez ensuite naviger à `http://localhost:4200/`. L'application va se relancer automatiquement si vous modifier le code source de celle-ci.

## Génération de composants
Pour créer de nouveaux composants, nous vous recommandons l'utilisation d'angular CLI. Il suffit d'exécuter `ng generate component component-name` pour créer un nouveau composant. 

Il est aussi possible de générer des directives, pipes, services, guards, interfaces, enums, muodules, classes, avec cette commande `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Exécution des tests unitaires
Exécuter `ng test` pour lancer les tests unitaires avec [Karma](https://karma-runner.github.io) sur le client.

Exécuter `ng test --watch=false --code-coverage` pour générer un rapport de code coverage avec [Karma](https://karma-runner.github.io) sur le client.

Exécuter `npm test` pour lancer les tests unitaires avec [Mocha](https://mochajs.org/) sur le serveur.

## Exécution de TSLint
Exécuter `npm run lint` pour lancer TSLint.

## Aide supplémentaire
Pour obtenir de l'aide supplémentaire sur Angular CLI, utilisez `ng help` ou [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

Pour des questions reliées à la correction de la qualité, demandez à Dylan(dylan.farvaque@polymtl.ca) et Mathieu(mathieu-4.tremblay@polymtl.ca).

Pour des questions reliées à la correction des fonctionnalités, demandez à Nikolay(nikolay.radoev@polymtl.ca) et Emilio(emilio.rivera@polymtl.ca).

## Lectures suggérées
[AntiPatterns](https://sourcemaking.com/antipatterns) (plus spécifiquement [Software Development AntiPatterns](https://sourcemaking.com/antipatterns/software-development-antipatterns))

# Touches à utiliser

Cette liste de touches sert à standardiser les jeux et ainsi faciliter la correction. Un non respect de la touche sera considéré comme une fonctionnalité non livrée au client (note de 0).

|    Fonctionnalité    	| Touche 	|
|:--------------------:	|:------:	|
|        Avancer       	|    W   	|
|        Arrêter       	|    S   	|
|        Gauche        	|    A   	|
|        Droite        	|    D   	|
|       Lumières       	|    L   	|
|       Mode nuit      	|    N   	|
|      Zoom avant      	|    +   	|
|     Zoom arrière     	|    -   	|
| Changement de caméra 	|    C   	|

# Cadriciel

Nous vous avons fourni plusieurs pièces de code.

## Course

Tout d'abord, le déplacement d'un véhicule pour le jeu de course. Puisque vous devez éviter la duplication de code, vous aurez probablement à modifier ce code, en partie ou en totalité. Nous vous recommandons cependant de ne pas modifier les constantes du véhicule puisque celles-ci ont étés testées et donnent un contrôle relativement réaliste au véhicule.

La fonction qui calcule le couple (torque) du moteur est une fonction qui a été obtenue à partir des points du moteur réel. La masse, la taille des roues, le poids de celles-ci sont des valeurs obtenues des spécifications d'une Chevrolet Camaro et représentent autant que possible la réalité.

Les formules suivantes sont utilisés pour déterminer les données du véhicule à chaque intervalle:
- Accélération: a = F/m.
- Vitesse: vf = vi + a*dt. 
- Position: pf = pi + v*dt. 

Afin de simplifier les calculs physiques, nous avons assumé que le poids du véhicule est toujours réparti au centre de celui-ci sur le plan gauche-droite. De plus, il s'agit d'un véhicule à propulsion, donc seulement les roues arrières font avancer le véhicule.

L'accélération se fait toujours au maximum possible, qui est déterminé par le coefficient de friction des pneus, la masse du véhicule et la répartition du poids. Nous utilisons toujours la valeur maximale entre ceci et la force générée par le moteur afin de simuler un système d'anti-patinage. Ceci nous permet de ne pas gérer le dérapage du véhicule.

Nous avons aussi ajouté une transmission automatique, qui change les vitesses du véhicules automatiquement.

La majorité des formules ont étés obtenues à partir de [Engineering Toolbox](https://www.engineeringtoolbox.com) et de [Car physics for games](http://www.asawicki.info/Mirror/Car%20Physics%20for%20Games/Car%20Physics%20for%20Games.html)

## Général

Un service de base effectuant une requête http vers le serveur vous est fourni.
