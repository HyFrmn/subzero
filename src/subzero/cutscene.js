define([
        'sge',
        './config'
    ], function(sge, config){
    	var CutsceneState = sge.GameState.extend({
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
            })
		return CutsceneState;
	}
)