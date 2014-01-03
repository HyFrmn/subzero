define([
		'sge'
	], function(sge){
		var Behaviour = sge.Class.extend({
			init: function(ai, data){
				data = data || {};
				this.comp = ai;
				this.entity = ai.entity;
				this.state = ai.state;
				this.running = false;
				this.importance = data.importance || 3;
			},
			start: function(){
				this.running = true;
			},
			stop: function(){
				this.running = false;
				this.comp.next();
			}
		});

		Behaviour._classMap = {};

		Behaviour.add = function(type, data){
			klass = Behaviour.extend(data);
			Behaviour._classMap[type] = klass;
			return klass;
		}

		Behaviour.Create = function(entity, data){
			if (Behaviour._classMap[data.xtype]==undefined){
				console.error('Missing Behaviour:', data.xtype);
				return null;
			}
			comp = new Behaviour._classMap[data.xtype](entity, data);
			return comp;
		}

		Behaviour.add('idle', {
			start: function(){
				this._timeout = this.state.getTime() + Math.random() + 0.5;
				this.entity.set('movement.vx', Math.random() * 2 - 1);
				this.entity.set('movement.vy', Math.random() * 2 - 1);
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.stop();
				}
			}
		})

		Behaviour.add('goto', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
			},
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 1.35 : 1;
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<64){
					this.stop();
				}
				this.entity.set('movement.vx', -dx/dist * speed);
				this.entity.set('movement.vy', -dy/dist * speed);

			}
		})

		Behaviour.add('goaway', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
				this._timeout = data.timeout || 0;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout = this.state.getTime() + this._timeout;
				}
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 2 : 1;
				if (this._timeout>0 && this._timeout<this.state.getTime()){
					this.stop();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist>1024){
					this.stop();
				}
				this.entity.set('movement.vx', dx/dist * speed);
				this.entity.set('movement.vy', dy/dist * speed);

			}
		})

		Behaviour.add('wait', {
			init: function(comp, data){
				this._super(comp, data);
				this._timeout = data.timeout || -1;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout += this.state.getTime();
				}
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				if (this._timeout>0 && this.state.getTime()>this._timeout){
					this.stop()
				} else {
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return true;
			}
		})

		Behaviour.add('social', {
			start: function(){
				this._timeout = 0;
			},
			isSatisfied: function(){
				var tile = this.entity.get('map.tile');
				if (!tile){
					return true;
				}
				return (tile.data.socialValue>=0.9)
			},
			tick: function(delta){
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<1){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
					}
				}
			}
		});

		Behaviour.add('sell', {
			start: function(){
				this._timeout = 0;
				this._moveTimeout = this.state.getTime() + 5;
				this._selling = false;
				this.entity.on('merchant.sell', this.startSell.bind(this));
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				if (this._selling){
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return (this._selling)
			},
			tick: function(delta){
				if (this.state.getTime()>this._moveTimeout){
					var tx = this.entity.get('xform.tx');
					var ty = this.entity.get('xform.ty');
					var entities = this.state.findEntities(tx, ty, 512);
					var avg = [0,0];
					var count = 0;
					entities.forEach(function(e){
						avg = [avg[0]+e.get('xform.tx'),avg[1]+e.get('xform.ty')];
						count++;
					});
					var targetx = avg[0]/count;
					var targety = avg[0]/count;
					var dx = tx - targetx;
					var dy = ty - targety;
					var dist = Math.sqrt(dx*dx+dy*dy);
					if (dist<64){
						this.stop();
					}
					this.entity.set('movement.vx', -dx/dist);
					this.entity.set('movement.vy', -dy/dist);
					this._moveTimeout += 3
					return
				}
				if (this.state.getTime()>this._timeout){
					this._timeout = this.state.getTime()+1+Math.random();
					this.entity.trigger('sound.emit', {
						type: 0,
						instructions: [{
							xtype: "goto",
							target: this.entity
						},{
							xtype: "event.trigger",
							event: "merchant.sell",
							entity: this.entity
						},{
							xtype: "wait",
							timeout: 2
						}]
					})
				}

			},
			startSell: function(){
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
				this._moveTimeout = this.state.getTime() + 3;
			},
		});
		Behaviour.add('event.trigger', {
			init: function(comp, data){
				this._super(comp, data);
				this._eventName = data.event;
				this._entity = data.entity;
			},
			tick: function(){
				this._entity.trigger(this._eventName);
				this.stop();
			}
		})
		return Behaviour;
	}
)