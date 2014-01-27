var module = angular.module("subzero", []);
module.controller("DialogCtrl", ['$scope', '$http', function($scope, $http, $routeParams){

	$scope.addResponse = function(node){
		if (!node.responses){
			node.responses = [];
		}
		node.responses.push({
			text: "",
			command: null,
			nodes: []
		})
	}

	$scope.addRequirement = function(node){
		
		if (!node.requirements){
			node.requirements = [];
		}
		node.requirements.push('expr' + node.requirements.length);
		console.log('Add Req', node.requirements);
	}

	$scope.removeRequirement = function(node, req){
		idx = node.requirements.indexOf(req);
		node.requirements.splice(idx, 1);
	}

	$scope.addDialog = function(){
		var name = prompt('Dialog Name:');
		$scope.dialog.push({name: name, nodes: []});
	}

	$scope.addDialogNode = function(parent){
		parent.nodes.push({
			id: -1,
			text: "",
			speaker: parent.speaker
		});
	}

	$scope.removeDialogNode = function(parent, node){
		idx = parent.nodes.indexOf(node);
		parent.nodes.splice(idx, 1);
	}

	$scope.save = function(){
		$http.post('save', {
			file: 'content/dialog/standard.json',
			content: JSON.stringify({dialog: $scope.dialog})
		}).success(function(){
			alert('File Saved!')
		});
	}

	$http({method: 'GET', url: 'content/dialog/standard.json'}).success(function(data){
		console.log('Loaded', data);
		$scope.dialog = data.dialog;
	});
}])
