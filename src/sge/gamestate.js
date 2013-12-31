define([
		'./class'
	], 
	function(Class){

		var GameState =  Class.extend({
			init: function(game, options){
				this.game = game;
			},
			startState: function(){},
			endState: function(){},
			tick: function(delta){}
		});



		return GameState;
	}
)