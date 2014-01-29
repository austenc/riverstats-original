'use strict';

/* Filters */

angular.module('myApp.filters', [])
   .filter('interpolate', ['version', function(version) {
      return function(text) {
         return String(text).replace(/\%VERSION\%/mg, version);
      }
   }])




   .filter('formatCFS', function() {
      return function(data){
         return data > 0 ? data+' <small class="text-muted"><em>(ft&#179;/s)</em></small>' : '<small class="text-muted">-</small>';
      }
   })

   .filter('formatHeight', function() {
      return function(data){
         return data > 0 ? data+' <small class="text-muted"><em>(ft)</em></small>' : '<small class="text-muted">-</small>';
      }
   })

   .filter('formatTemp', function() {
      return function(data){
         return data > 0 ? data+' <small class="text-muted"><em>(&deg;F)</em></small>' : '<small class="text-muted">-</small>';
      }
   })

   .filter('reverse', function() {
      function toArray(list) {
         var k, out = [];
         if( list ) {
            if( angular.isArray(list) ) {
               out = list;
            }
            else if( typeof(list) === 'object' ) {
               for (k in list) {
                  if (list.hasOwnProperty(k)) { out.push(list[k]); }
               }
            }
         }
         return out;
      }
      return function(items) {
         return toArray(items).slice().reverse();
      };
   });
