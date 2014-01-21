define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('persist', {
			init: function(entity, data){
				this._super(entity, data);
				this._attrs = data.attrs;
				this._global = Boolean(data.global);
			},
			register: function(state){
				this._super(state);
				this.on('persist', this.persist);
			},
			deregister: function(state){
				this._super(state);
				this.off('persist', this.persist);
			},
			persist: function(){
				var mapName = this.state.game.data.map;
				var gameData = this.state.game.data.persist;
				var persistData = {};
				for (var i = this._attrs.length - 1; i >= 0; i--) {
					var attr = this._attrs[i];
					persistData[attr] = this.get(attr);
				}
				if (this._global){
					gameData.entities[this.entity.name] = persistData;
				} else {
					gameData.maps[mapName].entities[this.entity.name] = persistData;
				}
			}
		});		
	}
)