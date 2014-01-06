define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('anim', {
			init: function(entity, data){
				this._super(entity, data);
				this._tracks = data.tracks;
				this._currentTrack = null
				this._index=0;
				this._animTimeout = 0;
			},
			register: function(state){
				this._super(state);
				this.on('anim.set', this.setAnim);
			},
			deregister: function(state){
				this._super(state);
				this.off('anim.set', this.setAnim);
			},
			setAnim: function(anim){
				this._currentTrack = this._tracks[anim];
			},
			tick: function(delta){
				if (this._currentTrack!=null){
					this._animTimeout-=delta;
					if (this._animTimeout<=0){
						this._animTimeout=1/30;
						this._index++;
						if (this._index>=this._currentTrack.frames.length){
							if (this._currentTrack.once){
								this._index=0;
								this._currentTrack = null;
								this.entity.trigger('anim.done');
								return;
							} else {
								this._index = 0;
							}
						}
						this.set('sprite.frame', this._currentTrack.frames[this._index]);
					}
				}
				
			}
		});		
	}
)