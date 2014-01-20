define([
        'sge',
        './config'
    ], function(sge, config){
    	var LoadState = sge.GameState.extend({
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
        });
		return LoadState;
	}
)