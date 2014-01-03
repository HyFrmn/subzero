define([
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./physics',
		'./factory',
		'./social',
		'./ai'
	], function(sge, TileMap, TiledLevel, Entity, Physics, Factory, Social, AI){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];
				this._entity_name = {};

				this._entity_spatial_hash = {}
				this._unspawnedEntities={}


				this.stage = new PIXI.Stage(0x66FF99);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 1;
				//if (navigator.isCocoonJS){
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				//}
				this.container.scale.x *= this._scale;
				this.container.scale.y *= this._scale
				this.containers={};
				this.containers.entities = new PIXI.DisplayObjectContainer();
				this.containers.map = new PIXI.DisplayObjectContainer();
				this.containers.overhead = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				
				this.physics = new Physics();
				this.factory = Factory;
				this.social = new Social();
				var loader = new sge.Loader();
				loader.loadJSON('content/manifest.json').then(this.loadManifest.bind(this));
			},
			loadManifest: function(manifest){
				console.log('Loaded Manifest')
				var loader = new sge.Loader();
				var promises = [];
				if (manifest.sprites){
					manifest.sprites.forEach(function(data){
						promises.push(loader.loadSpriteFrames('content/sprites/' + data[0] +'.png',data[0], data[1][0],data[1][1]));
					})
				}
				if (manifest.fonts){
					manifest.fonts.forEach(function(data){
						promises.push(loader.loadFont('content/font/' + data + '.fnt'));
					}.bind(this))
				}
				if (manifest.images){
					manifest.images.forEach(function(data){
						promises.push(loader.loadTexture('content/' + data + '.png', data));
					}.bind(this))
				}
				if (manifest.entities){
					manifest.entities.forEach(function(data){
						promises.push(loader.loadJSON('content/entities/' + data +'.json').then(Factory.load.bind(Factory)));
					}.bind(this))
				}
				if (manifest.ai){
					manifest.ai.forEach(function(data){
						promises.push(loader.loadJSON('content/ai/' + data +'.json').then(AI.load.bind(AI)));
					}.bind(this))
				}

				sge.When.all(promises).then(function(){
					console.log('Loaded Assets');
					loader.loadJSON('content/levels/' + this.game.data.map + '.json').then(function(data){
						this.loadLevel(data);
					}.bind(this))
				}.bind(this));
			},
			loadLevel : function(levelData){
				this.background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
				//var blurFilter = new PIXI.BlurFilter();
				//this.background.filters = [blurFilter]
				this.stage.addChild(this.background);
				this.stage.addChild(this.container);
				var text = new PIXI.BitmapText('Subzero', {font:'64px 8bit'});
				this.stage.addChild(text);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){

					this.social.setMap(this.map);
					this.map.preRender();
					console.log('Created Level')

					this.physics.setMap(this.map);
					this.initGame();
				}.bind(this), 500)
			},
			initGame: function(){

				var pc = this.getEntity('pc');
				this.pc = pc;

				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.entities);
				this.containers.map.addChild(this.containers.overhead);
				this.containers.map.position.x = this.game.width/(2*this._scale)-(this.map.width*this.map.tileSize*0.5);
				this.containers.map.position.y = this.game.height/(2*this._scale)-(this.map.height*this.map.tileSize*0.5);
				this.game.changeState('game');

			},
			tick: function(delta){
			    this._super(delta);
				
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.tick(delta);
				};
				this.physics.tick(delta);

				if (this.pc){
					this.containers.map.position.x = -this.pc.get('xform.tx')+this.game.width/(2*this._scale);
					this.containers.map.position.y = 32-this.pc.get('xform.ty')+this.game.height/(2*this._scale);
				}
				
				this.background.position.x = (this.containers.map.position.x/10) - 128;
				this.background.position.y = (this.containers.map.position.y/10) - 128;
				
			},

			spriteSort: function(parent) {
				var sortMe = parent.children;
			    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
			      tmp = sortMe[i];
			      for (j = i - 1; j >= 0 && sortMe[j].position.y > tmp.position.y; --j)
			         parent.swapChildren(sortMe[j + 1], sortMe[j]);

			      sortMe[j + 1] = tmp;
			   }
			},

			render: function(){
				this.map.render();
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
				this.spriteSort(this.containers.entities)
				this.game.renderer.render(this.stage);
			},


			addEntity : function(e){
				var id = 0;
				while (this._entities[id]!==undefined){
					id++;
				}
				e.id = id;
				this._entity_ids.push(e.id);
				this._entities[e.id] = e;
				e.register(this);

				tx = e.get('xform.tx');
				ty = e.get('xform.ty');
				e.on('entity.moved', this._updateHash.bind(this));
				this._updateHash(e, tx, ty);
				return e;
			},
			removeEntity: function(e){
				e.deregister(this);
				var id = e.id;
				var idx = this._entity_ids.indexOf(e.id);
				this._entity_ids.splice(idx,1);
				tile = e.get('map.tile');
				if (tile){
					idx = tile.data.entities.indexOf(e);
					tile.data.entities.splice(idx, 1);
				}
				delete this._entities[id];
			},
			_updateHash: function(e, tx, ty){
				if (!e){
					return;
				}
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var hash = e.get('map.hash');
				var tile = null;
				
				if (hash != hx + '.' + hy){
					
					tile = e.get('map.tile');
					if (tile){
						idx = tile.data.entities.indexOf(e);
						tile.data.entities.splice(idx, 1);
					}
					e.set('map.hash', hx + '.' + hy)
					tile = this.map.getTile(hx, hy);
					if (tile){
						e.set('map.tile', tile);
						if (tile.data.entities==undefined){
							tile.data.entities=[];
						}
						tile.data.entities.push(e);
					}	
				}
			},
			findEntities: function(tx, ty, radius){
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var tileRad = Math.ceil(radius/32);
				var tile = null
				var entities = []
				for (var j=hx-tileRad;j<tileRad+1+hx;j++){
					for(var k=hy-tileRad;k<tileRad+1+hy;k++){
						tile = this.map.getTile(j,k);
						if (tile){
							var es = tile.data.entities;
							if (es){
								entities = entities.concat(es);
							}
						}
					}
				}
				return entities;
			},
			getEntity: function(name){
				return this._entity_name[name];
			},
			getEntities: function(query){

			}
		})

		return SubzeroState
	}
)