// Add styles
const style = document.createElement("style");
style.innerHTML = `
    #download-file {
        padding: .75rem 1rem;
        border-radius: 0.375rem;
        background-color: #0691fb;
        color: white;
        text-align: center;
        text-decoration: none;
        cursor: pointer;
    }
    #download-file:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(style);

// Create button
const el = document.createElement("div");
el.style = "display:flex; width:100%; background-color: #fff; padding-bottom: 1rem;";
el.innerHTML = `
    <div class="container">
        <button id="download-file">
            <span>😝 Download</span>
        </button>
    </div>
`;

// Append after elements second child
const selector = document.querySelector("#the-sidebar").nextElementSibling;
selector.insertBefore(el, selector.querySelectorAll(":scope > div")[1]);

// Add event listener
document.querySelector("#download-file").onclick = async () => {
    browser.runtime.sendMessage({ action: "download" });
}