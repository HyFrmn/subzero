define([
	'sge',
	'../component',
	'../behaviour',
	'../ai'
	], function(sge, Component, Behaviour, AI){
		var proxyTarget = function(tx, ty){
			this.data = {
				'xform.tx': tx,
				'xform.ty': ty
			}
			this.get = function(attr){
				return this.data[attr];
			}
		}

		var Planner = sge.Observable.extend({
			init: function(comp){
				this.comp = comp;
				this.entity = comp.entity;
				this.state = comp.state;
				this._interupt = false;
				this._instructions=[];
				this._ignoreList=[];
			},
			interupt: function(){
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				return {xtype: 'idle'}
			}
		});

		var CitizenPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._instructions = [];
				this._ignoreList = [];
				this._interupt=false;
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==0){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = sound.instructions;
						this._interupt=true;
					}
				}
				if (sound.type==1){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = [{xtype: 'goaway', target: new proxyTarget(tx, ty), timeout: 3, importance: 8}];
						this._interupt=true;
					}
				}
			},
			interupt: function(){
				if (this._super()){
					return true;
				}
				if (this.comp.behaviour.importance>6){
					return false;
				}
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<0.8){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
						return true;
					}
				}
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				if (this._instructions.length){
					return this._instructions.shift();
				}
				return {xtype: 'idle'}
			}
		});

		var MerchantPlanner = Planner.extend({
			interupt: function(){
				
					var tile = this.entity.get('map.tile');
					if (tile){
						if (tile.data.socialValue<0.8){
							this.entity.set('movement.vx', tile.data.socialVector[0]);
							this.entity.set('movement.vy', tile.data.socialVector[1]);
							return true;
						}
					}
				
				return false;
			},
			next: function(){
				return {xtype: 'sell'}
			}
		});

		var GuardPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._home = new proxyTarget(this.entity.get('xform.tx'),this.entity.get('xform.ty'))
				
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==1){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = [{xtype: 'goto', target: new proxyTarget(tx, ty)},{xtype:'wait', timeout:5}]
						this._interupt=true;
						this.entity.trigger('emote.msg', 'What the hell?')
					}
				}
			},
			next: function(){
				if (this._instructions.length>0){
					return this._instructions.shift();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this._home.get('xform.tx');
				var targety = this._home.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<16){
					this.entity.set('chara.dir', 'down')
					return {xtype: 'wait'}
				}
				return {xtype: 'goto', target: this._home};
			}
		});

		PLANNER = {
			'citizen' : CitizenPlanner,
			'merchant' : MerchantPlanner,
			'guard' : GuardPlanner
		}

		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    this.set('ai.planner', data.planner || 'citizen');
			    this._timeout = 0;
			    this.behaviour = null;

			},
			register: function(state){
				this._super(state);
				this.planner = new PLANNER[this.get('ai.planner')](this)
				this.next();
			},
			next : function(){
				this.changeBehaviour(this.planner.next());
			},
			changeBehaviour: function(data){
				if (this.behaviour && this.behaviour.running){
					this.behaviour.stop();
				}
				this.behaviour = Behaviour.Create(this, data);
				this.behaviour.start()
			},
			tick: function(delta){
				//Check planning for interupt.
				if (this.planner.interupt()){
					return;
				}
				
				//Tick current behaviour.
				this.behaviour.tick(delta);
			}
		});		
	}
)