
const DEFAULTS = {
    "mbt_folder": "magic_bookmark_tabs"
}

function onError(error) {
    console.log(`Options error: ${error}`)
}

function loadSettings () {
    function setSetting (name, kvp) {
        let value = kvp[name] || DEFAULTS[name]
        console.log(`Setting ${name} to`, value)
        document.querySelector("#" + name).value = value
    }

    let loaders = Object.keys(DEFAULTS).map(name =>
        // https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/API/storage/StorageArea/get
        browser.storage.sync.get(name)
            .then(kvp => setSetting(name, kvp), onError)
    )

    return Promise.all(loaders)
        .then(_ => saveSettings())
}

function saveSettings (e) {
    if (e && e.preventDefault) e.preventDefault()

    // FIXME: only update changed settings?
    let settings = Object.fromEntries(
        Object.keys(DEFAULTS).map(name =>
            [name, document.querySelector("#" + name).value]
        )
    )

    return browser.storage.sync.set(settings)
}

// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Implement_a_settings_page
document.addEventListener("DOMContentLoaded", loadSettings)
document.querySelector("form").addEventListener("submit", saveSettings)
// FIXME: reset settings button?
