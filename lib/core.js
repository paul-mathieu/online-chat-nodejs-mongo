const sendServiceMessage = (socket, loggedUser, type, broadcast = false) => {
    if (broadcast) {
        if (type == 'login') { // if login
            let broadcastedServiceMessage = {text: 'User "' + loggedUser + '" logged in', type: type}
            socket.broadcast.emit('service-message', broadcastedServiceMessage)
        } else if (type == 'logout') { // if logout
            let serviceMessage = {text: 'User "' + loggedUser + '" is logged out', type: type}
            socket.broadcast.emit('service-message', serviceMessage)
        }
    } else { // if current login
        var userServiceMessage = {text: 'You logged in as "' + loggedUser + '"', type: type}
        socket.emit('service-message', userServiceMessage)
    }
}

const navigator = () => {return navigator.userAgent}

exports.sendServiceMessage = sendServiceMessage
exports.navigator = navigator
