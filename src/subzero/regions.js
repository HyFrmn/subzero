define(['sge'],
	function(sge){
		var Regions = sge.Class.extend({
			init: function(state){
				this.state=state;
				this._regions = {};
				this._hash = [];
				this._entityHash = {}
			},
			get: function(name){
				return this._regions[name];
			},
			set: function(name, region){
				this._regions[name] = region;
			},
			add: function(region){
				this.set(region.name, region);
			},
			setup: function(){
				var width = this.state.map.width;
				var height = this.state.map.height;
				this._hash = []
				for (var y=0;y<height;y++){
					var row = [];	
					for (var x=0;x<width;x++){
						var data = { entities: [], regions: []};
						row.push(data);
					}
					this._hash.push(row);
				}

				for (var name in this._regions){
					var tiles = this._regions[name].getCoords();
					for (var i = tiles.length - 1; i >= 0; i--) {
						var data = this.getTileData(tiles[i][0], tiles[i][1]);
						data.regions.push(name);
					};
				}

				this.state.getEntities().forEach(function(entity){
					this.updateEntity(entity);
				}.bind(this))
				
			},
			getTileData: function(x, y){
				return this._hash[y][x]; //Reversed;
			},
			updateEntity : function(entity, hash){
                var tx = entity.get('xform.tx');
                var ty = entity.get('xform.ty');

                var hx = Math.floor(tx/32);
                var hy = Math.floor(ty/32);

                var last_hash = this._entityHash[entity.id];
                if (!last_hash){
                	this._entityHash[entity.id] = [hx, hy];
                	tileData = this.getTileData(hx, hy);
                	tileData.entities.push(entity.id);
                	this.state.map.getTile(hx,hy).entities = tileData.entities;
                	return;
                }
                if (hx!=last_hash[0] || hy !=last_hash[1]){
                	var tileData = this.getTileData(last_hash[0], last_hash[1]);
                	tileData.entities = _.without(tileData.entities, entity.id);
                	last_regions = tileData.regions;
                	this._entityHash[entity.id] = [hx, hy];
                	
                	tileData = this.getTileData(hx, hy);
                	tileData.entities.push(entity.id);
                    current_regions = tileData.regions;
                	this.state.map.getTile(hx,hy).entities = tileData.entities;

                	new_regions = current_regions.filter(function(region){
                		return last_regions.indexOf(region)<0;
                	});

                	old_regions = last_regions.filter(function(region){
                		return current_regions.indexOf(region)<0;
                	});

                	for (var i = new_regions.length - 1; i >= 0; i--) {
                		entity.fireEvent('region.enter:' + new_regions[i]);
                	};

                	for (var i = old_regions.length - 1; i >= 0; i--) {
                		entity.fireEvent('region.exit:' + old_regions[i]);
                	};
                }
            },
		});
	
		return Regions;
	}
)