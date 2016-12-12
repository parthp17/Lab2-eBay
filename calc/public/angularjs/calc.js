"use strict"
var calc = angular.module('calc',[]);
calc.controller('calc',function($scope,$http){
	$scope.operand1 = 0;
	$scope.operand2 = 0;
	$scope.hideResult = true;
	$scope.hideError = true;
	$scope.calc = function(operation)
	{
		var vurl = '/'+operation; 
		$http(
		{
			method : "POST",
			url : vurl,
			data :
			{
				"operand1" : $scope.operand1,
				"operand2" : $scope.operand2
			}
		}).success(function(data)
		{
			if(isNaN(data.result))
			{
				$scope.Error = data.result;
				$scope.result = "";
				$scope.hideResult = true;
				$scope.hideError = false;
			}
			else
			{
				$scope.result = data.result;
				$scope.Error = "";
				$scope.hideResult = false;
				$scope.hideError = true;
			}
		}).error(function(error)
		{
			$scope.Error = "Some error Ocurred."
			$scope.result = "";
			$scope.hideResult = true;
			$scope.hideError = false;
			
		});
	}
	
})