define([
		'sge',
		'./subzerostate',
	], function(sge, SubzeroState){
		return {
			SubzeroState: SubzeroState,
			PausedState : sge.GameState.extend({
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
	        }),

		MenuState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Subzero', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.createState('game');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		WinState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_d');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Win', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('menu');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		LoseState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x66FF99);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				
					
					var background = new PIXI.Sprite.fromFrame('backgrounds/space_e');
					this.stage.addChild(background);

					var text = new PIXI.BitmapText('Lose', {font: '96px 8bit', align: 'center'});
					text.position.x = game.renderer.width / 2;
					text.position.y = game.renderer.height / 2;
					this.container.addChild(text);

					var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
					text.position.y = game.renderer.height - 64;
					this.container.addChild(text);

					this.stage.addChild(this.container);
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('menu');
	        			return;
	        		}
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.stage);
	        	}
	        }),
		}
	}
)