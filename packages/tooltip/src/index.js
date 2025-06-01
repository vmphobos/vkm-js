export default function (Alpine) {
    Alpine.directive('tooltip', (el, { expression, modifiers }, { cleanup }) => {
        let tooltipEl;

        // Defaults
        const position = modifiers.find(m => ['top', 'bottom', 'left', 'right'].includes(m)) || 'top';
        const color = modifiers.find(m => ['success', 'danger', 'info', 'warning', 'dark', 'light'].includes(m)) || 'dark';

        // Tooltip HTML
        function createTooltip(text) {
            const wrapper = document.createElement('div');
            wrapper.setAttribute('x-cloak', '');
            wrapper.className = `
                absolute whitespace-nowrap text-sm px-3 py-1 rounded-md shadow-lg z-50
                ${colorClasses[color] || colorClasses.dark}
                ${positionClasses[position]}
            `;

            const arrow = document.createElement('div');
            arrow.className = `absolute ${arrowClasses[position]}`;

            wrapper.textContent = text;
            wrapper.appendChild(arrow);
            return wrapper;
        }

        // Show tooltip
        const showTooltip = () => {
            if (tooltipEl) return;

            const tooltipText = Alpine.evaluate(el, expression);
            tooltipEl = createTooltip(tooltipText);
            el.appendChild(tooltipEl);
        };

        // Hide tooltip
        const hideTooltip = () => {
            if (tooltipEl && tooltipEl.parentNode) {
                tooltipEl.parentNode.removeChild(tooltipEl);
                tooltipEl = null;
            }
        };

        el.classList.add('relative'); // Ensure relative positioning
        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);

        cleanup(() => {
            el.removeEventListener('mouseenter', showTooltip);
            el.removeEventListener('mouseleave', hideTooltip);
        });
    });
}

const colorClasses = {
    success: 'bg-green-200 text-green-900',
    danger: 'bg-red-200 text-red-900',
    info: 'bg-blue-200 text-blue-900',
    warning: 'bg-yellow-200 text-yellow-900',
    light: 'bg-white text-black',
    dark: 'bg-black text-white'
};

const positionClasses = {
    top: '-top-2 left-1/2 -translate-x-1/2 -translate-y-full',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'left-0 -translate-x-full top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2'
};

const arrowClasses = {
    top: 'bottom-0 left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8 border-t-inherit',
    bottom: '-top-2 left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-b-8 border-b-inherit',
    left: 'right-0 top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-l-8 border-l-inherit',
    right: 'left-0 top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-r-8 border-r-inherit'
};
