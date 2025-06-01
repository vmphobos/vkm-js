export default function (Alpine) {
    Alpine.directive('money', (el, {modifiers, expression}, {cleanup}) => {
        let format_for_humans = '',
            [locale, currency, decimals] = modifiers || ['en', 'EUR', null],
            number_format = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency,
                currencyDisplay: expression || 'symbol'
            });

        let amount = parseFloat(el.innerText);
        if (!isNaN(amount)) {
            decimals = parseInt(decimals);
            if (!isNaN(decimals)) {
                amount = amount.toFixed(decimals);
            }

            format_for_humans = number_format.format(amount);
        }
        else {
            //this will return only the currency symbol if expression is empty or not a number
            format_for_humans = number_format.formatToParts(0).map((p) => p.value)[0];
        }

        if (format_for_humans.includes('ZAR')) {
            format_for_humans = format_for_humans.replace('ZAR', 'R');
        }

        if (format_for_humans.includes('TRY')) {
            format_for_humans = format_for_humans.replace('TRY', '₺');
        }

        if (format_for_humans.includes('HRK')) {
            format_for_humans = format_for_humans.replace('HRK', 'kn');
        }

        if (format_for_humans.includes('DKK')) {
            format_for_humans = format_for_humans.replace('DKK', 'kr');
        }

        if (format_for_humans.includes('BGN')) {
            format_for_humans = format_for_humans.replace('BGN', 'лв');
        }

        if (format_for_humans.includes('AED')) {
            format_for_humans = format_for_humans.replace('AED', 'د.إ');
        }

        el.innerText = format_for_humans;
    });
}
