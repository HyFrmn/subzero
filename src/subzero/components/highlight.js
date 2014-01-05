define([
	'sge',
	'../component'
	], function(sge, Component){

		var HighlightComponent = Component.add('highlight', {
			init: function(entity, data){
				this._super(entity, data);
				this._radius = data.radius || 16;
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.indicater.beginFill('0x00FFF0');
				this.indicater.drawCircle(0,0, this._radius);
				this.indicater.endFill();
				this._active = false;
			},
			register: function(state){
				this._super(state);
				this.on('highlight.on', this.turnOn);
				this.on('highlight.off', this.turnOff);
			},
			deregister: function(state){
				this._super(state);
				this.off('highlight.on', this.turnOn);
				this.off('highlight.off', this.turnOff);
			},
			turnOn: function(){
				this._active = true;
				this.state.containers.underfoot.addChild(this.indicater);
			},
			turnOff: function(){
				this._active = false;
				this.state.containers.underfoot.removeChild(this.indicater);
			},
			render: function(){
				if (this._active){
					this.indicater.position.x = this.get('xform.tx');
					this.indicater.position.y = this.get('xform.ty');
				}
			}
		});
	}
)