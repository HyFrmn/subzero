define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    this.set('movement.vx', Math.random() * 2 - 1);
			    this.set('movement.vy', Math.random() * 2 - 1);
			    this._timeout = 0;
			},
			tick: function(){
			    if (this.state.getTime()>this._timeout){
			        this._timeout = this.state.getTime() + 1 + Math.random();
			        this.set('movement.vx', Math.random() * 2 - 1);
			        this.set('movement.vy', Math.random() * 2 - 1);
			    }
			}
		});		
	}
)