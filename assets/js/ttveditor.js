(function(){
    // Character limit settings from localized script data
    var softLimitTextarea = parseInt(ttveditorData.soft_limit_textarea, 10);
    var hardLimitTextarea = parseInt(ttveditorData.hard_limit_textarea, 10);

    var softLimitTitle = parseInt(ttveditorData.soft_limit_title, 10);
    var hardLimitTitle = parseInt(ttveditorData.hard_limit_title, 10);
	
	function wpautop(text, br = true) {
	    if (text.trim() === '') return '';

	    // Pad the end of the text to simplify processing
	    text += "\n";

	    // Preserve <pre> tags and their contents
	    let preTags = [];
	    text = text.replace(/<pre[\s\S]*?<\/pre>/g, match => {
	        let token = `<pre-wp-autop-${preTags.length}>`;
	        preTags.push(match);
	        return token;
	    });

	    // Replace multiple <br>'s with two line breaks
	    text = text.replace(/<br\s*\/?>\s*<br\s*\/?>/g, "\n\n");

	    // Block-level elements that require double line breaks around them
	    const blockTags = '(table|thead|tfoot|caption|col|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|form|map|area|blockquote|address|style|p|h[1-6]|hr|fieldset|legend|section|article|aside|hgroup|header|footer|nav|figure|figcaption|details|menu|summary)';

	    // Add a double line break before and after block-level elements
	    const doubleBreakRegex = new RegExp(`(<${blockTags}[^>]*>)`, 'gi');
	    text = text.replace(doubleBreakRegex, "\n\n$1");
	    const doubleBreakCloseRegex = new RegExp(`(</${blockTags}>)`, 'gi');
	    text = text.replace(doubleBreakCloseRegex, "$1\n\n");

	    // Standardize newline characters
	    text = text.replace(/\r\n|\r/g, "\n");

	    // Convert single line breaks to <br> tags
	    if (br) {
	        text = text.replace(/([^\n])\n([^\n])/g, "$1<br />\n$2");
	    }

	    // Remove more than two consecutive line breaks
	    text = text.replace(/\n\n+/g, "\n\n");

	    // Split the text into paragraphs by double line breaks
	    let paragraphs = text.split(/\n\s*\n/).map(paragraph => `<p>${paragraph.trim()}</p>`);

	    // Join paragraphs with newline after each </p>
	    text = paragraphs.join("\n");

	    // Restore <pre> tags
	    preTags.forEach((original, i) => {
	        text = text.replace(`<pre-wp-autop-${i}>`, original);
	    });

	    // Remove any <br> tags that are next to block elements
	    const cleanupRegex = new RegExp(`(<br />\\s*)?(<${blockTags}[^>]*>)\\s*<br />`, 'gi');
	    text = text.replace(cleanupRegex, "$2");

	    return text.trim();
	}

    function base64EncodeUnicode(str) {
        return btoa(unescape(encodeURIComponent(str)));
    }

    function generateBase64() {
        var titleInput = document.getElementById('title');
        var textArea = document.getElementById('acf-field_5f21a06d22c58');

        if (titleInput && textArea) {
            var titleValue = titleInput.value;
            var textValue = textArea.value;

            // Split the text by '---' to handle multiple pages
            var pages = textValue.split('---').map(function(page) {
                return page.trim();
            }).filter(function(page) {
                return page.length > 0;
            });

            var base64Strings = [];

            pages.forEach(function(pageContent) {
                var data = {
                    "type": "text",
                    "body": wpautop(pageContent),
                    "title": titleValue,
                    "duration": 5000,
                    "image": ttveditorData.image_url
                };

                var jsonString = JSON.stringify(data);
                var base64String = base64EncodeUnicode(jsonString);

                base64Strings.push(base64String);
            });

            return base64Strings;
        } else {
            console.error('Title input or textarea not found.');
            return [];
        }
    }

    function generateAndLogBase64() {
        var base64Strings = generateBase64();
        if (base64Strings.length > 0) {
            base64Strings.forEach(function(base64String) {
                console.log(base64String);
            });
        }
    }

    // Character limit checker
    function checkCharacterLimits() {
        var titleInput = document.getElementById('title');
        var textArea = document.getElementById('acf-field_5f21a06d22c58');
        var warnings = [];
        var overHardLimit = false;

        // Check textarea
        if (textArea) {
            var text = textArea.value;
            var pages = text.split('---');

            pages.forEach(function(pageText, index) {
                var pageNum = index + 1;
                var length = pageText.trim().length;

                if (length >= softLimitTextarea && length < hardLimitTextarea) {
                    // Soft limit warning in gray
                    warnings.push('<li style="color: gray;">Pagina ' + pageNum + ' nadert de limiet van ' + hardLimitTextarea + ' tekens (' + length + ' tekens).</li>');
                } 
                if (length >= hardLimitTextarea) {
                    // Hard limit warning in red
                    warnings.push('<li style="color: red;">Pagina ' + pageNum + ' heeft de limiet van ' + hardLimitTextarea + ' tekens overschreden! (' + length + ' tekens).</li>');
                    overHardLimit = true;
                }
            });
        }

        // Check title
        if (titleInput) {
            var titleLength = titleInput.value.length;

            if (titleLength >= softLimitTitle && titleLength < hardLimitTitle) {
                // Soft limit warning in gray
                warnings.push('<li style="color: gray;">De titel nadert de limiet van ' + hardLimitTitle + ' tekens (' + titleLength + ' tekens).</li>');
            }
            if (titleLength >= hardLimitTitle) {
                // Hard limit warning in red
                warnings.push('<li style="color: red;">De titel heeft de limiet van ' + hardLimitTitle + ' tekens overschreden! (' + titleLength + ' tekens).</li>');
                overHardLimit = true;
            }
        }

        displayWarnings(warnings, overHardLimit);
    }

    function displayWarnings(warnings, overHardLimit) {
        removeWarnings();

        if (warnings.length > 0) {
            var warningHtml = '<ul id="character-limit-warnings" style="margin-top: 10px; list-style: none; padding-left: 0;">';
            warnings.forEach(function(warning){
                warningHtml += warning;
            });
            warningHtml += '</ul>';
            
            // Insert warnings under the textarea
            var textArea = document.getElementById('acf-field_5f21a06d22c58');
            if (textArea) {
                textArea.insertAdjacentHTML('afterend', warningHtml);
            }
        }

        // Highlight inputs if over hard limit
        var textArea = document.getElementById('acf-field_5f21a06d22c58');
        var titleInput = document.getElementById('title');

        if (overHardLimit) {
            if (textArea) {
                textArea.style.backgroundColor = '#ffe6e6'; // Light red
            }
            if (titleInput) {
                titleInput.style.backgroundColor = '#ffe6e6'; // Light red
            }
        } else {
            if (textArea) {
                textArea.style.backgroundColor = '';
            }
            if (titleInput) {
                titleInput.style.backgroundColor = '';
            }
        }
    }

    function removeWarnings() {
        var warnings = document.getElementById('character-limit-warnings');
        if (warnings) {
            warnings.parentNode.removeChild(warnings);
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        var titleInput = document.getElementById('title');
        var textArea = document.getElementById('acf-field_5f21a06d22c58');

        if (titleInput && textArea) {
            titleInput.addEventListener('input', function() {
                generateAndLogBase64();
                checkCharacterLimits();
            });
            textArea.addEventListener('input', function() {
                generateAndLogBase64();
                checkCharacterLimits();
            });

            // Initial checks on page load
            generateAndLogBase64();
            checkCharacterLimits();

            // Insert the Preview button under the textarea
            var previewButton = document.createElement('button');
            previewButton.textContent = 'Preview';
            previewButton.type = 'button';
            previewButton.className = 'generate-preview-button button-secondary';
            previewButton.style.marginTop = '1em';

            // Append the button after the textarea
            textArea.parentNode.appendChild(previewButton);

            previewButton.addEventListener('click', function() {
                var base64Strings = generateBase64();
                if (base64Strings.length > 0) {
                    base64Strings.forEach(function(base64String) {
                        var previewUrl = ttveditorData.preview_url + encodeURIComponent(base64String);
                        window.open(previewUrl, '_blank');
                    });
                }
            });
        } else {
            console.error('Title input or textarea not found.');
        }
    });
})();
