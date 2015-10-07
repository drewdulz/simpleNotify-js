// drew.js

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
  notificationToRemove.className = notificationToRemove.className + " removing";
  // Remove the notification from the DOM
  // TODO:check for event start.....
  // notificationToRemove.addEventListener("animationend", removeFromDOM(notificationId));

  // Move the rest of the notifications to fill in the missing space.
  // Something with the index....
  // // Re-draw the rest of the notifications
  // displayNotifications(notifications);
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
  div.style.right = "5px";
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

function removeFromDOM(notificationId) {
  var notificationToRemoveFromDOM = document.getElementById(notificationId);
  notificationToRemoveFromDOM.parentNode.removeChild(notificationToRemoveFromDOM);
}
