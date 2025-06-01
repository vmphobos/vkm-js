export default function (Alpine) {
    Alpine.directive('tooltip', (el, { expression, modifiers }, { cleanup }) => {
        const rawTooltipText = el.getAttribute('x-tooltip') || expression || '';
        const position = modifiers.find(m => ['top', 'bottom', 'left', 'right'].includes(m)) || 'top';
        const color = modifiers.find(m => Object.keys(colorMap).includes(m)) || 'dark';

        let tooltipEl = null;

        const showTooltip = () => {
            if (tooltipEl) return;

            el.classList.add('relative');

            tooltipEl = document.createElement('div');
            tooltipEl.className = `${baseTooltipClass} ${colorMap[color].tooltip} ${positionMap[position].tooltip}`;

            const content = document.createElement('div');
            content.textContent = rawTooltipText;
            tooltipEl.appendChild(content);

            const arrow = document.createElement('div');
            arrow.className = `absolute ${positionMap[position].arrow} ${colorMap[color].arrow}`;
            tooltipEl.appendChild(arrow);

            el.appendChild(tooltipEl);
        };

        const hideTooltip = () => {
            if (tooltipEl && tooltipEl.parentNode) {
                tooltipEl.remove();
                tooltipEl = null;
            }
        };

        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);

        cleanup(() => {
            el.removeEventListener('mouseenter', showTooltip);
            el.removeEventListener('mouseleave', hideTooltip);
            hideTooltip();
        });
    });
}

// Base styles
const baseTooltipClass = `
    absolute z-50 px-3 py-1 text-sm rounded shadow-lg transition-opacity duration-150 whitespace-nowrap
`;

// Color classes
const colorMap = {
    dark: {
        tooltip: 'bg-black/90 text-white',
        arrow: 'border-t-black'
    },
    light: {
        tooltip: 'bg-white/90 text-black',
        arrow: 'border-t-white'
    },
    info: {
        tooltip: 'bg-blue-200/90 text-blue-900',
        arrow: 'border-t-blue-200'
    },
    success: {
        tooltip: 'bg-emerald-200/90 text-emerald-900',
        arrow: 'border-t-green-200'
    },
    danger: {
        tooltip: 'bg-red-200/90 text-red-900',
        arrow: 'border-t-red-200'
    },
    warning: {
        tooltip: 'bg-yellow-200/90 text-yellow-900',
        arrow: 'border-t-yellow-200'
    }
};

// Position and arrow placement
const positionMap = {
    top: {
        tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        arrow: 'top-full left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-t-8'
    },
    bottom: {
        tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
        arrow: 'bottom-full left-1/2 -translate-x-1/2 border-x-8 border-x-transparent border-b-8'
    },
    left: {
        tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
        arrow: 'left-full top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-l-8'
    },
    right: {
        tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
        arrow: 'right-full top-1/2 -translate-y-1/2 border-y-8 border-y-transparent border-r-8'
    }
};
