define([
	'sge',
	'./config',
	'./component'
	], function(sge, config, Component){
		Component.add('inventory', {
			init: function(entity, data){
				this._super(entity, data);
				this.items = {};
				if (data.items){
					data.items.split(',').forEach(function(item){
						this.addItem(item);
					}.bind(this));
				}
			},
			register: function(state){
				this._super(state);
			},
			addItem: function(item){
				
				if (this.items[item]==undefined){
					this.items[item]=1;
				} else {
					this.items[item]++;
				}
			},
			removeItem: function(item){
				if (this.items[item]==undefined){
					this.items[item]=0;
				} else {
					this.items[item]--;
				}
				if (this.items[item]<=0){
					delete this.items[item];
				}
			}
		});

		var MenuItem = sge.Class.extend({
            init: function(data){
            	this.entity = data[0];
            	this.key = data[1];
            	this._counting = false;
            	if (typeof data[0]!==typeof "string"){
            		this._counting = true;
                	this._count = this.entity.inventory.items[this.key];
        		}
                this._callback = data[2];
                this.container = new PIXI.DisplayObjectContainer();
                this.background = new PIXI.Graphics();
                this.background.lineStyle(4, config.colors.primaryDark, 1);
                this.background.drawRect(0,0, 250, 32);
                this.text = new PIXI.BitmapText(this.key, {font: '24px 8bit'});
                this.text.position.y = 4;
                this.text.position.x = 8;
                
                this.container.addChild(this.background);
                this.container.addChild(this.text);

                if (this._count!==undefined&&this._count!==null){
                    this.count = new PIXI.BitmapText('x' + this._count, {font: '24px 8bit'});
                    this.count.position.y = 4;
                    this.count.position.x = 210;
                    this.container.addChild(this.count);
                }
            },
            select: function(){
                this._selected = true
            },
            unselect: function(){
                this._selected = false
            },
            update: function(){
            	if (this._counting){
	            	this._count = this.entity.inventory.items[this.key];
		        	this.count.setText('x' + this._count)
		        }
                if (this._selected){
                    //this.container.position.x = 24;
                    this.background.lineStyle(4, config.colors.complementBright, 1);
                    this.background.drawRect(0,0, 250, 32);
                } else {
                    this.container.position.x = 0;
                    this.background.lineStyle(4, config.colors.primaryDark, 1);
                    this.background.drawRect(0,0, 250, 32);
                }
            },
            callback: function(){
                this._callback();
            }
        });

		var InventoryState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;

                this.background = new PIXI.Graphics();
                this.background.beginFill('0x000000');
                this.background.drawRect(0,0,game.width,game.height);
                this.background.endFill()
                this.background.alpha = 0.65;
            
                this.container.addChild(this.background);

                this._index = 0;
                
                this.menuContainer = null;
                
                this._itemText = ['','','','',''];
                this.items = [];
            },

            createMenu: function(entity){
                var inv = entity.inventory.items;
                var keys = Object.keys(inv);
                var items = keys.map(function(key){
                    return [entity, key, function(){
                        entity.trigger('item.equip', key);
                        this.quit();
                    }.bind(this)];
                }.bind(this));
                var menuContainer = new PIXI.DisplayObjectContainer();
                for (var i=0;i<items.length;i++){
                    var item = new MenuItem(items[i]);
                    item.container.position.y = i * 40;
                    menuContainer.addChild(item.container);
                    this.items.push(item);
                }
                var item = new MenuItem(['Quit', 'Quit', function(){
                    this.quit();
                }.bind(this)]);
                item.container.position.y = i * 40;
                menuContainer.addChild(item.container);
                this.items.push(item);
                this.container.addChild(menuContainer);
                this.menuContainer = menuContainer;
                this.menuContainer.position.x = 64;
                this.menuContainer.position.y = 64;
                this.updateMenu();
            },
            quit: function(){
                this.game.changeState('game');
            },
            tick: function(){
                if (this.input.isPressed('up')){
                    this.up();
                }

                if (this.input.isPressed('down')){
                    this.down();
                }

                if (this.input.isPressed('enter') || this.input.isPressed('space')){
                    this.items[this._index].callback();
                }
            },

            up: function(){
                this._index--;
                if (this._index<0){
                    this._index=0;
                }
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            down: function(){
                this._index++;
                if (this._index>=this.items.length){
                    this._index=this.items.length-1;
                }
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            updateMenu: function(){
                this.items.forEach(function(i){i.unselect()});
                this.items[this._index].select();
                this.items.forEach(function(i){i.update()});
                
            },

            resetMenu: function(){
            	this._index = 0;
            	this.items = [];
            	this.container.removeChild(this.menuContainer);
                this.menuContainer=null;
            },

            startState: function(){
            	
                this.gameState = this.game.getState('game');
                this.gameState.stage.addChild(this.container);
            },
            endState: function(){
                this.gameState.stage.removeChild(this.container);
                this.resetMenu();
                
            },
            render: function(){
                this.game.renderer.render(this.gameState.stage);
            }
        })

        var InventorySwapState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;

                this.background = new PIXI.Graphics();
                this.background.beginFill('0x000000');
                this.background.drawRect(0,0,game.width,game.height);
                this.background.endFill()
                this.background.alpha = 0.65;
            
                this.container.addChild(this.background);

                this._index = [0,0];
                
                this.menuContainer = null;
                
                this._itemText = ['','','','',''];
                this.items = [];
            },

            createMenu: function(entityA, entityB){
            	this._a = entityA;
            	this._b = entityB;
                var invA = entityA.inventory.items;
                var keysA = Object.keys(invA);
                var invB = entityB.inventory.items;
                var keysB = Object.keys(invB);
                var itemsA = keysA.map(function(key){
                    return [entityA, key, function(){
                        while (invA[key]){
                        	entityA.inventory.removeItem(key);
                        	entityB.inventory.addItem(key);
                        }
                        this.rebuildMenu();
                    }.bind(this)];
                }.bind(this));
                
                var itemsB = keysB.map(function(key){
                    return [entityB, key, function(){
                        while (invB[key]){
                        	entityB.inventory.removeItem(key);
                        	entityA.inventory.addItem(key);
                        }
                        this.rebuildMenu();
                    }.bind(this)];
                }.bind(this));
                var maxcount = Math.max(itemsA.length, itemsB.length);
                for (var i=0;i<maxcount;i++){
                	this.items.push([null,null]);
                }
                var menuContainerA = new PIXI.DisplayObjectContainer();
                var menuContainerB = new PIXI.DisplayObjectContainer();
                for (var i=0;i<itemsA.length;i++){
                    itemA = new MenuItem(itemsA[i]);
                    itemA.container.position.y = i * 40;
                    menuContainerA.addChild(itemA.container);
                    if (this.items[i]===undefined){
                    	this.items[i] = {}
                    }
                    this.items[i][0] = itemA;
                }

                for (var i=0;i<itemsB.length;i++){
                    itemB = new MenuItem(itemsB[i]);
                    itemB.container.position.y = i * 40;
                    menuContainerB.addChild(itemB.container);
                    if (this.items[i]===undefined){
                    	this.items[i] = {}
                    }
                    this.items[i][1] = itemB;
                }

                var item = new MenuItem(['Quit', 'Quit', function(){
                    this.quit();
                }.bind(this)]);
                item.container.position.y = maxcount * 40;
                menuContainerA.addChild(item.container);
                this.items[maxcount] = [item,item];
                this.container.addChild(menuContainerA);
                this.menuContainerA = menuContainerA;
                this.menuContainerA.position.x = 64;
                this.menuContainerA.position.y = 64;

                this.container.addChild(menuContainerB);
                this.menuContainerB = menuContainerB;
                this.menuContainerB.position.x = 320;
                this.menuContainerB.position.y = 64;
                this.updateMenu();
            },
            quit: function(){
                this.game.changeState('game');
            },
            tick: function(){
                if (this.input.isPressed('up')){
                    this.up();
                }

                if (this.input.isPressed('down')){
                    this.down();
                }

                if (this.input.isPressed('left')){
                    this.left();
                }

                if (this.input.isPressed('right')){
                    this.right();
                }

                if (this.input.isPressed('enter') || this.input.isPressed('space')){
                    this.items[this._index[1]][this._index[0]].callback();
                }
            },

            up: function(){
            	var y = this._index[1];
                y--;
                if (y<0){
                    y=0;
                }
                this._index[1] = y;
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            down: function(){
            	var y = this._index[1]
                y++;
                if (y>=this.items.length){
                    y=this.items.length-1;
                }
                this._index[1] = y;
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            left: function(){
            	var x = this._index[0];
                x--;
                if (x<0){
                    x=0;
                }
                this._index[0] = x;
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            right: function(){
            	var x = this._index[0];
                x++;
                if (x>1){
                    x=1;
                }
                this._index[0] = x;
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            updateMenu: function(){
                this.items.forEach(function(t){
                	if (t[0]) {
 	               		t[0].unselect();
					}
                	if (t[1]) {
 	               		t[1].unselect();
					}
               	});

               	var item = this.items[this._index[1]][this._index[0]];
               	if (item){
               		item.select();
               	}
                this.items.forEach(function(t){
                	if (t[0]) {
 	               		t[0].update();
					}
                	if (t[1]) {
 	               		t[1].update();
					}
               	});
            },

            rebuildMenu: function(){
            	this.resetMenu();
            	this.createMenu(this._a, this._b);
            },

            resetMenu: function(){
            	this._index = [0,0];
            	this.items = [];
            	this.container.removeChild(this.menuContainerA);
            	this.container.removeChild(this.menuContainerB);
                this.menuContainerA=null;
                this.menuContainerB=null;
            },

            startState: function(){
            	
                this.gameState = this.game.getState('game');
                this.gameState.stage.addChild(this.container);
            },
            endState: function(){
                this.gameState.stage.removeChild(this.container);
                this.resetMenu();
                
            },
            render: function(){
                this.game.renderer.render(this.gameState.stage);
            }
        })

		return {
			InventoryState : InventoryState,
			InventorySwapState : InventorySwapState
		}
	}
)