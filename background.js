//Return a new notification ID, which is to be used in the notification.

function getNotificationId()
{
	var id = Math.floor(Math.random() * 9007199254740992) + 1;
	return id.toString();
}

function messageReceived(message)
{
	var messageString = "";
 	 for (var key in message.data) 
 		{
    		if (messageString != "")
      			messageString += ", "
    		messageString += key + ":" + message.data[key];
  	 	}
  console.log("Message received: " + messageString);

  chrome.notifications.create(getNotificationId(), {
  	title: 'Hike Message',
  	iconUrl: 'ic_launcher.png',
  	type: 'basic',
  	message: messageString
  }, function() {});
}

function firstTimeRegistration() {
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.
    if (result["registered"])
      return;
  	
  	else
  	{
  		//Trigger the register function from gcm_register.js	
  	}
  });
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);
// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);
