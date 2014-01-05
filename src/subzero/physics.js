define([
	'sge'
	], function(sge){
		var Physics = sge.Class.extend({
			init: function(){
				this.entities = [];
				this.map = null;
			},
			tick: function(delta){
				this.entities.forEach(function(entity){
					this.move(entity, delta);
				}.bind(this))
			},
			move: function(entity, delta, vx, vy){

				if (vx==undefined){
					vx = entity.get('movement.vx') * delta * 64;
					vy = entity.get('movement.vy') * delta * 64;
				}

				var tx = entity.get('xform.tx');
				var ty = entity.get('xform.ty');

				var ptx = tx + vx;
				var pty = ty + vy;

				if (this.map){
					var newTile = this.map.getTileAtPos(ptx, pty);
					if (newTile){
					    if (!newTile.data.passable){
						    horzTile = this.map.getTileAtPos(ptx, ty);
							if (horzTile){
							    if (!horzTile.data.passable){
								    ptx = tx;
							    }
							}
						    vertTile = this.map.getTileAtPos(tx, pty);
							if (vertTile){
							    if (!vertTile.data.passable){
								    pty = ty;
							    }
							}
					    }
					}
					
				}
				if (tx!=ptx||ty!=pty){
					entity.trigger('entity.moved', entity, ptx, pty, ptx-tx, pty-ty);
					entity.set('xform.tx', ptx);
					entity.set('xform.ty', pty);
				}
			},
			setMap: function(map){
				this.map = map;
			}
		});

		return Physics;
	}
)