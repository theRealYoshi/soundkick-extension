// ***** USE BROWSER CONSOLE TO CHECK ALL LOGS (CTRL + SHIFT + J) *******
'use strict';

/*global chrome:false */

chrome.browserAction.setPopup({ popup: "https://soundkick-server.herokuapp.com/"});

chrome.storage.local.set({
  soundkickAccess: false,
  soundcloudTabActivated: false
})
// do a storage change listener or sync

function checkSoundkickAccess(){
  console.log('Soundkick Access accessed');
  // if session token in soundkick have access then check for upcoming concerts
  // also set chrome.storage.local to true that you have access
  chrome.storage.local.set({
    soundcloudTabActivated: true
  });
  // else ask user to signin to soundkick access
  chrome.browserAction.openPopup(function(popupView){
    console.log(popupView);
  });
  chrome.browserAction.setBadgeText({text: '1'});
  // chrome.webRequest.
}

function removeBadge(){
  console.log("badge removed");
  chrome.browserAction.setBadgeText({text: ''});
}

chrome.browserAction.onClicked.addListener(removeBadge);
chrome.runtime.onMessage.addListener(dispatch);
chrome.storage.onChanged.addListener(logStorageChange);

// sends message to content_scripts soundcloud.js which notifies the token has been activated
// get tab id


function dispatch(message){
  console.log(message);
  switch(message.type){
    case "tabActivated":
      checkSoundkickAccess();
      console.log(message.content);
      break;
    case "notificationActivated":
      notify(message.content);
      break;
    default:
      console.log("nothing happened in dispatch");
  }
}

function notify(messageContent) {
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
  console.log("Change in storage area: " + area);

  var changedItems = Object.keys(changes);
  console.log(changedItems);
  for (item of changedItems) {
    console.log(item + " has changed:");
    console.log("Old value: ");
    console.log(changes[item].oldValue);
    console.log("New value: ");
    console.log(changes[item].newValue);
  }
}
