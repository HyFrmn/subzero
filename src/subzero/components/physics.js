define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
				this.type = data.type || 0;
				this.set('physics.width', data.width || 24);
				this.set('physics.height', data.height || 24);
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.indicater.beginFill('0xAA0000');
				this.indicater.drawRect(0, 0, this.get('physics.width'), this.get('physics.height'));
				this.indicater.endFill();
			},
			register: function(state){
				this._super(state);
				if (this.type==0){
				    state.physics.entities.push(this.entity);   
				}
				//this.state.containers.underfoot.addChild(this.indicater);
			},
			deregister: function(state){
				//this.state.containers.underfoot.removeChild(this.indicater);
			},
			render: function(){
				this.indicater.position.x = this.get('xform.tx')-12;
				this.indicater.position.y = this.get('xform.ty')-8;
			
			}
		});		
	}
)