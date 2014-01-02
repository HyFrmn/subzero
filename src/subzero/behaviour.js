define([
		'sge'
	], function(sge){
		var Behaviour = sge.Class.extend({
			init: function(entity, data){
				data = data || {};
				this.entity = entity;
				this.state = entity.state;
				this.importance = data.importance;
				this._running = false;
			},
			isSatisfied: function(){
				return false;
			},
			run : function(state){
				this.state = state;
				this._running = true;
				this.start();
			},
			start: function(){

			},
			stop: function(){
				this._running = false;
			}
		});

		Behaviour._classMap = {};

		Behaviour.add = function(type, data){
			klass = Behaviour.extend(data);
			Behaviour._classMap[type] = klass;
			return klass;
		}

		Behaviour.Create = function(type, entity, data){
			if (Behaviour._classMap[type]==undefined){
				console.error('Missing Behaviour:', type);
				return null;
			}
			comp = new Behaviour._classMap[type](entity, data);
			return comp;
		}

		Behaviour.add('idle', {
			start: function(){
				this._timeout = 0;
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this._timeout = this.state.getTime()+1+Math.random();
					this.entity.set('movement.vx', Math.random() * 2 - 1);
					this.entity.set('movement.vy', Math.random() * 2 - 1);
				}
			}
		})

		Behaviour.add('wait', {
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
				return true;
			}
		})

		Behaviour.add('goto', {
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = (dx*dx+dy*dy);
				this.entity.set('movement.vx', dx/dist);
				this.entity.set('movement.vy', dy/dist);
				return true;
			}
		})

		Behaviour.add('wait', {
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
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
				this._selling = false;
			},
			isSatisfied: function(){
				if (this._selling){
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return (this._selling)
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this._timeout = this.state.getTime()+1+Math.random();
					this.entity.trigger('sound.emit', "HOW DO YOU ENCODE A SHIT TON OF DATA HERE.")
					//console.log('emit')
				}

			}
		});

		return Behaviour;
	}
)