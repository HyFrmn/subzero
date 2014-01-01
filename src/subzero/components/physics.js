define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
			    state.physics.entities.push(this.entity);   
			}
		});		
	}
)