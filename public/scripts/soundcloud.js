console.log('Soundcloud content script is running...');

// check only first time in session, keep localstorage as false initially when browser is opened.
window.addEventListener("focus", function(){
  // receives message saying that this person has already activated the tab or base if off of session data.
  var firstTimeTabActivated = false;
  console.log("[soundcloud.js] addEventListener: " + firstTimeTabActivated);
  if(!firstTimeTabActivated){
    notifyExtension("tabActivated", "You're at Soundcloud!");
  } else {
    notifyExtension("notificationActivated", "This is your 2nd time at the Soundcloud tab!");
  }
});


function notifyExtension(messageType, messageContent) {
  console.log("[soundcloud.js] notifyExtension: " + messageContent);
  chrome.runtime.sendMessage({
    type: messageType,
    content: messageContent
  });
}

function receiveMessage(request, sender, sendResponse){
  console.log("[soundcloud.js] receiveMessage: " + request);
  console.log(request);
  console.log(sender);
  console.log(sendResponse);
  console.log("[soundcloud.js] receiveMessage: this is the message content");
  console.log("[soundcloud.js] receiveMessage: " + request.content);
}

chrome.runtime.onMessage.addListener(receiveMessage);
