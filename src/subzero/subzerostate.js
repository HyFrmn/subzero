define([
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./input',
		'./physics',
		'./factory',
		'./social',
		'./ai'
	], function(sge, TileMap, TiledLevel, Entity, Input, Physics, Factory, Social, AI){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];

				this._entity_spatial_hash = {}


				this.stage = new PIXI.Stage(0x66FF99);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 1;
				console.log(window.innerWidth, game.width)
				//if (navigator.isCocoonJS){
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				//}
				this.container.scale.x *= this._scale;
				this.container.scale.y *= this._scale
				this.containers={};
				this.containers.entities = new PIXI.DisplayObjectContainer();
				this.containers.map = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				this.containers.map.addChild(this.containers.entities);
				this.stage.addChild(this.container);
				this.input = new Input(game.renderer.view);
				this.physics = new Physics();
				this.factory = new Factory();
				this.social = new Social();
				this.loadManifest();
				
			},
			loadManifest: function(){
				var loader = new sge.Loader();
				var promises = [];

				promises.push(loader.loadSpriteFrames('content/sprites/man_a.png','man_a', 64,64));
				promises.push(loader.loadSpriteFrames('content/sprites/man_b.png','man_b', 64,64));
				promises.push(loader.loadSpriteFrames('content/sprites/man_c.png','man_c', 64,64));
				promises.push(loader.loadSpriteFrames('content/sprites/man_d.png','man_d', 64,64));
				promises.push(loader.loadJSON('content/entities/standard.json').then(this.factory.load.bind(this.factory)));
				promises.push(loader.loadJSON('content/ai/standard.json').then(AI.load.bind(this.factory)));

				sge.When.all(promises).then(function(){
					console.log('Load Sprites!');
					loader.loadJSON('content/levels/' + this.game.data.map + '.json').then(function(data){
						this.loadLevel(data);
					}.bind(this))
				}.bind(this));
			},
			loadLevel : function(levelData){
				console.log('Loaded', levelData);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){
					this.social.setMap(this.map);
					this.map.preRender();
					this.physics.setMap(this.map);
					this.initGame();
				}.bind(this), 500)
			},
			initGame: function(){
				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.entities);
				console.log('Making PC')
				this.pc = this.factory.create('pc', {
					xform: { tx: 200, ty: 200}
				});
				console.log('PC:', this.pc)
				this.addEntity(this.pc);
				this.physics.entities.push(this.pc);

				this.containers.map.position.x = this.pc.get('xform.tx');

				this.game.changeState('game');

			},
			tick: function(delta){
			    this._super(delta);
				this.input.tick(delta);
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.tick(delta);
				};
				this.physics.tick(delta);

				this.containers.map.position.x = -this.pc.get('xform.tx')+this.game.width/(2*this._scale);
				this.containers.map.position.y = 32-this.pc.get('xform.ty')+this.game.height/(2*this._scale);
			},

			render: function(){
				this.map.render();
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
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
					tile = this.map.getTile(hx, hy)
					e.set('map.tile', tile);
					if (tile.data.entities==undefined){
						tile.data.entities=[];
					}
					tile.data.entities.push(e);
					//console.log('Moved:', tile.data.entities, hash, hx + '.' + hy)
					
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
			removeEntity: function(e){

			},
			getEntities: function(query){

			}
		})

		return SubzeroState
	}
)