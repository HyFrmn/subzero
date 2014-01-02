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
				this.text = new PIXI.BitmapText("", {font: "20px 8bit"});
				this.state.containers.overhead.addChild(this.text);
				this.text.position.x = 300;
				this.text.position.y = 300;
				this._timeout = -1;
				this.on('emote.msg', this.emote);
			},
			emote: function(msg){
				this.text.setText(msg);
				this.state.containers.overhead.addChild(this.text);
				this._timeout = this.state.getTime() + 1;
			},
			clear: function(){
				this._timeout = -1;
				this.state.containers.overhead.removeChild(this.text);
			},
			tick: function(){
				if(this._timeout>0 && this._timeout<this.state.getTime()){
					this.clear()
				}
			},
			render: function(){
				this.text.position.x = this.get('xform.tx');
				this.text.position.y = this.get('xform.ty')-64;
			}
		});		
	}
)