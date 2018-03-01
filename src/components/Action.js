import React from 'react';
import moment from "moment";

export default class Action extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enteredDuration: moment.duration(15, 'minutes'),
            startTime:       null,
            endTime:         null,
            timer:           null,
        };
    }

    componentDidMount() {
        console.log('Popup::componentDidMount()');

        browser.storage.local.get('settings')
            .then(this.loadState)
            .catch(e => console.error(e));
    }

    componentWillUpdate(props, state) {
        console.log('Popup::componentWillUpdate()');

        this.saveState(state);
    }

    componentWillUnmount() {
        console.log('Popup::componentWillUnmount()');

        if (this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    saveState = state => {
        console.log('Popup::saveState()');
        console.log(state);

        browser.storage.local.set({
            settings: {
                ...state,
                enteredDuration: state.enteredDuration !== null ? state.enteredDuration.toISOString() : null,
                startTime:       state.startTime !== null ? state.startTime.toISOString() : null,
                endTime:         state.endTime !== null ? state.endTime.toISOString() : null,
            }
        }).then(() => console.log("State saved.")).catch(e => console.error(e));
    };

    loadState = item => {
        console.log('Popup::loadState()');
        console.log(item);

        if (typeof item.settings === "undefined") {
            console.warn("Could not load state.");
            return;
        }

        this.setState({
            ...item,
            enteredDuration: item.settings.enteredDuration !== null ? moment.duration(item.settings.enteredDuration) : null,
            startTime:       item.settings.startTime !== null ? moment(item.settings.startTime) : null,
            endTime:         item.settings.endTime !== null ? moment(item.settings.endTime) : null,
            timer:           item.settings.timer !== null ? setInterval(this.timer, 1000) : null,
        });
    };

    onChange = event => {
        console.log("Popup::onChange()");

        const value = parseInt(event.target.value);
        if (Number.isInteger(value) === false) {
            console.error("Invalid value " + value);
            return;
        }

        this.setState({
            ...this.state,
            enteredDuration: moment.duration(value, 'minutes')
        });
    };

    onStart = () => {
        console.log("Popup::onSubmit()");

        browser.runtime.sendMessage({
            action:  "start",
            timeout: this.state.enteredDuration.toISOString()
        });

        this.setState({
            startTime: moment(),
            endTime:   moment().add(this.state.enteredDuration),
            timer:     setInterval(this.timer, 1000),
        });
    };

    onAbort = () => {
        console.log("Popup::onAbort()");

        browser.runtime.sendMessage({
            action: "stop"
        });

        clearTimeout(this.state.timer);
        this.setState({
            startTime: null,
            endTime:   null,
            timer:     null,
        });
    };

    onContinueAndRestart = () => {
        console.log("Popup::onContinueAndRestart()");

        this.onContinue();
        this.onStart();
    };

    onContinue = () => {
        console.log("Popup::onContinue()");

        browser.runtime.sendMessage({
            action:  "continue"
        });
    };

    timer = () => {
        console.log("Popup::timer()");

        if (moment().isSameOrAfter(this.state.endTime)) {
            clearTimeout(this.state.timer);
            this.setState({
                ...this.state,
                startTime: null,
                timer:     null,
            });
        } else {
            this.forceUpdate();
        }
    };

    render() {
        if (this.state.endTime !== null && this.state.timer === null) {
            return (
                <form className="input-form">
                    <fieldset className="input-fieldset">
                        <button onClick={e => this.onContinueAndRestart(e)} type="button" className="input-button">Continue Video & Restart Timer</button>
                    </fieldset>
                    <fieldset className="input-fieldset">
                        <button onClick={e => this.onContinue(e)} type="button" className="input-button">Continue Video</button>
                    </fieldset>
                    <fieldset className="input-fieldset">
                        <button onClick={e => this.onAbort(e)} type="button" className="input-button">Back</button>
                    </fieldset>
                </form>
            );
        }

        if (this.state.timer === null) {
            return (
                <form className="input-form">
                    <fieldset className="input-fieldset">
                        <label htmlFor="input-minutes" className="input-label">Timer for sleep mode in minutes</label>
                        <input onChange={e => this.onChange(e)} type="number" min="1" max="60" name="minutes" value={this.state.enteredDuration.minutes()} className="input-text"/>
                        <button onClick={e => this.onStart(e)} type="button" name="start" className="input-button">Start</button>
                    </fieldset>
                </form>
            );
        }

        const now  = moment();
        const end  = this.state.startTime.clone().add(this.state.enteredDuration);
        const diff = moment.duration(end.diff(now));

        return (
            <form className="input-form">
                <fieldset className="input-fieldset">
                    <div className="input-label">
                        <span>{diff.minutes().toString().padStart(2, '0')}:{diff.seconds().toString().padStart(2, '0')}</span>
                        <span> remaining</span>
                    </div>
                    <button onClick={e => this.onAbort(e)} type="button" name="stop" className="input-button">Stop</button>
                </fieldset>
            </form>
        );
    }
}
