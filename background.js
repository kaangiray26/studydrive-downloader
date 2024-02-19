function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    filter.ondata = (event) => {
        console.log("Request:", details.url);

        // Construct a filename for the requested file
        const filename = new URL(details.originUrl).pathname.split("/").slice(-2).join("_");

        // Download the file
        const blob = new Blob([event.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");

        a.href = url;
        a.download = filename + ".pdf";
        a.click();

        filter.write(event.data);
    };
    filter.onstop = (event) => {
        // The extension should always call filter.close() or filter.disconnect()
        // after creating the StreamFilter, otherwise the response is kept alive forever.
        // If processing of the response data is finished, use close. If any remaining
        // response data should be processed by Firefox, use disconnect.
        filter.close();
    };
}

browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ["https://www.studydrive.net/file-preview/*"] },
    ["blocking"],
);

console.log(Date.now(), "Background script started...");