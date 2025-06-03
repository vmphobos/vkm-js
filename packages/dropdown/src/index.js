export default function (Alpine) {
    Alpine.data('dropdown', () => ({
        open: false,
    }));

    Alpine.directive('dropdown', (el, { modifiers }, { cleanup }) => {
        let triggerEl = el.querySelector('[data-trigger]');
        let dropdownEl = el.querySelector('[data-dropdown]');

        if (!triggerEl || !dropdownEl) {
            console.warn('Dropdown JS: Attribute data-trigger or data-dropdown is not set!');
            return;
        }

        // Add mouseenter and mouseleave events for trigger and dropdown elements
        triggerEl.setAttribute('x-on:mouseenter', 'open = true');
        triggerEl.setAttribute('x-on:mouseleave', 'open = false');

        // On the dropdown itself, maintain its visibility while hovering
        dropdownEl.setAttribute('x-on:mouseenter', 'open = true');
        dropdownEl.setAttribute('x-on:mouseleave', 'open = false');

        // Use the wrapper to handle hover outside to close the dropdown
        el.setAttribute('x-on:mouseenter', 'open = true');
        el.setAttribute('x-on:mouseleave', 'open = false');

        // Make sure the dropdown is initially hidden
        dropdownEl.setAttribute('x-cloak', '');

        // You can add any custom styles for the dropdown here
        dropdownEl.classList.add('absolute', 'mt-2', 'shadow-lg', 'bg-white/90', 'dark:bg-black/90', 'rounded-lg', 'flex', 'flex-col', 'w-full', 'min-w-72', 'z-1000', 'py-2');
    });

}
