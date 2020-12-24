var app = angular.module('angularApp');

app.controller('appController',
function($scope, $rootScope, $stateParams, $state, Service) {
$scope.user = $rootScope.userName;

});