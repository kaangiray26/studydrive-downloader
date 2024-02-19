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

async function header_listener(details) {
    console.log("Request:", details);

    // Reset the values
    filename = new URL(details.originUrl).pathname.split("/").slice(-2).join("_");
    requests_data = [];
}

function listener(details) {
    let filter = browser.webRequest.filterResponseData(details.requestId);
    filter.ondata = (event) => {
        // Add array buffer to the requests_data array
        requests_data.push(event.data);
        filter.write(event.data);
    };
    filter.onstop = (event) => {
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

// Message listener
browser.runtime.onMessage.addListener((message) => {
    if (message.action === "download") {
        downloadfile();
    }
});

console.log(Date.now(), "Background script started...");