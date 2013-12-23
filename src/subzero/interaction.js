define(['sge'],function(sge){
	    config = {
        BButton : 'enter',
        YButton : 'z'
    }
    var InteractComponent = sge.Component.extend({
        init: function(entity, data){
            this._super(entity, data);
            this.data.fillStyle = 'green';
            this.data.strokeStyle = 'black';
            this.data.targets = data.targets || null;
            this.data.width = data.width || 32;
            this.data.height = data.height || 32;
            this.data.dist = data.dist || 96;
            this.data.priority = data.priority || false;
            this.data.enabled = data.enabled === undefined ? true : Boolean(data.enabled);
            this.active = false;
            this.interact = this.interact.bind(this);
            this.interactSecondary = this.interactSecondary.bind(this);
            this.entity.addListener('focus.gain', this.activate.bind(this));
            this.entity.addListener('focus.lose', this.deactivate.bind(this));
        },
        _set_enabled : function(value){
            this.data.enabled = this.__set_value('enabled', Boolean(value));
            if (this.active){
                this.entity.fireEvent('focus.lose');
            }
        },
        _set_priority : function(priority){
            this.data.priority = this.__set_value('priority', Boolean(priority));
            this.signalActor.setVisible(this.data.priority);
            var regions = this.entity._regions;
            for (var i = regions.length - 1; i >= 0; i--) {
                var region = regions[i];
                if (region.highlight){
                    region.highlight(this.data.priority);
                    break;
                }
            };
            if (this.data.priority){
                this.entity.fireEvent('highlight.on');
            } else {
                this.entity.fireEvent('highlight.off');
            }
        },
        activate: function(coord){
            if (this.get('enabled')){
                this.activeCoord = coord;
                this.active = true;
                this.state.input.addListener('keydown:' + config.BButton, this.interact);
                this.state.input.addListener('keydown:' + config.YButton, this.interactSecondary);
            }
        },
        deactivate: function(){
                this.active = false;
                this.state.input.removeListener('keydown:' + config.BButton, this.interact);
                this.state.input.removeListener('keydown:' + config.YButton, this.interactSecondary);
            
        },
        interact: function(){
            var evt = 'interact';
            this.entity.fireEvent(evt, this.state.pc);
        },
        interactSecondary: function(){
            var evt = 'interact.secondary';
            this.entity.fireEvent(evt, this.state.pc);
        },
        register: function(state){
            this._super(state);
            this.signalActor = new CAAT.Actor().setLocation(4,-36).setBackgroundImage(sge.Renderer.SPRITESHEETS['exclimation_icons']).setSpriteIndex(0);
            this.entity.get('xform').container.addChild(this.signalActor);
            this.signalActor.setVisible(this.data.priority);
        },
        deregister: function(state){
            if (this.get('priority')){
                this.entity.get('xform').container.removeChild(this.signalActor);
            }
            state.input.removeListener('keydown:enter', this.interact);
            this._super(state);
        }
    });
    sge.Component.register('interact', InteractComponent);


    var Interact = sge.Class.extend({
    	init: function(state){
    		this.state = state;
    		this._closest = null;
    	},
    	tick : function(delta){
                var closest = null;
                var cdist = 128*128;
                var ccord = null;
                var pcHash = this.state._spatialHashReverse[this.state.pc.id];
                var pcTx = this.state.pc.get('xform.tx');
                var pcTy = this.state.pc.get('xform.ty')
                var entities = this.state.findEntities(pcTx, pcTy, 128)
                for (var i = entities.length - 1; i >= 0; i--) {
                    entity = entities[i];
                    if (!entity.get('active')){
                        continue;
                    }
                    if (entity.get('interact')==undefined){
                        continue;
                    }
                    if (!entity.get('interact.enabled')){
                        continue
                    }
                    if (entity==this.state.pc){
                        continue;
                    }
                    if (entity.get('interact.targets')!==null){
                        coords = entity.get('interact.targets').map(function(target){
                            return [entity.get('xform.tx')+target[0], entity.get('xform.ty')+target[1]]
                        });
                    } else {
                        coords = [[entity.get('xform.tx'), entity.get('xform.ty')]];
                    }
                    for (var j = coords.length - 1; j >= 0; j--) {
                        var dx = coords[j][0] - pcTx;
                        var dy = coords[j][1] - pcTy;
                        var distSqr = (dx*dx)+(dy*dy);
                        if (distSqr <= (entity.get('interact.dist') * entity.get('interact.dist'))){
                            if (distSqr < cdist){
                                closest = entity;
                                cdist = distSqr;
                                ccord = coords[j];
                            }
                        }
                    };
                    
                }
                if (closest!=this._closest){
                    if (this._closest){
                        this._closest.fireEvent('focus.lose');
                    }
                    if (closest){
                        closest.fireEvent('focus.gain', ccord);
                    }
                    this._closest = closest;
                }
                if (closest!=null){
                    
                    //this._interaction_actor.setLocation(ccord[0]+closest.get('xform.offsetX'),ccord[1]+closest.get('xform.offsetY'));
                }
            },
    })

	return Interact;
})