const YOUTUBE_URL = 'https://www.youtube.com'
chrome.runtime.onInstalled.addListener(() => {
    const options = { isShortsBlocked: true }
    chrome.storage.sync.set({ options }).then(() => {
    });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
    processTabChange(tabId);
})

chrome.tabs.onUpdated.addListener((tabId) => {
    processTabChange(tabId);
})

chrome.storage.onChanged.addListener(async () => {
    const { id } = await getCurrentTab();
    processTabChange(id);
});

const getTabById = async (tabId) => {
    const tabs = await chrome.tabs.query({});
    const tab = tabs.find(v => v.id === tabId);
    return tab;
}

const getCurrentTab = async () => {
    const [tab] = await chrome.tabs.query({ active: true });
    return tab;
}

const removeReels = async (tab) => {
    await chrome.scripting.insertCSS({
        files: ['shorts-blocker.css'],
        target: { tabId: tab.id }
    });
}

const UndoRemoveReels = async (tab) => {
    await chrome.scripting.insertCSS({
        files: ['shorts-blocker-remover.css'],
        target: { tabId: tab.id }
    });
}

const processTabChange = async (tabId) => {
    if (!tabId) return;
    const tab = await getTabById(tabId);
    if (!tab.url.startsWith(YOUTUBE_URL)) return;
    const data = await chrome.storage.sync.get("options");
    data.options.isShortsBlocked === true ? removeReels(tab) : UndoRemoveReels(tab);
}
