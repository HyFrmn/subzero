define([
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./physics',
		'./factory',
		'./social',
		'./ai',
		'./hud'
	], function(sge, TileMap, TiledLevel, Entity, Physics, Factory, Social, AI, HUD){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];
				this._entity_name = {};

				this._entity_spatial_hash = {}
				this._unspawnedEntities={}


				this.stage = new PIXI.Stage(0x000000);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 2;
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
				this.containers.underfoot = new PIXI.DisplayObjectContainer();
				this.containers.glow = new PIXI.DisplayObjectContainer();
				this.containers.hud = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				this.container.addChild(this.containers.hud);
				
				this.physics = new Physics();
				this.factory = Factory;
				this.social = new Social();
				this.hud = new HUD(this);
				var loader = new sge.Loader();
				loader.loadJSON('content/manifest.json').then(this.loadManifest.bind(this));
			},
			winGame: function(){
				this.game.changeState('win');
			},
			openInventory: function(){
				this.game.getState('inventory').createMenu(this.getEntity('pc'));
				this.game.changeState('inventory');
			},
			swapInventory: function(a, b){
				this.game.getState('swap').createMenu(a, b);
				this.game.changeState('swap');
			},
			loseGame: function(){
				this.game.changeState('lose');
			},
			startCutscene: function(){
				this.game.changeState('cutscene');
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
						this.loadLevelData(data);
					}.bind(this))
				}.bind(this));
			},
			loadLevelData : function(levelData){
				this.background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
				this.stage.addChild(this.background);
				this.stage.addChild(this.container);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){
					this.social.setMap(this.map);
					this.map.preRender();
					this.physics.setMap(this);
					var loader = new sge.Loader();
					loader.loadJS('content/levels/' + this.game.data.map + '.js', null, {state : this}).then(this.loadLevelEvents.bind(this), this.initGame.bind(this));
				}.bind(this), 500);
			},
			loadLevelEvents: function(sandbox){
				sandbox();
				this.initGame();
			},
			changeLevel: function(map, location){
				console.log('Change Level', map)
				this.game.changeState('load');
				this.game.data.map = map;
				this.game.data.spawn = location;
				this.game.createState('game');
			},
			initGame: function(){

				var pc = this.getEntity('pc');
				this.pc = pc;
				if (this.pc){
					this.hud.setPC(pc);
					if (this.game.data.spawn){
						var spawnEntity = this.getEntity(this.game.data.spawn);
						this.pc.set('xform.tx', spawnEntity.get('xform.tx'));
						this.pc.set('xform.ty', spawnEntity.get('xform.ty'));
					}
				}

				this.containers.underfoot.mask = this.map.maskBase;
				this.containers.map.addChild(this.map.maskBase);

				var mask = new PIXI.Graphics();
				mask.beginFill()
				mask.drawRect(32, 32, 800, 480+64);
				mask.endFill();

				this.containers.entities.mask = this.map.maskCanopy;
				this.containers.map.addChild(this.map.maskCanopy);

				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.underfoot);
				this.containers.map.addChild(this.containers.entities);
				this.containers.map.addChild(this.containers.overhead);
				this.containers.map.addChild(this.containers.glow);
				this.containers.map.position.x = this.game.width/(2*this._scale)-(this.map.width*this.map.tileSize*0.5);
				this.containers.map.position.y = this.game.height/(2*this._scale)-(this.map.height*this.map.tileSize*0.5);
				console.log('Starting Game')
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
				
				this.map.render();
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
				this.spriteSort(this.containers.entities);
				//this.background.position.x = (this.containers.map.position.x/10) - 128;
				//this.background.position.y = (this.containers.map.position.y/10) - 128;
				
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
				this.game.renderer.render(this.stage);
				//console.log(this.game.renderer.batchs.length)
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
				var tileRad = Math.max(Math.ceil(radius/32),1);
				var sqrRad = (radius*radius);
				var tile = null;
				var entities = [];
				var dx, dy, es;
				for (var j=hx-tileRad;j<tileRad+1+hx;j++){
					for(var k=hy-tileRad;k<tileRad+1+hy;k++){
						tile = this.map.getTile(j,k);
						if (tile){
							es = (tile.data.entities || []).filter(function(e){
								dx = (e.get('xform.tx')-tx);
								dy = (e.get('xform.ty')-ty);
								e._findDist = (dx*dx)+(dy*dy);
								return ((dx*dx)+(dy*dy)<=sqrRad);
							});
							if (es){
								entities = entities.concat(es);
							}
						}
					}
				}
				return entities;
			},
			
			getEntity: function(name){
				return this._entity_name[name.replace(/@/,'')];
			},
			
			getEntities: function(query){

			},

			get: function(path){
				return this.game.data.persist[path]
			},

			set: function(path, value){
				return this.game.data.persist[path]=value;
			}
		})

		return SubzeroState
	}
)