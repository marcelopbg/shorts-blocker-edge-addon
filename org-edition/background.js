const YOUTUBE_URL = 'https://www.youtube.com'

chrome.tabs.onActivated.addListener(({ tabId }) => {
    processTabChange(tabId);
})

chrome.tabs.onUpdated.addListener((tabId) => {
    processTabChange(tabId);
})

const getTabById = async (tabId) => {
    const tabs = await chrome.tabs.query({});
    const tab = tabs.find(v => v.id === tabId);
    return tab;
}

const removeReels = async (tab) => {
    await chrome.scripting.insertCSS({
        files: ['shorts-blocker.css'],
        target: { tabId: tab.id }
    });
}

const processTabChange = async (tabId) => {
    if (!tabId) return;
    const tab = await getTabById(tabId);
    if (!tab.url.startsWith(YOUTUBE_URL)) return;
    removeReels(tab);
}
