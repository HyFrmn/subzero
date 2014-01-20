define([
        'sge',
        './config',
        './subzerostate',
        './inventory',
    ], function(sge, config, SubzeroState, inventory){
        
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
            InventoryState : inventory.InventoryState,
            InventorySwapState : inventory.InventorySwapState,
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
                        this.game.changeState('load');
                        return;
                    }
                },
                render: function(){
                    this.game.renderer.render(this.stage);
                }
            }),
        LoadState : sge.GameState.extend({
                init: function(game){
                    this._super(game);
                    this.stage = new PIXI.Stage(0x66FF99);
                    this.container = new PIXI.DisplayObjectContainer();
                    this._scale = 1;
                    this.container.scale.x= window.innerWidth / game.width;
                    this.container.scale.y= window.innerHeight / game.height;
                
                    
                    var background = new PIXI.Sprite.fromFrame('backgrounds/space_d');
                    this.stage.addChild(background);

                    var text = new PIXI.BitmapText('Loading', {font: '96px 8bit', align: 'center'});
                    text.position.x = game.renderer.width / 2;
                    text.position.y = game.renderer.height / 2;
                    this.container.addChild(text);

                    this.stage.addChild(this.container);
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