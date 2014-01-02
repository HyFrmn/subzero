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
		sge.When.all(promises).then(function(){
			function getURLParameter(name) {
	            return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
	        }

	        var options = {
	        	map: getURLParameter('map') || 'ai_test_d',
	        	debug: {
	        		drawSocial: getURLParameter('debug-social') || false
	        	}
	        }

	        var PausedState = sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_a');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Paused', {font: '96px 8bit'});
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('game');
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        })

			game = new sge.Game();
			game.setStateClass('paused', PausedState);
			game.createState('paused');
			game.setStateClass('game', subzero.SubzeroState);
			game.createState('game');
			game.start(options);
			window.onblur = function(){
				game.changeState('paused')
			}
		})
	}
)