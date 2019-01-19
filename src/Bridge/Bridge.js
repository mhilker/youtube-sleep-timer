export class YouTube {
    stopPlayer() {
        console.log("YouTube::stopPlayer()");
        const buttons = document.getElementsByClassName('ytp-play-button');

        if (buttons.length === 0) {
            console.error("Error: player button not found.");
            return;
        }

        buttons[0].click();
    }

    startPlayer() {
        console.log("YouTube::startPlayer()");
        const buttons = document.getElementsByClassName('ytp-play-button');

        if (buttons.length === 0) {
            console.error("Error: player button not found.");
            return;
        }

        buttons[0].click();
    }

    isPaused() {
        const elements = document.getElementsByClassName('html5-video-player');

        if (elements.length === 0) {
            console.error("Error: paused state element not found.");
            return;
        }

        return elements[0].classList.contains('paused-mode');
    }
}

export class AdultSwim {
    stopPlayer() {
        console.log("AdultSwim::stopPlayer()");
        const buttons = document.getElementsByClassName('as-play-control');

        if (buttons.length === 0) {
            console.error("Error: player button not found.");
            return;
        }

        buttons[0].click();
    }

    startPlayer() {
        console.log("AdultSwim::startPlayer()");

        const buttons = document.getElementsByClassName('as-play-control');

        if (buttons.length === 0) {
            console.error("Error: player button not found.");
            return;
        }

        buttons[0].click();
    }

    isPaused() {
        const elements = document.getElementsByClassName('as-play-control');

        if (elements.length === 0) {
            console.error("Error: paused state element not found.");
            return;
        }

        // Adult Swim
        return elements[0].classList.contains('vjs-paused');
    }
}

export class Null {
    stopPlayer() {

    }

    startPlayer() {

    }

    isPaused() {
        return false;
    }
}

export function Factory(host) {
    switch (host) {
        case 'www.youtube.com':
            console.log('Creating YouTube Bridge');
            return new YouTube();

        case 'www.adultswim.com':
            console.log('Creating AdultSwim Bridge');
            return new AdultSwim();

        default:
            console.log('Creating Null Bridge');
            return new Null();
    }
}
