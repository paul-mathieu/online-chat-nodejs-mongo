//redis
const redis = require("redis")
const redisClient = redis.createClient()

redisClient.on("error", (error) => console.error(error));

let i

// login and logout infos
const storeUserConnectedToRedis = (loggedUser) => redisClient.sadd("loggedUsers", loggedUser)
const removeUserConnectedFromRedis = (loggedUser) => redisClient.srem("loggedUsers", loggedUser)

const userAlreadyLoggedIn = (username) => {
    redisClient.smembers("loggedUsers", (err, usersConnected) => {
        for (i = 0; i < usersConnected.length; i++) {
            if (usersConnected[i] === username) return true
        }
        return false
    })
}

const loadUserConnectedFromRedisToClient = (socket) => {
    redisClient.smembers("loggedUsers", (err, usersConnected) => {
        for (i = 0; i < usersConnected.length; i++) socket.emit('user-login', usersConnected[i])
    });
}

exports.storeUserConnectedToRedis = storeUserConnectedToRedis;
exports.removeUserConnectedFromRedis = removeUserConnectedFromRedis;
exports.userAlreadyLoggedIn = userAlreadyLoggedIn;
exports.loadUserConnectedFromRedisToClient = loadUserConnectedFromRedisToClient;