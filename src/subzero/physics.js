define([
	'sge',
	'./sat'
	], function(sge, sat){
		var Physics = sge.Class.extend({
			init: function(){
				this.entities = [];
				this.map = null;
			},
			tick: function(delta){
				this.entities.forEach(function(entity){
					this.move(entity, delta);
				}.bind(this));
				this.detectCollision();
			},
			_collisionHash: function(a, b){
				if (a.id>b.id){
					return b.id + '.' + a.id;
				} else {
					return a.id + '.' + b.id;
				}
			},
			detectCollision: function(){
				var e, ep, aRect, bRect;
				var response = new sat.Response();
				var testEntities = this.entities.filter(function(q){
					return q.get('physics.type')==0;
				});
				var testHashes = [];
				var collisionHashes = [];
				for (var i = testEntities.length - 1; i >= 0; i--) {
					e = testEntities[i];
					tx = e.get('xform.tx');
					ty = e.get('xform.ty');
					
					aRect = new sat.Box(new sat.Vector(tx, ty), e.get('physics.width'), e.get('physics.height'));
					potential = this.state.findEntities(tx,ty, 32).filter(function(q){return q.components.physics!=null && q!=e});
					for (var k = potential.length - 1; k >= 0; k--) {
						var hash = this._collisionHash(e, potential[k])
						if (testHashes.indexOf(hash)<0){
							testHashes.push(hash);
							ep = potential[k];
							if (ep.get('physics.type')==2){
								continue;
							}
							bRect = new sat.Box(new sat.Vector(ep.get('xform.tx'),ep.get('xform.ty')), ep.get('physics.width'), ep.get('physics.height'));
							collided = sat.testPolygonPolygon(aRect.toPolygon(), bRect.toPolygon(), response)
							if (collided){
								if (ep.get('physics.type')==2||e.get('physics.type')==2){
									
								} if (ep.get('physics.type')==1){
									this.move(e, 0, -response.overlapV.x, -response.overlapV.y);
								} else {
									this.move(e, 0, -0.5*response.overlapV.x, -0.5*response.overlapV.y);
									this.move(ep, 0, 0.5*response.overlapV.x,  0.5*response.overlapV.y);
								}
								
								response.clear();
								// @if DEBUG
								ep.set('physics.color', '0xAA0000');
								// @endif
							}
							
						}
					};
				};
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
			setMap: function(state){
				this.state = state;
				this.map = state.map;
			}
		});

		return Physics;
	}
)