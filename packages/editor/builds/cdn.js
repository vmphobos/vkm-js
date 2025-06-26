import editor from '../src/index.js';

document.addEventListener('alpine:init', () => {
    window.Alpine.plugin(editor);
});
