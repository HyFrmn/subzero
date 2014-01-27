define(['sge/class', 'sge/loader'],
	function(Class, Loader){
		var loader = new Loader(true);
		function DialogCtrl($scope){
			loader.loadJSON('content/dialog/standard.json').then(function(dialog){
				console.log('Loaded', dialog);
			});
		}
		var Editor = {};
		return Editor
	}
)