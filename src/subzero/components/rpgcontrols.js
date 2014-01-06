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

				if (this.input.isDown('X')){
					this.set('movement.vx', dpad[0]*2);
					this.set('movement.vy', dpad[1]*2);
				}

				if (this.input.isDown('Z')){
					this.state.openInventory();
				}

				if (this.input.isPressed('enter')){
					this.entity.trigger('interact')
					console.log('interact')
				}
				
				if (this.input.isPressed('space')){
					var bomb = this.state.factory.create('bomb', {
						xform: {
							tx: this.get('xform.tx'),
							ty: this.get('xform.ty')
						}
					})
					this.state.addEntity(bomb);
					this.entity.trigger('emote.msg', 'Boom!')
				}
			},
			register: function(state){
				this._super(state);
				this.input = state.input;
			}
		});
	}
)