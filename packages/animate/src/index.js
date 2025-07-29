export default function (Alpine) {
    Alpine.directive('animate', (el, { value, modifiers }) => {
        const animationTypes = ['fade', 'zoom', 'up', 'down'];

        // Determine animation type: from modifier or use 'fade'
        const type = modifiers.find(mod => animationTypes.includes(mod)) || 'fade';

        // Determine duration: from modifier or directive value or fallback
        const modifierDuration = modifiers.find(mod => /^\d+$/.test(mod));
        const duration = modifierDuration || value || '1000';

        // Apply base transition
        el.style.transition = `all ${duration}ms ease`;

        // Initial state
        switch (type) {
            case 'fade':
                el.style.opacity = 0;
                break;
            case 'up':
                el.style.opacity = 0;
                el.style.transform = 'translateY(20px)';
                break;
            case 'down':
                el.style.opacity = 0;
                el.style.transform = 'translateY(-50px)';
                break;
            case 'zoom':
                el.style.opacity = 0;
                el.style.transform = 'scale(0.8)';
                break;
        }

        // Intersect logic
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                el.style.opacity = 1;
                if (type === 'up' || type === 'down') el.style.transform = 'translateY(0)';
                if (type === 'zoom') el.style.transform = 'scale(1)';
                observer.unobserve(el);
            }
        }, { threshold: 0.1 });

        observer.observe(el);
    });
}
