define([
        'sge',
        './config'
    ], function(sge, config){
    	PausedState = sge.GameState.extend({
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
        });
		return PausedState;
	}
)