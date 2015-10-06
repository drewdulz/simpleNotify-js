// drew.js

var notifications = [];
var notificationCount = 0;
function notify(message, timeout, status) {
  // alert("hey");
  notificationCount++;
  var notificationId = 'notification' + notificationCount;
  notifications.push({"id": notificationId, "message": message, "timeout": timeout, "status": status })
  displayNotifications(notifications);
  // Start a timeout for the notification just displayed
  setTimeout(function(){ removeNotification(notificationId) }, timeout * 1000);
}

function displayNotifications(notifications) {
  // Remove any notifications already on the page.
  var notificationsToRemove = document.getElementsByClassName('notification');
  while(notificationsToRemove[0]) {
    notificationsToRemove[0].parentNode.removeChild(notificationsToRemove[0]);
  }

  // Display each notification on the page.
  var heightToPlotNextNotification = 0;
  notifications.forEach(function(notification) {
    // Add 5 px of space between each notification;
    heightToPlotNextNotification += 5;
    var div = document.createElement("div");
    div.className = "notification";
    div.id = notification.id;
    div.style.width = "100px";
    div.style.background = "red";
    div.style.color = "white";
    div.style.position = "fixed";
    div.style.top = heightToPlotNextNotification + "px";
    div.style.right = "5px";
    div.innerHTML = notification.message;
    // Add it to the DOM
    document.body.appendChild(div);
    // Add the height of the last notification plotted so the next one plots in the correct spot
    heightToPlotNextNotification += document.getElementById(notification.id).offsetHeight;
  });
}

function removeNotification(notificationId) {
  // Remove the notification from the array
  for (var i = 0; i < notifications.length; i++) {
    if (notifications[i].id === notificationId) {
      notifications.splice(i, 1);
      break;
    }
  }
  // Remove the notification from the DOM
  var notificationToRemoveFromDOM = document.getElementById(notificationId);
  notificationToRemoveFromDOM.parentNode.removeChild(notificationToRemoveFromDOM);
  // Re-draw the rest of the notifications
  displayNotifications(notifications);
}
