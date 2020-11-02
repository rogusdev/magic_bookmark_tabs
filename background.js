
function openPage () {
    browser.tabs.create({
        url: "https://developer.mozilla.org"
    })
    browser.runtime.openOptionsPage()
}

browser.browserAction.onClicked.addListener(openPage)


// filled from options/preferences/settings page in about:addons
let settings = {}

// state tracks aspects of tabs/etc
let state = {
    root: null,  // the root folder where all the magic happens
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/onChanged
function updateSettings (changes, area) {
    for (let name in changes) {
        settings[name] = changes[name].newValue
    }

    console.log("background settings", settings)

    setMbtFolder().then(_ => console.log("state", state))
}

browser.storage.onChanged.addListener(updateSettings)


// sessions are window ids to bookmark folders (sessions)
let sessions = {}


// updateIcon from https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Bookmarks_API
function updateActionIcon () {
    // FIXME: window state should be arguments to this method, to set it for all windows
    let isWindowSessioned = true
    let windowId = browser.windows.WINDOW_ID_CURRENT

    browser.browserAction.setIcon({
        path: isWindowSessioned ? {
            "16": "icons/magic_bookmark_tabs-on-16.png",
            "32": "icons/magic_bookmark_tabs-on-32.png",
            "48": "icons/magic_bookmark_tabs-on-48.png"
        } : {
            "16": "icons/magic_bookmark_tabs-off-16.png",
            "32": "icons/magic_bookmark_tabs-off-32.png",
            "48": "icons/magic_bookmark_tabs-off-48.png"
          },
        windowId: windowId
      })

      const title = "Magic Bookmark Tabs! - "
      browser.browserAction.setTitle({
        title: title + (isWindowSessioned ? "ON" : "OFF"),
        windowId: windowId
      })
}


// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/create
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/bookmarks/CreateDetails
function setMbtFolder () {
    return browser.bookmarks.search({
        "title": settings["mbt_folder"]
    }).then(nodes => {
        let p = null;
        if (nodes.length > 0) {
            p = Promise.resolve(nodes[0])
        } else {
            console.log("Creating MBT folder:", settings["mbt_folder"])
            p = browser.bookmarks.create({
                title: settings["mbt_folder"]
            })
        }

        return p.then(node =>
            browser.bookmarks.getSubTree(node.id)
                .then(tree => state.root = tree[0])
        )
    }).catch(err =>
        console.log("Error finding MBT folder!", err)
    )
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Work_with_the_Bookmarks_API
function updateMagicBookmarkTabs () {
    // FIXME: populate session for each window that has one selected
}


// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_the_Tabs_API
function listTabsAndWindows () {
    browser.tabs.query({currentWindow: true}).then(tabs => {
        console.log("tabs", tabs)
    })

    // FIXME: find out if current window is tracking its session with MBT, if so, update accordingly
    // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/windows
    //browser.windows.WINDOW_ID_CURRENT
}

document.addEventListener("DOMContentLoaded", listTabsAndWindows)

// FIXME: add listener to all tab creation deletion events which logs
// FIXME: add listener to all tab url changes which logs
