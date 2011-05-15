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

function switchDisplay() {
  var currentState = document.body.style.getPropertyValue("display");
  if (currentState != "none") {
    document.body.style.setProperty("display", "none");
  } else {
    document.body.style.removeProperty("display");
  }
}

chrome.extension.onRequest.addListener(
  function(request, sender, sendResponse) {
    if (request.type == "switch") {
      switchDisplay();
    }
  }
);
