define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('xform', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('xform.tx', data.tx || 0);
				this.set('xform.ty', data.ty || 0);
			}
		});		
	}
)