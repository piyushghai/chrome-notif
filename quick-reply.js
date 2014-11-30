function show(details)
{
	var msg = details['msg'];
console.log("Inside JS file" + details);
document.getElementById('container').style.display = 'block';
document.getElementById('image').src = '/ic_launcher.png';
document.getElementById('title').textContent = 'Hello';
document.getElementById('desc').textContent = 'Via ';
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