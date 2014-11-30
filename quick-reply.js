var fromPhone;

function show(details)
{
	var msg = details['msg'];
	fromPhone = details['sender'];
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

function sendMessage()
{
	pin = $("#pin").val();
	chrome.storage.local.get('msisdn', function(result)
    {
        var msisdn = result.msisdn;
        console.log('msisdn: ', result.msisdn);
        var time = $.now();
        var message = $("#message").val();;
        var fromTo = "{\"f\":" + "\"" + msisdn + "\""+ ", \"to\":" +"\"" + fromPhone + "\"";
        var md = ", \"md\":{\"sub\":\"desktop\"}";
        var data = ", \"d\":{\"ts\":" + time + ", \"i\":" + time + ", \"hm\":" + "\"" + message + "\"}, \"t\":\"m\"}"
        data = fromTo + md + data;
        console.log("data = " + data);
         var xhr = $.ajax({
            type: "POST",
            url: "http://staging.im.hike.in/v1/pin_validate", 
            data: data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(msg) {
                console.log("Server response = " + $.param(msg));
                if(msg.stat == "ok")
                {
                    console.log("Message sent.");                   
                }
                else
                {
                    
                }
            },
            error: function(err) {
                console.log("Error sending request");
            }
        });
        console.log("xhr = " + xhr); 
    });

       
}

$(document).keypress(function(e) {
    if(e.which == 13) {
        sendMessage();
    }
});
//Adding message listener for updating UI
chrome.runtime.onMessage.addListener(fetchData);