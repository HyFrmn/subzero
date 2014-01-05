define([
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('goalpost', {
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														12);
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0){
					this.state.winGame();
				}
			},
		});		
	}
)