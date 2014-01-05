define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				this.set('sprite.scalex', data.scalex || 1);
				this.set('sprite.scaley', data.scaley || 1);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame== undefined ? 0 : data.frame);

				this.set('sprite.visible', true);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			show: function(){
				this.set('sprite.visible', true);
				this.parent.addChild(this._sprite);
			},

			hide: function(){
				this.set('sprite.visible', false);
				if (this.parent.children.indexOf(this._sprite)>=0){
					this.parent.removeChild(this._sprite);
				}
			},

			deregister: function(state){
				this.hide();
				this.off('sprite.show', this.show);
				this.off('sprite.hide', this.hide);
				this._super(state);
			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				
				this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				this._test_a = this.get('xform.ty');
				this._test_b = Math.random() * 2 * Math.PI;
				var idx = this.parent.children.indexOf(this._sprite);
				
				var next = this.parent.children[idx-1];
				
				if (next){
					while (next.position.y>this._sprite.position.y){
						this.parent.swapChildren(this._sprite, next);
						idx--;
						if (idx<=0){
							break;
						}
						next = this.parent.children[idx-1];
					}
				}
				this.on('sprite.show', this.show);
				this.on('sprite.hide', this.hide);
				if (this.get('sprite.visible')){
					this.show();
				}
			},
			render: function(){
				if (this.get('sprite.visible')){
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
					this._sprite.scale.x = this.get('sprite.scalex');
					this._sprite.scale.y = this.get('sprite.scaley');
					this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
				}
			}
		});
	}
)