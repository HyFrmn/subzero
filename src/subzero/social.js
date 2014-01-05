define([
	'sge',
	], function(sge){
		var SocialSystem = sge.Class.extend({
			init: function(){
				this._socialMap = [];
			},
			setMap : function(map){
				this.map = map;
				this.map.getTiles().forEach(function(t){
						return t.data.socialValue = t.layers.base==16 ? 1 : 0;
				});
				for (var i = this.map.width - 1; i >= 0; i--) {
					this.map.getTile(i,0).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, -1];
					this.map.getTile(i,this.map.height-1).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, 1];
				};
				for (var i=0; i<2;i++){
					this.diffuseMap();
				}
				this.calcGradient();
			},
			diffuseMap: function(){
				var origMap = this.map.getTiles().map(function(x){return x.data.socialValue});
				for (var x = 0; x<this.map.width; x++){
					for (var y=0; y<this.map.height; y++){

						var value = 0;
						var count = 0;

						for (var j=-1;j<2;j++){
							for(var k=-1;k<2;k++){
								var amt = this.getData(x+j,y+k, origMap);
								if (amt!=undefined){
									value += amt;
									count++;
								}
							}
						}
						this.map.getTile(x, y).data.socialValue = Math.max((value/count),this.getData(x,y, origMap));
					}
				}
			},
			calcGradient : function(){
				for (var x = 1; x<this.map.width-1; x++){

					for (var y=1; y<this.map.height-1; y++){
						
						var ax = x-1;
						var bx = x+1;

						var amtAx = this.map.getTile(ax,y).data.socialValue;
						var amtBx = this.map.getTile(bx,y).data.socialValue;
						
						var dx = (amtBx - amtAx) / 2;

						var ay = y-1;
						var by = y+1;

						var amtAy = this.map.getTile(x,ay).data.socialValue;
						var amtBy = this.map.getTile(x,by).data.socialValue;
						
						var dy = (amtBy - amtAy) / 2;

						var dist = Math.sqrt((dx*dx)+(dy*dy));
						if (dist==0){
							this.map.getTile(x,y).data.socialVector=[0,0];
						} else {
							this.map.getTile(x,y).data.socialVector=[dx/dist,dy/dist];
						}
					}
				}
			},
			getIndex : function(x, y){
	            var index = (y * this.map.width) + x;
	            if (x > this.map.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.map.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getData : function(x, y, arr){
	            return arr[this.getIndex(x, y)];
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
		})

		return SocialSystem;
	}
)