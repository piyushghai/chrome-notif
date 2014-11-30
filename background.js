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
	var messageString = "";
  var jsonObj = JSON.parse(message.data['notify']);
  console.log(jsonObj);
  
  var from = jsonObj['f'];
  var to = jsonObj['to'];
  var msg = jsonObj['d']['hm'];
  var i = jsonObj['d']['i'];
  var newDate = new Date();

  console.log("From : " + from + "To : " + to);
  
  var notificationId = getNotificationId();
  chrome.notifications.create(notificationId, {
  	title: from,
  	iconUrl: 'ic_launcher.png',
  	type: 'basic',
    priority: 2,
    buttons: [ {title: 'Reply', iconUrl: 'send.png'} ],
  	message: 'Message : ' + msg,
    contextMessage: (newDate.getHours() + ' : ' + newDate.getMinutes())
  }, function(notificationId) {

    if (chrome.runtime.lastError) {
            // When the registration fails, handle the error and retry the registration later.
            // See error codes here https://developer.chrome.com/extensions/cloudMessaging#error_reference
            console.log("Fail to create the message: " + chrome.runtime.lastError.message);
            return;
        }

        console.log(" notification" + notificationId);
        notifDetailsMap[notificationId] = jsonObj;
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
chrome.notifications.onButtonClicked.addListener(notificationBtnClick);
chrome.notifications.onClosed.addListener(notificationClosed);


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
                        left: (screen.width/2 - 160),
                        top: (screen.height/2 - 195)
                    }, function(window) {
                        console.log("Here's the window obj");
                        chrome.runtime.sendMessage({details : getElementFromMap(notID)}, function(response){
                         removeElementFromMap(notID);   
                        });
                        
                    });
}

function notificationClosed(notID, byUser)
{
  console.log("Notification closed : " + notID);
  removeElementFromMap(notID);
}
function getElementFromMap(k)
{
  console.log(notifDetailsMap[k]);
  return notifDetailsMap[k];
}

function removeElementFromMap(k)
{
  console.log("Removing notification from map");
  delete notifDetailsMap[k];
}
