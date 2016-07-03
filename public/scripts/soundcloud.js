console.log('this script started running');


// check only first time in session, keep localstorage as false initially when browser is opened. 
window.addEventListener("focus", function(){
  console.log(window.visibilityState);
  notifyExtension();
});

function notifyExtension() {
  chrome.runtime.sendMessage({"content": "You're at Soundcloud!"});
}
