define([
    'sge',
    './tiledlevel',
    './physics',
    './factory',
    './interaction',
    './equipable',
    ],
    function(sge, TiledLevel, Physics, Factory, Interact){
        
        var CutsceneState = sge.GameState.extend({
        	initState: function(){
        		this._keepState = true;
        		this._actionSeq = null;
        	},
        	startState: function(event, from, to, seq){
        		this.gameState = this.game._states.game;
                this.events = this.gameState.events;
                this.scene = new CAAT.ActorContainer().setBounds(0,0,800,800);
                this.gameState.scene.addChild(this.scene);
                this._actionSeq = seq;
                seq._currentAction.start(this);
        	},
        	tick: function(delta){
        		if (!this._actionSeq._currentAction){
        			if (this._actionSeq._actions.length>0){
                        this._actionSeq._currentAction = this._actionSeq._actions.shift();
                        if (this._actionSeq._currentAction.cutscene){
                            this._actionSeq._currentAction.start(this);
                        } else {
                            this.game.fsm.endCutscene();
                            this._actionSeq._currentAction.start(this.gameState);
                        }
        			} else {
        				this.game.fsm.endCutscene();
        				return;
        			}
        		}
                if (!this._actionSeq._currentAction.complete){
                    this._actionSeq._currentAction.tick(delta);
                }
                if (this._actionSeq._currentAction.complete){
                    children = this._actionSeq._currentAction.data.children;
                    if (children){
                        this._actionSeq.insert(children);
                    }
                    console.log(this._actionSeq._actions)
                    this._actionSeq._currentAction = null;
                }
                this.gameState.render(delta);    
        	},
        	endState: function(){
                this._super();
                this.gameState.scene.removeChild(this.scene);
        	}

        });

        return CutsceneState;
    }
)