const options = {};
const optionsForm = document.getElementById("optionsForm");

optionsForm.isShortsBlocked.addEventListener("change", (event) => {
    options.isShortsBlocked = event.target.checked;
    chrome.storage.sync.set({ options });
});

chrome.storage.sync.get("options").then(data => {
    Object.assign(options, data.options);
    optionsForm.isShortsBlocked.checked = Boolean(options.isShortsBlocked);
})