define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('switch', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('switch.on', data.on || false);
				this.set('switch.entity', data.entity);
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
				this.set('switch.on', !this.get('switch.on'));
				this.update();
				var entityName = this.get('switch.entity');
				if (entityName){
					var entity = this.state.getEntity(entityName);
					if (entity){
						entity.trigger('interact');
					}
				}
			},
			update: function(){
				this.set('sprite.frame', this.get('switch.on') ? 1 : 0);
			}
		});		
	}
)