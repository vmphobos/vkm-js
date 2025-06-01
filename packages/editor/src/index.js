export default function (Alpine) {
    Alpine.data('actions', (el) => ({
        editor: null,
        input: null,
        size: 18,
        colorInput: null,
        classes: 'inline-flex m-1 p-1 rounded-xs hover:bg-light',
        initialize: function(editor) {
            this.editor = editor;
            this.editor.setAttribute('contenteditable', 'true');

            this.editor.designMode = "on";
            if (modifiers.includes('fullscreen')) {
                this.editor.style.height = "calc(100vh - 2rem)";
            }
            this.editor.onmouseup = function (e) {
                //make this over secure https
                setTimeout(function () {
                    isSelectionBold()
                }, 100);
            };

            //If a livewire model is passed, we will set the value of the model to the editor content
            if (model) {
                this.editor.setAttribute('x-on:keyup', "$wire.set('" + model + "',$el.innerHTML, false)");
            }

            this.$watch('colorInput', value => {
                this.setColor(value);
            });

            let html = '',
                setModel = '$wire.set(\''+model+'\', editor.innerHTML, false)',
                actions = icons(this.size);

            for (let action in actions) {
                let dropdown = actions[action].dropdown;
                if (action === 'foreColor' || action === 'backColor') {
                    html += `<dropdown x-dropdown><button type="button" class="${this.classes}" x-tooltip="${actions[action].title}" data-trigger>${actions[action].icon}</button><div class="z-10 w-48 rounded-sm bg-white p-2 shadow-sm dark:bg-gray-700 block" data-dropdown>`;
                    html += `<div class="grid grid-cols-6 gap-2 group mb-3 items-center p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600">
                                <input type="color" x-model="colorInput" id="editor-text-color" value="#2578D0" class="border-gray-200 border bg-gray-50 dark:bg-gray-700 dark:border-gray-600 rounded-md p-px px-1 hover:bg-gray-50 group-hover:bg-gray-50 dark:group-hover:bg-gray-700 w-full h-8 col-span-3">
                                <label for="color" class="text-gray-500 dark:text-gray-400 text-sm font-medium col-span-3 group-hover:text-gray-900 dark:group-hover:text-white">Pick a color</label></div><hr><div class="grid grid-cols-6 gap-1 mb-3">
                        `;

                    let bg_colors = [
                        'bg-white',
                        'bg-gray-100',
                        'bg-gray-300',
                        'bg-gray-500',
                        'bg-gray-900',
                        'bg-black',
                        'bg-red-100',
                        'bg-red-300',
                        'bg-red-500',
                        'bg-red-900',
                        'bg-purple-100',
                        'bg-purple-300',
                        'bg-purple-500',
                        'bg-purple-900',
                        'bg-pink-100',
                        'bg-pink-300',
                        'bg-pink-500',
                        'bg-pink-900',
                        'bg-green-100',
                        'bg-green-300',
                        'bg-green-500',
                        'bg-green-900',
                        'bg-emerald-100',
                        'bg-emerald-300',
                        'bg-emerald-500',
                        'bg-emerald-900',
                        'bg-yellow-100',
                        'bg-yellow-300',
                        'bg-yellow-500',
                        'bg-yellow-900',
                        'bg-orange-100',
                        'bg-orange-300',
                        'bg-orange-500',
                        'bg-orange-900',
                        'bg-blue-100',
                        'bg-blue-300',
                        'bg-blue-500',
                        'bg-blue-900',
                        'bg-sky-100',
                        'bg-sky-300',
                        'bg-sky-500',
                        'bg-sky-900',
                    ];

                    let text_colors = [
                        'text-white',
                        'text-gray-100',
                        'text-gray-300',
                        'text-gray-500',
                        'text-gray-900',
                        'text-black',
                        'text-red-100',
                        'text-red-300',
                        'text-red-500',
                        'text-red-900',
                        'text-purple-100',
                        'text-purple-300',
                        'text-purple-500',
                        'text-purple-900',
                        'text-pink-100',
                        'text-pink-300',
                        'text-pink-500',
                        'text-pink-900',
                        'text-green-100',
                        'text-green-300',
                        'text-green-500',
                        'text-green-900',
                        'text-emerald-100',
                        'text-emerald-300',
                        'text-emerald-500',
                        'text-emerald-900',
                        'text-yellow-100',
                        'text-yellow-300',
                        'text-yellow-500',
                        'text-yellow-900',
                        'text-orange-100',
                        'text-orange-300',
                        'text-orange-500',
                        'text-orange-900',
                        'text-blue-100',
                        'text-blue-300',
                        'text-blue-500',
                        'text-blue-900',
                        'text-sky-100',
                        'text-sky-300',
                        'text-sky-500',
                        'text-sky-900',
                    ];

                    if ( action === 'foreColor') {
                        for(var t in text_colors) {
                            let className = text_colors[t];
                            let classPreview = bg_colors[t];
                            html += `
                                <button type="button" @click="formatText('${className}'), ${setModel}" class="${classPreview} w-6 h-6 shadow-md rounded-md opacity-90 hover:opacity-100"><span class="sr-only">White</span></button>
                            `;
                        }
                    } else {
                        for(var b in bg_colors) {
                            let className = bg_colors[b];
                            html += `
                                <button type="button" @click="formatText('${className}'), ${setModel}" class="${className} w-6 h-6 shadow-md rounded-md opacity-90 hover:opacity-100"><span class="sr-only">White</span></button>
                            `;
                        }
                    }

                    html += `</div></div></dropdown>`;
                }
                else if(action === 'fontSize') {
                    html += `<dropdown x-dropdown><button type="button" class="${this.classes}" x-tooltip="${actions[action].title}" data-trigger>${actions[action].icon}</button><div class="z-10 w-48 rounded-sm bg-white p-2 shadow-sm dark:bg-gray-700 block" data-dropdown>`;
                    html += `
                            <button type="button" @click="formatText('text-3xl'), ${setModel}" class="text-2xl hover:opacity-80 my-2">3XL Font Size</button>
                            <button type="button" @click="formatText('text-2xl'), ${setModel}" class="text-2xl hover:opacity-80 my-2">2XL Font Size</button>
                            <button type="button" @click="formatText('text-xl'), ${setModel}" class="text-xl hover:opacity-80 my-2">XL Font Size</button>
                            <button type="button" @click="formatText('text-lg'), ${setModel}" class="text-lg hover:opacity-80 my-2">L Font Size</button>
                            <button type="button" @click="formatText('text-md'), ${setModel}" class="text-md hover:opacity-80 my-2">Default Size</button>
                            <button type="button" @click="formatText('text-sm'), ${setModel}" class="text-sm hover:opacity-80 my-2">Small Font Size</button>
                            <button type="button" @click="formatText('text-sm'), ${setModel}" class="text-xs hover:opacity-80 my-2">Extra Small Font Size</button>
                        `;
                    html += `</div></dropdown>`;
                }
                else if(action === 'indentHorizontally') {
                    html += `<dropdown x-dropdown><button type="button" class="${this.classes}" x-tooltip="${actions[action].title}" data-trigger>${actions[action].icon}</button><div class="z-10 min-w-max rounded-sm bg-white p-2 shadow-sm dark:bg-gray-700 block" data-dropdown>`;
                    html += `
                            <button type="button" @click="formatText('ml-5'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Horizontally 5</button>
                            <button type="button" @click="formatText('ml-4'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Horizontally 4</button>
                            <button type="button" @click="formatText('ml-3'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Horizontally 3</button>
                            <button type="button" @click="formatText('ml-2'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Horizontally 2</button>
                            <button type="button" @click="formatText('ml-1'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Horizontally 1</button>
                            <button type="button" @click="formatText('ml-0'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Horizontally 0</button>
                        `;
                    html += `</div></dropdown>`;
                }
                else if(action === 'indentVertically') {
                    html += `<dropdown x-dropdown><button type="button" class="${this.classes}" x-tooltip="${actions[action].title}" data-trigger>${actions[action].icon}</button><div class="z-10 min-w-max rounded-sm bg-white p-2 shadow-sm dark:bg-gray-700 block" data-dropdown>`;
                    html += `
                            <button type="button" @click="formatText('my-5'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Vertically 5</button>
                            <button type="button" @click="formatText('my-4'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Vertically 4</button>
                            <button type="button" @click="formatText('my-3'), ${setModel}" class="px-2 text-sml hover:opacity-80 my-2">Indent Vertically 3</button>
                            <button type="button" @click="formatText('my-2'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Vertically 2</button>
                            <button type="button" @click="formatText('my-1'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Vertically 1</button>
                            <button type="button" @click="formatText('my-0'), ${setModel}" class="px-2 text-sm hover:opacity-80 my-2">Indent Vertically 0</button>
                        `;
                    html += `</div></dropdown>`;
                }
                else {
                    html += `<button type="button" class="${this.classes}" @click="make($el, '${action}'), ${setModel}" x-tooltip="${actions[action].title}">${actions[action].icon}</button>`;
                }
            }

            let buttons = this.$el.querySelector('[data-buttons]');

            buttons.innerHTML = html;

            this.focus();

        },
        createElement: function(classlist, text, tagName) {
            let element = document.createElement(tagName);
            element.textContent = text;

            if (Array.isArray(classlist)) {
                element.classList.add(...classlist);
            } else if (typeof classlist === 'string') {
                element.classList.add(classlist);
            }

            return element;
        },
        replaceClassWithPrefix(el, newClass) {
            const [prefix] = newClass.split('-'); // Get the prefix: "text" from "text-blue"
            const existingClass = Array.from(el.classList).find(cls => cls.startsWith(prefix + '-'));

            if (existingClass) {
                el.classList.replace(existingClass, newClass);
            } else {
                el.classList.add(newClass);
            }
        },
        formatText: function(classList, tagName = 'span') {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let selectedText = selection.toString();

            if (selectedText) {
                let wrapper = selection.anchorNode.parentNode;

                // Check if selection is fully inside the wrapper by comparing start and end points
                let isFullWrapperSelected = range.startContainer === range.endContainer &&
                    range.startOffset === 0 &&
                    range.endOffset === range.endContainer.length;

                let element = document.createElement(tagName);
                element.textContent = selectedText;

                if (isFullWrapperSelected) {
                    if (wrapper.hasAttribute('data-editor')) {
                        // Create new element and add the class to it
                        this.replaceClassWithPrefix(element, classList);

                        // Insert the new element content into wrapper
                        wrapper.innerHTML = wrapper.innerHTML.replace(selectedText, '') + element.outerHTML;

                        selection.deleteFromDocument();
                    } else {
                        this.replaceClassWithPrefix(wrapper, classList);
                    }
                } else {
                    // Partial selection: Insert the new element as is
                    this.replaceClassWithPrefix(element, classList);
                    range.deleteContents();
                    range.insertNode(element);
                }
            }
        },
        make: function(btn, action, param = null) {
            if(action === 'link') {
                this.addLink();
            }
            else if (action === 'code') {
                document.execCommand('insertHTML', false, '<table class="table"><thead><tr><th></th><th></th></tr></thead><tbody><tr><td></td><td></td></tr></tbody></table>')

            }
            else if (['insertUnorderedList', 'insertOrderedList','insertLetterList'].includes(action)) {
                if (action === 'insertLetterList') {
                    document.execCommand('insertUnorderedList', false, param);
                }
                else {
                    document.execCommand(action, false, param);
                }

                if (action === 'insertUnorderedList') {
                    const lists = this.editor.querySelectorAll('ul');
                    // Add class to each <ul> element
                    lists.forEach((list) => {
                        // Add the custom class if not already added
                        if (!list.classList.contains('list-disc')) {
                            list.classList.add('list-disc');
                            list.classList.add('list-inside');
                        }
                    });
                }
                else if (action === 'insertOrderedList') {
                    const lists = this.editor.querySelectorAll('ol');
                    // Add class to each <ul> element
                    lists.forEach((list) => {
                        // Add the custom class if not already added
                        if (!list.classList.contains('list-decimal')) {
                            list.classList.add('list-decimal');
                            list.classList.add('list-inside');
                        }
                    });
                }
                else if (action === 'insertLetterList') {

                    const lists = this.editor.querySelectorAll('ul');
                    // Add class to each <ul> element
                    lists.forEach((list) => {
                        // Add the custom class if not already added
                        if (!list.classList.contains('list-[lower-alpha]')) {
                            list.classList.add('list-[lower-alpha]');
                            list.classList.add('list-inside');
                        }
                    });
                }
                else {
                    // ToDO upper-roman
                    //list-style-type: upper-alpha
                    const lists = this.editor.querySelectorAll('ul');
                }
            }
            else {
                document.execCommand(action, false, param);
            }

            this.focus();
        },
        focus: function() {
            this.editor.focus();
        },
        setColor: function(hex, action) {
            console.log(action, hex);
            document.execCommand('styleWithCSS', false, true);
            document.execCommand(action, false, hex);
        },
        addLink: function() {
            let selection = window.getSelection();
            let range = selection.getRangeAt(0);
            let url = prompt('Enter a URL (To add a title, separate with a comma after the url):', 'http://');

            if (!url) return;

            url = url.split(',').map(item => item.trim());

            let link = url[0];
            let selectedText = selection.toString();
            let title = url.length > 1 ? url[1] : null;
            if (!title) {
                title = selectedText.length > 1 ? selectedText : link;
            }

            let newElement = this.createElement(['text-primary', 'opacity-80', 'hover:opacity-100'], title, 'a');
            newElement.setAttribute('href', link);
            newElement.setAttribute('target', '_blank');

            let wrapper = selection.anchorNode.parentNode;
            if (selection.isCollapsed || wrapper.tagName !== 'A') {
                range.deleteContents();
                range.insertNode(newElement);
            } else {
                if (wrapper.hasAttribute('data-editor')) {
                    wrapper.innerHTML = wrapper.innerHTML.replace(selectedText, '') + newElement.outerHTML;
                } else {
                    wrapper.parentNode.replaceChild(newElement, wrapper);
                }
            }
        },
        clearTrash() {
            let elements = this.editor.querySelectorAll('div, a');

            elements.forEach(element => {
                if (element.textContent.trim() === '') {  // Check if there's no text content (after trimming whitespace)
                    element.remove();  // Remove the element if it has no text
                }
            });
        }
    }));

    Alpine.directive('editor', (el, {modifiers, expression}, {cleanup}) => {
        const model = expression;

        if (!el.id) {
            el.id = crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36);
        }

        el.setAttribute('x-data', 'actions($el)');
        el.setAttribute('x-init', 'initialize($refs.editor)');
        el.setAttribute('x-on:collapsed-items-updated.window', 'initialize($refs.editor)');

        window.addEventListener('keydown', function(event) {
            // Check if the Tab key is pressed
            if (event.key === 'Tab') {
                event.preventDefault(); // Prevent default tab behavior (which moves focus)

                // Get the current selection and range
                const selection = window.getSelection();
                const range = selection.getRangeAt(0);

                // Create a tab space (can be adjusted to use any desired indentation)
                const nbsp = '\u00A0';
                const tabSpace = document.createTextNode(nbsp + nbsp + nbsp + nbsp);

                // Insert the tab space at the current cursor position
                range.insertNode(tabSpace);

                // Move the cursor right after the inserted tab space
                range.setStartAfter(tabSpace);
                range.setEndAfter(tabSpace);

                // Update the selection with the new range
                selection.removeAllRanges();
                selection.addRange(range);
            }
        });

        const icons = function(px) {
            return {
                undo: {
                    title: 'Undo last action',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-back-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 14l-4 -4l4 -4" /><path d="M5 10h11a4 4 0 1 1 0 8h-1" /></svg>`,
                },
                redo: {
                    title: 'Redo last action',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-arrow-forward-up"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M15 14l4 -4l-4 -4" /><path d="M19 10h-11a4 4 0 1 0 0 8h1" /></svg>`,
                },
                bold: {
                    title: 'Bold',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-bold"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 5h6a3.5 3.5 0 0 1 0 7h-6z" /><path d="M13 12h1a3.5 3.5 0 0 1 0 7h-7v-7" /></svg>`,
                },
                italic: {
                    title: 'Italic',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${px}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-italic"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 5l6 0" /><path d="M7 19l6 0" /><path d="M14 5l-4 14" /></svg>`,
                },
                underline: {
                    title: 'Underline',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-underline"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 5v5a5 5 0 0 0 10 0v-5" /><path d="M5 19h14" /></svg>`,
                },
                strikethrough: {
                    title: 'Strikethrough',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-strikethrough"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 12l14 0" /><path d="M16 6.5a4 2 0 0 0 -4 -1.5h-1a3.5 3.5 0 0 0 0 7h2a3.5 3.5 0 0 1 0 7h-1.5a4 2 0 0 1 -4 -1.5" /></svg>`,
                },
                removeFormat: {
                    title: 'Clear Formatting',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-clear-formatting"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M17 15l4 4m0 -4l-4 4" /><path d="M7 6v-1h11v1" /><path d="M7 19l4 0" /><path d="M13 5l-4 14" /></svg>`,
                },
                foreColor: {
                    title: 'Select Color',
                    icon: `<svg xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="black"  stroke="currentColor"  stroke-width="1"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-link-plus"><path d="M15.2,13.494s-3.6,3.9-3.6,6.3a3.65,3.65,0,0,0,7.3.1v-.1C18.9,17.394,15.2,13.494,15.2,13.494Zm-1.47-1.357.669-.724L12.1,5h-2l-5,14h2l1.43-4h2.943A24.426,24.426,0,0,1,13.726,12.137ZM11.1,7.8l1.86,5.2H9.244Z"></path></svg>`,
                },
                backColor: {
                    title: 'Highlight Text',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-palette"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 21a9 9 0 0 1 0 -18c4.97 0 9 3.582 9 8c0 1.06 -.474 2.078 -1.318 2.828c-.844 .75 -1.989 1.172 -3.182 1.172h-2.5a2 2 0 0 0 -1 3.75a1.3 1.3 0 0 1 -1 2.25" /><path d="M8.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M12.5 7.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /><path d="M16.5 10.5m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" /></svg>`,
                },
                code: {
                    title: 'Code Block',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-code"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M7 8l-4 4l4 4" /><path d="M17 8l4 4l-4 4" /><path d="M14 4l-4 16" /></svg>`,
                },
                indentHorizontally: {
                    title: 'Indent horizontally',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"   width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-indent-increase"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 6l-11 0" /><path d="M20 12l-7 0" /><path d="M20 18l-11 0" /><path d="M4 8l4 4l-4 4" /></svg>`,
                },
                indentVertically: {
                    title: 'Indent Vertically',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"   width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-spacing-vertical"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 20v-2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v2" /><path d="M4 4v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" /><path d="M16 12h-8" /></svg>`,
                },
                fontSize: {
                    title: 'Font Size',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-text-size"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M3 7v-2h13v2" /><path d="M10 5v14" /><path d="M12 19h-4" /><path d="M15 13v-1h6v1" /><path d="M18 12v7" /><path d="M17 19h2" /></svg>`,
                },
                link: {
                    title: 'Add link',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-link-plus"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 15l6 -6" /><path d="M11 6l.463 -.536a5 5 0 0 1 7.072 0a4.993 4.993 0 0 1 -.001 7.072" /><path d="M12.603 18.534a5.07 5.07 0 0 1 -7.127 0a4.972 4.972 0 0 1 0 -7.071l.524 -.463" /><path d="M16 19h6" /><path d="M19 16v6" /></svg>`,
                },
                insertUnorderedList: {
                    title: 'Toggle Bullet List',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 6l11 0" /><path d="M9 12l11 0" /><path d="M9 18l11 0" /><path d="M5 6l0 .01" /><path d="M5 12l0 .01" /><path d="M5 18l0 .01" /></svg>`,
                },
                insertOrderedList: {
                    title: 'Toggle Ordered List by number',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list-numbers"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M12 18h8" /><path d="M4 16a2 2 0 1 1 4 0c0 .591 -.5 1 -1 1.5l-3 2.5h4" /><path d="M6 10v-6l-2 2" /></svg>`,
                },
                insertLetterList: {
                    title: 'Toggle Ordered List by letter',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-list-letters"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M11 6h9" /><path d="M11 12h9" /><path d="M11 18h9" /><path d="M4 10v-4.5a1.5 1.5 0 0 1 3 0v4.5" /><path d="M4 8h3" /><path d="M4 20h1.5a1.5 1.5 0 0 0 0 -3h-1.5h1.5a1.5 1.5 0 0 0 0 -3h-1.5v6z" /></svg>`,
                },
                // blockquote: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-blockquote"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M6 15h15" /><path d="M21 19h-15" /><path d="M15 11h6" /><path d="M21 7h-6" /><path d="M9 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /><path d="M3 9h1a1 1 0 1 1 -1 1v-2.5a2 2 0 0 1 2 -2" /></svg>`,
                justifyLeft: {
                    title: 'Align Left',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-left-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 4v16" /><path d="M8 6h12" /><path d="M8 12h6" /><path d="M8 18h10" /></svg>`,
                },
                justifyCenter: {
                    title: 'Align Center',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-center"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M8 12l8 0" /><path d="M6 18l12 0" /></svg>`,
                },
                justifyRight: {
                    title: 'Align Right',
                    icon: `<svg  xmlns="http://www.w3.org/2000/svg"  width="${px}"  height="${px}"  viewBox="0 0 24 24"  fill="none"  stroke="currentColor"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-align-right-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M20 4v16" /><path d="M4 6h12" /><path d="M10 12h6" /><path d="M6 18h10" /></svg>`,
                }
            }
        };

        el.setAttribute('x-ref', 'buttons');

        function isSelectionBold() {
            var sel;
            if (window.getSelection) {
                sel = window.getSelection();
            }
            else if (document.getSelection) {
                sel = document.getSelection();
            }

            var raw_html = getSelectionAsHtml();

            // This is if nothing is selected
            if(raw_html==="") return false;

            var tempDiv = document.createElement('div');
            tempDiv.innerHTML = raw_html;

            var is_bold_nodes = []
            for (var node of tempDiv.childNodes) {
                var tags = [node.nodeName.toLowerCase()];

                // This covers selection that are inside bolded characters
                while(tags.includes("#text")) {
                    var start_tag = sel.anchorNode.parentNode.nodeName.toLowerCase();
                    var end_tag = sel.focusNode.parentNode.nodeName.toLowerCase();

                    tags = [start_tag, end_tag]
                }

                is_bold_nodes.push(containsOnly(['strong', 'b'], tags));
            }

            return (! is_bold_nodes.includes(false))
        }

        function getSelectionAsHtml() {
            var html = "";
            if (typeof window.getSelection != "undefined") {
                var sel = window.getSelection();
                if (sel.rangeCount) {
                    var container = document.createElement("div");
                    for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                        container.appendChild(sel.getRangeAt(i).cloneContents());
                    }
                    html = container.innerHTML;
                }
            } else if (typeof document.selection != "undefined") {
                if (document.selection.type == "Text") {
                    html = document.selection.createRange().htmlText;
                }
            }
            return html;
        }

        function containsOnly(array1, array2){
            return !array2.some(elem => !array1.includes(elem))
        }
    });
}
