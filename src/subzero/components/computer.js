define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('computer', {
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
			toggle: function(){
				this.entity.trigger('anim.set', 'on');
				this.on('anim.done', function(){
					this.state.startCutscene();
					cutsceneState = this.state.game.getState('cutscene');
					cutsceneState.setDialog('Computer: 00101100110100110101001');
					this.entity.trigger('anim.set', 'off');
				}.bind(this), { once: true })
			}
		});		
	}
)