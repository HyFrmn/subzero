define(['sge'], function(sge){
	var ProjectileComponent = sge.Component.extend({
			init: function(entity, data){
				this._super(entity, data);
				this.data.sourceEntity = data.sourceEntity;
				/*
				this.data.damage = data.damage || 0;
				this.data.damageType = data.damageType || "BALLISTIC";
				this.data.firedBy = data.firedBy || null;
				*/
				//TODO: Replace with sprite.
				this.data.drawColor = data.drawColor || 'red';
			},
			register: function(state){
				this._super(state);
				this._killCallback = this.entity.addListener('contact.tile', this.kill.bind(this));
				this._contactCallback = this.entity.addListener('contact.start', this.onContact.bind(this))

				//DRAW CODE??? 
				this.scene = this.state.scene;
	            this.container = new CAAT.ActorContainer().setLocation(0,0);
	            var sizeX = 4;
	            var sizeY = 24;
	            if (Math.abs(this.entity.get('xform.vx')) > Math.abs(this.entity.get('xform.vy'))){
	                sizeX = 24;
	                sizeY = 4;
	            }
	            this.actor = new CAAT.Actor().setSize(sizeX,sizeY).setFillStyle(this.get('drawColor')).setLocation(0,0);
	            this.container.addChild(this.actor);
	            this.entity.get('xform.container').addChild(this.container);
			},
			deregister: function(state){
	            this.entity.get('xform.container').removeChild(this.container);
	            this._super(state);
	        },
			kill : function(){
				/*
				var impact = this.entity.state.factory('impact', {
					xform: {
						tx: this.entity.get('xform.tx'),
						ty: this.entity.get('xform.ty')
					}
				})
				this.entity.state.addEntity(impact)
				impact.set('anim.anim', 'hit');
				impact.set('anim.play', true);
				impact.addListener('anim.complete', function(){
					impact.fireEvent('entity.kill');
				})
				*/
				this.entity.fireEvent('entity.kill');
			},
			onContact : function(entity){
				if (entity==this.data.sourceEntity){
					return;
				}
				this.kill();
				/*
				if (entity!=this.data.firedBy){
					//TODO: Faction should not be part of ai. Maybe stats?
					if (entity.get('health') && entity.get('combat')) {
						if (entity.get('health.alignment')!=0 && entity.get('stats.faction')!=this.data.firedBy.get('stats.faction')){
							damageProfile = {
								damage : this.get('damage'),
								damageType : this.get('damageType'),
								entity: this.data.firedBy,
								vx: this.entity.get('xform.vx'),
								vy: this.entity.get('xform.vy'),
								tx: this.entity.get('xform.tx'),
								ty: this.entity.get('xform.ty'),
							}
							entity.fireEvent('entity.takeDamage', damageProfile);
						}
						this.kill();
					}
				};
				*/
			},
			isEnemy: function(){

			}
		});
		sge.Component.register('projectile', ProjectileComponent);
})