export default function (Alpine) {
    Alpine.data('dropdown', () => ({
        open: false,
        closeTimeout: null,  // Store the timeout for closing
        setCloseTimeout() {
            // Set a close timeout to avoid immediate close when hovering between trigger and dropdown
            this.closeTimeout = setTimeout(() => {
                this.open = false;
            }, 300);  // 300ms delay
        },
        clearCloseTimeout() {
            // Clear the close timeout if hovering over the dropdown
            clearTimeout(this.closeTimeout);
        }
    }));

    Alpine.directive('dropdown', (el, { modifiers }, { cleanup }) => {
        let { triggerEl, dropdownEl, position, closeOnClickInside } = getDropdownOptions(el, modifiers);
        const placement = 'x-anchor.' + (position || 'bottom-start');

        if (!triggerEl || !dropdownEl) {
            return !triggerEl
                ? console.warn('Dropdown JS: Attribute data-trigger is not set!')
                : console.warn('Dropdown JS: Attribute data-dropdown is not set!');
        }

        if (!el.id) {
            // Random ID for parent element if not exists
            el.id = crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36);
        }

        // Popover wrapper add x-data
        el.setAttribute('x-data', 'dropdown');
        el.classList.add('relative');
        el.setAttribute('x-on:keydown.esc.window', 'close()');
        el.setAttribute('x-on:keydown.escape.prevent.stop', 'close()');

        // Element on click via data-toggle
        triggerEl.setAttribute('x-ref', 'dropdownBtn');
        triggerEl.setAttribute('x-on:keydown.space.prevent', 'keyboardTrigger = true');
        triggerEl.setAttribute('x-on:keydown.enter.prevent', 'keyboardTrigger = true');
        triggerEl.setAttribute('x-on:keydown.down.prevent', 'keyboardTrigger = true');
        triggerEl.setAttribute(':aria-expanded', 'open || keyboardTrigger');
        triggerEl.setAttribute('aria-haspopup', 'true');
        triggerEl.setAttribute('aria-expanded', 'true');

        // Popover element data-popover
        dropdownEl.setAttribute('x-cloak', '');
        dropdownEl.setAttribute('x-transition.origin.top.left', '');
        dropdownEl.setAttribute('x-trap', 'keyboardTrigger');
        dropdownEl.setAttribute(placement, '$refs.dropdownBtn');
        dropdownEl.setAttribute('x-ref', 'panel');
        dropdownEl.setAttribute('x-show', 'open || keyboardTrigger');

        if (!modifiers.includes('custom')) {
            dropdownEl.classList.add('absolute', 'mt-2', 'shadow-lg', 'bg-white/90', 'dark:bg-black/90', 'rounded-lg', 'flex', 'flex-col', 'w-full', 'min-w-72', 'z-1000', 'py-2');
        }

        dropdownEl.setAttribute('x-on:click.outside', 'close()');

        if (closeOnClickInside) {
            dropdownEl.setAttribute('x-on:click', 'close()');
        }

        dropdownEl.setAttribute('x-on:keydown.down.prevent', '$focus.wrap().next()');
        dropdownEl.setAttribute('x-on:keydown.up.prevent', '$focus.wrap().previous()');
        dropdownEl.setAttribute('role', 'menu');

        // Handle hover behavior
        if (modifiers.includes('hover')) {
            // Hover: Set mouseenter and mouseleave events for hover behavior
            triggerEl.setAttribute('x-on:mouseenter', 'open = true; clearCloseTimeout()');
            triggerEl.setAttribute('x-on:mouseleave', 'setCloseTimeout()');
            dropdownEl.setAttribute('x-on:mouseenter', 'open = true; clearCloseTimeout()');
            dropdownEl.setAttribute('x-on:mouseleave', 'setCloseTimeout()');
        } else {
            // Default click behavior
            triggerEl.setAttribute('x-on:click', 'toggle()');
        }

        el.setAttribute('x-data', 'dropdown'); // This now refers to globally registered Alpine.data
    });

    function getDropdownOptions(el, modifiers) {
        let triggerEl = el.querySelector('[data-trigger]'),
            dropdownEl = el.querySelector('[data-dropdown]'),
            position = getPlacement(modifiers),
            closeOnClickInside = modifiers.includes('select');

        return { triggerEl, dropdownEl, position, closeOnClickInside };
    }

    function getPlacement(modifiers) {
        return ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end']
            .find(i => modifiers.includes(i)) || '';
    }
}
