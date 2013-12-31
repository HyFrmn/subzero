define([
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('controls', {
			init: function(entity, data){
				this._super(entity, data);
				

			},
			tick: function(){
				var dpad = this.input.dpad();
				this.set('movement.vx', dpad[0]);
				this.set('movement.vy', dpad[1]);
			},
			register: function(state){
				this._super(state);
				this.input = state.input.createProxy();
			}
		});
	}
)