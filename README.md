# Multiplayer chess game and AI

## [Multiplayer](https://github.com/nathsten/chess-multiplayer-and-ai/public/multiplayer):
* Using Socket.io with postgreSQL DB to create a real time multiplayer chess game.

* Each game is store with a gamepin, and can be accessed as long as role cookie is set.

## [Local game](https://github.com/nathsten/chess-multiplayer-and-ai/public/local)
* Play locally on you computer, 1v1.

## [AI](https://github.com/nathsten/chess-multiplayer-and-ai/public/AI)
* Attempt to create an AI using tensorflow.js to play the chess game against you.

## Gameplay
* A single string like this: "br,18/bk,28/bb,38/bQ,48/bK,58/bb,68/bk,78/br,88/bp,17/bp,27/bp,37/bp,47/bp,57/bp,67/bp,77/bp,87/wr,11/wk,21/wb,31/wQ,41/wK,51/wb,61/wk,71/wr,81/wp,12/wp,22/wp,32/wp,42/wp,52/wp,62/wp,72/wp,82" will result in a chess board like this:



* Each part of the string (separated by "/") represents color, type of brick, position x and position y. br,18 = black roock x = 1, y = 8.
