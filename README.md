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
