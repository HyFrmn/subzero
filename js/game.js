require.config({
	baseUrl: '/src',
	packages: ['sge', 'subzero'],

})
define([
		'sge','subzero'
	], function(sge, subzero){
		console.log(sge, subzero)
		game = new sge.Game();

		game.setStateClass('game', subzero.SubzeroState);
		game.createState('game');
		game.start();
	}
)