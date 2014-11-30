var registrationId = "";
var notifDetailsMap = {};

//Return a new notification ID, which is to be used in the notification.
function getNotificationId()
{
	var id = Math.floor(Math.random() * 9007199254740992) + 1;
	return id.toString();
}

function messageReceived(message)
{
  console.log(message);
	var messageString = "";
 	 for (var key in message.data) 
 		{
    		if (messageString != "")
      			messageString += ", "
    		messageString += key + ":" + message.data[key];
  	 	}
  console.log("Message received: " + messageString);

  console.log("Message,data "  + message.data['msg']);
  var details = {};
  details.message = message.data;
  var notificationId = getNotificationId();
  chrome.notifications.create(notificationId, {
  	title: 'Hike Message',
  	iconUrl: 'ic_launcher.png',
  	type: 'basic',
    priority: 2,
    buttons: [ {title: 'Reply'} ],
  	message: messageString
  }, function(notificationId) {

    if (chrome.runtime.lastError) {
            // When the registration fails, handle the error and retry the registration later.
            // See error codes here https://developer.chrome.com/extensions/cloudMessaging#error_reference
            console.log("Fail to create the message: " + chrome.runtime.lastError.message);
            return;
        }

        console.log(" notification" + notificationId);
        console.log("Details : " + details.message['msg']);
        notifDetailsMap[notificationId] = details;
        console.log("Printing Map : " + JSON.stringify(notifDetailsMap));

  });

}

function firstTimeRegistration() {
  
  chrome.storage.local.get("registered", function(result) {
    // If already registered, bail out.

    if (result["registered"])

      {
        console.log("Inside registered");
        return;
      }
  	
  	else
  	{   
        console.log("Not registered yet");
        register();
  	}
  });
}

// Set up a listener for GCM message event.
chrome.gcm.onMessage.addListener(messageReceived);
// Set up listeners to trigger the first time registration.
chrome.runtime.onInstalled.addListener(firstTimeRegistration);
chrome.runtime.onStartup.addListener(firstTimeRegistration);



// Code for registering with GCM begins here

function register()
{
  var sender_id = "940463892411";
  chrome.gcm.register([sender_id], registerResult);
  console.log("Registering with " + sender_id);
}

function registerResult(regId)
{
  registrationId = regId;
  console.log("GCM Registration Id " + registrationId);
  if(chrome.runtime.lastError)
  {
    //If the registration fails, retry : 
    console.log("Retrying registration");
    register();
    return;
  }

  chrome.storage.local.set({'registered': true});
  chrome.storage.local.set({'registrationId': registrationId});
}

function notificationBtnClick(notID, iBtn) {
  console.log("The notification '" + notID + "' had button " + iBtn + " clicked");
  
  chrome.windows.create({
                        url: '/reply.html',
                        type: 'popup',
                        width: 320,
                        height: 390,
                        focused: true,
                        left: (screen.width - 350),
                        top: (30)
                    }, function(window) {
                        console.log("Here's the window obj");
                        chrome.runtime.sendMessage({details : getElementFromMap(notID)}, function(response){

                        });
                        
                    });
}

function getElementFromMap(k)
{
  console.log(notifDetailsMap[k].message['msg']);
  return notifDetailsMap[k];
}

window.addEventListener("load", function(){
  console.log("Adding Listener Called");
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
});
