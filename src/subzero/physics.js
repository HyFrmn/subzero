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
					var testPoints = [
							[entity.get('physics.width')/2, entity.get('physics.height')/2],
							[entity.get('physics.width')/2, -entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, -entity.get('physics.height')/2]
						]
						var horzMove = true;
						var vertMove = true;
						for (var i = testPoints.length - 1; i >= 0; i--) {
							testPoints[i];
							var newTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+vy+ty);
							if (newTile){
							    if (!newTile.data.passable){
									if (horzMove){
									    horzTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+ty);
										if (horzTile){
										    if (!horzTile.data.passable){
											    horzMove=false;
										    }
										}
									}
									if (vertMove){
									    vertTile = this.map.getTileAtPos(testPoints[i][0]+tx, testPoints[i][1]+vy+ty);
										if (vertTile){
										    if (!vertTile.data.passable){
											    vertMove=false;
										    }
										}
									}
							    }
							}
							if (!horzMove){
								ptx=tx;
							}
							if (!vertMove){
								pty=ty;
							}
						};
						
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