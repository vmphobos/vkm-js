export default function (Alpine) {
    Alpine.data('validation', (rules = {}, showAsTooltip = true) => ({
        rules: rules,
        showAsTooltip: showAsTooltip,
        ruleHasAsterisk: function(name) {
            if (name.includes('*')) {
                return true;
            }

            return false;
        },
        validateDropdown(name = null, value = null, id = null) {
            if (!name) {
                console.warn('When validating a dropdown the model attribute cannot be empty!')
                return;
            }
            let el = document.getElementById(id);

            this.isValid(el);

            if (!value) {
                let message = 'The field is required.';
                if(!this.showAsTooltip) {
                    let error = document.getElementById(`error-${id}`);
                    if (!error) {
                        el.insertAdjacentHTML('beforeend', `<div id="error-${id}" class="invalid-feedback">${message}</div>`);
                    }
                }
                else {
                    el.setAttribute('x-tooltip.danger.show', message);
                }
            }
            else {
                this.isValid(el);
            }
        },
        validate() {
            let
                submit_btn = document.body.querySelectorAll('form button[type="submit"]')[0],
                event = this.$event.target,
                name = this.$event.target.getAttribute('model') ?? this.$event.target.getAttribute('name'),
                value = this.$event.target.value,
                validation_rules = [];

            try {
                this.rules = JSON.parse(this.rules);
            }
            catch(e) {

            }
            //reset input as valid
            this.isValid(event);

            validation_rules = this.rules[name];
            if (this.ruleHasAsterisk(name)) {
                let asterisk_name = name.replace(/[0-9]/g, "*");
                validation_rules = this.rules[asterisk_name];
            }

            if (!validation_rules) {
                //when no rules then always mark field as valid
                return;
            }

            if (validation_rules.includes('nullable') && (!value || value == 0)) {
                //when nullable rule exists and value is empty or zero, mark field as valid
                return;
            }

            //lock submit button until all validation checks finish
            submit_btn.classList.add('disabled');

            //see if validation must be on a string or number
            let check_as_number = validation_rules.some(r => ['numeric', 'integer'].includes(r)),
                error_msg_ending = check_as_number ? '.' : ' characters.';

            //start validation checks for each rule
            for (let i = 0; i < validation_rules.length; i++) {
                let rule_title = validation_rules[i];

                //validate only when rule is string and not an object and then break on first invalid check
                if (typeof rule_title === 'string') {
                    if (Object.hasOwn(this.check, rule_title) && !this.check[rule_title](value)) {
                        this.isInvalid(event, this.messages[rule_title]);

                        break;
                    } else if (['min:', 'max:', 'lt:', 'lte:', 'gt:', 'gte:'].some(t => rule_title.includes(t))) {
                        let [field, limit] = rule_title.split(':');

                        if (!this.check[field](value, limit, check_as_number)) {
                            let message = this.messages[field](limit) + error_msg_ending;

                            this.isInvalid(event, message);

                            break;
                        }
                    } else if (rule_title.includes('between:')) {
                        let [field, between] = rule_title.split(':');
                        let [min, max] = between.split(',');

                        if (!this.check[field](value, [min, max], check_as_number)) {
                            let message = this.messages[field]([min, max]) + error_msg_ending;

                            this.isInvalid(event, message);

                            break;
                        }
                    }
                }
            }

            //if form is valid re-enable submit button
            if (this.isFormValid) {
                submit_btn.classList.remove('disabled');
            }
        },
        check: {
            required: function (value) {
                return !!value;
            },
            numeric: function (value) {
                return !isNaN(value);
            },
            integer: function (value) {
                return Number.isInteger(Number(value));
            },
            email: function (value) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            },
            alpha: function (value) {
                return /^[a-zA-Z ]+$/.test(value);
            },
            alpha_dash: function (value) {
                return /^[a-zA-Z-_]+$/.test(value);
            },
            alpha_num: function (value) {
                return /^[a-zA-Z0-9]+$/.test(value);
            },
            between: function (value, between, check_as_number = false) {
                return check_as_number
                    ? Number(value) > Number(between[0]) && Number(value) < Number(between[1])
                    : value.length > Number(between[0]) && value.length < Number(between[1]);
            },
            min: function (value, min, check_as_number = false) {
                return check_as_number ? Number(value) >= Number(min) : value.length >= Number(min);
            },
            max: function (value, max, check_as_number = false) {
                return check_as_number ? Number(value) <= Number(max) : value.length <= Number(max);
            },
            gt: function (value, limit, check_as_number = false) {
                return check_as_number ? Number(value) > Number(limit) : value.length > Number(limit);
            },
            gte: function (value, limit, check_as_number = false) {
                return check_as_number ? Number(value) >= Number(limit) : value.length >= Number(limit);
            },
            lt: function (value, limit, check_as_number = false) {
                return check_as_number ? Number(value) < Number(limit) : value.length < Number(limit);
            },
            lte: function (value, limit, check_as_number = false) {
                return check_as_number ? Number(value) <= Number(limit) : value.length <= Number(limit);
            },
        },
        messages: {
            required: 'The field is required.',
            numeric: 'The field must be a number.',
            integer: 'The field must be an integer number.',
            email: 'The field must be a valid email address.',
            alpha_dash: 'The field under validation may contain alphabetic characters, numbers, dashes or underscores.',
            alpha_num: 'The field may only contain letters and numbers.',
            between: function (between) {
                return `The field must be between ${between[0]} and ${between[1]}`;
            },
            min: function (min) {
                return `The field must be at least ${min}`;
            },
            max: function (max) {
                return `The field may not be greater than ${max}`;
            },
            lt: function (limit) {
                return `The field must be less than ${limit}`;
            },
            lte: function (limit) {
                return `The field must be less than or equal ${limit}`;
            },
            gt: function (limit) {
                return `The field must be must be greater than ${limit}`;
            },
            gte: function (limit) {
                return `The field must be must be greater than or equal ${limit}`;
            },
        },
        isValid: function (event) {
            event.classList.add('is-valid');
            event.classList.remove('is-invalid');

            setTimeout(function () {
                event.classList.remove('is-valid')
            }, 2000);

            if(this.showAsTooltip) {
                //remove error tooltip
                event.removeAttribute('x-tooltip.danger.show');
                event.removeAttribute('data-tooltip');
                document.querySelectorAll('.tooltip').forEach(e => e.remove());
            }

            //destroy inline error
            let error = document.getElementById(`error-${event.id}`);
            if (error) {
                error.remove();
            }

            this.isFormValid = true;
        },
        isInvalid: function (event, message) {
            event.classList.remove('is-valid');
            event.classList.add('is-invalid');
            if(!this.showAsTooltip) {
                document.getElementById(event.id).outerHTML += `<div id="error-${event.id}" class="invalid-feedback">${message}</div>`;
            }
            else {
                event.setAttribute('x-tooltip.danger.show', message);
            }

            this.isFormValid = false;
        },
        isFormValid: true,
    }));
}
