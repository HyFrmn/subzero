define([
	'sge',
	], 
	function(sge){
		var Tile = Class.extend({
	        init: function(x, y){
	            this.x = x;
	            this.y = y;
	            this.layers = {
	                //'layer0' : { srcX : 14, srcY: 8},
	            };
	            this.actors = {

	            };
	            this.data = {
	            	passable: true
	            };
	            //this.entities = [];
	        },
	        /*
	        getRect : function(){
	            var rect = {
	                left : (this.x*32)-1,
	                right : (this.x*32)+32,
	                top : (this.y*32)-1,
	                bottom : (this.y*32)+32,
	            }
	            return rect;
	        },
	        hide: function(){
	            //this.fade=1
	            if (this.fade!=1){
	                this.fadeDelta = 0.1;
	                this.animate = true;
	            }
	        },
	        show: function(){
	            //this.fade=0;
	            if (this.fade!=0){
	                this.fadeDelta = -0.1;
	                this.animate = true;
	            }
	        },
	        anim: function(){
	            if (this.animate){
	                this.fade = Math.round(100 * Math.max(Math.min(this.fade + this.fadeDelta, 1), 0)) / 100.0;
	                if (this.fade<=0){
	                    if (this.x == 1 && this.y == 1){
	                        console.log('visible', this.fade);
	                    }
	                    this.animate = false;
	                    this.fade = 0;
	                } else if (this.fade>=1){
	                    this.animate = false;
	                    this.fade = 1;
	                }
	            }
	        },
	        update: function(){
	            if (this.fade<1){
	                visible = true;
	            } else {
	                visible = false;
	            }
	            _.each(this.entities, function(e){
	                e.get('xform.container').setVisible(visible)
	            })
	        }
	        */
	    });

		var TileMap = Class.extend({
	        init: function(width, height, options){
	            if (options===undefined){
	                options = {
	                }
	            }
	            this.options = options;
	            this.width = width;
	            this.height = height;
	            this.tileSize = 32;
	            this.container = new CAAT.ActorContainer();
	            this.container.setBounds(0,0,width*32+16,height*32+16);
	            
	            this.baseContainer = new CAAT.ActorContainer();
	            this.baseContainer.setBounds(0,0,width*32+16,height*32+16);

	            this.highlightContainer = new CAAT.ActorContainer();
	            this.highlightContainer.setBounds(0,0,width*32+16,height*32+16);

	            this.objectContainer = new CAAT.ActorContainer();
	            this.objectContainer.setBounds(0,0,width*32+16,height*32+16);

	            this.dynamicContainer = new CAAT.ActorContainer();
	            this.dynamicContainer.setBounds(0,0,width*32+16,height*32+16);

	            this.canopy = new CAAT.ActorContainer();
	            this.canopy.setBounds(0,0,width*32+16,height*32+16);

	            this.canopyDynamic = new CAAT.ActorContainer();
	            this.canopyDynamic.setBounds(0,0,width*32+16,height*32+16);


	            this._tiles = [];
	            this.layers = ['base','layer0','layer1','canopy'];
	            this.layerContainers = {};
	            _.each(this.layers, function(layerName){
	                this.layerContainers[layerName] = new CAAT.ActorContainer().setBounds(0,0,width*32,height*32);;
	                this.container.addChild(this.layerContainers[layerName]);
	            }.bind(this));
	            this.tileset = new Image();
	            this.tileSheet = null;
	            this.defaultSheet = 'default';

	            var total = this.width * this.height;
	            var x = 0;
	            var y = 0;
	            for (var i=0; i<total; i++){
	                var tile = new Tile(x, y);
	                _.each(this.layers, function(layerName){
	                    tile.actors[layerName] = new CAAT.Actor().
	                                                    setLocation(x*this.tileSize,y*this.tileSize).
	                                                    setFillStyle('#FF0000').
	                                                    setSize(30,30);
	                    if (layerName=='base'){
	                        this.baseContainer.addChild(tile.actors[layerName]);
	                    } else if (layerName=='canopy'){
	                        this.canopy.addChild(tile.actors[layerName]);
	                    } else {
	                        this.layerContainers[layerName].addChild(tile.actors[layerName]);
	                    }
	                }.bind(this));
	                this._tiles.push(tile);
	                x++;
	                if (x>=this.width){
	                    x=0;
	                    y++;
	                }
	            }
	        },

	        setup: function(scene){
	            this.scene = scene;
	            //this.render();
	        },
	        makeGraph : function(obstacles){
	            var graph = [];
	            for (x=0;x<this.width;x++){
	                var row = []
	                for (y=0;y<this.height;y++){
	                    row.push(this.getTile(x, y).passable==true ? 1 : 0);
	                }
	                graph.push(row);
	            }
	            if (obstacles){
	                obstacles.forEach(function(obj){
	                    var tileX = Math.floor(obj.get('xform.tx')/32);
	                    var tileY = Math.floor(obj.get('xform.ty')/32);
	                    graph[tileY][tileX]=1;
	                })
	            }
	            return new Graph(graph);
	        },
	        getPath : function(sx, sy, ex, ey, obstacles){
	            /*
	            if (this._graph===undefined){
	                this._graph = this.makeGraph();
	            }
	            */
	            var graph = this.makeGraph(obstacles);
	            result = astar.search(graph.nodes, graph.nodes[sx][sy], graph.nodes[ex][ey], false);
	            var points = _.map(result, function(node){
	                return [node.x * 32 + 16, node.y * 32 + 16];
	            })
	            return points;
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
	            return this._tiles[this.getIndex(x, y)] || null;
	        },
	        getTiles :  function(coords){
	            tiles =  _.map(coords, function(coord){
	                return this.getTile(coord[0],coord[1]);
	            }.bind(this));
	            return tiles;
	        },
	        testTileAttr: function(tx, ty, attr){
	            attr = attr  || 'passable'
	            var tile = this.getTile(tx, ty);
	            var result = true;
	            if (tile){
	                result = tile[attr] != true;
	            }
	            return result;
	        },
	        traceStaticTiles : function(x0, y0, x1, y1, attr){
	           var dx = Math.abs(x1-x0);
	           var dy = Math.abs(y1-y0);
	           var sx = (x0 < x1) ? 1 : -1;
	           var sy = (y0 < y1) ? 1 : -1;
	           var err = dx-dy;

	           while(true){
	             var result = this.testTileAttr(x0,y0, attr);  // Do what you need to for this
	             if (result){
	                return [x0, y0, true];
	             }
	             if ((x0==x1) && (y0==y1)) break;
	             var e2 = 2*err;
	             if (e2 >-dy){ err -= dy; x0  += sx; }
	             if (e2 < dx){ err += dx; y0  += sy; }
	           }
	           return [x1, y1, false];
	        },
	        traceStatic: function(x0, y0, x1, y1, attr){
	            return this.traceStaticTiles(Math.floor(x0/32),Math.floor(y0/32),Math.floor(x1/32),Math.floor(y1/32));
	        },
	        renderTile : function(t){
	            this.layers.forEach(function(layerName){
	                if (t.layers[layerName]){
	                    var frame = t.layers[layerName].srcY * 8 + t.layers[layerName].srcX;
	                    var spriteSheet= t.layers[layerName].spriteSheet || this.defaultSheet;
	                    t.actors[layerName].setBackgroundImage(sge.Renderer.SPRITESHEETS[spriteSheet]).setSpriteIndex(frame);
	                } else {
	                    t.actors[layerName].setVisible(false);
	                }
	            }.bind(this));
	        },
	        renderTiles : function(coords){
	            _.each(coords, function(tile){
	                if (tile.layers===undefined){
	                    tile = this.getTile(tile[0],tile[1]);
	                }
	                this.renderTile(tile);
	            }.bind(this));
	        },
	        render : function(renderer){
	            this.container.stopCacheAsBitmap();
	            this.objectContainer.stopCacheAsBitmap();
	            _.each(this._tiles, function(t){
	                this.renderTile(t);
	            }.bind(this));
	            this.container.cacheAsBitmap(0,CAAT.Foundation.Actor.CACHE_DEEP);
	            this.baseContainer.cacheAsBitmap(0,CAAT.Foundation.Actor.CACHE_DEEP);
	            this.canopy.cacheAsBitmap(0,CAAT.Foundation.Actor.CACHE_DEEP);
	        },
	        loadCallback : function(){
	            if (this.onready){
	                this.onready();
	            }
	        }
	    });
		
		return TileMap;
	}
)