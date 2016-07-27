// ***** USE BROWSER CONSOLE TO CHECK ALL LOGS (CTRL + SHIFT + J) *******
'use strict';

/*global chrome:false */
console.log("[background.js] : setting popup view");
chrome.browserAction.setPopup({ popup: "https://soundkick-server.herokuapp.com/"});
chrome.storage.local.set({
  soundkickAccess: "",
  soundcloudTabActivated: false
})
// do a storage change listener or sync

function checkSoundkickAccess(){
  console.log('[background.js] checkSoundkickAccess: Soundkick Access accessed');
  // if session token in soundkick have access then check for upcoming concerts
  // also set chrome.storage.local to true that you have access
  chrome.storage.local.set({
    soundcloudTabActivated: true
    // upon out of focus set to false;
  });
  console.log("[background.js] checkSoundkickAccess: getAllCookieStores");
  getAllCookieStores();
  // else ask user to signin to soundkick access
  // chrome.browserAction.openPopup(function(popupView){
  //   console.log("[background.js] checkSoundkickAccess: " + popupView);
  // });
  console.log("[background.js] checkSoundkickAccess: setting badge");
  chrome.browserAction.setBadgeText({text: '1'});
}

function removeBadge(){
  // will not fire if icon action has a popup.
  console.log("[background.js] removeBadge: badge removed");
  chrome.browserAction.setBadgeText({text: ''});
}

// This is the page for which we want to rewrite
// the User-Agent header.
var targetPages = ["http://*.soundcloud.com/*", "https://*.soundcloud.com/*"] ;

function rewriteUserAgentHeader(e){
  console.log("[background.js] rewriteUserAgentHeader");
  console.log(e);
  var reqHeaders = e.requestHeaders;
  for (var i = 0; i < reqHeaders.length; i++){
    if (reqHeaders[i].name === "Cookie"){
      console.log("Cookie Value:");
      console.log(reqHeaders[i].value);
    } else if (reqHeaders[i].name === "Authorization"){
      console.log("Authorization Value:");
      console.log(reqHeaders[i].value);
    }
  }
}

chrome.browserAction.onClicked.addListener(removeBadge);
chrome.runtime.onMessage.addListener(dispatch);
chrome.storage.onChanged.addListener(logStorageChange);
chrome.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: targetPages},
    ["blocking", "requestHeaders"]
);

// sends message to content_scripts soundcloud.js which notifies the token has been activated
// get tab id

function dispatch(message){
  console.log("[background.js] dispatch: " + message);
  switch(message.type){
    case "tabActivated":
      checkSoundkickAccess();
      console.log("[background.js] dispatch: tabActivated");
      break;
    case "notificationActivated":
      console.log("[background.js] dispatch: notificationActivated");
      // notify(message.content);
      break;
    default:
      console.log("[background.js] dispatch: nothing happened in dispatch");
  }
}

function notify(messageContent) {
  console.log("[background.js] notify: notification created");
  chrome.notifications.create({
    "type": "basic",
    "iconUrl": chrome.extension.getURL("musical-64.png"),
    "title": "You went to Soundcloud!",
    "message": messageContent
  });
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {content: "yo this is happening right now"});
  });
}

function logStorageChange(changes, area) {
  console.log("[background.js] logStorageChange: Change in storage area: ");
  console.log(area);
  console.log(changes);
  for (var i = 0; i < changes.length; i++) {
    console.log("[background.js] logStorageChange: ");
    console.log(changes[i] + " has changed:");
    console.log("[background.js] logStorageChange: Old value: ");
    console.log(changes[i].oldValue);
    console.log("[background.js] logStorageChange: New value: ");
    console.log(changes[i].newValue);
  }
}

function getAllCookieStores(){
  // chrome.cookies.getAll({url: "https://*.soundkick-server.herokuapp.com/*", name:"connect.sid"}, function(cookies){
  console.log("[background.js] getAllCookieStores: ");
  chrome.cookies.getAll({ domain: "soundkick-server.herokuapp.com", name: "soundkick-server"}, function(cookies){
    console.log(cookies);
    for (var i = 0; i < cookies.length; i++){
      console.log("[background.js] cookie value: ")
      console.log(cookies[i].value);
      chrome.storage.local.set({
        soundkickAccess: cookies[i].value
      });
    }
  });
}
