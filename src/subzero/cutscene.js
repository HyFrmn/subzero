define([
        'sge',
        './config',
        './dialog'
    ], function(sge, config, Dialog){
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
                        this.interact();
                    }
                },
                interact: function(){
                    if (this._node){
                        if (this._node.postScript){
                            var sandbox = this.createSandbox(this._node.postScript);
                            sandbox();
                        }
                        this.parseDialogNode(this._node, true);
                    } else {
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
                startDialog: function(id){
                    var node = Dialog.dialogs[id];
                    var children = node.nodes || [];
                    var child=null;
                    for (var i=0; i<children.length;i++){
                        child = children[i];
                        break;
                    }
                    if (child){
                        this.game.changeState('cutscene');
                        this.parseDialogNode(child);
                        return true;
                    } else {
                        return false;
                    }
                },
                parseDialogNode: function(node, skipText){
                    if (node.text && !skipText){
                        this.setDialogText(node.text);
                        this._node = node;
                    } else {
                        var children = node.nodes || [];
                        var child=null;
                        for (var i=0; i<children.length;i++){
                            child = children[i];
                            if (child.requirements){
                                for (var j = child.requirements.length - 1; j >= 0; j--) {
                                    var req = child.requirements[j];
                                    var sandbox = this.createSandbox(req);
                                    var result = Boolean(sandbox());
                                    console.log(req, result)
                                    if (!result){
                                        child = null;
                                        break;
                                    }
                                };
                                if (child){
                                    break;
                                }
                            } else {
                                break;                                
                            }
                        }
                        if (child){
                            this.parseDialogNode(child);
                        } else {
                            this.game.changeState('game');
                        }
                    }
                },
                setDialogText: function(dialog){
                    while (this.container.children.length){
                        this.container.removeChild(this.container.children[0]);
                    }
                    var text = new PIXI.BitmapText(dialog, {font: '32px 8bit'});
                    text.position.y = this.game.height / (2*this._scale);
                    text.position.x = 32;
                    this.container.addChild(this.background)
                    this.container.addChild(text);
                },
                createSandbox : function(func){
                    code = func.replace(/@\(([\w\.]+)\)/g,"state.getEntity('$1')");
                    if (!code.match(/return/) && !code.match(/;/) && !code.match(/\n/)){
                        code = 'return ' + code;
                    }
                    console.log('Sandbox Code', func, code);
                    return sge.createSandbox(code, null, {
                        state: this.game.getState('game')
                    })
                }

            })
		return CutsceneState;
	}
)