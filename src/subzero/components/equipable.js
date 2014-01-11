define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('equipable', {
			init: function(entity, data){
				this._super(entity, data);
				this._equiped = null;
			},
			register: function(state){
				this._super(state);
				this.on('item.equip', this.itemEquip)
				this.on('item.use', this.itemUse)
			},
			deregister: function(state){
				this._super(state);
				this.off('item.equip', this.itemEquip);
				this.off('item.use', this.itemUse)
			},
			itemEquip: function(item){
				this._equiped = item;
				this.entity.trigger('item.equiped', this._equiped);
			},
			itemUse: function(){
				if (this._equiped){
					inv = this.get('inventory.items');
					if (inv[this._equiped]>0){
						inv[this._equiped]--;
						//TODO: Replace with real item used code.
						var bomb = this.state.factory.create(this._equiped, {
							xform: {
								tx: this.get('xform.tx'),
								ty: this.get('xform.ty')
							}
						})
						this.state.addEntity(bomb);
						if (inv[this._equiped]<=0){
							this.itemEquip(null);
						}
					}
				}
			}

		});		
	}
)