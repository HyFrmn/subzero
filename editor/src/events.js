function EventsCtrl($scope){
	
	$scope.createTrigger = function(){
		$scope.event.triggers.push({
			"target" : "",
			"listenFor" : "",
			"event" : ""
		})
	}


	var init = function(){
		$scope.event = {}
		$scope.event.triggers = [{
			"target" : "level",
			"listenFor" : "start",
			"event" : "intro"
		}];
		$scope.event.events = [];
		console.log($scope.event);
	}
	init();
}