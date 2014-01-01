define([
		'sge',
		'./component',
	], function(sge, Component){
		var Entity = sge.Observable.extend({
			init: function(){
				this._super();
				this.id = null
				this.data = {};
				this.components = {};
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
			tick: function(){
			for (var i = this._tick_funcs.length - 1; i >= 0; i--) {
					this._tick_funcs[i]();
				};
			},
			render: function(delta){
				for (var i = this._render_funcs.length - 1; i >= 0; i--) {
					this._render_funcs[i]();
				};
			},
			register: function(state){
				var keys = Object.keys(this.components);
				keys.forEach(function(key){
					this.components[key].register(state);
					if (this.components[key].render){
						this._render_funcs.push(this.components[key].render.bind(this.components[key]))
					}
					if (this.components[key].tick){
						this._tick_funcs.push(this.components[key].tick.bind(this.components[key]))
					}
				}.bind(this));
			}
		})

		Entity.Factory = function(data){
			var entity = new Entity();
			Object.keys(data).forEach(function(comp){
				var compData = data[comp];
				var c = Component.Create(entity, comp, compData);
				if (c){
					entity.components[comp] = c;
				}
			});
			return entity;
		}

		return Entity;
	}
)