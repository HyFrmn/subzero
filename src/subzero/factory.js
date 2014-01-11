define([
	'sge',
	'./entity',
	'./components/sprite',
	'./components/rpgcontrols',
	'./components/chara',
	'./components/ai',
	'./components/physics',
	'./components/sound',
	'./components/bomb',
	'./components/emote',
	'./components/guardpost',
	'./components/goalpost',
	'./components/door',
	'./components/interact',
	'./components/highlight',
	'./components/container',
	'./components/computer',
	'./components/anim',
	'./components/inventory',
	'./components/item',
	'./components/equipable'
	],function(sge, Entity){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };

		var _Factory = sge.Class.extend({
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

				var entityData = deepExtend({}, this.blueprints[typ]);

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
							entityData = deepExtend(entityData, this.blueprints[base]);
						}
					}

				}
				
				entityData = deepExtend(entityData, data);
				

				if (entityData['meta']!==undefined){
					delete entityData['meta'];
				}
				var entity = Entity.Factory(entityData);
				entity.tags = entity.tags.concat(tags);
				return entity;
			}
		})
		Factory = new _Factory();
		return Factory;
})