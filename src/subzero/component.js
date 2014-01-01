define([
		'sge'
	], function(sge){
		var Component = sge.Class.extend({
			init: function(entity){
				this.entity = entity;
				this._callbacks = [];
			},
			get: function(attr){
				return this.entity.get(attr)
			},
			set: function(attr, value){
				return this.entity.set(attr, value);
			},
			register: function(state){
				this.state = state
			},
			deregister: function(){

			},
			on: function(evt, cb){
				if (this._callbacks[cb]===undefined){
					this._callbacks[cb] = cb.bind(this);
				}
				this.entity.on(evt, this._callbacks[cb]);
			},
			off: function(evt, cb){
				this.entity.off(evt, this._callbacks[cb]);
			}
		})

		Component._classMap = {};

		Component.add = function(type, data){
			klass = Component.extend(data);
			Component._classMap[type] = klass;
			return klass;
		}

		Component.Create = function(entity, type, data){
			if (Component._classMap[type]==undefined){
				console.error('Missing Component:', type);
				return null;
			}
			comp = new Component._classMap[type](entity, data);
			return comp;
		}

		Component.add('xform', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('xform.tx', data.tx || 0);
				this.set('xform.ty', data.ty || 0);
			}
		});

		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame || 1);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				this.parent.addChild(this._sprite);
				this._sprite.position.x = this.get('xform.tx');
				this._sprite.position.y = this.get('xform.ty');
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
			},


			render: function(){
				
				var dx = this.get('xform.tx') - this._sprite.position.x;
				var dy = this.get('xform.ty') - this._sprite.position.y;
				if (dx != 0 || dy != 0){
					//*
					if (dy>0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx+1];
						if (next){
							if (next.position.y<this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					} else if(dy<0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx-1];
						if (next){
							if (next.position.y>this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					}
					//*/
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				}
				this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
			}
		});

		return Component;
	}
)