// background.js
// This is the background script

var filename = "";
var requests_data = [];

async function downloadfile() {
    console.log("Downloading file...");
    // Check if there are any files to download
    if (!requests_data.length) {
        console.log("No files to download");
        return;
    }

    // Create a new blob from the requests_data array
    const blob = new Blob(requests_data, { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename + ".pdf";
    a.click();
    URL.revokeObjectURL(url);
}

function header_listener(details) {
    console.log("Request:", details);

    // Reset the values
    filename = new URL(details.originUrl).pathname.split("/").slice(-2).join("_");
    requests_data = [];
}

function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    filter.ondata = (event) => {
        console.log("Request URL:", details.url);

        // Add array buffer to the requests_data array
        requests_data.push(event.data);

        // Construct a filename for the requested file
        // const filename = new URL(details.originUrl).pathname.split("/").slice(-2).join("_");

        // Download the file
        // const blob = new Blob([event.data], { type: "application/pdf" });
        // requests_data.push(blob);
        // const url = URL.createObjectURL(blob);
        // const a = document.createElement("a");

        // // Download without opening a new tab
        // a.href = url;
        // a.download = filename + ".pdf";
        // a.click();

        // URL.revokeObjectURL(url);
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

// Get request data
browser.webRequest.onBeforeRequest.addListener(
    listener,
    { urls: ["https://www.studydrive.net/file-preview/*"] },
    ["blocking"]
);

// Get response headers
browser.webRequest.onHeadersReceived.addListener(
    header_listener,
    { urls: ["https://www.studydrive.net/file-preview/*"] },
    ["responseHeaders"],
);

// Button click listener
browser.browserAction.onClicked.addListener(downloadfile);

console.log(Date.now(), "Background script started...");