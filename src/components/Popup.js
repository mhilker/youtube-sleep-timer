import React from 'react';
import moment from "moment";

export default class Popup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            enteredDuration:   moment.duration(5, 'seconds'),
            remainingDuration: null,
            timer:             null
        };

        browser.storage.local.remove(['settings']);
    }

    componentDidMount() {
        console.log('Popup::componentDidMount()');

        browser.storage.local.get('settings').then(this.loadState);
    }

    componentWillUpdate(props, state) {
        //console.log('Popup::componentWillUpdate()');

        browser.storage.local.set({
            settings: {
                ...state,
                enteredDuration:   state.enteredDuration !== null ? state.enteredDuration.toISOString() : null,
                remainingDuration: state.remainingDuration !== null ? state.remainingDuration.toISOString() : null,
            }
        });
    }

    componentWillUnmount() {
        console.log('Popup::componentWillUnmount()');

        if (this.timer !== null) {
            clearInterval(this.timer);
        }
    }

    loadState = item => {
        console.log('Popup::loadState()');
        console.log(item);

        if (Object.keys(item).length === 0) {
            return;
        }

        this.setState({
            ...item,
            enteredDuration:   item.enteredDuration !== null ? moment.duration(item.enteredDuration) : null,
            remainingDuration: item.remainingDuration !== null ? moment.duration(item.remainingDuration) : null,
            timer:             item.timer !== null ? setInterval(this.timer, 1000) : null,
        });
    };

    onChange = event => {
        console.log("Popup::onChange()");

        const value = parseInt(event.target.value)
        if (Number.isInteger(value) === false) {
            return;
        }

        this.setState({
            ...this.state,
            enteredDuration: moment(value, 'minutes')
        });
    };

    onSubmit = event => {
        console.log("Popup::onSubmit()");

        browser.runtime.sendMessage({
            timeout: this.state.enteredDuration.toISOString()
        });

        this.setState({
            remainingDuration: this.state.enteredDuration.clone(),
            timer:             setInterval(this.timer, 1000),
        });
    };

    onAbort = event => {
        console.log("Popup::onAbort()");

        browser.runtime.sendMessage({
            timeout: null
        });

        clearTimeout(this.state.timer);
        this.setState({
            remainingDuration: null,
            timer:             null,
        });
    };

    timer = () => {
        //console.log("Popup::timer()");

        if (this.state.remainingDuration.seconds() <= 0) {
            clearTimeout(this.state.timer);
            this.setState({
                ...this.state,
                remainingDuration: null,
                timer:             null,
            });
        } else {
            this.setState({
                remainingDuration: this.state.remainingDuration.subtract(1, 'second')
            });
        }
    };

    render() {
        return (
            <form className="input-form">
                { this.state.timer === null &&
                    <fieldset className="input-fieldset">
                        <label htmlFor="input-minutes" className="input-label">Timer for sleep mode in minutes</label>
                        <input onChange={e => this.onChange(e)} type="number" min="1" max="60" name="minutes" value={this.state.enteredDuration.minutes()} className="input-text"/>
                        <button onClick={e => this.onSubmit(e)} type="button" name="start" className="input-button">Start</button>
                    </fieldset>
                }

                {this.state.timer !== null &&
                    <fieldset className="input-fieldset">
                        <div className="input-label">
                            <span>{this.state.remainingDuration.minutes().toString().padStart(2, '0')}:{this.state.remainingDuration.seconds().toString().padStart(2, '0')}</span>
                            <span> minutes remaining</span>
                        </div>
                        <button onClick={e => this.onAbort(e)} type="button" name="stop" className="input-button">Stop</button>
                    </fieldset>
                }
            </form>
        );
    }
}
