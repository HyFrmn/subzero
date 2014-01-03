define([
		'sge',
		'../component'
	], function(sge, Component){
		Component.add('explosion', {
			register: function(state){
				this._super(state);
				this._frame= 0;
				this._anim = 0
			},
			tick: function(delta){
				if (this._anim<=0){
					this._anim = (1/30);
					this.set('sprite.frame', this._frame++);
					if (this._frame>=16){
						this.state.removeEntity(this.entity);
					}
				} else {
					this._anim -= delta;
				}
			}
		})

		Component.add('bomb', {
			register: function(state){
				this._super(state);
				this._timeout = state.getTime() + 3;
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.entity.trigger('sound.emit', {
						type: 1,
						volume: 1024,
						importance: 6
					})
					
					for (var i = 0; i < 3; i++) {
						var scale = (Math.random()*2-1)*0.5 + 1;
						var explo = this.state.factory.create('explosion', {
							xform: {
								tx: this.get('xform.tx') + (Math.random()*2-1)*32,
								ty: this.get('xform.ty') + (Math.random()*2-1)*32
							},
							sprite: {
								scalex: scale,
								scaley: scale
							}
						})
						this.state.addEntity(explo);
					}
					this.state.removeEntity(this.entity);
				}
			}
		})
	}
)