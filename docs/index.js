(function(){

  'use strict';

  eventTracker.track('click', '[data-hit-type]');

  eventTracker.track('click', '[data-hit-type][data-callback-ga]', null, function() {
    console.log('callback from ga');
  });

  eventTracker.track('click', '[data-aaa][data-bbb][data-ccc]');

  eventTracker.track('click', '[data-value]', function(event, target) {
    return {
      hitType: 'event',
      category: 'category',
      action: 'action',
      label: target.getAttribute('data-value')
    };
  });

  eventTracker.track('click', '[data-track-object]', {
    aaa: 1,
    bbb: 2,
    ccc: 3
  });

  eventTracker.track('click', '[data-callback-data-layer]', {
    aaa: 1,
    bbb: 2,
    ccc: 3
  }, function() {
    console.log('callback from dataLayer');
  });

}());
