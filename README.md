# event-tracker.js

track event

## Installation

```sh
$ npm install tsukurite/event-tracker.js
```

## Usage

via `require()`

```js
var eventTracker = require('event-tracker');
```

via `<script>`

```html
<script src="event-tracker.min.js"></script>
```

## Example

see [examples](https://tsukurite.github.io/event-tracker.js/).

## Functions

### track(eventType, selector[, data[, callback]])

- `eventType`
  - `String` - event name
- `selector`
  - `String` - selector for target elements
- `[data]`
  - `Function|Object` - tracking data
- `[callback]`
  - `Function` - callback function

## License

The MIT license. Please see LICENSE file.
