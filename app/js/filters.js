'use strict';

/* Filters */

angular.module('myApp.filters', [])
   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])

   .filter('formatData', function() {
      return function(data, label){
         return data > 0 ? data+' <small class="text-muted">'+label+'</small>' : '<small class="text-muted">&dash;</small>';
      }
   })
