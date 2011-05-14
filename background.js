function setCSS(tabId) {
  chrome.tabs.sendRequest(tabId, {type: "switch"}, null);
}

var remainingTicks = {};
var tickLengthInMillis = 100;
var numberOfTicks = 300;
var startOffsetMillis = 1000;
var currentTab = 0;

function updateText() {
  if (remainingTicks[currentTab] === undefined ||
      remainingTicks[currentTab] <= 0) {
    chrome.browserAction.setBadgeText({text:""});
    return;
  }
  var secsLeft = remainingTicks[currentTab] * tickLengthInMillis / 1000.0;
  secsLeft = Math.round(secsLeft);
  chrome.browserAction.setBadgeText({text:secsLeft+"s"});
}

function check(tabId) {
  updateText();
  if (remainingTicks[tabId] <= 0) {
    remainingTicks[tabId] = 0;
    setCSS(tabId);
    return;
  }

  if (currentTab == tabId) {
    if (remainingTicks[tabId] !== undefined) {
      remainingTicks[tabId] -= 1;
    }
  }
  
  setTimeout(function(){check(tabId);}, tickLengthInMillis);
}

function blockTab(tabId) {
  // TODO (brahle): implement this
  return true;
}

chrome.tabs.onUpdated.addListener(
  function(tabId, changeInfo, tab) {
    if (changeInfo.status != "loading") {
      return;
    }
    if (!blockTab(tabId)) {
      return;
    }
    remainingTicks[tabId] = numberOfTicks;
    setTimeout(function(){setCSS(tabId);}, startOffsetMillis);
    check(tabId);
  }
);

chrome.tabs.onSelectionChanged.addListener(
  function(tabId, selectInfo) {
    currentTab = tabId;
    updateText();
  }
);
