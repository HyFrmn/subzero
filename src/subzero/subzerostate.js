define([
    'sge',
    './tiledlevel',
    './physics',
    './factory',
    './interaction',
    './events',
    './regions',
    './equipable',
    ],
    function(sge, TiledLevel, Physics, Factory, Interact, Events, Regions){
        var SubzeroState = sge.GameState.extend({
            initState: function(){
                //Load the physics engine.
                this.physics = new Physics(this);
                this.factory = new Factory();
                this.interact = new Interact(this);
                this.events = new Events(this);
                this.regions = new Regions(this);
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
                        var spriteName = spriteData;
                        if (typeof(spriteData)!='string'){
                            url = 'content/sprites/' + spriteData[0] + '.png';
                            spriteSize = spriteData[1];
                            spriteName = spriteData[0];
                        }
                        
                        defereds.push(loader.loadImage(url, {size: spriteSize, name:spriteName}));
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
                
                if (data.events){
                    for (var i = data.events.length - 1; i >= 0; i--) {
                        var entityUrl = data.events[i];
                        var url = 'content/events/' + entityUrl + '.json';
                        defereds.push(loader.loadJSON(url).then(this.events.load.bind(this.events)));
                    };
                }

                if (data.levels){
                    data.levels.forEach(function(levelName){
                        var url = 'content/levels/' + levelName + '.json';
                        defereds.push(loader.loadJSON(url, {size: 32}).then(function(data){
                            TiledLevel.set(levelName, data);
                        }));
                    })
                }

                sge.vendor.when.all(defereds).then(this.createMap.bind(this));
            },
            //Called when game assets are loaded.
            initGame: function(){
                var map = this.level.map;

                this.physics.setMap(map);
                this.level.map.render();
                

                // Create / Load PC
                this.pc = this.factory.create('pc');
                this.pc.name='pc';
                this.addEntity(this.pc);
                this.level.updateEntity('pc', this.pc);

                this.events.setup();

                this.game.fsm.finishLoad();

                setTimeout(function(){
                    this.level.fireEvent('start');
                }.bind(this),100)
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

                this.events.tick(delta);

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
                this.render(delta);
            },

            render: function(delta){
                //Draw Function with Sorting
                var sortMap = []
                _.each(this._entity_ids, function(id){
                    if (this.entities[id].active){
                        var entity = this.entities[id];
                        var tx = entity.get('xform.tx');
                        var ty = entity.get('xform.ty');
                        
                        entity.componentCall('render', delta);
                        sortMap.push([entity, ty]);
                    }
                }.bind(this));
                sortMap.sort(function(a,b){return a[1]-b[1]});
                var i = 0;
                sortMap.forEach(function(data){
                    i++;
                    this.entityContainer.setZOrder(data[0].get('xform.container'), i);
                }.bind(this));
            },

            createMap: function(){
                var loader = new sge.Loader(this.game);
                
                this.level = TiledLevel.Load(this, this.game.data.level);
                console.log('Level:', this.level);

                loader.loadJSON('content/levels/' + this.game.data.level + '.events.json').then(function(eventData){
                    this.events.load(eventData);
                    this.initGame();
                }.bind(this));
            },

            getEntityByName: function(name){
                testname = name.replace('@','');
                return _.filter(this.getEntities(), function(e){
                    return (e.name==testname)
                })[0];
            }
        });

        return SubzeroState;
    }
)