/*
simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Andrew Warkentin 2015. All rights reserved.

To do:
-move the notifications up when the one above is removed.
-add a close button to close notifications
-Add support for non auto-dismissing notifications
*/

// Some important variables
var NOTIFICATION_CLASS_NAME = "simple-notification";
var MARGIN_BETWEEEN_NOTIFICATIONS = 5; //px

var notifications = [];
var notificationCount = 0;

function simpleNotify(message, timeout, level) {
  notificationCount++;
  var notificationId = 'notification' + notificationCount;
  var newNotification = {"id": notificationId, "message": message, "timeout": timeout, "level": level };
  notifications.unshift(newNotification);

  // Show the notification on the page
  displayNewNotification(newNotification)
}

function displayNewNotification(newNotification) {
  var notificationsOnPage = Array.prototype.slice.call(document.getElementsByClassName(NOTIFICATION_CLASS_NAME));
  showNotificationAtTopOfPage(newNotification);
  moveDownExisitingNotifications(notificationsOnPage, document.getElementById(newNotification.id).offsetHeight)

  // Start a timeout for the notification just displayed
  setTimeout(function(){ removeNotification(newNotification.id) }, newNotification.timeout * 1000);
}

function removeNotification(notificationId) {
  // Remove the notification from the array
  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].id === notificationId) {
      notifications.splice(i, 1);
      break;
    }
  }

  // Do a outro transition
  var notificationToRemove = document.getElementById(notificationId)
  notificationToRemove.className = notificationToRemove.className + " fade-out";
  // Remove the notification from the DOM
  notificationToRemove.addEventListener("transitionend",function(){
    removeFromDOM(notificationToRemove);
  },false);
  
  // Move the rest of the notifications to fill in the missing space.
  // Something with the index....
  // // Re-draw the rest of the notifications
}

function showNotificationAtTopOfPage(notification) {
  var div = document.createElement("div");
  div.className = NOTIFICATION_CLASS_NAME + " " + notification.level;
  div.id = notification.id;
  div.style.width = "100px";
  div.style.background = "red";
  div.style.color = "white";
  div.style.position = "fixed";
  div.style.top = "5px";
  div.style.right = "-200px"; // Position it to the right so that it starts off the page, and slides in from the CSS animation.
  div.innerHTML = notification.message;
  // Add it to the DOM
  document.body.appendChild(div);
}

function moveDownExisitingNotifications(notificationsOnPage, height) {
  // If there are other notifications on the page, bump them all down.
  if(notificationsOnPage && notificationsOnPage.length >= 1) {
    for(var i = 0; i < notificationsOnPage.length; i++) {
      var currentNotification = document.getElementById(notificationsOnPage[i].id);
      var currentHeight = currentNotification.offsetTop;
      currentNotification.style.top = currentHeight + height + MARGIN_BETWEEEN_NOTIFICATIONS + "px";
    }
  }
}

function removeFromDOM(notificationToRemove) {
  notificationToRemove.parentNode.removeChild(notificationToRemove);
}
