importScripts("./vendor/marked.min.js");

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "convertMarkdownToHtml") {
    const htmlContent = marked.parse(request.markdown);
    sendResponse({ htmlContent });
  }
  return true;
});
