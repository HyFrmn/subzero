var DOOROPENTILE1 = { srcX : 1, srcY: 4, spriteSheet: "base_tiles"}
var DOOROPENTILE2 = { srcX : 1, srcY: 5, spriteSheet: "base_tiles"}
var DOORCAPTILE1 = { srcX : 2, srcY: 4, spriteSheet: "base_tiles"}
var DOORCAPTILE2 = { srcX : 2, srcY: 5, spriteSheet: "base_tiles"}
var DOORCLOSEDTILE1 = { srcX : 1, srcY: 4, spriteSheet: "base_tiles"}
var DOORCLOSEDTILE2 = { srcX : 1, srcY: 5}

define(['sge'], function(sge){
    var Door = sge.Component.extend({
        init: function(entity, data){
            this._super(entity, data);
            this.room = data.room;
            this.data.key = data.key || null;
            this.data.locked = data.locked || false;
            this.data.open = data.open===undefined ?  true : data.open;
            this.interact = this.interact.bind(this);
            this.entity.addListener('interact', this.interact);
            this.interactSecondary = this.interactSecondary.bind(this);
            this.entity.addListener('interact.secondary', this.interactSecondary);
            this.entity.tags.push('door');
        },
        interact: function(e){
            if (this.get('locked')){
                this.entity.fireEvent('state.log','Door is locked');
                this.entity.fireEvent('close');
            } else {
                this.set('open', !this.get('open'));
                this.entity.fireEvent('open');
                /*
                if (this.room){
                    this.room.update();
                }
                */
                this.updateTiles();
            }
        },
        interactSecondary: function(e){
            if (this.get('locked')){
                if (this.get('locked')===true){
                    if (this.get('key')){
                        var keyName = this.get('key');
                        if (keyName in e.get('inventory.items')){
                            this.unlock();
                        }
                    } else {
                        if (e.get('inventory.keys')>0){
                            e.set('inventory.keys', -1, 'add')
                            this.unlock();
                        } else {
                            this.entity.fireEvent('emote.msg', "I don't have a key.")
                            this.entity.fireEvent('state.log', "Need a key to unlock the door.")
                        }
                    }
                } else {
                    e.fireEvent('emote.msg', "My key dosen't seem to be working.");
                }
            } else {
                this.entity.fireEvent('state.log', 'Door is already unlocked.');
            }
        },
        unlock: function(){
            this.entity.fireEvent('state.log','Unlocking the door.');
            this.entity.fireEvent('unlock');
            this.set('locked', false);
        },
        createTiles : function(){
            var tx = Math.floor(this.entity.get('xform.tx') / 32);
            var ty = Math.floor(this.entity.get('xform.ty') / 32);
            this.tileA = new CAAT.Actor().setLocation(tx*32,(ty-1)*32);
            var frame = DOORCLOSEDTILE2.srcY * 8 + DOORCLOSEDTILE2.srcX;
            this.tileA.setBackgroundImage(sge.Renderer.SPRITESHEETS['door']).setSpriteIndex(0);
            this.state.entityContainer.addChild(this.tileA);
        },
        updateMapTiles : function(){
            var tx = Math.floor(this.entity.get('xform.tx') / 32);
            var ty = Math.floor(this.entity.get('xform.ty') / 32);
            tile = this.map.getTile(tx,ty-1);
            tile.layers['layer1'] = DOOROPENTILE1;
            tile.layers['canopy'] = DOORCAPTILE1;
            tile = this.map.getTile(tx-1,ty-1);
            if (tile){
                tile.layers['canopy'] = { srcX : 3, srcY: 4, spriteSheet: 'base_tiles'}
            }
            tile = this.map.getTile(tx+1,ty-1);
            tile.layers['canopy'] = { srcX : 3, srcY: 4, spriteSheet: 'base_tiles'}
            
            tile = this.map.getTile(tx,ty);
            tile.layers['layer1'] = DOOROPENTILE2;
        },

        updateTiles : function(){
            var open = this.get('open');
            var tx = Math.floor(this.entity.get('xform.tx') / 32);
            var ty = Math.floor(this.entity.get('xform.ty') / 32);
            tile = this.map.getTile(tx,ty-2);
            tile.data.passable=open;
            tile = this.map.getTile(tx,ty-1);
            tile.data.passable=open;
            tile = this.map.getTile(tx,ty);
            tile.data.passable=open;
            if (open){
                this.tileA.setVisible(false);
            } else {
                this.tileA.setVisible(true);
            }
        },

        register: function(state){
            this._super(state);
            //this.set('locked', this.data.locked);
            this.map = state.map;
            this.updateMapTiles();
            this.createTiles();
            this.updateTiles();
            /*
            if (this.room){
                this.room.doors.push(this.entity);
            }
            */
        },
        
        _set_locked: function(value, arg0, arg1, arg2){
            value = this.__set_value('locked', value, arg0);
            if (Boolean(value)){
                this.entity.set('highlight.focusColor', 'red');
            } else {
                this.entity.set('highlight.focusColor', 'lime');
            }
        },
        unregister: function(){
            this.state = null;
            this.map = null;
        }
    });
    sge.Component.register('door', Door);
    return Door
})
