//DO NOT ALTER ANYTHING IN HERE!
export default function (Alpine) {
    function colorPickerModule(editorData) {
        return {
            open: false,               // Color picker visibility
            currentColor: '#000000',  // Initial color
            colorElement: null,        // Element the picker is associated with
            colorAction: null,         // Action: 'text' or 'background' (for text color or background color)
            palettes: {
                red: [
                    '#fef2f2',
                    '#fee2e2',
                    '#fecaca',
                    '#fca5a5',
                    '#f87171',
                    '#ef4444',
                    '#dc2626',
                    '#b91c1c',
                    '#991b1b',
                    '#7f1d1d',
                    '#6b1e1e',
                ],
                blue: [
                    '#e9eeff',
                    '#d6e0ff',
                    '#b6c5ff',
                    '#8a9dff',
                    '#5c66ff',
                    '#3a36ff',
                    '#2d14ff',
                    '#2307f2',
                    '#1f0cc7',
                    '#1f149b',
                    '#140c5a',
                ],
                info: [
                    '#f0f8fe',
                    '#ddeffc',
                    '#c3e4fa',
                    '#9bd3f5',
                    '#6bbaef',
                    '#489ee9',
                    '#3382dd',
                    '#2a6dcb',
                    '#2858a5',
                    '#264c82',
                    '#223b63',
                ],
                purple: [
                    '#f3f2fb',
                    '#eae8f7',
                    '#d7d5f0',
                    '#c0bbe6',
                    '#ada0d9',
                    '#9c88cc',
                    '#8b6fbc',
                    '#795ea4',
                    '#624e85',
                    '#51436b',
                    '#31273f',
                ],
                aqua: [
                    '#ebfef6',
                    '#cffce8',
                    '#a3f7d5',
                    '#48eab4',
                    '#2bdca6',
                    '#07c290',
                    '#009e76',
                    '#007e62',
                    '#01644e',
                    '#025242',
                    '#002e26',
                ],
                green: [
                    '#f5f8f5',
                    '#e7f1e7',
                    '#d0e2d0',
                    '#abcaac',
                    '#7eaa80',
                    '#5b8c5d',
                    '#436b45',
                    '#3a5b3b',
                    '#324934',
                    '#2a3d2c',
                    '#132014',
                ],
                yellow: [
                    '#fefbec',
                    '#fbf3ca',
                    '#f6e691',
                    '#f1d358',
                    '#efc643',
                    '#e6a21a',
                    '#cc7e13',
                    '#a95a14',
                    '#8a4716',
                    '#713b16',
                    '#411d07',
                ],
                'orange': [
                    '#fff7ed',
                    '#feedd6',
                    '#fcd6ac',
                    '#fab977',
                    '#f79b53',
                    '#f3721c',
                    '#e45812',
                    '#bd4111',
                    '#973515',
                    '#792d15',
                    '#411409',
                ],
                rose: [
                    '#fff2f1',
                    '#ffe4e1',
                    '#ffccc7',
                    '#ffa9a0',
                    '#ff8f83',
                    '#f84d3b',
                    '#e5301d',
                    '#c12514',
                    '#a02214',
                    '#842218',
                    '#480d07',
                ],
                pink: [
                    '#fff1f5',
                    '#ffe4eb',
                    '#fdcedc',
                    '#fb8cb0',
                    '#f973a1',
                    '#f24184',
                    '#df1f70',
                    '#bc145f',
                    '#9d1455',
                    '#87144f',
                    '#4b0627',
                ],
                gray: [
                    '#f6f6f7',
                    '#eeeff1',
                    '#e0e2e5',
                    '#cccfd5',
                    '#b6bac3',
                    '#acaeb9',
                    '#8d8e9e',
                    '#7a7b88',
                    '#64656f',
                    '#53535c',
                    '#313235',
                ],
                neutral: [
                    '#ffffff',
                    '#efefef',
                    '#dcdcdc',
                    '#bdbdbd',
                    '#989898',
                    '#7c7c7c',
                    '#656565',
                    '#525252',
                    '#464646',
                    '#3d3d3d',
                    '#000000',
                ],
            },

            openColorPicker(el, action) {
                if (document.getElementById('color-picker')) {
                    return;
                }

                // When a button is clicked, open the color picker
                this.colorElement = el;
                this.colorAction = action;
                this.currentColor = window.getComputedStyle(el).backgroundColor || this.currentColor;
                let ref = '$refs.text_picker';
                if (action !== 'text') {
                    ref = '$refs.bg_picker';
                }

                let pickerPopup = document.createElement('div');
                pickerPopup.id = 'color-picker';
                pickerPopup.className = 'min-w-max p-4 bg-white rounded-md border border-gray-200/50 dark:bg-black/90 border shadow-md z-10';
                pickerPopup.setAttribute('x-on:click.outside', "if (!$event.target.closest('button')) { $el.remove() }");
                pickerPopup.setAttribute('x-anchor', ref);

                pickerPopup.innerHTML = `
                    <div class="flex items-center space-x-2">
                        <input
                            type="color"
                            x-model="colorPicker.currentColor"
                            class="rounded-md w-1/2"
                        />
                        <span class="font-medium text-gray-500 text-sm"">Pick Color</span>
                    </div>

                    <div class="grid grid-cols-12 gap-0.5 mt-2">
                        <template x-for="(palette, key) in colorPicker.palettes" :key="key">
                            <div class="flex flex-col space-y-0.5">
                                <template x-for="color in palette" :key="color">
                                    <button
                                        type="button"
                                        class="h-5 w-5 border border-gray-200 rounded-sm hover:cursor-pointer"
                                        :style="{ backgroundColor: color }"
                                        @click="colorPicker.currentColor = color"
                                    ></button>
                                </template>
                            </div>
                        </template>
                    </div>

                    <!-- Add Button -->
                    <button type="button" class="mt-3 px-3 py-1 rounded-sm bg-blue-500 text-xs text-white hover:cursor-pointer hover:opacity-80" @click="colorPicker.changeColor(), document.getElementById('color-picker').remove()">
                        Apply Color
                    </button>

                    <button type="button" class="mt-3 px-3 py-1 rounded-sm bg-gray-300 text-xs text-black hover:cursor-pointer hover:opacity-80" @click="document.getElementById('color-picker').remove()">
                        Cancel
                    </button>
                `;
                el.after(pickerPopup);

                // Attach event listener AFTER inserting popup into DOM
                // document.getElementById('insert-link-btn').addEventListener('click', this.insertOrUpdateLink.bind(this));

                this.open = true;
            },

            closeColorPicker() {
                // Close the color picker when clicking outside
                this.open = false;
                this.colorElement = null;
                this.colorAction = null;
            },

            changeColor() {
                // Change the color based on the selected action (text or background)
                if (this.colorAction === 'text') {
                    this.changeTextColor();
                } else if (this.colorAction === 'background') {
                    this.changeBgColor();
                }

                editorData.save();
            },

            changeTextColor() {
                // Apply the text color to the selected range
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);  // Get the selected range
                const selectedNode = range.cloneContents(); // Clone selected contents

                // Create a span element to wrap the selected text and change its color
                const span = document.createElement('span');
                span.style.color = this.currentColor;  // Apply the selected color to text

                // Append the selected text into the span
                span.appendChild(selectedNode);

                // Delete the original contents and insert the new span with the updated text color
                range.deleteContents();
                range.insertNode(span);

                // Reset the cursor position after text modification
                const cursorPosition = range.endContainer;
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.setStart(cursorPosition, 0);
                newRange.setEnd(cursorPosition, 0);
                selection.addRange(newRange);
            },

            changeBgColor() {
                // Apply background color to the selected range
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);  // Get the selected range
                const selectedNode = range.cloneContents(); // Clone selected contents

                // Create a span element to wrap the selected text and change its background color
                const span = document.createElement('span');
                span.style.backgroundColor = this.currentColor;  // Apply the selected background color

                // Append the selected text into the span
                span.appendChild(selectedNode);

                // Delete the original contents and insert the new span with the updated background color
                range.deleteContents();
                range.insertNode(span);

                // Reset the cursor position after background color change
                const cursorPosition = range.endContainer;
                selection.removeAllRanges();
                const newRange = document.createRange();
                newRange.setStart(cursorPosition, 0);
                newRange.setEnd(cursorPosition, 0);
                selection.addRange(newRange);
            }
        };
    }

    function imageModule(editorData) {
        return {
            // Core state
            lastSelection: null,
            showModal: false,
            src: '',
            alt: '',
            originalWidth: 200,
            originalHeight: 0,
            aspectRatio: 1,
            width: 200,
            height: '',
            opacity: 1,
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 0,
            float: "none",
            selectedImage: null,
            constraint: true,
            range: 1,

            setRange(x) {
                this.range = x;
            },

            init() {
                if (!this.lastSelection) {
                    this.storeSelection();
                }

                if (!this.src) return;

                // Only calculate if width or height is missing
                if (this.width && !this.height) {
                    const img = new Image();
                    img.onload = () => this.calculateDimensions(img);
                    img.src = this.src;
                }
            },

            storeSelection() {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) this.lastSelection = selection.getRangeAt(0);
            },

            closeModal() {
                this.reset();
                this.showModal = false;
            },

            //reset image modal
            reset() {
                this.src = '';
                this.alt = '';
                this.originalWidth = 200;
                this.originalHeight = 0;
                this.aspectRatio = 1;
                this.width = 200;
                this.height = '';
                this.opacity = 1;
                this.borderWidth = 0;
                this.borderColor = '#000';
                this.borderRadius = 0;
                this.float = 'none';
                this.selectedImage = null;
                this.constraint = true;
                this.range = 1;
                this.lastSelection = null;
                this.showModal = false;
            },

            calculateDimensions(img) {
                // Store original dimensions & aspect ratio if not set
                if (!this.originalWidth || !this.originalHeight) {
                    this.originalWidth = img.naturalWidth;
                    this.originalHeight = img.naturalHeight;
                    this.aspectRatio = img.naturalWidth / img.naturalHeight;
                }

                // Set width if not already set
                if (!this.width) {
                    this.width = this.originalWidth;
                }

                // Set height based on width & aspect ratio if not already set
                if (!this.height) {
                    this.height = Math.round(this.width / this.aspectRatio);
                }
            },

            changeConstraint() {
                this.constraint = !this.constraint;

                if (this.constraint && this.width && this.height) {
                    this.aspectRatio = this.width / this.height;
                }
            },

            changeImageDimensions(type, value) {
                value = parseInt(value);

                if (type === 'w') {
                    this.width = value;
                    if (this.constraint) {
                        this.height = Math.round(this.width / this.aspectRatio);
                    }
                } else if (type === 'h') {
                    this.height = value;
                    if (this.constraint) {
                        this.width = Math.round(this.height * this.aspectRatio);
                    }
                }
            },

            setBorderColor(value) {
                this.borderColor = value;
            },

            // --- Insert / Update Image ---
            insertImage() {
                if (!this.lastSelection && !this.selectedImage) return;

                const img = this.selectedImage || document.createElement('img');

                img.src = this.src;
                img.alt = this.alt;
                img.style.width = this.width + 'px';
                img.style.height = this.height + 'px';
                img.style.float = this.float;

                if (this.borderWidth) img.style.border = `${this.borderWidth}px solid ${this.borderColor}`;
                if (this.borderRadius) img.style.borderRadius = this.borderRadius + 'px';
                if (this.opacity) img.style.opacity = this.opacity;

                img.style.display = "inline-block";

                if (!this.selectedImage) {
                    this.lastSelection.insertNode(img);
                    this.lastSelection = null;
                }

                editorData.save();
                this.closeModal();
            },

            insertFile(url) {
                if (!this.lastSelection) return;
                let input = prompt("Enter a title for the link:", "") || url;

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = input;
                link.style.cssText = "color: #007bff; text-decoration: underline; font-weight: bold; transition: color 0.2s ease-in-out;";

                this.lastSelection.insertNode(link);
                this.lastSelection = null;

                editorData.save();
                this.closeModal();
            },

            updateImageSrc(value) {
                if (this.selectedImage) {
                    this.selectedImage.src = value;
                    editorData.save();
                }
            },

            updateAltText(value) {
                if (this.selectedImage) {
                    this.selectedImage.alt = value;
                    editorData.save();
                }
            },

            // --- Selection & Modal ---
            selectImage(image) {
                this.selectedImage = image;
                this.src = image.src;
                this.alt = image.alt;

                // Float & border styles
                this.float = getComputedStyle(image).float;
                this.borderWidth = parseFloat(getComputedStyle(image).borderWidth);
                this.borderColor = getComputedStyle(image).borderColor;
                this.borderRadius = parseFloat(getComputedStyle(image).borderRadius);
                this.opacity = parseFloat(getComputedStyle(image).opacity);

                // Use the image's natural dimensions to calculate aspect ratio
                if (!this.originalWidth || !this.originalHeight) {
                    this.originalWidth = image.naturalWidth || image.width;
                    this.originalHeight = image.naturalHeight || image.height;
                    this.aspectRatio = this.originalWidth / this.originalHeight;
                }

                // Preserve existing width if set, otherwise use original
                this.width = image.width || this.width || this.originalWidth;

                // Calculate height according to width & aspect ratio
                this.height = image.height || this.height || Math.round(this.width / this.aspectRatio);

                let currentAspectRatio = this.width / this.height;

                // Use a small tolerance to account for floating point differences
                const tolerance = 0.01;

                if (Math.abs(this.aspectRatio - currentAspectRatio) > tolerance) {
                    this.constraint = false;
                } else {
                    this.constraint = true;
                }

                this.showModal = true;
            },

            deselectImage() {
                this.selectedImage = null;
                this.reset();
            },

            remove() {
                this.selectedImage.remove();
                this.closeModal();
            },

            handleClick(event) {
                if (event.target.tagName === 'IMG') this.selectImage(event.target);
                else this.deselectImage();
            },

            alignImage(position) {
                if (!this.selectedImage) return;
                this.selectedImage.style.display = 'inline';
                this.selectedImage.style.margin = position === 'center' ? '0 auto' : '0';
                this.selectedImage.style.float = position === 'left' ? 'left' : position === 'right' ? 'right' : 'none';
                editorData.save();
            },

            handleDragStart(event) {
                if (event.target.tagName !== 'IMG') return;
                event.target.classList.add('opacity-50', 'scale-75', 'cursor-grabbing');
            },

            handleDragEnd(event) {
                if (event.target.tagName !== 'IMG') return;
                event.target.classList.remove('opacity-50', 'scale-75', 'cursor-grabbing');
            },

            isValidImageUrl(url) {
                return /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|webp))/i.test(url);
            },
        };
    }

    function textActionsModule(editorData) {
        return {
            formatSelection(type, fontSize = null) {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;

                const range = selection.getRangeAt(0);

                // Clone the selected contents (this preserves HTML structure)
                const selectedHTML = range.cloneContents();

                // Temporary div to hold the HTML for manipulation
                const tempDiv = document.createElement('div');
                tempDiv.appendChild(selectedHTML);

                // Function to apply the selected transformation
                const transformText = (text, type) => {
                    if (type === 'uppercase') {
                        return text.toUpperCase();
                    } else if (type === 'lowercase') {
                        return text.toLowerCase();
                    } else if (type === 'titlecase') {
                        return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
                    }
                    return text; // Default to no transformation
                };

                // Safe helper function to update the text of a node
                const updateTextNode = (node, type) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        // Safely transform the text content
                        node.textContent = transformText(node.textContent, type);
                    }
                };

                // Traverse nodes and update text, keeping HTML structure intact
                const traverseNodes = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        updateTextNode(node, type);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        // If it's an element, traverse all its child nodes
                        Array.from(node.childNodes).forEach(traverseNodes);
                    }
                };

                // Apply transformations to the selected HTML content
                traverseNodes(tempDiv);

                // Now, construct the final tag to wrap the modified content
                let modifiedText = tempDiv.innerHTML;
                let tag;

                // Apply additional formatting (e.g., heading, paragraph) if needed
                if (type === 'heading' && fontSize) {
                    tag = `<h${fontSize} style="font-size: ${6 / fontSize}rem; font-weight: bold; margin-top: 1rem; margin-bottom: 0.5rem;">${modifiedText}</h${fontSize}>`;
                } else if (type === 'paragraph') {
                    tag = `<p style="font-size: 1rem; line-height: 1.6; margin-top: 0.5rem; margin-bottom: 1rem;">${modifiedText}</p>`;
                } else if (type === 'superscript') {
                    tag = `<sup style="font-size: 0.8rem;">${modifiedText}</sup>`;
                } else if (type === 'subscript') {
                    tag = `<sub style="font-size: 0.8rem;">${modifiedText}</sub>`;
                } else if (type === 'code') {
                    tag = `<code style="background: #f4f4f4; padding: 2px 4px; border-radius: 4px; font-family: monospace; font-size: 1rem;">${modifiedText}</code>`;
                } else if (type === 'fontSize' && fontSize) {
                    tag = `<span style="font-size: ${fontSize}px;">${modifiedText}</span>`;
                } else {
                    // Wrap the modified text in a span by default
                    tag = `<span>${modifiedText}</span>`;
                }

                // Replace the original range with the newly formatted content
                const formattedElement = document.createElement('span');
                formattedElement.innerHTML = tag;

                // Delete original content and insert formatted content
                range.deleteContents();
                range.insertNode(formattedElement);

                // Optional: Reposition the cursor to the end of the inserted content (if needed)
                const selectionEnd = range.endContainer;
                const range2 = document.createRange();
                range2.setStart(selectionEnd, selectionEnd.length);
                range2.setEnd(selectionEnd, selectionEnd.length);
                selection.removeAllRanges();
                selection.addRange(range2);

                editorData.save();
            },

            changeIndent(increase = true) {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;

                const range = selection.getRangeAt(0);
                let container = range.startContainer;

                if (container.nodeType === Node.TEXT_NODE) {
                    container = container.parentElement;
                }

                // Find nearest block element
                let block = container;
                while (
                    block &&
                    !['P', 'DIV', 'LI', 'BLOCKQUOTE', 'PRE'].includes(block.tagName) &&
                    !(block.tagName.startsWith('H') && block.tagName.length === 2)
                    ) {
                    block = block.parentElement;
                }

                if (!block) return;

                // Save current caret position safely
                const anchorNode = selection.anchorNode;
                const anchorOffset = selection.anchorOffset;

                // Perform non margin indent if contenteditable
                if (block.getAttribute('contenteditable')) {
                    const originalRange = range.cloneRange();  // Save original caret position

                    // Move range to the beginning of the block
                    const startOfBlock = block.firstChild || block;  // First child or block itself if empty

                    // Create a new range at the start of the block
                    const startRange = document.createRange();
                    if (startOfBlock.nodeType === Node.TEXT_NODE) {
                        startRange.setStart(startOfBlock, 0);
                    } else {
                        // If firstChild is element node, put start before it
                        startRange.setStartBefore(startOfBlock);
                    }
                    startRange.collapse(true);

                    // Create text node with 4 non-breaking spaces
                    const nbspTextNode = document.createTextNode('\u00A0\u00A0\u00A0\u00A0');

                    // Insert nbspTextNode at the start of the block
                    startRange.insertNode(nbspTextNode);

                    // Now restore caret to original position
                    selection.removeAllRanges();
                    selection.addRange(originalRange);

                    return;  // Exit the function
                }

                const computedStyle = window.getComputedStyle(block);
                const currentMargin = parseInt(computedStyle.marginLeft) || 0;
                const delta = increase ? 20 : -20;
                const newMargin = Math.max(0, currentMargin + delta);

                block.style.marginLeft = `${newMargin}px`;

                // Restore caret position
                if (anchorNode && document.body.contains(anchorNode)) {
                    try {
                        const newRange = document.createRange();
                        const offset = Math.min(anchorOffset, anchorNode.length || 0);

                        newRange.setStart(anchorNode, offset);
                        newRange.collapse(true);

                        selection.removeAllRanges();
                        selection.addRange(newRange);
                    } catch (err) {
                        console.warn('Unable to restore selection:', err);
                    }
                }
            },

            toggleBold() {
                document.execCommand('bold');
                this.isBold = !this.isBold;
            },

            toggleItalic() {
                document.execCommand('italic');
                this.isItalic = !this.isItalic;
            },

            toggleUnderline() {
                document.execCommand('underline');
                this.isUnderline = !this.isUnderline;
            },

            toggleStrikethrough() {
                document.execCommand('strikethrough');
                this.isStrikethrough = !this.isStrikethrough;
            },

            insertTable() {
                const tableHTML = `
                    <table class="table-auto w-full border-collapse">
                        <thead>
                            <tr>
                                <th class="border px-2 py-1">Header 1</th>
                                <th class="border px-2 py-1">Header 2</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="border px-2 py-1">Row 1, Cell 1</td>
                                <td class="border px-2 py-1">Row 1, Cell 2</td>
                            </tr>
                            <tr>
                                <td class="border px-2 py-1">Row 2, Cell 1</td>
                                <td class="border px-2 py-1">Row 2, Cell 2</td>
                            </tr>
                        </tbody>
                    </table>
                `;
                document.execCommand('insertHTML', false, tableHTML);

                editorData.save();
            },

            alignLeft() {
                document.execCommand('justifyLeft');
            },

            alignCenter() {
                document.execCommand('justifyCenter');
            },

            alignRight() {
                document.execCommand('justifyRight');
            },

            toggleList(type = 'ol', styleType = 'decimal') {
                const selection = window.getSelection();
                if (!selection.rangeCount) return;

                const range = selection.getRangeAt(0);
                let selectedNode = range.commonAncestorContainer;

                // Ensure we target the actual element (not a text node)
                while (selectedNode.nodeType === Node.TEXT_NODE) {
                    selectedNode = selectedNode.parentNode;
                }

                // Check if inside an existing list
                const listAncestor = selectedNode.closest('ul, ol');
                if (listAncestor) {
                    this.toggleListType(listAncestor, type, styleType);
                } else {
                    this.wrapInList(type, styleType, range);
                }

                editorData.save?.(); // Optional chaining in case `save()` is undefined
            },

            toggleListType(listNode, type = 'ol', styleType = 'decimal') {
                if (!['ul', 'ol'].includes(type)) return;

                const newList = document.createElement(type);
                newList.style.listStyleType = styleType;
                newList.style.listStylePosition = 'inside';

                while (listNode.firstChild) {
                    newList.appendChild(listNode.firstChild);
                }

                listNode.replaceWith(newList);
            },

            wrapInList(type = 'ol', styleType = 'decimal', range) {
                const list = document.createElement(type);
                list.style.listStyleType = styleType;
                list.style.listStylePosition = 'inside';

                // Get block-level element around the caret
                let container = range.startContainer;
                if (container.nodeType === Node.TEXT_NODE) {
                    container = container.parentElement;
                }

                let block = container;
                while (
                    block &&
                    !['P', 'DIV', 'LI', 'BLOCKQUOTE', 'PRE'].includes(block.tagName) &&
                    !(block.tagName.startsWith('H') && block.tagName.length === 2)
                    ) {
                    block = block.parentElement;
                }

                if (!block || !block.parentNode) return;

                // Create <li> and move content into it
                const listItem = document.createElement('li');
                listItem.innerHTML = block.innerHTML;

                list.appendChild(listItem);

                const selection = window.getSelection();
                if (block.isContentEditable) {
                    if (selection.rangeCount > 0) {
                        let range = selection.getRangeAt(0);
                        let startContainer = range.startContainer;
                        let startOffset = range.startOffset;

                        // If the cursor is in a text node (common case)
                        if (startContainer.nodeType === Node.TEXT_NODE) {
                            let textNode = startContainer;
                            let textContent = textNode.textContent;

                            // Find the word boundaries (you can adjust this regex to handle word boundaries better)
                            let wordStart = textContent.lastIndexOf(" ", startOffset) + 1; // Find the start of the word
                            let wordEnd = textContent.indexOf(" ", startOffset); // Find the end of the word

                            if (wordEnd === -1) {
                                wordEnd = textContent.length; // If there's no space after the word, select till the end of the text
                            }

                            // Create a new range that selects the whole word
                            range.setStart(textNode, wordStart);
                            range.setEnd(textNode, wordEnd);

                            // Apply the new range to the selection
                            selection.removeAllRanges();
                            selection.addRange(range);
                        }
                    }

                    range.deleteContents();
                    block.appendChild(list);
                } else {
                    block.replaceWith(list);
                }

                // Restore caret inside new <li>
                const newRange = document.createRange();
                newRange.selectNodeContents(listItem);
                newRange.collapse(false);
                selection.removeAllRanges();
                selection.addRange(newRange);
            }
        };
    }

    function linkModule(editorData) {
        return {
            linkText: '',
            linkUrl: '',
            linkTarget: '_self',
            selectedLink: null,
            range: null,
            popupId: null,
            popupEl: null,
            toolbarButtonEl: null, // store toolbar button ref if needed

            init(editorElement, toolbarButtonSelector = null) {
                this.popupId = 'link-popup-' + editorElement.id;
                // Allow passing toolbar button selector
                if (toolbarButtonSelector) {
                    // Accept either an element or selector string
                    this.toolbarButtonEl =
                        typeof toolbarButtonSelector === 'string'
                            ? document.querySelector(toolbarButtonSelector)
                            : toolbarButtonSelector;
                }

                editorElement.addEventListener('mouseup', (event) => this.checkForLinkClick(event));

                // Close popup on outside click
                document.addEventListener('click', (e) => {
                    if (
                        this.popupEl &&
                        !this.popupEl.contains(e.target) &&
                        e.target !== this.toolbarButtonEl &&
                        !e.target.closest('a')
                    ) {
                        this.closePopup();
                    }
                });
            },

            checkForLinkClick(event) {
                if (event.target.tagName === 'A') {
                    this.selectedLink = event.target;
                    this.linkText = this.selectedLink.textContent;
                    this.linkUrl = this.selectedLink.getAttribute('href') || '';
                    this.linkTarget = this.selectedLink.getAttribute('target') || '_self';
                    this.range = null;

                    this.showLinkPopup();
                    this.positionPopup(event.target);
                }
            },

            showPopup(event) {
                // If popup is already visible and triggered by button → toggle it
                if (this.popupEl && event?.currentTarget === this.toolbarButtonEl) {
                    this.closePopup();
                    return;
                }

                this.selectedLink = null;
                const selection = window.getSelection();
                this.range = selection.rangeCount ? selection.getRangeAt(0) : null;
                this.linkText = this.range?.toString() || '';
                this.linkUrl = '';
                this.linkTarget = '_self';

                this.showLinkPopup();

                // Position depending on trigger
                if (event?.currentTarget === this.toolbarButtonEl) {
                    this.positionPopup(this.toolbarButtonEl);
                } else if (this.range) {
                    this.positionPopup(this.range);
                }
            },

            showLinkPopup() {
                this.closePopup(); // remove old popup

                const label_class = 'block text-xs font-medium mt-2 mb-1';
                const input_class = 'rounded-md border border-black/5 dark:border-white/10 bg-transparent p-1 w-full text-xs h-7';
                const popup = document.createElement('div');
                popup.id = this.popupId;
                popup.className = 'absolute backdrop-blur-lg bg-white/90 dark:bg-black/90 p-4 shadow-lg border border-dark/5 rounded-md flex flex-col w-64 z-50';
                popup.innerHTML = `
                <label class="${label_class}">URL:</label>
                <input type="text" id="link-url" class="${input_class}" value="${this.linkUrl}">
                <label class="${label_class}">Text (Optional):</label>
                <input type="text" id="link-text" class="${input_class}" value="${this.linkText}">
                <label class="${label_class}">Target:</label>
                <select id="link-target" class="${input_class} px-2">
                    <option value="_self" ${this.linkTarget === '_self' ? 'selected' : ''}>Same Window (_self)</option>
                    <option value="_blank" ${this.linkTarget === '_blank' ? 'selected' : ''}>New Tab (_blank)</option>
                    <option value="_parent" ${this.linkTarget === '_parent' ? 'selected' : ''}>Parent Frame (_parent)</option>
                    <option value="_top" ${this.linkTarget === '_top' ? 'selected' : ''}>Top Window (_top)</option>
                </select>

                <button type="button" id="insert-link-btn" class="mt-3 bg-blue-500 text-sm text-white px-3 py-1 rounded-md hover:cursor-pointer hover:opacity-80">Insert Link</button>
            `;

                document.body.appendChild(popup);
                this.popupEl = popup;

                popup.querySelector('#insert-link-btn').addEventListener('click', () => this.insertOrUpdateLink());
            },

            closePopup() {
                if (this.popupEl) {
                    this.popupEl.remove();
                    this.popupEl = null;
                }
            },

            positionPopup(target) {
                const popup = this.popupEl;
                if (!popup) return;

                let rect;
                if (target instanceof Range) {
                    rect = target.getBoundingClientRect();
                } else {
                    rect = target.getBoundingClientRect();
                }

                const top = rect.bottom + window.scrollY + 6;
                const left = Math.min(rect.left + window.scrollX, window.innerWidth - popup.offsetWidth - 10);

                popup.style.top = `${top}px`;
                popup.style.left = `${left}px`;
            },

            insertOrUpdateLink() {
                const textVal = document.getElementById('link-text').value.trim();
                let urlVal = document.getElementById('link-url').value.trim();
                const targetVal = document.getElementById('link-target').value;

                if (!urlVal) return;

                if (!urlVal.startsWith('http://') && !urlVal.startsWith('https://')) {
                    urlVal = `https://${urlVal}`;
                }

                const linkStyle = "color:#007bff;text-decoration:underline;font-weight:bold;transition:color 0.2s;";

                if (this.selectedLink) {
                    this.selectedLink.href = urlVal;
                    this.selectedLink.target = targetVal;
                    this.selectedLink.textContent = textVal || urlVal;
                    this.selectedLink.setAttribute("style", linkStyle);
                } else if (this.range) {
                    const link = document.createElement('a');
                    link.href = urlVal;
                    link.target = targetVal;
                    link.textContent = textVal || urlVal;
                    link.setAttribute("style", linkStyle);
                    this.range.deleteContents();
                    this.range.insertNode(link);
                }

                this.closePopup();
                editorData.save();
            }
        };
    }

    Alpine.data('editor', (id, model, $wire) => ({
        id,
        model,
        editor: null,
        wire: $wire,
        content: null,

        // Formatting states
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,

        // Modules (color picker, link, image, etc.)
        colorPalette: null,
        action: null,
        link: null,
        image: {
            showModal: false,
            src: '',
            alt: '',
            width: 200,
            height: '',
            opacity: 1,
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 0,
            float: 'none',
            selectedImage: null
        },

        // Debounced save (prevent spam updates)
        save: Alpine.debounce(function () {
            this.wire.set(this.model, this.editor.innerHTML, false);
        }, 400),

        init() {
            this.setupEditor();

            Livewire.hook('morphed', ({el, component}) => {
                this.attachEditorListeners();
            });
        },

        setupEditor() {
            this.editor = document.getElementById(this.id);
            this.content = this.wire.get(this.model);

            // Initialize modules
            this.colorPicker = Alpine.reactive(colorPickerModule(this));
            this.action = Alpine.reactive(textActionsModule(this));
            this.image = Alpine.reactive(imageModule(this));
            this.link = Alpine.reactive(linkModule(this));
            this.link.init(this.editor, this.$refs.linkBtn);

            // Attaches global listeners once if multiple editors
            if (!window.__xform_editor_listeners__) {
                window.__xform_editor_listeners__ = true;
                window.addEventListener('editImage', e => this.openImageEditor(e));
                window.addEventListener('insertImage', e => this.insertImage(e));
                document.addEventListener('selectionchange', this.updateFormattingState.bind(this));
            }

            // Attach editor-specific listeners
            this.attachEditorListeners();
        },

        attachEditorListeners() {
            if (!this.$refs.editor || !this.$refs.editor.id) return;

            this.$refs.editor.addEventListener('click', e => this.image.handleClick(e));
            this.$refs.editor.addEventListener('dragstart', e => this.image.handleDragStart(e));
            this.$refs.editor.addEventListener('dragend', e => this.image.handleDragEnd(e));
            this.$refs.editor.addEventListener('keydown', e => {
                if (e.key === 'Tab') {
                    e.preventDefault();
                    this.action.changeIndent(!e.shiftKey);
                }
            });

            // Clean paste (remove unwanted formatting)
            this.$refs.editor.addEventListener('paste', e => {
                e.preventDefault();
                const text = (e.clipboardData || window.clipboardData).getData('text/plain');
                document.execCommand('insertText', false, text);
            });
        },

        openImageEditor(event) {
            const data = event.detail;
            if (!this.image) return console.error('Image module not initialized');
            this.image.src = data.url;
            this.image.path = data.path;

            if (data.width) this.image.width = data.width;
            if (data.height) this.image.height = data.height;

            this.image.init();
            this.image.showModal = true;
        },

        insertImage() {
            this.image.insertImage();
            this.image.showModal = false;
            this.save();
        },

        // --- Formatting Management ---
        clearFormatting() {
            const selection = window.getSelection();
            if (!selection.rangeCount) return;

            const range = selection.getRangeAt(0);
            const fragment = range.cloneContents();

            const tempDiv = document.createElement('div');
            tempDiv.appendChild(fragment);

            // Sanitize HTML
            this.sanitize(tempDiv);

            // Replace current selection
            range.deleteContents();
            const cleaned = document.createTextNode(tempDiv.textContent);
            range.insertNode(cleaned);

            // Reset selection position
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStartAfter(cleaned);
            newRange.setEndAfter(cleaned);
            selection.addRange(newRange);

            this.save();
        },

        // Modern, safe recursive cleaner
        sanitize(node) {
            if (node.nodeType === Node.TEXT_NODE) return;

            const allowedTags = [
                'P', 'BR', 'H1', 'H2', 'H3', 'UL', 'OL', 'LI',
                'STRONG', 'B', 'I', 'EM', 'U', 'IMG', 'CODE', 'PRE'
            ];

            if (!allowedTags.includes(node.tagName)) {
                node.replaceWith(...node.childNodes);
                return;
            }

            // Remove attributes except safe ones
            [...node.attributes].forEach(attr => {
                if (!['src', 'alt', 'href'].includes(attr.name)) {
                    node.removeAttribute(attr.name);
                }
            });

            node.removeAttribute('style');
            node.className = '';

            [...node.children].forEach(child => this.sanitize(child));
        },

        // Clean up empty tags
        cleanEmptyTags(element) {
            if (element.id === this.id) return;

            [...element.children].forEach(child => {
                if (
                    ['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'CODE'].includes(child.tagName) &&
                    !child.textContent.trim() &&
                    !child.hasChildNodes()
                ) {
                    child.remove();
                } else {
                    this.cleanEmptyTags(child);
                }
            });
        },

        // Track whether text is bold/italic/etc. for toolbar state
        updateFormattingState() {
            const sel = window.getSelection();
            if (!sel.rangeCount) return;

            const parent = sel.anchorNode?.parentElement;
            if (!parent) return;

            this.isBold = document.queryCommandState('bold');
            this.isItalic = document.queryCommandState('italic');
            this.isUnderline = document.queryCommandState('underline');
            this.isStrikethrough = document.queryCommandState('strikeThrough');
        },
    }));

}
