"use strict"
var item = angular.module('item', []);

item.controller('item', function($scope, $http, $window) {
	
	$scope.username = "";
	$scope.addToCart = function(itemId)
	{
		$http({
			method : "POST",
		    url : '/addToCart',
		    data :{"itemId":itemId}
		}).success(function(data){
				if(data.statusCode == 200){
				$window.location.href = '/cart';
				}
				else
				{
					$window.location.href = '/';
				}
		}).error(function(data){
			
		});
		
	};
	$scope.signOut = function()
	{
		$http({
			method : "GET",
		    url : '/signOut',
		}).success(function(data){
			if (data.statusCode == 200) {
				
				$window.location.href = '/';
			}
			else
			{
				$window.location.href = '/';
			}
		}).error(function(data){
			
		});
	};
	
	
});
