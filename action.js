
// https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Add_a_button_to_the_toolbar
document.addEventListener("click", function (e) {
    if (e.target.classList.contains("settings")) {
        runtime.openOptionsPage();
        return;
    }

    if (!e.target.classList.contains("page-choice")) {
        return;
    }

    var chosenPage = "https://" + e.target.textContent;
    browser.tabs.create({
        url: chosenPage
    });
});
