define([
		'sge',
		'./component',
	], function(sge, Component){
		var Entity = sge.Observable.extend({
			init: function(){
				this._super();
				this.id = null
				this.data = {};
				this._components = {};
				this.tags = [];
				this._tick_funcs = [];
				this._render_funcs = [];
			},
			get: function(attr){
				return this.data[attr]
			},
			set: function(attr, value){
				this.data[attr] = value;
				return value
			},
			tick: function(delta){
				for (var i = this._tick_funcs.length - 1; i >= 0; i--) {
					this._tick_funcs[i](delta);
				};
			},
			render: function(delta){
				for (var i = this._render_funcs.length - 1; i >= 0; i--) {
					this._render_funcs[i]();
				};
			},
			register: function(state){
				var keys = Object.keys(this._components);
				keys.forEach(function(key){
					this._components[key].register(state);
					if (this._components[key].render){
						this._render_funcs.push(this._components[key].render.bind(this._components[key]))
					}
					if (this._components[key].tick){
						this._tick_funcs.push(function(delta){
							if (this._components[key].enabled){
								this._components[key].tick(delta)
							}
						}.bind(this));
					}
				}.bind(this));
			},
			deregister: function(state){
				var keys = Object.keys(this._components);
				keys.forEach(function(key){
					this._components[key].deregister(state);
				}.bind(this));
			}
		})

		Entity.Factory = function(data){
			var entity = new Entity();
			Object.keys(data).forEach(function(comp){
				var compData = data[comp];
				var c = Component.Create(entity, comp, compData);
				if (c){
					entity._components[comp] = c;
					entity[comp] = c;
				}
			});
			return entity;
		}

		return Entity;
	}
)