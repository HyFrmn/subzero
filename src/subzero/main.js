define([
	'sge',
	'./subzerostate',
	'./cutscenestate'
],
function(sge, SubzeroState, CutsceneState){
	return {
	    CreateGame : function(width, height, fps){
	        var game = new sge.Game({
	            elem: document.getElementById('game'),
	            width: parseInt(width || 720),
	            height: parseInt(height || 540),
	            fps: parseInt(fps || 30),
	        });
	        
	        //Should create function when this works.
		    game._states['cutscene'] = new CutsceneState(game, 'Cutscene');
		    game.fsm.addEvent({name:'startCutscene', from:'game',to:'cutscene'});
		    game.fsm.addEvent({name:'endCutscene', from:'cutscene',to:'game'});

	        var state = game.setGameState(SubzeroState);
	        return game;
	    }
	}
})
