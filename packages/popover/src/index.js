// Color mapping for different states
const colorMapping = {
    'danger': ['bg-red-200/90', 'text-red-900'],
    'success': ['bg-emerald-200/90', 'text-emerald-900'],
    'warning': ['bg-yellow-200/90', 'text-yellow-900'],
    'info': ['bg-sky-200/90', 'text-sky-900'],
    'primary': ['bg-blue-600', 'text-blue-900'],
    'secondary': ['bg-gray-600', 'text-gray-900'],
    'light': ['bg-gray-300/90', 'text-black'],
    'dark': ['bg-black/90', 'text-white'],
};

// Function to get the color class based on x-popover modifier
function getColorClass(modifiers) {
    // Default fallback to neutral theme
    let color = 'light';  // Default is light theme
    modifiers.forEach(modifier => {
        if (colorMapping[modifier]) {
            color = modifier;  // Use the modifier if it exists in the mapping
        }
    });
    return colorMapping[color] || colorMapping['light'];  // Return corresponding color classes
}

export default function (Alpine) {
    function getPopoverOptions(el, modifiers) {
        let triggerEl = el.querySelector('[data-trigger]'),
            popoverEl = el.querySelector('[data-popover]'),
            isHoverable = modifiers.includes('hover');

        let position = getPlacement(modifiers) || 'bottom';
        let transition = getAnimation(modifiers);

        return { triggerEl, popoverEl, isHoverable, position, transition };
    }

    function getPlacement(modifiers) {
        return ['top', 'top-start', 'top-end', 'right', 'right-start', 'right-end', 'bottom', 'bottom-start', 'bottom-end', 'left', 'left-start', 'left-end'].find(i => modifiers.includes(i)) || '';
    }

    function getAnimation(modifiers) {
        return ['animate-none', 'animate-drop'].find(i => modifiers.includes(i)) || 'animate-fade';
    }

    Alpine.data('popover', (isHoverable) => ({
        open: false,
        isHoverable: isHoverable,
        show() {
            if (!this.open) {
                this.open = true;
            }
            else if (!this.isHoverable) {
                this.open = false;
            }
        },
        hide() {
            this.open = false;
        }
    }));

    Alpine.directive('popover', (el, { modifiers, expression }, { cleanup }) => {
        let { triggerEl, popoverEl, isHoverable, position, transition } = getPopoverOptions(el, modifiers);
        const [bgColor, textColor] = getColorClass(modifiers); // Get dynamic color classes

        // Default classes applied when no modifier is passed
        const popoverClass = `${bgColor} ${textColor} z-998 w-96 min-w-fit max-w-full sm:max-w-[320px] md:max-w-sm lg:max-w-md xl:max-w-lg rounded-lg whitespace-normal break-words font-sans font-normal text-sm border border-light shadow-lg shadow-black/20 focus:outline-hidden dark:bg-dark-900 dark:border-dark dark:text-light dark:shadow-black/75 ${transition}`;

        // Apply the generated class list
        popoverEl.classList.add(popoverClass);

        // Handle position and arrow functionality
        makeArrow(triggerEl, popoverEl, el.id, position, expression, modifiers);

        cleanup(() => {
            triggerEl.removeAttribute('x-on:mouseenter.self');
            triggerEl.removeAttribute('x-on:mouseleave');
            triggerEl.removeAttribute('x-on:click');
            popoverEl.removeAttribute('x-on:click.outside');
            // Remove arrow element if exists
            const arrowEl = document.getElementById(`arrow-${el.id}`);
            if (arrowEl) arrowEl.remove();
        });
    });

    function makeArrow(triggerEl, popoverEl, id, position, expression, modifiers) {
        // Get the appropriate color class based on the modifiers
        const [bgColor, textColor] = getColorClass(modifiers);

        // Arrow unique ID
        let arrow_id = `arrow-${id}`;

        // Insert arrow with dynamic classes
        popoverEl.insertAdjacentHTML('afterbegin', `<span id="${arrow_id}" class="popover-arrow absolute z-999 h-3 w-3 border-t border-l animate-fade" x-show="open"></span>`);

        // Get the arrow element
        const arrowEl = document.getElementById(arrow_id);
        if (!arrowEl) {
            return; // Early return if arrow isn't found
        }

        // Apply the color classes to the arrow
        arrowEl.classList.add(bgColor, textColor, 'border-t', 'border-l');
        arrowEl.classList.add('dark:bg-black/90', 'dark:border-t-dark', 'dark:border-l-dark'); // Dark mode fallback

        // Continue with the positioning and arrow styling logic
        const arrowLen = arrowEl.offsetWidth || 0;
        const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
        const placement = position || 'bottom';

        const overflowMiddleware = {
            name: 'overflowMiddleware',
            async fn(state) {
                const overflow = await detectOverflow(state, {
                    boundary: expression,
                });
                return {};
            },
        };

        autoUpdate(triggerEl, popoverEl, () => {
            computePosition(triggerEl, popoverEl, {
                placement,
                middleware: [
                    offset(10),
                    position ? flip() : autoPlacement(),
                    shift(),
                    overflowMiddleware,
                    arrow({ element: arrowEl }),
                ]
            }).then(({ x, y, middlewareData, placement }) => {
                Object.assign(popoverEl.style, {
                    position: 'absolute',
                    left: `${x}px`,
                    top: `${y}px`,
                });

                const side = placement.split('-')[0];
                const staticSide = {
                    top: 'bottom',
                    right: 'left',
                    bottom: 'top',
                    left: 'right'
                }[side];

                const transformArrow = {
                    top: 'rotate(225deg)',
                    right: 'rotate(315deg)',
                    bottom: 'rotate(45deg)',
                    left: 'rotate(135deg)',
                }[side];

                if (middlewareData.arrow) {
                    const { x, y } = middlewareData.arrow;
                    Object.assign(arrowEl.style, {
                        left: x != null ? `${x}px` : '',
                        top: y != null ? `${y}px` : '',
                        right: '',
                        bottom: '',
                        [staticSide]: `-6px`, // Position of the arrow
                        transform: transformArrow,
                    });
                }
            });
        });
    }
}
