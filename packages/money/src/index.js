Alpine.directive('money', (el, { modifiers, expression }) => {
    let [locale = 'en', currency = 'EUR', decimals] = modifiers || [];

    const currencyOverrides = {
        ZAR: 'R', TRY: '₺', HRK: 'kn', DKK: 'kr', BGN: 'лв', AED: 'د.إ',
        RUB: '₽', UAH: '₴', JPY: '¥', AUD: 'A$', CNY: '¥', INR: '₹',
        IDR: 'Rp', MYR: 'RM', PHP: '₱', SGD: 'S$', KRW: '₩', TWD: 'NT$',
        THB: '฿', VND: '₫', BDT: '৳', PKR: 'Rs', LKR: 'Rs', NPR: 'Rs',
        MMK: 'K', KZT: '₸', UZS: 'so’m', MNT: '₮', KHR: '៛', LAK: '₭',
        MOP: 'MOP$', MVR: '.ރ', BTN: 'Nu.', BND: 'B$', TLS: 'US$', YER: '﷼'
    };

    const parsedAmount = parseFloat(el.textContent.trim());
    const parsedDecimals = parseInt(decimals);

    const formatter = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
        currencyDisplay: expression || 'symbol',
        ...(isNaN(parsedDecimals) ? {} : {
            minimumFractionDigits: parsedDecimals,
            maximumFractionDigits: parsedDecimals
        })
    });

    let formatted = isNaN(parsedAmount)
        ? (formatter.formatToParts(0).find(p => p.type === 'currency')?.value || '')
        : formatter.format(parsedAmount);

    if (currencyOverrides[currency]) {
        formatted = formatted.replace(currency, currencyOverrides[currency]);
    }

    el.textContent = formatted;
});
