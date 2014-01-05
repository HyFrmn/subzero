define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('door', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				var map = state.map;
				var tile = map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty'));
				tile.data.passable = true;
				var tile = map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-32);
				tile.data.passable = true;
				var tile = map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-64);
				tile.data.passable = true;
			}
		});		
	}
)