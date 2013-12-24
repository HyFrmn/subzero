define(['sge','../behaviour'],function(sge, Behaviour){
    var TrackBehaviour = Behaviour.Add('track', {
        onStart: function(options){
            options = options || {};
            this.target = options.target;
            this.timeout = options.timeout || -1;
            this.dist = options.dist || 256;
            this._timeout = -1;
            this._tick = 0;
            this._pathNavigation = false;
            this.entity.fireEvent('emote.msg', 'Tracking')

            var tx = this.entity.get('xform.tx');
            var ty = this.entity.get('xform.ty');

            var targetx = this.target.get('xform.tx');
            var targety = this.target.get('xform.ty');
            var trace = this.state.map.traceStatic(tx, ty, targetx, targety);
            
            this._hasSight = !trace[2];
            if (!this._hasSight){
                this.startNavigation();
            }
        },

        startNavigation: function(){
            var tx1 = this.entity.get('xform.tx');
            var ty1 = this.entity.get('xform.ty');
            var tileX = Math.floor(tx1/32);
            var tileY = Math.floor(ty1/32);
            var tx2 = this.target.get('xform.tx');
            var ty2 = this.target.get('xform.ty');
            var endTileX = Math.floor(tx2/32);
            var endTileY = Math.floor(ty2/32);
            this._pathPoints = this.state.map.getPath(tileX, tileY, endTileX, endTileY);
            if (this._pathPoints){
                this._pathNavigation = true;
                this._targetX = tx2;
                this._targetY = ty2;
            }
            if (this._pathActor){
                this.entity.state.map.canopyDynamic.removeChild(this._pathActor);
            }

            if (this._pathPoints.length>0){
                this._pathActor = new CAAT.PathActor();
                this._path = new CAAT.Path();
                this._path.beginPath(this._pathPoints[0][0], this._pathPoints[0][1]);
                for (var i=1; i<this._pathPoints.length;i++){
                    this._path.addLineTo(this._pathPoints[i][0], this._pathPoints[i][1], 'red');
                }
                this._path.endPath();
                this._pathActor.setBounds(0,0,800,800).create();
                this._pathActor.setPath(this._path);
                this._pathActor.setStrokeStyle('2px solid red')
                this.entity.state.map.canopyDynamic.addChild(this._pathActor);
            }
        },

        tick: function(delta){
            this._tick++;
            if (this._tick%5!=0){
                return;
            }
            var tx = this.entity.get('xform.tx');
            var ty = this.entity.get('xform.ty');

            var targetx = this.target.get('xform.tx');
            var targety = this.target.get('xform.ty');

            var deltax = targetx - tx;
            var deltay = targety - ty;
            var dist = Math.sqrt(deltax * deltax + deltay * deltay);
            var nx = 0;
            var ny = 0;
            var trace = this.state.map.traceStatic(tx, ty, targetx, targety);
            if (trace[2]){
                if (this._hasSight){
                    this._hasSight = false;
                    this.entity.fireEvent('emote.msg', "Lost him");
                    this.startNavigation();
                    this._timeout = this.state.getTime();
                }
            } else {
                if (!this._hasSight){
                    this._hasSight = true;
                    this._pathNavigation = false;
                    this._pathPoints = [];
                    this._timeout = -1;
                    this.entity.fireEvent('emote.msg', "Gotcha");
                }
                if (this._timeout>0){
                    if (this.state.getTime()-this._timeout>this.timeout){
                        //this.end();
                    }
                }
                nx = deltax/dist;
                ny = deltay/dist;
            }

            if (this._pathNavigation){
                var targetOffsetX = Math.abs(this._targetX - targetx);
                var targetOffsetY = Math.abs(this._targetY - targety);
                if (targetOffsetX>64||targetOffsetY>16){
                    this.startNavigation();
                }


                if (this._pathPoints.length<=0){
                    this._pathNavigation = false;
                } else {
                    var goalX = this._pathPoints[0][0];
                    var goalY = this._pathPoints[0][1];
                    var dx = goalX - tx;
                    var dy = goalY - ty;
                    dist = Math.sqrt((dx*dx)+(dy*dy));
                    if (dist<6){
                        this._pathPoints.shift();
                    }
                    nx = dx / dist;
                    ny = dy / dist;
                }
            } 
            if (dist<64){
	            //nx = ny = 0;
    		}
            this.entity.set('movement.v', nx, ny);
        }
    })
    return TrackBehaviour;
})