define(['sge'],
	function(sge){
		var Regions = sge.Class.extend({
			init: function(){
				this._regions = {};
			},
			get: function(name){
				return this._regions[name];
			},
			set: function(name, region){
				this._regions[name] = region;
			},
			add: function(region){
				this.set(region.name, region);
			}
		});
	
		return Regions;
	}
)