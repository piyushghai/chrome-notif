var registrationId = "";

function register()
{
	var manifest = chrome.runtime.getManifest();
	var sender_id = manifest.sender_id;

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