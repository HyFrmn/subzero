define(['sge','../behaviour'],function(sge, Behaviour){
    var AttackBehaviour =  Behaviour.Add('attack', {
        onStart: function(options){
            options = options || {};
            this.target = this.state.getEntityByName(options.target);
            this.timeout = options.timeout || -1;
            this.dist = options.dist || 128;
            this._startTime = this.state.getTime();
            this.end();
        },

        tick: function(delta){
            var targetx = this.target.get('xform.tx');
            var targety = this.target.get('xform.ty');

            var tx = this.entity.get('xform.tx');
            var ty = this.entity.get('xform.ty');

            var deltax = targetx - tx;
            var deltay = targety - ty;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);

            if (Math.abs(deltax)<10||Math.abs(deltay)<10&&(dist<this.dist)){
                if (Math.abs(deltax) > Math.abs(deltay)){
                    if (deltax > 0){
                        this.entity.set('anim.anim', 'walk_right');
                        this.entity.set('xform.dir', 'right');
                    } else {
                        this.entity.set('anim.anim', 'walk_left');
                        this.entity.set('xform.dir', 'left');
                    }
                } else {
                    if (deltay < 0){
                        this.entity.set('anim.anim', 'walk_up');
                        this.entity.set('xform.dir', 'up');
                    } else {
                        this.entity.set('anim.anim', 'walk_down');
                        this.entity.set('xform.dir', 'down');
                    }
                }
                this.entity.fireEvent('equipment.use');
            }
        }
    })

    var AttackOnSightBehaviour =  Behaviour.Add('attackonsight', {
        onStart: function(options){
            options = options || {};
            this.target = this.state.getEntityByName(options.target);
            this.timeout = options.timeout || -1;
            this.dist = options.dist || 256;
            this._startTime = this.state.getTime();
            this.end();
        },

        tick: function(delta){
            var targetx = this.target.get('xform.tx');
            var targety = this.target.get('xform.ty');

            var tx = this.entity.get('xform.tx');
            var ty = this.entity.get('xform.ty');

            var deltax = targetx - tx;
            var deltay = targety - ty;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);

            if (dist<this.dist){
                this.setBehaviour('track+attack', {timeout: 1, target: this.target}).
                    then(this.parent.deferBehaviour('wait+attackonsight', {timeout: 1, target: this.target})).
                    then(this.parent.deferBehaviour('idle+attackonsight', {timeout: 1, target: this.target}));
            }
        }
    })
});