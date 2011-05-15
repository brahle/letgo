function toggleHide(tabId) {
  chrome.tabs.sendRequest(tabId, {type: "switch"}, null);
}

var remainingTicks = {};
var tickLengthInMillis = 100;
var numberOfTicks = 300;
var startOffsetMillis = 500;
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

function check() {
  updateText();

  if( remainingTicks[currentTab] === undefined) {
    setTimeout(function(){check();}, tickLengthInMillis);
    return;
  }

  if (remainingTicks[currentTab] <= 0 ) {
    delete remainingTicks[currentTab];
    toggleHide(currentTab);
    setTimeout(function(){check();}, tickLengthInMillis);
    return;
  }

  remainingTicks[currentTab] -= 1;
  setTimeout(function(){check();}, tickLengthInMillis);
}
check();

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
    setTimeout(function(){toggleHide(tabId);}, startOffsetMillis);
  }
);

chrome.tabs.onSelectionChanged.addListener(
  function(tabId, selectInfo) {
    currentTab = tabId;
    updateText();
  }
);
