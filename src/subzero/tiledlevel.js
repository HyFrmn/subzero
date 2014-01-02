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

				var entityLayer = layerData['entities']
				if (entityLayer){
					for (var i = entityLayer.objects.length - 1; i >= 0; i--) {
						var entityData = entityLayer.objects[i];
						if (entityData.name=='pc'){
							this._entityMap[entityData.name] = {xform:{tx: entityData.x+16, ty: entityData.y+16-32}}; //-32 For tiled hack.
							continue;
						}

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
							entity.name = entityData.name;

							if (spawn){
								state.addEntity(entity);	
							} else {
								this._unspawnedEntities[entity.name] = entity;
							}
						} else {
							console.log('Missing:', entityData.type);
						}
					}

				}


				defered.resolve();
			})
			tileset.load();

			return defered.promise;
		}
		return TiledLevel
	}
)