document.addEventListener('alpine:init', () => {
    Alpine.data('datepicker', (model) => ({
        locale: 'en',
        open: false,
        day: new Date().getDate().toString().padStart(2, '0'),
        month: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        year: new Date().getFullYear(),
        date: '',
        display_date: '',
        init() {
            if (this.$wire.get(model)) {
                const [y, m, d] = this.$wire.get(model).split('-');
                this.year = y;
                this.month = m;
                this.day = d;
                this.display_date = `${y}/${m}/${d}`;
            }
        },
        selectedDate() {
            return new Date(`${this.year}-${this.month}-${this.day}`);
        },
        makeDate(input) {
            if (!input || input.trim() === '') {
                this.date = '';
                this.display_date = '';
                this.$wire.set(model, null, false);
                return;
            }
            const parts = input.split('/');
            if (parts.length !== 3) return;
            const [y, m, d] = parts;
            this.year = y;
            this.month = m;
            this.day = d;
            this.date = `${y}-${m}-${d}`;
            this.display_date = input;
            this.$wire.set(model, this.date, false);
        },
        setDate(d) {
            this.day = d.toString().padStart(2, '0');
            this.date = `${this.year}-${String(this.month).padStart(2, '0')}-${this.day}`;
            this.display_date = `${this.year}/${String(this.month).padStart(2, '0')}/${this.day}`;
            this.$wire.set(model, this.date, false);
        },
        setMonth(increase) {
            if (increase) {
                this.month = this.month < 12 ? this.month + 1 : 1;
                if (this.month === 1) this.year++;
            } else {
                this.month = this.month > 1 ? this.month - 1 : 12;
                if (this.month === 12) this.year--;
            }
            this.updateDate();
        },
        updateDate() {
            this.date = `${this.year}-${String(this.month).padStart(2, '0')}-${this.day}`;
            this.display_date = `${this.year}/${String(this.month).padStart(2, '0')}/${this.day}`;
            this.$wire.set(model, this.date, false);
        },
        daysGap() {
            const d = new Date(`${this.year}-${this.month}-01`);
            return (d.getDay() + 6) % 7;
        },
        translatedWeekdayNames() {
            return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        },
        translatedMonthName() {
            return this.selectedDate().toLocaleString(this.locale, { month: 'long' });
        },
        longDayName() {
            return this.selectedDate().toLocaleString(this.locale, { weekday: 'long' });
        },
        lastDateOfMonth() {
            return new Date(this.year, this.month, 0).getDate();
        },
        isWeekend(day) {
            const date = new Date(`${this.year}-${this.month}-${day}`);
            return date.getDay() === 6 || date.getDay() === 0;
        }
    }));
});
