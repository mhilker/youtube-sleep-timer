# Youtube Sleep Timer

Youtube Sleep Timer extension based on [WebExtensions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions) API.

## How to use it

All you need is node and npm. Following npm scripts are defined:

```bash
$ npm run build   # bundles code and resources to ./dist
$ npm run clean   # performs cleanup of ./dist and built artifacts
$ npm run test    # executes JavasScript tests
$ npm run start   # runs Firefox with own profile and the add-on installed (needs ./dist to be built)
$ npm run lint    # checks integrity of the add-on (needs ./dist to be built)
$ npm run pack    # packs the add-on as a .zip into ./web-ext-artifacts
$ npm run sign    # performs signing, builds .xpi into ./web-ext-artifacts on success
```

Note: for `npm run sign`, WEB_EXT_API_KEY and WEB_EXT_API_SECRET environment variables need to be set. See [web-ext](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign) docs.

## Just want to have a taste?

Give it a try and see how WebExtensions integrate:
```bash
$ npm link
$ npm run build
$ npm run start
```
