require.config({
	baseUrl: 'src',
	packages: ['sge', 'subzero'],

})
define([
		'sge','subzero'
	], function(sge, subzero){
		var loader = new sge.Loader();
		var promises = [];
		promises.push(loader.loadFont('content/font/standard_white.fnt'))
		promises.push(loader.loadTexture('content/backgrounds/space_a.png', 'backgrounds/space_a'))
		promises.push(loader.loadTexture('content/backgrounds/space_b.png', 'backgrounds/space_b'))
		promises.push(loader.loadTexture('content/backgrounds/space_c.png', 'backgrounds/space_c'))
		promises.push(loader.loadTexture('content/backgrounds/space_d.png', 'backgrounds/space_d'))
		promises.push(loader.loadTexture('content/backgrounds/space_e.png', 'backgrounds/space_e'))
		sge.When.all(promises).then(function(){
			function getURLParameter(name) {
	            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	        }

	        var options = {
	        	map: getURLParameter('map') || 'ai_test_c',
	        	debug: {
	        		drawSocial: getURLParameter('debug-social') || false
	        	}
	        }

	        

			game = new sge.Game();
			
			game.setStateClass('paused', subzero.PausedState);
			game.createState('paused');
			
			game.setStateClass('menu', subzero.MenuState);
			game.createState('menu');

			game.setStateClass('load', subzero.MenuState);
			game.createState('load');
			
			game.setStateClass('win', subzero.WinState);
			game.createState('win');
			
			game.setStateClass('lose', subzero.LoseState);
			game.createState('lose');
			
			game.setStateClass('cutscene', subzero.CutsceneState);
			game.createState('cutscene');

			game.setStateClass('inventory', subzero.InventoryState);
			game.createState('inventory');

			game.setStateClass('swap', subzero.InventorySwapState);
			game.createState('swap');

			game.setStateClass('game', subzero.SubzeroState);
			game.start(options);
			game.changeState('menu')
			window.onblur = function(){
				game.changeState('paused')
			}
		})
	}
)