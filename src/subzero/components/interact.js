define([
	'sge',
	'../component'
	], function(sge, Component){
		var InteractComponent = Component.add('interact', {
			
		});

		var InteractControlComponent = Component.add('interact.control', {
			init: function(entity, data){
				this._super(entity, data);
				this._current = null;
			},
			tick: function(delta){
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				var targets = this.state.findEntities(tx, ty, 32).filter(function(e){
					return e.components['interact']!=undefined
				});
				targets.sort(function(a,b){return b._findDist-a._findDist});
				if (this._current!=targets[0]){
					this._current=targets[0];
					if (this._current){
						this._current.trigger('focus.gain');
					}
				}
			}
		});
	}
)