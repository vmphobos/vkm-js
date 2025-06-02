import {computePosition, arrow, flip, offset, shift, autoUpdate, autoPlacement, detectOverflow } from '@floating-ui/dom';

export default function (Alpine) {
    function getPopoverOptions(el, modifiers) {
        let triggerEl = el.querySelector('[data-trigger]'),
            popoverEl = el.querySelector('[data-popover]'),
            isHoverable = modifiers.includes('hover');

        let position = getPlacement(modifiers) || 'bottom';
        let transition = getAnimation(modifiers);

        // let anchor = 'x-anchor.offset.10' + (position ? `.${position}` : '');

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
            if(!this.open) {
                this.open = true;
            }
            else if(!this.isHoverable) {
                //close on click if not hover functionality
                this.open = false;
            }
        },
        hide() {
            this.open = false;
        }
    }));

    Alpine.directive('popover', (el, {modifiers, expression}, {cleanup}) => {
        let { triggerEl, popoverEl, isHoverable, position, transition } = getPopoverOptions(el, modifiers);

        if(!triggerEl || !popoverEl) {
            return !triggerEl
                ? console.warn('Popover JS: Attribute data-trigger is not set!')
                : console.warn('Popover JS: Attribute data-popover is not set!');
        }

        if (!el.id) {
            //random id for parent element if not exists
            el.id = crypto.getRandomValues(new Uint32Array(1))[0].toString(36) + Date.now().toString(36);
        }

        //Popover wrapper add x-data
        el.setAttribute('x-data', `popover(${isHoverable})`);

        //Element on click via data-toggle
        triggerEl.setAttribute('x-ref', 'button');

        //Popover element data-popover
        popoverEl.id = 'popover-' + el.id;

        if(!isHoverable) {
            triggerEl.setAttribute('x-on:click', 'show');
            popoverEl.setAttribute('x-on:click.outside', 'hide');
        }
        else {
            triggerEl.setAttribute('x-on:mouseenter.self', 'show');
            triggerEl.setAttribute('x-on:mouseleave', 'hide');
        }

        popoverEl.setAttribute('x-show', 'open');
        const popoverClass = `z-998 w-96 min-w-fit max-w-full sm:max-w-[320px] md:max-w-sm lg:max-w-md xl:max-w-lg rounded-lg whitespace-normal break-words font-sans font-normal text-sm text-dark bg-white border border-light shadow-lg shadow-black/20 focus:outline-hidden dark:bg-dark-900 dark:border-dark dark:text-light dark:shadow-black/75 ${transition}`;

        popoverEl.classList.add(popoverClass);

        let overflowEl = 'clippingAncestors';
        if (expression) {
            const overflowEl = document.getElementById(expression);
            if (!overflowEl) {
                console.error('Popover: Make sure the ID passed to x-popover exists in a dom element.');
            }
        }

        makeArrow(triggerEl, popoverEl, el.id, position, overflowEl, expression);

        cleanup(() => {
            triggerEl.removeAttribute('x-on:mouseenter.self');
            triggerEl.removeAttribute('x-on:mouseleave');
            triggerEl.removeAttribute('x-on:click');
            popoverEl.removeAttribute('x-on:click.outside');
            // Remove arrow element if exists
            const arrowEl = document.getElementById(arrow_id);
            if (arrowEl) arrowEl.remove();
        });
    });

    function makeArrow(triggerEl, popoverEl, id, position, overflowEl, expression) {
        //the arrow unique id
        let arrow_id = `arrow-${id}`;

        //insert arrow to the dom
        popoverEl.insertAdjacentHTML('afterbegin', `<span id="${arrow_id}" class="absolute z-999 h-3 w-3 bg-white border-t border-l border-t-light border-l-light dark:bg-dark-900 dark:border-t-dark dark:border-l-dark animate-fade" x-show="open"></span>`);

        //get arrow element
        const arrowEl = document.getElementById(arrow_id);
        if (!arrowEl) {
            return; // Early return if arrow isn't found
        }
        const arrowLen = arrowEl.offsetWidth || 0;
        // console.log('arrowLen is ' + arrowLen);
        const floatingOffset = Math.sqrt(2 * arrowLen ** 2) / 2;
        const placement = position || 'bottom';

        const overflowMiddleware = {
            name: 'overflowMiddleware',
            async fn(state) {
                const overflow = await detectOverflow(state, {
                    boundary: overflowEl,
                });
                // console.log(expression + ' should flip:', overflow.top >= 0);
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
                    // console.log('popover has arrow');
                    const { x, y } = middlewareData.arrow;
                    Object.assign(arrowEl.style, {
                        left: x != null ? `${x}px` : '',
                        top: y != null ? `${y}px` : '',
                        // Ensure the static side gets unset when
                        // flipping to other placements' axes.
                        right: '',
                        bottom: '',
                        [staticSide]: `-6px`, //${(-arrowLen / 2) - 6}
                        transform: transformArrow,
                    });
                }
            });
        });
    }
}
