'use strict';

/* Controllers */

angular.module('myApp.controllers', []) 

   .controller('HeaderCtrl', ['$scope', 'loginService', function($scope, loginService) {
      $scope.logout = function() {
         loginService.logout();
      }
   }])

   .controller('HomeCtrl', ['$scope', '$http', '$modal', function($scope, $http, $modal) {
      $scope.riverData   = 'Loading...';
      $scope.riverName   = '';
      $scope.sites       = '';
      $scope.heights     = '';
      $scope.searchSite  = '';
      $scope.searchState = '';

      // For graphs
      $scope.siteCode    = '';
      $scope.siteName    = '';

      // Open a graph for a given site
      $scope.showGraph = function(siteCode, siteName) {

         $scope.siteCode = siteCode;
         $scope.siteName = siteName;

         var modalInstance = $modal.open({
            templateUrl: 'siteGraph.html',
            controller: ModalInstanceCtrl,
            //windowClass: 'modal-large', // can't use .modal-lg because ui-bootstrap doesn't apply it to .modal-dialog but parent element instead
            resolve: {
              siteCode: function () {
                return $scope.siteCode;
              },
              siteName: function () {
                return $scope.siteName;
              }
            }
         });
      };

      var ModalInstanceCtrl = function ($scope, $modalInstance, siteCode, siteName) {

         $scope.siteCode = siteCode;
         $scope.siteName = siteName;

         $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
         };
      };


      // All sites from a given state
      $scope.updateSites = function() {
            // CFS Data
            $http.get("http://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=00060&stateCd="+$scope.searchState).success(function(data){
               $scope.sites = data.value.timeSeries;
            })
            .error(function(errorData, errorStatus){
               $scope.sites = errorData;
            });

            // Gage Height
            $http.get("http://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=00065&stateCd="+$scope.searchState).success(function(data){
               $scope.heights = data.value.timeSeries;
            })
            .error(function(errorData, errorStatus){
               $scope.heights = errorData;
            });

            // Temperature
            $http.get("http://waterservices.usgs.gov/nwis/iv/?format=json&parameterCd=00011&stateCd="+$scope.searchState).success(function(data){
               $scope.temps = data.value.timeSeries;
            })
            .error(function(errorData, errorStatus){
               $scope.temps = errorData;
            });
      };

   }])

   .controller('LoginCtrl', ['$scope', 'loginService', '$location', function($scope, loginService, $location) {
      $scope.email = null;
      $scope.pass = null;
      $scope.confirm = null;
      $scope.createMode = false;

      $scope.login = function(cb) {
         $scope.err = null;
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else {
            loginService.login($scope.email, $scope.pass, function(err, user) {
               $scope.err = err? err + '' : null;
               if( !err ) {
                  cb && cb(user);
               }
            });
         }
      };

      $scope.createAccount = function() {
         $scope.err = null;
         if( assertValidLoginAttempt() ) {
            loginService.createAccount($scope.email, $scope.pass, function(err, user) {
               if( err ) {
                  $scope.err = err? err + '' : null;
               }
               else {
                  // must be logged in before I can write to my profile
                  $scope.login(function() {
                     loginService.createProfile(user.uid, user.email);
                     $location.path('/account');
                  });
               }
            });
         }
      };

      function assertValidLoginAttempt() {
         if( !$scope.email ) {
            $scope.err = 'Please enter an email address';
         }
         else if( !$scope.pass ) {
            $scope.err = 'Please enter a password';
         }
         else if( $scope.pass !== $scope.confirm ) {
            $scope.err = 'Passwords do not match';
         }
         return !$scope.err;
      }
   }])

   .controller('AccountCtrl', ['$scope', 'loginService', 'syncData', '$location', function($scope, loginService, syncData, $location) {
      syncData(['users', $scope.auth.user.uid]).$bind($scope, 'user');

      $scope.logout = function() {
         loginService.logout();
      };

      $scope.oldpass = null;
      $scope.newpass = null;
      $scope.confirm = null;

      $scope.reset = function() {
         $scope.err = null;
         $scope.msg = null;
      };

      $scope.updatePassword = function() {
         $scope.reset();
         loginService.changePassword(buildPwdParms());
      };

      function buildPwdParms() {
         return {
            email: $scope.auth.user.email,
            oldpass: $scope.oldpass,
            newpass: $scope.newpass,
            confirm: $scope.confirm,
            callback: function(err) {
               if( err ) {
                  $scope.err = err;
               }
               else {
                  $scope.oldpass = null;
                  $scope.newpass = null;
                  $scope.confirm = null;
                  $scope.msg = 'Password updated!';
               }
            }
         }
      }

   }]);