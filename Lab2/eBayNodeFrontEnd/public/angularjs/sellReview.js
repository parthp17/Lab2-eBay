"use strict"
var sellReview = angular.module('sellReview', []);

sellReview.controller('sellReview', function($scope, $http, $window)
{
	$scope.addItem = function()
	{
		$http({
			method : "POST",
		    url : '/addItem',
		    data :
		    {
		        "quantity" : $scope.itemQuantity,
		        "price" : $scope.itemPrice,
		        "desc" : $scope.itemDesc,
		        "name" : $scope.itemName,
		    }
		}).success(function(data){
			if(data.statusCode == 200)
			{
				$window.location.href = '/home';
			}
			else
			{
				$window.location.href = '/';
			}
		}).error(function(data){
		});
	}
});