export default function (Alpine) {
    Alpine.directive('money', (el, { modifiers, expression }, { evaluateLater, effect }) => {
        let [locale = 'en', currency = 'EUR', decimals] = modifiers || [];

        const currencyOverrides = {
            // Your original overrides
            ZAR: 'R',       // South African Rand
            TRY: '₺',       // Turkish Lira
            HRK: 'kn',      // Croatian Kuna
            DKK: 'kr',      // Danish Krone
            BGN: 'лв',      // Bulgarian Lev
            AED: 'د.إ',     // UAE Dirham

            // Russia & Eastern Europe
            RUB: '₽',       // Russian Ruble
            UAH: '₴',       // Ukrainian Hryvnia

            // Asia-Pacific & Australia
            JPY: '¥',       // Japanese Yen
            AUD: 'A$',      // Australian Dollar
            CNY: '¥',       // Chinese Yuan
            INR: '₹',       // Indian Rupee
            IDR: 'Rp',      // Indonesian Rupiah
            MYR: 'RM',      // Malaysian Ringgit
            PHP: '₱',       // Philippine Peso
            SGD: 'S$',      // Singapore Dollar
            KRW: '₩',       // South Korean Won
            TWD: 'NT$',     // New Taiwan Dollar
            THB: '฿',       // Thai Baht
            VND: '₫',       // Vietnamese Đồng
            BDT: '৳',       // Bangladeshi Taka
            PKR: 'Rs',      // Pakistani Rupee
            LKR: 'Rs',      // Sri Lankan Rupee
            NPR: 'Rs',      // Nepalese Rupee
            MMK: 'K',       // Myanmar Kyat
            KZT: '₸',       // Kazakhstani Tenge
            UZS: 'so’m',    // Uzbekistani Som
            MNT: '₮',       // Mongolian Tögrög
            KHR: '៛',       // Cambodian Riel
            LAK: '₭',       // Laotian Kip
            MOP: 'MOP$',    // Macanese Pataca
            MVR: '.ރ',      // Maldivian Rufiyaa
            BTN: 'Nu.',     // Bhutanese Ngultrum
            BND: 'B$',      // Brunei Dollar
            TLS: 'US$',     // Timor-Leste (uses US Dollar)
            YER: '﷼'        // Yemeni Rial
        };

        const evaluateDisplay = evaluateLater(expression || "'symbol'");

        effect(() => {
            const raw = el.textContent.trim();
            let amount = parseFloat(raw);

            evaluateDisplay((currencyDisplay) => {
                let formatted = '';
                let formatterOptions = {
                    style: 'currency',
                    currency,
                    currencyDisplay: currencyDisplay || 'symbol',
                };

                const parsedDecimals = parseInt(decimals);

                if (!isNaN(parsedDecimals)) {
                    formatterOptions.minimumFractionDigits = parsedDecimals;
                    formatterOptions.maximumFractionDigits = parsedDecimals;
                }

                const formatter = new Intl.NumberFormat(locale, formatterOptions);

                if (!isNaN(amount)) {
                    let formattedAmount = amount;

                    if (!isNaN(parsedDecimals)) {
                        formattedAmount = parseFloat(amount.toFixed(parsedDecimals));
                    }

                    formatted = formatter.format(formattedAmount);
                } else {
                    const symbolPart = formatter.formatToParts(0).find(p => p.type === 'currency');
                    formatted = symbolPart?.value || '';
                }

                Object.entries(currencyOverrides).forEach(([code, symbol]) => {
                    if (formatted.includes(code)) {
                        formatted = formatted.replace(code, symbol);
                    }
                });

                el.textContent = formatted;
            });
        });
    });
}
