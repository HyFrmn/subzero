var app = angular.module('subzeroEditor', []);

app.controller('EventController', ['$scope', '$http', function($scope, $http) {
	$scope.addAction = function(evt){
		console.log(evt)
		evt.actions.push({
			xtype: 'nav'
		})
	}

	$scope.createEvent = function(){
		$scope.event.events.push({
			name: 'newEvent',
			actions: []
		})
	};

	$scope.init = function(){
		$scope.event={
			events:[],
			triggers: [],
			regions: []
		}
		$http({url:'json/action_meta.json', method:'GET'}).success(function(data){
			$scope.actionMeta = data;
			console.log(data)
		})
	}
}])