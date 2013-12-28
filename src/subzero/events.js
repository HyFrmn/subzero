define(['sge'],
	function(sge){
		var EventAction = sge.Class.extend({
            init:  function(data){
                this.data = data; 
                this.complete = false;
                this.async = false;        //Is this action asyncronys.
                this.cutscene = false;     //Is the action part of a cutscene. (Should gameplay be stopped?).
            },
            tick: function(){
                this.end();
            },
            end: function(){
                this.complete = true;
            },
            start: function(state){
            	this.state=state;
                this.gameState = state.game._states.game;
                this.cutsceneState = state.game._states.cutscene;
            }
        });

        EventAction._classMap = {};
        EventAction.set = function(name, cls){
            EventAction._classMap[name] = cls;
        };
        EventAction.get = function(name){
            if (!EventAction._classMap[name]){
                console.log('Missing: ' + name)
            }
            return EventAction._classMap[name];
        }

        var AttrSetAction = EventAction.extend({
            start: function(state){
                this._super(state);
                this.entity = this.gameState.getEntityByName(this.data.entity);
                this.entity.set(this.data.attr, this.data.value, this.data.arg0)
                this.end();
            }
        })
        EventAction.set('attr.set', AttrSetAction);

        var EntitySpawnAction = EventAction.extend({
            start: function(state){
                this._super(state);
                this.entity = state.level.getUnspawnedEntity(this.data.entity);
                state.addEntity(this.entity);
                this.end();
            }
        })
        EventAction.set('entity.spawn', EntitySpawnAction);

        var EntityRemoveAction = EventAction.extend({
            start: function(state){
                this._super(state);
                this.target = this.gameState.getEntityByName(this.data.target); 
                this.gameState.removeEntity(this.target);
                this.end();
            }
        });
        EventAction.set('entity.remove', EntityRemoveAction);

        var EventFireAction = EventAction.extend({
            start: function(state){
                this._super(state);
                this.target = this.gameState.getEntityByName(this.data.entity); 
                this.target.fireEvent(this.data.event, this.data.arg0, this.data.arg1, this.data.arg2, this.data.arg3)
                //this.gameState.removeEntity(this.target);
                this.end();
            }
        });
        EventAction.set('event.fire', EventFireAction);

        var LevelLoadAction = EventAction.extend({
            start: function(state){
                this._super(state);
                state.game.data.level = this.data.level;
                state.game._states.game =  new state.game._gameState(state.game, 'Game');
                state.game.fsm.startLoad();
                this.end();
            }
        });
        EventAction.set('level.load', LevelLoadAction);

        var DialogAction = EventAction.extend({
            init: function(data){
                this._super(data);
                this.cutscene = true;
                this.emote = data.emote || false;
            },
            start: function(state){
            	this._super(state);
                this.entity = this.gameState.getEntityByName(this.data.entity); 
            	this.async = true;
                if (this.data.location){
                    this._dialog = state.events.getDialog(this.data.location);
                } else {
                    this._dialog = this.data.dialog;
                }
                
                if (this.emote){
                    this.entity.fireEvent('emote.msg', this._dialog);
                    this.end();
                } else {
                    this.width = state.game.renderer.width - 64;
                    this.height = (state.game.renderer.height/2) - 64;
                    this.padding = 64;
                    this._container = new CAAT.ActorContainer().setBounds(32,32+(state.game.renderer.height/2),this.width,this.height);
                    
                    this._border = new CAAT.ShapeActor().setShape(CAAT.ShapeActor.SHAPE_RECT).setBounds(0,0,this.width, this.height).setFillStyle('white');
                    this._container.addChild(this._border);

                    this._background = new CAAT.ShapeActor().setShape(CAAT.ShapeActor.SHAPE_RECT).setBounds(4,4,this.width-8, this.height-8).setFillStyle('black').setAlpha(0.85);
                    this._container.addChild(this._background);
                    this.setDialogText(this.entity.name + ': ' + this._dialog);
                    this.state.scene.addChild(this._container);
                }
            },
            end: function(){
                this._super();
                this.state.scene.removeChild(this._container);
            },
            tick: function(){
                if (this.state.input.isPressed('space')){
                    this.end();
                }
            },
            setDialogText: function(dialog){
                //this._clearScreen();
                var chunks = dialog.split(' ');
                var count = chunks.length;
                var start = 0;
                var end = 0;
                var actor = new CAAT.TextActor().setFont('24px sans-serif');
                var y = 4;
                var testWidth = this.width - 32;
                var dialogContainer = new CAAT.ActorContainer().setSize(360,60);
                while (end<=count){
                    var test = chunks.slice(start, end).join(' ');
                    actor.setText(test);
                    actor.calcTextSize(this.state.game.renderer);
                    if (actor.textWidth > (testWidth)){
                        end--;
                        actor.setLocation(16,y).setText(chunks.slice(start, end).join(' '));
                        dialogContainer.addChild(actor);
                        y+=24;
                        start = end;
                        end = start + 1;
                        actor = new CAAT.TextActor().setFont('24px sans-serif');
                    } else {
                        end++;
                    }
                }
                actor.setLocation(16,y);
                dialogContainer.addChild(actor);
                dialogContainer.setLocation(0,0);
                //dialogContainer.setLocation(16, this.state.game.renderer.height - (y+96));
                dialogContainer.cacheAsBitmap();
                this._container.addChild(dialogContainer);
                //this.instructions.setText(DIALOG_INSTRUCTIONS);
                //this.backDrop.setVisible(true);
                //this.backDrop.setLocation(12, this.state.game.renderer.height - (y+100));
                //this.awaitInteraction();
            }
        });
        EventAction.set('dialog', DialogAction);

        var QuestionAction = EventAction.extend({
            init: function(data){
                this._super(data);
                this.cutscene = true;
                this.responses = data.responses || ['Yes','No'];
                this._index = 0;
            },
            start: function(state){
                this._super(state);
                this.entity = this.gameState.getEntityByName(this.data.entity);
                this.async = true;
                this._dialog = data.dialog;
                this.width = state.game.renderer.width - 64;
                this.height = state.game.renderer.height - 64;
                this.padding = 64;
                this._container = new CAAT.ActorContainer().setBounds(32,32,this.width,this.height);
                this._background = new CAAT.ShapeActor().setShape(CAAT.ShapeActor.SHAPE_RECT).setBounds(0,0,this.width, this.height).setFillStyle('black').setAlpha(0.65);
                this._container.addChild(this._background);
                this.setDialogText(this.data.dialog);
                this.state.scene.addChild(this._container);
                
            },
            end: function(){
                result = this.responses[this._index];
                this.data.children = result.actions;
                this._super();
                this.state.scene.removeChild(this._container);
            },
            tick: function(){
                if (this.state.input.isPressed('space')){
                    this.end();
                }

                if (this.state.input.isPressed('up')){
                    this.up();
                }

                if (this.state.input.isPressed('down')){
                    this.down();
                }
            },
            down : function(){
                this._index += 1;
                if (this._index>=this.responses.length){
                    this._index=0;
                }
                this.setDialogText(this.data.dialog);
            },
            up: function(){
                this._index -= 1;
                if (this._index<0){
                    this._index=this.responses.length-1;
                }
                this.setDialogText(this.data.dialog);
            },
            setDialogText: function(dialog){
                //this._clearScreen();
                var chunks = dialog.split(' ');
                var count = chunks.length;
                var start = 0;
                var end = 0;
                var actor = new CAAT.TextActor().setFont('24px sans-serif');
                var y = 0;
                var testWidth = this.state.game.renderer.width - 64;
                var dialogContainer = new CAAT.ActorContainer().setSize(360,60);
                while (end<=count){
                    var test = chunks.slice(start, end).join(' ');
                    actor.setText(test);
                    actor.calcTextSize(this.state.game.renderer);
                    if (actor.textWidth > (testWidth)){
                        end--;
                        actor.setLocation(16,y).setText(chunks.slice(start, end).join(' '));
                        dialogContainer.addChild(actor);
                        y+=24;
                        start = end;
                        end = start + 1;
                        actor = new CAAT.TextActor().setFont('24px sans-serif');
                    } else {
                        end++;
                    }
                }
                actor.setLocation(16,y);
                dialogContainer.addChild(actor);
                

                for (var k=0;k<this.responses.length;k++){
                    y+=24
                    actor = new CAAT.TextActor().setFont('24px sans-serif');
                    actor.setText(this.responses[k].dialog);
                    if (k==this._index){
                        actor.setTextFillStyle('orange');
                    }
                    dialogContainer.addChild(actor);
                    actor.setLocation(16,y);
                }

                dialogContainer.setLocation(0,0);
                dialogContainer.cacheAsBitmap();
                this._container.addChild(dialogContainer);
            }
        });
        EventAction.set('question', QuestionAction);

        var NavAction = EventAction.extend({
            init: function(data){
                this._super(data);
                this.async = true; //Always async
                this.cutscene = data.cutscene===undefined ? true : data.cutscene;
            },
            start: function(state){
                this._super(state);
                this.entity = this.gameState.getEntityByName(this.data.entity);
                this.target = this.gameState.getEntityByName(this.data.target);
                if (this.entity.get('ai')){
                    this.entity.set('ai.active', false);
                }
                this.calcPath();
            },
            end: function(){
                if (this._pathActor){
                    this.entity.state.map.canopyDynamic.removeChild(this._pathActor);
                }
                if (this.entity.get('ai')){
                    this.entity.set('ai.active', true);
                }
                var mvt =this.entity.get('movement');
                mvt.set('v', 0, 0);
                this._super();
            },
            calcPath: function(){
                var tx = this.entity.get('xform.tx');
                var ty = this.entity.get('xform.ty');
                var tileX = Math.floor(tx/32);
                var tileY = Math.floor(ty/32);
                var tx2 = this.target.get('xform.tx');
                var ty2 = this.target.get('xform.ty');
                var endTileX = Math.floor(tx2/32);
                var endTileY = Math.floor(ty2/32);
                this.pathPoints = this.gameState.map.getPath(tileX, tileY,endTileX,endTileY);
                if (this._pathActor){
                    this.entity.state.map.canopyDynamic.removeChild(this._pathActor);
                }

                if (this.pathPoints.length>0){
                    this._pathActor = new CAAT.PathActor();
                    this._path = new CAAT.Path();
                    this._path.beginPath(this.pathPoints[0][0], this.pathPoints[0][1]);
                    for (var i=1; i<this.pathPoints.length;i++){
                        this._path.addLineTo(this.pathPoints[i][0], this.pathPoints[i][1], 'red');
                    }
                    this._path.endPath();
                    this._pathActor.setBounds(0,0,800,800).create();
                    this._pathActor.setPath(this._path);
                    this._pathActor.setStrokeStyle('2px solid red')
                    this.entity.state.map.canopyDynamic.addChild(this._pathActor);
                }
                
            },
            tick : function(delta){
                if (this.pathPoints==undefined){
                    this.end();
                    return
                }
                if (this.pathPoints.length<1){
                    this.calcPath();
                    if (this.pathPoints.length<1){
                        var tx = this.entity.get('xform.tx');
                        var ty = this.entity.get('xform.ty');
                        var tileX = Math.floor(tx/32);
                        var tileY = Math.floor(ty/32);
                        var tx2 = this.target.get('xform.tx');
                        var ty2 = this.target.get('xform.ty');
                        var endTileX = Math.floor(tx2/32);
                        var endTileY = Math.floor(ty2/32);
                        this.end();
                        return;
                    }
                }
                var tx = this.entity.get('xform.tx');
                var ty = this.entity.get('xform.ty');
                var goalX = this.pathPoints[0][0];
                var goalY = this.pathPoints[0][1];
                var dx = goalX - tx;
                var dy = goalY - ty;
                var dist = Math.sqrt((dx*dx)+(dy*dy));
                var mvt =this.entity.get('movement');

                if (dist<12){
                    this.calcPath();
                    if (this.pathPoints.length<=0){
                        mvt.set('v', 0, 0);
                        this.end();
                        return;
                    }
                } else {
                    var vx = dx / dist;
                    var vy = dy / dist;
                    mvt.set('v', vx, vy);
                    //mvt.tick(delta);
                    if (this.cutscene){
                        var speed = mvt.get('speed')
                        this.gameState.physics.moveGameObject(this.entity, vx * speed * delta, vy * speed * delta)
                    }
                }
            }
        })
        EventAction.set('nav', NavAction);

        var EventSequence = sge.Class.extend({
        	init: function(state, defaults){
                this.state = state;
        		this._actions = [];
                this._defaults = defaults;
        		this._currentAction = null;
        	},
        	push: function(action){
        		this._actions.push(action);
        	},
        	tick: function(delta){
        		if (this._currentAction==null){
        			if (this._actions.length>0){
                        this._currentAction = this._actions.shift();
                        if (this._currentAction.cutscene){
                        	this.state.game.fsm.startCutscene(this);
                            return;
                        } else {
                        	this._currentAction.start(this.state);
                        }
        			} else {
        		  	   	//this.end();
        				return;
        			}
        		}
                if (!this._currentAction.complete){
                    this._currentAction.tick(delta);
                }
                if (this._currentAction.complete){
                    children = this._currentAction.data.children;
                    if (children){
                        this.insert(children);
                    }
                    this._currentAction = null;
                }    
        	},
            insert: function(actions){
                for (var i = actions.length-1; i>=0; i--) {
                    var ptype = sge.util.deepExtend(sge.util.deepExtend({}, this._defaults), actions[i]);
                    var klass = EventAction.get(ptype.xtype);
                    var action = new klass(ptype);
                    this._actions.splice(0,0,action);
                }
            }
        })

		var EventSystem = sge.Class.extend({
			init: function(state){
				this.state = state;
                this.reset();

			},
            getDialog : function(loc){
                items = this._dialog[loc];
                return sge.random.item(items);
            },
			reset: function(){
				this._events = {};
				this._triggers = {};
				this._cutscenes = {};
				this._quests = {};
                this._sequences = [];
                this._triggers = [];
                this._dialog = {};
			},
            setup: function(){
                this.setup_triggers(this._triggers);
            },
            setup_triggers: function(triggers){
                for (var i = triggers.length - 1; i >= 0; i--) {
                        var triggerData = triggers[i];
                        var name = triggerData.name;
                        var entities = null;
                        if (triggerData.target.match(/^@/)!=null){
                            entities = [this.state.getEntityByName(triggerData.target.replace('@',''))];
                        } else if (triggerData.target.match(/^\./)!=null){
                            var tag = triggerData.target.replace(/^\./,'');
                            entities = this.state.getEntitiesWithTag(tag);
                        } else {
                            if (triggerData.target=='level'){
                                entities = [this.state.level];
                            }
                        }

                        if (entities){
                            entities.forEach(function(entity){
                                
                                if (triggerData.once){
                                    var e = entity;
                                    var triggerName = triggerData.listenFor;
                                    var eventName = triggerData.event;
                                    var f =  function(){
                                        this.run(eventName, {entity: e});
                                        e.removeListener(triggerName, f);
                                    }.bind(this);
                                    entity.addListener(triggerData.listenFor, f);
                                } else {
                                    var e = entity;
                                    var triggerName = triggerData.listenFor;
                                    var eventName = triggerData.event;
                                    var f =  function(){
                                        this.run(eventName, {entity: e});
                                        //e.removeListener(triggerName, f);
                                    }.bind(this);
                                    entity.addListener(triggerData.listenFor, f);
                                }
                                
                                
                                
                            }.bind(this));
                        } else {
                            console.warning('Missing Entity:', triggerData.target);
                        }
                        //this._triggers[name] = triggers[name];
                    }
            },
			load: function(eventData){
				if (eventData.events){
					for (var name in eventData.events){
                        if (name.match(/^@/)){
                            entity = name.split('.')[0];
                            name = name.replace(/^@/,'');
                            evtName = name.replace(/^[a-zA-Z0-9_]*\./,'');
                            if (evtName == 'init'){
                                evtName = 'start';
                                entity = 'level';
                            }
                            var trigger ={
                                target: entity,
                                listenFor: evtName,
                                event: name
                            }
                            eventData.triggers.push(trigger);
                            this._events[name] = eventData.events['@' + name];
                        } else {
                            this._events[name] = eventData.events[name];
                        }
						
					}
				}

                if (eventData.dialog){
                    for (var name in eventData.dialog){
                        this._dialog[name] = eventData.dialog[name];
                    }
                }

				if (eventData.triggers){
					this._triggers = this._triggers.concat(eventData.triggers)
				}

                if (eventData.regions){
                    for (var name in eventData.regions){
                        var regionData =eventData.regions[name];
                        var region = this.state.regions.get(name);
                        if (regionData.spawn){
                            for (var i = regionData.spawn.length - 1; i >= 0; i--) {
                                var spawnData = regionData.spawn[i];
                                region.spawn(spawnData, {});
                            };
                        }
                    }
                }
			},

			run: function(eventName, defaults){
				var prototype = this._events[eventName];
				var seq = new EventSequence(this.state, defaults);
				seq.insert(prototype.actions);
				this._sequences.push(seq);
			},

			tick: function(delta){
        		if (this._sequences.length>0){
        			this._sequences = this._sequences.filter(function(seq){
                        seq.tick(delta);
                        return (seq._actions.length>0 || seq._currentAction!=null);
                    }.bind(this))
        		}
        	},
		})

		return EventSystem;
	}
)