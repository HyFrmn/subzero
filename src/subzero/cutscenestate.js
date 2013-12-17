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
                this.scene = new CAAT.ActorContainer().setBounds(0,0,800,800);
                this.gameState.scene.addChild(this.scene);
                console.log('Start Cutscene!');
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
                this._actionSeq._currentAction.tick(delta);
                if (this._actionSeq._currentAction.complete){
                    this._actionSeq._currentAction = null;
                }
                this.gameState.render(delta);    
        	},
        	endState: function(){
                this._super();
                this.gameState.scene.removeChild(this.scene);
                console.log('End Cutscene!');
        	}

        });

        return CutsceneState;
    }
)