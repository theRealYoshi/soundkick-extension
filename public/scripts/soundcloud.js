console.log('Soundcloud content script is running...');

// check only first time in session, keep localstorage as false initially when browser is opened.
window.addEventListener("focus", function(){
  chrome.storage.local.set({
    soundcloudTabActivated: true
  })
  var firstTimeTabActivated = chrome.storage.local.get('soundcloudTabActivated');
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
