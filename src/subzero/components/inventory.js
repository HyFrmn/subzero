define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('inventory', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('inventory.items', {});
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
				var inv = this.get('inventory.items');
				if (inv[item]==undefined){
					inv[item]=1;
				} else {
					inv[item]++;
				}
				this.set('inventory.items', inv);
			}
		});		
	}
)