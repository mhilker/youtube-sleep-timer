# Youtube Sleep Timer

[![Software License][ico-license]](LICENSE.md)

Youtube Sleep Timer extension based on [WebExtensions][webextensions] API.

## Usage

First, you need to change into the example subdirectory and install all [NodeJS][nodejs] dependencies with [npm][npm].

    npm install

Start the continuous build process to transpile the code into something that can run in Firefox or Chrome:

    npm run build

This creates a WebExtension in the `extension` subdirectory.
Any time you edit a file, it will be rebuilt automatically.

In another shell window, run the extension in Firefox using a wrapper around [web-ext][web-ext]:

    npm run start

Any time you edit a file, [web-ext][web-ext] will reload the extension in Firefox.

You can pack the final extension using:

    npm run pack
    
[ico-license]: https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square
[webextensions]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions
[react]: https://facebook.github.io/react/
[nodejs]: https://nodejs.org/en/
[npm]: http://npmjs.com/
[web-ext]: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Getting_started_with_web-ext
