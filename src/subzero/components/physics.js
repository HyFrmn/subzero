define(['sge'], function(sge){
	var PhysicsComponent = sge.Component.extend({
		init: function(entity, data){
			this._super(entity, data);
			this.data.width = data.width || 24;
			this.data.height = data.height || 24;
			this.data.offsetX = data.offsetX || 0;
			this.data.offsetY = data.offsetY || 0;
			this.data.type = data.type || 0;
			this.data.fast = data.fast || false;
			this._wait = true; //Don't move on first frame after being spawned.
		},
		register: function(state){
			this._super(state);
			state.physics.addEntity(this.entity);
		},
		deregister: function(state){
			state.physics.removeEntity(this.entity);
			this._super(state);
		}
	})
	sge.Component.register('physics', PhysicsComponent);
    return PhysicsComponent;
})
