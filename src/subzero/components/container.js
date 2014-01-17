define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('container', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			toggle: function(entity){
				this.set('sprite.frame', 1);
				this.state.swapInventory(entity, this.entity);
			}
		});		
	}
)