define([
		'sge'
	], function(sge){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };
        
		var TiledLevel = function(state, map, levelData){
			var defered = new sge.When.defer();
			var tileset = new PIXI.ImageLoader('content/tiles/base_tiles.png', false);
			tileset.addEventListener("loaded", function(event){

				var layerData = {};

				levelData.layers.forEach(function(layer){
					layerData[layer.name] = layer;
					if (layer.type=='tilelayer'){
						var layerName = layer.name;
						var xTileCount = levelData.tilesets[0].imagewidth / levelData.tilesets[0].tilewidth;
						var yTileCount = levelData.tilesets[0].imageheight / levelData.tilesets[0].tileheight;
						for (var i = 0; i < (xTileCount * yTileCount); i++) {
							var tex = new PIXI.Texture(tileset.texture.baseTexture, {x: (i % xTileCount) * 32 , y: Math.floor(i / xTileCount) * 32, width:32, height: 32});
							map._tileTextures.push(tex);
						};
						for (var i = layer.data.length - 1; i >= 0; i--) {
							var tileIdx = layer.data[i]-1;
							if (layerName=='terrain'){
								map.tiles[i].data.passable = (tileIdx<0)
							} else {
								if (tileIdx>=0){
									map.tiles[i].layers[layerName] = tileIdx;
								}
							}
						};
					}
				}.bind(this));
				
				var regionLayer = layerData['regions'];
				if (regionLayer){
					for (var i = regionLayer.objects.length - 1; i >= 0; i--) {
						var regionData = regionLayer.objects[i];
						var tx = regionData.x;
						var ty = regionData.y;
						var width = regionData.width;
						var height = regionData.height;

						//Create Region
						
						if (regionData.properties.spawn){
							spawnData = regionData.properties.spawn.split(':');
							var count = parseInt(spawnData[1])
							for (var j=0;j<count;j++){
								var spawnX = tx + (Math.random()*width);
								var spawnY = ty + (Math.random()*height);
								var e= state.factory.create(spawnData[0], {xform: {tx: spawnX, ty: spawnY}});
								state.addEntity(e);
							}
						}



						if (regionData.properties.socialValue){
							socialValue = parseInt(regionData.properties.socialValue);
							var startX = Math.floor(tx/map.tileSize);
							var startY = Math.floor(ty/map.tileSize);
							for (var x=0;x<width/32;x++){
								for (var y=0;y<height/32;y++){
									map.getTile(x, y).data.socialValue = socialValue;
								}
							}

						}
					};
				}

				var entityLayer = layerData['entities']
				if (entityLayer){
					for (var i = entityLayer.objects.length - 1; i >= 0; i--) {
						var entityData = entityLayer.objects[i];
						if (state.factory.has(entityData.type)){
							var eData = {};
							var decorators = []
							var keys = Object.keys(entityData.properties);
							keys.forEach(function(key){
								
								var subpaths = key.split('.');
								var pointer = eData;
								var val = entityData.properties[key];

								while (subpaths.length){
									var sp = subpaths.shift();
									if (pointer[sp]==undefined){
										pointer[sp]={}
									}
									if (subpaths.length==0){
										pointer[sp] = val;
									} else {
										pointer = pointer[sp];
									}
								}
								

							}.bind(this));
							eData = deepExtend(eData, {xform: {tx: entityData.x+16, ty: entityData.y-32+16}}); //-32 for tiled hack.
							
							var spawn = true;
							if (eData.meta!==undefined){
								if (eData.meta.spawn!==undefined){
									spawn = Boolean(eData.meta.spawn);
								}
							}
							var entity = state.factory.create(entityData.type, eData);
							var name = entityData.name;
							if (state._entity_name[name]!=undefined){
								var baseName = name;
								var q = 0;
								while (state._entity_name[name]!=undefined){
									q++;
									name = baseName + q;
								}
								// @if DEBUG
								console.warn('Renamed Entity:', baseName, name);
								// @endif
							}
							entity.name = name;

							if (spawn){
								state.addEntity(entity);	
							} else {
								state._unspawnedEntities[entity.name] = entity;
							}
							state._entity_name[entity.name] = entity;
						} else {
							console.error('Missing:', entityData.type);
						}
					}

				}
				//*/

				defered.resolve();
			})
			tileset.load();

			return defered.promise;
		}
		return TiledLevel
	}
)