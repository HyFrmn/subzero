require.config({
	baseUrl: 'src',
	packages: ['sge', 'subzero'],

})
define([
		'sge','subzero'
	], function(sge, subzero){

		function getURLParameter(name) {
            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
        }

        var options = {
        	map: getURLParameter('debug-map') || 'ai_test_b',
        }

		game = new sge.Game();
		game.setStateClass('game', subzero.SubzeroState);
		game.createState('game');
		game.start(options);
	}
)