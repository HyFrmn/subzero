define([
	'sge',
	'../component'
	], function(sge, Component){
		var InteractComponent = Component.add('interact', {
			init: function(entity, data){
				this._super(entity, data);
				this._targets = data.targets;
				this._proxy = data.proxy;
			},
			register: function(state){
				this._super(state);
				if (this._targets){
					this._proxies = [];
					for (var i = this._targets.length - 1; i >= 0; i--) {
						var target = this._targets[i];
						if (target[0]==0 && target[1]==0){
							continue;
						}
						var proto = {
							xform: {
								tx: this.get('xform.tx') + (target[0]*32),
								ty: this.get('xform.ty') + (target[1]*32),
							},
							interact: {
								proxy: this.entity,
							},
							highlight: {
								radius: 24
							}
						}
						var proxy = state.factory.create('trigger', proto);
						state.addEntity(proxy)
						this._proxies.push(proxy);
					};
				}
				if (this._proxy){
					this.on('interact', this.interact);
				}
			},
			deregister: function(state){
				this._super(state);
				if (this._proxy){
					this.off('interact', this.interact);
				}
			},
			interact: function(entity){
				this._proxy.trigger('interact', entity)
			}
		});

		var InteractControlComponent = Component.add('interact.control', {
			init: function(entity, data){
				this._super(entity, data);
				this._current = null;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(){
				if (this._current){
					this._current.trigger('interact', this.entity);
				}
			},
			tick: function(delta){
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				var targets = this.state.findEntities(tx, ty, 32).filter(function(e){
					return e.components.interact!=undefined && e.components.interact.enabled;
				});
				targets.sort(function(a,b){return b._findDist-a._findDist});
				if (this._current!=targets[0]){
					if (this._current){
						this._current.trigger('highlight.off');
						this._current = null;
					}
					this._current=targets[0];
					if (this._current){
						this._current.trigger('highlight.on');
					}
				}
			}
		});
	}
)