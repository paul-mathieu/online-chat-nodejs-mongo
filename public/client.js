/*global io*/
/*jslint browser: true*/
let socket = io()
let i

let userLogged
let userSelected

/*** Utils ***/

// Scroll vers le bas de page si l'utilisateur n'est pas remonté pour lire d'anciens messages
function scrollToBottom() {
  if ($(window).scrollTop() + $(window).height() + 2 * $('#messages li').last().outerHeight() >= $(document).height()) {
    $('html, body').animate({ scrollTop: $(document).height() }, 0)
  }
}

/*** Events ***/

// Connexion de l'utilisateur
// Uniquement si le username n'est pas vide et n'existe pas encore
$('#login form').submit((e) => {
  e.preventDefault()
  let user = {username: $('#login input').val().trim()}
  // Si le champ de connexion n'est pas vide on inscrit l'utilisateur à la liste si n'est pas inscrit
  if (user.username.length > 0) login(socket, user)
})

// Envoi d'un message
$('#chat form').submit((e) => {
  e.preventDefault()
  let message = {text: $('#m').val(), to: userSelected}
  $('#m').val('')
  // Gestion message vide
  if (message.text.trim().length !== 0 && message.to != null) socket.emit('chat-message', message)
  // Focus sur le champ du message  
  $('#chat input').focus() 
})

// Réception d'un message
socket.on('chat-message', (message) => {
  if (message.from == userSelected || message.to == userSelected) {
    $('#messages').append($('<li class="message">').html('<span class="username">' + message.from + '</span> ' + message.text))
  }
  scrollToBottom()
})

// Réception d'un message de service
socket.on('service-message', (message) => {
  $('#messages').append($('<li class="' + message.type + '">').html('<span class="info">information</span> ' + message.text))
  scrollToBottom()
})

socket.on('load-user', (user) => {
  $('#users').append($('<li id="' + user + '" class="loggedOut">' + user + '</li>'))
  $('#' + user).click(() => {
    if (userLogged != user) {
      userSelected = user
      $(".active").removeClass("active")
      $(this).addClass("active")
      let selector = 'li.message' // enlève les messages présents
      $(selector).remove()
      socket.emit('load-previous-messages', userLogged, userSelected)
    }
  })
})

// Connexion d'un nouvel utilisateur
socket.on('user-is-logged-in', (user) => {
  $('#' + user).removeClass("loggedOut")
  $('#' + user).addClass('new')
  setTimeout(() => $('#users li.new').removeClass('new'), 1000)
});

// Déconnexion d'un utilisateur
socket.on('user-is-logged-out', (user) => $('#' + user).addClass('loggedOut'))
socket.on('remove-current-users-list', () => $('#users li').remove())

const signUpUser = (socket, user, callback) => socket.emit('user-signup', user, callback)

const signInUser = (socket, user) => {
  socket.emit('user-login', user, (success) => {
    if (success) {
      userLogged = user.username
      $('body').removeAttr('id') // Cache formulaire de connexion
      $('#chat input').focus() // Focus sur le champ du message
    }
  })
}

const login = async (socket, user) => {
  const result = await signUpUser(socket, user, (res) => signInUser(socket, user))
}