define([
	'sge',
    './components/physics',
    './components/rpgcontrols',
    './components/door',
    './components/container',
    './components/highlight',
    './components/ai'
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
						var bases = [inherit, typ];
						while (inherit!=null){
							baseData = this.blueprints[inherit];
							inherit = null;
							if (baseData.meta!==undefined){
								if (baseData.meta.inherit){
									inherit = baseData.meta.inherit;
									bases.push(inherit)
									//bases.splice(0,0,inherit);
								}
							}
						}
						entityData = {};
						while (bases.length){
							base = bases.shift();
							entityData = sge.util.deepExtend(entityData, this.blueprints[base]);
							console.log(base, entityData.sprite)
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