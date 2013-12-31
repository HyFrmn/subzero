define([
		'./class',
		'./observable',
		'./game',
		'./gamestate',
		'./loader',
		'./when'
	], function(Class, Observable, Game, GameState, Loader, When){
		return {
			Class : Class,
			Observable : Observable,
			Game : Game,
			GameState : GameState,
			Loader : Loader,
			When : When
		}
	}
)