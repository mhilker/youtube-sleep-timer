import moment from "moment";

class ActionPage {

    constructor() {
        this.interval = null;
        this.duration = null;

        this.timerMinutes = null;
        this.inputMinutes = null;
        this.buttonStart = null;
        this.buttonStop = null;
        this.fieldsetStart = null;
        this.fieldsetStop = null;

        this.register.bind(this);
        this.onChange.bind(this);
        this.onSubmit.bind(this);
        this.getValue.bind(this);
        this.startInterval.bind(this);
        this.stopInterval.bind(this);
    }

    /**
     * Register to listen on input actions.
     */
    register() {
        console.log("ActionPage::register()");
        this.timerMinutes  = document.getElementById('timer-minutes');
        this.inputMinutes  = document.getElementById('input-minutes');
        this.buttonStart   = document.getElementById('button-start');
        this.buttonStop    = document.getElementById('button-stop');
        this.fieldsetStart = document.getElementById('input-start-fieldset');
        this.fieldsetStop  = document.getElementById('input-stop-fieldset');

        this.inputMinutes.addEventListener('change', e => this.onChange(e));
        this.buttonStart.addEventListener('click', e => this.onSubmit(e));
        this.buttonStop.addEventListener('click', e => this.onAbort(e));
    };

    /**
     * @param event
     */
    onChange(event) {
        console.log("ActionPage::onChange()");

        const timeout = this.getValue();
        if (timeout !== null) {
            return;
        }
    };

    /**
     * @param event
     */
    onSubmit(event) {
        console.log("ActionPage::onSubmit()");

        const timeout = this.getValue();
        if (timeout === null) {
            return;
        }

        browser.runtime.sendMessage({
            timeout: timeout * 1000 /** * 60 **/
        });

        this.fieldsetStart.setAttribute('hidden', true);
        this.fieldsetStop.removeAttribute('hidden');
        this.startInterval();
    };

    /**
     * @param event
     */
    onAbort(event) {
        console.log("ActionPage::onAbort()");

        browser.runtime.sendMessage({
            timeout: null
        });

        this.fieldsetStart.removeAttribute('hidden');
        this.fieldsetStop.setAttribute('hidden', true);
        this.stopInterval();
    };

    /**
     * @returns int|null
     */
    getValue() {
        let timeout = null;
        try {
            timeout = parseInt(this.inputMinutes.value)
        } catch (e) {
            return null;
        }

        if (Number.isInteger(timeout) === false) {
            return null;
        }

        return timeout;
    }

    startInterval() {
        console.log("ActionPage::startInterval()");

        this.duration = moment().duration(this.getValue(), 'minutes');
        this.timerMinutes.textContent = this.duration.humanize();

        this.interval = setInterval(() => {
            this.duration.subtract(1, 's');
            this.timerMinutes.textContent = this.duration.humanize();
        }, 1000);
    }

    stopInterval() {
        console.log("ActionPage::stopInterval()");

        clearTimeout(this.interval);
        this.timerMinutes.textContent = '';
        this.interval = null;
    }
}

export default ActionPage;
