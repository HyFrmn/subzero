define(['sge/component'], function(Component){
    var NOISETYPES = [
        'vendor',      //3 - Standard, 5-Street, 7-Celeb
        'explosion',   //3 - Gun Shot, 5-Person Screaming, 7-Bomb Explosion
        'alarm'        //3 - Public Address Warning, 5 - Public Threat, 7 - Env Hazard
    ]
    var NoiseComponent = Component.extend({
    	init: function(entity, data){
    		this._super(entity, data);
    	},
    	register: function(state){
    		this._super(state);
    		this.entity.addListener('noise.emit', this.emitNoise.bind(this));
    	},
    	emitNoise: function(volume, length){
    		var tx = this.entity.get('xform.tx');
    		var ty = this.entity.get('xform.ty');
    		var entities = this.state.findEntities(
    								tx,
    								ty,
    								volume);
    		entities.forEach(function(entity){
    			entity.fireEvent('noise.hear', tx, ty, volume);
    		})
            this.state.createTimeout(10, function(){
                console.log('Timeout')
                entities.forEach(function(entity){
                    entity.fireEvent('noise.stop', tx, ty, volume);
                })
            })
            console.log('emit')
    	}
    })
    Component.register('noise', NoiseComponent);
    return NoiseComponent;
});