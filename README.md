# online-chat-nodejs-mongo

Based on https://github.com/BenjaminBini/socket.io-chat

## Technologies
* NodeJS (for the server)
* MongoDB (to store the messages)
* Redis (to store the connected users)
* Socket.io (for the real time messaging)

## Install the packages
```
npm install
```

## To run the app

#### Start mongodb using replicaSets
```
mongod --replSet rs0 --port 27020 --dbpath ./data/r0s1
```
```
mongod --replSet rs0 --port 27021 --dbpath ./data/r0s2
```
```
mongod --replSet rs0 --port 27022 --dbpath ./data/r0s3
```

#### Start the arbiter
```
mongod --port 30000 --dbpath ./data/arb --replSet rs0
```

#### Defind roles of mongod servers
```
mongo --port 27020
```
Then (in the mongo shell)
```
rs.initiate()
rs.conf()
rs.add("localhost:27021")
rs.add("localhost:27022")
rs.addArb("localhost:30000")
```

#### Start redis server

Open redis-server.exe on your redis folder

#### Start the nodejs server
```
nodemon server.js
```
or (if you don't have nodemon)
```
node server.js
```

## Use the app

Open some tabs on localhost:3000 and enjoy the chat !

## Extra : data queries

##### TODO

## Caution

![] (data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk4LjY5Miw4MC4zNTFMNTguNDg1LDguNzkzYy0xLjczLTMuMDc3LTQuOTg0LTQuOTgxLTguNTE1LTQuOTgxYy0zLjUyNywwLTYuNzgzLDEuOTA0LTguNTEyLDQuOTgxTDEuMjUyLDgwLjM1MSAgYy0xLjY5OCwzLjAyNC0xLjY2OSw2LjcyMSwwLjA4NSw5LjcxN2MxLjc1MSwyLjk5Miw0Ljk1OCw0LjgzMSw4LjQyOCw0LjgzMWg4MC40MTNjMy40NjgsMCw2LjY3NC0xLjgzOSw4LjQyNi00LjgzMSAgYzAuODkzLTEuNTI1LDEuMzM3LTMuMjI4LDEuMzM3LTQuOTMzQzk5Ljk0MSw4My40ODQsOTkuNTI0LDgxLjgzNyw5OC42OTIsODAuMzUxeiBNNDQuMDQ1LDU5LjIyMlYzNC43NXYtMS4zNjMgIGMwLjA4NS00LjAwOCwyLjM4OC02LjY1Miw1Ljk3LTYuNjUyYzMuNTgsMCw1Ljk2OCwyLjcyOSw1Ljk2OCw2LjY1MnYxLjM2M3YyNC40NzJ2MS4yODFjLTAuMDg1LDQuMDkyLTIuMzg4LDYuNjQ5LTUuOTY4LDYuNjQ5ICBjLTMuNTgyLDAtNS45Ny0yLjY0My01Ljk3LTYuNjQ5VjU5LjIyMnogTTUwLjAxLDg0Ljc0NGMtMy43NzUsMC02Ljg0NC0zLjA2OC02Ljg0NC02Ljg0NXMzLjA2OC02Ljc2NSw2Ljg0NC02Ljc2NSAgYzMuNzc2LDAsNi43NjQsMi45ODgsNi43NjQsNi43NjVTNTMuNzg2LDg0Ljc0NCw1MC4wMSw4NC43NDR6Ij48L3BhdGg+PC9zdmc+) 

This app isn't GPRD compatible !

The IP and the system parameters are logged in mongodb

![] (data:image/svg+xml;base64,PHN2ZyBoZWlnaHQ9JzMwMHB4JyB3aWR0aD0nMzAwcHgnICBmaWxsPSIjMDAwMDAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+PHBhdGggZD0iTTk4LjY5Miw4MC4zNTFMNTguNDg1LDguNzkzYy0xLjczLTMuMDc3LTQuOTg0LTQuOTgxLTguNTE1LTQuOTgxYy0zLjUyNywwLTYuNzgzLDEuOTA0LTguNTEyLDQuOTgxTDEuMjUyLDgwLjM1MSAgYy0xLjY5OCwzLjAyNC0xLjY2OSw2LjcyMSwwLjA4NSw5LjcxN2MxLjc1MSwyLjk5Miw0Ljk1OCw0LjgzMSw4LjQyOCw0LjgzMWg4MC40MTNjMy40NjgsMCw2LjY3NC0xLjgzOSw4LjQyNi00LjgzMSAgYzAuODkzLTEuNTI1LDEuMzM3LTMuMjI4LDEuMzM3LTQuOTMzQzk5Ljk0MSw4My40ODQsOTkuNTI0LDgxLjgzNyw5OC42OTIsODAuMzUxeiBNNDQuMDQ1LDU5LjIyMlYzNC43NXYtMS4zNjMgIGMwLjA4NS00LjAwOCwyLjM4OC02LjY1Miw1Ljk3LTYuNjUyYzMuNTgsMCw1Ljk2OCwyLjcyOSw1Ljk2OCw2LjY1MnYxLjM2M3YyNC40NzJ2MS4yODFjLTAuMDg1LDQuMDkyLTIuMzg4LDYuNjQ5LTUuOTY4LDYuNjQ5ICBjLTMuNTgyLDAtNS45Ny0yLjY0My01Ljk3LTYuNjQ5VjU5LjIyMnogTTUwLjAxLDg0Ljc0NGMtMy43NzUsMC02Ljg0NC0zLjA2OC02Ljg0NC02Ljg0NXMzLjA2OC02Ljc2NSw2Ljg0NC02Ljc2NSAgYzMuNzc2LDAsNi43NjQsMi45ODgsNi43NjQsNi43NjVTNTMuNzg2LDg0Ljc0NCw1MC4wMSw4NC43NDR6Ij48L3BhdGg+PC9zdmc+)
