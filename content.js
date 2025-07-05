function getProblemInfo() {
    const titleDiv = document.querySelector('.text-title-large');
    const titleAnchor = titleDiv?.querySelector('a');
    const titleText = titleAnchor?.innerText || null;
    //Get the Problem Description
    const descriptionDiv = document.querySelector('.elfjS');
    const descriptionText = descriptionDiv?.textContent || "Not available";

    //Get the Code written by the User
    const codeContainer = document.querySelector('.monaco-mouse-cursor-text');
    const code = codeContainer?.textContent || "Not available";
    return {title: titleText, description: descriptionText, code: code};
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "getProblemInfo") {
        const {title, description, code} = getProblemInfo();
        sendResponse({ text: title, description: description, code: code});
       return ;
    }
});