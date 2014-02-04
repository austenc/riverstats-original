'use strict';

/* jasmine specs for filters go here */

describe('filter', function() {
  beforeEach(module('myApp.filters'));


  describe('interpolate', function() {
    beforeEach(module(function($provide) {
      $provide.value('version', 'TEST_VER');
    }));


    it('should replace VERSION', inject(function(interpolateFilter) {
      expect(interpolateFilter('before %VERSION% after')).toEqual('before TEST_VER after');
    }));
  });

  // Add units/label if 1st param non-negative or show nothing
  describe('formatData', function () {
  	it('should show units if data is defined from USGS', inject(function($filter) {
  		expect($filter('formatData')(5,'test')).toEqual('5 <small class="text-muted">test</small>');
  	}));

  	it('should show only a dash if data is NOT defined coming from USGS', inject(function($filter) {
  		expect($filter('formatData')(-99999,'test2')).toEqual('<small class="text-muted">&dash;</small>');
  	}));
  });
});
