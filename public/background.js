// ***** USE BROWSER CONSOLE TO CHECK ALL LOGS (CTRL + SHIFT + J) *******
'use strict';
/*global chrome:false */

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
      var soundcloudAuthToken = reqHeaders[i].value.replace(/OAuth/i, "").trim();
      console.log("Soundcloud OAuth token set");
      console.log(soundcloudAuthToken);
      chrome.storage.local.set({
        soundcloudAuthToken: soundcloudAuthToken
      });
    }
  }
}

console.log("[background.js] : setting popup view");
chrome.browserAction.setPopup({ popup: "https://soundkick-server.herokuapp.com/"});
chrome.storage.onChanged.addListener(logStorageChange);
console.log("[background.js] : setting localstorage");
chrome.storage.local.set({
  soundkickAccess: "",
  soundcloudAuthToken: "",
  soundcloudTabActivated: false,
  soundcloudOauthChecked: false
});
chrome.browserAction.onClicked.addListener(removeBadge);
chrome.runtime.onMessage.addListener(dispatch);
chrome.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {
      urls: targetPages
    },
    ["blocking", "requestHeaders"]
);
console.log("[background.js] checkSoundcloudOauth: setting to local storage true");
chrome.storage.local.set({
  soundcloudOauthChecked: true
});
// do a storage change listener or sync

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
    case "checkSoundcloudOauth":
      console.log("[background.js] dispatch: checkSoundcloudOauth");
      checkSoundcloudOauth();
      break;
    default:
      console.log("[background.js] dispatch: nothing happened in dispatch");
  }
}

function checkSoundcloudOauth(){
  console.log("[background.js] checkSoundcloudOauth:");
  chrome.storage.local.get("soundcloudOauthChecked", function(access){
    console.log("[background.js] getting storage access:");
    console.log(access.soundcloudOauthChecked);
    if(!access.soundcloudOauthChecked){
      console.log("[background.js] checkSoundcloudOauth: adding listener to webRequest");
      // need to check again
    } else {
      console.log("[background.js] checkSoundcloudOauth: removing listener");
    }
  });
}


function checkSoundkickAccess(){
  console.log('[background.js] checkSoundkickAccess: Soundkick Access accessed');
  // if session token in soundkick have access then check for upcoming concerts
  // also set chrome.storage.local to true that you have access
  chrome.storage.local.set({
    soundcloudTabActivated: true
  });
  console.log("[background.js] checkSoundkickAccess: getAllCookieStores");
  // getAllCookieStores();
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

// sends message to content_scripts soundcloud.js which notifies the token has been activated
// get tab id

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
