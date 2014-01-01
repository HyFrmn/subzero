define([
	'sge',
	'../component',
	'../ai'
	], function(sge, Component, AI){
		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    this.set('ai.behaviour', data.behaviour || 'citizen')
			    this._timeout = 0;
			    this._behaviours = AI.Create(this.get('ai.behaviour'), this.entity)
			},
			register: function(state){
				this._super(state);
				this._behaviours.sort(function(a,b){
					return b.importance - a.importace;
				});
				for (var i=0; i<this._behaviours.length; i++){
						this._behaviours[i].run(state);
					
				}
			},
			tick: function(delta){
				for (var i=0; i<this._behaviours.length; i++){
					behaviour = this._behaviours[i];
					if (!behaviour.isSatisfied()){
						if (behaviour.tick(delta)){
							break;
						}
					}
				}
			}
		});		
	}
)