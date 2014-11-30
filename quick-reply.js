function show(details)
{
	var fromPhone = details['f'];
  	var to = details['to'];
  	var msg = details['d']['hm'];
  	var i = details['d']['i'];
	
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
    	var msgDetails = req.details;
    	show(msgDetails);
  	}
}
//Adding message listener for updating UI
chrome.runtime.onMessage.addListener(fetchData);