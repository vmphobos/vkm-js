//DO NOT ALTER ANYTHING IN HERE!
export default function (Alpine) {
    function colorPicker(editorData) {
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
                    '#000',
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


    function editImage(editorData) {
        return {
            lastSelection: null,
            showModal: false,
            src: '',
            alt: '',
            width: 200,
            height: '',
            borderWidth: 0,
            borderColor: '#000',
            borderRadius: 0,
            float: "none",
            selectedImage: null,
            popup: null,
            constraint: false, // Whether width and height should be the same

            reset() {
                this.src = '';
                this.alt = '';
                this.width = 200;
                this.height = '';
                this.borderWidth = 0;
                this.borderColor = '#000';
                this.borderRadius = 0;
            },
            changeConstraint() {
                this.constraint = !this.constraint;  // Toggle the constraint
                if (this.constraint) {
                    this.height = this.width;  // Keep width and height the same
                }
            },

            changeImageDimensions(type, value) {
                const isWidth = type === 'w';
                if (!this.constraint) {
                    if (isWidth) {
                        this.width = value;
                    } else {
                        this.height = value;
                    }
                } else {
                    this.width = this.height = value;
                }
            },

            setBorderColor(value) {
                this.borderColor = value;
            },

            storeSelection() {
                const selection = window.getSelection();
                if (selection.rangeCount > 0) {
                    this.lastSelection = selection.getRangeAt(0); // Store caret position
                }
            },

            insertImage() {
                if (!this.lastSelection && !this.selectedImage) return;

                if (this.selectedImage) {
                    this.selectedImage.src = this.src;
                    this.selectedImage.alt = this.alt;
                    this.selectedImage.style.width = this.width + "px";
                    this.selectedImage.style.height = this.height + "px";
                    this.selectedImage.style.float = this.float;
                    if (this.borderWidth) {
                         this.selectedImage.style.border = this.borderWidth + "px solid " + this.borderColor;
                    }
                    if (this.borderRadius) {
                         this.selectedImage.style.borderRadius = this.borderRadius + "px";
                    }
                     this.selectedImage.style.display = "inline-block";
                     this.selectedImage.draggable = true;
                     this.selectedImage.style.cursor = "grab";
                }
                else {
                    const img = document.createElement('img');
                    img.src = this.src;
                    img.alt = this.alt;
                    img.style.width = this.width + "px";
                    img.style.height = this.height + "px";
                    img.style.float = this.float;
                    if (this.borderWidth) {
                        img.style.border = this.borderWidth + "px solid " + this.borderColor;
                    }

                    if (this.borderRadius) {
                        img.style.borderRadius = this.borderRadius + "px";
                    }

                    img.style.display = "inline-block";
                    img.draggable = true;
                    img.style.cursor = "grab";

                    this.lastSelection.insertNode(img);
                    this.lastSelection = null;
                }

                this.showModal = false;

                editorData.save();

                this.reset();
            },

            insertFile(url) {
                if (!this.lastSelection) return;
                let input = prompt("Please enter a title for the link:", "");

                if (input == null) {
                    input = url;
                }

                const link = document.createElement('a');
                link.href = url;
                link.target = '_blank';
                link.textContent = input;
                link.setAttribute("style", "color: #007bff; text-decoration: underline; font-weight: bold; transition: color 0.2s ease-in-out;");
                this.lastSelection.insertNode(link);
                this.lastSelection = null;

                editorData.save();

                this.reset();
            },

            updateImageSrc(value) {
                if (this.selectedImage) {
                    this.selectedImage.setAttribute('src', value);
                    editorData.save();
                }
            },

            updateAltText(value) {
                if (this.selectedImage) {
                    this.selectedImage.setAttribute('alt', value);
                    editorData.save();
                }
            },

            handleClick(event) {
                if (event.target.closest('#image-popup')) {
                    return;
                }

                if (event.target.tagName === 'IMG') {
                    this.selectImage(event.target);
                } else {
                    this.deselectImage();
                }
            },

            selectImage(image) {
                if (this.selectedImage) {
                    // this.selectedImage.classList.remove('border-2', 'border-orange-400');
                }

                this.selectedImage = image;
                // this.selectedImage.classList.add('border-2', 'border-orange-400');
                this.src = this.selectedImage.src;
                this.alt = this.selectedImage.alt;
                this.width = this.selectedImage.width;
                this.height = this.selectedImage.height;
                this.float = getComputedStyle(this.selectedImage).float;
                this.borderWidth =  parseFloat(getComputedStyle(this.selectedImage).borderWidth);
                this.borderColor = getComputedStyle(this.selectedImage).borderColor;
                this.borderRadius =  parseFloat(getComputedStyle(this.selectedImage).borderRadius);

                this.showModal = true;
            },

            deselectImage() {
                if (this.selectedImage) {
                    this.selectedImage.classList.remove('border-2', 'border-blue-500');
                    document.querySelector('#image-popup')?.remove();
                    this.selectedImage = null;
                }
            },

            alignImage(position) {
                if (this.selectedImage) {
                    this.selectedImage.style.display = 'inline';
                    this.selectedImage.style.margin = position === 'center' ? '0 auto' : '0';
                    this.selectedImage.style.float = position === 'left' ? 'left' : position === 'right' ? 'right' : 'none';
                }

                editorData.save();
            },

            handleDragStart(event) {
                if (event.target.tagName === 'IMG') {
                    event.target.classList.add('caret-red-500'); // Change caret color
                    event.target.classList.add('opacity-50', 'scale-75'); // Reduce opacity and scale down image
                    event.target.classList.add('caret-w-[4px]', 'caret-h-[20px]');
                }
            },

            handleDragEnd(event) {
                if (event.target.tagName === 'IMG') {
                    event.target.classList.remove('caret-red-500'); // Reset caret color
                    event.target.classList.remove('opacity-50', 'scale-75'); // Restore opacity and scale
                    event.target.classList.remove('caret-w-[4px]', 'caret-h-[20px]');
                }
            },

            // URL validation
            isValidImageUrl(url) {
                const regex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|jpeg|gif|png|bmp|webp)/i;
                return regex.test(url);  // Validate image URL
            },
        };
    }

    function createActions(editorData) {
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
                }
                else {
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

    function createLink(editorData) {
        return {
            linkText: '',
            linkUrl: '',
            linkTarget: '_self',
            selectedLink: null,
            range: null, // Store range globally for later insertion

            init(editorElement) {
                editorElement.addEventListener('mouseup', (event) => this.checkForLinkClick(event));
            },

            checkForLinkClick(event) {
                if (event.target.tagName === 'A') {
                    this.selectedLink = event.target;
                    this.linkText = this.selectedLink.textContent;
                    this.linkUrl = this.selectedLink.href;
                    this.linkTarget = this.selectedLink.target;

                    this.showLinkPopup();
                    this.positionPopup(event.target);
                }
            },

            insert() {
                this.selectedLink = null;
                const selection = window.getSelection();
                if (!selection.rangeCount) return;

                this.range = selection.getRangeAt(0); // Store range for later insertion
                this.linkText = this.range.toString() || ''; // Get selected text
                this.linkUrl = ''; // Get selected text

                this.showLinkPopup();
                this.positionPopup(this.range);
            },

            showLinkPopup() {
                document.querySelector('#link-popup')?.remove(); // Remove existing popup

                let popup = document.createElement('div');
                popup.id = 'link-popup';
                popup.className = 'absolute bg-white p-4 shadow-lg border border-gray-200 rounded-sm flex flex-col w-64';
                popup.setAttribute('x-on:click.outside', "if (!$event.target.closest('#link-popup') && !$event.target.closest('a')) { $el.remove() }");

                popup.innerHTML = `
                <label class="block text-xs font-medium mb-1">Text:</label>
                <input type="text" id="link-text" class="rounded-sm border border-gray-300 bg-transparent p-1 w-full text-sm h-7" value="${this.linkText}">

                <label class="block text-xs font-medium mt-1 mb-1">URL:</label>
                <input type="text" id="link-url" class="rounded-sm border border-gray-300 bg-transparent p-1 w-full text-sm h-7" value="${this.linkUrl}">

                <label class="block text-xs font-medium mt-1 mb-1">Target:</label>
                <select id="link-target" class="rounded-sm border border-gray-300 bg-transparent p-1 w-full text-sm h-7">
                    <option value="_self" ${this.linkTarget === '_self' ? 'selected' : ''}>Same Window</option>
                    <option value="_blank" ${this.linkTarget === '_blank' ? 'selected' : ''}>New Tab</option>
                    <option value="_parent" ${this.linkTarget === '_parent' ? 'selected' : ''}>Parent Frame</option>
                    <option value="_top" ${this.linkTarget === '_top' ? 'selected' : ''}>Top Window</option>
                </select>

                <button type="button" id="insert-link-btn" class="mt-2 bg-blue-500 text-white px-3 py-1 rounded">Update</button>
            `;
                document.body.appendChild(popup);

                // Attach event listener AFTER inserting popup into DOM
                document.getElementById('insert-link-btn').addEventListener('click', this.insertOrUpdateLink.bind(this));
            },

            positionPopup(target) {
                const popup = document.querySelector('#link-popup');
                if (!popup) return;

                const rect = target.getBoundingClientRect();
                popup.style.top = `${rect.bottom + window.scrollY}px`;
                popup.style.left = `${rect.left + window.scrollX}px`;
            },

            insertOrUpdateLink() {
                this.linkText = document.getElementById('link-text').value;
                this.linkUrl = document.getElementById('link-url').value;
                this.linkTarget = document.getElementById('link-target').value;

                if (!this.linkUrl) return;

                // Ensure proper link formatting
                if (!this.linkUrl.startsWith('http://') && !this.linkUrl.startsWith('https://')) {
                    this.linkUrl = `https://${this.linkUrl}`;
                }

                if (!this.range) return;

                const linkStyle = "color: #007bff; text-decoration: underline; font-weight: bold; transition: color 0.2s ease-in-out;";

                if (this.selectedLink) {
                    this.selectedLink.href = this.linkUrl;
                    this.selectedLink.target = this.linkTarget;
                    this.selectedLink.textContent = this.linkText || this.linkUrl;
                    this.selectedLink.setAttribute("style", linkStyle);
                } else {
                    const link = document.createElement('a');
                    link.href = this.linkUrl;
                    link.target = this.linkTarget;
                    link.textContent = this.linkText || this.linkUrl;
                    link.setAttribute("style", linkStyle);

                    if (this.linkText) {
                        this.range.deleteContents();
                        this.range.insertNode(link);
                    } else {
                        this.range.insertNode(link);
                    }
                }

                document.querySelector('#link-popup')?.remove();

                editorData.save();
            }
        };
    }

    Alpine.data('editor', (id, model, $wire) => ({
        id: id,
        editor: document.getElementById(id),
        wire: $wire,
        model: model,
        content: $wire.get(model),
        isBold: false,
        isItalic: false,
        isUnderline: false,
        isStrikethrough: false,
        colorPalette: null, //Color pick functionality for text and bg
        action: null,  // Editor Actions
        link: null,  // Insert or update an existing link
        image: null,  // Image manipulation and file manager

        init() {
            //initialize functions
            this.colorPicker = Alpine.reactive(colorPicker(this));
            this.action = Alpine.reactive(createActions(this));
            this.link = Alpine.reactive(createLink(this));
            this.image = Alpine.reactive(editImage(this));

            this.link.init(this.editor);

            window.addEventListener('editImage', this.editImage.bind(this));
            window.addEventListener('insertImage', this.insertImage.bind(this));

            this.attachEditorImageListeners();
        },

        editImage(event) {
            const data = event.detail;
            this.image.src = data.url;
            this.image.path = data.path;
            this.image.showModal = true;
        },

        insertImage(event) {
            this.image.insertImage();
            this.image.showModal = false;
        },

        attachEditorImageListeners() {
            this.editor.addEventListener('click', (event) => {
                this.image.handleClick(event);
            });

            this.editor.addEventListener('dragstart', (event) => {
                this.image.handleDragStart(event);
            });

            this.editor.addEventListener('dragend', (event) => {
                this.image.handleDragEnd(event);
            });

            this.editor.addEventListener('keydown', (event) => {
                if (event.key === 'Tab') {
                    event.preventDefault();
                    this.action.changeIndent(!event.shiftKey);
                }
            });
        },

        save() {
            $wire.set(this.model, this.editor.innerHTML, false)
        },

        clearFormatting() {
            document.execCommand('removeFormat');

            const selection = window.getSelection();
            if (selection.rangeCount === 0 || selection.isCollapsed) {
                // Get the current node where the cursor is
                let cursorNode = selection.focusNode;

                // If the cursor is inside a text node
                if (cursorNode && cursorNode.nodeType === Node.TEXT_NODE) {
                    let textNode = cursorNode;
                    let textContent = textNode.textContent;

                    // Find the word boundaries (you can adjust this logic for better word handling)
                    let wordStart = 0; // Start at the beginning of the text
                    let wordEnd = textContent.length; // End at the end of the text

                    // Create a new range that selects the whole text of the node
                    let range = document.createRange();
                    range.setStart(textNode, wordStart);
                    range.setEnd(textNode, wordEnd);

                    // Apply the new range to the selection
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
                else {
                    return;
                }
            }

            const range = selection.getRangeAt(0);
            const selectedNode = range.cloneContents();

            // Get the parent of the selected node (this will be the node surrounding the selection)
            const parentElement = range.startContainer.parentElement;

            // If the parent doesn't have the specific id (e.g., 'editor')
            if (parentElement && parentElement.id !== this.id) {
                // Remove all attributes and inline styles from the parent element
                Array.from(parentElement.attributes).forEach(attr => parentElement.removeAttribute(attr.name));
                parentElement.removeAttribute('style');
            }

            // Create a temporary div to manipulate the content
            const tempDiv = document.createElement('div');
            tempDiv.appendChild(selectedNode);

            // Start cleaning from the root element (the temporary div)
            this.cleanElement(tempDiv);

            // Get the cleaned HTML content as a string
            const cleanedHtml = tempDiv.innerHTML;

            // Replace the selected content with the cleaned HTML (unwrapping text inside)
            range.deleteContents();

            const fragment = document.createRange().createContextualFragment(cleanedHtml);

            // Insert the new HTML content at the current selection
            range.insertNode(fragment);

            // Set the cursor after the cleaned content
            const cursorPosition = range.endContainer;
            selection.removeAllRanges();
            const newRange = document.createRange();
            newRange.setStart(cursorPosition, 0);
            newRange.setEnd(cursorPosition, 0);
            selection.addRange(newRange);

            this.cleanEmptyTags(this.editor);

            this.save();
        },

        cleanEmptyTags(element) {
            // Avoid cleaning the editor itself
            if (element.id === this.id) return;

            // Check if the element is empty:
            // - No text content
            // - No child nodes
            // - No attributes (including style)
            if (
                (['DIV', 'P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'SPAN', 'CODE'].includes(element.tagName)) &&
                !element.textContent.trim() &&        // No text content
                !element.hasChildNodes() &&           // No child elements
                !element.hasAttributes() &&           // No attributes
                !element.hasAttribute('style')        // No inline styles
            ) {
                // Remove the empty element from its parent
                element.parentNode.removeChild(element);
            } else {
                // Recursively clean child elements
                Array.from(element.children).forEach(child => this.cleanEmptyTags(child));
            }
        },

        // Function to remove all inline styles, classes, and attributes
        cleanElement(element) {
            if (element.tagName === 'A') {
                // Replace the <a> tag with its inner text
                const textNode = document.createTextNode(element.textContent); // Get the text content of the <a> tag
                element.parentNode.replaceChild(textNode, element); // Replace the <a> with the text node
            }

            if (['B', 'I', 'U', 'STRONG', 'EM', 'UL', 'OL', 'LI'].includes(element.tagName)) {
                // Replace the element with just its text content
                const textNode = document.createTextNode(element.textContent);
                element.parentNode.replaceChild(textNode, element);
            }

            // Remove all attributes
            Array.from(element.attributes).forEach(attr => element.removeAttribute(attr.name));

            // Remove inline styles by clearing the 'style' attribute
            element.removeAttribute('style');

            // Recursively clean child elements
            Array.from(element.children).forEach(child => this.cleanElement(child));

            this.cleanEmptyTags(element);
        }
    }));
}
