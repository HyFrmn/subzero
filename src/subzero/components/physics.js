define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
				this.type = data.type || 0;
			},
			register: function(state){
				if (this.type==0){
				    state.physics.entities.push(this.entity);   
				}
			}
		});		
	}
)