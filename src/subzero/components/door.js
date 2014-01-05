define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('door', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.map = state.map;
				this.update();
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			update: function(){
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty'));
				tile.data.passable = this._open;
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-32);
				tile.data.passable = this._open;
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-64);
				tile.data.passable = this._open;
			},
			toggle: function(){
				if (this._open){
					this._open = false;
					this.entity.trigger('sprite.show');
				} else {
					this._open = true;
					this.entity.trigger('sprite.hide');
				}
				this.update();
			}
		});		
	}
)