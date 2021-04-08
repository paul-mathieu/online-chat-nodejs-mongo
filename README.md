# online-chat-nodejs-mongo

Based on https://github.com/BenjaminBini/socket.io-chat

## Technologies
* NodeJS (server)
* MongoDB (messages, connections and users)
* Redis (connected users)
* Socket.io (instant messaging)

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

You can run python file to view stats (yout need to start mongo server first)

```
python stats.py
```

## Caution 

![](data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgd2lkdGg9IjMwcHgiIGhlaWdodD0iMzBweCIgZW5hYmxlLWJhY2tncm91bmQ9Im5ldyAwIDAgMTAwIDEwMCIgZmlsbD0iIzAwMDAwMCIgdmVyc2lvbj0iMS4xIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtOTguNjkyIDgwLjM1MS00MC4yMDctNzEuNTU4Yy0xLjczLTMuMDc3LTQuOTg0LTQuOTgxLTguNTE1LTQuOTgxLTMuNTI3IDAtNi43ODMgMS45MDQtOC41MTIgNC45ODFsLTQwLjIwNiA3MS41NThjLTEuNjk4IDMuMDI0LTEuNjY5IDYuNzIxIDAuMDg1IDkuNzE3IDEuNzUxIDIuOTkyIDQuOTU4IDQuODMxIDguNDI4IDQuODMxaDgwLjQxM2MzLjQ2OCAwIDYuNjc0LTEuODM5IDguNDI2LTQuODMxIDAuODkzLTEuNTI1IDEuMzM3LTMuMjI4IDEuMzM3LTQuOTMzIDAtMS42NTEtMC40MTctMy4yOTgtMS4yNDktNC43ODR6bS01NC42NDctMjEuMTI5di0yNS44MzVjMC4wODUtNC4wMDggMi4zODgtNi42NTIgNS45Ny02LjY1MiAzLjU4IDAgNS45NjggMi43MjkgNS45NjggNi42NTJ2MjcuMTE2Yy0wLjA4NSA0LjA5Mi0yLjM4OCA2LjY0OS01Ljk2OCA2LjY0OS0zLjU4MiAwLTUuOTctMi42NDMtNS45Ny02LjY0OXYtMS4yODF6bTUuOTY1IDI1LjUyMmMtMy43NzUgMC02Ljg0NC0zLjA2OC02Ljg0NC02Ljg0NXMzLjA2OC02Ljc2NSA2Ljg0NC02Ljc2NSA2Ljc2NCAyLjk4OCA2Ljc2NCA2Ljc2NS0yLjk4OCA2Ljg0NS02Ljc2NCA2Ljg0NXoiLz48L3N2Zz4NCg==)

This app isn't GPRD compatible !

The IP and the system parameters are logged in mongodb
