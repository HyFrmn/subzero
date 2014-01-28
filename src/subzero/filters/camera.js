define(function(){

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
/**
 *
 * This turns your displayObjects to black and white.
 * @class CameraFilter
 * @contructor
 */
PIXI.CameraFilter = function()
{
    PIXI.AbstractFilter.call( this );
 
    this.passes = [this];
 
    // set the uniforms
    this.uniforms = {
        fade_to_black: {type: '1f', value: 1},
    };
 
    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float fade_to_black;',
 
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0, 0, 0), fade_to_black);',
     //   '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};
 
PIXI.CameraFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.CameraFilter.prototype.constructor = PIXI.CameraFilter;
 
/**
The strength of the fade_to_black. 1 will make the object black and white, 0 will make the object its normal color
@property fade_to_black
*/
Object.defineProperty(PIXI.CameraFilter.prototype, 'fade_to_black', {
    get: function() {
        return this.uniforms.fade_to_black.value;
    },
    set: function(value) {
        this.uniforms.fade_to_black.value = value;
    }
});

})