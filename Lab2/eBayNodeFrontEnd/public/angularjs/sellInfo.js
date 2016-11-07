"use strict"
var sellInfo = angular.module('sellInfo', []);

sellInfo.controller('sellInfo', function($scope, $http, $window)
{
			$scope.quantity = "";
			$scope.price = "";
			$scope.desc = "";
			$scope.name = "";
			
			$scope.enter = function()
			{
				$http({
					method : "POST",
				    url : '/sellInfo',
				    data :
				    {
				        "quantity" : $scope.quantity,
				        "price" : $scope.price,
				        "desc" : $scope.desc,
				        "itemname" : $scope.name,
				    }
				}).success(function(data){
					if(data.statusCode == 200)
					{
						$window.location.href = '/sellReview';
					}
					else
					{
						$window.location.href = '/';
					}
				}).error(function(data){
				});
			};
		});