define([
    'sge',
    './tiledlevel',
    './physics',
    './factory',
    './interaction',
    './equipable',
    ],
    function(sge, TiledLevel, Physics, Factory, Interact){
        var SubzeroState = sge.GameState.extend({
            initState: function(){
                //Load the physics engine.
                this.physics = new Physics(this);
                this.factory = new Factory();
                this.interact = new Interact(this);
                this.loadManifest();                
            },
            loadManifest: function(){
                var loader = new sge.Loader(this.game);
                loader.loadJSON('content/manifest.json').then(this.parseManifest.bind(this));
            },
            parseManifest: function(data){
                var defereds = [];
                var loader = new sge.Loader(this.game);
                if (data.sprites){
                    for (var i = data.sprites.length - 1; i >= 0; i--) {
                        var spriteData = data.sprites[i];
                        var spriteSize = [32,32];
                        var url = 'content/sprites/' + spriteData + '.png';
                        if (typeof(spriteData)!='string'){
                            url = 'content/sprites/' + spriteData[0] + '.png';
                            spriteSize = spriteData[1];
                        }
                        
                        defereds.push(loader.loadImage(url, {size: spriteSize}));
                    };
                }
                if (data.tiles){
                    for (var i = data.tiles.length - 1; i >= 0; i--) {
                        var tileData = data.tiles[i];
                        var url = 'content/tiles/' + tileData + '.png';
                        defereds.push(loader.loadImage(url, {size: 32}));
                    };
                }
                if (data.entities){
                    for (var i = data.entities.length - 1; i >= 0; i--) {
                        var entityUrl = data.entities[i];
                        var url = 'content/entities/' + entityUrl + '.json';
                        defereds.push(loader.loadJSON(url).then(this.factory.load.bind(this.factory)));
                    };
                }
                /*
                if (data.levels){
                    for (var i = data.levels.length - 1; i >= 0; i--) {
                        var levelData = data.levels[i];
                        defereds.push(loader.loadJSON(levelData, {size: 32}));
                    };
                }
                */
                sge.vendor.when.all(defereds).then(this.createMap.bind(this));
            },
            //Called when game assets are loaded.
            initGame: function(){
                var map = this.level.map;

                this.physics.setMap(map);
                this.level.map.render();
                

                // Create / Load PC
                this.pc = this.factory.create('pc', {xform: {tx:200,ty:200}});
                this.addEntity(this.pc);
                this.level.updateEntity('pc', this.pc);
                this.game.fsm.finishLoad();
            },
            tick: function(delta){
                //Tick Objects
                for (var i = this._entity_ids.length - 1; i >= 0; i--) {
                    var id = this._entity_ids[i];
                    var e = this.getEntity(id);
                    if (e){
                        e.tick(delta);
                    }
                };

                //Prune entities
                while (this._killList.length>0){
                  var e = this._killList.shift();  
                  this._removeFromHash(e);
                  this.removeEntity(e);
                };

                //Move Objecs and Resolve Collisions.
                this.physics.resolveCollisions(delta);

                var pcx = this.pc.get('xform.tx');
                var pcy = this.pc.get('xform.ty');
                this.level.container.setLocation(200-pcx,200-pcy)

                this.interact.tick(delta);

                //Draw Function with Sorting
                var sortMap = []
                _.each(this._entity_ids, function(id){
                    if (this.entities[id].active){
                        var entity = this.entities[id];
                        var tx = entity.get('xform.tx');
                        var ty = entity.get('xform.ty');
                        
                        entity.componentCall('render', this.game.renderer, 'main');
                        sortMap.push([entity, ty]);
                    }
                }.bind(this));
                sortMap.sort(function(a,b){return a[1]-b[1]});
                var i = 0;
                sortMap.forEach(function(data){
                    i++;
                    this.scene.setZOrder(data[0].get('xform.container'), i);
                }.bind(this));
            },

            createMap: function(){
                var loader = new sge.Loader(this.game);
                loader.loadJSON('content/levels/station.json').then(function(levelData){
                    this.level = new TiledLevel(this, levelData);
                    this.initGame();
                }.bind(this));
            },


        });

        return SubzeroState;
    }
)