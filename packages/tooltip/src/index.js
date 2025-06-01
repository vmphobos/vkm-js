export default function (Alpine) {
    Alpine.directive('tooltip', (el, {modifiers, expression}, {cleanup}) => {
        let tooltipId = 'tooltip-' + crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36),
            tooltipClass = 'absolute z-[1000] w-max max-w-[400px] text-sm rounded-md shadow-lg -translate-x-1/2 -translate-y-full before:absolute before:opacity-90 before:h-0 before:w-0 before:mt-0 before:flex-none before:border-e-4 before:border-s-4 before:border-t-4 before:border-e-transparent before:border-s-transparent',
            tooltipContent = expression.replace(/'/g, "\\'").replace(/"/g, '&quot;'),
            tooltipArrow = !modifiers.includes('no-arrow'),
            tooltipPosition = null,
            positions = ['top', 'bottom', 'left', 'right'],
            colors = {
                success: 'bg-emerald-200/90 text-emerald-900 before:border-t-emerald-200',
                danger: 'bg-red-200/90 text-red-900 before:border-t-red-200',
                info: 'bg-sky-200/90 text-sky-900 before:border-t-sky-200',
                warning: 'bg-yellow-200/90 text-yellow-900 before:border-t-yellow-200',
                light: 'bg-white-200/80 text-black before:border-t-gray-200',
                dark: 'bg-black/80 text-white before:border-t-black'
            },
            elementPosition = getComputedStyle(el).position;

        for (let position of positions) {
            if (modifiers.includes(position)) {
                tooltipPosition = position;
                break;
            }
        }

        let autoPosition = !tooltipPosition;

        let tooltip_color = 'text-light bg-dark/90 before:border-t-dark dark:text-dark-50 dark:shadow-black/10 dark:bg-dark-700/90 dark:before:border-t-dark-700 shadow-lg';

        for (let key of colors) {
            if (modifiers.includes(color)) {
                tooltip_color = colors[key];
                break;
            }
        }

        tooltipClass += tooltip_color;
        
        if (!['relative', 'absolute', 'fixed'].includes(elementPosition)) {
            el.style.position = 'relative';
        }

        if(!el.dataset.tooltip) {
            el.dataset.tooltip = tooltipId;
        }

        let showTooltip = function (event) {
            tooltipId = el.dataset.tooltip;
            let tooltip_div = document.getElementById(tooltipId);
            if(!tooltip_div) {
                let tooltipHTML = `
                    <div id="${tooltipId}" x-data="{ show: false, tooltipContent: '` + tooltipContent + `', tooltipArrow: ${tooltipArrow}, tooltipPosition: '${tooltipPosition}', removeTooltips: () => document.querySelectorAll('.tooltip').forEach(e => e.remove()) }" x-ref="tooltip" x-init="setTimeout(function(){ show = true; }, 1);" x-show="show" class="${tooltipClass}" x-cloak wire:ignore x-on:click.outside="removeTooltips()">
                        <div x-show="show" x-transition:enter="transition ease-out duration-100" x-transition:enter-start="opacity-0 translate-y-2" x-transition:enter-end="opacity-100 translate-y-0" x-transition:leave="transition ease-in duration-75" x-transition:leave-start="opacity-100 translate-y-0" x-transition:leave-end="opacity-0 -translate-y-10" class="tooltip-content" x-text="tooltipContent">
                        </div>
                    </div>
                `;
                document.body.insertAdjacentHTML('beforeend', tooltipHTML);
                tooltip_div = document.getElementById(tooltipId);
                //add position class
            }

            let el_position = el.getBoundingClientRect(),
                body_rect = document.body.getBoundingClientRect();

            if (autoPosition) {
                //auto position tooltip top or bottom when no position
                tooltipPosition = (screen.height / 4) > el_position.y ? 'bottom' : 'top';

                if ((el_position.width - el_position.x) < 150 && (body_rect.width - el_position.x) < 150) {
                    tooltipPosition = 'right';
                } else if ((body_rect.width - el_position.x) < 150) {
                    tooltipPosition = 'left';
                }
            }

            tooltip_div.classList.add(`tooltip-${tooltipPosition}`);

            let tooltip_top = (window.scrollY + el_position.top);
            if (tooltipPosition === 'bottom') {
                tooltip_top = (window.scrollY + el_position.bottom);
            }

            if (tooltipPosition === 'right' || tooltipPosition === 'left') {
                tooltip_top += (el_position.height / 2); //middle align tooltip

                //position tooltip according to position modifier
                tooltip_div.style[tooltipPosition] = (tooltipPosition === 'left' ? (el_position.left) : (body_rect.width - el_position.right)) + 'px';
            } else {
                //center tooltip in element
                tooltip_div.style.left = (window.scrollX + el_position.left + (el_position.width / 2)) + 'px';
            }

            tooltip_div.style.top = tooltip_top + 'px';
        };

        let hideTooltip = function (event) {
            //this will always remove all tooltips
            document.querySelectorAll('.tooltip').forEach(e => e.remove());
        };

        if(modifiers.includes('show')) {
            showTooltip();
        }

        el.addEventListener('mouseenter', showTooltip);
        el.addEventListener('mouseleave', hideTooltip);

        cleanup(() => {
            el.removeEventListener('mouseenter', showTooltip);
            el.removeEventListener('mouseleave', hideTooltip);
        })
    });
}
