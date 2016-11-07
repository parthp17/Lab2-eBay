"use strict"
var profile = angular.module('profile', []);

profile.controller('profile', function($scope, $http, $window)
		{
			$scope.states = ["Alabama",
			      "Alaska",
			      "Arizona",
			      "Arkansas",
			      "California",
			      "Colorado",
			      "Connecticut",
			      "Delaware",
			      "District Of Columbia",
			      "Florida",
			      "Georgia",
			      "Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi","Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico","New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania","Rhode Island",
			      "South Carolina",
			      "South Dakota",
			      "Tennessee",
			      "Texas",
			      "Utah",
			      "Vermont",
			      "Virginia",
			      "Washington",
			      "West Virginia",
			      "Wisconsin",
			      "Wyoming",
			      "Puerto Rico",
			      "Virgin Islands",
			      "Northern Mariana Islands",
			      "Guam",
			      "American Samoa",
			      "Palau"];
			$scope.contact = "";
			$scope.zipcode = "";
			$scope.city = "";
			$scope.adrLine2 = "";
			$scope.adrLine1="";
			$scope.selectedState = $scope.states[0];
			$scope.bdate = "";
			
			$scope.init = function()
			{
				$http({
					method : "GET",
				    url : '/getProfile'
				}).success(function(data){
					if(data.statusCode = 200)
					{
						var date = new Date(data.result.birthday);
						var month = date.getMonth() + 1;
						var day = date.getDate();
						date = date.getFullYear() + "-" + month + "-" + day;
						$scope.bdate = date;
						$scope.contact = data.result.contact;
						$scope.zipcode = data.result.zipcode;
						$scope.city = data.result.city;
						$scope.adrLine2 = data.result.adrLine2;
						$scope.adrLine1= data.result.adrLine1;
						$scope.selectedState = data.result.state;
					}
					else
					{
						console.log(data);
						//$window.location.href = '/';
					}
				}).error(function(err){
					
				});
			};
			
			$scope.update = function()
			{
			
				$http({
					method : "POST",
				    url : '/updateProfile',
				    data :
				    {
				    	
				    	"birthday": $scope.bdate,
				        "adrLine1" : $scope.adrLine1,
				        "adrLine2" : $scope.adrLine2,
				        "city":  $scope.city,
				        "zipcode": $scope.zipcode,
				        "state": $scope.selectedState,
				        "contact": $scope.contact,
				        "country":"United States",
				    }
				}).success(function(data){
					alert(data.statusCode);
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
			};
		});