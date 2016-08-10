/* -----------------------------------------------------------------------------

simpleNotify.js
A simple notifications library built with pure javascript and no dependancies.
Copyright Drew Warkentin 2016. All rights reserved.

To do:
-Add a close button to close notifications
-Add support for non auto-dismissing notifications

----------------------------------------------------------------------------- */

var simpleNotify = {
  // Some important variables
  NOTIFICATION_CLASS_NAME : "simple-notification",
  CONTAINER_CLASS_NAME : "simple-notification-container",
  CONTAINER_ID_NAME : "notificationContainer",
  MARGIN_BETWEEEN_NOTIFICATIONS : 5, //px
  NOTIFICATION_WIDTH: 300, //px
  NOTIFICATION_TIME : 7000, //ms
  notificationCount : 0,

  notify : function(message, level) {
    var level = typeof level !== 'undefined' ?  level : "good";
    simpleNotify.notificationCount++;
    var notificationId = 'notification' + simpleNotify.notificationCount;
    var newNotification = {"id": notificationId, "message": message, "level": level };
    // If we don't have the notification container already on the page, create it
     if(document.getElementById("notificationContainer")) {
       // Show the notification
       simpleNotify.showNotification(newNotification);
     } else {
       // create the container
       simpleNotify.createContainer();
       // Show the notification
       simpleNotify.showNotification(newNotification);
     }
  },

  // This function creates the container for the notifications to be render in
  createContainer : function() {
      var divContainer = document.createElement("div");
      divContainer.className = simpleNotify.CONTAINER_CLASS_NAME;
      divContainer.id = simpleNotify.CONTAINER_ID_NAME;
      document.body.appendChild(divContainer);
  },

  showNotification : function(notification) {
      // Create the new notification element
      var newNotification = document.createElement("div");
      newNotification.className = simpleNotify.NOTIFICATION_CLASS_NAME + " " + notification.level;
      newNotification.id = notification.id;
      newNotification.innerHTML = notification.message + "<div class='close-notification' onclick='simpleNotify.close(" + newNotification.id + ")'></div>";
      newNotification.style.marginLeft = simpleNotify.NOTIFICATION_WIDTH + 10 + "px";
      // Create a wrapper for the notification element so that we can transition it nicely.
      var notificationWrapper = document.createElement("div");
      notificationWrapper.className = "simple-notification-wrapper";
      notificationWrapper.appendChild(newNotification);
      // Add it to the DOM
      var notificationContainer = document.getElementById(simpleNotify.CONTAINER_ID_NAME);
      notificationContainer.insertBefore(notificationWrapper, notificationContainer.firstChild);

      // Destroy the notification after the set time
      setTimeout(function() {
        simpleNotify.removeNotification(newNotification);
      }, simpleNotify.NOTIFICATION_TIME);
  },

  close : function(notification) {
    simpleNotify.removeNotification(notification);
  },

  removeNotification : function(notificationToRemove) {
    notificationToRemove.className = notificationToRemove.className + " fade-out";
    // Remove the notification from the DOM after the fade out has finished
    notificationToRemove.addEventListener("transitionend",function(){
        document.getElementById(simpleNotify.CONTAINER_ID_NAME).removeChild(notificationToRemove.parentElement);
    },false);
  }
}
