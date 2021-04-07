// connection with socket
const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)

// Add colours on the console
require('colors')

const core = require('./lib/core.js')
const redisQuery = require('./lib/redis.js')
const mongoQuery = require('./lib/mongo.js')
const mongoRedisQuery = require('./lib/mongo-redis.js')

// Management of users' HTTP requests by returning files from the 'public' folder
app.use('/', express.static(__dirname + '/public'))


io.on('connection', (socket) => {

  // User connected
  let loggedUser

  // User registration in mongo
  socket.on('user-signup', (user, callback) => mongoQuery.insertNewUserToMongo(user, (res) => callback(res)))

  // Connection of a user via the form:
  socket.on('user-login', (user, callback) => {
    mongoQuery.isUserRegistered(user, (userRegistered) => {
      // Checking that the user is not already logged in
      if (user.username !== undefined && !redisQuery.userAlreadyLoggedIn(user.username) && userRegistered) { // S'il est bien nouveau
        // Save the user and add to the connected list
        loggedUser = user.username
        // Saving the logged in user in redis
        redisQuery.storeUserConnectedToRedis(loggedUser)
        mongoRedisQuery.refreshUsersList(io)
        // mongoQuery.addConnection()
        socket.join(loggedUser)
        // Sending service messages
        core.sendServiceMessage(socket, loggedUser, 'login') // to socket
        core.sendServiceMessage(socket, loggedUser, 'login', broadcast = true) // to others
        // Issue of 'user-login' and callback call
        io.emit('user-login', loggedUser)
        console.log(('User ' + loggedUser + ' connected').magenta)
        // callback
        callback(true)
      } else callback(false)
    })
  })

  // Reception d'un log de connection
  socket.on('info-connection', (infoConnection) => mongoQuery.addInfoConnection(infoConnection))

  // Logging out of a user
  socket.on('disconnect', () => {
    if (loggedUser !== undefined) {
      // Broadcast of a 'service-message'
      core.sendServiceMessage(socket, loggedUser, 'logout', broadcast = true)
      // Removing the user from Redis
      redisQuery.removeUserConnectedFromRedis(loggedUser)
      // Issue of a 'user-logout' containing the user
      io.emit('user-is-logged-out', loggedUser)
      // Log info
      console.log(('User ' + loggedUser + ' disconnected').magenta)
    }
  })

  // Reception of the 'chat-message' event and re-transmission to all users
  socket.on('chat-message', (message) => {
    // Add the username to the message and we send the event
    message.from = loggedUser
    message.dateServer = new Date().toISOString()
    mongoQuery.storeMsgToMongo(message)
    io.to(message.to).to(message.from).emit('chat-message', message)
  })

  // load previous messages of user
  socket.on('load-previous-messages', (userTo, userFrom) => mongoQuery.loadMsgFromMongo(userTo, userFrom, socket))
})

// Starting the server by listening for connections arriving on port 3000
http.listen(3000, () => console.log('Server is listening on *:3000'.bold.green))
