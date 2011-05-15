// Copyright 2011 Bruno Rahle
// 
// This file is part of Let Go Chrome Extension.
// Let Go Chrome Extension is free software: you can redistribute it
// and/or modify it under the terms of the GNU General Public License
// as published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.
//
// Let Go Chrome Extension is distributed in the hope that it will be
// useful, but WITHOUT ANY WARRANTY; without even the implied warranty
// of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU
// General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Let Go Chrome Extension.  If not, see
// <http://www.gnu.org/licenses/>.

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
