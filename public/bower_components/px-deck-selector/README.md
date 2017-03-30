# Px-Deck-Selector [![Build Status](https://travis-ci.org/PredixDev/px-deck-selector.svg?branch=master)](https://travis-ci.org/PredixDev/px-deck-selector)

Px-Deck-Selector displays a drop-down of decks and returns the url for the selected deck.

[![px-deck-selector demo](px-deck-selector.png?raw=true)](https://predixdev.github.io/px-deck-selector)

## Overview

Use the px-deck-selector element to enable your users to choose a deck from a drop-down list. Set the decks using an array of objects with `name` and `url` properties. When a user selects a new deck, the `selected-deck-url` will be updated.

## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.


### Getting Started

First, install the component via bower on the command line.

```
bower install https://github.com/PredixDev/px-deck-selector.git --save
```

Second, import the component to your application with the following tag in your head.

```html
<link rel="import" href="/bower_components/px-deck-selector/px-deck-selector.html"/>
```

Finally, use the component in your application:

```html
<px-deck-selector decks="{{...}}" selected-deck="{{...}}"></px-deck-selector>
```

<br />
<hr />
## documentation

Read the full API and view the demo [here](https://predixdev.github.io/px-deck-selector).

## Local Development

From the component's directory...

```
$ npm install
$ bower install
$ gulp sass
```

From the component's directory, to start a local server run:

```
$ gulp serve
```

Navigate to the root of that server (e.g. http://localhost:8080/) in a browser to open the API documentation page, with link to the "Demo" / working examples.

### LiveReload

By default gulp serve is configured to enable LiveReload and will be watching for modifications in your root directory as well as `/css`.






### GE Coding Style Guide
[GE JS Developer's Guide](https://github.com/GeneralElectric/javascript)

<br />
<hr />

## Known Issues

Please use [Github Issues](https://github.com/PredixDev/px-deck-selector/issues) to submit any bugs you might find.
