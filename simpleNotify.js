/*
simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Andrew Warkentin 2015. All rights reserved.

To do:
-add a close button to close notifications
-Add support for non auto-dismissing notifications

Known bugs:
-When lots of notifications are appearing on the screen, they can start to get confused and overlap or behave oddly.
*/

document.addEventListener("DOMContentLoaded", function() {
  notificationCreateTimingControl();
  notificationDestroyTimingControl();
});

// Some important variables
var NOTIFICATION_CLASS_NAME = "simple-notification";
var MARGIN_BETWEEEN_NOTIFICATIONS = 5; //px
var NOTIFICATION_TIME = 7000 //ms

var notificationsToCreate = [];
var notificationsToDestroy = [];
var notifications = [];
var notificationCount = 0;

function simpleNotify(message, level) {
  notificationCount++;
  var notificationId = 'notification' + notificationCount;
  var newNotification = {"id": notificationId, "message": message, "level": level };
  notificationsToCreate.push(newNotification);
}

// This functions prevents multiple notifications from being created at the same time and messing up all the timing and movements of other notifications.
function notificationCreateTimingControl() {
  setInterval(function(){
    if(notificationsToCreate && notificationsToCreate.length > 0) {
      notifications.unshift(notificationsToCreate[0]);
      // Show the notification on the page
      displayNewNotification(notificationsToCreate[0]);
      notificationsToCreate.shift();
    }
  }, 1000);
}

function notificationDestroyTimingControl() {
  setInterval(function(){
    if(notificationsToDestroy && notificationsToDestroy.length > 0) {
      // destory the existing notification on the page
      removeNotification(notificationsToDestroy[0].id);
      notificationsToDestroy.shift();
    }
  }, 2000);
}

function displayNewNotification(newNotification) {
  // Get the current notifications on the page
  var notificationsOnPage = Array.prototype.slice.call(document.getElementsByClassName(NOTIFICATION_CLASS_NAME));
  // Show the new notifiaction
  showNotificationAtTopOfPage(newNotification);
  // Move down the other notifications
  moveDownExisitingNotifications(notificationsOnPage, document.getElementById(newNotification.id).offsetHeight);
  // Start a timeout for the notification just displayed
  setTimeout(function(){
    notificationsToDestroy.push(newNotification);
  }, NOTIFICATION_TIME);
}

function removeNotification(notificationId) {
  var notificationToRemove = document.getElementById(notificationId);
  // Force a quick transition to be sure the listener will fire.
  notificationToRemove.style.top = notificationToRemove.offsetTop + 1 + "px";
  // Only do the fade out after the notification has finished moving if it in the process of moving down.
  notificationToRemove.addEventListener("transitionend",function(){
    // Do a outro transition (fade out)
    notificationToRemove.className = notificationToRemove.className + " fade-out";
    // Remove the notification from the DOM after the fade out has finished
    notificationToRemove.addEventListener("transitionend",function(){
      removeFromDOM(notificationToRemove);
    },false);
  },false);
  // Shift up the other notifications after they fade out (500ms)
  shiftUpNotifications(notificationToRemove, notificationToRemove.clientHeight);
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
    if(notificationToRemove.id == notifications[i].id) {
      for(var k = i+1; k < notifications.length; k++ ) {
        var notificationToMove = document.getElementById(notifications[k].id);
        var currentTop = notificationToMove.offsetTop;
        notificationToMove.style.top = currentTop - height - MARGIN_BETWEEEN_NOTIFICATIONS + "px";
      }
      return;
    }
  }


}
