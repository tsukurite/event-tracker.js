(function(){

  'use strict';

  eventTracker.track('click', '[data-hit-type]');

  eventTracker.track('click', '[data-aaa][data-bbb][data-ccc]');

  eventTracker.track('click', '[data-value]', function(event, target) {
    return {
      label: target.getAttribute('data-value')
    };
  });

  eventTracker.track('click', '[data-track-object]', {
    aaa: 1,
    bbb: 2,
    ccc: 3
  });

}());
