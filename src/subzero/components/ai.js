define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    //this.set('movement.vx', Math.random() * 2 - 1);
			    //this.set('movement.vy', Math.random() * 2 - 1);
			    this._timeout = 0;
			},
			tick: function(){
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				var tile = this.state.map.getTileAtPos(tx, ty);
				if (tile){
					if (tile.data.socialValue<0.9){
						var vec = tile.data.socialVector;
						//console.log(vec)
					    if (vec[0]!=0||vec[1]!=0){
					    	this.set('movement.vx', vec[0]);
						    this.set('movement.vy', vec[1]);
					    }
					}
				}
			}
		});		
	}
)