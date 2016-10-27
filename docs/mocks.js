(function(){

  'use strict';

  var ga, dataLayer;

  ga = function() {
    var fieldsObject;

    ga.q || (ga.q = [])
    ga.q.push(arguments);

    console.log(ga.q);
    console.log(arguments);

    fieldsObject = arguments[arguments.length - 1];

    if (typeof fieldsObject.hitCallback === 'function') {
      fieldsObject.hitCallback();
    }

    ga.q.shift();

    console.log(ga.q);
  };
  ga.q = [];
  ga.l = new Date().getTime();

  dataLayer = {};
  dataLayer.push = function(object) {
    dataLayer.q || (dataLayer.q = []);
    dataLayer.q.push(object);

    console.log(dataLayer.q);
    console.log(object);

    if (typeof object.eventCallback === 'function') {
      object.eventCallback();
    }

    dataLayer.q.shift();

    console.log(dataLayer.q);
  };
  dataLayer.q = [];

  window.ga = ga;
  window.dataLayer = dataLayer;

}());
