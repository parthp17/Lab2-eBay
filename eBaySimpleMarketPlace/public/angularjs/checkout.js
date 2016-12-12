"use strict"
var checkout = angular.module('checkout', []);

checkout.controller('checkout', function($scope, $http, $window) {

	$scope.cart = [];
	$scope.details = [];
	$scope.init = function()
	{
		var i=0;	
		$http({
			method : "GET",
		    url : '/getMyCart',
		}).success(function(data){
		for(i; i < data.cart.length;i++)
		{
			$scope.cart.push(data.cart[i]);
		}
		$scope.total = data.total;
		}).error(function(data){
			
		});
		
		$http({
			method : "GET",
		    url : '/getProfile'
		}).success(function(data){
			if(data.statusCode = 200)
			{
				
				$scope.details.push(data.result[0].line1);
				$scope.details.push(data.result[0].lin2);
				$scope.details.push(data.result[0].city);
				$scope.details.push(data.result[0].state);
				$scope.details.push(data.result[0].zipcode);
				$scope.details.push(data.result[0].contact);
			}
			else
			{
				console.log(data);
				//$window.location.href = '/';
			}
		}).error(function(err){
			
		});
		
	};	

$scope.confirm = function()
{
	
	
	$http({
		method : "GET",
		url : '/validateCart'
			
	}).success(function(data){alert(data);
		if(data.statusCode == 200)
		{	
			$http({
				method : "POST",
			    url : '/makeTransaction',
			    data:
			    {
			    	"cardNumber" : $scope.cardNumber,
			    	"cvvNumber" : $scope.cvvNumber,
			    	"validTill" : $scope.expDate,
					"fname" : $scope.fname,
					"lname" : $scope.lname
			    }
			}).success(function(data){
			if(data.statusCode == 200)
			{	alert("Your Transaction id is:" + data.transaction);	
			$window.location.href = '/home';
			}
			else
			{
				alert("Please verify the details");
			}
			}).error(function(data){
				
			});

		}
		else
		{
			alert(data);
			$scope.message = "Item not available. Item id = "+data.itemId; 
		}
	}).error(function(error){
		
	});
	
	};

});