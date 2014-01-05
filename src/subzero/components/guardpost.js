define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('guardpost', {
			init: function(entity, data){
				this._super(entity, data);
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.active = null;
				this._alarm = false;
				this._timeout  = 0;
			},
			update: function(active){
				this.active = active;
				this.indicater.clear();
				if (this._alarm){
					var radius = 16 + (8 * Math.sin(this.state.getTime()*4))
					this.indicater.beginFill('0xFF0000');
					this.indicater.drawCircle(0,0,radius);
				} else  if (active){
					this.indicater.beginFill('0x00FF00');
					this.indicater.drawCircle(0,0,24);
				} else {
					this.indicater.beginFill('0xFFFF00');
					this.indicater.drawCircle(0,0,24);
				}
			},
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														64);
				var guards = nearby.filter(function(e){return e.tags.indexOf('guard')>=0});
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0 && this.active){
					if (!this._alarm){
						this.alarm();
					}
					if (this._timeout<this.state.getTime()){
						this.state.loseGame();
					}
				} else {
					this._alarm = false;
				}
				this.update(guards.length>0);
			},
			register: function(state){
				this._super(state);
				this.state.containers.underfoot.addChild(this.indicater)
			},
			render: function(){
				this.indicater.position.x = this.get('xform.tx');
				this.indicater.position.y = this.get('xform.ty');
			},
			alarm: function(){
				this._alarm = true;
				this.entity.trigger('sound.emit', {
					type: 1,
					volume: 96,
					importance: 9
				});
				this._timeout = this.state.getTime() + 1.5;
			}
		});		
	}
)