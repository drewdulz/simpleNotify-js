/*
simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Andrew Warkentin 2016. All rights reserved.

To do:
-add a close button to close notifications
-Add support for non auto-dismissing notifications

Known bugs:
-When lots of notifications are appearing on the screen, they can start to get confused and overlap or behave oddly.
*/

document.addEventListener("DOMContentLoaded", function() {
  simpleNotify.notificationCreateTimingControl();
  simpleNotify.notificationDestroyTimingControl();
});

var simpleNotify = {
  // Some important variables
  NOTIFICATION_CLASS_NAME : "simple-notification",
  MARGIN_BETWEEEN_NOTIFICATIONS : 5, //px
  NOTIFICATION_TIME : 7000, //ms

  notificationsToCreate: [],
  notificationsToDestroy: [],
  notifications: [],
  notificationCount : 0,

  notify : function(message, level) {
    var level = typeof level !== 'undefined' ?  level : "good";
    simpleNotify.notificationCount++;
    var notificationId = 'notification' + simpleNotify.notificationCount;
    var newNotification = {"id": notificationId, "message": message, "level": level };
    simpleNotify.notificationsToCreate.push(newNotification);
  },

  // This functions prevents multiple notifications from being created at the same time and messing up all the timing and movements of other notifications.
  notificationCreateTimingControl : function () {
    setInterval(function(){
      if(simpleNotify.notificationsToCreate && simpleNotify.notificationsToCreate.length > 0) {
        simpleNotify.notifications.unshift(simpleNotify.notificationsToCreate[0]);
        // Show the notification on the page
        simpleNotify.displayNewNotification(simpleNotify.notificationsToCreate[0]);
        simpleNotify.notificationsToCreate.shift();
      }
    }, 1000);
  },

  notificationDestroyTimingControl : function() {
    setInterval(function(){
      if(simpleNotify.notificationsToDestroy && simpleNotify.notificationsToDestroy.length > 0) {
        // destory the existing notification on the page
        simpleNotify.removeNotification(simpleNotify.notificationsToDestroy[0].id);
        simpleNotify.notificationsToDestroy.shift();
      }
    }, 2000);
  },

  displayNewNotification : function(newNotification) {
    // Get the current notifications on the page
    var notificationsOnPage = Array.prototype.slice.call(document.getElementsByClassName(simpleNotify.NOTIFICATION_CLASS_NAME));
    // Show the new notifiaction
    simpleNotify.showNotificationAtTopOfPage(newNotification);
    // Move down the other notifications
    simpleNotify.moveDownExisitingNotifications(notificationsOnPage, document.getElementById(newNotification.id).offsetHeight);
    // Start a timeout for the notification just displayed
    setTimeout(function(){
      simpleNotify.notificationsToDestroy.push(newNotification);
    }, simpleNotify.NOTIFICATION_TIME);
  },

  removeNotification : function(notificationId) {
    var notificationToRemove = document.getElementById(notificationId);
    // Force a quick transition to be sure the listener will fire.
    notificationToRemove.style.top = notificationToRemove.offsetTop + 1 + "px";
    // Only do the fade out after the notification has finished moving if it in the process of moving down.
    notificationToRemove.addEventListener("transitionend",function(){
      // Do a outro transition (fade out)
      notificationToRemove.className = notificationToRemove.className + " fade-out";
      // Remove the notification from the DOM after the fade out has finished
      notificationToRemove.addEventListener("transitionend",function(){
        simpleNotify.removeFromDOM(notificationToRemove);
      },false);
    },false);
    // Shift up the other notifications after they fade out (500ms)
    simpleNotify.shiftUpNotifications(notificationToRemove, notificationToRemove.clientHeight);
    // Remove the notification from the array
    for (var i = 0; i < simpleNotify.notifications.length; i++) {
      if (simpleNotify.notifications[i].id == notificationId) {
        simpleNotify.notifications.splice(i, 1);
        break;
      }
    }
  },

  showNotificationAtTopOfPage : function(notification) {
    var div = document.createElement("div");
    div.className = simpleNotify.NOTIFICATION_CLASS_NAME + " " + notification.level;
    div.id = notification.id;
    div.style.top = simpleNotify.MARGIN_BETWEEEN_NOTIFICATIONS + "px";
    div.style.right = "-350px"; // Position it to the right so that it starts off the page, and slides in from the CSS animation.
    div.innerHTML = notification.message;
    // Add it to the DOM
    document.body.appendChild(div);
  },

  moveDownExisitingNotifications : function(notificationsOnPage, height) {
    // If there are other notifications on the page, bump them all down.
    if(notificationsOnPage && notificationsOnPage.length >= 1) {
      for(var i = 0; i < notificationsOnPage.length; i++) {
        var currentNotification = document.getElementById(notificationsOnPage[i].id);
        var currentTop = currentNotification.offsetTop;
        currentNotification.style.top = currentTop + height + simpleNotify.MARGIN_BETWEEEN_NOTIFICATIONS + "px";
      }
    }
  },

  removeFromDOM : function(notificationToRemove) {
    var removedNotificationHeight = notificationToRemove.clientHeight;
    notificationToRemove.parentNode.removeChild(notificationToRemove);
  },

  shiftUpNotifications : function(notificationToRemove, height) {
    // When one notification is removed, shift up any that are beneath it.
    for(var i = 0; i <= simpleNotify.notifications.length; i++) {
      if(notificationToRemove.id == simpleNotify.notifications[i].id) {
        for(var k = i+1; k < simpleNotify.notifications.length; k++ ) {
          var notificationToMove = document.getElementById(notifications[k].id);
          var currentTop = notificationToMove.offsetTop;
          notificationToMove.style.top = currentTop - height - simpleNotify.MARGIN_BETWEEEN_NOTIFICATIONS + "px";
        }
        return;
      }
    }
  }

}
