define([
        'sge',
        './config'
    ], function(sge, config){
        var createSandbox = function(code, that, locals) {
            that = that || Object.create(null);
            locals = locals || {};
            var params = []; // the names of local variables
            var args = []; // the local variables

            for (var param in locals) {
                if (locals.hasOwnProperty(param)) {
                    args.push(locals[param]);
                    params.push(param);
                }
            }

            var context = Array.prototype.concat.call(that, params, code); // create the parameter list for the sandbox
            var sandbox = new (Function.prototype.bind.apply(Function, context)); // create the sandbox function
            context = Array.prototype.concat.call(that, args); // create the argument list for the sandbox

            return Function.prototype.bind.apply(sandbox, context); // bind the local variables to the sandbox
        }

        var DialogSystem = sge.Class.extend({
            init: function(){
                this._data = {};
            },
            load: function(data){
                var ids = Object.keys(data);
                for (var i = ids.length - 1; i >= 0; i--) {
                    this._data[ids[i]] = data[ids[i]];
                }
            },
            getDialog: function(id, gameState){
                var data = this._data[id];
                console.log('Data', data);
                var node = null;
                for (var i=0; i<data.length;i++){
                    node = data[i];
                    if (node.condition){
                        var func = node.condition.replace(/@\(([\w\.]+)\)\.([\w+\.]+)/g,"state.getEntity('$1').get('$2')");
                        func = func.replace(/@\(([\w\.]+)\)/g,"state.getEntity('$1')");
                        if (!func.match(/return/)){
                            func = 'return ' + func;
                        }
                        var sandbox = createSandbox(func, null, {state: gameState});
                        // @if DEBUG
                        console.log('Dialog Condition:', func);
                        // @endif
                        var result = sandbox();
                        // @if DEBUG
                        console.log('Dialog Result', result);
                        // @endif
                        if (result){
                            break;
                        }
                    }
                }
                return node;
            }
        })

    	var CutsceneState = sge.GameState.extend({
                init: function(game){
                    this._super(game);
                    this.dialog = new DialogSystem();
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
                createSandbox: function(code){
                    var func = code.replace(/@\(([\w\.]+)\)\.([\w+\.]+)^\(/g,"state.getEntity('$1').get('$2')");
                    func = func.replace(/@\(([\w\.]+)\)/g,"state.getEntity('$1')")
                    if (!func.match(/return/)){
                        func = 'return ' + func;
                    }
                    console.log(func);
                    return createSandbox(func, null, {state: this.game.getState('game')});
                },
                tick: function(){
                    if (this.input.isPressed('space')){
                        if (this.dialogNode){
                            if (this.dialogNode.postScript){
                                sandbox = this.createSandbox(this.dialogNode.postScript);
                                sandbox();
                            }
                        }
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
                    var node = this.dialog.getDialog(dialog, this.game.getState('game'));
                    while (this.container.children.length){
                        this.container.removeChild(this.container.children[0]);
                    }
                    var text = new PIXI.BitmapText(node.text, {font: '32px 8bit'});
                    text.position.y = this.game.height / (2*this._scale);
                    text.position.x = 32;
                    this.container.addChild(this.background)
                    this.container.addChild(text);
                    this.dialogNode = node;
                }
            })
		return CutsceneState;
	}
)