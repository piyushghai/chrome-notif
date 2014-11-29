var registrationId = "";

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

	chrome.storage.local.set({registered: true});
}