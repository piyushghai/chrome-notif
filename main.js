
function submitMsisdn() 
{
    var xhr = $.ajax({
        type: "POST",
        url: "http://staging.im.hike.in/v1/generate_pin", 
        data: "{\"msisdn\": " + "\"+91" + $('#msisdn').val() + "\"}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function(msg) {
            console.log("Server response = " + $.param(msg));
            console.log("stat:" + msg.stat + "token:" + msg.token );
            if(msg.stat == "ok")
            {
                chrome.storage.local.set({'msisdn': $('#msisdn').val()});
                chrome.storage.local.set({'uid': msg.uid});
                chrome.storage.local.set({'token': msg.token});
                // window.open("www.google.com",'_blank');    
                $("#status-text").text("Valid phone number");
                $("#msisdn-form").hide();
                $("#pin-form").show();
            }
            else
            {
                $("#status-text").text("Invalid phone number");
            }
        },
        error: function(err) {
            console.log(err);
            $("#status-text").text("Error sending request");
        }
    });
    console.log("xhr = " + xhr); 
}

function submitPin()
{
    console.log("fabjfbkafkja");
    // chrome.storage.local.set({'': registrationId});
    var gcm, uid, token, pin;
    chrome.storage.local.get('registrationId', function(result)
    {
        gcm = result.registrationId;
        console.log('get gcm id: ', result.registrationId);
    });
    chrome.storage.local.get('uid', function(result)
    {
        uid = result.uid;
        console.log('get uid: ', result.uid);
    });
    chrome.storage.local.get('token', function(result)
    {
        token = result.token;
        console.log('get token: ', result.token);


        pin = "1234";
        var data = "{\"msisdn\": " + "\"+91" + $('#msisdn').val() + "\", \"gcm\":" + "\"" + gcm + "\""+ ", \"pin\":" +"\"" + pin + "\"" + "}";
        var cookie = "user=" + token + "; UID=" + uid;
        console.log("data = " + data);
        console.log("cookie = " + cookie);
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
                    console.log("Pin validated.");
                }
                else
                {
                    console.log("Pin not validated.");
                }
            },
            error: function(err) {
                console.log("Error validating pin");
                // $("#status-text").text("Error sending request");
            }
        });
        console.log("xhr = " + xhr); 
    });

}

document.getElementById("msisdn-submit").addEventListener("click", function () {
  submitMsisdn();
});

document.getElementById("pin-submit").addEventListener("click", function () {
  submitPin();
});

// getting from sqlite
// chrome.storage.local.get('uid', function(result)
            // {
            //         console.debug('result: ', result.uid);
            // });