define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('emote', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this._visible = false;
				this.text = new PIXI.BitmapText("", {font: "20px 8bit"});
				this.text.position.x = 300;
				this.text.position.y = 300;
				this._timeout = -1;
				this.on('emote.msg', this.emote);
			},
			emote: function(msg){
				if (!this._visible){
					this.text.setText(msg);
					this.state.containers.overhead.addChild(this.text);
					this._timeout = this.state.getTime() + 1;
					this._visible = true;
				}
			},
			clear: function(){
				this._timeout = -1;
				this.state.containers.overhead.removeChild(this.text);
				this._visible = false;
			},
			tick: function(){
				if(this._timeout>0 && this._timeout<this.state.getTime()){
					this.clear()
				}
			},
			render: function(){
				if (this._visible){
					this.text.position.x = this.get('xform.tx');
					this.text.position.y = this.get('xform.ty')-64;
				}
			}
		});		
	}
)