/*global io*/
/*jslint browser: true*/
let socket = io()
let i

let userLogged
let userSelected

/*** Utils ***/

// Scroll down the page if the user has not moved up to read old messages
function scrollToBottom() {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $('html, body').animate({scrollTop: $(document).height()}, 0)
  }
}

/*** Events ***/

// User connection
// Only if the username is not empty and does not yet exist
$('#login form').submit((e) => {
  e.preventDefault()
  let user = {username: $('#login input').val().trim()}
  // If the connection field is not empty, we register the user in the list if it is not registered
  if (user.username.length > 0) {
    login(socket, user)
    socket.emit('info-connection', {
      username: user.username,
      navigator: navigator.userAgent,
      dateClient: new Date().toUTCString(),
      ip: getCleanIP()
    })
  }
})

// Sending a message
$('#chat form').submit((e) => {
  e.preventDefault()
  let message = {
    text: $('#m').val(), 
    to: userSelected, 
    dateClient: new Date().toISOString()
  }
  $('#m').val('')
  // Empty message management
  if (message.text.trim().length !== 0 && message.to != null) socket.emit('chat-message', message)
  $('#chat input').focus() // Focus on the message field 
})

// Receiving a message
socket.on('chat-message', (message) => {
  if (message.from == userSelected || message.to == userSelected) {
    $('#messages').append(
      $('<li class="message">').html('<span class="username">' + message.from + '</span> ' + message.text)
    )
  }
  scrollToBottom()
})

// Receiving a service message
socket.on('service-message', (message) => {
  $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text))
  scrollToBottom()
})

socket.on('load-user', (user) => {
  // users
  if (userLogged != user) $('#users').append($('<li id="' + user + '" class="loggedOut" title="Click here to see your conversation with ' + user + '">' + user + '</li>'))
  else $('#users').append($('<li id="' + user + '" class="actual loggedOut" title="Do you really want to talk to yourself?">' + user + '</li>'))
  // load
  $('#' + user).click(() => {
    if (userLogged != user) {
      userSelected = user
      $(".active").removeClass("active")
      // $(this).addClass("active")
      $("#" + userSelected).addClass("active")
      $('li.message').remove() // remove existing messages
      socket.emit('load-previous-messages', userLogged, userSelected)
    }
  })
})

// New user login
socket.on('user-is-logged-in', (user) => {
  $('#' + user).removeClass("loggedOut")
  setTimeout(() => $('#users li.new').removeClass('new'), 1000)
});

// Logging out of a user
socket.on('user-is-logged-out', (user) => $('#' + user).addClass('loggedOut'))
socket.on('remove-current-users-list', () => $('#users li').remove())

const signUpUser = (socket, user, callback) => socket.emit('user-signup', user, callback)

const signInUser = (socket, user) => {
  socket.emit('user-login', user, (success) => {
    if (success) {
      userLogged = user.username
      $('body').removeAttr('id') // Cache formulaire de connexion
      $('#login').remove()
      $('#chat input').focus() // Focus sur le champ du message
    }
  })
}

const login = async (socket, user) => await signUpUser(socket, user, (res) => signInUser(socket, user))

const getIP = () => {
  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest()
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  xmlhttp.open("GET", " https://www.cloudflare.com/cdn-cgi/trace ", false)
  xmlhttp.send();
  let ip = xmlhttp.responseText
  ip = ip.substr(ip.indexOf("ip="))
  ip = ip.substr(3, ip.indexOf("\n") - 3)

  if (window.XMLHttpRequest) xmlhttp = new XMLHttpRequest()
  else xmlhttp = new ActiveXObject("Microsoft.XMLHTTP")
  xmlhttp.open("GET", " https://json.geoiplookup.io/" + ip, false)
  xmlhttp.send();

  return JSON.parse(xmlhttp.responseText)
 
}

const getCleanIP = () => {
  rawIP = getIP()
  cleanIP = {}
  cleanIP.asn = rawIP.asn
  cleanIP.asn_org = rawIP.asn_org
  cleanIP.connection_type = rawIP.connection_type
  cleanIP.postal_code = rawIP.postal_code
  cleanIP.city = rawIP.city
  cleanIP.district = rawIP.district
  cleanIP.country_name = rawIP.country_name
  cleanIP.ip = rawIP.ip
  cleanIP.latitude = rawIP.latitude
  cleanIP.longitude = rawIP.longitude
  cleanIP.timezone_name = rawIP.timezone_name
  return cleanIP
}