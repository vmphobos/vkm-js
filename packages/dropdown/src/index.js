export default function (Alpine) {
    Alpine.data('dropdown', () => ({
        open: false,
        clearCloseTimeout() {
            // No need to clear timeout since we're not using it anymore
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

        // Create the wrapper element
        const wrapper = document.createElement('div');
        wrapper.setAttribute('x-ref', 'dropdownWrapper');
        wrapper.classList.add('relative', 'group'); // Use group for grouping hover styles

        // Add trigger and dropdown to the wrapper
        wrapper.appendChild(triggerEl);
        wrapper.appendChild(dropdownEl);

        // Replace the original content with the wrapper
        el.appendChild(wrapper);

        // Element on click via data-toggle
        triggerEl.setAttribute('x-on:mouseenter', 'open = true');
        triggerEl.setAttribute('x-on:mouseleave', 'open = false');
        dropdownEl.setAttribute('x-on:mouseenter', 'open = true');
        dropdownEl.setAttribute('x-on:mouseleave', 'open = false');

        // Popover element data-popover
        dropdownEl.setAttribute('x-cloak', '');
        dropdownEl.setAttribute('x-transition.origin.top.left', '');
        dropdownEl.setAttribute('x-trap', 'keyboardTrigger');
        dropdownEl.setAttribute(placement, '$refs.dropdownBtn');
        dropdownEl.setAttribute('x-ref', 'panel');
        dropdownEl.setAttribute('x-show', 'open');

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

        // Add transparent buffer below the trigger
        const buffer = document.createElement('div');
        buffer.classList.add('absolute', 'top-0', 'left-0', 'w-full', 'h-full', 'bg-transparent', 'z-10');
        wrapper.appendChild(buffer); // Make the buffer part of the wrapper

        // Handle hover behavior for the group
        wrapper.setAttribute('x-on:mouseenter', 'open = true');
        wrapper.setAttribute('x-on:mouseleave', 'open = false');

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
