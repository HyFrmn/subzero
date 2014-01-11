define([
	'sge'
	], function(sge){
		var PlayerHUD = sge.Class.extend({
			init: function(state){
				this.pc = null;
				this.state = state;
				this.container = new PIXI.DisplayObjectContainer	();
			},
			setPC: function(pc){
				this.pc = pc;
				this.createDisplay();
				this.state.containers.hud.addChild(this.container);
				this.pc.on('item.equiped', this.updateItem.bind(this));
			},
			updateItem: function(item){
				console.log(item);
				this._equiped.setText('Equiped:' + item);
			},
			createDisplay: function(){
				this._equiped = new PIXI.BitmapText('Equiped: null', {font: '16px 8bit'});
				this.container.addChild(this._equiped);
			}
		})

		return PlayerHUD
	}
)