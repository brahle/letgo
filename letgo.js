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
