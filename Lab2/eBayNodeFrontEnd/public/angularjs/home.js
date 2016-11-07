"use strict"
var home = angular.module('home', []);

home.controller('home', function($scope, $http, $window)
		{
			$scope.items = [];
			$scope.init = function()
			{
				
				$http({
					method : "GET",
				    url : '/getHomeValues'
				}).success(function(data){
					if(data.statusCode = 200)
					{
						alert(data.fname);
						$scope.displayName = data.fname;
						$scope.username = data.username;
						$scope.lastLoggedIn = new Date(data.lastLoggedIn).toLocaleString();
						var i =0;
						for(i;i<data.items.length;i++)
						{
							console.log(data.items[i].itemName);
							$scope.items.push(data.items[i]);
						}
						 
					}
					else
					{	
						//$window.location.href = '/';
					}
				}).error(function(err){
					
				});
			};
			
			//$scope.init();
			
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
			
			$scope.profile = function()
			{				
						$window.location.href = '/profile';
			};
			
			$scope.sell = function()
			{
				$http({
					method : "GET",
				    url : '/sell',
				}).success(function(data){
						$window.location.href = '/sell';
				}).error(function(data){
					
				});
			};
			
			$scope.getItem = function(id)
			{
				alert(id);
				$window.location.href = '/item?itemId='+id;
			};
			
			$scope.myProfile = function()
			{
				$window.location.href = '/'+$scope.username;
			};
		});
