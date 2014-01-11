define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('item', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('item.item', data.item);
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(e){
				if (e.components.inventory){
					e.components.inventory.addItem(this.get('item.item'));
				}
				this.state.removeEntity(this.entity);
			},
			tick: function(delta){

			}
		});		
	}
)