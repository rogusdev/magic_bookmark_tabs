
function openPage() {
    browser.tabs.create({
        url: "https://developer.mozilla.org"
    });
}

browser.browserAction.onClicked.addListener(openPage);


// filled from options/preferences/settings page in about:addons
let settings = {}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/onChanged
function updateSettings(changes, area) {
    for (let name in changes) {
        settings[name] = changes[name].newValue
    }

    console.log("background settings", settings);
}

browser.storage.onChanged.addListener(updateSettings);
