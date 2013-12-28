define(['sge', '../behaviour'], function(sge, Behaviour){
    var proxyTarget = function(tx, ty){
        return new (function(){
            this.get = function(attr){
                if (attr=='xform.tx'){
                    return tx
                }
                if (attr=='xform.ty'){
                    return ty;
                }
            }
        })
    }


    var IdleBehaviour = Behaviour.Add('idle', {
        onStart: function(){
            this.entity.set('movement.v',0,0);
            this._timeout=0;
            this._wanderTarget = 0;
            this.entity.addListener('noise.stop', function(){
                console.log('noise stop')
                this.setBehaviour('idle');
            }.bind(this))
            this.entity.addListener('noise.hear', function(tx, ty, volume, type, strength){
                target = proxyTarget(tx, ty);
                switch (type){
                    case 0:
                    default:
                        this.setBehaviour('goto', {target: proxyTarget(tx, ty)}).then(this.deferBehaviour('wait'));
                        break;

                    case 1:
                        this.setBehaviour('flee', {target: proxyTarget(tx, ty)}).then(this.deferBehaviour('wait'));
                        break;
                }
                
            }.bind(this))    
        },
        tick: function(){
            if (this._wanderTarget){

            } else {
                var region = this.entity.get('ai.region');
                if (this._timeout<=0){
                    this._timeout = 30 + (Math.random()*30);
                    var vx = 0;
                    var vy = 0;
                    if (Math.random()>0.75){    
                        vx = ((Math.random() * 2) - 1);
                        vy = ((Math.random() * 2) - 1);
                        if (region){
                            var tx = this.entity.get('xform.tx');
                            var ty = this.entity.get('xform.ty');
                            if (region.test(tx,ty,4)){ 
                                while (!region.test(tx+vx*32,ty+vy*32,4)){
                                    vx = ((Math.random() * 2) - 1);
                                    vy = ((Math.random() * 2) - 1);
                                }
                            }
                        }
                    }
                    this.entity.set('movement.v', vx, vy);
                } else {
                    this._timeout--;
                    if (region){
                        var tx = this.entity.get('xform.tx');
                        var ty = this.entity.get('xform.ty');
                        if (!region.test(tx,ty)){
                            var rx = region.get('xform.tx');
                            var ry = region.get('xform.ty');
                            var trace = this.state.map.traceStatic(tx,ty,rx,ry)
                            if (trace[2]){
                                this.setBehaviour('goto', { target: region }).
                                    then(this.deferBehaviour('idle'),
                                        this.deferBehaviour('wait',{timeout:20}))
                            } else {
                                var dx = tx - rx;
                            var dy = ty - ry;
                            var dist = Math.sqrt(dx*dx+dy*dy);
                            this.entity.set('movement.v', -dx/dist, -dy/dist);
                            }
                            
                        }
                    }
                }
            }
        }
    });
    
    return IdleBehaviour;
});