/*
simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Andrew Warkentin 2015. All rights reserved.

To do:
-add a close button to close notifications
-Add support for non auto-dismissing notifications
-Style the notifications
-Time notifications comeing in so that they come in not all at once. Everything works good if the functions are called a second apart.

Known bugs:
-When called really fast in succession, the notifcations will show on top of each other.
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
  // Get the current notifications on the page
  var notificationsOnPage = Array.prototype.slice.call(document.getElementsByClassName(NOTIFICATION_CLASS_NAME));
  // Show the new notifiaction
  showNotificationAtTopOfPage(newNotification);
  // Move down the other notifications
  moveDownExisitingNotifications(notificationsOnPage, document.getElementById(newNotification.id).offsetHeight);
  // Start a timeout for the notification just displayed
  setTimeout(function(){ removeNotification(newNotification.id) }, newNotification.timeout * 1000);
}

function removeNotification(notificationId) {
  // Do a outro transition
  var notificationToRemove = document.getElementById(notificationId)
  notificationToRemove.className = notificationToRemove.className + " fade-out";
  // Shift up the other notifications after they fade out (500ms)
  shiftUpNotifications(notificationToRemove, notificationToRemove.clientHeight);

  // Remove the notification from the DOM
  notificationToRemove.addEventListener("transitionend",function(){
    removeFromDOM(notificationToRemove);
  },false);

  // Remove the notification from the array
  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].id == notificationId) {
      notifications.splice(i, 1);
      break;
    }
  }
}

function showNotificationAtTopOfPage(notification) {
  var div = document.createElement("div");
  div.className = NOTIFICATION_CLASS_NAME + " " + notification.level;
  div.id = notification.id;
  div.style.top = MARGIN_BETWEEEN_NOTIFICATIONS + "px";
  div.style.right = "-350px"; // Position it to the right so that it starts off the page, and slides in from the CSS animation.
  div.innerHTML = notification.message;
  // Add it to the DOM
  document.body.appendChild(div);
}

function moveDownExisitingNotifications(notificationsOnPage, height) {
  // If there are other notifications on the page, bump them all down.
  if(notificationsOnPage && notificationsOnPage.length >= 1) {
    for(var i = 0; i < notificationsOnPage.length; i++) {
      var currentNotification = document.getElementById(notificationsOnPage[i].id);
      var currentTop = currentNotification.offsetTop;
      currentNotification.style.top = currentTop + height + MARGIN_BETWEEEN_NOTIFICATIONS + "px";
    }
  }
}

function removeFromDOM(notificationToRemove) {
  var removedNotificationHeight = notificationToRemove.clientHeight;
  notificationToRemove.parentNode.removeChild(notificationToRemove);
}

function shiftUpNotifications(notificationToRemove, height) {
  // When one notification is removed, shift up any that are beneath it.
  for(var i = 0; i <= notifications.length; i++) {
    // console.log(notifications[i]);
    if(notificationToRemove.id == notifications[i].id) {
      for(var k = i+1; k <= notifications.length - 1; k++ ) {
        var currentNotification = document.getElementById(notifications[k].id);
        var currentTop = currentNotification.offsetTop;
        currentNotification.style.top = currentTop - height - MARGIN_BETWEEEN_NOTIFICATIONS + "px";
      }
      return;
    }
  }


}
