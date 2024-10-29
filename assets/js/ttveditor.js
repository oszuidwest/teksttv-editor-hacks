// Character limit settings from localized script data
const softLimitTextarea = parseInt(ttveditorData.soft_limit_textarea, 10);
const hardLimitTextarea = parseInt(ttveditorData.hard_limit_textarea, 10);
const softLimitTitle = parseInt(ttveditorData.soft_limit_title, 10);
const hardLimitTitle = parseInt(ttveditorData.hard_limit_title, 10);

const TITLE_INPUT_ID = 'title';
const TEXTAREA_ID = 'acf-field_5f21a06d22c58';

// Hack in CSS styles
function addStyles() {
    const styles = `
    /* Modal styles */
    #preview-modal {
        display: none; /* Hidden by default */
        position: fixed;
        z-index: 9999; /* Sit on top */
        left: 0;
        top: 0;
        width: 100%; /* Full width */
        height: 100%; /* Full height */
        overflow: auto;
        background-color: rgba(0,0,0,0.5); /* Black background with opacity */
    }

    #preview-modal-content {
        background-color: #fefefe;
        margin: 5% auto; /* 5% from top and centered */
        padding: 20px;
        border: 1px solid #888;
        width: fit-content;
        position: relative;
    }

    #preview-modal-close {
        color: #aaa;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 28px;
        font-weight: bold;
        cursor: pointer;
    }

    #preview-modal-close:hover,
    #preview-modal-close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    `;

    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
}

// Mimic WordPress's wpautop function TODO: Replace with real wpautop
function wpautop(text, br = true) {
    if (text.trim() === '') return '';

    text += "\n";

    const preTags = [];
    text = text.replace(/<pre[\s\S]*?<\/pre>/g, match => {
        const token = `<pre-wp-autop-${preTags.length}>`;
        preTags.push(match);
        return token;
    });

    text = text.replace(/<br\s*\/?>\s*<br\s*\/?>/g, "\n\n");

    const blockTags = '(table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

    text = text.replace(new RegExp(`(<${blockTags}[^>]*>)`, 'gi'), "\n\n$1");
    text = text.replace(new RegExp(`(</${blockTags}>)`, 'gi'), "$1\n\n");

    text = text.replace(/\r\n|\r/g, "\n");

    if (br) {
        text = text.replace(/([^\n])\n([^\n])/g, "$1<br />\n$2");
    }

    text = text.replace(/\n\n+/g, "\n\n");

    const paragraphs = text.split(/\n\s*\n/).map(paragraph => `<p>${paragraph.trim()}</p>`);
    text = paragraphs.join("\n");

    preTags.forEach((original, i) => {
        text = text.replace(`<pre-wp-autop-${i}>`, original);
    });

    text = text.replace(new RegExp(`(<br />\\s*)?(<${blockTags}[^>]*>)\\s*<br />`, 'gi'), "$2");

    return text.trim();
}

// Encode string to Base64, handling Unicode characters
function base64EncodeUnicode(str) {
    return btoa(unescape(encodeURIComponent(str)));
}

// Generate Base64 strings for each page
function generateBase64() {
    const titleInput = document.getElementById(TITLE_INPUT_ID);
    const textArea = document.getElementById(TEXTAREA_ID);

    if (titleInput && textArea) {
        const titleValue = titleInput.value;
        const textValue = textArea.value;

        const pages = textValue.split('---')
            .map(page => page.trim())
            .filter(page => page.length > 0);

        return pages.map(pageContent => {
            const data = {
                type: "text",
                body: wpautop(pageContent),
                title: titleValue,
                duration: 5000,
                image: ttveditorData.image_url
            };
            return base64EncodeUnicode(JSON.stringify(data));
        });
    } else {
        console.error('Title input or textarea not found.');
        return [];
    }
}

// Display previews in a modal with 16:9 aspect ratio
function showPreviewInDialog() {
    const base64Strings = generateBase64();
    if (base64Strings.length > 0) {
        // Create modal elements
        const modal = document.createElement('div');
        modal.id = 'preview-modal';

        const modalContent = document.createElement('div');
        modalContent.id = 'preview-modal-content';

        const closeModal = document.createElement('span');
        closeModal.id = 'preview-modal-close';
        closeModal.innerHTML = '&times;';
        closeModal.onclick = function() {
            document.body.removeChild(modal);
        };

        modalContent.appendChild(closeModal);

        const iframeWidth = 800;
        const iframeHeight = (iframeWidth / 16) * 9;

        base64Strings.forEach(base64String => {
            const previewUrl = ttveditorData.preview_url + encodeURIComponent(base64String);
            const iframe = document.createElement('iframe');
            iframe.src = previewUrl;
            iframe.width = iframeWidth;
            iframe.height = iframeHeight;
            iframe.style.border = 'none';
            iframe.style.marginBottom = '10px';
            iframe.style.display = 'block';
            iframe.style.marginLeft = 'auto';
            iframe.style.marginRight = 'auto';
            modalContent.appendChild(iframe);
        });

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // Display the modal
        modal.style.display = 'block';

        // Close the modal when clicking outside of it
        window.onclick = function(event) {
            if (event.target === modal) {
                document.body.removeChild(modal);
            }
        };
    }
}

// Check character limits and display warnings
function checkCharacterLimits() {
    const titleInput = document.getElementById(TITLE_INPUT_ID);
    const textArea = document.getElementById(TEXTAREA_ID);
    const warnings = [];
    let overHardLimit = false;

    if (textArea) {
        const pages = textArea.value.split('---');

        pages.forEach((pageText, index) => {
            const length = pageText.trim().length;
            const pageNum = index + 1;

            if (length >= softLimitTextarea && length < hardLimitTextarea) {
                warnings.push(`<li style="color: gray;">Pagina ${pageNum} nadert de limiet van ${hardLimitTextarea} tekens (${length} tekens).</li>`);
            } else if (length >= hardLimitTextarea) {
                warnings.push(`<li style="color: red;">Pagina ${pageNum} heeft de limiet van ${hardLimitTextarea} tekens overschreden! (${length} tekens).</li>`);
                overHardLimit = true;
            }
        });
    }

    if (titleInput) {
        const titleLength = titleInput.value.length;

        if (titleLength >= softLimitTitle && titleLength < hardLimitTitle) {
            warnings.push(`<li style="color: gray;">De titel nadert de limiet van ${hardLimitTitle} tekens (${titleLength} tekens).</li>`);
        } else if (titleLength >= hardLimitTitle) {
            warnings.push(`<li style="color: red;">De titel heeft de limiet van ${hardLimitTitle} tekens overschreden! (${titleLength} tekens).</li>`);
            overHardLimit = true;
        }
    }

    displayWarnings(warnings, overHardLimit);
}

// Display warnings below the textarea
function displayWarnings(warnings, overHardLimit) {
    removeWarnings();

    if (warnings.length > 0) {
        const warningHtml = `
            <ul id="character-limit-warnings" style="margin-top: 10px; list-style: none; padding-left: 0;">
                ${warnings.join('')}
            </ul>
        `;
        const textArea = document.getElementById(TEXTAREA_ID);
        if (textArea) {
            textArea.insertAdjacentHTML('afterend', warningHtml);
        }
    }

    const textArea = document.getElementById(TEXTAREA_ID);
    const titleInput = document.getElementById(TITLE_INPUT_ID);
    const bgColor = overHardLimit ? '#ffe6e6' : '';

    if (textArea) textArea.style.backgroundColor = bgColor;
    if (titleInput) titleInput.style.backgroundColor = bgColor;
}

// Remove existing warnings
function removeWarnings() {
    const warnings = document.getElementById('character-limit-warnings');
    if (warnings && warnings.parentNode) {
        warnings.parentNode.removeChild(warnings);
    }
}

// Initialize the script on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    addStyles(); // Add styles when the DOM is ready

    const titleInput = document.getElementById(TITLE_INPUT_ID);
    const textArea = document.getElementById(TEXTAREA_ID);

    if (titleInput && textArea) {
        // Create Preview button
        const previewButton = document.createElement('button');
        previewButton.textContent = 'Preview';
        previewButton.type = 'button';
        previewButton.className = 'generate-preview-button button-secondary';
        previewButton.style.marginTop = '1em';

        // Insert after the textarea
        textArea.parentNode.insertBefore(previewButton, textArea.nextSibling);

        previewButton.addEventListener('click', showPreviewInDialog);

        // Add event listeners for character limit checking
        titleInput.addEventListener('input', checkCharacterLimits);
        textArea.addEventListener('input', checkCharacterLimits);

        // Run checkCharacterLimits on page load
        checkCharacterLimits();
    } else {
        console.error('Title input or textarea not found.');
    }
});
