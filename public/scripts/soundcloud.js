console.log('Soundcloud content script is running...');
var storageStuff;

function gotItem(item) {
  if (chrome.runtime.lastError) {
    console.log(chrome.runtime.lastError);
  } else {
    console.log(item);
    storageStuff = item;
  }
}

// check only first time in session, keep localstorage as false initially when browser is opened.
window.addEventListener("focus", function(){
  // receives message saying that this person has already activated the tab or base if off of session data.
  console.log("[soundcloud.js] addEventListener: Storage Items");
  // console.log("[soundcloud.js] addEventListener: " + firstTimeTabActivated);
  // if(!firstTimeTabActivated){
  //   sendMessage("tabActivated", "You're at Soundcloud!");
  // } else {
  //   sendMessage("notificationActivated", "This is your 2nd time at the Soundcloud tab!");
  // }
  console.log("[soundcloud.js] addEventListener:");
  sendMessage("checkSoundcloudOauth", "checking soundcloud oauth access");
});


function sendMessage(messageType, messageContent) {
  console.log("[soundcloud.js] sendMessage: " + messageContent);
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
