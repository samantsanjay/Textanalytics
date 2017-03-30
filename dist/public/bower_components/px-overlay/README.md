px-overlay [![Build Status](https://travis-ci.org/PredixDev/px-overlay.svg?branch=master)](https://travis-ci.org/PredixDev/px-overlay)
-----------------------------------------------

[![px-overlay demo](px-overlay.png?raw=true)](https://predixdev.github.io/px-overlay)

## Overview

px-overlay is a Predix UI component that defines a full viewport overlay element. It has two types, a light version and a dark version.

## Usage

### Prerequisites
1. node.js
2. npm
3. bower
4. [webcomponents-lite.js polyfill](https://github.com/webcomponents/webcomponentsjs)

Node, npm and bower are necessary to install the component and dependencies. webcomponents.js adds support for web components and custom elements to your application.

## Getting Started

First, install the component via bower on the command line.

```
bower install px-overlay --save
```

Second, import the component to your application with the following tag in your head.

```
<link rel="import" href="/bower_components/px-overlay/px-overlay.html"/>
```

Finally, use the component in your application:

```
<px-overlay type="dark"></px-overlay>
```

<br />
<hr />
## documentation

Read the full API and view the demo [here](https://predixdev.github.io/px-overlay).
<br />
<hr />


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

Please use [Github Issues](https://github.com/PredixDev/px-overlay/issues) to submit any bugs you might find.
