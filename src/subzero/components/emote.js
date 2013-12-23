define(['sge'], function(sge){
	var Emote = sge.Component.extend({
		init: function(entity, data){
			this._super(entity, data);
			this._visible = false;
            this.fontSize = 16;
			this.data.text = data.text || "";
            this.data.length = data.length || 2;
			this.entity.addListener('emote.msg', function(msg, length){
                if (this.container!=undefined){
                    length = length || this.get('length')
    				this.container.setVisible(true);
                    this._visible = true;
    				this.set('text', msg);
    				this.entity.state.createTimeout(length, function(){
    					this.container.setVisible(false);
                        this._visible = false;
    				}.bind(this));
                }
			}.bind(this))
		},
		register: function(state){
            this._super(state);
            this.scene = this.state.scene;
            this.container = new CAAT.ActorContainer()
            this.bg = new CAAT.Actor().setSize(32,16).setFillStyle('black');
            this.container.addChild(this.bg);
            this.text = new CAAT.TextActor().setLocation(2,2).setFont(this.fontSize + 'px sans-serif');
            this.container.addChild(this.text);
            this.container.setVisible(false);
            this.state.map.canopyDynamic.addChild(this.container);
        },
        render: function(){
            if (this._visible){
                var tx = this.entity.get('xform.tx');
                var ty = this.entity.get('xform.ty');
                this.container.setLocation(tx+12,ty-64);
            }
        },
        deregister: function(state){
            this.state.map.canopyDynamic.removeChild(this.container);
            this._super(state);
        },
        _set_text: function(text){
            this.data.text = text;
        	this.text.setText(text);
        	this.text.calcTextSize(this.state.game.renderer);
        	this.bg.setSize(this.text.textWidth+4, this.fontSize + 8);
        	return text;
        }
	});

	sge.Component.register('emote', Emote);

	return Emote;
});
