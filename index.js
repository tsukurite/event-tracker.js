'use strict';

var w = window;

if (!w.ga) {
  w.ga = function() {
    (w.ga.q = w.ga.q || []).push(arguments);
  };
  w.l = new Date().getTime();
}

w.dataLayer || (w.dataLayer = []);

var ga = w.ga,
    dataLayer = w.dataLayer;

//------------------------------------------------------------------------------

var toString = Object.prototype.toString,
    hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * check to value is Function
 *
 * @param {*} value
 * @return {Boolean}
 */
function isFunction(value) {
  return (
    typeof value === 'function' || toString.call(value) === '[object Function]'
  );
}

//------------------------------------------------------------------------------

var assign = require('lodash.assign'),
    domDelegate = require('dom-delegate'),
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
  var attrs, i, len, result, attr, name, value;

  if (!element || element.nodeType !== 1) {
    throw new TypeError('element must be HTMLElement');
  }

  if (!element.hasAttributes()) {
    return {};
  }

  result = {};

  attrs = element.attributes;

  for (i = 0, len = attrs.length; i < len; ++i) {
    attr = attrs[i];

    name = attr.name;
    value = attr.value;

    if (/^data-/.test(name)) {
      result[
        name
          .replace(/^data-/, '')
          .replace(/-./g, function(s) {
            return s.slice(1).toUpperCase();
          })
      ] = value;
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
 * @param {Function} [callback]
 */
function track(eventType, selector, data, callback) {
  var handler;

  if (delegate === null) {
    dataList.push({
      eventType: eventType,
      selector: selector,
      data: data,
      callback: callback
    });

    return;
  }

  if (!data) {
    handler = function(event, target) {
      send(getDataAttributes(target), callback);
    };
  } else if (isFunction(data)) {
    handler = function(event, target) {
      var attrs = assign(
        getDataAttributes(target), data(event, target)
      );

      send(attrs, callback);
    };
  } else if (/*data !== null &&*/ typeof data === 'object') {
    handler = function(event, target) {
      send(data, callback);
    };
  }

  delegate.on(eventType, selector, handler);
}

/**
 * send data
 *
 * @param {Object} data
 * @param {Function} callback
 */
function send(data, callback) {
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

    args = [];

    for (i = 0, len = props.length; i < len; ++i) {
      key = props[i];

      hasOwnProperty.call(data, key) && args.push(data[key]);
    }

    if (isFunction(callback)) {
      args.push({
        hitCallback: callback
      });
    }

    ga.apply(ga, ['send'].concat(args));
  } else {
    // dataLayer

    args = (isFunction(callback)) ? assign({}, data, {
      eventCallback: callback
    }) : data;

    dataLayer.push(args);
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

    track(
      metadata.eventType,
      metadata.selector,
      metadata.data,
      metadata.callback
    );
  }

  dataList = [];
});
