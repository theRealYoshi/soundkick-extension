// ***** USE BROWSER CONSOLE TO CHECK ALL LOGS (CTRL + SHIFT + J) *******

'use strict';

/*global chrome:false */

var soundcloudOpen = false;

function checkSoundcloudAccess(){
  chrome.storage.local.set({
    soundcloudOpen: soundcloudOpen
  })
  // chrome.webRequest.
}

// set to see if soundcloud is a tab that's opened
// make this into a function os it can be called at anytime
function checkSoundcloudOpen(){
  chrome.tabs.query({ currentWindow: true}, function(tabs){
    for (var tab of tabs){
      if(tab.url.toString().indexOf("soundcloud") > -1){
        // chrome.browserAction.setBadgeText({text: '(ツ)'});
        // chrome.browserAction.setBadgeBackgroundColor({color: '#eae'});
        console.log("yes");
        console.log(tab.url);
        soundcloudOpen = true;
        chrome.browserAction.getPopup(function(res){
          console.log(res);
        });
      }
    }
  })
  chrome.cookies.get({
    url: "https://soundkick-server.herokuapp.com/",
    name: "__utma"
  }, function(cookie){
    console.log(cookie);
  })
  chrome.cookies.get({
    url: "https://soundkick-server.herokuapp.com/",
    name: "__utmz"
  }, function(cookie){
    console.log(cookie);
  })
}

// check to see whenever a new tab is opened. Check for soundcloud
// or if the page requested to was soundcloud
if(!soundcloudOpen){
  chrome.tabs.onUpdated.addListener(checkSoundcloudOpen);
} else {
  chrome.tabs.onUpdated.removeListener(checkSoundcloudOpen);
}

chrome.browserAction.setPopup({ popup: "https://soundkick-server.herokuapp.com/"});

chrome.browserAction.onClicked.addListener(function(aTab) {
  // set to see if authenticated
  console.log("loading...");
  console.log(soundcloudOpen);
  // create popup for concert viewer
  // If not authenticated then direct to connect page.
  // chrome.tabs.create({'url': 'https://soundkick-server.herokuapp.com/', 'active': true});
});

chrome.cookies.getAllCookieStores(function(cookieStores){
  console.log(cookieStores);
})
