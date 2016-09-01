'use strict';

var w = window;

if (!w.ga) {
  w.ga = function() {
    w.ga.q || (w.ga.q = []);
    w.ga.q.push(arguments);
  };
  w.l = +new Date;
}

w.dataLayer || (w.dataLayer = []);

var ga = w.ga,
    dataLayer = w.dataLayer;

//------------------------------------------------------------------------------

var hasOwnProperty = Object.prototype.hasOwnProperty;

//------------------------------------------------------------------------------

var domDelegate = require('dom-delegate'),
    domready = require('domready');

var delegate = null,
    dataList = [];

/**
 * get data-* attributes
 *
 * @param {HTMLElement} element
 * @return {Object}
 */
function getDataAttributes(element) {
  var attrs, i, len, attr, result;

  if (!element || element.nodeType !== 1) {
    throw new TypeError('element must be HTMLElement');
  }

  if (!element.hasAttributes()) {
    return {};
  }

  attrs = element.getAttributes();
  result = {};

  for (i = 0, len = attrs.length; i < len; ++i) {
    attr = attrs[i];

    if (/^data-/.test(attr)) {
      result[
        attr
          .replace(/^data-/, '')
          .replace(/-./g, function(s) {
            return s.slice(1).toUpperCase();
          })
      ] = element.getAttribute(attr);
    }
  }

  return result;
}

/**
 * track event
 *
 * @param {String} eventType
 * @param {String} selector
 * @param {Function|Object} [data]
 */
function track(eventType, selector, data) {
  var handler;

  if (delegate === null) {
    dataList.push({
      eventType: eventType,
      selector: selector,
      data: data
    });

    return;
  }

  if (!data) {
    handler = function(event, target) {
      send(getDataAttributes(target));
    };
  } else if (typeof data === 'function') {
    handler = function(event, target) {
      send(data(event, target));
    };
  } else if (data !== null && typeof data === 'object') {
    handler = function(event, target) {
      send(data);
    };
  }

  delegate.on(eventType, selector, handler);
}

/**
 * send data
 *
 * @param {Object} data
 */
function send(data) {
  var props, args, i, len, key;

  if (data === null || typeof data !== 'object') {
    throw new TypeError('data must be an Object');
  }

  if (hasOwnProperty.call(data, 'hitType')) {
    // ga
    switch (data.hitType) {
      case 'event':
        props = [
          'hitType',
          'category', 'action', 'label', 'value',
          'fieldsObject'
        ];
        break;
      case 'social':
        props = [
          'hitType',
          'socialNetwork', 'socialAction', 'socialTarget',
          'fieldsObject'
        ];
        break;
      case 'screenview':
      case 'exception':
        props = [
          'hitType',
          'fieldsObject'
        ];
        break;
      case 'timing':
        props = [
          'hitType',
          'timingCategory', 'timingVar', 'timingValue', 'timingLabel',
          'fieldsObject'
        ];
        break;
      default:
        props = [];
    }

    for (i = 0, len = props.length; i < len; ++i) {
      key = props[i];

      hasOwnProperty.call(data, key) && args.push(data[key]);
    }

    ga.apply(ga, ['send'].concat(args));
  } else {
    // dataLayer
    dataLayer.push(data);
  }
}

module.exports = {
  track: track
};

//------------------------------------------------------------------------------

domready(function(){
  var i, len, metadata;

  delegate = domDelegate(document.body);

  for (i = 0, len = dataList.length; i < len; ++i) {
    metadata = dataList[i];

    track(metadata.eventType, metadata.selector, metadata.data);
  }

  dataList = [];
});
