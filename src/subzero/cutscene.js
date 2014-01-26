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
                    this._index = 0;
                    this.container.scale.x= window.innerWidth / game.width;
                    this.container.scale.y= window.innerHeight / game.height;

                    this.background = new PIXI.Graphics();
                    this.background.beginFill('0x000000');
                    this.background.drawRect(0,0,game.width,game.height);
                    this.background.endFill()
                    this.background.alpha = 0.65;
                    this._state = 'dialog';
                },
                tick: function(){
                    if (this.input.isPressed('space') || this.input.isPressed('enter')){
                        this.interact();
                    }
                     if (this.input.isPressed('up')){
                        this.up();
                    }

                    if (this.input.isPressed('down')){
                        this.down();
                    }
                },
                interact: function(){
                    if (this._state=='choose'){
                        this._state='dialog';
                        var node = this._responses[this._index][1]
                        if (node){
                            if (node.postScript){
                                var sandbox = this.createSandbox(node.postScript);
                                sandbox();
                            }

                            this.parseDialogNode(node, true);
                        }
                    } else {
                        if (this._node){
                            if (this._node.postScript){
                                var sandbox = this.createSandbox(this._node.postScript);
                                sandbox();
                            }
                            this.parseResponsesNode(this._node, true);
                        } else {
                            this.game.changeState('game');
                        }
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
                _clearResponses: function(){
                    this._responses = [];
                    this._index = 0;
                },
                _addResponse: function(node){
                    if (node.command){
                        this._responses.push(['[' + node.command + ']', node]);
                    } else {
                        this._responses.push([node.text, node]);
                    }
                    
                },
                _showResponses: function(){
                    while (this.container.children.length){
                        this.container.removeChild(this.container.children[0]);
                    }
                    this.container.addChild(this.background);
                    for (var i=0;i<this._responses.length;i++){
                        var response = this._responses[i];
                        var text = new PIXI.BitmapText(response[0], {font: '32px 8bit'});
                        text.position.y = this.game.height / (2*this._scale) + (i * 48);
                        text.position.x = 32;
                        this.container.addChild(text);
                        this._responses[i].push(text);
                    }
                    this._highlight = new PIXI.Graphics();
                    this._highlight.lineStyle(4, config.colors.complementBright, 1);
                    this._highlight.drawRect(0,0,this.game.width-48,36);
                    this._highlight.position.y = (this.game.height / (2*this._scale))-1;
                    this._highlight.position.x = 24;
                    this.container.addChild(this._highlight);
                    this._state = 'choose';
                },
                _updateResonses: function(){
                    this._highlight.position.y = this.game.height / (2*this._scale) + (this._index * 48) - 1;
                },
                parseResponsesNode: function(node){
                    this._clearResponses()
                    if (node.responses){
                        var children = node.responses || [];
                        var child=null;
                        for (var i=0; i<children.length;i++){
                            child = children[i];
                            if (child.requirements){
                                for (var j = child.requirements.length - 1; j >= 0; j--) {
                                    var req = child.requirements[j];
                                    var sandbox = this.createSandbox(req);
                                    var result = Boolean(sandbox());
                                    console.log(req, result)
                                    if (result){
                                        child = null;
                                        break;
                                    }
                                };
                                if (child){
                                    this._addResponse(child);
                                }
                            } else {
                                this._addResponse(child);                              
                            }
                        }
                        this._showResponses();
                    } else {
                        this.game.changeState('game');
                    }
                },
                up: function(){
                    this._index--;
                    if (this._index<0){
                        this._index=0;
                    }
                    this._updateResonses();
                    createjs.Sound.play('select.up');
                },

                down: function(){
                    this._index++;
                    if (this._index>=this._responses.length){
                        this._index=this._responses.length-1;
                    }
                    this._updateResonses();
                    createjs.Sound.play('select.down');
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