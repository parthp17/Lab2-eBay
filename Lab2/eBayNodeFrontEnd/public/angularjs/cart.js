"use strict"
var cart = angular.module('cart', []);

cart.controller('cart', function($scope, $http, $window) {
	
	$scope.cart = [];
	
	$scope.init = function()
	{
		var i=0;
		
		$http({
			method : "GET",
		    url : '/getMyCart',
		}).success(function(data){
			i=0;
			for(i; i < data.cart.length;i++)
			{
				$scope.cart.push(data.cart[i]);
			}
			$scope.total = data.total;
		}).error(function(data){
			
		});
	}
	
	$scope.remove = function(id)
	{
		alert($scope.cart.length);
		alert($scope.cart[0]);
		var j = 0;
		for(j; j < $scope.cart.length;j++)
		{
			
			alert($scope.cart[j].itemId);
			if($scope.cart[j].itemId == id)
			{
				alert($scope.cart[j].itemObjectId);
				id = $scope.cart[j].itemObjectId;
				break;
			}
		}
		
		$http({
			method : "POST",
		    url : '/removeFromCart',
		    data :{"itemId":id}
		}).success(function(data){
			$scope.cart = [];
			$scope.init();
		}).error(function(data){
			
		});
	};
	
	$scope.update = function(id,value)
	{
		alert(id);
		
		if(!Number.isNaN(value) && (value != null))
			{
			alert(value);	
		$http({
			method : "POST",
		    url : '/updateCart',
		    data :{
		    	"itemId":id,
		    	"updatedquantity":value }
		    
		}).success(function(data){
			$scope.cart = [];
			$scope.init();
		}).error(function(data){
		});
			}
	}
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
	
	
	
	$scope.checkout = function()
	{
		alert("Proceed");
		$http({
		method : "GET",
	    url : '/validateCart',
	}).success(function(data){
		alert(data.statusCode);
		if(data.statusCode == 200)
		{
			$window.location.href = '/checkout';	
		}
		else
		{
			alert("Quantity not availablefor Item id:" + data.itemId);
		}
	}).error(function(data){
		
	});
		
	}
	
});
