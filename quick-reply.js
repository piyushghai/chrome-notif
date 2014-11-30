function show(details)
{
	var msg = details['msg'];
	var fromPhone = details['sender'];
	chrome.runtime.onMessage.removeListener(fetchData);
	document.getElementById('container').style.display = 'block';
	document.getElementById('image').src = '/ic_launcher.png';
	document.getElementById('title').textContent = fromPhone;
	document.getElementById('desc').textContent = 'Via Hike Messenger';
	document.getElementById('message').textContent = msg;
}

function fetchData(req, sender, sendResponse)
{
	console.log("Adding listener");
  	if (req.details) {
    	var details = req.details.message;
    	show(details);
  	}
}
//Adding message listener for updating UI
chrome.runtime.onMessage.addListener(fetchData);