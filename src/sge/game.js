define([
		'./class'
	], 
	function(Class){

		var Game =  Class.extend({
			init: function(options){
				this.options = {
					width:  720,
					height: 405,
					fps:    60
				};
				var canvas = document.createElement('canvas'); 
				if (navigator.isCocoonJS || true){      
	                canvas.style.cssText="idtkscale:ScaleAspectFill;";
	                canvas.width= window.innerWidth;
	                canvas.height= window.innerHeight;
	                document.body.appendChild(canvas);
	            	this.width = canvas.width;
	            	this.height = canvas.height;
	            } else {
	            	canvas.width= this.options.width;
	                canvas.height= this.options.height;
	            	this.width = canvas.width;
	            	this.height = canvas.height;
	            }

				this.renderer = null;

				this._states = {};
				this._stateClassMap = {};
				this._currentState = null;
				this.renderer = PIXI.autoDetectRenderer(this.width, this.height, canvas);
			},
			start: function(){
				
				document.body.appendChild(this.renderer.view);
				this.run();
				requestAnimFrame(this.render.bind(this))
			},

			run: function(fps) {
				if (fps==undefined){
					fps = 30.0;
				};
				this._lastTick = Date.now();
				this._interval = setInterval(this.tickCallback.bind(this), 1000.0 / this.options.fps);
			},

			stop: function(){
				clearInterval(this._interval);
				this._interval = null;
			},

			tickCallback: function(){
				var now = Date.now();
				var delta = now - this._lastTick;
				this._lastTick = now;
				this.tick(delta/1000);
			},

			tick: function(delta){
				if (this._currentState){
					this._currentState.tick(delta);
				}
			},

			render: function(){
				requestAnimFrame(this.render.bind(this));
				if (this._currentState){
					this._currentState.render();
				}
			},


			setStateClass: function(name, klass){
				this._stateClassMap[name] = klass;
			},
			getState: function(name){
				return this._states[name];
			},

			createState: function(name){
				if (this._stateClassMap[name]===undefined){
					console.error('No state defined for ' + name);
				}
				var state = new this._stateClassMap[name](this);
				this._states[name] = state;
				return state;
			},

			changeState: function(name){
				if (this._currentState){
					this._currentState.endState();
				}
				this._currentState = this.getState(name);
				this._currentState.startState();
			},


			resizeCallback: function(){},
			loseFocusCallback: function(){},
			endFocusCallback: function(){}

			
		});

		return Game;
	}
)