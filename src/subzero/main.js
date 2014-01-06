define([
		'sge',
		'./config',
		'./subzerostate',
	], function(sge, config, SubzeroState){
		var MenuItem = sge.Class.extend({
			init: function(text, callback){
				this._text = text;
				this._callback = callback;
				this.container = new PIXI.DisplayObjectContainer();
				this.background = new PIXI.Graphics();
				this.background.lineStyle(4, config.colors.primaryDark, 1);
				this.background.drawRect(0,0, 200, 32);
				this.text = new PIXI.BitmapText(this._text, {font: '24px 8bit'});
				this.text.position.y = 4;
				this.text.position.x = 8;
				this.container.addChild(this.background);
				this.container.addChild(this.text);

			},
			select: function(){
				this._selected = true
			},
			unselect: function(){
				this._selected = false
			},
			update: function(){
				if (this._selected){
					this.container.position.x = 24;
					this.background.lineStyle(4, config.colors.complementBright, 1);
					this.background.drawRect(0,0, 200, 32);
				} else {
					this.container.position.x = 0;
					this.background.lineStyle(4, config.colors.primaryDark, 1);
					this.background.drawRect(0,0, 200, 32);
				}
			},
			callback: function(){
				this._callback();
			}
		});

		return {
			SubzeroState: SubzeroState,
			CutsceneState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x000000);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;

					this.background = new PIXI.Graphics();
					this.background.beginFill('0x000000');
					this.background.drawRect(0,0,game.width,game.height);
					this.background.endFill()
					this.background.alpha = 0.65;
	        	},
	        	tick: function(){
	        		if (this.input.isPressed('space')){
	        			this.game.changeState('game');
	        		}
	        	},
	        	startState: function(){
	        		this.gameState = this.game.getState('game');
	        		this.gameState.stage.addChild(this.container);
	        	},
	        	endState: function(){
	        		this.gameState.stage.removeChild(this.container);
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.gameState.stage);
	        	},
	        	setDialog: function(dialog){
	        		while (this.container.children.length){
	        			this.container.removeChild(this.container.children[0]);
	        		}
	        		var text = new PIXI.BitmapText(dialog, {font: '32px 8bit'});
	        		text.position.y = this.game.height / (2*this._scale);
	        		text.position.x = 32;
	        		this.container.addChild(this.background)
	        		this.container.addChild(text);
	        	}
	        }),
			InventoryState : sge.GameState.extend({
	        	init: function(game){
	        		this._super(game);
	        		this.stage = new PIXI.Stage(0x000000);
					this.container = new PIXI.DisplayObjectContainer();
					this._scale = 1;
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;

					this.background = new PIXI.Graphics();
					this.background.beginFill('0x000000');
					this.background.drawRect(0,0,game.width,game.height);
					this.background.endFill()
					this.background.alpha = 0.65;
	        	
	        		this.container.addChild(this.background);

	        		this._index = 0;
					this.menuContainer = new PIXI.DisplayObjectContainer();
					this.menuContainer.position.x = this.menuContainer.position.y = 64;
					this.container.addChild(this.menuContainer);
					this._itemText = ['','','','',''];
					this.items = [];
					this.createMenu();
	        	},

	        	createMenu: function(){
	        		for (var i=0;i<this._itemText.length;i++){
	        			var item = new MenuItem(this._itemText[i]);
	        			item.container.position.y = i * 40;
	        			this.menuContainer.addChild(item.container);
	        			this.items.push(item);
	        		}
	        		var item = new MenuItem('Quit', function(){
	        			this.game.changeState('game');
	        		}.bind(this));
        			item.container.position.y = i * 40;
        			this.menuContainer.addChild(item.container);
        			this.items.push(item);

        			this.updateMenu();
	        	},

	        	tick: function(){
	        		if (this.input.isPressed('up')){
	        			this.up();
	        		}

	        		if (this.input.isPressed('down')){
	        			this.down();
	        		}

	        		if (this.input.isPressed('enter') || this.input.isPressed('space')){
	        			this.items[this._index].callback();
	        		}
	        	},

	        	up: function(){
	        		this._index--;
	        		if (this._index<0){
	        			this._index=0;
	        		}
	        		this.updateMenu();
	        	},

	        	down: function(){
	        		this._index++;
	        		if (this._index>=this.items.length){
	        			this._index=this.items.length-1;
	        		}
	        		this.updateMenu();
	        	},

	        	updateMenu: function(){
					this.items.forEach(function(i){i.unselect()});
        			this.items[this._index].select();
        			this.items.forEach(function(i){i.update()});
	        	},

	        	startState: function(){
	        		this.gameState = this.game.getState('game');
	        		this.gameState.stage.addChild(this.container);
	        	},
	        	endState: function(){
	        		this.gameState.stage.removeChild(this.container);
	        	},
	        	render: function(){
	        		this.game.renderer.render(this.gameState.stage);
	        	}
	        }),
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