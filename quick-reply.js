var fromPhone, to;

function show(details)
{
	fromPhone = details['f'];
  	to = details['to'];
  	var msg = details['d']['hm'];
  	var i = details['d']['i'];
	
	chrome.runtime.onMessage.removeListener(fetchData);
	document.getElementById('container').style.display = 'block';
	document.getElementById('image').src = '/ic_launcher.png';
	document.getElementById('title').textContent = fromPhone;
	document.getElementById('desc').textContent = 'Via Hike Messenger';
	document.getElementById('message').textContent = msg;

	var reply = document.getElementById('reply');
       reply.onkeydown = function(e) {
           if (e.keyCode == 13 && !e.shiftKey) {
               if (reply.value.length > 0) {
                   sendMessage();
               }
               return false;
           }
       };
}

function fetchData(req, sender, sendResponse)
{
	console.log("Adding listener");
  	if (req.details) {
    	var msgDetails = req.details;
    	show(msgDetails);
  	}
}

function sendMessage()
{
	var uid, token;
	chrome.storage.local.get('uid', function(result)
    {
        uid = result.uid;
        console.log('get uid: ', result.uid);
    });
    chrome.storage.local.get('token', function(result)
    {
        token = result.token;
        console.log('get token: ', result.token);
		pin = $("#pin").val();
		var time = $.now();
	    var message = $("#reply").val();
	    var fromTo = "{\"f\":" + "\"" + to + "\""+ ", \"to\":" +"\"" + fromPhone + "\"";
	    var md = ", \"md\":{\"sub\":\"desktop\"}";
	    var data = ", \"d\":{\"ts\":" + time + ", \"i\":" + time + ", \"hm\":" + "\"" + message + "\"}, \"t\":\"m\"";
	    var cookie = ", \"user\":" + "\"" + token + "\"" + ", \"uid\":" + "\""  + uid + "\"" + "}";
	    data = fromTo + md + data + cookie;
	    console.log("data = " + data);
	     var xhr = $.ajax({
	        type: "POST",
	        url: "http://staging.im.hike.in/v1/send_message", 
	        data: data,
	        contentType: "application/json; charset=utf-8",
	        dataType: "json",
	        success: function(msg) {
	            console.log("Server response = " + $.param(msg));
	            if(msg.stat == "ok")
	            {
	                console.log("Message sent.");                   
	                showPinValidatedNotif('Message sent. Yay!');
	            }
	            else
	            {
	            	showPinValidatedNotif("Error while sending message");    
	            }
	        },
	        error: function(err) {
	        	showPinValidatedNotif("Error sending message");
	            console.log("Error sending request");
	        }
	    });
	    console.log("xhr = " + xhr); 
	});
       
}

function showPinValidatedNotif(msg)
{
	setTimeout(function()
    {
    	window.close();
    }, 100);
            
    var notificationId = 0;
    chrome.notifications.create(notificationId.toString(), {
    title: 'Hike Message',
    iconUrl: 'ic_launcher.png',
    type: 'basic',
    message: msg
  }, function(notificationId) {});

}

//Adding message listener for updating UI
chrome.runtime.onMessage.addListener(fetchData);