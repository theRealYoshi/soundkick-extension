// ***** USE BROWSER CONSOLE TO CHECK ALL LOGS (CTRL + SHIFT + J) *******
'use strict';

/*global chrome:false */

chrome.browserAction.setPopup({ popup: "https://soundkick-server.herokuapp.com/"});

chrome.storage.local.set({
  soundkickAccess: false,
  soundcloudTabActivated: false
})
// do a storage change listener

function checkSoundkickAccess(){
  console.log('Soundkick Access accessed');
  // if session token in soundkick have access then check for upcoming concerts
  // also set chrome.storage.local to true that you have access
  chrome.storage.local.set({
    soundcloudTabActivated: true
  });
  // else ask user to signin to soundkick access

  // chrome.browserAction.getPopup(function(res){
  //   console.log(res);
  // });
  chrome.browserAction.setBadgeText({text: '1'});
  // chrome.webRequest.
}

chrome.runtime.onMessage.addListener(dispatch);

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
}
