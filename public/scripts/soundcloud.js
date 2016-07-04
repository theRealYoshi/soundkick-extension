console.log('Soundcloud content script is running...');

// check only first time in session, keep localstorage as false initially when browser is opened.
window.addEventListener("focus", function(){
  // receives message saying that this person has already activated the tab or base if off of session data.
  var firstTimeTabActivated = true;
  console.log(firstTimeTabActivated);
  if(!firstTimeTabActivated){
    notifyExtension("tabActivated", "You're at Soundcloud!");
  } else {
    notifyExtension("notificationActivated", "This is your 2nd time at the Soundcloud tab!");
  }
});

function notifyExtension(messageType, messageContent) {
  chrome.runtime.sendMessage({
    type: messageType,
    content: messageContent
  });
}

function receiveMessage(request, sender, sendResponse){
  console.log("this was received from content scripts");
  console.log(request);
  console.log(sender);
  console.log(sendResponse);
  console.log("this is the message content");
  console.log(request.content);
}


chrome.runtime.onMessage.addListener(receiveMessage);
