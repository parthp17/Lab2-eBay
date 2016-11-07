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
			alert(data.lname);	
				var date = new Date(data.result.birthday);
				var month = date.getMonth() + 1;
				var day = date.getDate();
				date = date.getFullYear() + "-" + month + "-" + day;
				$scope.fname = data.fname;
				$scope.lname = data.lname;
				$scope.email = data.email;
				$scope.bdate = date;
				$scope.contact = data.result.contact;
				$scope.zipcode = data.result.zipcode;
				$scope.city = data.result.city;
				$scope.adrLine2 = data.result.adrLine2;
				$scope.adrLine1= data.result.adrLine1;
				$scope.state = data.result.state;
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
			alert(data);
			$scope.purchased = data;
		}).error(function(data){
			
		});
		
		$http({
			method : "GET",
		    url : '/stransactions',
		}).success(function(data){
			alert(data);
			$scope.sold = data;
		}).error(function(data){
			
		});
	};
});
