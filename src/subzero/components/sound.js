define([
	'sge',
	'../component'
	], function(sge, Component){
		var extend = function(destination, source)
        {
            for (var property in source)
            {
                if (destination[property] && (typeof(destination[property]) == 'object')
                        && (destination[property].toString() == '[object Object]') && source[property])
                    extend(destination[property], source[property]);
                else
                    destination[property] = source[property];
            }
            return destination;
        }

		Component.add('sound', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this.on('sound.emit', this.emit);
			},
			emit: function(sound){
				sound = extend({
					importance: 3,
					entity: this.entity
				}, sound)
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				sound.entity = this.entity;
				var found = this.state.findEntities(
						tx, 
						ty,
						sound.volume || 128
					)
				for (var i = found.length - 1; i >= 0; i--) {
					found[i].trigger('sound.hear', tx, ty, sound)
				};
			}
		});		
	}
)