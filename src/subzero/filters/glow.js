/**
		 * @author Mat Groves http://matgroves.com/ @Doormat23
		 */

		PIXI.GlowYFilter = function()
		{
		    PIXI.AbstractFilter.call( this );

		    this.passes = [this];

		    // set the uniforms
		    this.uniforms = {
		        blur: {type: '1f', value: 1/512},
		    };

		    this.fragmentSrc = [
		        'precision mediump float;',
		        'varying vec2 vTextureCoord;',
		        'varying vec4 vColor;',
		        'uniform float blur;',
		        'uniform sampler2D uSampler;',

		        'void main(void) {',
		        '   vec4 sum = vec4(0.0);',

		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 4.0*blur)) * 0.05;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 3.0*blur)) * 0.09;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - 2.0*blur)) * 0.12;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 2.0*blur)) * 0.12;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 3.0*blur)) * 0.09;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y + 4.0*blur)) * 0.05;',
		        '   sum += texture2D(uSampler, vTextureCoord);',
		        '   gl_FragColor = sum;',
		        '}'
		    ];
		};

		PIXI.GlowYFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
		PIXI.GlowYFilter.prototype.constructor = PIXI.GlowYFilter;

		Object.defineProperty(PIXI.GlowYFilter.prototype, 'blur', {
		    get: function() {
		        return this.uniforms.blur.value / (1/7000);
		    },
		    set: function(value) {
		        //this.padding = value;
		        this.uniforms.blur.value = (1/7000) * value;
		    }
		});


		/**
		 * @author Mat Groves http://matgroves.com/ @Doormat23
		 */

		PIXI.GlowXFilter = function()
		{
		    PIXI.AbstractFilter.call( this );

		    this.passes = [this];

		    // set the uniforms
		    this.uniforms = {
		        blur: {type: '1f', value: 1/512},
		    };

		    this.fragmentSrc = [
		        'precision mediump float;',
		        'varying vec2 vTextureCoord;',
		        'varying vec4 vColor;',
		        'uniform float blur;',
		        'uniform sampler2D uSampler;',

		        'void main(void) {',
		        '   vec4 sum = vec4(0.0);',

		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 4.0*blur, vTextureCoord.y)) * 0.05;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 3.0*blur, vTextureCoord.y)) * 0.09;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - 2.0*blur, vTextureCoord.y)) * 0.12;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 2.0*blur, vTextureCoord.y)) * 0.12;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 3.0*blur, vTextureCoord.y)) * 0.09;',
		        '   sum += texture2D(uSampler, vec2(vTextureCoord.x + 4.0*blur, vTextureCoord.y)) * 0.05;',
		        '   sum += texture2D(uSampler, vTextureCoord);',

		        '   gl_FragColor = sum;',
		        '}'
		    ];
		};

		PIXI.GlowXFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
		PIXI.GlowXFilter.prototype.constructor = PIXI.GlowXFilter;

		Object.defineProperty(PIXI.GlowXFilter.prototype, 'blur', {
		    get: function() {
		        return this.uniforms.blur.value / (1/7000);
		    },
		    set: function(value) {

		        this.dirty = true;
		        this.uniforms.blur.value = (1/7000) * value;
		    }
		});



		/**
		 * @author Mat Groves http://matgroves.com/ @Doormat23
		 */
		 
		/**
		 *
		 * The GlowFilter applies a Gaussian blur to an object.
		 * The strength of the blur can be set for x- and y-axis separately (always relative to the stage).
		 *
		 * @class GlowFilter
		 * @contructor
		 */
		PIXI.GlowFilter = function()
		{
		    this.blurXFilter = new PIXI.GlowXFilter();
		    this.blurYFilter = new PIXI.GlowYFilter();
		 
		    this.passes =[this.blurXFilter, this.blurYFilter];
		};
		 
		/**
		 * Sets the strength of both the blurX and blurY properties simultaneously
		 *
		 * @property blur
		 * @type Number the strength of the blur
		 * @default 2
		 */
		Object.defineProperty(PIXI.GlowFilter.prototype, 'blur', {
		    get: function() {
		        return this.blurXFilter.blur;
		    },
		    set: function(value) {
		        this.blurXFilter.blur = this.blurYFilter.blur = value;
		    }
		});
		 
		/**
		 * Sets the strength of the blurX property simultaneously
		 *
		 * @property blurX
		 * @type Number the strength of the blurX
		 * @default 2
		 */
		Object.defineProperty(PIXI.GlowFilter.prototype, 'blurX', {
		    get: function() {
		        return this.blurXFilter.blur;
		    },
		    set: function(value) {
		        this.blurXFilter.blur = value;
		    }
		});
		 
		/**
		 * Sets the strength of the blurX property simultaneously
		 *
		 * @property blurY
		 * @type Number the strength of the blurY
		 * @default 2
		 */
		Object.defineProperty(PIXI.GlowFilter.prototype, 'blurY', {
		    get: function() {
		        return this.blurYFilter.blur;
		    },
		    set: function(value) {
		        this.blurYFilter.blur = value;
		    }
		});