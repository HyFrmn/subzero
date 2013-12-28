define(['sge','../behaviour', './attack', './track'],function(sge, Behaviour){
var CitizenBehaviour = Behaviour.Add('citizen', {
        /**
        * Character:
        *    Attacks when hit.
        *    Chases enemy when hit.
        *    Flees from enemy when damaged.
        *
        *
        */
        init: function(entity, parent){
            this._super(entity, parent);
        },
	    deferBehaviour: function(behaviour, arg0, arg1, arg2, arg3, arg4){
			var func = function(){
				
				var deferred = new sge.vendor.when.defer();
				this.setBehaviour(behaviour, arg0, arg1, arg2, arg3, arg4)
					.then(deferred.resolve);
				return deferred.promise;
			}.bind(this)
			return func;
		},

        _setBehaviourCallback: function(behaviour, arg0, arg1, arg2, arg3, arg4){
            this.setBehaviourCallback(behaviour, arg0, arg1, arg2, arg3, arg4);
        },

        setBehaviour: function(behaviour, arg0, arg1, arg2, arg3, arg4){
            if (this._currentBehaviour){
                this._currentBehaviour.end();
            }
            console.log('Set Enemy Behaviour:', behaviour);
            this.entity.fireEvent('emote.msg', 'Behaviour: ' + behaviour)
            this._currentBehaviour = Behaviour.Create(behaviour, this.entity, this);
            this._currentBehaviour.onStart(arg0, arg1, arg2, arg3, arg4);
            return this._currentBehaviour;
        },
        onStart: function(){
        	this._currentBehaviour = null;
        	this.setBehaviour(this.entity.get('ai.initBehaviour'), this.entity.get('ai.behaviourOptions'));
            this.entity.addListener('ai.setBehaviour', this.setBehaviour.bind(this));
        },
        
        tick: function(delta){
            //Determine Behaviour
            //var enemy = this.seePlayer();
            if (this._currentBehaviour){
                this._currentBehaviour.tick(delta);
            }

        }
    })
	return CitizenBehaviour
})
