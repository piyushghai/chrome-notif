$(document).ready(function() 
{
    chrome.storage.local.get('authentication', function(result)
    {
        refreshUI(result.authentication);
    });
    
});

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
                refreshUI(1);
                chrome.storage.local.set({'authentication': 1});
            }
            else
            {
                chrome.storage.local.set({'authentication': 0});
                $("#status-text").text("*Invalid phone number");
            }
        },
        error: function(err) {
            console.log(err);
            chrome.storage.local.set({'authentication': 0});
            $("#status-text").text("*Error sending request");
        }
    });
    console.log("xhr = " + xhr); 
}

function submitPin()
{
    console.log("------Submitting pin-----");
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

        pin = $("#pin").val();
        var data = "{\"gcm\":" + "\"" + gcm + "\""+ ", \"pin\":" +"\"" + pin + "\"";
        var cookie = ", \"user\":" + "\"" + token + "\"" + ", \"uid\":" + "\""  + uid + "\"" + "}";
        data = data + cookie;
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
                    console.log("Pin validated.");
                    chrome.storage.local.set({'authentication': 2});
                    refreshUI(2);
                }
                else
                {
                    chrome.storage.local.set({'authentication': 1});
                    $("#pin-status-text").text("*Invalid Pin");
                }
            },
            error: function(err) {
                chrome.storage.local.set({'authentication': 1});
                console.log("Unauthorized, resposnse not received");
                $("#pin-status-text").text("*Error sending request");
            }
        });
        console.log("xhr = " + xhr); 
    });

}

function logout()
{
    console.log("Logging out");
    chrome.storage.local.set({'authentication': 0});
    refreshUI(0);
}

function refreshUI(val)
{
        if(val == 1)
        {
            console.log("authentication = 1");
            $("#msisdn-form").hide();
            $("#pin-form").show();
            $("#logout").show();
            $("#pin-status-text").text("");
            $("#welcome-text").hide();
        }
        else if(val == 2)
        {
            console.log("authentication = 2");
            $("#msisdn-form").hide();
            $("#pin-form").hide();
            $("#logout").show();
            $("#welcome-text").show();
        }
        else
        {
            console.log("authentication = 0");
            $("#msisdn-form").show();
            $("#pin-form").hide();
            $("#logout").hide();
            $("#pin-status-text").text("");
            $("#status-text").text("");
            $("#welcome-text").hide();
        }
}

document.getElementById("msisdn-submit").addEventListener("click", function () {
  submitMsisdn();
});

document.getElementById("pin-submit").addEventListener("click", function () {
  submitPin();
});

document.getElementById("logout").addEventListener("click", function () {
  logout();
});


// getting from sqlite
// chrome.storage.local.get('uid', function(result)
// {
//         console.debug('result: ', result.uid);
// });