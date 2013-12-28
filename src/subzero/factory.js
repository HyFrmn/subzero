define([
	'sge',
    './components/physics',
    './components/rpgcontrols',
    './components/door',
    './components/container',
    './components/highlight',
    './components/ai',
    './components/emote',
    './components/noise',
    './components/data',

    './behaviours/citizen'
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
				var tags = [];
				if (data===undefined){
					data = {}
				}
				if (this.blueprints[typ]==undefined){
					return;
				}
				var entityData = sge.util.deepExtend({}, this.blueprints[typ]);

				if (data.meta!==undefined){
					if (data.meta.tag){
						tags = tags.concat(data.meta.tag);
					}
				}
				if (entityData.meta!==undefined){
					if (entityData.meta.tagsBase){
						tags = tags.concat(entityData.meta.tagsBase);
					}
					if (entityData.meta.inherit!==undefined){
						var inherit = entityData.meta.inherit;
						var bases = [typ, inherit];
						while (inherit!=null){
							baseData = this.blueprints[inherit];
							inherit = null;
							if (baseData.meta!==undefined){
								if (baseData.meta.tags){
									tags = tags.concat(baseData.meta.tags);
								}
								if (baseData.meta.inherit){
									inherit = baseData.meta.inherit;
									bases.push(inherit);
								}
							}
						}
						entityData = {};
						bases.reverse();
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
				entity.tags = entity.tags.concat(tags);
				return entity;
			}
		})

		return Factory;
})