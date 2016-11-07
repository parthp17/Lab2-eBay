"use strict"
var login = angular.module('login', []);

login.controller('signup', function($scope, $http,$window){
	$scope.signup = function()
	{	
		alert("HI");
		$http({
			method : "POST",
		    url : '/signUp',
		    data :
		    {
		        "email" : $scope.email,
		        "re-email" : $scope.reEmail,
		        "password" : $scope.password,
		        "fname" : $scope.fname,
		        "lname" : $scope.lname
		    }
		}).success(function(data){
			
			if(data.statusCode == 200)
			{
				$window.location.href = '/profile';
			}
			else if(data.statusCode == 409)
			{
				$window.location.href = '/';
			}
			else
			{
				$window.location.href = '/';
			}
		}).error(function(data){
			
		});
	}
})


login.controller('login', function($scope, $http,$window)
{
	$scope.invalidLogin = true;
	$scope.username = "";
	$scope.password = "";
	
	$scope.login = function()
	{
		$http({
			method : "POST",
		    url : '/logIn',
		    data :
		    {
		        "username" : $scope.username,
		        "password" : $scope.password
		    }
		}).success(function(data){alert(data.statusCode);
			if (data.statusCode == 200) {
				$scope.invalidLogin = true;
				$window.location.href = '/home';	
			}
			else
			{
				$scope.invalidLogin = false;
			}
		}).error(function(data){
			
		});
	}
});
