define([
	'sge',
    './components/physics',
    './components/rpgcontrols',
    './components/door',
    './components/container',
    './components/highlight'
	],function(sge){
		var Factory = sge.Class.extend({
			init: function(){
				this.blueprints = {}
			},
			load: function(data){
				for (var prop in data) {
			      // important check that this is objects own property 
			      // not from prototype prop inherited
			      if(data.hasOwnProperty(prop)){
			        this.blueprints[prop] = data[prop];
			      }
			   }
			},
			has: function(typ){
				return (this.blueprints[typ]!==undefined);
			},
			create: function(typ, data){
				
				if (this.blueprints[typ]==undefined){
					return;
				}
				var entityData = sge.util.deepExtend({}, this.blueprints[typ]);
				if (entityData.meta!==undefined){
					if (entityData.meta.inherit!==undefined){
						var inherit = entityData.meta.inherit;
						var bases = [typ, inherit];
						while (inherit!=null){
							baseData = this.blueprints[inherit];
							inherit = null;
							if (baseData.meta!==undefined){
								if (baseData.meta.inherit){
									inherit = baseData.meta.inherit;
									bases.push(inherit);
								}
							}
						}
						entityData = {};
						while (bases.length){
							base = bases.shift();
							entityData = sge.util.deepExtend(entityData, this.blueprints[base]);
						}
					}
				}
				entityData = sge.util.deepExtend(entityData, data);
				if (entityData['meta']!==undefined){
					delete entityData['meta'];
				}
				var entity = new sge.Entity(entityData);
				return entity;
			}
		})

		return Factory;
})