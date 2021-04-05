// Set up mongo
let MongoClient = require('mongodb').MongoClient
const url = "mongodb://localhost:27020,localhost:27021,localhost:27022/?replicaSet=rs0"
let db
const dbName = "chat_server"

// Add colours on the console
require('colors')

MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) throw err
    console.log("Connected successfully to server".bold.blue)
    db = client.db(dbName)
});

const storeMsgToMongo = (message) => {
    db.collection("messages").insertOne(message, (err, res) => {
        if (err) throw err
        console.log("document inserted".cyan)
    });
};

const loadMsgFromMongo = (user1, user2, socket) => {
    // vérifier l'ordre des messages (peut être envisagé de mettre une date)
    db.collection("messages")
            .find({ $or: [{ from: user1, to: user2 }, { from: user2, to: user1 }] })
            .toArray((err, messages) => {
        if (err) throw err
        for (message in messages) socket.emit('chat-message', messages[message])
    })
}

const loadUsersFromMongoToClient = (socket) => {
    socket.emit('remove-current-users-list')
    db.collection("users").find().toArray((err, users) => {
        if (err) throw err
        for (user in users) socket.emit('load-user', users[user].username)
    });
}

const insertNewUserToMongo = (user, callback) => {
    db.collection("users").findOne(user, (err, existing_user) => {
        if (err) throw err
        if (!existing_user) {
            db.collection("users").insertOne(user, (err, res) => {
                if (err) throw err
                console.log("1 document inserted".cyan)
                callback(true)
            })
        } else callback(false)
    })
}

const isUserRegistered = (user, callback) => {
    db.collection("users")
            .find({ username: user.username })
            .toArray((err, users) => {
        if (err) throw err
        callback(users.length > 0)
    })
}

exports.storeMsgToMongo = storeMsgToMongo;
exports.loadMsgFromMongo = loadMsgFromMongo;
exports.loadUsersFromMongoToClient = loadUsersFromMongoToClient;
exports.insertNewUserToMongo = insertNewUserToMongo;
exports.isUserRegistered = isUserRegistered;
