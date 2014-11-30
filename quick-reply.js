function show(details)
{
	var msg = details['msg'];
	var fromPhone = details['sender'];
console.log("Inside JS file" + details);
document.getElementById('container').style.display = 'block';
document.getElementById('image').src = '/ic_launcher.png';
document.getElementById('title').textContent = fromPhone;
document.getElementById('desc').textContent = 'Via Hike Messenger';
document.getElementById('message').textContent = msg;
}

chrome.runtime.onMessage.addListener(
  function(req, sender, sendResponse) {
  	console.log("Adding listener");
  if (req.details) {
    var details = req.details.message;
    show(details);
  }
});