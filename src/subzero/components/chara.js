define([
	'sge',
	'../component'
	], function(sge, Component){
		var CharaComponent = Component.add('chara', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('chara.dir', 'down');
				this.set('sprite.frame', 16);
				this.set('movement.vx', 0);
				this.set('movement.vy', 0);
				this._anim = null;
				this._animTimeout = 0;
				this._walkcycleFrames = {
	                "walk_down" : [19,20,21,22,23,24,25,26],
	                "walk_up" : [1,2,3,4,5,6,7,8],
	                "walk_left" : [10,11,12,13,14,15,16,17],
	                "walk_right" : [28,29,30,31,32,33,34,35],
	                "stand_down" : [18],
	                "stand_up" : [0],
	                "stand_right" : [27],
	                "stand_left" : [9]
	            }
	            this.setAnim('stand_' + this.get('chara.dir'));
			},
			setAnim: function(anim){
				this.entity.trigger('anim.set', anim);
			},
			setDirection: function(dir){
				if (this.get('chara.dir')!=dir){
					this.set('chara.dir', dir)
				}
			},
			tick: function(delta){
				if (this.get('movement.vx')<0){
					this.setDirection('left');
				}

				if (this.get('movement.vx')>0){
					this.setDirection('right');
				}

				if (this.get('movement.vy')<0){
					this.setDirection('up');
				}

				if (this.get('movement.vy')>0){
					this.setDirection('down');
				}

				if (this.get('movement.vx')!=0||this.get('movement.vy')!=0){
					this.setAnim('walk_' + this.get('chara.dir'));
				} else {
					this.setAnim('stand_' + this.get('chara.dir'));
				}
			}
		});
	}
)