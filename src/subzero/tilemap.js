define([
		'sge'
	], function(sge){
		var Tile = sge.Class.extend({
			init: function(){
				this.layers = {};
				this.data = {};
			}
		});

		var TileMap = sge.Class.extend({
			init: function(width, height, renderer){
				this.renderer = renderer;
				this.width = width;
				this.height = height;
				this.tileSize = 32;
				this._tileTextures = [];

				this.tiles = [];
				this._chunkSize = 512;
				this.chunk = {};
				this._ready = false;
				this.container = new PIXI.DisplayObjectContainer();
				this.container.position.x=this.container.position.y=0;

				for (var i = (width * height) -1; i >= 0; i--) {
					var tile = new Tile();
					tile.layers.base = {srcX: 0, srcY: 0};
					this.tiles.push(tile);
				};
			},
	        getIndex : function(x, y){
	            var index = (y * this.width) + x;
	            if (x > this.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getTile : function(x, y){
	            return this.tiles[this.getIndex(x, y)] || null;
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
	        getTiles: function(){
	        	return this.tiles.slice(0);
	        },
			render: function(){
				if (!this._ready){
					return
				}
				var startX = -this.container.position.x;
				var startY = -this.container.position.y;
				var endX = startX + this.renderer.width;
				var endY = startY + this.renderer.height;
				var scx = Math.floor(startX/this._chunkSize);
				var sex = Math.ceil(endX/this._chunkSize);
				var scy = Math.floor(startY/this._chunkSize);
				var sey = Math.ceil(endY/this._chunkSize);
				//console.log(scx, scy, sex, sey, (sex-scy)*(sey-scy))
				for (var x=0; x<(this.width*32)/this._chunkSize; x++){
					for (var y=0; y<((this.height*32)/this._chunkSize); y++){
						if ((x>=scx) && (x<= sex) &&  y>= scy && y<=sey){
							if (this.container.children.indexOf(this.chunk[x+'.'+y])<0){
								this.container.addChild(this.chunk[x+'.'+y])
							}
						//console.log('vis', x, y)
						} else {
							if (this.container.children.indexOf(this.chunk[x+'.'+y])>=0){
								this.container.removeChild(this.chunk[x+'.'+y])
							}
						}
					}
				}
			},
			preRender : function(){
				var pixelWidth = this.width * this.tileSize;
				var pixelHeight = this.height * this.tileSize;
				var chunks = [Math.ceil(pixelWidth/this._chunkSize),Math.ceil(pixelWidth/this._chunkSize)];
				
				for (var x=0; x<chunks[0]; x++){
					for (var y=0; y<chunks[1]; y++){
						this.preRenderChunk(x, y);
					}
				}
				this._ready = true;
				this.render();
			},
			preRenderChunk: function(cx, cy){
				var startX = cx * this._chunkSize;
				var startY = cy * this._chunkSize;
				var endX = Math.min((cx + 1) * (this._chunkSize), this.width * this.tileSize);
				var endY = Math.min((cy + 1) * (this._chunkSize), this.height * this.tileSize);

				var chunkStartX = Math.floor(startX / this.tileSize);
				var chunkStartY = Math.floor(startY / this.tileSize);

				var chunkEndX = Math.ceil(endX / this.tileSize);
				var chunkEndY = Math.ceil(endY / this.tileSize);

				var chunk = new PIXI.DisplayObjectContainer();

				for (var x=chunkStartX; x<chunkEndX; x++){
					for (var y=chunkStartY; y<chunkEndY; y++){
						var tile = this.getTile(x, y);
						if (tile){
							for (var idx in ['base', 'layer0']){
								var name = ['base', 'layer0'][idx];
								if (tile.layers[name]!==undefined){
									var sprite = new PIXI.Sprite(this._tileTextures[tile.layers[name]]);
									sprite.position.x = (x*this.tileSize) - startX;
									sprite.position.y = (y*this.tileSize) - startY;
									chunk.addChild(sprite);
								}
							}
						}
					}
				}

				// render the tilemap to a render texture
				var texture = new PIXI.RenderTexture(endX-startX, endY-startY);
				texture.render(chunk);

				// create a single background sprite with the texture
				var background = new PIXI.Sprite(texture, {x: 0, y: 0, width: this._chunkSize, heigh:this._chunkSize});
				background.position.x = cx * this._chunkSize;
				background.position.y = cy * this._chunkSize;
				this.chunk[cx+'.'+cy] = background;
			}

		});

		return TileMap;
	}
)