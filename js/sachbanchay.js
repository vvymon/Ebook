var app = angular.module('angularApp', ['ui.router','ngResource','ui.bootstrap']);
app.factory('SachsFactory', function($resource) {
     return $resource('data/vanhoc1.json');
      });
app.controller('SachController', function($scope) {
  $scope.name = 'World'; 
});

        app.config(function($stateProvider){

$stateProvider
.state('sachbanchay',{
        url: '',
        templateUrl:'MainIndex/sachbanchay.html',
        controller: 'productlistCtrl',
        param :{
          id: null
          
          
        }
    })

.state('sachbanchaychitiet',{
        url: '/Sách bán chạy/:id',
        templateUrl:'MainIndex/sachmoichitiet.html',
        controller: 'productCtrl',
        param :{
          id: null
          
          
        }

    })
.state('vanhoc',{
        url: '/sach/:id',
        templateUrl:'MainIndex/vanhoc.html',
        controller: 'vanhocCtrl',
        param :{
          id: null
          
          
        }
    })

.state('vanhocchitiet',{
        url: '/sach/:loaisach/:id',
        templateUrl:'MainIndex/vanhocchitiet.html',
        controller: 'vanhocchitietCtrl',
        param :{
          id: null
        }
    })
});

    	
      app.factory('SachsFactory1', function($resource) {
     return $resource('data/sachbanchay1.json');
      });

      app.controller('productlistCtrl', function ($scope, SachsFactory1) {
        $scope.sachbanchays = SachsFactory1.query();

        $scope.itemsPerPage = 12
        $scope.currentPage = 1;

        $scope.pageCount = function () {
          return Math.ceil($scope.sachbanchays.length / $scope.itemsPerPage);
        };

        $scope.sachbanchays.$promise.then(function () {
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;

            $scope.filteredSachs = $scope.sachbanchays.slice(begin, end);
          });
        });
      });

      angular.module('angularApp').filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace !== -1) {
                  //Also remove . and , so its gives a cleaner result.
                  if (value.charAt(lastspace-1) === '.' || value.charAt(lastspace-1) === ',') {
                    lastspace = lastspace - 1;
                  }
                  value = value.substr(0, lastspace);
                }
            }

            return value + (tail || ' …');
        }
    });

app.controller('productCtrl', function($stateParams,$scope,SachsFactory1,$filter) {
  $scope.sachmois = SachsFactory1.query();
  $scope.productID= $stateParams.id;
  
             $scope.qty_incr = function(item){
              item.quantity = item.quantity + 1;
          }
          $scope.qty_decr = function(item){
              if(item.quantity > 1){
                 item.quantity = item.quantity - 1;
              }

          }
});

app.controller('vanhocCtrl', ['$scope', 'SachsFactory','$stateParams', '$filter',function ($scope, SachsFactory,$stateParams,$filter) {
        $scope.sachmois = SachsFactory.query();
        $scope.productID= $stateParams.id;
        $scope.itemsPerPage = 12
        $scope.currentPage = 1;

        $scope.pageCount = function () {
          return Math.ceil($scope.sachmois.length / $scope.itemsPerPage);
        };

$scope.sachmois.$promise.then(function () {
          $scope.$watch('currentPage + itemsPerPage', function() {
            var begin = (($scope.currentPage - 1) * $scope.itemsPerPage),
              end = begin + $scope.itemsPerPage;
              $scope.countpage= $filter('filter')($scope.sachmois,{LoaiSach: $scope.productID});
            
            $scope.filteredSachs=$scope.countpage.slice(begin, end)
          });
        });
      }]);

app.controller('vanhocchitietCtrl', function($stateParams,$scope,SachsFactory,$rootScope, $http) {
$scope.sachmois = SachsFactory.query();
$scope.productID= $stateParams.id;
$scope.prLoaiSach= $stateParams.loaisach;
             $scope.qty_incr = function(item){
              item.quantity = item.quantity + 1;
          }
          $scope.qty_decr = function(item){
              if(item.quantity > 1){
                 item.quantity = item.quantity - 1;
              }
          }
  });