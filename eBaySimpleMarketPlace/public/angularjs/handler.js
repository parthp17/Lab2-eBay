"use strict"
var handler = angular.module('handler', []);

handler.controller('handler', function($scope, $http, $window) {
	$scope.bdate = "";
	$scope.purchased = [];
	$scope.sold = [];
	$scope.init = function()
	{
		$http({
			method : "GET",
		    url : '/getProfile'
		}).success(function(data){
			if(data.statusCode = 200)
			{
				
				var date = new Date(data.result[0].birthday);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				date = date.getFullYear() + "-" + month + "-" + day;
				$scope.fname = data.fname;
				$scope.lname = data.lname;
				$scope.email = data.email;
				$scope.bdate = date;
				$scope.contact = data.result[0].contact;
				$scope.zipcode = data.result[0].zipcode;
				$scope.city = data.result[0].city;
				$scope.adrLine2 = data.result[0].line2;
				$scope.adrLine1= data.result[0].line1;
				$scope.state = data.result[0].state;
				$scope.country = "United States";
			}
			else
			{
				console.log(data);
				//$window.location.href = '/';
			}
		}).error(function(err){
			
		});
		
		$http({
			method : "GET",
		    url : '/btransactions',
		}).success(function(data){
			$scope.purchased = data;
		}).error(function(data){
			
		});
		
		$http({
			method : "GET",
		    url : '/stransactions',
		}).success(function(data){
			$scope.sold = data;
		}).error(function(data){
			
		});
	};
});
