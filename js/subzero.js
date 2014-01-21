/**
 * @license
 * pixi.js - v1.4.1
 * Copyright (c) 2012, Mat Groves
 * http://goodboydigital.com/
 *
 * Compiled: 2014-01-05
 *
 * pixi.js is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license.php
 */
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

(function(){

    var root = this;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * @module PIXI
 */
var PIXI = PIXI || {};

PIXI.WEBGL_RENDERER = 0;
PIXI.CANVAS_RENDERER = 1;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The Point object represents a location in a two-dimensional coordinate system, where x represents the horizontal axis and y represents the vertical axis.
 *
 * @class Point
 * @constructor
 * @param x {Number} position of the point
 * @param y {Number} position of the point
 */
PIXI.Point = function(x, y)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;
};

/**
 * Creates a clone of this point
 *
 * @method clone
 * @return {Point} a copy of the point
 */
PIXI.Point.prototype.clone = function()
{
    return new PIXI.Point(this.x, this.y);
};

// constructor
PIXI.Point.prototype.constructor = PIXI.Point;


/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * the Rectangle object is an area defined by its position, as indicated by its top-left corner point (x, y) and by its width and its height.
 *
 * @class Rectangle
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the rectangle
 * @param y {Number} The Y coord of the upper-left corner of the rectangle
 * @param width {Number} The overall width of this rectangle
 * @param height {Number} The overall height of this rectangle
 */
PIXI.Rectangle = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;

    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
};

/**
 * Creates a clone of this Rectangle
 *
 * @method clone
 * @return {Rectangle} a copy of the rectangle
 */
PIXI.Rectangle.prototype.clone = function()
{
    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
};

/**
 * Checks if the x, and y coords passed to this function are contained within this Rectangle
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this Rectangle
 */
PIXI.Rectangle.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    var x1 = this.x;
    if(x >= x1 && x <= x1 + this.width)
    {
        var y1 = this.y;

        if(y >= y1 && y <= y1 + this.height)
        {
            return true;
        }
    }

    return false;
};

// constructor
PIXI.Rectangle.prototype.constructor = PIXI.Rectangle;


/**
 * @author Adrien Brault <adrien.brault@gmail.com>
 */

/**
 * @class Polygon
 * @constructor
 * @param points* {Array<Point>|Array<Number>|Point...|Number...} This can be an array of Points that form the polygon,
 *      a flat array of numbers that will be interpreted as [x,y, x,y, ...], or the arguments passed can be
 *      all the points of the polygon e.g. `new PIXI.Polygon(new PIXI.Point(), new PIXI.Point(), ...)`, or the
 *      arguments passed can be flat x,y values e.g. `new PIXI.Polygon(x,y, x,y, x,y, ...)` where `x` and `y` are
 *      Numbers.
 */
PIXI.Polygon = function(points)
{
    //if points isn't an array, use arguments as the array
    if(!(points instanceof Array))
        points = Array.prototype.slice.call(arguments);

    //if this is a flat array of numbers, convert it to points
    if(typeof points[0] === 'number') {
        var p = [];
        for(var i = 0, il = points.length; i < il; i+=2) {
            p.push(
                new PIXI.Point(points[i], points[i + 1])
            );
        }

        points = p;
    }

    this.points = points;
};

/**
 * Creates a clone of this polygon
 *
 * @method clone
 * @return {Polygon} a copy of the polygon
 */
PIXI.Polygon.prototype.clone = function()
{
    var points = [];
    for (var i=0; i<this.points.length; i++) {
        points.push(this.points[i].clone());
    }

    return new PIXI.Polygon(points);
};

/**
 * Checks if the x, and y coords passed to this function are contained within this polygon
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this polygon
 */
PIXI.Polygon.prototype.contains = function(x, y)
{
    var inside = false;

    // use some raycasting to test hits
    // https://github.com/substack/point-in-polygon/blob/master/index.js
    for(var i = 0, j = this.points.length - 1; i < this.points.length; j = i++) {
        var xi = this.points[i].x, yi = this.points[i].y,
            xj = this.points[j].x, yj = this.points[j].y,
            intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

        if(intersect) inside = !inside;
    }

    return inside;
};

// constructor
PIXI.Polygon.prototype.constructor = PIXI.Polygon;

/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Circle object can be used to specify a hit area for displayobjects
 *
 * @class Circle
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the framing rectangle of this circle
 * @param y {Number} The Y coord of the upper-left corner of the framing rectangle of this circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Circle = function(x, y, radius)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property radius
     * @type Number
     * @default 0
     */
    this.radius = radius || 0;
};

/**
 * Creates a clone of this Circle instance
 *
 * @method clone
 * @return {Circle} a copy of the polygon
 */
PIXI.Circle.prototype.clone = function()
{
    return new PIXI.Circle(this.x, this.y, this.radius);
};

/**
 * Checks if the x, and y coords passed to this function are contained within this circle
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this polygon
 */
PIXI.Circle.prototype.contains = function(x, y)
{
    if(this.radius <= 0)
        return false;

    var dx = (this.x - x),
        dy = (this.y - y),
        r2 = this.radius * this.radius;

    dx *= dx;
    dy *= dy;

    return (dx + dy <= r2);
};

// constructor
PIXI.Circle.prototype.constructor = PIXI.Circle;


/**
 * @author Chad Engler <chad@pantherdev.com>
 */

/**
 * The Ellipse object can be used to specify a hit area for displayobjects
 *
 * @class Ellipse
 * @constructor
 * @param x {Number} The X coord of the upper-left corner of the framing rectangle of this ellipse
 * @param y {Number} The Y coord of the upper-left corner of the framing rectangle of this ellipse
 * @param width {Number} The overall width of this ellipse
 * @param height {Number} The overall height of this ellipse
 */
PIXI.Ellipse = function(x, y, width, height)
{
    /**
     * @property x
     * @type Number
     * @default 0
     */
    this.x = x || 0;

    /**
     * @property y
     * @type Number
     * @default 0
     */
    this.y = y || 0;

    /**
     * @property width
     * @type Number
     * @default 0
     */
    this.width = width || 0;

    /**
     * @property height
     * @type Number
     * @default 0
     */
    this.height = height || 0;
};

/**
 * Creates a clone of this Ellipse instance
 *
 * @method clone
 * @return {Ellipse} a copy of the ellipse
 */
PIXI.Ellipse.prototype.clone = function()
{
    return new PIXI.Ellipse(this.x, this.y, this.width, this.height);
};

/**
 * Checks if the x, and y coords passed to this function are contained within this ellipse
 *
 * @method contains
 * @param x {Number} The X coord of the point to test
 * @param y {Number} The Y coord of the point to test
 * @return {Boolean} if the x/y coords are within this ellipse
 */
PIXI.Ellipse.prototype.contains = function(x, y)
{
    if(this.width <= 0 || this.height <= 0)
        return false;

    //normalize the coords to an ellipse with center 0,0
    //and a radius of 0.5
    var normx = ((x - this.x) / this.width) - 0.5,
        normy = ((y - this.y) / this.height) - 0.5;

    normx *= normx;
    normy *= normy;

    return (normx + normy < 0.25);
};

PIXI.Ellipse.prototype.getBounds = function()
{
    return new PIXI.Rectangle(this.x, this.y, this.width, this.height);
};

// constructor
PIXI.Ellipse.prototype.constructor = PIXI.Ellipse;



/*
 * A lighter version of the rad gl-matrix created by Brandon Jones, Colin MacKenzie IV
 * you both rock!
 */

function determineMatrixArrayType() {
    PIXI.Matrix = (typeof Float32Array !== 'undefined') ? Float32Array : Array;
    return PIXI.Matrix;
}

determineMatrixArrayType();

PIXI.mat3 = {};

PIXI.mat3.create = function()
{
    var matrix = new PIXI.Matrix(9);

    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 1;
    matrix[5] = 0;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 1;

    return matrix;
};


PIXI.mat3.identity = function(matrix)
{
    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 1;
    matrix[5] = 0;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 1;

    return matrix;
};


PIXI.mat4 = {};

PIXI.mat4.create = function()
{
    var matrix = new PIXI.Matrix(16);

    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = 1;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;

    return matrix;
};

PIXI.mat3.multiply = function (mat, mat2, dest)
{
    if (!dest) { dest = mat; }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[0], a01 = mat[1], a02 = mat[2],
        a10 = mat[3], a11 = mat[4], a12 = mat[5],
        a20 = mat[6], a21 = mat[7], a22 = mat[8],

        b00 = mat2[0], b01 = mat2[1], b02 = mat2[2],
        b10 = mat2[3], b11 = mat2[4], b12 = mat2[5],
        b20 = mat2[6], b21 = mat2[7], b22 = mat2[8];

    dest[0] = b00 * a00 + b01 * a10 + b02 * a20;
    dest[1] = b00 * a01 + b01 * a11 + b02 * a21;
    dest[2] = b00 * a02 + b01 * a12 + b02 * a22;

    dest[3] = b10 * a00 + b11 * a10 + b12 * a20;
    dest[4] = b10 * a01 + b11 * a11 + b12 * a21;
    dest[5] = b10 * a02 + b11 * a12 + b12 * a22;

    dest[6] = b20 * a00 + b21 * a10 + b22 * a20;
    dest[7] = b20 * a01 + b21 * a11 + b22 * a21;
    dest[8] = b20 * a02 + b21 * a12 + b22 * a22;

    return dest;
};

PIXI.mat3.clone = function(mat)
{
    var matrix = new PIXI.Matrix(9);

    matrix[0] = mat[0];
    matrix[1] = mat[1];
    matrix[2] = mat[2];
    matrix[3] = mat[3];
    matrix[4] = mat[4];
    matrix[5] = mat[5];
    matrix[6] = mat[6];
    matrix[7] = mat[7];
    matrix[8] = mat[8];

    return matrix;
};

PIXI.mat3.transpose = function (mat, dest)
{
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest) {
        var a01 = mat[1], a02 = mat[2],
            a12 = mat[5];

        mat[1] = mat[3];
        mat[2] = mat[6];
        mat[3] = a01;
        mat[5] = mat[7];
        mat[6] = a02;
        mat[7] = a12;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[3];
    dest[2] = mat[6];
    dest[3] = mat[1];
    dest[4] = mat[4];
    dest[5] = mat[7];
    dest[6] = mat[2];
    dest[7] = mat[5];
    dest[8] = mat[8];
    return dest;
};

PIXI.mat3.toMat4 = function (mat, dest)
{
    if (!dest) { dest = PIXI.mat4.create(); }

    dest[15] = 1;
    dest[14] = 0;
    dest[13] = 0;
    dest[12] = 0;

    dest[11] = 0;
    dest[10] = mat[8];
    dest[9] = mat[7];
    dest[8] = mat[6];

    dest[7] = 0;
    dest[6] = mat[5];
    dest[5] = mat[4];
    dest[4] = mat[3];

    dest[3] = 0;
    dest[2] = mat[2];
    dest[1] = mat[1];
    dest[0] = mat[0];

    return dest;
};


/////


PIXI.mat4.create = function()
{
    var matrix = new PIXI.Matrix(16);

    matrix[0] = 1;
    matrix[1] = 0;
    matrix[2] = 0;
    matrix[3] = 0;
    matrix[4] = 0;
    matrix[5] = 1;
    matrix[6] = 0;
    matrix[7] = 0;
    matrix[8] = 0;
    matrix[9] = 0;
    matrix[10] = 1;
    matrix[11] = 0;
    matrix[12] = 0;
    matrix[13] = 0;
    matrix[14] = 0;
    matrix[15] = 1;

    return matrix;
};

PIXI.mat4.transpose = function (mat, dest)
{
    // If we are transposing ourselves we can skip a few steps but have to cache some values
    if (!dest || mat === dest)
    {
        var a01 = mat[1], a02 = mat[2], a03 = mat[3],
            a12 = mat[6], a13 = mat[7],
            a23 = mat[11];

        mat[1] = mat[4];
        mat[2] = mat[8];
        mat[3] = mat[12];
        mat[4] = a01;
        mat[6] = mat[9];
        mat[7] = mat[13];
        mat[8] = a02;
        mat[9] = a12;
        mat[11] = mat[14];
        mat[12] = a03;
        mat[13] = a13;
        mat[14] = a23;
        return mat;
    }

    dest[0] = mat[0];
    dest[1] = mat[4];
    dest[2] = mat[8];
    dest[3] = mat[12];
    dest[4] = mat[1];
    dest[5] = mat[5];
    dest[6] = mat[9];
    dest[7] = mat[13];
    dest[8] = mat[2];
    dest[9] = mat[6];
    dest[10] = mat[10];
    dest[11] = mat[14];
    dest[12] = mat[3];
    dest[13] = mat[7];
    dest[14] = mat[11];
    dest[15] = mat[15];
    return dest;
};

PIXI.mat4.multiply = function (mat, mat2, dest)
{
    if (!dest) { dest = mat; }

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = mat[ 0], a01 = mat[ 1], a02 = mat[ 2], a03 = mat[3];
    var a10 = mat[ 4], a11 = mat[ 5], a12 = mat[ 6], a13 = mat[7];
    var a20 = mat[ 8], a21 = mat[ 9], a22 = mat[10], a23 = mat[11];
    var a30 = mat[12], a31 = mat[13], a32 = mat[14], a33 = mat[15];

    // Cache only the current line of the second matrix
    var b0  = mat2[0], b1 = mat2[1], b2 = mat2[2], b3 = mat2[3];
    dest[0] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[1] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[2] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[3] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[4];
    b1 = mat2[5];
    b2 = mat2[6];
    b3 = mat2[7];
    dest[4] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[5] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[6] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[7] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[8];
    b1 = mat2[9];
    b2 = mat2[10];
    b3 = mat2[11];
    dest[8] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[9] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[10] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[11] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    b0 = mat2[12];
    b1 = mat2[13];
    b2 = mat2[14];
    b3 = mat2[15];
    dest[12] = b0*a00 + b1*a10 + b2*a20 + b3*a30;
    dest[13] = b0*a01 + b1*a11 + b2*a21 + b3*a31;
    dest[14] = b0*a02 + b1*a12 + b2*a22 + b3*a32;
    dest[15] = b0*a03 + b1*a13 + b2*a23 + b3*a33;

    return dest;
};

PIXI.identityMatrix = PIXI.mat3.create();

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The base class for all objects that are rendered on the screen.
 *
 * @class DisplayObject
 * @constructor
 */
PIXI.DisplayObject = function()
{
    this.last = this;
    this.first = this;
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     *
     * @property position
     * @type Point
     */
    this.position = new PIXI.Point();

    /**
     * The scale factor of the object.
     *
     * @property scale
     * @type Point
     */
    this.scale = new PIXI.Point(1,1);//{x:1, y:1};

    /**
     * The pivot point of the displayObject that it rotates around
     *
     * @property pivot
     * @type Point
     */
    this.pivot = new PIXI.Point(0,0);

    /**
     * The rotation of the object in radians.
     *
     * @property rotation
     * @type Number
     */
    this.rotation = 0;

    /**
     * The opacity of the object.
     *
     * @property alpha
     * @type Number
     */
    this.alpha = 1;

    /**
     * The visibility of the object.
     *
     * @property visible
     * @type Boolean
     */
    this.visible = true;

    /**
     * This is the defined area that will pick up mouse / touch events. It is null by default.
     * Setting it is a neat way of optimising the hitTest function that the interactionManager will use (as it will not need to hit test all the children)
     *
     * @property hitArea
     * @type Rectangle|Circle|Ellipse|Polygon
     */
    this.hitArea = null;

    /**
     * This is used to indicate if the displayObject should display a mouse hand cursor on rollover
     *
     * @property buttonMode
     * @type Boolean
     */
    this.buttonMode = false;

    /**
     * Can this object be rendered
     *
     * @property renderable
     * @type Boolean
     */
    this.renderable = false;

    /**
     * [read-only] The display object container that contains this display object.
     *
     * @property parent
     * @type DisplayObjectContainer
     * @readOnly
     */
    this.parent = null;

    /**
     * [read-only] The stage the display object is connected to, or undefined if it is not connected to the stage.
     *
     * @property stage
     * @type Stage
     * @readOnly
     */
    this.stage = null;

    /**
     * [read-only] The multiplied alpha of the displayobject
     *
     * @property worldAlpha
     * @type Number
     * @readOnly
     */
    this.worldAlpha = 1;

    /**
     * [read-only] Whether or not the object is interactive, do not toggle directly! use the `interactive` property
     *
     * @property _interactive
     * @type Boolean
     * @readOnly
     * @private
     */
    this._interactive = false;

    /**
     * This is the curser that will be used when the mouse is over this object. To enable this the element must have interaction = true and buttonMode = true
     * 
     * @property defaultCursor
     * @type String
     *
    */
    this.defaultCursor = 'pointer';

    /**
     * [read-only] Current transform of the object based on world (parent) factors
     *
     * @property worldTransform
     * @type Mat3
     * @readOnly
     * @private
     */
    this.worldTransform = PIXI.mat3.create(); //mat3.identity();

    /**
     * [read-only] Current transform of the object locally
     *
     * @property localTransform
     * @type Mat3
     * @readOnly
     * @private
     */
    this.localTransform = PIXI.mat3.create(); //mat3.identity();

    /**
     * [NYI] Unkown
     *
     * @property color
     * @type Array<>
     * @private
     */
    this.color = [];

    /**
     * [NYI] Holds whether or not this object is dynamic, for rendering optimization
     *
     * @property dynamic
     * @type Boolean
     * @private
     */
    this.dynamic = true;

    // chach that puppy!
    this._sr = 0;
    this._cr = 1;


    this.filterArea = new PIXI.Rectangle(0,0,1,1);


    /**
    *
    *      
    *
    */
    this._bounds = new PIXI.Rectangle(0, 0, 1, 1);
    this._currentBounds = null;
    this._mask = null;

    /*
     * MOUSE Callbacks
     */

    /**
     * A callback that is used when the users clicks on the displayObject with their mouse
     * @method click
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user clicks the mouse down over the sprite
     * @method mousedown
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the mouse that was over the displayObject
     * for this callback to be fired the mouse must have been pressed down over the displayObject
     * @method mouseup
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the mouse that was over the displayObject but is no longer over the displayObject
     * for this callback to be fired, The touch must have started over the displayObject
     * @method mouseupoutside
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the users mouse rolls over the displayObject
     * @method mouseover
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the users mouse leaves the displayObject
     * @method mouseout
     * @param interactionData {InteractionData}
     */


    /*
     * TOUCH Callbacks
     */

    /**
     * A callback that is used when the users taps on the sprite with their finger
     * basically a touch version of click
     * @method tap
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user touch's over the displayObject
     * @method touchstart
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases a touch over the displayObject
     * @method touchend
     * @param interactionData {InteractionData}
     */

    /**
     * A callback that is used when the user releases the touch that was over the displayObject
     * for this callback to be fired, The touch must have started over the sprite
     * @method touchendoutside
     * @param interactionData {InteractionData}
     */
};

// constructor
PIXI.DisplayObject.prototype.constructor = PIXI.DisplayObject;

/**
 * [Deprecated] Indicates if the sprite will have touch and mouse interactivity. It is false by default
 * Instead of using this function you can now simply set the interactive property to true or false
 *
 * @method setInteractive
 * @param interactive {Boolean}
 * @deprecated Simply set the `interactive` property directly
 */
PIXI.DisplayObject.prototype.setInteractive = function(interactive)
{
    this.interactive = interactive;
};

/**
 * Indicates if the sprite will have touch and mouse interactivity. It is false by default
 *
 * @property interactive
 * @type Boolean
 * @default false
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'interactive', {
    get: function() {
        return this._interactive;
    },
    set: function(value) {
        this._interactive = value;

        // TODO more to be done here..
        // need to sort out a re-crawl!
        if(this.stage)this.stage.dirty = true;
    }
});

/**
 * [read-only] Indicates if the sprite is globaly visible.
 *
 * @property worldVisible
 * @type Boolean
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'worldVisible', {
    get: function() {
        var item = this;

        do
        {
            if(!item.visible)return false;
            item = item.parent;
        }
        while(item && item.parent);

        return true;
    }
});

/**
 * Sets a mask for the displayObject. A mask is an object that limits the visibility of an object to the shape of the mask applied to it.
 * In PIXI a regular mask must be a PIXI.Ggraphics object. This allows for much faster masking in canvas as it utilises shape clipping.
 * To remove a mask, set this property to null.
 *
 * @property mask
 * @type Graphics
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'mask', {
    get: function() {
        return this._mask;
    },
    set: function(value) {

        if(this._mask)this._mask.isMask = false;
        this._mask = value;
        if(this._mask)this._mask.isMask = true;
    }
});

/**
 * Sets the filters for the displayObject.
 * * IMPORTANT: This is a webGL only feature and will be ignored by the canvas renderer.
 * To remove filters simply set this property to 'null'
 * @property filters
 * @type Array An array of filters
 */
Object.defineProperty(PIXI.DisplayObject.prototype, 'filters', {
    get: function() {
        return this._filters;
    },
    set: function(value) {

        if(value)
        {
            // now put all the passes in one place..
            var passes = [];
            for (var i = 0; i < value.length; i++)
            {
                var filterPasses = value[i].passes;
                for (var j = 0; j < filterPasses.length; j++)
                {
                    passes.push(filterPasses[j]);
                }
            }

            // TODO change this as it is legacy
            this._filterBlock = {target:this, filterPasses:passes};
        }

        this._filters = value;
    }
});

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObject.prototype.updateTransform = function()
{
    if (this.parent==null){
        console.log(this);
        console.trace();
        return
    }

    // TODO OPTIMIZE THIS!! with dirty
    if(this.rotation !== this.rotationCache)
    {
        this.rotationCache = this.rotation;
        this._sr =  Math.sin(this.rotation);
        this._cr =  Math.cos(this.rotation);
    }

    var localTransform = this.localTransform;
    var parentTransform = this.parent.worldTransform;
    var worldTransform = this.worldTransform;
    //console.log(localTransform)
    localTransform[0] = this._cr * this.scale.x;
    localTransform[1] = -this._sr * this.scale.y;
    localTransform[3] = this._sr * this.scale.x;
    localTransform[4] = this._cr * this.scale.y;

    // TODO --> do we even need a local matrix???

    var px = this.pivot.x;
    var py = this.pivot.y;

    // Cache the matrix values (makes for huge speed increases!)
    var a00 = localTransform[0], a01 = localTransform[1], a02 = this.position.x - localTransform[0] * px - py * localTransform[1],
        a10 = localTransform[3], a11 = localTransform[4], a12 = this.position.y - localTransform[4] * py - px * localTransform[3],

        b00 = parentTransform[0], b01 = parentTransform[1], b02 = parentTransform[2],
        b10 = parentTransform[3], b11 = parentTransform[4], b12 = parentTransform[5];

    localTransform[2] = a02;
    localTransform[5] = a12;

    worldTransform[0] = b00 * a00 + b01 * a10;
    worldTransform[1] = b00 * a01 + b01 * a11;
    worldTransform[2] = b00 * a02 + b01 * a12 + b02;

    worldTransform[3] = b10 * a00 + b11 * a10;
    worldTransform[4] = b10 * a01 + b11 * a11;
    worldTransform[5] = b10 * a02 + b11 * a12 + b12;

    // because we are using affine transformation, we can optimise the matrix concatenation process.. wooo!
    // mat3.multiply(this.localTransform, this.parent.worldTransform, this.worldTransform);
    this.worldAlpha = this.alpha * this.parent.worldAlpha;

    this.vcount = PIXI.visibleCount;
};

PIXI.DisplayObject.prototype.getBounds = function()
{
    return PIXI.EmptyRectangle;
};

PIXI.DisplayObject.prototype.getLocalBounds = function()
{
    var matrixCache = this.worldTransform;

    this.worldTransform = PIXI.identityMatrix;

    this.updateTransform();

    var bounds = this.getBounds();

    this.worldTransform = matrixCache;

    return bounds;
};


PIXI.DisplayObject.prototype._renderWebGL = function(renderSession)
{
    // OVERWRITE;
    // this line is just here to pass jshinting :)
    renderSession = renderSession;
};

PIXI.DisplayObject.prototype._renderCanvas = function(renderSession)
{
    // OVERWRITE;
    // this line is just here to pass jshinting :)
    renderSession = renderSession;
};

PIXI.EmptyRectangle = new PIXI.Rectangle(0,0,0,0);

PIXI.visibleCount = 0;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A DisplayObjectContainer represents a collection of display objects.
 * It is the base class of all display objects that act as a container for other objects.
 *
 * @class DisplayObjectContainer
 * @extends DisplayObject
 * @constructor
 */
PIXI.DisplayObjectContainer = function()
{
    PIXI.DisplayObject.call( this );

    /**
     * [read-only] The of children of this container.
     *
     * @property children
     * @type Array<DisplayObject>
     * @readOnly
     */
    this.children = [];
};

// constructor
PIXI.DisplayObjectContainer.prototype = Object.create( PIXI.DisplayObject.prototype );
PIXI.DisplayObjectContainer.prototype.constructor = PIXI.DisplayObjectContainer;

/**
 * The width of the displayObjectContainer, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */

/*
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'width', {
    get: function() {
        return this.scale.x * this.getLocalBounds().width;
    },
    set: function(value) {
        this.scale.x = value / (this.getLocalBounds().width/this.scale.x);
        this._width = value;
    }
});
*/

/**
 * The height of the displayObjectContainer, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */

 /*
Object.defineProperty(PIXI.DisplayObjectContainer.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.getLocalBounds().height;
    },
    set: function(value) {
        this.scale.y = value / (this.getLocalBounds().height/this.scale.y);
        this._height = value;
    }
});
*/

/**
 * Adds a child to the container.
 *
 * @method addChild
 * @param child {DisplayObject} The DisplayObject to add to the container
 */
PIXI.DisplayObjectContainer.prototype.addChild = function(child)
{
    if(child.parent && child.parent !== this)
    {
        //// COULD BE THIS???
        child.parent.removeChild(child);
        //  return;
    }

    child.parent = this;

    this.children.push(child);

    // update the stage refference..

    if(this.stage)this.setStageReference(this.stage);

};

/**
 * Adds a child to the container at a specified index. If the index is out of bounds an error will be thrown
 *
 * @method addChildAt
 * @param child {DisplayObject} The child to add
 * @param index {Number} The index to place the child in
 */
PIXI.DisplayObjectContainer.prototype.addChildAt = function(child, index)
{
    if(index >= 0 && index <= this.children.length)
    {
        if(child.parent)
        {
            child.parent.removeChild(child);
        }

        child.parent = this;

        this.children.splice(index, 0, child);

        if(this.stage)this.setStageReference(this.stage);
    }
    else
    {
        throw new Error(child + ' The index '+ index +' supplied is out of bounds ' + this.children.length);
    }
};

/**
 * [NYI] Swaps the depth of 2 displayObjects
 *
 * @method swapChildren
 * @param child {DisplayObject}
 * @param child2 {DisplayObject}
 * @private
 */
PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
    if(child === child2) {
        return;
    }

    var index1 = this.children.indexOf(child);
    var index2 = this.children.indexOf(child2);

    if(index1 < 0 || index2 < 0) {
        throw new Error('swapChildren: Both the supplied DisplayObjects must be a child of the caller.');
    }

    this.children[index1] = child2;
    this.children[index2] = child;
    
};

/**
 * Returns the Child at the specified index
 *
 * @method getChildAt
 * @param index {Number} The index to get the child from
 */
PIXI.DisplayObjectContainer.prototype.getChildAt = function(index)
{
    if(index >= 0 && index < this.children.length)
    {
        return this.children[index];
    }
    else
    {
        throw new Error('The supplied DisplayObjects must be a child of the caller ' + this);
    }
};

/**
 * Removes a child from the container.
 *
 * @method removeChild
 * @param child {DisplayObject} The DisplayObject to remove
 */
PIXI.DisplayObjectContainer.prototype.removeChild = function(child)
{
    var index = this.children.indexOf( child );
    if ( index !== -1 )
    {
        // update the stage reference..
        if(this.stage)this.removeStageReference();

        child.parent = undefined;
        this.children.splice( index, 1 );
    }
    else
    {
        throw new Error(child + ' The supplied DisplayObject must be a child of the caller ' + this);
    }
};

/*
 * Updates the container's children's transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.DisplayObjectContainer.prototype.updateTransform = function()
{
    //this._currentBounds = null;

    if(!this.visible)return;

    PIXI.DisplayObject.prototype.updateTransform.call( this );

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }
};

PIXI.DisplayObjectContainer.prototype.getBounds = function()
{
    if(this.children.length === 0)return PIXI.EmptyRectangle;

    // TODO the bounds have already been calculated this render session so return what we have
   

    var minX = Infinity;
    var minY = Infinity;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var childBounds;
    var childMaxX;
    var childMaxY;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        
        if(!child.visible)continue;

        childBounds = this.children[i].getBounds();
     
        minX = minX < childBounds.x ? minX : childBounds.x;
        minY = minY < childBounds.y ? minY : childBounds.y;

        childMaxX = childBounds.width + childBounds.x;
        childMaxY = childBounds.height + childBounds.y;

        maxX = maxX > childMaxX ? maxX : childMaxX;
        maxY = maxY > childMaxY ? maxY : childMaxY;
    }

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.y = minY;
    bounds.width = maxX - minX;
    bounds.height = maxY - minY;

    // TODO: store a refferance so that if this function gets called again in the render cycle we do not have to recacalculate
    //this._currentBounds = bounds;
   
    return bounds;
};

PIXI.DisplayObjectContainer.prototype.setStageReference = function(stage)
{
    this.stage = stage;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        if(child.interactive)this.stage.dirty = true;
        child.setStageReference(stage);
    }
};

PIXI.DisplayObjectContainer.prototype.removeStageReference = function()
{
    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        if(child.interactive)this.stage.dirty = true;
        child.removeStageReference();
    }

    this.stage = null;
};

PIXI.DisplayObjectContainer.prototype._renderWebGL = function(renderSession)
{
    if(this.visible === false || this.alpha === 0)return;

    var i,j;

    if(this._mask || this._filters)
    {
        if(this._mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            renderSession.spriteBatch.start();
        }

        if(this._filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if(this._filters)renderSession.filterManager.popFilter();
        if(this._mask)renderSession.maskManager.popMask(renderSession);
        
        renderSession.spriteBatch.start();
    }
    else
    {
        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }
};

PIXI.DisplayObjectContainer.prototype._renderCanvas = function(renderSession)
{
    if(this.visible === false || this.alpha === 0)return;

    if(this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession.context);
    }

    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        child._renderCanvas(renderSession);
    }

    if(this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }
};



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.blendModes = {};
PIXI.blendModes.NORMAL      = 0;
PIXI.blendModes.ADD         = 1;
PIXI.blendModes.MULTIPLY    = 2;
PIXI.blendModes.SCREEN      = 3;

/**
 * The SPrite object is the base for all textured objects that are rendered to the screen
 *
 * @class Sprite™
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} The texture for this sprite
 * @type String
 */
PIXI.Sprite = function(texture)
{
    PIXI.DisplayObjectContainer.call( this );

    /**
     * The anchor sets the origin point of the texture.
     * The default is 0,0 this means the textures origin is the top left
     * Setting than anchor to 0.5,0.5 means the textures origin is centered
     * Setting the anchor to 1,1 would mean the textures origin points will be the bottom right
     *
     * @property anchor
     * @type Point
     */
    this.anchor = new PIXI.Point();

    /**
     * The texture that the sprite is using
     *
     * @property texture
     * @type Texture
     */
    this.texture = texture;

    /**
     * The width of the sprite (this is initially set by the texture)
     *
     * @property _width
     * @type Number
     * @private
     */
    this._width = 0;

    /**
     * The height of the sprite (this is initially set by the texture)
     *
     * @property _height
     * @type Number
     * @private
     */
    this._height = 0;


    /**
     * The tint applied to the sprite. This is a hex value
     *
     * @property tint
     * @type Number
     * @default 0xFFFFFF
     */
    this.tint = 0xFFFFFF;// * Math.random();
    
    /**
     * The blend mode to be applied to the sprite
     *
     * @property blendMode
     * @type Number
     * @default PIXI.blendModes.NORMAL;
     */
    this.blendMode = PIXI.blendModes.NORMAL;

    if(texture.baseTexture.hasLoaded)
    {
        this.onTextureUpdate();
    }
    else
    {
        this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
        this.texture.addEventListener( 'update', this.onTextureUpdateBind );
    }

    this.renderable = true;
};

// constructor
PIXI.Sprite.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Sprite.prototype.constructor = PIXI.Sprite;

/**
 * The width of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'width', {
    get: function() {
        return this.scale.x * this.texture.frame.width;
    },
    set: function(value) {
        this.scale.x = value / this.texture.frame.width;
        this._width = value;
    }
});

/**
 * The height of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.Sprite.prototype, 'height', {
    get: function() {
        return  this.scale.y * this.texture.frame.height;
    },
    set: function(value) {
        this.scale.y = value / this.texture.frame.height;
        this._height = value;
    }
});

/**
 * Sets the texture of the sprite
 *
 * @method setTexture
 * @param texture {Texture} The PIXI texture that is displayed by the sprite
 */
PIXI.Sprite.prototype.setTexture = function(texture)
{
    // stop current texture;
    if(this.texture.baseTexture !== texture.baseTexture)
    {
        this.textureChange = true;
        this.texture = texture;
    }
    else
    {
        this.texture = texture;
    }

    this.cachedTint = 0xFFFFFF;
    this.updateFrame = true;
};

/**
 * When the texture is updated, this event will fire to update the scale and frame
 *
 * @method onTextureUpdate
 * @param event
 * @private
 */
PIXI.Sprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    if(this._width)this.scale.x = this._width / this.texture.frame.width;
    if(this._height)this.scale.y = this._height / this.texture.frame.height;


    this.updateFrame = true;
};

PIXI.Sprite.prototype.getBounds = function()
{

    var width = this.texture.frame.width;
    var height = this.texture.frame.height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a refferance so that if this function gets called again in the render cycle we do not have to recacalculate
    this._currentBounds = bounds;

    return bounds;
};


PIXI.Sprite.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0)return;
    
    var i,j;

    // do a quick check to see if this element has a mask or a filter.
    if(this._mask || this._filters)
    {
        var spriteBatch =  renderSession.spriteBatch;

        if(this._mask)
        {
            spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession);
            spriteBatch.start();
        }

        if(this._filters)
        {
            spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }

        // add this sprite to the batch
        spriteBatch.render(this);

        // now loop through the children and make sure they get rendered
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        // time to stop the sprite batch as either a mask element or a filter draw will happen next
        spriteBatch.stop();

        if(this._filters)renderSession.filterManager.popFilter();
        if(this._mask)renderSession.maskManager.popMask(renderSession);
        
        spriteBatch.start();
    }
    else
    {
        renderSession.spriteBatch.render(this);

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }

   
    //TODO check culling  
};

PIXI.Sprite.prototype._renderCanvas = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0)return;
    
    if(this._mask)
    {
        renderSession.maskManager.pushMask(this._mask, renderSession.context);
    }

    var frame = this.texture.frame;
    var context = renderSession.context;
    var texture = this.texture;

    //ignore null sources
    if(frame && frame.width && frame.height && texture.baseTexture.source)
    {
        context.globalAlpha = this.worldAlpha;

        var transform = this.worldTransform;

        // alow for trimming
       
        context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
         
        // check blend mode
        if(this.blendMode !== renderSession.currentBlendMode)
        {
            renderSession.currentBlendMode = this.blendMode;
            context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
        }


        //if smoothingEnabled is supported and we need to change the smoothing property for this texture
     //   if(this.smoothProperty && this.scaleMode !== displayObject.texture.baseTexture.scaleMode) {
       //     this.scaleMode = displayObject.texture.baseTexture.scaleMode;
         //   context[this.smoothProperty] = (this.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR);
        //}


        if(this.tint !== 0xFFFFFF)
        {
            if(this.cachedTint !== this.tint)
            {
                // no point tinting an image that has not loaded yet!
                if(!texture.baseTexture.hasLoaded)return;

                this.cachedTint = this.tint;
                
                //TODO clean up cacheing - how to clean up the caches?
                this.tintedTexture = PIXI.CanvasTinter.getTintedTexture(this, this.tint);
                
            }

            context.drawImage(this.tintedTexture,
                               0,
                               0,
                               frame.width,
                               frame.height,
                               (this.anchor.x) * -frame.width,
                               (this.anchor.y) * -frame.height,
                               frame.width,
                               frame.height);
        }
        else
        {

           

            if(texture.trimmed)
            {
                var trim =  texture.trim;

                context.drawImage(this.texture.baseTexture.source,
                               frame.x,
                               frame.y,
                               frame.width,
                               frame.height,
                               trim.x - this.anchor.x * trim.realWidth,
                               trim.y - this.anchor.y * trim.realHeight,
                               frame.width,
                               frame.height);
            }
            else
            {
               
                context.drawImage(this.texture.baseTexture.source,
                               frame.x,
                               frame.y,
                               frame.width,
                               frame.height,
                               (this.anchor.x) * -frame.width,
                               (this.anchor.y) * -frame.height,
                               frame.width,
                               frame.height);
            }
            
        }
    }

    // OVERWRITE
    for(var i=0,j=this.children.length; i<j; i++)
    {
        var child = this.children[i];
        child._renderCanvas(renderSession);
    }

    if(this._mask)
    {
        renderSession.maskManager.popMask(renderSession.context);
    }
};

// some helper functions..

/**
 *
 * Helper function that creates a sprite that will contain a texture from the TextureCache based on the frameId
 * The frame ids are created when a Texture packer file has been loaded
 *
 * @method fromFrame
 * @static
 * @param frameId {String} The frame Id of the texture in the cache
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the frameId
 */
PIXI.Sprite.fromFrame = function(frameId)
{
    var texture = PIXI.TextureCache[frameId];
    if(!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache' + this);
    return new PIXI.Sprite(texture);
};

/**
 *
 * Helper function that creates a sprite that will contain a texture based on an image url
 * If the image is not in the texture cache it will be loaded
 *
 * @method fromImage
 * @static
 * @param imageId {String} The image url of the texture
 * @return {Sprite} A new Sprite using a texture from the texture cache matching the image id
 */
PIXI.Sprite.fromImage = function(imageId)
{
    var texture = PIXI.Texture.fromImage(imageId);
    return new PIXI.Sprite(texture);
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A MovieClip is a simple way to display an animation depicted by a list of textures.
 *
 * @class MovieClip
 * @extends Sprite
 * @constructor
 * @param textures {Array<Texture>} an array of {Texture} objects that make up the animation
 */
PIXI.MovieClip = function(textures)
{
    PIXI.Sprite.call(this, textures[0]);

    /**
     * The array of textures that make up the animation
     *
     * @property textures
     * @type Array
     */
    this.textures = textures;

    /**
     * The speed that the MovieClip will play at. Higher is faster, lower is slower
     *
     * @property animationSpeed
     * @type Number
     * @default 1
     */
    this.animationSpeed = 1;

    /**
     * Whether or not the movie clip repeats after playing.
     *
     * @property loop
     * @type Boolean
     * @default true
     */
    this.loop = true;

    /**
     * Function to call when a MovieClip finishes playing
     *
     * @property onComplete
     * @type Function
     */
    this.onComplete = null;

    /**
     * [read-only] The index MovieClips current frame (this may not have to be a whole number)
     *
     * @property currentFrame
     * @type Number
     * @default 0
     * @readOnly
     */
    this.currentFrame = 0;

    /**
     * [read-only] Indicates if the MovieClip is currently playing
     *
     * @property playing
     * @type Boolean
     * @readOnly
     */
    this.playing = false;
};

// constructor
PIXI.MovieClip.prototype = Object.create( PIXI.Sprite.prototype );
PIXI.MovieClip.prototype.constructor = PIXI.MovieClip;

/**
* [read-only] totalFrames is the total number of frames in the MovieClip. This is the same as number of textures
* assigned to the MovieClip.
*
* @property totalFrames
* @type Number
* @default 0
* @readOnly
*/
Object.defineProperty( PIXI.MovieClip.prototype, 'totalFrames', {
	get: function() {

		return this.textures.length;
	}
});


/**
 * Stops the MovieClip
 *
 * @method stop
 */
PIXI.MovieClip.prototype.stop = function()
{
    this.playing = false;
};

/**
 * Plays the MovieClip
 *
 * @method play
 */
PIXI.MovieClip.prototype.play = function()
{
    this.playing = true;
};

/**
 * Stops the MovieClip and goes to a specific frame
 *
 * @method gotoAndStop
 * @param frameNumber {Number} frame index to stop at
 */
PIXI.MovieClip.prototype.gotoAndStop = function(frameNumber)
{
    this.playing = false;
    this.currentFrame = frameNumber;
    var round = (this.currentFrame + 0.5) | 0;
    this.setTexture(this.textures[round % this.textures.length]);
};

/**
 * Goes to a specific frame and begins playing the MovieClip
 *
 * @method gotoAndPlay
 * @param frameNumber {Number} frame index to start at
 */
PIXI.MovieClip.prototype.gotoAndPlay = function(frameNumber)
{
    this.currentFrame = frameNumber;
    this.playing = true;
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.MovieClip.prototype.updateTransform = function()
{
    PIXI.Sprite.prototype.updateTransform.call(this);

    if(!this.playing)return;

    this.currentFrame += this.animationSpeed;

    var round = (this.currentFrame + 0.5) | 0;

    if(this.loop || round < this.textures.length)
    {
        this.setTexture(this.textures[round % this.textures.length]);
    }
    else if(round >= this.textures.length)
    {
        this.gotoAndStop(this.textures.length - 1);
        if(this.onComplete)
        {
            this.onComplete();
        }
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */



PIXI.FilterBlock = function()
{
    this.visible = true;
    this.renderable = true;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text to split a line you can use '\n'
 *
 * @class Text
 * @extends Sprite
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param [style] {Object} The style parameters
 * @param [style.font] {String} default 'bold 20pt Arial' The style and size of the font
 * @param [style.fill='black'] {Object} A canvas fillstyle that will be used on the text eg 'red', '#00FF00'
 * @param [style.align='left'] {String} An alignment of the multiline text ('left', 'center' or 'right')
 * @param [style.stroke] {String} A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 */
PIXI.Text = function(text, style)
{
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    PIXI.Sprite.call(this, PIXI.Texture.fromCanvas(this.canvas));

    this.setText(text);
    this.setStyle(style);

    this.updateText();
    this.dirty = false;
};

// constructor
PIXI.Text.prototype = Object.create(PIXI.Sprite.prototype);
PIXI.Text.prototype.constructor = PIXI.Text;

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param [style] {Object} The style parameters
 * @param [style.font='bold 20pt Arial'] {String} The style and size of the font
 * @param [style.fill='black'] {Object} A canvas fillstyle that will be used on the text eg 'red', '#00FF00'
 * @param [style.align='left'] {String} An alignment of the multiline text ('left', 'center' or 'right')
 * @param [style.stroke='black'] {String} A canvas fillstyle that will be used on the text stroke eg 'blue', '#FCFF00'
 * @param [style.strokeThickness=0] {Number} A number that represents the thickness of the stroke. Default is 0 (no stroke)
 * @param [style.wordWrap=false] {Boolean} Indicates if word wrap should be used
 * @param [style.wordWrapWidth=100] {Number} The width at which text will wrap
 */
PIXI.Text.prototype.setStyle = function(style)
{
    style = style || {};
    style.font = style.font || 'bold 20pt Arial';
    style.fill = style.fill || 'black';
    style.align = style.align || 'left';
    style.stroke = style.stroke || 'black'; //provide a default, see: https://github.com/GoodBoyDigital/pixi.js/issues/136
    style.strokeThickness = style.strokeThickness || 0;
    style.wordWrap = style.wordWrap || false;
    style.wordWrapWidth = style.wordWrapWidth || 100;
    this.style = style;
    this.dirty = true;
};

/**
 * Set the copy for the text object. To split a line you can use '\n'
 *
 * @method setText
 * @param {String} text The copy that you would like the text to display
 */
PIXI.Text.prototype.setText = function(text)
{
    this.text = text.toString() || ' ';
    this.dirty = true;

};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.Text.prototype.updateText = function()
{
    this.context.font = this.style.font;

    var outputText = this.text;

    // word wrap
    // preserve original text
    if(this.style.wordWrap)outputText = this.wordWrap(this.text);

    //split text into lines
    var lines = outputText.split(/(?:\r\n|\r|\n)/);

    //calculate text width
    var lineWidths = [];
    var maxLineWidth = 0;
    for (var i = 0; i < lines.length; i++)
    {
        var lineWidth = this.context.measureText(lines[i]).width;
        lineWidths[i] = lineWidth;
        maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    this.canvas.width = maxLineWidth + this.style.strokeThickness;

    //calculate text height
    var lineHeight = this.determineFontHeight('font: ' + this.style.font  + ';') + this.style.strokeThickness;
    this.canvas.height = lineHeight * lines.length;

    //set canvas text styles
    this.context.fillStyle = this.style.fill;
    this.context.font = this.style.font;

    this.context.strokeStyle = this.style.stroke;
    this.context.lineWidth = this.style.strokeThickness;

    this.context.textBaseline = 'top';

    //draw lines line by line
    for (i = 0; i < lines.length; i++)
    {
        var linePosition = new PIXI.Point(this.style.strokeThickness / 2, this.style.strokeThickness / 2 + i * lineHeight);

        if(this.style.align === 'right')
        {
            linePosition.x += maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            linePosition.x += (maxLineWidth - lineWidths[i]) / 2;
        }

        if(this.style.stroke && this.style.strokeThickness)
        {
            this.context.strokeText(lines[i], linePosition.x, linePosition.y);
        }

        if(this.style.fill)
        {
            this.context.fillText(lines[i], linePosition.x, linePosition.y);
        }
    }

    this.updateTexture();
};

/**
 * Updates texture size based on canvas size
 *
 * @method updateTexture
 * @private
 */
PIXI.Text.prototype.updateTexture = function()
{
    this.texture.baseTexture.width = this.canvas.width;
    this.texture.baseTexture.height = this.canvas.height;
    this.texture.frame.width = this.canvas.width;
    this.texture.frame.height = this.canvas.height;

    this._width = this.canvas.width;
    this._height = this.canvas.height;

    this.requiresUpdate =  true;
};

PIXI.Text.prototype._renderWebGL = function(renderSession)
{
    if(this.requiresUpdate)
    {
        this.requiresUpdate = false;
        PIXI.updateWebGLTexture(this.texture.baseTexture, renderSession.gl);
    }

    PIXI.Sprite.prototype._renderWebGL.call(this, renderSession);
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.Text.prototype.updateTransform = function()
{
    if(this.dirty)
    {
        this.updateText();
        this.dirty = false;
    }

    PIXI.Sprite.prototype.updateTransform.call(this);
};

/*
 * http://stackoverflow.com/users/34441/ellisbben
 * great solution to the problem!
 *
 * @method determineFontHeight
 * @param fontStyle {Object}
 * @private
 */
PIXI.Text.prototype.determineFontHeight = function(fontStyle)
{
    // build a little reference dictionary so if the font style has been used return a
    // cached version...
    var result = PIXI.Text.heightCache[fontStyle];

    if(!result)
    {
        var body = document.getElementsByTagName('body')[0];
        var dummy = document.createElement('div');
        var dummyText = document.createTextNode('M');
        dummy.appendChild(dummyText);
        dummy.setAttribute('style', fontStyle + ';position:absolute;top:0;left:0');
        body.appendChild(dummy);

        result = dummy.offsetHeight;
        PIXI.Text.heightCache[fontStyle] = result;

        body.removeChild(dummy);
    }

    return result;
};

/**
 * Applies newlines to a string to have it optimally fit into the horizontal
 * bounds set by the Text object's wordWrapWidth property.
 *
 * @method wordWrap
 * @param text {String}
 * @private
 */
PIXI.Text.prototype.wordWrap = function(text)
{
    // Greedy wrapping algorithm that will wrap words as the line grows longer
    // than its horizontal bounds.
    var result = '';
    var lines = text.split('\n');
    for (var i = 0; i < lines.length; i++)
    {
        var spaceLeft = this.style.wordWrapWidth;
        var words = lines[i].split(' ');
        for (var j = 0; j < words.length; j++)
        {
            var wordWidth = this.context.measureText(words[j]).width;
            var wordWidthWithSpace = wordWidth + this.context.measureText(' ').width;
            if(wordWidthWithSpace > spaceLeft)
            {
                // Skip printing the newline if it's the first word of the line that is
                // greater than the word wrap width.
                if(j > 0)
                {
                    result += '\n';
                }
                result += words[j] + ' ';
                spaceLeft = this.style.wordWrapWidth - wordWidth;
            }
            else
            {
                spaceLeft -= wordWidthWithSpace;
                result += words[j] + ' ';
            }
        }
        result += '\n';
    }
    return result;
};

/**
 * Destroys this text object
 *
 * @method destroy
 * @param destroyTexture {Boolean}
 */
PIXI.Text.prototype.destroy = function(destroyTexture)
{
    if(destroyTexture)
    {
        this.texture.destroy();
    }

};

PIXI.Text.heightCache = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Text Object will create a line(s) of text using bitmap font. To split a line you can use '\n', '\r' or '\r\n'
 * You can generate the fnt files using
 * http://www.angelcode.com/products/bmfont/ for windows or
 * http://www.bmglyph.com/ for mac.
 *
 * @class BitmapText
 * @extends DisplayObjectContainer
 * @constructor
 * @param text {String} The copy that you would like the text to display
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * @param [style.align='left'] {String} An alignment of the multiline text ('left', 'center' or 'right')
 */
PIXI.BitmapText = function(text, style)
{
    PIXI.DisplayObjectContainer.call(this);

    this.setText(text);
    this.setStyle(style);
    this.updateText();
    this.dirty = false;
};

// constructor
PIXI.BitmapText.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.BitmapText.prototype.constructor = PIXI.BitmapText;

/**
 * Set the copy for the text object
 *
 * @method setText
 * @param text {String} The copy that you would like the text to display
 */
PIXI.BitmapText.prototype.setText = function(text)
{
    this.text = text || ' ';
    this.dirty = true;
};

/**
 * Set the style of the text
 *
 * @method setStyle
 * @param style {Object} The style parameters
 * @param style.font {String} The size (optional) and bitmap font id (required) eq 'Arial' or '20px Arial' (must have loaded previously)
 * @param [style.align='left'] {String} An alignment of the multiline text ('left', 'center' or 'right')
 */
PIXI.BitmapText.prototype.setStyle = function(style)
{
    style = style || {};
    style.align = style.align || 'left';
    this.style = style;

    var font = style.font.split(' ');
    this.fontName = font[font.length - 1];
    this.fontSize = font.length >= 2 ? parseInt(font[font.length - 2], 10) : PIXI.BitmapText.fonts[this.fontName].size;

    this.dirty = true;
};

/**
 * Renders text
 *
 * @method updateText
 * @private
 */
PIXI.BitmapText.prototype.updateText = function()
{
    var data = PIXI.BitmapText.fonts[this.fontName];
    var pos = new PIXI.Point();
    var prevCharCode = null;
    var chars = [];
    var maxLineWidth = 0;
    var lineWidths = [];
    var line = 0;
    var scale = this.fontSize / data.size;
    for(var i = 0; i < this.text.length; i++)
    {
        var charCode = this.text.charCodeAt(i);
        if(/(?:\r\n|\r|\n)/.test(this.text.charAt(i)))
        {
            lineWidths.push(pos.x);
            maxLineWidth = Math.max(maxLineWidth, pos.x);
            line++;

            pos.x = 0;
            pos.y += data.lineHeight;
            prevCharCode = null;
            continue;
        }

        var charData = data.chars[charCode];
        if(!charData) continue;

        if(prevCharCode && charData[prevCharCode])
        {
            pos.x += charData.kerning[prevCharCode];
        }
        chars.push({texture:charData.texture, line: line, charCode: charCode, position: new PIXI.Point(pos.x + charData.xOffset, pos.y + charData.yOffset)});
        pos.x += charData.xAdvance;

        prevCharCode = charCode;
    }

    lineWidths.push(pos.x);
    maxLineWidth = Math.max(maxLineWidth, pos.x);

    var lineAlignOffsets = [];
    for(i = 0; i <= line; i++)
    {
        var alignOffset = 0;
        if(this.style.align === 'right')
        {
            alignOffset = maxLineWidth - lineWidths[i];
        }
        else if(this.style.align === 'center')
        {
            alignOffset = (maxLineWidth - lineWidths[i]) / 2;
        }
        lineAlignOffsets.push(alignOffset);
    }

    for(i = 0; i < chars.length; i++)
    {
        var c = new PIXI.Sprite(chars[i].texture); //PIXI.Sprite.fromFrame(chars[i].charCode);
        c.position.x = (chars[i].position.x + lineAlignOffsets[chars[i].line]) * scale;
        c.position.y = chars[i].position.y * scale;
        c.scale.x = c.scale.y = scale;
        this.addChild(c);
    }

    this.width = maxLineWidth * scale;
    this.height = (pos.y + data.lineHeight) * scale;
};

/**
 * Updates the transfor of this object
 *
 * @method updateTransform
 * @private
 */
PIXI.BitmapText.prototype.updateTransform = function()
{
    if(this.dirty)
    {
        while(this.children.length > 0)
        {
            this.removeChild(this.getChildAt(0));
        }
        this.updateText();

        this.dirty = false;
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};

PIXI.BitmapText.fonts = {};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

 /**
 * The interaction manager deals with mouse and touch events. Any DisplayObject can be interactive
 * This manager also supports multitouch.
 *
 * @class InteractionManager
 * @constructor
 * @param stage {Stage} The stage to handle interactions
 */
PIXI.InteractionManager = function(stage)
{
    /**
     * a refference to the stage
     *
     * @property stage
     * @type Stage
     */
    this.stage = stage;

    /**
     * the mouse data
     *
     * @property mouse
     * @type InteractionData
     */
    this.mouse = new PIXI.InteractionData();

    /**
     * an object that stores current touches (InteractionData) by id reference
     *
     * @property touchs
     * @type Object
     */
    this.touchs = {};

    // helpers
    this.tempPoint = new PIXI.Point();
    //this.tempMatrix =  mat3.create();

    this.mouseoverEnabled = true;

    //tiny little interactiveData pool!
    this.pool = [];

    this.interactiveItems = [];
    this.interactionDOMElement = null;

    //this will make it so that you dont have to call bind all the time
    this.onMouseMove = this.onMouseMove.bind( this );
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseOut = this.onMouseOut.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);

    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.last = 0;
};

// constructor
PIXI.InteractionManager.prototype.constructor = PIXI.InteractionManager;

/**
 * Collects an interactive sprite recursively to have their interactions managed
 *
 * @method collectInteractiveSprite
 * @param displayObject {DisplayObject} the displayObject to collect
 * @param iParent {DisplayObject}
 * @private
 */
PIXI.InteractionManager.prototype.collectInteractiveSprite = function(displayObject, iParent)
{
    var children = displayObject.children;
    var length = children.length;

    /// make an interaction tree... {item.__interactiveParent}
    for (var i = length-1; i >= 0; i--)
    {
        var child = children[i];

//      if(child.visible) {
        // push all interactive bits
        if(child.interactive)
        {
            iParent.interactiveChildren = true;
            //child.__iParent = iParent;
            this.interactiveItems.push(child);

            if(child.children.length > 0)
            {
                this.collectInteractiveSprite(child, child);
            }
        }
        else
        {
            child.__iParent = null;

            if(child.children.length > 0)
            {
                this.collectInteractiveSprite(child, iParent);
            }
        }
//      }
    }
};

/**
 * Sets the target for event delegation
 *
 * @method setTarget
 * @param target {WebGLRenderer|CanvasRenderer} the renderer to bind events to
 * @private
 */
PIXI.InteractionManager.prototype.setTarget = function(target)
{
    this.target = target;

    //check if the dom element has been set. If it has don't do anything
    if( this.interactionDOMElement === null ) {

        this.setTargetDomElement( target.view );
    }

    document.body.addEventListener('mouseup',  this.onMouseUp, true);
};


/**
 * Sets the dom element which will receive mouse/touch events. This is useful for when you have other DOM
 * elements ontop of the renderers Canvas element. With this you'll be able to delegate another dom element
 * to receive those events
 *
 * @method setTargetDomElement
 * @param domElement {DOMElement} the dom element which will receive mouse and touch events
 * @private
 */
PIXI.InteractionManager.prototype.setTargetDomElement = function(domElement)
{
    //remove previouse listeners
    if( this.interactionDOMElement !== null )
    {
        this.interactionDOMElement.style['-ms-content-zooming'] = '';
        this.interactionDOMElement.style['-ms-touch-action'] = '';

        this.interactionDOMElement.removeEventListener('mousemove',  this.onMouseMove, true);
        this.interactionDOMElement.removeEventListener('mousedown',  this.onMouseDown, true);
        this.interactionDOMElement.removeEventListener('mouseout',   this.onMouseOut, true);

        // aint no multi touch just yet!
        this.interactionDOMElement.removeEventListener('touchstart', this.onTouchStart, true);
        this.interactionDOMElement.removeEventListener('touchend', this.onTouchEnd, true);
        this.interactionDOMElement.removeEventListener('touchmove', this.onTouchMove, true);
    }


    if (window.navigator.msPointerEnabled)
    {
        // time to remove some of that zoom in ja..
        domElement.style['-ms-content-zooming'] = 'none';
        domElement.style['-ms-touch-action'] = 'none';

        // DO some window specific touch!
    }

    this.interactionDOMElement = domElement;

    domElement.addEventListener('mousemove',  this.onMouseMove, true);
    domElement.addEventListener('mousedown',  this.onMouseDown, true);
    domElement.addEventListener('mouseout',   this.onMouseOut, true);

    // aint no multi touch just yet!
    domElement.addEventListener('touchstart', this.onTouchStart, true);
    domElement.addEventListener('touchend', this.onTouchEnd, true);
    domElement.addEventListener('touchmove', this.onTouchMove, true);
};

/**
 * updates the state of interactive objects
 *
 * @method update
 * @private
 */
PIXI.InteractionManager.prototype.update = function()
{
    if(!this.target)return;

    // frequency of 30fps??
    var now = Date.now();
    var diff = now - this.last;
    diff = (diff * 30) / 1000;
    if(diff < 1)return;
    this.last = now;
    //

    var i = 0;

    // ok.. so mouse events??
    // yes for now :)
    // OPTIMSE - how often to check??
    if(this.dirty)
    {
        this.dirty = false;

        var len = this.interactiveItems.length;

        for (i = 0; i < len; i++) {
            this.interactiveItems[i].interactiveChildren = false;
        }

        this.interactiveItems = [];

        if(this.stage.interactive)this.interactiveItems.push(this.stage);
        // go through and collect all the objects that are interactive..
        this.collectInteractiveSprite(this.stage, this.stage);
    }

    // loop through interactive objects!
    var length = this.interactiveItems.length;

    this.interactionDOMElement.style.cursor = 'inherit';

    for (i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];


        //if(!item.visible)continue;

        // OPTIMISATION - only calculate every time if the mousemove function exists..
        // OK so.. does the object have any other interactive functions?
        // hit-test the clip!


        if(item.mouseover || item.mouseout || item.buttonMode)
        {
            // ok so there are some functions so lets hit test it..
            item.__hit = this.hitTest(item, this.mouse);
            this.mouse.target = item;
            // ok so deal with interactions..
            // loks like there was a hit!
            if(item.__hit)
            {
                if(item.buttonMode) this.interactionDOMElement.style.cursor = item.defaultCursor;

                if(!item.__isOver)
                {

                    if(item.mouseover)item.mouseover(this.mouse);
                    item.__isOver = true;
                }
            }
            else
            {
                if(item.__isOver)
                {
                    // roll out!
                    if(item.mouseout)item.mouseout(this.mouse);
                    item.__isOver = false;
                }
            }
        }
        // --->
    }
};

/**
 * Is called when the mouse moves accross the renderer element
 *
 * @method onMouseMove
 * @param event {Event} The DOM event of the mouse moving
 * @private
 */
PIXI.InteractionManager.prototype.onMouseMove = function(event)
{
    this.mouse.originalEvent = event || window.event; //IE uses window.event
    // TODO optimize by not check EVERY TIME! maybe half as often? //
    var rect = this.interactionDOMElement.getBoundingClientRect();

    this.mouse.global.x = (event.clientX - rect.left) * (this.target.width / rect.width);
    this.mouse.global.y = (event.clientY - rect.top) * ( this.target.height / rect.height);

    var length = this.interactiveItems.length;

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.mousemove)
        {
            //call the function!
            item.mousemove(this.mouse);
        }
    }
};

/**
 * Is called when the mouse button is pressed down on the renderer element
 *
 * @method onMouseDown
 * @param event {Event} The DOM event of a mouse button being pressed down
 * @private
 */
PIXI.InteractionManager.prototype.onMouseDown = function(event)
{
    this.mouse.originalEvent = event || window.event; //IE uses window.event

    // loop through inteaction tree...
    // hit test each item! ->
    // get interactive items under point??
    //stage.__i
    var length = this.interactiveItems.length;

    // while
    // hit test
    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.mousedown || item.click)
        {
            item.__mouseIsDown = true;
            item.__hit = this.hitTest(item, this.mouse);

            if(item.__hit)
            {
                //call the function!
                if(item.mousedown)item.mousedown(this.mouse);
                item.__isDown = true;

                // just the one!
                if(!item.interactiveChildren)break;
            }
        }
    }
};


PIXI.InteractionManager.prototype.onMouseOut = function()
{
    var length = this.interactiveItems.length;

    this.interactionDOMElement.style.cursor = 'inherit';

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.__isOver)
        {
            this.mouse.target = item;
            if(item.mouseout)item.mouseout(this.mouse);
            item.__isOver = false;
        }
    }
};

/**
 * Is called when the mouse button is released on the renderer element
 *
 * @method onMouseUp
 * @param event {Event} The DOM event of a mouse button being released
 * @private
 */
PIXI.InteractionManager.prototype.onMouseUp = function(event)
{
    this.mouse.originalEvent = event || window.event; //IE uses window.event

    var length = this.interactiveItems.length;
    var up = false;

    for (var i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];

        if(item.mouseup || item.mouseupoutside || item.click)
        {
            item.__hit = this.hitTest(item, this.mouse);

            if(item.__hit && !up)
            {
                //call the function!
                if(item.mouseup)
                {
                    item.mouseup(this.mouse);
                }
                if(item.__isDown)
                {
                    if(item.click)item.click(this.mouse);
                }

                if(!item.interactiveChildren)up = true;
            }
            else
            {
                if(item.__isDown)
                {
                    if(item.mouseupoutside)item.mouseupoutside(this.mouse);
                }
            }

            item.__isDown = false;
        }
    }
};

/**
 * Tests if the current mouse coords hit a sprite
 *
 * @method hitTest
 * @param item {DisplayObject} The displayObject to test for a hit
 * @param interactionData {InteractionData} The interactiondata object to update in the case of a hit
 * @private
 */
PIXI.InteractionManager.prototype.hitTest = function(item, interactionData)
{
    var global = interactionData.global;

    if( !item.worldVisible )return false;

    // temp fix for if the element is in a non visible
   
    var isSprite = (item instanceof PIXI.Sprite),
        worldTransform = item.worldTransform,
        a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
        a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
        id = 1 / (a00 * a11 + a01 * -a10),
        x = a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
        y = a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id;

    interactionData.target = item;

    //a sprite or display object with a hit area defined
    if(item.hitArea && item.hitArea.contains) {
        if(item.hitArea.contains(x, y)) {
            //if(isSprite)
            interactionData.target = item;

            return true;
        }

        return false;
    }
    // a sprite with no hitarea defined
    else if(isSprite)
    {
        var width = item.texture.frame.width,
            height = item.texture.frame.height,
            x1 = -width * item.anchor.x,
            y1;

        if(x > x1 && x < x1 + width)
        {
            y1 = -height * item.anchor.y;

            if(y > y1 && y < y1 + height)
            {
                // set the target property if a hit is true!
                interactionData.target = item;
                return true;
            }
        }
    }

    var length = item.children.length;

    for (var i = 0; i < length; i++)
    {
        var tempItem = item.children[i];
        var hit = this.hitTest(tempItem, interactionData);
        if(hit)
        {
            // hmm.. TODO SET CORRECT TARGET?
            interactionData.target = item;
            return true;
        }
    }

    return false;
};

/**
 * Is called when a touch is moved accross the renderer element
 *
 * @method onTouchMove
 * @param event {Event} The DOM event of a touch moving accross the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchMove = function(event)
{
    var rect = this.interactionDOMElement.getBoundingClientRect();
    var changedTouches = event.changedTouches;
    var touchData;
    var i = 0;

    for (i = 0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];
        touchData = this.touchs[touchEvent.identifier];
        touchData.originalEvent =  event || window.event;

        // update the touch position
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);
    }

    var length = this.interactiveItems.length;
    for (i = 0; i < length; i++)
    {
        var item = this.interactiveItems[i];
        if(item.touchmove)
            item.touchmove(touchData);
    }
};

/**
 * Is called when a touch is started on the renderer element
 *
 * @method onTouchStart
 * @param event {Event} The DOM event of a touch starting on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchStart = function(event)
{
    var rect = this.interactionDOMElement.getBoundingClientRect();

    var changedTouches = event.changedTouches;
    for (var i=0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];

        var touchData = this.pool.pop();
        if(!touchData)touchData = new PIXI.InteractionData();

        touchData.originalEvent =  event || window.event;

        this.touchs[touchEvent.identifier] = touchData;
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);

        var length = this.interactiveItems.length;

        for (var j = 0; j < length; j++)
        {
            var item = this.interactiveItems[j];

            if(item.touchstart || item.tap)
            {
                item.__hit = this.hitTest(item, touchData);

                if(item.__hit)
                {
                    //call the function!
                    if(item.touchstart)item.touchstart(touchData);
                    item.__isDown = true;
                    item.__touchData = touchData;

                    if(!item.interactiveChildren)break;
                }
            }
        }
    }
};

/**
 * Is called when a touch is ended on the renderer element
 *
 * @method onTouchEnd
 * @param event {Event} The DOM event of a touch ending on the renderer view
 * @private
 */
PIXI.InteractionManager.prototype.onTouchEnd = function(event)
{
    //this.mouse.originalEvent = event || window.event; //IE uses window.event
    var rect = this.interactionDOMElement.getBoundingClientRect();
    var changedTouches = event.changedTouches;

    for (var i=0; i < changedTouches.length; i++)
    {
        var touchEvent = changedTouches[i];
        var touchData = this.touchs[touchEvent.identifier];
        var up = false;
        touchData.global.x = (touchEvent.clientX - rect.left) * (this.target.width / rect.width);
        touchData.global.y = (touchEvent.clientY - rect.top)  * (this.target.height / rect.height);

        var length = this.interactiveItems.length;
        for (var j = 0; j < length; j++)
        {
            var item = this.interactiveItems[j];
            var itemTouchData = item.__touchData; // <-- Here!
            item.__hit = this.hitTest(item, touchData);

            if(itemTouchData === touchData)
            {
                // so this one WAS down...
                touchData.originalEvent = event || window.event;
                // hitTest??

                if(item.touchend || item.tap)
                {
                    if(item.__hit && !up)
                    {
                        if(item.touchend)item.touchend(touchData);
                        if(item.__isDown)
                        {
                            if(item.tap)item.tap(touchData);
                        }

                        if(!item.interactiveChildren)up = true;
                    }
                    else
                    {
                        if(item.__isDown)
                        {
                            if(item.touchendoutside)item.touchendoutside(touchData);
                        }
                    }

                    item.__isDown = false;
                }

                item.__touchData = null;

            }
            /*
            else
            {

            }
            */
        }
        // remove the touch..
        this.pool.push(touchData);
        this.touchs[touchEvent.identifier] = null;
    }
};

/**
 * Holds all information related to an Interaction event
 *
 * @class InteractionData
 * @constructor
 */
PIXI.InteractionData = function()
{
    /**
     * This point stores the global coords of where the touch/mouse event happened
     *
     * @property global
     * @type Point
     */
    this.global = new PIXI.Point();

    // this is here for legacy... but will remove
    this.local = new PIXI.Point();

    /**
     * The target Sprite that was interacted with
     *
     * @property target
     * @type Sprite
     */
    this.target = null;

    /**
     * When passed to an event handler, this will be the original DOM Event that was captured
     *
     * @property originalEvent
     * @type Event
     */
    this.originalEvent = null;
};

/**
 * This will return the local coords of the specified displayObject for this InteractionData
 *
 * @method getLocalPosition
 * @param displayObject {DisplayObject} The DisplayObject that you would like the local coords off
 * @return {Point} A point containing the coords of the InteractionData position relative to the DisplayObject
 */
PIXI.InteractionData.prototype.getLocalPosition = function(displayObject)
{
    var worldTransform = displayObject.worldTransform;
    var global = this.global;

    // do a cheeky transform to get the mouse coords;
    var a00 = worldTransform[0], a01 = worldTransform[1], a02 = worldTransform[2],
        a10 = worldTransform[3], a11 = worldTransform[4], a12 = worldTransform[5],
        id = 1 / (a00 * a11 + a01 * -a10);
    // set the mouse coords...
    return new PIXI.Point(a11 * id * global.x + -a01 * id * global.y + (a12 * a01 - a02 * a11) * id,
                               a00 * id * global.y + -a10 * id * global.x + (-a12 * a00 + a02 * a10) * id);
};

// constructor
PIXI.InteractionData.prototype.constructor = PIXI.InteractionData;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Stage represents the root of the display tree. Everything connected to the stage is rendered
 *
 * @class Stage
 * @extends DisplayObjectContainer
 * @constructor
 * @param backgroundColor {Number} the background color of the stage, easiest way to pass this in is in hex format
 *      like: 0xFFFFFF for white
 */
PIXI.Stage = function(backgroundColor)
{
    PIXI.DisplayObjectContainer.call( this );

    /**
     * [read-only] Current transform of the object based on world (parent) factors
     *
     * @property worldTransform
     * @type Mat3
     * @readOnly
     * @private
     */
    this.worldTransform = PIXI.mat3.create();

    /**
     * Whether or not the stage is interactive
     *
     * @property interactive
     * @type Boolean
     */
    this.interactive = true;

    /**
     * The interaction manage for this stage, manages all interactive activity on the stage
     *
     * @property interactive
     * @type InteractionManager
     */
    this.interactionManager = new PIXI.InteractionManager(this);

    /**
     * Whether the stage is dirty and needs to have interactions updated
     *
     * @property dirty
     * @type Boolean
     * @private
     */
    this.dirty = true;

    this.__childrenAdded = [];
    this.__childrenRemoved = [];

    //the stage is it's own stage
    this.stage = this;

    //optimize hit detection a bit
    this.stage.hitArea = new PIXI.Rectangle(0,0,100000, 100000);

    this.setBackgroundColor(backgroundColor);
    this.worldVisible = true;
};

// constructor
PIXI.Stage.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Stage.prototype.constructor = PIXI.Stage;

/**
 * Sets another DOM element which can receive mouse/touch interactions instead of the default Canvas element.
 * This is useful for when you have other DOM elements ontop of the Canvas element.
 *
 * @method setInteractionDelegate
 * @param domElement {DOMElement} This new domElement which will receive mouse/touch events
 */
PIXI.Stage.prototype.setInteractionDelegate = function(domElement)
{
    this.interactionManager.setTargetDomElement( domElement );
};

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Stage.prototype.updateTransform = function()
{
    this.worldAlpha = 1;
    this.vcount = PIXI.visibleCount;

    for(var i=0,j=this.children.length; i<j; i++)
    {
        this.children[i].updateTransform();
    }

    if(this.dirty)
    {
        this.dirty = false;
        // update interactive!
        this.interactionManager.dirty = true;
    }

    if(this.interactive)this.interactionManager.update();
};

/**
 * Sets the background color for the stage
 *
 * @method setBackgroundColor
 * @param backgroundColor {Number} the color of the background, easiest way to pass this in is in hex format
 *      like: 0xFFFFFF for white
 */
PIXI.Stage.prototype.setBackgroundColor = function(backgroundColor)
{
    this.backgroundColor = backgroundColor || 0x000000;
    this.backgroundColorSplit = PIXI.hex2rgb(this.backgroundColor);
    var hex = this.backgroundColor.toString(16);
    hex = '000000'.substr(0, 6 - hex.length) + hex;
    this.backgroundColorString = '#' + hex;
};

/**
 * This will return the point containing global coords of the mouse.
 *
 * @method getMousePosition
 * @return {Point} The point containing the coords of the global InteractionData position.
 */
PIXI.Stage.prototype.getMousePosition = function()
{
    return this.interactionManager.mouse.global;
};

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

// MIT license

/**
 * A polyfill for requestAnimationFrame
 *
 * @method requestAnimationFrame
 */
/**
 * A polyfill for cancelAnimationFrame
 *
 * @method cancelAnimationFrame
 */
var lastTime = 0;
var vendors = ['ms', 'moz', 'webkit', 'o'];
for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
    window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
    window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||
        window[vendors[x] + 'CancelRequestAnimationFrame'];
}

if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
        var currTime = new Date().getTime();
        var timeToCall = Math.max(0, 16 - (currTime - lastTime));
        var id = window.setTimeout(function() { callback(currTime + timeToCall); },
          timeToCall);
        lastTime = currTime + timeToCall;
        return id;
    };
}

if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function(id) {
        clearTimeout(id);
    };
}

window.requestAnimFrame = window.requestAnimationFrame;

/**
 * Converts a hex color number to an [R, G, B] array
 *
 * @method hex2rgb
 * @param hex {Number}
 */
PIXI.hex2rgb = function(hex) {
    return [(hex >> 16 & 0xFF) / 255, ( hex >> 8 & 0xFF) / 255, (hex & 0xFF)/ 255];
};


PIXI.rgb2hex = function(rgb) {
    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
};

/**
 * A polyfill for Function.prototype.bind
 *
 * @method bind
 */
if (typeof Function.prototype.bind !== 'function') {
    Function.prototype.bind = (function () {
        var slice = Array.prototype.slice;
        return function (thisArg) {
            var target = this, boundArgs = slice.call(arguments, 1);

            if (typeof target !== 'function') throw new TypeError();

            function bound() {
                var args = boundArgs.concat(slice.call(arguments));
                target.apply(this instanceof bound ? this : thisArg, args);
            }

            bound.prototype = (function F(proto) {
                if (proto) F.prototype = proto;
                if (!(this instanceof F)) return new F();
            })(target.prototype);

            return bound;
        };
    })();
}

/**
 * A wrapper for ajax requests to be handled cross browser
 *
 * @class AjaxRequest
 * @constructor
 */
PIXI.AjaxRequest = function AjaxRequest()
{
    var activexmodes = ['Msxml2.XMLHTTP.6.0', 'Msxml2.XMLHTTP.3.0', 'Microsoft.XMLHTTP']; //activeX versions to check for in IE

    if (window.ActiveXObject)
    { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
        for (var i=0; i<activexmodes.length; i++)
        {
            try{
                return new window.ActiveXObject(activexmodes[i]);
            }
            catch(e) {
                //suppress error
            }
        }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
    {
        return new window.XMLHttpRequest();
    }
    else
    {
        return false;
    }
};
/*
PIXI.packColorRGBA = function(r, g, b, a)//r, g, b, a)
{
  //  console.log(r, b, c, d)
  return (Math.floor((r)*63) << 18) | (Math.floor((g)*63) << 12) | (Math.floor((b)*63) << 6);// | (Math.floor((a)*63))
  //  i = i | (Math.floor((a)*63));
   // return i;
   // var r = (i / 262144.0 ) / 64;
   // var g = (i / 4096.0)%64 / 64;
  //  var b = (i / 64.0)%64 / 64;
  //  var a = (i)%64 / 64;
     
  //  console.log(r, g, b, a);
  //  return i;

};
*/
/*
PIXI.packColorRGB = function(r, g, b)//r, g, b, a)
{
    return (Math.floor((r)*255) << 16) | (Math.floor((g)*255) << 8) | (Math.floor((b)*255));
};

PIXI.unpackColorRGB = function(r, g, b)//r, g, b, a)
{
    return (Math.floor((r)*255) << 16) | (Math.floor((g)*255) << 8) | (Math.floor((b)*255));
};
*/

PIXI.canUseNewCanvasBlendModes = function()
{
    var canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    var context = canvas.getContext('2d');
    context.fillStyle = '#000';
    context.fillRect(0,0,1,1);
    context.globalCompositeOperation = 'multiply';
    context.fillStyle = '#fff';
    context.fillRect(0,0,1,1);
    return context.getImageData(0,0,1,1).data[0] === 0;
};

// this function is taken from Starling Framework as its pretty neat ;)
PIXI.getNextPowerOfTwo = function(number)
{
    if (number > 0 && (number & (number - 1)) === 0) // see: http://goo.gl/D9kPj
        return number;
    else
    {
        var result = 1;
        while (result < number) result <<= 1;
        return result;
    }
};



/**
 * https://github.com/mrdoob/eventtarget.js/
 * THankS mr DOob!
 */

/**
 * Adds event emitter functionality to a class
 *
 * @class EventTarget
 * @example
 *      function MyEmitter() {
 *          PIXI.EventTarget.call(this); //mixes in event target stuff
 *      }
 *
 *      var em = new MyEmitter();
 *      em.emit({ type: 'eventName', data: 'some data' });
 */
PIXI.EventTarget = function () {

    var listeners = {};

    this.addEventListener = this.on = function ( type, listener ) {


        if ( listeners[ type ] === undefined ) {

            listeners[ type ] = [];

        }

        if ( listeners[ type ].indexOf( listener ) === - 1 ) {

            listeners[ type ].push( listener );
        }

    };

    this.dispatchEvent = this.emit = function ( event ) {

        if ( !listeners[ event.type ] || !listeners[ event.type ].length ) {

            return;

        }

        for(var i = 0, l = listeners[ event.type ].length; i < l; i++) {

            listeners[ event.type ][ i ]( event );

        }

    };

    this.removeEventListener = this.off = function ( type, listener ) {

        var index = listeners[ type ].indexOf( listener );

        if ( index !== - 1 ) {

            listeners[ type ].splice( index, 1 );

        }

    };

	this.removeAllEventListeners = function( type ) {
		var a = listeners[type];
		if (a)
			a.length = 0;
	};
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * This helper function will automatically detect which renderer you should be using.
 * WebGL is the preferred renderer as it is a lot fastest. If webGL is not supported by
 * the browser then this function will return a canvas renderer
 *
 * @method autoDetectRenderer
 * @static
 * @param width {Number} the width of the renderers view
 * @param height {Number} the height of the renderers view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in webGL chrome at the moment)
 *
 * antialias
 */
PIXI.autoDetectRenderer = function(width, height, view, transparent, antialias)
{
    if(!width)width = 800;
    if(!height)height = 600;

    // BORROWED from Mr Doob (mrdoob.com)
    var webgl = ( function () { try {
                                    var canvas = document.createElement( 'canvas' );
                                    return !! window.WebGLRenderingContext && ( canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ) );
                                } catch( e ) {
                                    return false;
                                }
                            } )();

    if(webgl)
    {
        var ie =  (navigator.userAgent.toLowerCase().indexOf('trident') !== -1);
        webgl = !ie;
    }

    //console.log(webgl);
    if( webgl )
    {
        return new PIXI.WebGLRenderer(width, height, view, transparent, antialias);
    }

    return  new PIXI.CanvasRenderer(width, height, view, transparent);
};

/*
    PolyK library
    url: http://polyk.ivank.net
    Released under MIT licence.

    Copyright (c) 2012 Ivan Kuckir

    Permission is hereby granted, free of charge, to any person
    obtaining a copy of this software and associated documentation
    files (the "Software"), to deal in the Software without
    restriction, including without limitation the rights to use,
    copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the
    Software is furnished to do so, subject to the following
    conditions:

    The above copyright notice and this permission notice shall be
    included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
    EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
    OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
    NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
    HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
    FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
    OTHER DEALINGS IN THE SOFTWARE.

    This is an amazing lib!

    slightly modified by mat groves (matgroves.com);
*/

PIXI.PolyK = {};

/**
 * Triangulates shapes for webGL graphic fills
 *
 * @method Triangulate
 * @namespace PolyK
 * @constructor
 */
PIXI.PolyK.Triangulate = function(p)
{
    var sign = true;

    var n = p.length >> 1;
    if(n < 3) return [];

    var tgs = [];
    var avl = [];
    for(var i = 0; i < n; i++) avl.push(i);

    i = 0;
    var al = n;
    while(al > 3)
    {
        var i0 = avl[(i+0)%al];
        var i1 = avl[(i+1)%al];
        var i2 = avl[(i+2)%al];

        var ax = p[2*i0],  ay = p[2*i0+1];
        var bx = p[2*i1],  by = p[2*i1+1];
        var cx = p[2*i2],  cy = p[2*i2+1];

        var earFound = false;
        if(PIXI.PolyK._convex(ax, ay, bx, by, cx, cy, sign))
        {
            earFound = true;
            for(var j = 0; j < al; j++)
            {
                var vi = avl[j];
                if(vi === i0 || vi === i1 || vi === i2) continue;

                if(PIXI.PolyK._PointInTriangle(p[2*vi], p[2*vi+1], ax, ay, bx, by, cx, cy)) {
                    earFound = false;
                    break;
                }
            }
        }

        if(earFound)
        {
            tgs.push(i0, i1, i2);
            avl.splice((i+1)%al, 1);
            al--;
            i = 0;
        }
        else if(i++ > 3*al)
        {
            // need to flip flip reverse it!
            // reset!
            if(sign)
            {
                tgs = [];
                avl = [];
                for(i = 0; i < n; i++) avl.push(i);

                i = 0;
                al = n;

                sign = false;
            }
            else
            {
                window.console.log("PIXI Warning: shape too complex to fill");
                return [];
            }
        }
    }

    tgs.push(avl[0], avl[1], avl[2]);
    return tgs;
};

/**
 * Checks if a point is within a triangle
 *
 * @class _PointInTriangle
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._PointInTriangle = function(px, py, ax, ay, bx, by, cx, cy)
{
    var v0x = cx-ax;
    var v0y = cy-ay;
    var v1x = bx-ax;
    var v1y = by-ay;
    var v2x = px-ax;
    var v2y = py-ay;

    var dot00 = v0x*v0x+v0y*v0y;
    var dot01 = v0x*v1x+v0y*v1y;
    var dot02 = v0x*v2x+v0y*v2y;
    var dot11 = v1x*v1x+v1y*v1y;
    var dot12 = v1x*v2x+v1y*v2y;

    var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);
    var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
    var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

    // Check if point is in triangle
    return (u >= 0) && (v >= 0) && (u + v < 1);
};

/**
 * Checks if a shape is convex
 *
 * @class _convex
 * @namespace PolyK
 * @private
 */
PIXI.PolyK._convex = function(ax, ay, bx, by, cx, cy, sign)
{
    return ((ay-by)*(cx-bx) + (bx-ax)*(cy-by) >= 0) === sign;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.initDefaultShaders = function()
{
   
  //  PIXI.stripShader = new PIXI.StripShader();
//    PIXI.stripShader.init();

};

PIXI.CompileVertexShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.VERTEX_SHADER);
};

PIXI.CompileFragmentShader = function(gl, shaderSrc)
{
    return PIXI._CompileShader(gl, shaderSrc, gl.FRAGMENT_SHADER);
};

PIXI._CompileShader = function(gl, shaderSrc, shaderType)
{
    var src = shaderSrc.join("\n");
    var shader = gl.createShader(shaderType);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        window.console.log(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
};

PIXI.compileProgram = function(gl, vertexSrc, fragmentSrc)
{
    //var gl = PIXI.gl;
    var fragmentShader = PIXI.CompileFragmentShader(gl, fragmentSrc);
    var vertexShader = PIXI.CompileVertexShader(gl, vertexSrc);

    var shaderProgram = gl.createProgram();

    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        window.console.log("Could not initialise shaders");
    }

    return shaderProgram;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Richard Davey http://www.photonstorm.com @photonstorm
 */

/**
* @class PIXI.PixiShader
* @constructor
*/
PIXI.PixiShader = function(gl)
{
    this.gl = gl;

    /**
    * @property {any} program - The WebGL program.
    */
    this.program = null;

    /**
    * @property {array} fragmentSrc - The fragment shader.
    */
    this.fragmentSrc = [
        'precision lowp float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * vColor ;',
        '}'
    ];


    /**
    * @property {number} textureCount - A local texture counter for multi-texture shaders.
    */
    this.textureCount = 0;


    this.init();
};

/**
* @method PIXI.PixiShader#init
*/
PIXI.PixiShader.prototype.init = function()
{

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc || PIXI.PixiShader.defaultVertexSrc, this.fragmentSrc);
    
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.dimensions = gl.getUniformLocation(program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');


    // Begin worst hack eva //

    // WHY??? ONLY on my chrome pixel the line above returns -1 when using filters?
    // maybe its somthing to do with the current state of the gl context.
    // Im convinced this is a bug in the chrome browser as there is NO reason why this should be returning -1 especially as it only manifests on my chrome pixel
    // If theres any webGL people that know why could happen please help :)
    if(this.colorAttribute === -1)
    {
        this.colorAttribute = 2;
    }

    // End worst hack eva //

    // add those custom shaders!
    for (var key in this.uniforms)
    {
        // get the uniform locations..
        this.uniforms[key].uniformLocation = gl.getUniformLocation(program, key);
    }

    this.initUniforms();

    this.program = program;
};

/**
* Initialises the shader uniform values.
* Uniforms are specified in the GLSL_ES Specification: http://www.khronos.org/registry/webgl/specs/latest/1.0/
* http://www.khronos.org/registry/gles/specs/2.0/GLSL_ES_Specification_1.0.17.pdf
*
* @method PIXI.PixiShader#initUniforms
*/
PIXI.PixiShader.prototype.initUniforms = function()
{
    this.textureCount = 1;
    var gl = this.gl;
    var uniform;

    for (var key in this.uniforms)
    {
        uniform = this.uniforms[key];

        var type = uniform.type;

        if (type === 'sampler2D')
        {
            uniform._init = false;

            if (uniform.value !== null)
            {
                this.initSampler2D(uniform);
            }
        }
        else if (type === 'mat2' || type === 'mat3' || type === 'mat4')
        {
            //  These require special handling
            uniform.glMatrix = true;
            uniform.glValueLength = 1;

            if (type === 'mat2')
            {
                uniform.glFunc = gl.uniformMatrix2fv;
            }
            else if (type === 'mat3')
            {
                uniform.glFunc = gl.uniformMatrix3fv;
            }
            else if (type === 'mat4')
            {
                uniform.glFunc = gl.uniformMatrix4fv;
            }
        }
        else
        {
            //  GL function reference
            uniform.glFunc = gl['uniform' + type];

            if (type === '2f' || type === '2i')
            {
                uniform.glValueLength = 2;
            }
            else if (type === '3f' || type === '3i')
            {
                uniform.glValueLength = 3;
            }
            else if (type === '4f' || type === '4i')
            {
                uniform.glValueLength = 4;
            }
            else
            {
                uniform.glValueLength = 1;
            }
        }
    }

};

/**
* Initialises a Sampler2D uniform (which may only be available later on after initUniforms once the texture is has loaded)
*
* @method PIXI.PixiShader#initSampler2D
*/
PIXI.PixiShader.prototype.initSampler2D = function(uniform)
{
    if (!uniform.value || !uniform.value.baseTexture || !uniform.value.baseTexture.hasLoaded)
    {
        return;
    }

    var gl = this.gl;

    gl.activeTexture(gl['TEXTURE' + this.textureCount]);
    gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTexture);

    //  Extended texture data
    if (uniform.textureData)
    {
        var data = uniform.textureData;

        // GLTexture = mag linear, min linear_mipmap_linear, wrap repeat + gl.generateMipmap(gl.TEXTURE_2D);
        // GLTextureLinear = mag/min linear, wrap clamp
        // GLTextureNearestRepeat = mag/min NEAREST, wrap repeat
        // GLTextureNearest = mag/min nearest, wrap clamp
        // AudioTexture = whatever + luminance + width 512, height 2, border 0
        // KeyTexture = whatever + luminance + width 256, height 2, border 0

        //  magFilter can be: gl.LINEAR, gl.LINEAR_MIPMAP_LINEAR or gl.NEAREST
        //  wrapS/T can be: gl.CLAMP_TO_EDGE or gl.REPEAT

        var magFilter = (data.magFilter) ? data.magFilter : gl.LINEAR;
        var minFilter = (data.minFilter) ? data.minFilter : gl.LINEAR;
        var wrapS = (data.wrapS) ? data.wrapS : gl.CLAMP_TO_EDGE;
        var wrapT = (data.wrapT) ? data.wrapT : gl.CLAMP_TO_EDGE;
        var format = (data.luminance) ? gl.LUMINANCE : gl.RGBA;

        if (data.repeat)
        {
            wrapS = gl.REPEAT;
            wrapT = gl.REPEAT;
        }

        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

        if (data.width)
        {
            var width = (data.width) ? data.width : 512;
            var height = (data.height) ? data.height : 2;
            var border = (data.border) ? data.border : 0;

            // void texImage2D(GLenum target, GLint level, GLenum internalformat, GLsizei width, GLsizei height, GLint border, GLenum format, GLenum type, ArrayBufferView? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, width, height, border, format, gl.UNSIGNED_BYTE, null);
        }
        else
        {
            //  void texImage2D(GLenum target, GLint level, GLenum internalformat, GLenum format, GLenum type, ImageData? pixels);
            gl.texImage2D(gl.TEXTURE_2D, 0, format, gl.RGBA, gl.UNSIGNED_BYTE, uniform.value.baseTexture.source);
        }

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    }

    gl.uniform1i(uniform.uniformLocation, this.textureCount);

    uniform._init = true;

    this.textureCount++;

};

/**
* Updates the shader uniform values.
*
* @method PIXI.PixiShader#syncUniforms
*/
PIXI.PixiShader.prototype.syncUniforms = function()
{
    this.textureCount = 1;
    var uniform;
    var gl = this.gl;

    //  This would probably be faster in an array and it would guarantee key order
    for (var key in this.uniforms)
    {

        uniform = this.uniforms[key];

        if (uniform.glValueLength === 1)
        {
            if (uniform.glMatrix === true)
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.transpose, uniform.value);
            }
            else
            {
                uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value);
            }
        }
        else if (uniform.glValueLength === 2)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y);
        }
        else if (uniform.glValueLength === 3)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z);
        }
        else if (uniform.glValueLength === 4)
        {
            uniform.glFunc.call(gl, uniform.uniformLocation, uniform.value.x, uniform.value.y, uniform.value.z, uniform.value.w);
        }
        else if (uniform.type === 'sampler2D')
        {
            if (uniform._init)
            {
                gl.activeTexture(gl['TEXTURE' + this.textureCount]);
                gl.bindTexture(gl.TEXTURE_2D, uniform.value.baseTexture._glTextures[gl.id] || PIXI.createWebGLTexture( uniform.value.baseTexture, gl));
                gl.uniform1i(uniform.uniformLocation, this.textureCount);
                this.textureCount++;
            }
            else
            {
                this.initSampler2D(uniform);
            }
        }
    }

};

PIXI.PixiShader.defaultVertexSrc = [
    'attribute vec2 aVertexPosition;',
    'attribute vec2 aTextureCoord;',
    'attribute vec2 aColor;',

    'uniform vec2 projectionVector;',
    'uniform vec2 offsetVector;',

    'varying vec2 vTextureCoord;',
    'varying vec4 vColor;',

    'const vec2 center = vec2(-1.0, 1.0);',

    'void main(void) {',
    '   gl_Position = vec4( ((aVertexPosition + offsetVector) / projectionVector) + center , 0.0, 1.0);',
    '   vTextureCoord = aTextureCoord;',
    '   vec3 color = mod(vec3(aColor.y/65536.0, aColor.y/256.0, aColor.y), 256.0) / 256.0;',
    '   vColor = vec4(color * aColor.x, aColor.x);',
    '}'
];



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.StripShader = function()
{
    // the webGL program..
    this.program = null;

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying float vColor;',
        'uniform float alpha;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x, vTextureCoord.y));',
        '   gl_FragColor = gl_FragColor * alpha;',
        '}'
    ];

    this.vertexSrc = [
        'attribute vec2 aVertexPosition;',
        'attribute vec2 aTextureCoord;',
        'attribute float aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'varying vec2 vTextureCoord;',
        'uniform vec2 offsetVector;',
        'varying float vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition, 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vTextureCoord = aTextureCoord;',
        '   vColor = aColor;',
        '}'
    ];
};

PIXI.StripShader.prototype.init = function()
{

    var gl = PIXI.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.uSampler = gl.getUniformLocation(program, 'uSampler');
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');
    //this.dimensions = gl.getUniformLocation(this.program, 'dimensions');

    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.aTextureCoord = gl.getAttribLocation(program, 'aTextureCoord');

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.PrimitiveShader = function(gl)
{
    this.gl = gl;

    // the webGL program..
    this.program = null;

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   gl_FragColor = vColor;',
        '}'
    ];

    this.vertexSrc  = [
        'attribute vec2 aVertexPosition;',
        'attribute vec4 aColor;',
        'uniform mat3 translationMatrix;',
        'uniform vec2 projectionVector;',
        'uniform vec2 offsetVector;',
        'uniform float alpha;',
        'uniform vec3 tint;',
        'varying vec4 vColor;',

        'void main(void) {',
        '   vec3 v = translationMatrix * vec3(aVertexPosition , 1.0);',
        '   v -= offsetVector.xyx;',
        '   gl_Position = vec4( v.x / projectionVector.x -1.0, v.y / -projectionVector.y + 1.0 , 0.0, 1.0);',
        '   vColor = aColor * vec4(tint * alpha, alpha);',
        '}'
    ];

    this.init();
};

PIXI.PrimitiveShader.prototype.init = function()
{

    var gl = this.gl;

    var program = PIXI.compileProgram(gl, this.vertexSrc, this.fragmentSrc);
    gl.useProgram(program);

    // get and store the uniforms for the shader
    this.projectionVector = gl.getUniformLocation(program, 'projectionVector');
    this.offsetVector = gl.getUniformLocation(program, 'offsetVector');
    this.tintColor = gl.getUniformLocation(program, 'tint');


    // get and store the attributes
    this.aVertexPosition = gl.getAttribLocation(program, 'aVertexPosition');
    this.colorAttribute = gl.getAttribLocation(program, 'aColor');

    this.translationMatrix = gl.getUniformLocation(program, 'translationMatrix');
    this.alpha = gl.getUniformLocation(program, 'alpha');

    this.program = program;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A set of functions used by the webGL renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.WebGLGraphics = function()
{

};

/**
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param projection {Object}
 */
PIXI.WebGLGraphics.renderGraphics = function(graphics, renderSession)//projection, offset)
{
    var gl = renderSession.gl;
    var projection = renderSession.projection,
        offset = renderSession.offset,
        shader = renderSession.shaderManager.primitiveShader;

    if(!graphics._webGL[gl.id])graphics._webGL[gl.id] = {points:[], indices:[], lastIndex:0,
                                           buffer:gl.createBuffer(),
                                           indexBuffer:gl.createBuffer()};

    var webGL = graphics._webGL[gl.id];

    if(graphics.dirty)
    {
        graphics.dirty = false;

        if(graphics.clearDirty)
        {
            graphics.clearDirty = false;

            webGL.lastIndex = 0;
            webGL.points = [];
            webGL.indices = [];

        }

        PIXI.WebGLGraphics.updateGraphics(graphics, gl);
    }

    renderSession.shaderManager.activatePrimitiveShader();

    // This  could be speeded up fo sure!
    var m = PIXI.mat3.clone(graphics.worldTransform);

    PIXI.mat3.transpose(m);

    // set the matrix transform for the
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    gl.uniformMatrix3fv(shader.translationMatrix, false, m);

    gl.uniform2f(shader.projectionVector, projection.x, -projection.y);
    gl.uniform2f(shader.offsetVector, -offset.x, -offset.y);

    gl.uniform3fv(shader.tintColor, PIXI.hex2rgb(graphics.tint));

    gl.uniform1f(shader.alpha, graphics.worldAlpha);
    gl.bindBuffer(gl.ARRAY_BUFFER, webGL.buffer);

    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 4 * 6, 0);
    gl.vertexAttribPointer(shader.colorAttribute, 4, gl.FLOAT, false,4 * 6, 2 * 4);

    // set the index buffer!
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGL.indexBuffer);

    gl.drawElements(gl.TRIANGLE_STRIP,  webGL.indices.length, gl.UNSIGNED_SHORT, 0 );

    renderSession.shaderManager.deactivatePrimitiveShader();

    // return to default shader...
//  PIXI.activateShader(PIXI.defaultShader);
};

/**
 * Updates the graphics object
 *
 * @static
 * @private
 * @method updateGraphics
 * @param graphics {Graphics}
 */
PIXI.WebGLGraphics.updateGraphics = function(graphics, gl)
{
    var webGL = graphics._webGL[gl.id];
    
    for (var i = webGL.lastIndex; i < graphics.graphicsData.length; i++)
    {
        var data = graphics.graphicsData[i];

        if(data.type === PIXI.Graphics.POLY)
        {
            if(data.fill)
            {
                if(data.points.length>3)
                    PIXI.WebGLGraphics.buildPoly(data, webGL);
            }

            if(data.lineWidth > 0)
            {
                PIXI.WebGLGraphics.buildLine(data, webGL);
            }
        }
        else if(data.type === PIXI.Graphics.RECT)
        {
            PIXI.WebGLGraphics.buildRectangle(data, webGL);
        }
        else if(data.type === PIXI.Graphics.CIRC || data.type === PIXI.Graphics.ELIP)
        {
            PIXI.WebGLGraphics.buildCircle(data, webGL);
        }
    }

    webGL.lastIndex = graphics.graphicsData.length;

   

    webGL.glPoints = new Float32Array(webGL.points);

    gl.bindBuffer(gl.ARRAY_BUFFER, webGL.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, webGL.glPoints, gl.STATIC_DRAW);

    webGL.glIndicies = new Uint16Array(webGL.indices);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, webGL.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, webGL.glIndicies, gl.STATIC_DRAW);
};

/**
 * Builds a rectangle to draw
 *
 * @static
 * @private
 * @method buildRectangle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildRectangle = function(graphicsData, webGLData)
{
    // --- //
    // need to convert points to a nice regular data
    //
    var rectData = graphicsData.points;
    var x = rectData[0];
    var y = rectData[1];
    var width = rectData[2];
    var height = rectData[3];


    if(graphicsData.fill)
    {
        var color = PIXI.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vertPos = verts.length/6;

        // start
        verts.push(x, y);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y);
        verts.push(r, g, b, alpha);

        verts.push(x , y + height);
        verts.push(r, g, b, alpha);

        verts.push(x + width, y + height);
        verts.push(r, g, b, alpha);

        // insert 2 dead triangles..
        indices.push(vertPos, vertPos, vertPos+1, vertPos+2, vertPos+3, vertPos+3);
    }

    if(graphicsData.lineWidth)
    {
        graphicsData.points = [x, y,
                  x + width, y,
                  x + width, y + height,
                  x, y + height,
                  x, y];

        PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
    }
};

/**
 * Builds a circle to draw
 *
 * @static
 * @private
 * @method buildCircle
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildCircle = function(graphicsData, webGLData)
{
    // --- //
    // need to convert points to a nice regular data
    //
    var rectData = graphicsData.points;
    var x = rectData[0];
    var y = rectData[1];
    var width = rectData[2];
    var height = rectData[3];

    var totalSegs = 40;
    var seg = (Math.PI * 2) / totalSegs ;

    var i = 0;

    if(graphicsData.fill)
    {
        var color = PIXI.hex2rgb(graphicsData.fillColor);
        var alpha = graphicsData.fillAlpha;

        var r = color[0] * alpha;
        var g = color[1] * alpha;
        var b = color[2] * alpha;

        var verts = webGLData.points;
        var indices = webGLData.indices;

        var vecPos = verts.length/6;

        indices.push(vecPos);

        for (i = 0; i < totalSegs + 1 ; i++)
        {
            verts.push(x,y, r, g, b, alpha);

            verts.push(x + Math.sin(seg * i) * width,
                       y + Math.cos(seg * i) * height,
                       r, g, b, alpha);

            indices.push(vecPos++, vecPos++);
        }

        indices.push(vecPos-1);
    }

    if(graphicsData.lineWidth)
    {
        graphicsData.points = [];

        for (i = 0; i < totalSegs + 1; i++)
        {
            graphicsData.points.push(x + Math.sin(seg * i) * width,
                                     y + Math.cos(seg * i) * height);
        }

        PIXI.WebGLGraphics.buildLine(graphicsData, webGLData);
    }
};

/**
 * Builds a line to draw
 *
 * @static
 * @private
 * @method buildLine
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildLine = function(graphicsData, webGLData)
{
    // TODO OPTIMISE!
    var i = 0;

    var points = graphicsData.points;
    if(points.length === 0)return;

    // if the line width is an odd number add 0.5 to align to a whole pixel
    if(graphicsData.lineWidth%2)
    {
        for (i = 0; i < points.length; i++) {
            points[i] += 0.5;
        }
    }

    // get first and last point.. figure out the middle!
    var firstPoint = new PIXI.Point( points[0], points[1] );
    var lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

    // if the first point is the last point - goona have issues :)
    if(firstPoint.x === lastPoint.x && firstPoint.y === lastPoint.y)
    {
        points.pop();
        points.pop();

        lastPoint = new PIXI.Point( points[points.length - 2], points[points.length - 1] );

        var midPointX = lastPoint.x + (firstPoint.x - lastPoint.x) *0.5;
        var midPointY = lastPoint.y + (firstPoint.y - lastPoint.y) *0.5;

        points.unshift(midPointX, midPointY);
        points.push(midPointX, midPointY);
    }

    var verts = webGLData.points;
    var indices = webGLData.indices;
    var length = points.length / 2;
    var indexCount = points.length;
    var indexStart = verts.length/6;

    // DRAW the Line
    var width = graphicsData.lineWidth / 2;

    // sort color
    var color = PIXI.hex2rgb(graphicsData.lineColor);
    var alpha = graphicsData.lineAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var px, py, p1x, p1y, p2x, p2y, p3x, p3y;
    var perpx, perpy, perp2x, perp2y, perp3x, perp3y;
    var a1, b1, c1, a2, b2, c2;
    var denom, pdist, dist;

    p1x = points[0];
    p1y = points[1];

    p2x = points[2];
    p2y = points[3];

    perpx = -(p1y - p2y);
    perpy =  p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);

    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    // start
    verts.push(p1x - perpx , p1y - perpy,
                r, g, b, alpha);

    verts.push(p1x + perpx , p1y + perpy,
                r, g, b, alpha);

    for (i = 1; i < length-1; i++)
    {
        p1x = points[(i-1)*2];
        p1y = points[(i-1)*2 + 1];

        p2x = points[(i)*2];
        p2y = points[(i)*2 + 1];

        p3x = points[(i+1)*2];
        p3y = points[(i+1)*2 + 1];

        perpx = -(p1y - p2y);
        perpy = p1x - p2x;

        dist = Math.sqrt(perpx*perpx + perpy*perpy);
        perpx /= dist;
        perpy /= dist;
        perpx *= width;
        perpy *= width;

        perp2x = -(p2y - p3y);
        perp2y = p2x - p3x;

        dist = Math.sqrt(perp2x*perp2x + perp2y*perp2y);
        perp2x /= dist;
        perp2y /= dist;
        perp2x *= width;
        perp2y *= width;

        a1 = (-perpy + p1y) - (-perpy + p2y);
        b1 = (-perpx + p2x) - (-perpx + p1x);
        c1 = (-perpx + p1x) * (-perpy + p2y) - (-perpx + p2x) * (-perpy + p1y);
        a2 = (-perp2y + p3y) - (-perp2y + p2y);
        b2 = (-perp2x + p2x) - (-perp2x + p3x);
        c2 = (-perp2x + p3x) * (-perp2y + p2y) - (-perp2x + p2x) * (-perp2y + p3y);

        denom = a1*b2 - a2*b1;

        if(Math.abs(denom) < 0.1 )
        {

            denom+=10.1;
            verts.push(p2x - perpx , p2y - perpy,
                r, g, b, alpha);

            verts.push(p2x + perpx , p2y + perpy,
                r, g, b, alpha);

            continue;
        }

        px = (b1*c2 - b2*c1)/denom;
        py = (a2*c1 - a1*c2)/denom;


        pdist = (px -p2x) * (px -p2x) + (py -p2y) + (py -p2y);


        if(pdist > 140 * 140)
        {
            perp3x = perpx - perp2x;
            perp3y = perpy - perp2y;

            dist = Math.sqrt(perp3x*perp3x + perp3y*perp3y);
            perp3x /= dist;
            perp3y /= dist;
            perp3x *= width;
            perp3y *= width;

            verts.push(p2x - perp3x, p2y -perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x + perp3x, p2y +perp3y);
            verts.push(r, g, b, alpha);

            verts.push(p2x - perp3x, p2y -perp3y);
            verts.push(r, g, b, alpha);

            indexCount++;
        }
        else
        {

            verts.push(px , py);
            verts.push(r, g, b, alpha);

            verts.push(p2x - (px-p2x), p2y - (py - p2y));
            verts.push(r, g, b, alpha);
        }
    }

    p1x = points[(length-2)*2];
    p1y = points[(length-2)*2 + 1];

    p2x = points[(length-1)*2];
    p2y = points[(length-1)*2 + 1];

    perpx = -(p1y - p2y);
    perpy = p1x - p2x;

    dist = Math.sqrt(perpx*perpx + perpy*perpy);
    perpx /= dist;
    perpy /= dist;
    perpx *= width;
    perpy *= width;

    verts.push(p2x - perpx , p2y - perpy);
    verts.push(r, g, b, alpha);

    verts.push(p2x + perpx , p2y + perpy);
    verts.push(r, g, b, alpha);

    indices.push(indexStart);

    for (i = 0; i < indexCount; i++)
    {
        indices.push(indexStart++);
    }

    indices.push(indexStart-1);
};

/**
 * Builds a polygon to draw
 *
 * @static
 * @private
 * @method buildPoly
 * @param graphics {Graphics}
 * @param webGLData {Object}
 */
PIXI.WebGLGraphics.buildPoly = function(graphicsData, webGLData)
{
    var points = graphicsData.points;
    if(points.length < 6)return;

    // get first and last point.. figure out the middle!
    var verts = webGLData.points;
    var indices = webGLData.indices;

    var length = points.length / 2;

    // sort color
    var color = PIXI.hex2rgb(graphicsData.fillColor);
    var alpha = graphicsData.fillAlpha;
    var r = color[0] * alpha;
    var g = color[1] * alpha;
    var b = color[2] * alpha;

    var triangles = PIXI.PolyK.Triangulate(points);

    var vertPos = verts.length / 6;

    var i = 0;

    for (i = 0; i < triangles.length; i+=3)
    {
        indices.push(triangles[i] + vertPos);
        indices.push(triangles[i] + vertPos);
        indices.push(triangles[i+1] + vertPos);
        indices.push(triangles[i+2] +vertPos);
        indices.push(triangles[i+2] + vertPos);
    }

    for (i = 0; i < length; i++)
    {
        verts.push(points[i * 2], points[i * 2 + 1],
                   r, g, b, alpha);
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI._defaultFrame = new PIXI.Rectangle(0,0,1,1);

// an instance of the gl context..
// only one at the moment :/
PIXI.gl = null;



/**
 * the WebGLRenderer is draws the stage and all its content onto a webGL enabled canvas. This renderer
 * should be used for browsers support webGL. This Render works by automatically managing webGLBatchs.
 * So no need for Sprite Batch's or Sprite Cloud's
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class WebGLRenderer
 * @constructor
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 * @param antialias=false {Boolean} sets antialias (only applicable in chrome at the moment)
 *
 */
PIXI.WebGLRenderer = function(width, height, view, transparent, antialias)
{
    if(!PIXI.defaultRenderer)PIXI.defaultRenderer = this;

    this.type = PIXI.WEBGL_RENDERER;

    // do a catch.. only 1 webGL renderer..
    this.transparent = !!transparent;

    this.width = width || 800;
    this.height = height || 600;

    this.view = view || document.createElement( 'canvas' );
    this.view.width = this.width;
    this.view.height = this.height;

    // deal with losing context..
    var scope = this;
    this.view.addEventListener('webglcontextlost', function(event) { scope.handleContextLost(event); }, false);
    this.view.addEventListener('webglcontextrestored', function(event) { scope.handleContextRestored(event); }, false);

    this.batchs = [];

    this.options = {
        alpha: this.transparent,
        antialias:!!antialias, // SPEED UP??
        premultipliedAlpha:false,
        stencil:true
    };

    //try 'experimental-webgl'
    try {
        this.gl = this.view.getContext('experimental-webgl',  this.options);
    } catch (e) {
        //try 'webgl'
        try {
            this.gl = this.view.getContext('webgl',  this.options);
        } catch (e2) {
            // fail, not able to get a context
            throw new Error(' This browser does not support webGL. Try using the canvas renderer' + this);
        }
    }

    var gl = this.gl;
    this.glContextId = gl.id = PIXI.WebGLRenderer.glContextId ++;

    if(!PIXI.blendModesWebGL)
    {
        PIXI.blendModesWebGL = [];

        PIXI.blendModesWebGL[PIXI.blendModes.NORMAL]   = [gl.ONE,       gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.ADD]      = [gl.SRC_ALPHA, gl.DST_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.MULTIPLY] = [gl.DST_COLOR, gl.ONE_MINUS_SRC_ALPHA];
        PIXI.blendModesWebGL[PIXI.blendModes.SCREEN]   = [gl.SRC_ALPHA, gl.ONE];
    }




    this.projection = new PIXI.Point();
    this.projection.x =  this.width/2;
    this.projection.y =  -this.height/2;

    this.offset = new PIXI.Point(0, 0);

    this.resize(this.width, this.height);
    this.contextLost = false;

    // time to create the render managers! each one focuses on managine a state in webGL
    this.shaderManager = new PIXI.WebGLShaderManager(gl);                   // deals with managing the shader programs and their attribs
    this.spriteBatch = new PIXI.WebGLSpriteBatch(gl);                       // manages the rendering of sprites
    this.maskManager = new PIXI.WebGLMaskManager(gl);                       // manages the masks using the stencil buffer
    this.filterManager = new PIXI.WebGLFilterManager(gl, this.transparent); // manages the filters

    //
    this.renderSession = {};
    this.renderSession.gl = this.gl;
    this.renderSession.drawCount = 0;
    this.renderSession.shaderManager = this.shaderManager;
    this.renderSession.maskManager = this.maskManager;
    this.renderSession.filterManager = this.filterManager;
    this.renderSession.spriteBatch = this.spriteBatch;


    gl.useProgram(this.shaderManager.defaultShader.program);

    PIXI.WebGLRenderer.gl = gl;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);
};

// constructor
PIXI.WebGLRenderer.prototype.constructor = PIXI.WebGLRenderer;

/**
 * Renders the stage to its webGL view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.WebGLRenderer.prototype.render = function(stage)
{
    if(this.contextLost)return;


    // if rendering a new stage clear the batchs..
    if(this.__stage !== stage)
    {
        // TODO make this work
        // dont think this is needed any more?
        this.__stage = stage;
    }

    // update any textures this includes uvs and uploading them to the gpu
    PIXI.WebGLRenderer.updateTextures();

    // update the scene graph
    stage.updateTransform();

    var gl = this.gl;

    // -- Does this need to be set every frame? -- //
    gl.colorMask(true, true, true, this.transparent);
    gl.viewport(0, 0, this.width, this.height);

    // make sure we are bound to the main frame buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    gl.clearColor(stage.backgroundColorSplit[0],stage.backgroundColorSplit[1],stage.backgroundColorSplit[2], !this.transparent);
    gl.clear(gl.COLOR_BUFFER_BIT);

  //  this.projection.x =  this.width/2;
    //this.projection.y =  -this.height/2;

    this.renderDisplayObject( stage, this.projection );

    // interaction
    if(stage.interactive)
    {
        //need to add some events!
        if(!stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = true;
            stage.interactionManager.setTarget(this);
        }
    }

    /*
    //can simulate context loss in Chrome like so:
     this.view.onmousedown = function(ev) {
     console.dir(this.gl.getSupportedExtensions());
        var ext = (
            gl.getExtension("WEBGL_scompressed_texture_s3tc")
       // gl.getExtension("WEBGL_compressed_texture_s3tc") ||
       // gl.getExtension("MOZ_WEBGL_compressed_texture_s3tc") ||
       // gl.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc")
     );
     console.dir(ext);
     var loseCtx = this.gl.getExtension("WEBGL_lose_context");
      console.log("killing context");
      loseCtx.loseContext();
     setTimeout(function() {
          console.log("restoring context...");
          loseCtx.restoreContext();
      }.bind(this), 1000);
     }.bind(this);
     */
};

PIXI.WebGLRenderer.prototype.renderDisplayObject = function(displayObject, projection)
{
    // reset the render session data..
    this.renderSession.drawCount = 0;
    this.renderSession.currentBlendMode = 9999;

    this.renderSession.projection = projection;
    this.renderSession.offset = this.offset;

    // start the sprite batch
    this.spriteBatch.begin(this.renderSession);

    // start the filter manager
    this.filterManager.begin(this.renderSession, null);

    // render the scene!
    displayObject._renderWebGL(this.renderSession);

    // finish the sprite batch
    this.spriteBatch.end();
};

/**
 * Updates the textures loaded into this webgl renderer
 *
 * @static
 * @method updateTextures
 * @private
 */
PIXI.WebGLRenderer.updateTextures = function()
{
    var i = 0;

    //TODO break this out into a texture manager...
    //for (i = 0; i < PIXI.texturesToUpdate.length; i++)
    //    PIXI.WebGLRenderer.updateTexture(PIXI.texturesToUpdate[i]);


    for (i=0; i < PIXI.Texture.frameUpdates.length; i++)
        PIXI.WebGLRenderer.updateTextureFrame(PIXI.Texture.frameUpdates[i]);

    for (i = 0; i < PIXI.texturesToDestroy.length; i++)
        PIXI.WebGLRenderer.destroyTexture(PIXI.texturesToDestroy[i]);

    PIXI.texturesToUpdate = [];
    PIXI.texturesToDestroy = [];
    PIXI.Texture.frameUpdates = [];
};

/**
 * Updates a loaded webgl texture
 *
 * @static
 * @method updateTexture
 * @param texture {Texture} The texture to update
 * @private
 */

 /*
PIXI.WebGLRenderer.updateTexture = function(texture)
{
    //TODO break this out into a texture manager...
    var gl = this.gl;

    if(!texture._glTexture)
    {
        texture._glTexture = gl.createTexture();
    }

    if(texture.hasLoaded)
    {
        gl.bindTexture(gl.TEXTURE_2D, texture._glTexture);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);

        // reguler...

        if(!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
};
*/

/**
 * Destroys a loaded webgl texture
 *
 * @method destroyTexture
 * @param texture {Texture} The texture to update
 * @private
 */
PIXI.WebGLRenderer.destroyTexture = function(texture)
{
    //TODO break this out into a texture manager...
    var gl = PIXI.gl;

    if(texture._glTexture)
    {
        texture._glTexture = gl.createTexture();
        gl.deleteTexture(gl.TEXTURE_2D, texture._glTexture);
    }
};

PIXI.WebGLRenderer.updateTextureFrame = function(texture)
{
    texture.updateFrame = false;

    // now set the uvs. Figured that the uv data sits with a texture rather than a sprite.
    // so uv data is stored on the texture itself
    texture._updateWebGLuvs();
};

/**
 * resizes the webGL view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the webGL view
 * @param height {Number} the new height of the webGL view
 */
PIXI.WebGLRenderer.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.view.width = width;
    this.view.height = height;

    this.gl.viewport(0, 0, this.width, this.height);

    this.projection.x =  this.width/2;
    this.projection.y =  -this.height/2;
};

PIXI.createWebGLTexture = function(texture, gl)
{


    if(texture.hasLoaded)
    {
        texture._glTextures[gl.id] = gl.createTexture();

        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);

        // reguler...

        if(!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
};

PIXI.updateWebGLTexture = function(texture, gl)
{
    if( texture._glTextures[gl.id] )
    {
        gl.bindTexture(gl.TEXTURE_2D, texture._glTextures[gl.id]);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.source);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, texture.scaleMode === PIXI.BaseTexture.SCALE_MODE.LINEAR ? gl.LINEAR : gl.NEAREST);

        // reguler...

        if(!texture._powerOf2)
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        else
        {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        }

        gl.bindTexture(gl.TEXTURE_2D, null);
    }
    
};


/**
 * Handles a lost webgl context
 *
 * @method handleContextLost
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextLost = function(event)
{
    event.preventDefault();
    this.contextLost = true;
};

/**
 * Handles a restored webgl context
 *
 * @method handleContextRestored
 * @param event {Event}
 * @private
 */
PIXI.WebGLRenderer.prototype.handleContextRestored = function()
{

    //try 'experimental-webgl'
    try {
        this.gl = this.view.getContext('experimental-webgl',  this.options);
    } catch (e) {
        //try 'webgl'
        try {
            this.gl = this.view.getContext('webgl',  this.options);
        } catch (e2) {
            // fail, not able to get a context
            throw new Error(' This browser does not support webGL. Try using the canvas renderer' + this);
        }
    }

    var gl = this.gl;
    gl.id = PIXI.WebGLRenderer.glContextId ++;



    // need to set the context...
    this.shaderManager.setContext(gl);
    this.spriteBatch.setContext(gl);
    this.maskManager.setContext(gl);
    this.filterManager.setContext(gl);


    this.renderSession.gl = this.gl;

    gl.disable(gl.DEPTH_TEST);
    gl.disable(gl.CULL_FACE);

    gl.enable(gl.BLEND);
    gl.colorMask(true, true, true, this.transparent);

    this.gl.viewport(0, 0, this.width, this.height);

    for(var key in PIXI.TextureCache)
    {
        var texture = PIXI.TextureCache[key].baseTexture;
        texture._glTextures = [];
    }

    this.contextLost = false;

};

PIXI.WebGLRenderer.glContextId = 0;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */
 
PIXI.WebGLMaskManager = function(gl)
{
    this.maskStack = [];
    this.maskPosition = 0;

    this.setContext(gl);
};

PIXI.WebGLMaskManager.prototype.setContext = function(gl)
{
    this.gl = gl;
};

PIXI.WebGLMaskManager.prototype.pushMask = function(maskData, renderSession)
{
    var gl = this.gl;

    if(this.maskStack.length === 0)
    {
        gl.enable(gl.STENCIL_TEST);
        gl.stencilFunc(gl.ALWAYS,1,1);
    }
    
  //  maskData.visible = false;

    this.maskStack.push(maskData);
    
    gl.colorMask(false, false, false, false);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.INCR);

    PIXI.WebGLGraphics.renderGraphics(maskData, renderSession);

    gl.colorMask(true, true, true, true);
    gl.stencilFunc(gl.NOTEQUAL,0, this.maskStack.length);
    gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
};

PIXI.WebGLMaskManager.prototype.popMask = function(renderSession)
{
    var gl = this.gl;

    var maskData = this.maskStack.pop();

    if(maskData)
    {
        gl.colorMask(false, false, false, false);

        //gl.stencilFunc(gl.ALWAYS,1,1);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.DECR);

        PIXI.WebGLGraphics.renderGraphics(maskData, renderSession);

        gl.colorMask(true, true, true, true);
        gl.stencilFunc(gl.NOTEQUAL,0,this.maskStack.length);
        gl.stencilOp(gl.KEEP,gl.KEEP,gl.KEEP);
    }
   
    if(this.maskStack.length === 0)gl.disable(gl.STENCIL_TEST);
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.WebGLShaderManager = function(gl)
{
    this.setContext(gl);

    // the final one is used for the rendering strips
    //this.stripShader = new PIXI.StripShader(gl);
};

PIXI.WebGLShaderManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    
    // the next one is used for rendering primatives
    this.primitiveShader = new PIXI.PrimitiveShader(gl);

    // this shader is used for the default sprite rendering
    this.defaultShader = new PIXI.PixiShader(gl);

    var shaderProgram = this.defaultShader.program;

    gl.useProgram(shaderProgram);

    gl.enableVertexAttribArray(this.defaultShader.aVertexPosition);
    gl.enableVertexAttribArray(this.defaultShader.colorAttribute);
    gl.enableVertexAttribArray(this.defaultShader.aTextureCoord);

    
};

PIXI.WebGLShaderManager.prototype.activatePrimitiveShader = function()
{
    var gl = this.gl;

    gl.useProgram(this.primitiveShader.program);

    gl.disableVertexAttribArray(this.defaultShader.aVertexPosition);
    gl.disableVertexAttribArray(this.defaultShader.colorAttribute);
    gl.disableVertexAttribArray(this.defaultShader.aTextureCoord);

    gl.enableVertexAttribArray(this.primitiveShader.aVertexPosition);
    gl.enableVertexAttribArray(this.primitiveShader.colorAttribute);
};

PIXI.WebGLShaderManager.prototype.deactivatePrimitiveShader = function()
{
    var gl = this.gl;

    gl.useProgram(this.defaultShader.program);

    gl.disableVertexAttribArray(this.primitiveShader.aVertexPosition);
    gl.disableVertexAttribArray(this.primitiveShader.colorAttribute);

    gl.enableVertexAttribArray(this.defaultShader.aVertexPosition);
    gl.enableVertexAttribArray(this.defaultShader.colorAttribute);
    gl.enableVertexAttribArray(this.defaultShader.aTextureCoord);
};
/**
 * @author Mat Groves
 * 
 * Big thanks to the very clever Matt DesLauriers <mattdesl> https://github.com/mattdesl/
 * for creating the original pixi version!
 *
 * Heavily inspired by LibGDX's WebGLSpriteBatch:
 * https://github.com/libgdx/libgdx/blob/master/gdx/src/com/badlogic/gdx/graphics/g2d/WebGLSpriteBatch.java
 */

PIXI.WebGLSpriteBatch = function(gl)
{
   

    this.size = 2000;
    this.vertSize = 6;

    //the total number of floats in our batch
    var numVerts = this.size * 4 *  this.vertSize;
    //the total number of indices in our batch
    var numIndices = this.size * 6;

     //vertex data
    this.vertices = new Float32Array(numVerts);
    //index data
    this.indices = new Uint16Array(numIndices);
    
    this.lastIndexCount = 0;

    for (var i=0, j=0; i < numIndices; i += 6, j += 4)
    {
        this.indices[i + 0] = j + 0;
        this.indices[i + 1] = j + 1;
        this.indices[i + 2] = j + 2;
        this.indices[i + 3] = j + 0;
        this.indices[i + 4] = j + 2;
        this.indices[i + 5] = j + 3;
    }


    this.drawing = false;
    this.currentBatchSize = 0;
    this.currentBaseTexture = null;
    
    this.setContext(gl);
};

PIXI.WebGLSpriteBatch.prototype.setContext = function(gl)
{
    this.gl = gl;

    // create a couple of buffers
    this.vertexBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();

    // 65535 is max index, so 65535 / 6 = 10922.


    //upload the index data
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

    this.currentBlendMode = 99999;
};

PIXI.WebGLSpriteBatch.prototype.begin = function(renderSession)
{
    this.renderSession = renderSession;
    this.shader = this.renderSession.shaderManager.defaultShader;

    this.start();
};

PIXI.WebGLSpriteBatch.prototype.end = function()
{
    this.flush();
};


PIXI.WebGLSpriteBatch.prototype.render = function(sprite)
{
    // check texture..
    if(sprite.texture.baseTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size)
    {
        this.flush();
        this.currentBaseTexture = sprite.texture.baseTexture;
    }


    // check blend mode
    if(sprite.blendMode !== this.currentBlendMode)
    {
        this.setBlendMode(sprite.blendMode);
    }

    // get the uvs for the texture
    var uvs = sprite._uvs || sprite.texture._uvs;
    // if the uvs have not updated then no point rendering just yet!
    if(!uvs)return;

    // get the sprites current alpha
    var alpha = sprite.worldAlpha;
    var tint = sprite.tint;

    var  verticies = this.vertices;

    var width = sprite.texture.frame.width;
    var height = sprite.texture.frame.height;

    // TODO trim??
    var aX = sprite.anchor.x;
    var aY = sprite.anchor.y;

    var w0, w1, h0, h1;
        
    if (sprite.texture.trimmed)
    {
        // if the sprite is trimmed then we need to add the extra space before transforming the sprite coords..
        var trim = sprite.texture.trim;

        w1 = trim.x - aX * trim.realWidth;
        w0 = w1 + width;

        h1 = trim.y - aY * trim.realHeight;
        h0 = h1 + height;
    }
    else
    {
        w0 = (width ) * (1-aX);
        w1 = (width ) * -aX;

        h0 = height * (1-aY);
        h1 = height * -aY;
    }

    var index = this.currentBatchSize * 4 * this.vertSize;

    var worldTransform = sprite.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    // xy
    verticies[index++] = a * w1 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w1 + ty;
    // uv
    verticies[index++] = uvs[0];
    verticies[index++] = uvs[1];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w0 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w0 + ty;
    // uv
    verticies[index++] = uvs[2];
    verticies[index++] = uvs[3];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w0 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w0 + ty;
    // uv
    verticies[index++] = uvs[4];
    verticies[index++] = uvs[5];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w1 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w1 + ty;
    // uv
    verticies[index++] = uvs[6];
    verticies[index++] = uvs[7];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // increment the batchs
    this.currentBatchSize++;


};

PIXI.WebGLSpriteBatch.prototype.renderTilingSprite = function(tilingSprite)
{
    var texture = tilingSprite.texture;

    if(texture.baseTexture !== this.currentBaseTexture || this.currentBatchSize >= this.size)
    {
        this.flush();
        this.currentBaseTexture = texture.baseTexture;
    }

     // check blend mode
    if(tilingSprite.blendMode !== this.currentBlendMode)
    {
        this.setBlendMode(tilingSprite.blendMode);
    }

     // set the textures uvs temporarily
    // TODO create a seperate texture so that we can tile part of a texture

    if(!tilingSprite._uvs)tilingSprite._uvs = new Float32Array(8);

    var uvs = tilingSprite._uvs;

    var offsetX =  tilingSprite.tilePosition.x/texture.baseTexture.width;
    var offsetY =  tilingSprite.tilePosition.y/texture.baseTexture.height;

    var scaleX =  (tilingSprite.width / texture.baseTexture.width)  / tilingSprite.tileScale.x;
    var scaleY =  (tilingSprite.height / texture.baseTexture.height) / tilingSprite.tileScale.y;

    uvs[0] = 0 - offsetX;
    uvs[1] = 0 - offsetY;

    uvs[2] = (1 * scaleX) - offsetX;
    uvs[3] = 0 - offsetY;

    uvs[4] = (1 * scaleX) - offsetX;
    uvs[5] = (1 * scaleY) - offsetY;

    uvs[6] = 0 - offsetX;
    uvs[7] = (1 *scaleY) - offsetY;

   
    // get the tilingSprites current alpha
    var alpha = tilingSprite.worldAlpha;
    var tint = tilingSprite.tint;

    var  verticies = this.vertices;

    var width = tilingSprite.width;
    var height = tilingSprite.height;

    // TODO trim??
    var aX = tilingSprite.anchor.x; // - tilingSprite.texture.trim.x
    var aY = tilingSprite.anchor.y; //- tilingSprite.texture.trim.y
    var w0 = width * (1-aX);
    var w1 = width * -aX;

    var h0 = height * (1-aY);
    var h1 = height * -aY;

    var index = this.currentBatchSize * 4 * this.vertSize;

    var worldTransform = tilingSprite.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    // xy
    verticies[index++] = a * w1 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w1 + ty;
    // uv
    verticies[index++] = uvs[0];
    verticies[index++] = uvs[1];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w0 + c * h1 + tx;
    verticies[index++] = d * h1 + b * w0 + ty;
    // uv
    verticies[index++] = uvs[2];
    verticies[index++] = uvs[3];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;
    
    // xy
    verticies[index++] = a * w0 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w0 + ty;
    // uv
    verticies[index++] = uvs[4];
    verticies[index++] = uvs[5];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // xy
    verticies[index++] = a * w1 + c * h0 + tx;
    verticies[index++] = d * h0 + b * w1 + ty;
    // uv
    verticies[index++] = uvs[6];
    verticies[index++] = uvs[7];
    // color
    verticies[index++] = alpha;
    verticies[index++] = tint;

    // increment the batchs
    this.currentBatchSize++;
};

PIXI.WebGLSpriteBatch.prototype.flush = function()
{
    // If the batch is length 0 then return as there is nothing to draw
    if (this.currentBatchSize===0)return;

    var gl = this.gl;
    
    // bind the current texture
    gl.bindTexture(gl.TEXTURE_2D, this.currentBaseTexture._glTextures[gl.id] || PIXI.createWebGLTexture(this.currentBaseTexture, gl));

    // upload the verts to the buffer
    var view = this.vertices.subarray(0, this.currentBatchSize * 4 * this.vertSize);
    gl.bufferSubData(gl.ARRAY_BUFFER, 0, view);
    
    // now draw those suckas!
    gl.drawElements(gl.TRIANGLES, this.currentBatchSize * 6, gl.UNSIGNED_SHORT, 0);
   
    // then reset the batch!
    this.currentBatchSize = 0;

    // increment the draw count
    this.renderSession.drawCount++;
};


PIXI.WebGLSpriteBatch.prototype.stop = function()
{
    this.flush();
};

PIXI.WebGLSpriteBatch.prototype.start = function()
{
    var gl = this.gl;

    // bind the main texture
    gl.activeTexture(gl.TEXTURE0);

    // bind the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // set the projection
    var projection = this.renderSession.projection;
    gl.uniform2f(this.shader.projectionVector, projection.x, projection.y);

    // set the pointers
    var stride =  this.vertSize * 4;
    gl.vertexAttribPointer(this.shader.aVertexPosition, 2, gl.FLOAT, false, stride, 0);
    gl.vertexAttribPointer(this.shader.aTextureCoord, 2, gl.FLOAT, false, stride, 2 * 4);
    gl.vertexAttribPointer(this.shader.colorAttribute, 2, gl.FLOAT, false, stride, 4 * 4);

    // set the blend mode..
    if(this.currentBlendMode !== PIXI.blendModes.NORMAL)
    {
        this.setBlendMode(PIXI.blendModes.NORMAL);
    }
};

PIXI.WebGLSpriteBatch.prototype.setBlendMode = function(blendMode)
{
    this.flush();

    this.currentBlendMode = blendMode;
    
    var blendModeWebGL = PIXI.blendModesWebGL[this.currentBlendMode];
    this.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
};



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


PIXI.WebGLFilterManager = function(gl, transparent)
{
    this.transparent = transparent;

    this.filterStack = [];
    
    this.offsetX = 0;
    this.offsetY = 0;

    this.setContext(gl);
};

// API

PIXI.WebGLFilterManager.prototype.setContext = function(gl)
{
    this.gl = gl;
    this.texturePool = [];

    this.initShaderBuffers();
};

PIXI.WebGLFilterManager.prototype.begin = function(renderSession, buffer)
{
    this.renderSession = renderSession;
    this.defaultShader = renderSession.shaderManager.defaultShader;

    var projection = this.renderSession.projection;

    this.width = projection.x * 2;
    this.height = -projection.y * 2;
    this.buffer = buffer;
};

PIXI.WebGLFilterManager.prototype.pushFilter = function(filterBlock)
{
    var gl = this.gl;

    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;


    // filter program
    // OPTIMISATION - the first filter is free if its a simple color change?
    this.filterStack.push(filterBlock);

    var filter = filterBlock.filterPasses[0];

    this.offsetX += filterBlock.target.filterArea.x;
    this.offsetY += filterBlock.target.filterArea.y;

    var texture = this.texturePool.pop();
    if(!texture)
    {
        texture = new PIXI.FilterTexture(this.gl, this.width, this.height);
    }
    else
    {
        texture.resize(this.width, this.height);
    }

    gl.bindTexture(gl.TEXTURE_2D,  texture.texture);

//    this.getBounds(filterBlock.target);

    filterBlock.target.filterArea = filterBlock.target.getBounds();
   // console.log(filterBlock.target.filterArea)
   // console.log(filterBlock.target.filterArea);
    // addpadding?
    //displayObject.filterArea.x

    var filterArea = filterBlock.target.filterArea;

    var padidng = filter.padding;
    filterArea.x -= padidng;
    filterArea.y -= padidng;
    filterArea.width += padidng * 2;
    filterArea.height += padidng * 2;

    // cap filter to screen size..
    if(filterArea.x < 0)filterArea.x = 0;
    if(filterArea.width > this.width)filterArea.width = this.width;
    if(filterArea.y < 0)filterArea.y = 0;
    if(filterArea.height > this.height)filterArea.height = this.height;

    //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  filterArea.width, filterArea.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, texture.frameBuffer);

    //console.log(filterArea)
    // set view port
    gl.viewport(0, 0, filterArea.width, filterArea.height);

    projection.x = filterArea.width/2;
    projection.y = -filterArea.height/2;

    offset.x = -filterArea.x;
    offset.y = -filterArea.y;

    //console.log(PIXI.defaultShader.projectionVector)
    // update projection
    gl.uniform2f(this.defaultShader.projectionVector, filterArea.width/2, -filterArea.height/2);
    gl.uniform2f(this.defaultShader.offsetVector, -filterArea.x, -filterArea.y);
    //PIXI.primitiveProgram

    gl.colorMask(true, true, true, true);
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    //filter.texture = texture;
    filterBlock._glFilterTexture = texture;

    //console.log("PUSH")
};


PIXI.WebGLFilterManager.prototype.popFilter = function()
{
    var gl = this.gl;
    var filterBlock = this.filterStack.pop();
    var filterArea = filterBlock.target.filterArea;
    var texture = filterBlock._glFilterTexture;
    var projection = this.renderSession.projection;
    var offset = this.renderSession.offset;

    if(filterBlock.filterPasses.length > 1)
    {
        gl.viewport(0, 0, filterArea.width, filterArea.height);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        this.vertexArray[0] = 0;
        this.vertexArray[1] = filterArea.height;

        this.vertexArray[2] = filterArea.width;
        this.vertexArray[3] = filterArea.height;

        this.vertexArray[4] = 0;
        this.vertexArray[5] = 0;

        this.vertexArray[6] = filterArea.width;
        this.vertexArray[7] = 0;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        // nnow set the uvs..
        this.uvArray[2] = filterArea.width/this.width;
        this.uvArray[5] = filterArea.height/this.height;
        this.uvArray[6] = filterArea.width/this.width;
        this.uvArray[7] = filterArea.height/this.height;

        gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

        var inputTexture = texture;
        var outputTexture = this.texturePool.pop();
        if(!outputTexture)outputTexture = new PIXI.FilterTexture(this.gl, this.width, this.height);

        // need to clear this FBO as it may have some left over elements from a prvious filter.
        gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );
        gl.clear(gl.COLOR_BUFFER_BIT);

        gl.disable(gl.BLEND);

        for (var i = 0; i < filterBlock.filterPasses.length-1; i++)
        {
            var filterPass = filterBlock.filterPasses[i];

            gl.bindFramebuffer(gl.FRAMEBUFFER, outputTexture.frameBuffer );

            // set texture
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, inputTexture.texture);

            // draw texture..
            //filterPass.applyFilterPass(filterArea.width, filterArea.height);
            this.applyFilterPass(filterPass, filterArea, filterArea.width, filterArea.height);

            // swap the textures..
            var temp = inputTexture;
            inputTexture = outputTexture;
            outputTexture = temp;
        }

        gl.enable(gl.BLEND);

        texture = inputTexture;
        this.texturePool.push(outputTexture);
    }

    var filter = filterBlock.filterPasses[filterBlock.filterPasses.length-1];

    this.offsetX -= filterArea.x;
    this.offsetY -= filterArea.y;


    var sizeX = this.width;
    var sizeY = this.height;

    var offsetX = 0;
    var offsetY = 0;

    var buffer = this.buffer;

    // time to render the filters texture to the previous scene
    if(this.filterStack.length === 0)
    {
        gl.colorMask(true, true, true, this.transparent);
    }
    else
    {
        var currentFilter = this.filterStack[this.filterStack.length-1];
        filterArea = currentFilter.target.filterArea;

        sizeX = filterArea.width;
        sizeY = filterArea.height;

        offsetX = filterArea.x;
        offsetY = filterArea.y;

        buffer =  currentFilter._glFilterTexture.frameBuffer;
    }



    // TODO need toremove thease global elements..
    projection.x = sizeX/2;
    projection.y = -sizeY/2;

    offset.x = offsetX;
    offset.y = offsetY;

    filterArea = filterBlock.target.filterArea;

    var x = filterArea.x-offsetX;
    var y = filterArea.y-offsetY;

    // update the buffers..
    // make sure to flip the y!
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

    this.vertexArray[0] = x;
    this.vertexArray[1] = y + filterArea.height;

    this.vertexArray[2] = x + filterArea.width;
    this.vertexArray[3] = y + filterArea.height;

    this.vertexArray[4] = x;
    this.vertexArray[5] = y;

    this.vertexArray[6] = x + filterArea.width;
    this.vertexArray[7] = y;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.vertexArray);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);

    this.uvArray[2] = filterArea.width/this.width;
    this.uvArray[5] = filterArea.height/this.height;
    this.uvArray[6] = filterArea.width/this.width;
    this.uvArray[7] = filterArea.height/this.height;

    gl.bufferSubData(gl.ARRAY_BUFFER, 0, this.uvArray);

    gl.viewport(0, 0, sizeX, sizeY);
    // bind the buffer
    gl.bindFramebuffer(gl.FRAMEBUFFER, buffer );

    // set the blend mode! 
    //gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA)

    // set texture
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture.texture);

    // apply!
    //filter.applyFilterPass(sizeX, sizeY);
    this.applyFilterPass(filter, filterArea, sizeX, sizeY);

    // now restore the regular shader..
    gl.useProgram(this.defaultShader.program);
    gl.uniform2f(this.defaultShader.projectionVector, sizeX/2, -sizeY/2);
    gl.uniform2f(this.defaultShader.offsetVector, -offsetX, -offsetY);

    // return the texture to the pool
    this.texturePool.push(texture);
    filterBlock._glFilterTexture = null;
};

PIXI.WebGLFilterManager.prototype.applyFilterPass = function(filter, filterArea, width, height)
{
    // use program
    var gl = this.gl;
    var shader = filter.shaders[gl.id];

    if(!shader)
    {
        shader = new PIXI.PixiShader(gl);

        shader.fragmentSrc = filter.fragmentSrc;
        shader.uniforms = filter.uniforms;
        shader.init();

        filter.shaders[gl.id] = shader;
    }

    // set the shader
    gl.useProgram(shader.program);

    gl.uniform2f(shader.projectionVector, width/2, -height/2);
    gl.uniform2f(shader.offsetVector, 0,0);

    if(filter.uniforms.dimensions)
    {
        //console.log(filter.uniforms.dimensions)
        filter.uniforms.dimensions.value[0] = this.width;//width;
        filter.uniforms.dimensions.value[1] = this.height;//height;
        filter.uniforms.dimensions.value[2] = this.vertexArray[0];
        filter.uniforms.dimensions.value[3] = this.vertexArray[5];//filterArea.height;
    //  console.log(this.vertexArray[5])
    }

    shader.syncUniforms();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.vertexAttribPointer(shader.aVertexPosition, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.vertexAttribPointer(shader.aTextureCoord, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.vertexAttribPointer(shader.colorAttribute, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

    // draw the filter...
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0 );

    this.renderSession.drawCount++;
};

PIXI.WebGLFilterManager.prototype.initShaderBuffers = function()
{
    var gl = this.gl;

    // create some buffers
    this.vertexBuffer = gl.createBuffer();
    this.uvBuffer = gl.createBuffer();
    this.colorBuffer = gl.createBuffer();
    this.indexBuffer = gl.createBuffer();


    // bind and upload the vertexs..
    // keep a refferance to the vertexFloatData..
    this.vertexArray = new Float32Array([0.0, 0.0,
                                         1.0, 0.0,
                                         0.0, 1.0,
                                         1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.vertexArray,
    gl.STATIC_DRAW);


    // bind and upload the uv buffer
    this.uvArray = new Float32Array([0.0, 0.0,
                                     1.0, 0.0,
                                     0.0, 1.0,
                                     1.0, 1.0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.uvArray,
    gl.STATIC_DRAW);

    this.colorArray = new Float32Array([1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF,
                                        1.0, 0xFFFFFF]);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(
    gl.ARRAY_BUFFER,
    this.colorArray,
    gl.STATIC_DRAW);

    // bind and upload the index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array([0, 1, 2, 1, 3, 2]),
    gl.STATIC_DRAW);
};

PIXI.FilterTexture = function(gl, width, height)
{
    this.gl = gl;

    // next time to create a frame buffer and texture
    this.frameBuffer = gl.createFramebuffer();
    this.texture = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer );

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuffer );
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);

    this.resize(width, height);
};

PIXI.FilterTexture.prototype.clear = function()
{
    var gl = this.gl;
    
    gl.clearColor(0,0,0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
};

PIXI.FilterTexture.prototype.resize = function(width, height)
{
    if(this.width === width && this.height === height) return;

    this.width = width;
    this.height = height;

    var gl = this.gl;

    gl.bindTexture(gl.TEXTURE_2D,  this.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

};

/**
 * @author Mat Groves
 * 
 * 
 */

PIXI.CanvasMaskManager = function()
{
    
};

PIXI.CanvasMaskManager.prototype.pushMask = function(maskData, context)
{
    context.save();
    
    //maskData.visible = false;
    // maskData.alpha = 0;
    
    var cacheAlpha = maskData.alpha;
    var transform = maskData.worldTransform;

    context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);

    PIXI.CanvasGraphics.renderGraphicsMask(maskData, context);

    context.clip();

    maskData.worldAlpha = cacheAlpha;
};

PIXI.CanvasMaskManager.prototype.popMask = function(context)
{
    context.restore();
};

/**
 * @author Mat Groves
 * 
 * 
 */

PIXI.CanvasTinter = function()
{
    /// this.textureCach
};

//PIXI.CanvasTinter.cachTint = true;
    

PIXI.CanvasTinter.getTintedTexture = function(sprite, color)
{
    //
    // cach on sprite
    // cach on texture
    // no cache

    var texture = sprite.texture;

    color = PIXI.CanvasTinter.roundColor(color);

    var stringColor = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
   
    texture.tintCache = texture.tintCache || {};

    if(texture.tintCache[stringColor]) return texture.tintCache[stringColor];

     // clone texture..
    var canvas = PIXI.CanvasTinter.canvas || document.createElement("canvas");
    
    //PIXI.CanvasTinter.tintWithPerPixel(texture, stringColor, canvas);

    
    PIXI.CanvasTinter.tintMethod(texture, color, canvas);

    if(PIXI.CanvasTinter.convertTintToImage)
    {
        // is this better?
        var tintImage = new Image();
        tintImage.src = canvas.toDataURL();

        texture.tintCache[stringColor] = tintImage;
    }
    else
    {
      
        texture.tintCache[stringColor] = canvas;
        // if we are not converting the texture to an image then we need to lose the refferance to the canvas
        PIXI.CanvasTinter.canvas = null;

    }

    return canvas;
};

PIXI.CanvasTinter.tintWithMultiply = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;

    context.fillStyle = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
    
    context.fillRect(0, 0, frame.width, frame.height);
    
    context.globalCompositeOperation = "multiply";

    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    context.globalCompositeOperation = "destination-atop";
    
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);
};

PIXI.CanvasTinter.tintWithOverlay = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;

    
    
    context.globalCompositeOperation = "copy";
    context.fillStyle = "#" + ("00000" + ( color | 0).toString(16)).substr(-6);
    context.fillRect(0, 0, frame.width, frame.height);

    context.globalCompositeOperation = "destination-atop";
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    
    //context.globalCompositeOperation = "copy";

};


PIXI.CanvasTinter.tintWithPerPixel = function(texture, color, canvas)
{
    var context = canvas.getContext( "2d" );

    var frame = texture.frame;

    canvas.width = frame.width;
    canvas.height = frame.height;
  
    context.globalCompositeOperation = "copy";
    context.drawImage(texture.baseTexture.source,
                           frame.x,
                           frame.y,
                           frame.width,
                           frame.height,
                           0,
                           0,
                           frame.width,
                           frame.height);

    var rgbValues = PIXI.hex2rgb(color);
    var r = rgbValues[0], g = rgbValues[1], b = rgbValues[2];

    var pixelData = context.getImageData(0, 0, frame.width, frame.height);

    var pixels = pixelData.data;

    for (var i = 0; i < pixels.length; i += 4)
    {
        pixels[i+0] *= r;
        pixels[i+1] *= g;
        pixels[i+2] *= b;
    }

    context.putImageData(pixelData, 0, 0);
};

PIXI.CanvasTinter.roundColor = function(color)
{
    var step = PIXI.CanvasTinter.cacheStepsPerColorChannel;

    var rgbValues = PIXI.hex2rgb(color);

    rgbValues[0] = Math.round(rgbValues[0] * step) / step;
    rgbValues[1] = Math.round(rgbValues[1] * step) / step;
    rgbValues[2] = Math.round(rgbValues[2] * step) / step;

    return PIXI.rgb2hex(rgbValues);
};

PIXI.CanvasTinter.cacheStepsPerColorChannel = 8;
PIXI.CanvasTinter.convertTintToImage = false;

PIXI.CanvasTinter.canUseMultiply = PIXI.canUseNewCanvasBlendModes();

PIXI.CanvasTinter.tintMethod = PIXI.CanvasTinter.canUseMultiply ? PIXI.CanvasTinter.tintWithMultiply :  PIXI.CanvasTinter.tintWithPerPixel;



/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * the CanvasRenderer draws the stage and all its content onto a 2d canvas. This renderer should be used for browsers that do not support webGL.
 * Dont forget to add the view to your DOM or you will not see anything :)
 *
 * @class CanvasRenderer
 * @constructor
 * @param width=0 {Number} the width of the canvas view
 * @param height=0 {Number} the height of the canvas view
 * @param view {Canvas} the canvas to use as a view, optional
 * @param transparent=false {Boolean} the transparency of the render view, default false
 */
PIXI.CanvasRenderer = function(width, height, view, transparent)
{
    PIXI.defaultRenderer = PIXI.defaultRenderer || this;

    this.type = PIXI.CANVAS_RENDERER;

    this.transparent = transparent;

    if(!PIXI.blendModesCanvas)
    {
        PIXI.blendModesCanvas = [];
        
        if(PIXI.canUseNewCanvasBlendModes())
        {
            PIXI.blendModesCanvas[PIXI.blendModes.NORMAL]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.ADD]      = "lighter"; //IS THIS OK???
            PIXI.blendModesCanvas[PIXI.blendModes.MULTIPLY] = "multiply";
            PIXI.blendModesCanvas[PIXI.blendModes.SCREEN]   = "screen";
        }
        else
        {
            // this means that the browser does not support the cool new blend modes in canvas "cough" ie "cough"
            PIXI.blendModesCanvas[PIXI.blendModes.NORMAL]   = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.ADD]      = "lighter"; //IS THIS OK???
            PIXI.blendModesCanvas[PIXI.blendModes.MULTIPLY] = "source-over";
            PIXI.blendModesCanvas[PIXI.blendModes.SCREEN]   = "source-over";
        }
    }

    /**
     * The width of the canvas view
     *
     * @property width
     * @type Number
     * @default 800
     */
    this.width = width || 800;

    /**
     * The height of the canvas view
     *
     * @property height
     * @type Number
     * @default 600
     */
    this.height = height || 600;

    /**
     * The canvas element that the everything is drawn to
     *
     * @property view
     * @type Canvas
     */
    this.view = view || document.createElement( "canvas" );

    /**
     * The canvas context that the everything is drawn to
     * @property context
     * @type Canvas 2d Context
     */
    this.context = this.view.getContext( "2d" );

    //some filter variables
    this.smoothProperty = null;

    if("imageSmoothingEnabled" in this.context)
        this.smoothProperty = "imageSmoothingEnabled";
    else if("webkitImageSmoothingEnabled" in this.context)
        this.smoothProperty = "webkitImageSmoothingEnabled";
    else if("mozImageSmoothingEnabled" in this.context)
        this.smoothProperty = "mozImageSmoothingEnabled";
    else if("oImageSmoothingEnabled" in this.context)
        this.smoothProperty = "oImageSmoothingEnabled";

    this.scaleMode = null;

    this.refresh = true;
    // hack to enable some hardware acceleration!
    //this.view.style["transform"] = "translatez(0)";

    this.view.width = this.width;
    this.view.height = this.height;
    this.count = 0;

    this.maskManager = new PIXI.CanvasMaskManager();

    this.renderSession = {};
    this.renderSession.context = this.context;
    this.renderSession.maskManager = this.maskManager;
    
};

// constructor
PIXI.CanvasRenderer.prototype.constructor = PIXI.CanvasRenderer;

/**
 * Renders the stage to its canvas view
 *
 * @method render
 * @param stage {Stage} the Stage element to be rendered
 */
PIXI.CanvasRenderer.prototype.render = function(stage)
{
    //stage.__childrenAdded = [];
    //stage.__childrenRemoved = [];

    // update textures if need be
    PIXI.texturesToUpdate = [];
    PIXI.texturesToDestroy = [];

    PIXI.visibleCount++;
    stage.updateTransform();

    // update the background color
    if(this.view.style.backgroundColor !== stage.backgroundColorString && !this.transparent)
        this.view.style.backgroundColor = stage.backgroundColorString;

    this.context.setTransform(1,0,0,1,0,0);
    this.context.clearRect(0, 0, this.width, this.height);
    this.renderDisplayObject(stage);
    //as

    // run interaction!
    if(stage.interactive)
    {
        //need to add some events!
        if(!stage._interactiveEventsAdded)
        {
            stage._interactiveEventsAdded = true;
            stage.interactionManager.setTarget(this);
        }
    }

    // remove frame updates..
    if(PIXI.Texture.frameUpdates.length > 0)
    {
        PIXI.Texture.frameUpdates = [];
    }
};

/**
 * resizes the canvas view to the specified width and height
 *
 * @method resize
 * @param width {Number} the new width of the canvas view
 * @param height {Number} the new height of the canvas view
 */
PIXI.CanvasRenderer.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.view.width = width;
    this.view.height = height;
};

/**
 * Renders a display object
 *
 * @method renderDisplayObject
 * @param displayObject {DisplayObject} The displayObject to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderDisplayObject = function(displayObject, context)
{
    // no loger recurrsive!
    //var transform;
    //var context = this.context;

    this.renderSession.context = context || this.context;
    displayObject._renderCanvas(this.renderSession);
};

/**
 * Renders a flat strip
 *
 * @method renderStripFlat
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStripFlat = function(strip)
{
    var context = this.context;
    var verticies = strip.verticies;

    var length = verticies.length/2;
    this.count++;

    context.beginPath();
    for (var i=1; i < length-2; i++)
    {
        // draw some triangles!
        var index = i*2;

        var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
        var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
    }

    context.fillStyle = "#FF0000";
    context.fill();
    context.closePath();
};

/**
 * Renders a strip
 *
 * @method renderStrip
 * @param strip {Strip} The Strip to render
 * @private
 */
PIXI.CanvasRenderer.prototype.renderStrip = function(strip)
{
    var context = this.context;

    // draw triangles!!
    var verticies = strip.verticies;
    var uvs = strip.uvs;

    var length = verticies.length/2;
    this.count++;

    for (var i = 1; i < length-2; i++)
    {
        // draw some triangles!
        var index = i*2;

        var x0 = verticies[index],   x1 = verticies[index+2], x2 = verticies[index+4];
        var y0 = verticies[index+1], y1 = verticies[index+3], y2 = verticies[index+5];

        var u0 = uvs[index] * strip.texture.width,   u1 = uvs[index+2] * strip.texture.width, u2 = uvs[index+4]* strip.texture.width;
        var v0 = uvs[index+1]* strip.texture.height, v1 = uvs[index+3] * strip.texture.height, v2 = uvs[index+5]* strip.texture.height;

        context.save();
        context.beginPath();
        context.moveTo(x0, y0);
        context.lineTo(x1, y1);
        context.lineTo(x2, y2);
        context.closePath();

        context.clip();

        // Compute matrix transform
        var delta = u0*v1 + v0*u2 + u1*v2 - v1*u2 - v0*u1 - u0*v2;
        var deltaA = x0*v1 + v0*x2 + x1*v2 - v1*x2 - v0*x1 - x0*v2;
        var deltaB = u0*x1 + x0*u2 + u1*x2 - x1*u2 - x0*u1 - u0*x2;
        var deltaC = u0*v1*x2 + v0*x1*u2 + x0*u1*v2 - x0*v1*u2 - v0*u1*x2 - u0*x1*v2;
        var deltaD = y0*v1 + v0*y2 + y1*v2 - v1*y2 - v0*y1 - y0*v2;
        var deltaE = u0*y1 + y0*u2 + u1*y2 - y1*u2 - y0*u1 - u0*y2;
        var deltaF = u0*v1*y2 + v0*y1*u2 + y0*u1*v2 - y0*v1*u2 - v0*u1*y2 - u0*y1*v2;

        context.transform(deltaA / delta, deltaD / delta,
                            deltaB / delta, deltaE / delta,
                            deltaC / delta, deltaF / delta);

        context.drawImage(strip.texture.baseTexture.source, 0, 0);
        context.restore();
    }
};

PIXI.CanvasBuffer = function(width, height)
{
    this.width = width;
    this.height = height;

    this.canvas = document.createElement( "canvas" );
    this.context = this.canvas.getContext( "2d" );

//     this.context.f
    this.canvas.width = width;
    this.canvas.height = height;
};

PIXI.CanvasBuffer.prototype.clear = function()
{
    this.context.clearRect(0,0, this.width, this.height);
};

PIXI.CanvasBuffer.prototype.resize = function(width, height)
{
    this.width = this.canvas.width = width;
    this.height = this.canvas.height = height;
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * A set of functions used by the canvas renderer to draw the primitive graphics data
 *
 * @class CanvasGraphics
 */
PIXI.CanvasGraphics = function()
{

};


/*
 * Renders the graphics object
 *
 * @static
 * @private
 * @method renderGraphics
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphics = function(graphics, context)
{
    var worldAlpha = graphics.worldAlpha;
    var color = '';

    for (var i = 0; i < graphics.graphicsData.length; i++)
    {
        var data = graphics.graphicsData[i];
        var points = data.points;

        context.strokeStyle = color = '#' + ('00000' + ( data.lineColor | 0).toString(16)).substr(-6);

        context.lineWidth = data.lineWidth;

        if(data.type === PIXI.Graphics.POLY)
        {
            context.beginPath();

            context.moveTo(points[0], points[1]);

            for (var j=1; j < points.length/2; j++)
            {
                context.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            // if the first and last point are the same close the path - much neater :)
            if(points[0] === points[points.length-2] && points[1] === points[points.length-1])
            {
                context.closePath();
            }

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
        else if(data.type === PIXI.Graphics.RECT)
        {

            if(data.fillColor || data.fillColor === 0)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fillRect(points[0], points[1], points[2], points[3]);

            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.strokeRect(points[0], points[1], points[2], points[3]);
            }

        }
        else if(data.type === PIXI.Graphics.CIRC)
        {
            // TODO - need to be Undefined!
            context.beginPath();
            context.arc(points[0], points[1], points[2],0,2*Math.PI);
            context.closePath();

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
        else if(data.type === PIXI.Graphics.ELIP)
        {

            // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas

            var ellipseData =  data.points;

            var w = ellipseData[2] * 2;
            var h = ellipseData[3] * 2;

            var x = ellipseData[0] - w/2;
            var y = ellipseData[1] - h/2;

            context.beginPath();

            var kappa = 0.5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w,           // x-end
                ye = y + h,           // y-end
                xm = x + w / 2,       // x-middle
                ym = y + h / 2;       // y-middle

            context.moveTo(x, ym);
            context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);

            context.closePath();

            if(data.fill)
            {
                context.globalAlpha = data.fillAlpha * worldAlpha;
                context.fillStyle = color = '#' + ('00000' + ( data.fillColor | 0).toString(16)).substr(-6);
                context.fill();
            }
            if(data.lineWidth)
            {
                context.globalAlpha = data.lineAlpha * worldAlpha;
                context.stroke();
            }
        }
    }
};

/*
 * Renders a graphics mask
 *
 * @static
 * @private
 * @method renderGraphicsMask
 * @param graphics {Graphics}
 * @param context {Context2D}
 */
PIXI.CanvasGraphics.renderGraphicsMask = function(graphics, context)
{
    var len = graphics.graphicsData.length;

    if(len === 0) return;

    if(len > 1)
    {
        len = 1;
        window.console.log('Pixi.js warning: masks in canvas can only mask using the first path in the graphics object');
    }

    for (var i = 0; i < 1; i++)
    {
        var data = graphics.graphicsData[i];
        var points = data.points;

        if(data.type === PIXI.Graphics.POLY)
        {
            context.beginPath();
            context.moveTo(points[0], points[1]);

            for (var j=1; j < points.length/2; j++)
            {
                context.lineTo(points[j * 2], points[j * 2 + 1]);
            }

            // if the first and last point are the same close the path - much neater :)
            if(points[0] === points[points.length-2] && points[1] === points[points.length-1])
            {
                context.closePath();
            }

        }
        else if(data.type === PIXI.Graphics.RECT)
        {
            context.beginPath();
            context.rect(points[0], points[1], points[2], points[3]);
            context.closePath();
        }
        else if(data.type === PIXI.Graphics.CIRC)
        {
            // TODO - need to be Undefined!
            context.beginPath();
            context.arc(points[0], points[1], points[2],0,2*Math.PI);
            context.closePath();
        }
        else if(data.type === PIXI.Graphics.ELIP)
        {

            // ellipse code taken from: http://stackoverflow.com/questions/2172798/how-to-draw-an-oval-in-html5-canvas
            var ellipseData =  data.points;

            var w = ellipseData[2] * 2;
            var h = ellipseData[3] * 2;

            var x = ellipseData[0] - w/2;
            var y = ellipseData[1] - h/2;

            context.beginPath();

            var kappa = 0.5522848,
                ox = (w / 2) * kappa, // control point offset horizontal
                oy = (h / 2) * kappa, // control point offset vertical
                xe = x + w,           // x-end
                ye = y + h,           // y-end
                xm = x + w / 2,       // x-middle
                ym = y + h / 2;       // y-middle

            context.moveTo(x, ym);
            context.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
            context.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
            context.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
            context.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
            context.closePath();
        }
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */


/**
 * The Graphics class contains a set of methods that you can use to create primitive shapes and lines.
 * It is important to know that with the webGL renderer only simple polys can be filled at this stage
 * Complex polys will not be filled. Heres an example of a complex poly: http://www.goodboydigital.com/wp-content/uploads/2013/06/complexPolygon.png
 *
 * @class Graphics
 * @extends DisplayObjectContainer
 * @constructor
 */
PIXI.Graphics = function()
{
    PIXI.DisplayObjectContainer.call( this );

    this.renderable = true;

    /**
     * The alpha of the fill of this graphics object
     *
     * @property fillAlpha
     * @type Number
     */
    this.fillAlpha = 1;

    /**
     * The width of any lines drawn
     *
     * @property lineWidth
     * @type Number
     */
    this.lineWidth = 0;

    /**
     * The color of any lines drawn
     *
     * @property lineColor
     * @type String
     */
    this.lineColor = "black";

    /**
     * Graphics data
     *
     * @property graphicsData
     * @type Array
     * @private
     */
    this.graphicsData = [];

    this.tint = 0xFFFFFF;// * Math.random();

    this.blendMode = PIXI.blendModes.NORMAL;
    
    /**
     * Current path
     *
     * @property currentPath
     * @type Object
     * @private
     */
    this.currentPath = {points:[]};

    this._webGL = [];

    this.isMask = false;
};

// constructor
PIXI.Graphics.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Graphics.prototype.constructor = PIXI.Graphics;

/*
*   Not yet implemented
*/
Object.defineProperty(PIXI.Graphics.prototype, "cacheAsBitmap", {
    get: function() {
        return  this._cacheAsBitmap;
    },
    set: function(value) {
        this._cacheAsBitmap = value;
    }
});


/**
 * Specifies a line style used for subsequent calls to Graphics methods such as the lineTo() method or the drawCircle() method.
 *
 * @method lineStyle
 * @param lineWidth {Number} width of the line to draw, will update the object's stored style
 * @param color {Number} color of the line to draw, will update the object's stored style
 * @param alpha {Number} alpha of the line to draw, will update the object's stored style
 */
PIXI.Graphics.prototype.lineStyle = function(lineWidth, color, alpha)
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.lineWidth = lineWidth || 0;
    this.lineColor = color || 0;
    this.lineAlpha = (arguments.length < 3) ? 1 : alpha;

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

    this.graphicsData.push(this.currentPath);
};

/**
 * Moves the current drawing position to (x, y).
 *
 * @method moveTo
 * @param x {Number} the X coord to move to
 * @param y {Number} the Y coord to move to
 */
PIXI.Graphics.prototype.moveTo = function(x, y)
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling, points:[], type:PIXI.Graphics.POLY};

    this.currentPath.points.push(x, y);

    this.graphicsData.push(this.currentPath);
};

/**
 * Draws a line using the current line style from the current drawing position to (x, y);
 * the current drawing position is then set to (x, y).
 *
 * @method lineTo
 * @param x {Number} the X coord to draw to
 * @param y {Number} the Y coord to draw to
 */
PIXI.Graphics.prototype.lineTo = function(x, y)
{
    this.currentPath.points.push(x, y);
    this.dirty = true;
};

/**
 * Specifies a simple one-color fill that subsequent calls to other Graphics methods
 * (such as lineTo() or drawCircle()) use when drawing.
 *
 * @method beginFill
 * @param color {uint} the color of the fill
 * @param alpha {Number} the alpha
 */
PIXI.Graphics.prototype.beginFill = function(color, alpha)
{

    this.filling = true;
    this.fillColor = color || 0;
    this.fillAlpha = (arguments.length < 2) ? 1 : alpha;
};

/**
 * Applies a fill to the lines and shapes that were added since the last call to the beginFill() method.
 *
 * @method endFill
 */
PIXI.Graphics.prototype.endFill = function()
{
    this.filling = false;
    this.fillColor = null;
    this.fillAlpha = 1;
};

/**
 * @method drawRect
 *
 * @param x {Number} The X coord of the top-left of the rectangle
 * @param y {Number} The Y coord of the top-left of the rectangle
 * @param width {Number} The width of the rectangle
 * @param height {Number} The height of the rectangle
 */
PIXI.Graphics.prototype.drawRect = function( x, y, width, height )
{
    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, width, height], type:PIXI.Graphics.RECT};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;
};

/**
 * Draws a circle.
 *
 * @method drawCircle
 * @param x {Number} The X coord of the center of the circle
 * @param y {Number} The Y coord of the center of the circle
 * @param radius {Number} The radius of the circle
 */
PIXI.Graphics.prototype.drawCircle = function( x, y, radius)
{

    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, radius, radius], type:PIXI.Graphics.CIRC};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;
};

/**
 * Draws an ellipse.
 *
 * @method drawEllipse
 * @param x {Number}
 * @param y {Number}
 * @param width {Number}
 * @param height {Number}
 */
PIXI.Graphics.prototype.drawEllipse = function( x, y, width, height)
{

    if (!this.currentPath.points.length) this.graphicsData.pop();

    this.currentPath = {lineWidth:this.lineWidth, lineColor:this.lineColor, lineAlpha:this.lineAlpha,
                        fillColor:this.fillColor, fillAlpha:this.fillAlpha, fill:this.filling,
                        points:[x, y, width, height], type:PIXI.Graphics.ELIP};

    this.graphicsData.push(this.currentPath);
    this.dirty = true;
};

/**
 * Clears the graphics that were drawn to this Graphics object, and resets fill and line style settings.
 *
 * @method clear
 */
PIXI.Graphics.prototype.clear = function()
{
    this.lineWidth = 0;
    this.filling = false;

    this.dirty = true;
    this.clearDirty = true;
    this.graphicsData = [];

    this.bounds = null; //new PIXI.Rectangle();
};


PIXI.Graphics.prototype._renderWebGL = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0 || this.isMask === true)return;
    
   
    renderSession.spriteBatch.stop();

    if(this._mask)renderSession.maskManager.pushMask(this.mask, renderSession);
    if(this._filters)renderSession.filterManager.pushFilter(this._filterBlock);
  
    // check blend mode
    if(this.blendMode !== renderSession.spriteBatch.currentBlendMode)
    {
        this.spriteBatch.currentBlendMode = this.blendMode;
        var blendModeWebGL = PIXI.blendModesWebGL[renderSession.spriteBatch.currentBlendMode];
        this.spriteBatch.gl.blendFunc(blendModeWebGL[0], blendModeWebGL[1]);
    }
 
    PIXI.WebGLGraphics.renderGraphics(this, renderSession);
    
    if(this._filters)renderSession.filterManager.popFilter();
    if(this._mask)renderSession.maskManager.popMask(renderSession);
      
    renderSession.drawCount++;

    renderSession.spriteBatch.start();
};

PIXI.Graphics.prototype._renderCanvas = function(renderSession)
{
    // if the sprite is not visible or the alpha is 0 then no need to render this element
    if(this.visible === false || this.alpha === 0 || this.isMask === true)return;
    
    var context = renderSession.context;
    var transform = this.worldTransform;
    
    if(this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
    PIXI.CanvasGraphics.renderGraphics(this, context);
};

PIXI.Graphics.prototype.getBounds = function()
{
    if(!this.bounds)this.updateBounds();

    var w0 = this.bounds.x;
    var w1 = this.bounds.width + this.bounds.x;

    var h0 = this.bounds.y;
    var h1 = this.bounds.height + this.bounds.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    return bounds;
};

PIXI.Graphics.prototype.updateBounds = function()
{
    
    var minX = Infinity;
    var maxX = -Infinity;

    var minY = Infinity;
    var maxY = -Infinity;

    var points, x, y;

    for (var i = 0; i < this.graphicsData.length; i++) {
        var data = this.graphicsData[i];
        var type = data.type;
        var lineWidth = data.lineWidth;

        points = data.points;

        if(type === PIXI.Graphics.RECT)
        {
            x = points.x - lineWidth/2;
            y = points.y - lineWidth/2;
            var width = points.width + lineWidth;
            var height = points.height + lineWidth;

            minX = x < minX ? x : minX;
            maxX = x + width > maxX ? x + width : maxX;

            minY = y < minY ? x : minY;
            maxY = y + height > maxY ? y + height : maxY;
        }
        else if(type === PIXI.Graphics.CIRC || type === PIXI.Graphics.ELIP)
        {
            x = points.x;
            y = points.y;
            var radius = points.radius + lineWidth/2;

            minX = x - radius < minX ? x - radius : minX;
            maxX = x + radius > maxX ? x + radius : maxX;

            minY = y - radius < minY ? y - radius : minY;
            maxY = y + radius > maxY ? y + radius : maxY;
        }
        else
        {
            // POLY
            for (var j = 0; j < points.length; j+=2)
            {

                x = points[j];
                y = points[j+1];
                minX = x-lineWidth < minX ? x-lineWidth : minX;
                maxX = x+lineWidth > maxX ? x+lineWidth : maxX;

                minY = y-lineWidth < minY ? y-lineWidth : minY;
                maxY = y+lineWidth > maxY ? y+lineWidth : maxY;
            }
        }
    }

    this.bounds = new PIXI.Rectangle(minX, minY, maxX - minX, maxY - minY);
};

// SOME TYPES:
PIXI.Graphics.POLY = 0;
PIXI.Graphics.RECT = 1;
PIXI.Graphics.CIRC = 2;
PIXI.Graphics.ELIP = 3;

/**
 * @author Mat Groves http://matgroves.com/
 */

PIXI.Strip = function(texture, width, height)
{
    PIXI.DisplayObjectContainer.call( this );
    this.texture = texture;
    this.blendMode = PIXI.blendModes.NORMAL;

    try
    {
        this.uvs = new Float32Array([0, 1,
                1, 1,
                1, 0, 0,1]);

        this.verticies = new Float32Array([0, 0,
                          0,0,
                          0,0, 0,
                          0, 0]);

        this.colors = new Float32Array([1, 1, 1, 1]);

        this.indices = new Uint16Array([0, 1, 2, 3]);
    }
    catch(error)
    {
        this.uvs = [0, 1,
                1, 1,
                1, 0, 0,1];

        this.verticies = [0, 0,
                          0,0,
                          0,0, 0,
                          0, 0];

        this.colors = [1, 1, 1, 1];

        this.indices = [0, 1, 2, 3];
    }


    /*
    this.uvs = new Float32Array()
    this.verticies = new Float32Array()
    this.colors = new Float32Array()
    this.indices = new Uint16Array()
    */
    this.width = width;
    this.height = height;

    // load the texture!
    if(texture.baseTexture.hasLoaded)
    {
        this.width   = this.texture.frame.width;
        this.height  = this.texture.frame.height;
        this.updateFrame = true;
    }
    else
    {
        this.onTextureUpdateBind = this.onTextureUpdate.bind(this);
        this.texture.addEventListener( 'update', this.onTextureUpdateBind );
    }

    this.renderable = true;
};

// constructor
PIXI.Strip.prototype = Object.create( PIXI.DisplayObjectContainer.prototype );
PIXI.Strip.prototype.constructor = PIXI.Strip;

PIXI.Strip.prototype.setTexture = function(texture)
{
    //TODO SET THE TEXTURES
    //TODO VISIBILITY

    // stop current texture
    this.texture = texture;
    this.width   = texture.frame.width;
    this.height  = texture.frame.height;
    this.updateFrame = true;
};

PIXI.Strip.prototype.onTextureUpdate = function()
{
    this.updateFrame = true;
};
// some helper functions..

/**
 * @author Mat Groves http://matgroves.com/
 */

PIXI.Rope = function(texture, points)
{
    PIXI.Strip.call( this, texture );
    this.points = points;

    try
    {
        this.verticies = new Float32Array(points.length * 4);
        this.uvs = new Float32Array(points.length * 4);
        this.colors = new Float32Array(points.length * 2);
        this.indices = new Uint16Array(points.length * 2);
    }
    catch(error)
    {
        this.verticies = new Array(points.length * 4);
        this.uvs = new Array(points.length * 4);
        this.colors = new Array(points.length * 2);
        this.indices = new Array(points.length * 2);
    }

    this.refresh();
};


// constructor
PIXI.Rope.prototype = Object.create( PIXI.Strip.prototype );
PIXI.Rope.prototype.constructor = PIXI.Rope;

PIXI.Rope.prototype.refresh = function()
{
    var points = this.points;
    if(points.length < 1) return;

    var uvs = this.uvs;

    var lastPoint = points[0];
    var indices = this.indices;
    var colors = this.colors;

    this.count-=0.2;


    uvs[0] = 0;
    uvs[1] = 1;
    uvs[2] = 0;
    uvs[3] = 1;

    colors[0] = 1;
    colors[1] = 1;

    indices[0] = 0;
    indices[1] = 1;

    var total = points.length,
        point, index, amount;

    for (var i = 1; i < total; i++)
    {

        point = points[i];
        index = i * 4;
        // time to do some smart drawing!
        amount = i / (total-1);

        if(i%2)
        {
            uvs[index] = amount;
            uvs[index+1] = 0;

            uvs[index+2] = amount;
            uvs[index+3] = 1;

        }
        else
        {
            uvs[index] = amount;
            uvs[index+1] = 0;

            uvs[index+2] = amount;
            uvs[index+3] = 1;
        }

        index = i * 2;
        colors[index] = 1;
        colors[index+1] = 1;

        index = i * 2;
        indices[index] = index;
        indices[index + 1] = index + 1;

        lastPoint = point;
    }
};

PIXI.Rope.prototype.updateTransform = function()
{

    var points = this.points;
    if(points.length < 1)return;

    var lastPoint = points[0];
    var nextPoint;
    var perp = {x:0, y:0};

    this.count-=0.2;

    var verticies = this.verticies;
    verticies[0] = lastPoint.x + perp.x;
    verticies[1] = lastPoint.y + perp.y; //+ 200
    verticies[2] = lastPoint.x - perp.x;
    verticies[3] = lastPoint.y - perp.y;//+200
    // time to do some smart drawing!

    var total = points.length,
        point, index, ratio, perpLength, num;

    for (var i = 1; i < total; i++)
    {
        point = points[i];
        index = i * 4;

        if(i < points.length-1)
        {
            nextPoint = points[i+1];
        }
        else
        {
            nextPoint = point;
        }

        perp.y = -(nextPoint.x - lastPoint.x);
        perp.x = nextPoint.y - lastPoint.y;

        ratio = (1 - (i / (total-1))) * 10;

        if(ratio > 1) ratio = 1;

        perpLength = Math.sqrt(perp.x * perp.x + perp.y * perp.y);
        num = this.texture.height / 2; //(20 + Math.abs(Math.sin((i + this.count) * 0.3) * 50) )* ratio;
        perp.x /= perpLength;
        perp.y /= perpLength;

        perp.x *= num;
        perp.y *= num;

        verticies[index] = point.x + perp.x;
        verticies[index+1] = point.y + perp.y;
        verticies[index+2] = point.x - perp.x;
        verticies[index+3] = point.y - perp.y;

        lastPoint = point;
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call( this );
};

PIXI.Rope.prototype.setTexture = function(texture)
{
    // stop current texture
    this.texture = texture;
    this.updateFrame = true;
};

/**
 * @author Mat Groves http://matgroves.com/
 */

/**
 * A tiling sprite is a fast way of rendering a tiling image
 *
 * @class TilingSprite
 * @extends DisplayObjectContainer
 * @constructor
 * @param texture {Texture} the texture of the tiling sprite
 * @param width {Number}  the width of the tiling sprite
 * @param height {Number} the height of the tiling sprite
 */
PIXI.TilingSprite = function(texture, width, height)
{
    PIXI.Sprite.call( this, texture);

    this.width = width || 100;
    this.height = height || 100;

    texture.baseTexture._powerOf2 = true;

    /**
     * The scaling of the image that is being tiled
     *
     * @property tileScale
     * @type Point
     */
    this.tileScale = new PIXI.Point(1,1);

    /**
     * The offset position of the image that is being tiled
     *
     * @property tilePosition
     * @type Point
     */
    this.tilePosition = new PIXI.Point(0,0);

    this.renderable = true;

    this.tint = 0xFFFFFF;
    this.blendMode = PIXI.blendModes.NORMAL;
};

// constructor
PIXI.TilingSprite.prototype = Object.create( PIXI.Sprite.prototype );
PIXI.TilingSprite.prototype.constructor = PIXI.TilingSprite;


/**
 * The width of the sprite, setting this will actually modify the scale to acheive the value set
 *
 * @property width
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'width', {
    get: function() {
        return this._width;
    },
    set: function(value) {
        
        this._width = value;
    }
});

/**
 * The height of the TilingSprite, setting this will actually modify the scale to acheive the value set
 *
 * @property height
 * @type Number
 */
Object.defineProperty(PIXI.TilingSprite.prototype, 'height', {
    get: function() {
        return  this._height;
    },
    set: function(value) {
        this._height = value;
    }
});

PIXI.TilingSprite.prototype.onTextureUpdate = function()
{
    // so if _width is 0 then width was not set..
    //if(this._width)this.scale.x = this._width / this.texture.frame.width;
    //if(this._height)this.scale.y = this._height / this.texture.frame.height;
   // alert(this._width)
    this.updateFrame = true;
};

PIXI.TilingSprite.prototype._renderWebGL = function(renderSession)
{

    if(this.visible === false || this.alpha === 0)return;
    
    var i,j;

    if(this.mask || this.filters)
    {
        if(this.mask)
        {
            renderSession.spriteBatch.stop();
            renderSession.maskManager.pushMask(this.mask, renderSession.projection);
            renderSession.spriteBatch.start();
        }

        if(this.filters)
        {
            renderSession.spriteBatch.flush();
            renderSession.filterManager.pushFilter(this._filterBlock);
        }


        renderSession.spriteBatch.renderTilingSprite(this);

        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }

        renderSession.spriteBatch.stop();

        if(this.filters)renderSession.filterManager.popFilter();
        if(this.mask)renderSession.maskManager.popMask(renderSession.projection);
        
        renderSession.spriteBatch.start();
    }
    else
    {
        renderSession.spriteBatch.renderTilingSprite(this);
        
        // simple render children!
        for(i=0,j=this.children.length; i<j; i++)
        {
            this.children[i]._renderWebGL(renderSession);
        }
    }
};

PIXI.TilingSprite.prototype._renderCanvas = function(renderSession)
{
    if(this.visible === false || this.alpha === 0)return;
    
    var context = renderSession.context;

    context.globalAlpha = this.worldAlpha;

    
    var transform = this.worldTransform;

    // alow for trimming
   
    context.setTransform(transform[0], transform[3], transform[1], transform[4], transform[2], transform[5]);
 

    if(!this.__tilePattern)
        this.__tilePattern = context.createPattern(this.texture.baseTexture.source, 'repeat');

    // check blend mode
    if(this.blendMode !== renderSession.currentBlendMode)
    {
        renderSession.currentBlendMode = this.blendMode;
        context.globalCompositeOperation = PIXI.blendModesCanvas[renderSession.currentBlendMode];
    }

    context.beginPath();

    var tilePosition = this.tilePosition;
    var tileScale = this.tileScale;

    // offset
    context.scale(tileScale.x,tileScale.y);
    context.translate(tilePosition.x, tilePosition.y);

    context.fillStyle = this.__tilePattern;
    context.fillRect(-tilePosition.x,-tilePosition.y,this.width / tileScale.x, this.height / tileScale.y);

    context.scale(1/tileScale.x, 1/tileScale.y);
    context.translate(-tilePosition.x, -tilePosition.y);

    context.closePath();
};

PIXI.TilingSprite.prototype.getBounds = function()
{

    var width = this._width;
    var height = this._height;

    var w0 = width * (1-this.anchor.x);
    var w1 = width * -this.anchor.x;

    var h0 = height * (1-this.anchor.y);
    var h1 = height * -this.anchor.y;

    var worldTransform = this.worldTransform;

    var a = worldTransform[0];
    var b = worldTransform[3];
    var c = worldTransform[1];
    var d = worldTransform[4];
    var tx = worldTransform[2];
    var ty = worldTransform[5];

    var x1 = a * w1 + c * h1 + tx;
    var y1 = d * h1 + b * w1 + ty;

    var x2 = a * w0 + c * h1 + tx;
    var y2 = d * h1 + b * w0 + ty;

    var x3 = a * w0 + c * h0 + tx;
    var y3 = d * h0 + b * w0 + ty;

    var x4 =  a * w1 + c * h0 + tx;
    var y4 =  d * h0 + b * w1 + ty;

    var maxX = -Infinity;
    var maxY = -Infinity;

    var minX = Infinity;
    var minY = Infinity;

    minX = x1 < minX ? x1 : minX;
    minX = x2 < minX ? x2 : minX;
    minX = x3 < minX ? x3 : minX;
    minX = x4 < minX ? x4 : minX;

    minY = y1 < minY ? y1 : minY;
    minY = y2 < minY ? y2 : minY;
    minY = y3 < minY ? y3 : minY;
    minY = y4 < minY ? y4 : minY;

    maxX = x1 > maxX ? x1 : maxX;
    maxX = x2 > maxX ? x2 : maxX;
    maxX = x3 > maxX ? x3 : maxX;
    maxX = x4 > maxX ? x4 : maxX;

    maxY = y1 > maxY ? y1 : maxY;
    maxY = y2 > maxY ? y2 : maxY;
    maxY = y3 > maxY ? y3 : maxY;
    maxY = y4 > maxY ? y4 : maxY;

    var bounds = this._bounds;

    bounds.x = minX;
    bounds.width = maxX - minX;

    bounds.y = minY;
    bounds.height = maxY - minY;

    // store a refferance so that if this function gets called again in the render cycle we do not have to recacalculate
    this._currentBounds = bounds;

    return bounds;
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/*
 * Awesome JS run time provided by EsotericSoftware
 *
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

var spine = {};

spine.BoneData = function (name, parent) {
    this.name = name;
    this.parent = parent;
};
spine.BoneData.prototype = {
    length: 0,
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1
};

spine.SlotData = function (name, boneData) {
    this.name = name;
    this.boneData = boneData;
};
spine.SlotData.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    attachmentName: null
};

spine.Bone = function (boneData, parent) {
    this.data = boneData;
    this.parent = parent;
    this.setToSetupPose();
};
spine.Bone.yDown = false;
spine.Bone.prototype = {
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    m00: 0, m01: 0, worldX: 0, // a b x
    m10: 0, m11: 0, worldY: 0, // c d y
    worldRotation: 0,
    worldScaleX: 1, worldScaleY: 1,
    updateWorldTransform: function (flipX, flipY) {
        var parent = this.parent;
        if (parent != null) {
            this.worldX = this.x * parent.m00 + this.y * parent.m01 + parent.worldX;
            this.worldY = this.x * parent.m10 + this.y * parent.m11 + parent.worldY;
            this.worldScaleX = parent.worldScaleX * this.scaleX;
            this.worldScaleY = parent.worldScaleY * this.scaleY;
            this.worldRotation = parent.worldRotation + this.rotation;
        } else {
            this.worldX = this.x;
            this.worldY = this.y;
            this.worldScaleX = this.scaleX;
            this.worldScaleY = this.scaleY;
            this.worldRotation = this.rotation;
        }
        var radians = this.worldRotation * Math.PI / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        this.m00 = cos * this.worldScaleX;
        this.m10 = sin * this.worldScaleX;
        this.m01 = -sin * this.worldScaleY;
        this.m11 = cos * this.worldScaleY;
        if (flipX) {
            this.m00 = -this.m00;
            this.m01 = -this.m01;
        }
        if (flipY) {
            this.m10 = -this.m10;
            this.m11 = -this.m11;
        }
        if (spine.Bone.yDown) {
            this.m10 = -this.m10;
            this.m11 = -this.m11;
        }
    },
    setToSetupPose: function () {
        var data = this.data;
        this.x = data.x;
        this.y = data.y;
        this.rotation = data.rotation;
        this.scaleX = data.scaleX;
        this.scaleY = data.scaleY;
    }
};

spine.Slot = function (slotData, skeleton, bone) {
    this.data = slotData;
    this.skeleton = skeleton;
    this.bone = bone;
    this.setToSetupPose();
};
spine.Slot.prototype = {
    r: 1, g: 1, b: 1, a: 1,
    _attachmentTime: 0,
    attachment: null,
    setAttachment: function (attachment) {
        this.attachment = attachment;
        this._attachmentTime = this.skeleton.time;
    },
    setAttachmentTime: function (time) {
        this._attachmentTime = this.skeleton.time - time;
    },
    getAttachmentTime: function () {
        return this.skeleton.time - this._attachmentTime;
    },
    setToSetupPose: function () {
        var data = this.data;
        this.r = data.r;
        this.g = data.g;
        this.b = data.b;
        this.a = data.a;

        var slotDatas = this.skeleton.data.slots;
        for (var i = 0, n = slotDatas.length; i < n; i++) {
            if (slotDatas[i] == data) {
                this.setAttachment(!data.attachmentName ? null : this.skeleton.getAttachmentBySlotIndex(i, data.attachmentName));
                break;
            }
        }
    }
};

spine.Skin = function (name) {
    this.name = name;
    this.attachments = {};
};
spine.Skin.prototype = {
    addAttachment: function (slotIndex, name, attachment) {
        this.attachments[slotIndex + ":" + name] = attachment;
    },
    getAttachment: function (slotIndex, name) {
        return this.attachments[slotIndex + ":" + name];
    },
    _attachAll: function (skeleton, oldSkin) {
        for (var key in oldSkin.attachments) {
            var colon = key.indexOf(":");
            var slotIndex = parseInt(key.substring(0, colon), 10);
            var name = key.substring(colon + 1);
            var slot = skeleton.slots[slotIndex];
            if (slot.attachment && slot.attachment.name == name) {
                var attachment = this.getAttachment(slotIndex, name);
                if (attachment) slot.setAttachment(attachment);
            }
        }
    }
};

spine.Animation = function (name, timelines, duration) {
    this.name = name;
    this.timelines = timelines;
    this.duration = duration;
};
spine.Animation.prototype = {
    apply: function (skeleton, time, loop) {
        if (loop && this.duration) time %= this.duration;
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, time, 1);
    },
    mix: function (skeleton, time, loop, alpha) {
        if (loop && this.duration) time %= this.duration;
        var timelines = this.timelines;
        for (var i = 0, n = timelines.length; i < n; i++)
            timelines[i].apply(skeleton, time, alpha);
    }
};

spine.binarySearch = function (values, target, step) {
    var low = 0;
    var high = Math.floor(values.length / step) - 2;
    if (!high) return step;
    var current = high >>> 1;
    while (true) {
        if (values[(current + 1) * step] <= target)
            low = current + 1;
        else
            high = current;
        if (low == high) return (low + 1) * step;
        current = (low + high) >>> 1;
    }
};
spine.linearSearch = function (values, target, step) {
    for (var i = 0, last = values.length - step; i <= last; i += step)
        if (values[i] > target) return i;
    return -1;
};

spine.Curves = function (frameCount) {
    this.curves = []; // dfx, dfy, ddfx, ddfy, dddfx, dddfy, ...
    this.curves.length = (frameCount - 1) * 6;
};
spine.Curves.prototype = {
    setLinear: function (frameIndex) {
        this.curves[frameIndex * 6] = 0/*LINEAR*/;
    },
    setStepped: function (frameIndex) {
        this.curves[frameIndex * 6] = -1/*STEPPED*/;
    },
    /** Sets the control handle positions for an interpolation bezier curve used to transition from this keyframe to the next.
     * cx1 and cx2 are from 0 to 1, representing the percent of time between the two keyframes. cy1 and cy2 are the percent of
     * the difference between the keyframe's values. */
    setCurve: function (frameIndex, cx1, cy1, cx2, cy2) {
        var subdiv_step = 1 / 10/*BEZIER_SEGMENTS*/;
        var subdiv_step2 = subdiv_step * subdiv_step;
        var subdiv_step3 = subdiv_step2 * subdiv_step;
        var pre1 = 3 * subdiv_step;
        var pre2 = 3 * subdiv_step2;
        var pre4 = 6 * subdiv_step2;
        var pre5 = 6 * subdiv_step3;
        var tmp1x = -cx1 * 2 + cx2;
        var tmp1y = -cy1 * 2 + cy2;
        var tmp2x = (cx1 - cx2) * 3 + 1;
        var tmp2y = (cy1 - cy2) * 3 + 1;
        var i = frameIndex * 6;
        var curves = this.curves;
        curves[i] = cx1 * pre1 + tmp1x * pre2 + tmp2x * subdiv_step3;
        curves[i + 1] = cy1 * pre1 + tmp1y * pre2 + tmp2y * subdiv_step3;
        curves[i + 2] = tmp1x * pre4 + tmp2x * pre5;
        curves[i + 3] = tmp1y * pre4 + tmp2y * pre5;
        curves[i + 4] = tmp2x * pre5;
        curves[i + 5] = tmp2y * pre5;
    },
    getCurvePercent: function (frameIndex, percent) {
        percent = percent < 0 ? 0 : (percent > 1 ? 1 : percent);
        var curveIndex = frameIndex * 6;
        var curves = this.curves;
        var dfx = curves[curveIndex];
        if (!dfx/*LINEAR*/) return percent;
        if (dfx == -1/*STEPPED*/) return 0;
        var dfy = curves[curveIndex + 1];
        var ddfx = curves[curveIndex + 2];
        var ddfy = curves[curveIndex + 3];
        var dddfx = curves[curveIndex + 4];
        var dddfy = curves[curveIndex + 5];
        var x = dfx, y = dfy;
        var i = 10/*BEZIER_SEGMENTS*/ - 2;
        while (true) {
            if (x >= percent) {
                var lastX = x - dfx;
                var lastY = y - dfy;
                return lastY + (y - lastY) * (percent - lastX) / (x - lastX);
            }
            if (!i) break;
            i--;
            dfx += ddfx;
            dfy += ddfy;
            ddfx += dddfx;
            ddfy += dddfy;
            x += dfx;
            y += dfy;
        }
        return y + (1 - y) * (percent - x) / (1 - x); // Last point is 1,1.
    }
};

spine.RotateTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, angle, ...
    this.frames.length = frameCount * 2;
};
spine.RotateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, angle) {
        frameIndex *= 2;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = angle;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames,
            amount;

        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 2]) { // Time is after last frame.
            amount = bone.data.rotation + frames[frames.length - 1] - bone.rotation;
            while (amount > 180)
                amount -= 360;
            while (amount < -180)
                amount += 360;
            bone.rotation += amount * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 2);
        var lastFrameValue = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 2/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 2 - 1, percent);

        amount = frames[frameIndex + 1/*FRAME_VALUE*/] - lastFrameValue;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        amount = bone.data.rotation + (lastFrameValue + amount * percent) - bone.rotation;
        while (amount > 180)
            amount -= 360;
        while (amount < -180)
            amount += 360;
        bone.rotation += amount * alpha;
    }
};

spine.TranslateTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.TranslateTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3]) { // Time is after last frame.
            bone.x += (bone.data.x + frames[frames.length - 2] - bone.x) * alpha;
            bone.y += (bone.data.y + frames[frames.length - 1] - bone.y) * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 3);
        var lastFrameX = frames[frameIndex - 2];
        var lastFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.x += (bone.data.x + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.x) * alpha;
        bone.y += (bone.data.y + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.y) * alpha;
    }
};

spine.ScaleTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, x, y, ...
    this.frames.length = frameCount * 3;
};
spine.ScaleTimeline.prototype = {
    boneIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 3;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 3;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = x;
        this.frames[frameIndex + 2] = y;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var bone = skeleton.bones[this.boneIndex];

        if (time >= frames[frames.length - 3]) { // Time is after last frame.
            bone.scaleX += (bone.data.scaleX - 1 + frames[frames.length - 2] - bone.scaleX) * alpha;
            bone.scaleY += (bone.data.scaleY - 1 + frames[frames.length - 1] - bone.scaleY) * alpha;
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 3);
        var lastFrameX = frames[frameIndex - 2];
        var lastFrameY = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex + -3/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 3 - 1, percent);

        bone.scaleX += (bone.data.scaleX - 1 + lastFrameX + (frames[frameIndex + 1/*FRAME_X*/] - lastFrameX) * percent - bone.scaleX) * alpha;
        bone.scaleY += (bone.data.scaleY - 1 + lastFrameY + (frames[frameIndex + 2/*FRAME_Y*/] - lastFrameY) * percent - bone.scaleY) * alpha;
    }
};

spine.ColorTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, r, g, b, a, ...
    this.frames.length = frameCount * 5;
};
spine.ColorTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
        return this.frames.length / 2;
    },
    setFrame: function (frameIndex, time, x, y) {
        frameIndex *= 5;
        this.frames[frameIndex] = time;
        this.frames[frameIndex + 1] = r;
        this.frames[frameIndex + 2] = g;
        this.frames[frameIndex + 3] = b;
        this.frames[frameIndex + 4] = a;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var slot = skeleton.slots[this.slotIndex];

        if (time >= frames[frames.length - 5]) { // Time is after last frame.
            var i = frames.length - 1;
            slot.r = frames[i - 3];
            slot.g = frames[i - 2];
            slot.b = frames[i - 1];
            slot.a = frames[i];
            return;
        }

        // Interpolate between the last frame and the current frame.
        var frameIndex = spine.binarySearch(frames, time, 5);
        var lastFrameR = frames[frameIndex - 4];
        var lastFrameG = frames[frameIndex - 3];
        var lastFrameB = frames[frameIndex - 2];
        var lastFrameA = frames[frameIndex - 1];
        var frameTime = frames[frameIndex];
        var percent = 1 - (time - frameTime) / (frames[frameIndex - 5/*LAST_FRAME_TIME*/] - frameTime);
        percent = this.curves.getCurvePercent(frameIndex / 5 - 1, percent);

        var r = lastFrameR + (frames[frameIndex + 1/*FRAME_R*/] - lastFrameR) * percent;
        var g = lastFrameG + (frames[frameIndex + 2/*FRAME_G*/] - lastFrameG) * percent;
        var b = lastFrameB + (frames[frameIndex + 3/*FRAME_B*/] - lastFrameB) * percent;
        var a = lastFrameA + (frames[frameIndex + 4/*FRAME_A*/] - lastFrameA) * percent;
        if (alpha < 1) {
            slot.r += (r - slot.r) * alpha;
            slot.g += (g - slot.g) * alpha;
            slot.b += (b - slot.b) * alpha;
            slot.a += (a - slot.a) * alpha;
        } else {
            slot.r = r;
            slot.g = g;
            slot.b = b;
            slot.a = a;
        }
    }
};

spine.AttachmentTimeline = function (frameCount) {
    this.curves = new spine.Curves(frameCount);
    this.frames = []; // time, ...
    this.frames.length = frameCount;
    this.attachmentNames = []; // time, ...
    this.attachmentNames.length = frameCount;
};
spine.AttachmentTimeline.prototype = {
    slotIndex: 0,
    getFrameCount: function () {
            return this.frames.length;
    },
    setFrame: function (frameIndex, time, attachmentName) {
        this.frames[frameIndex] = time;
        this.attachmentNames[frameIndex] = attachmentName;
    },
    apply: function (skeleton, time, alpha) {
        var frames = this.frames;
        if (time < frames[0]) return; // Time is before first frame.

        var frameIndex;
        if (time >= frames[frames.length - 1]) // Time is after last frame.
            frameIndex = frames.length - 1;
        else
            frameIndex = spine.binarySearch(frames, time, 1) - 1;

        var attachmentName = this.attachmentNames[frameIndex];
        skeleton.slots[this.slotIndex].setAttachment(!attachmentName ? null : skeleton.getAttachmentBySlotIndex(this.slotIndex, attachmentName));
    }
};

spine.SkeletonData = function () {
    this.bones = [];
    this.slots = [];
    this.skins = [];
    this.animations = [];
};
spine.SkeletonData.prototype = {
    defaultSkin: null,
    /** @return May be null. */
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++) {
            if (slots[i].name == slotName) return slot[i];
        }
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].name == slotName) return i;
        return -1;
    },
    /** @return May be null. */
    findSkin: function (skinName) {
        var skins = this.skins;
        for (var i = 0, n = skins.length; i < n; i++)
            if (skins[i].name == skinName) return skins[i];
        return null;
    },
    /** @return May be null. */
    findAnimation: function (animationName) {
        var animations = this.animations;
        for (var i = 0, n = animations.length; i < n; i++)
            if (animations[i].name == animationName) return animations[i];
        return null;
    }
};

spine.Skeleton = function (skeletonData) {
    this.data = skeletonData;

    this.bones = [];
    for (var i = 0, n = skeletonData.bones.length; i < n; i++) {
        var boneData = skeletonData.bones[i];
        var parent = !boneData.parent ? null : this.bones[skeletonData.bones.indexOf(boneData.parent)];
        this.bones.push(new spine.Bone(boneData, parent));
    }

    this.slots = [];
    this.drawOrder = [];
    for (i = 0, n = skeletonData.slots.length; i < n; i++) {
        var slotData = skeletonData.slots[i];
        var bone = this.bones[skeletonData.bones.indexOf(slotData.boneData)];
        var slot = new spine.Slot(slotData, this, bone);
        this.slots.push(slot);
        this.drawOrder.push(slot);
    }
};
spine.Skeleton.prototype = {
    x: 0, y: 0,
    skin: null,
    r: 1, g: 1, b: 1, a: 1,
    time: 0,
    flipX: false, flipY: false,
    /** Updates the world transform for each bone. */
    updateWorldTransform: function () {
        var flipX = this.flipX;
        var flipY = this.flipY;
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].updateWorldTransform(flipX, flipY);
    },
    /** Sets the bones and slots to their setup pose values. */
    setToSetupPose: function () {
        this.setBonesToSetupPose();
        this.setSlotsToSetupPose();
    },
    setBonesToSetupPose: function () {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            bones[i].setToSetupPose();
    },
    setSlotsToSetupPose: function () {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            slots[i].setToSetupPose(i);
    },
    /** @return May return null. */
    getRootBone: function () {
        return this.bones.length ? this.bones[0] : null;
    },
    /** @return May be null. */
    findBone: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return bones[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findBoneIndex: function (boneName) {
        var bones = this.bones;
        for (var i = 0, n = bones.length; i < n; i++)
            if (bones[i].data.name == boneName) return i;
        return -1;
    },
    /** @return May be null. */
    findSlot: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return slots[i];
        return null;
    },
    /** @return -1 if the bone was not found. */
    findSlotIndex: function (slotName) {
        var slots = this.slots;
        for (var i = 0, n = slots.length; i < n; i++)
            if (slots[i].data.name == slotName) return i;
        return -1;
    },
    setSkinByName: function (skinName) {
        var skin = this.data.findSkin(skinName);
        if (!skin) throw "Skin not found: " + skinName;
        this.setSkin(skin);
    },
    /** Sets the skin used to look up attachments not found in the {@link SkeletonData#getDefaultSkin() default skin}. Attachments
     * from the new skin are attached if the corresponding attachment from the old skin was attached.
     * @param newSkin May be null. */
    setSkin: function (newSkin) {
        if (this.skin && newSkin) newSkin._attachAll(this, this.skin);
        this.skin = newSkin;
    },
    /** @return May be null. */
    getAttachmentBySlotName: function (slotName, attachmentName) {
        return this.getAttachmentBySlotIndex(this.data.findSlotIndex(slotName), attachmentName);
    },
    /** @return May be null. */
    getAttachmentBySlotIndex: function (slotIndex, attachmentName) {
        if (this.skin) {
            var attachment = this.skin.getAttachment(slotIndex, attachmentName);
            if (attachment) return attachment;
        }
        if (this.data.defaultSkin) return this.data.defaultSkin.getAttachment(slotIndex, attachmentName);
        return null;
    },
    /** @param attachmentName May be null. */
    setAttachment: function (slotName, attachmentName) {
        var slots = this.slots;
        for (var i = 0, n = slots.size; i < n; i++) {
            var slot = slots[i];
            if (slot.data.name == slotName) {
                var attachment = null;
                if (attachmentName) {
                    attachment = this.getAttachment(i, attachmentName);
                    if (attachment == null) throw "Attachment not found: " + attachmentName + ", for slot: " + slotName;
                }
                slot.setAttachment(attachment);
                return;
            }
        }
        throw "Slot not found: " + slotName;
    },
    update: function (delta) {
        time += delta;
    }
};

spine.AttachmentType = {
    region: 0
};

spine.RegionAttachment = function () {
    this.offset = [];
    this.offset.length = 8;
    this.uvs = [];
    this.uvs.length = 8;
};
spine.RegionAttachment.prototype = {
    x: 0, y: 0,
    rotation: 0,
    scaleX: 1, scaleY: 1,
    width: 0, height: 0,
    rendererObject: null,
    regionOffsetX: 0, regionOffsetY: 0,
    regionWidth: 0, regionHeight: 0,
    regionOriginalWidth: 0, regionOriginalHeight: 0,
    setUVs: function (u, v, u2, v2, rotate) {
        var uvs = this.uvs;
        if (rotate) {
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v2;
            uvs[4/*X3*/] = u;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v;
            uvs[0/*X1*/] = u2;
            uvs[1/*Y1*/] = v2;
        } else {
            uvs[0/*X1*/] = u;
            uvs[1/*Y1*/] = v2;
            uvs[2/*X2*/] = u;
            uvs[3/*Y2*/] = v;
            uvs[4/*X3*/] = u2;
            uvs[5/*Y3*/] = v;
            uvs[6/*X4*/] = u2;
            uvs[7/*Y4*/] = v2;
        }
    },
    updateOffset: function () {
        var regionScaleX = this.width / this.regionOriginalWidth * this.scaleX;
        var regionScaleY = this.height / this.regionOriginalHeight * this.scaleY;
        var localX = -this.width / 2 * this.scaleX + this.regionOffsetX * regionScaleX;
        var localY = -this.height / 2 * this.scaleY + this.regionOffsetY * regionScaleY;
        var localX2 = localX + this.regionWidth * regionScaleX;
        var localY2 = localY + this.regionHeight * regionScaleY;
        var radians = this.rotation * Math.PI / 180;
        var cos = Math.cos(radians);
        var sin = Math.sin(radians);
        var localXCos = localX * cos + this.x;
        var localXSin = localX * sin;
        var localYCos = localY * cos + this.y;
        var localYSin = localY * sin;
        var localX2Cos = localX2 * cos + this.x;
        var localX2Sin = localX2 * sin;
        var localY2Cos = localY2 * cos + this.y;
        var localY2Sin = localY2 * sin;
        var offset = this.offset;
        offset[0/*X1*/] = localXCos - localYSin;
        offset[1/*Y1*/] = localYCos + localXSin;
        offset[2/*X2*/] = localXCos - localY2Sin;
        offset[3/*Y2*/] = localY2Cos + localXSin;
        offset[4/*X3*/] = localX2Cos - localY2Sin;
        offset[5/*Y3*/] = localY2Cos + localX2Sin;
        offset[6/*X4*/] = localX2Cos - localYSin;
        offset[7/*Y4*/] = localYCos + localX2Sin;
    },
    computeVertices: function (x, y, bone, vertices) {
        x += bone.worldX;
        y += bone.worldY;
        var m00 = bone.m00;
        var m01 = bone.m01;
        var m10 = bone.m10;
        var m11 = bone.m11;
        var offset = this.offset;
        vertices[0/*X1*/] = offset[0/*X1*/] * m00 + offset[1/*Y1*/] * m01 + x;
        vertices[1/*Y1*/] = offset[0/*X1*/] * m10 + offset[1/*Y1*/] * m11 + y;
        vertices[2/*X2*/] = offset[2/*X2*/] * m00 + offset[3/*Y2*/] * m01 + x;
        vertices[3/*Y2*/] = offset[2/*X2*/] * m10 + offset[3/*Y2*/] * m11 + y;
        vertices[4/*X3*/] = offset[4/*X3*/] * m00 + offset[5/*X3*/] * m01 + x;
        vertices[5/*X3*/] = offset[4/*X3*/] * m10 + offset[5/*X3*/] * m11 + y;
        vertices[6/*X4*/] = offset[6/*X4*/] * m00 + offset[7/*Y4*/] * m01 + x;
        vertices[7/*Y4*/] = offset[6/*X4*/] * m10 + offset[7/*Y4*/] * m11 + y;
    }
}

spine.AnimationStateData = function (skeletonData) {
    this.skeletonData = skeletonData;
    this.animationToMixTime = {};
};
spine.AnimationStateData.prototype = {
        defaultMix: 0,
    setMixByName: function (fromName, toName, duration) {
        var from = this.skeletonData.findAnimation(fromName);
        if (!from) throw "Animation not found: " + fromName;
        var to = this.skeletonData.findAnimation(toName);
        if (!to) throw "Animation not found: " + toName;
        this.setMix(from, to, duration);
    },
    setMix: function (from, to, duration) {
        this.animationToMixTime[from.name + ":" + to.name] = duration;
    },
    getMix: function (from, to) {
        var time = this.animationToMixTime[from.name + ":" + to.name];
            return time ? time : this.defaultMix;
    }
};

spine.AnimationState = function (stateData) {
    this.data = stateData;
    this.queue = [];
};
spine.AnimationState.prototype = {
    current: null,
    previous: null,
    currentTime: 0,
    previousTime: 0,
    currentLoop: false,
    previousLoop: false,
    mixTime: 0,
    mixDuration: 0,
    update: function (delta) {
        this.currentTime += delta;
        this.previousTime += delta;
        this.mixTime += delta;

        if (this.queue.length > 0) {
            var entry = this.queue[0];
            if (this.currentTime >= entry.delay) {
                this._setAnimation(entry.animation, entry.loop);
                this.queue.shift();
            }
        }
    },
    apply: function (skeleton) {
        if (!this.current) return;
        if (this.previous) {
            this.previous.apply(skeleton, this.previousTime, this.previousLoop);
            var alpha = this.mixTime / this.mixDuration;
            if (alpha >= 1) {
                alpha = 1;
                this.previous = null;
            }
            this.current.mix(skeleton, this.currentTime, this.currentLoop, alpha);
        } else
            this.current.apply(skeleton, this.currentTime, this.currentLoop);
    },
    clearAnimation: function () {
        this.previous = null;
        this.current = null;
        this.queue.length = 0;
    },
    _setAnimation: function (animation, loop) {
        this.previous = null;
        if (animation && this.current) {
            this.mixDuration = this.data.getMix(this.current, animation);
            if (this.mixDuration > 0) {
                this.mixTime = 0;
                this.previous = this.current;
                this.previousTime = this.currentTime;
                this.previousLoop = this.currentLoop;
            }
        }
        this.current = animation;
        this.currentLoop = loop;
        this.currentTime = 0;
    },
    /** @see #setAnimation(Animation, Boolean) */
    setAnimationByName: function (animationName, loop) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        this.setAnimation(animation, loop);
    },
    /** Set the current animation. Any queued animations are cleared and the current animation time is set to 0.
     * @param animation May be null. */
    setAnimation: function (animation, loop) {
        this.queue.length = 0;
        this._setAnimation(animation, loop);
    },
    /** @see #addAnimation(Animation, Boolean, Number) */
    addAnimationByName: function (animationName, loop, delay) {
        var animation = this.data.skeletonData.findAnimation(animationName);
        if (!animation) throw "Animation not found: " + animationName;
        this.addAnimation(animation, loop, delay);
    },
    /** Adds an animation to be played delay seconds after the current or last queued animation.
     * @param delay May be <= 0 to use duration of previous animation minus any mix duration plus the negative delay. */
    addAnimation: function (animation, loop, delay) {
        var entry = {};
        entry.animation = animation;
        entry.loop = loop;

        if (!delay || delay <= 0) {
            var previousAnimation = this.queue.length ? this.queue[this.queue.length - 1].animation : this.current;
            if (previousAnimation != null)
                delay = previousAnimation.duration - this.data.getMix(previousAnimation, animation) + (delay || 0);
            else
                delay = 0;
        }
        entry.delay = delay;

        this.queue.push(entry);
    },
    /** Returns true if no animation is set or if the current time is greater than the animation duration, regardless of looping. */
    isComplete: function () {
        return !this.current || this.currentTime >= this.current.duration;
    }
};

spine.SkeletonJson = function (attachmentLoader) {
    this.attachmentLoader = attachmentLoader;
};
spine.SkeletonJson.prototype = {
    scale: 1,
    readSkeletonData: function (root) {
        /*jshint -W069*/
        var skeletonData = new spine.SkeletonData(),
            boneData;

        // Bones.
        var bones = root["bones"];
        for (var i = 0, n = bones.length; i < n; i++) {
            var boneMap = bones[i];
            var parent = null;
            if (boneMap["parent"]) {
                parent = skeletonData.findBone(boneMap["parent"]);
                if (!parent) throw "Parent bone not found: " + boneMap["parent"];
            }
            boneData = new spine.BoneData(boneMap["name"], parent);
            boneData.length = (boneMap["length"] || 0) * this.scale;
            boneData.x = (boneMap["x"] || 0) * this.scale;
            boneData.y = (boneMap["y"] || 0) * this.scale;
            boneData.rotation = (boneMap["rotation"] || 0);
            boneData.scaleX = boneMap["scaleX"] || 1;
            boneData.scaleY = boneMap["scaleY"] || 1;
            skeletonData.bones.push(boneData);
        }

        // Slots.
        var slots = root["slots"];
        for (i = 0, n = slots.length; i < n; i++) {
            var slotMap = slots[i];
            boneData = skeletonData.findBone(slotMap["bone"]);
            if (!boneData) throw "Slot bone not found: " + slotMap["bone"];
            var slotData = new spine.SlotData(slotMap["name"], boneData);

            var color = slotMap["color"];
            if (color) {
                slotData.r = spine.SkeletonJson.toColor(color, 0);
                slotData.g = spine.SkeletonJson.toColor(color, 1);
                slotData.b = spine.SkeletonJson.toColor(color, 2);
                slotData.a = spine.SkeletonJson.toColor(color, 3);
            }

            slotData.attachmentName = slotMap["attachment"];

            skeletonData.slots.push(slotData);
        }

        // Skins.
        var skins = root["skins"];
        for (var skinName in skins) {
            if (!skins.hasOwnProperty(skinName)) continue;
            var skinMap = skins[skinName];
            var skin = new spine.Skin(skinName);
            for (var slotName in skinMap) {
                if (!skinMap.hasOwnProperty(slotName)) continue;
                var slotIndex = skeletonData.findSlotIndex(slotName);
                var slotEntry = skinMap[slotName];
                for (var attachmentName in slotEntry) {
                    if (!slotEntry.hasOwnProperty(attachmentName)) continue;
                    var attachment = this.readAttachment(skin, attachmentName, slotEntry[attachmentName]);
                    if (attachment != null) skin.addAttachment(slotIndex, attachmentName, attachment);
                }
            }
            skeletonData.skins.push(skin);
            if (skin.name == "default") skeletonData.defaultSkin = skin;
        }

        // Animations.
        var animations = root["animations"];
        for (var animationName in animations) {
            if (!animations.hasOwnProperty(animationName)) continue;
            this.readAnimation(animationName, animations[animationName], skeletonData);
        }

        return skeletonData;
    },
    readAttachment: function (skin, name, map) {
        /*jshint -W069*/
        name = map["name"] || name;

        var type = spine.AttachmentType[map["type"] || "region"];

        if (type == spine.AttachmentType.region) {
            var attachment = new spine.RegionAttachment();
            attachment.x = (map["x"] || 0) * this.scale;
            attachment.y = (map["y"] || 0) * this.scale;
            attachment.scaleX = map["scaleX"] || 1;
            attachment.scaleY = map["scaleY"] || 1;
            attachment.rotation = map["rotation"] || 0;
            attachment.width = (map["width"] || 32) * this.scale;
            attachment.height = (map["height"] || 32) * this.scale;
            attachment.updateOffset();

            attachment.rendererObject = {};
            attachment.rendererObject.name = name;
            attachment.rendererObject.scale = {};
            attachment.rendererObject.scale.x = attachment.scaleX;
            attachment.rendererObject.scale.y = attachment.scaleY;
            attachment.rendererObject.rotation = -attachment.rotation * Math.PI / 180;
            return attachment;
        }

            throw "Unknown attachment type: " + type;
    },

    readAnimation: function (name, map, skeletonData) {
        /*jshint -W069*/
        var timelines = [];
        var duration = 0;
        var frameIndex, timeline, timelineName, valueMap, values,
            i, n;

        var bones = map["bones"];
        for (var boneName in bones) {
            if (!bones.hasOwnProperty(boneName)) continue;
            var boneIndex = skeletonData.findBoneIndex(boneName);
            if (boneIndex == -1) throw "Bone not found: " + boneName;
            var boneMap = bones[boneName];

            for (timelineName in boneMap) {
                if (!boneMap.hasOwnProperty(timelineName)) continue;
                values = boneMap[timelineName];
                if (timelineName == "rotate") {
                    timeline = new spine.RotateTimeline(values.length);
                    timeline.boneIndex = boneIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        timeline.setFrame(frameIndex, valueMap["time"], valueMap["angle"]);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 2 - 2]);

                } else if (timelineName == "translate" || timelineName == "scale") {
                    var timelineScale = 1;
                    if (timelineName == "scale")
                        timeline = new spine.ScaleTimeline(values.length);
                    else {
                        timeline = new spine.TranslateTimeline(values.length);
                        timelineScale = this.scale;
                    }
                    timeline.boneIndex = boneIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        var x = (valueMap["x"] || 0) * timelineScale;
                        var y = (valueMap["y"] || 0) * timelineScale;
                        timeline.setFrame(frameIndex, valueMap["time"], x, y);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 3 - 3]);

                } else
                    throw "Invalid timeline type for a bone: " + timelineName + " (" + boneName + ")";
            }
        }
        var slots = map["slots"];
        for (var slotName in slots) {
            if (!slots.hasOwnProperty(slotName)) continue;
            var slotMap = slots[slotName];
            var slotIndex = skeletonData.findSlotIndex(slotName);

            for (timelineName in slotMap) {
                if (!slotMap.hasOwnProperty(timelineName)) continue;
                values = slotMap[timelineName];
                if (timelineName == "color") {
                    timeline = new spine.ColorTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        var color = valueMap["color"];
                        var r = spine.SkeletonJson.toColor(color, 0);
                        var g = spine.SkeletonJson.toColor(color, 1);
                        var b = spine.SkeletonJson.toColor(color, 2);
                        var a = spine.SkeletonJson.toColor(color, 3);
                        timeline.setFrame(frameIndex, valueMap["time"], r, g, b, a);
                        spine.SkeletonJson.readCurve(timeline, frameIndex, valueMap);
                        frameIndex++;
                    }
                    timelines.push(timeline);
                    duration = Math.max(duration, timeline.frames[timeline.getFrameCount() * 5 - 5]);

                } else if (timelineName == "attachment") {
                    timeline = new spine.AttachmentTimeline(values.length);
                    timeline.slotIndex = slotIndex;

                    frameIndex = 0;
                    for (i = 0, n = values.length; i < n; i++) {
                        valueMap = values[i];
                        timeline.setFrame(frameIndex++, valueMap["time"], valueMap["name"]);
                    }
                    timelines.push(timeline);
                        duration = Math.max(duration, timeline.frames[timeline.getFrameCount() - 1]);

                } else
                    throw "Invalid timeline type for a slot: " + timelineName + " (" + slotName + ")";
            }
        }
        skeletonData.animations.push(new spine.Animation(name, timelines, duration));
    }
};
spine.SkeletonJson.readCurve = function (timeline, frameIndex, valueMap) {
    /*jshint -W069*/
    var curve = valueMap["curve"];
    if (!curve) return;
    if (curve == "stepped")
        timeline.curves.setStepped(frameIndex);
    else if (curve instanceof Array)
        timeline.curves.setCurve(frameIndex, curve[0], curve[1], curve[2], curve[3]);
};
spine.SkeletonJson.toColor = function (hexString, colorIndex) {
    if (hexString.length != 8) throw "Color hexidecimal length must be 8, recieved: " + hexString;
    return parseInt(hexString.substring(colorIndex * 2, 2), 16) / 255;
};

spine.Atlas = function (atlasText, textureLoader) {
    this.textureLoader = textureLoader;
    this.pages = [];
    this.regions = [];

    var reader = new spine.AtlasReader(atlasText);
    var tuple = [];
    tuple.length = 4;
    var page = null;
    while (true) {
        var line = reader.readLine();
        if (line == null) break;
        line = reader.trim(line);
        if (!line.length)
            page = null;
        else if (!page) {
            page = new spine.AtlasPage();
            page.name = line;

            page.format = spine.Atlas.Format[reader.readValue()];

            reader.readTuple(tuple);
            page.minFilter = spine.Atlas.TextureFilter[tuple[0]];
            page.magFilter = spine.Atlas.TextureFilter[tuple[1]];

            var direction = reader.readValue();
            page.uWrap = spine.Atlas.TextureWrap.clampToEdge;
            page.vWrap = spine.Atlas.TextureWrap.clampToEdge;
            if (direction == "x")
                page.uWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "y")
                page.vWrap = spine.Atlas.TextureWrap.repeat;
            else if (direction == "xy")
                page.uWrap = page.vWrap = spine.Atlas.TextureWrap.repeat;

            textureLoader.load(page, line);

            this.pages.push(page);

        } else {
            var region = new spine.AtlasRegion();
            region.name = line;
            region.page = page;

            region.rotate = reader.readValue() == "true";

            reader.readTuple(tuple);
            var x = parseInt(tuple[0], 10);
            var y = parseInt(tuple[1], 10);

            reader.readTuple(tuple);
            var width = parseInt(tuple[0], 10);
            var height = parseInt(tuple[1], 10);

            region.u = x / page.width;
            region.v = y / page.height;
            if (region.rotate) {
                region.u2 = (x + height) / page.width;
                region.v2 = (y + width) / page.height;
            } else {
                region.u2 = (x + width) / page.width;
                region.v2 = (y + height) / page.height;
            }
            region.x = x;
            region.y = y;
            region.width = Math.abs(width);
            region.height = Math.abs(height);

            if (reader.readTuple(tuple) == 4) { // split is optional
                region.splits = [parseInt(tuple[0], 10), parseInt(tuple[1], 10), parseInt(tuple[2], 10), parseInt(tuple[3], 10)];

                if (reader.readTuple(tuple) == 4) { // pad is optional, but only present with splits
                    region.pads = [parseInt(tuple[0], 10), parseInt(tuple[1], 10), parseInt(tuple[2], 10), parseInt(tuple[3], 10)];

                    reader.readTuple(tuple);
                }
            }

            region.originalWidth = parseInt(tuple[0], 10);
            region.originalHeight = parseInt(tuple[1], 10);

            reader.readTuple(tuple);
            region.offsetX = parseInt(tuple[0], 10);
            region.offsetY = parseInt(tuple[1], 10);

            region.index = parseInt(reader.readValue(), 10);

            this.regions.push(region);
        }
    }
};
spine.Atlas.prototype = {
    findRegion: function (name) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++)
            if (regions[i].name == name) return regions[i];
        return null;
    },
    dispose: function () {
        var pages = this.pages;
        for (var i = 0, n = pages.length; i < n; i++)
            this.textureLoader.unload(pages[i].rendererObject);
    },
    updateUVs: function (page) {
        var regions = this.regions;
        for (var i = 0, n = regions.length; i < n; i++) {
            var region = regions[i];
            if (region.page != page) continue;
            region.u = region.x / page.width;
            region.v = region.y / page.height;
            if (region.rotate) {
                region.u2 = (region.x + region.height) / page.width;
                region.v2 = (region.y + region.width) / page.height;
            } else {
                region.u2 = (region.x + region.width) / page.width;
                region.v2 = (region.y + region.height) / page.height;
            }
        }
    }
};

spine.Atlas.Format = {
    alpha: 0,
    intensity: 1,
    luminanceAlpha: 2,
    rgb565: 3,
    rgba4444: 4,
    rgb888: 5,
    rgba8888: 6
};

spine.Atlas.TextureFilter = {
    nearest: 0,
    linear: 1,
    mipMap: 2,
    mipMapNearestNearest: 3,
    mipMapLinearNearest: 4,
    mipMapNearestLinear: 5,
    mipMapLinearLinear: 6
};

spine.Atlas.TextureWrap = {
    mirroredRepeat: 0,
    clampToEdge: 1,
    repeat: 2
};

spine.AtlasPage = function () {};
spine.AtlasPage.prototype = {
    name: null,
    format: null,
    minFilter: null,
    magFilter: null,
    uWrap: null,
    vWrap: null,
    rendererObject: null,
    width: 0,
    height: 0
};

spine.AtlasRegion = function () {};
spine.AtlasRegion.prototype = {
    page: null,
    name: null,
    x: 0, y: 0,
    width: 0, height: 0,
    u: 0, v: 0, u2: 0, v2: 0,
    offsetX: 0, offsetY: 0,
    originalWidth: 0, originalHeight: 0,
    index: 0,
    rotate: false,
    splits: null,
    pads: null,
};

spine.AtlasReader = function (text) {
    this.lines = text.split(/\r\n|\r|\n/);
};
spine.AtlasReader.prototype = {
    index: 0,
    trim: function (value) {
        return value.replace(/^\s+|\s+$/g, "");
    },
    readLine: function () {
        if (this.index >= this.lines.length) return null;
        return this.lines[this.index++];
    },
    readValue: function () {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        return this.trim(line.substring(colon + 1));
    },
    /** Returns the number of tuple values read (2 or 4). */
    readTuple: function (tuple) {
        var line = this.readLine();
        var colon = line.indexOf(":");
        if (colon == -1) throw "Invalid line: " + line;
        var i = 0, lastMatch= colon + 1;
        for (; i < 3; i++) {
            var comma = line.indexOf(",", lastMatch);
            if (comma == -1) {
                if (!i) throw "Invalid line: " + line;
                break;
            }
            tuple[i] = this.trim(line.substr(lastMatch, comma - lastMatch));
            lastMatch = comma + 1;
        }
        tuple[i] = this.trim(line.substring(lastMatch));
        return i + 1;
    }
}

spine.AtlasAttachmentLoader = function (atlas) {
    this.atlas = atlas;
}
spine.AtlasAttachmentLoader.prototype = {
    newAttachment: function (skin, type, name) {
        switch (type) {
        case spine.AttachmentType.region:
            var region = this.atlas.findRegion(name);
            if (!region) throw "Region not found in atlas: " + name + " (" + type + ")";
            var attachment = new spine.RegionAttachment(name);
            attachment.rendererObject = region;
            attachment.setUVs(region.u, region.v, region.u2, region.v2, region.rotate);
            attachment.regionOffsetX = region.offsetX;
            attachment.regionOffsetY = region.offsetY;
            attachment.regionWidth = region.width;
            attachment.regionHeight = region.height;
            attachment.regionOriginalWidth = region.originalWidth;
            attachment.regionOriginalHeight = region.originalHeight;
            return attachment;
        }
        throw "Unknown attachment type: " + type;
    }
}

spine.Bone.yDown = true;
PIXI.AnimCache = {};

/**
 * A class that enables the you to import and run your spine animations in pixi.
 * Spine animation data needs to be loaded using the PIXI.AssetLoader or PIXI.SpineLoader before it can be used by this class
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 *
 * @class Spine
 * @extends DisplayObjectContainer
 * @constructor
 * @param url {String} The url of the spine anim file to be used
 */
PIXI.Spine = function (url) {
    PIXI.DisplayObjectContainer.call(this);

    this.spineData = PIXI.AnimCache[url];

    if (!this.spineData) {
        throw new Error("Spine data must be preloaded using PIXI.SpineLoader or PIXI.AssetLoader: " + url);
    }

    this.skeleton = new spine.Skeleton(this.spineData);
    this.skeleton.updateWorldTransform();

    this.stateData = new spine.AnimationStateData(this.spineData);
    this.state = new spine.AnimationState(this.stateData);

    this.slotContainers = [];

    for (var i = 0, n = this.skeleton.drawOrder.length; i < n; i++) {
        var slot = this.skeleton.drawOrder[i];
        var attachment = slot.attachment;
        var slotContainer = new PIXI.DisplayObjectContainer();
        this.slotContainers.push(slotContainer);
        this.addChild(slotContainer);
        if (!(attachment instanceof spine.RegionAttachment)) {
            continue;
        }
        var spriteName = attachment.rendererObject.name;
        var sprite = this.createSprite(slot, attachment.rendererObject);
        slot.currentSprite = sprite;
        slot.currentSpriteName = spriteName;
        slotContainer.addChild(sprite);
    }
};

PIXI.Spine.prototype = Object.create(PIXI.DisplayObjectContainer.prototype);
PIXI.Spine.prototype.constructor = PIXI.Spine;

/*
 * Updates the object transform for rendering
 *
 * @method updateTransform
 * @private
 */
PIXI.Spine.prototype.updateTransform = function () {
    this.lastTime = this.lastTime || Date.now();
    var timeDelta = (Date.now() - this.lastTime) * 0.001;
    this.lastTime = Date.now();
    this.state.update(timeDelta);
    this.state.apply(this.skeleton);
    this.skeleton.updateWorldTransform();

    var drawOrder = this.skeleton.drawOrder;
    for (var i = 0, n = drawOrder.length; i < n; i++) {
        var slot = drawOrder[i];
        var attachment = slot.attachment;
        var slotContainer = this.slotContainers[i];
        if (!(attachment instanceof spine.RegionAttachment)) {
            slotContainer.visible = false;
            continue;
        }

        if (attachment.rendererObject) {
            if (!slot.currentSpriteName || slot.currentSpriteName != attachment.name) {
                var spriteName = attachment.rendererObject.name;
                if (slot.currentSprite !== undefined) {
                    slot.currentSprite.visible = false;
                }
                slot.sprites = slot.sprites || {};
                if (slot.sprites[spriteName] !== undefined) {
                    slot.sprites[spriteName].visible = true;
                } else {
                    var sprite = this.createSprite(slot, attachment.rendererObject);
                    slotContainer.addChild(sprite);
                }
                slot.currentSprite = slot.sprites[spriteName];
                slot.currentSpriteName = spriteName;
            }
        }
        slotContainer.visible = true;

        var bone = slot.bone;

        slotContainer.position.x = bone.worldX + attachment.x * bone.m00 + attachment.y * bone.m01;
        slotContainer.position.y = bone.worldY + attachment.x * bone.m10 + attachment.y * bone.m11;
        slotContainer.scale.x = bone.worldScaleX;
        slotContainer.scale.y = bone.worldScaleY;

        slotContainer.rotation = -(slot.bone.worldRotation * Math.PI / 180);
    }

    PIXI.DisplayObjectContainer.prototype.updateTransform.call(this);
};


PIXI.Spine.prototype.createSprite = function (slot, descriptor) {
    var name = PIXI.TextureCache[descriptor.name] ? descriptor.name : descriptor.name + ".png";
    var sprite = new PIXI.Sprite(PIXI.Texture.fromFrame(name));
    sprite.scale = descriptor.scale;
    sprite.rotation = descriptor.rotation;
    sprite.anchor.x = sprite.anchor.y = 0.5;

    slot.sprites = slot.sprites || {};
    slot.sprites[descriptor.name] = sprite;
    return sprite;
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BaseTextureCache = {};
PIXI.texturesToUpdate = [];
PIXI.texturesToDestroy = [];

/**
 * A texture stores the information that represents an image. All textures have a base texture
 *
 * @class BaseTexture
 * @uses EventTarget
 * @constructor
 * @param source {String} the source object (image or canvas)
 */
PIXI.BaseTexture = function(source, scaleMode)
{
    PIXI.EventTarget.call( this );

    /**
     * [read-only] The width of the base texture set when the image has loaded
     *
     * @property width
     * @type Number
     * @readOnly
     */
    this.width = 100;

    /**
     * [read-only] The height of the base texture set when the image has loaded
     *
     * @property height
     * @type Number
     * @readOnly
     */
    this.height = 100;

    /**
     * The scale mode to apply when scaling this texture
     * @property scaleMode
     * @type PIXI.BaseTexture.SCALE_MODE
     * @default PIXI.BaseTexture.SCALE_MODE.LINEAR
     */
    this.scaleMode = scaleMode || PIXI.BaseTexture.SCALE_MODE.DEFAULT;

    /**
     * [read-only] Describes if the base texture has loaded or not
     *
     * @property hasLoaded
     * @type Boolean
     * @readOnly
     */
    this.hasLoaded = false;

    /**
     * The source that is loaded to create the texture
     *
     * @property source
     * @type Image
     */
    this.source = source;

    if(!source)return;

    if(this.source instanceof Image || this.source instanceof HTMLImageElement)
    {
        if(this.source.complete)
        {
            this.hasLoaded = true;
            this.width = this.source.width;
            this.height = this.source.height;

            PIXI.texturesToUpdate.push(this);
        }
        else
        {

            var scope = this;
            this.source.onload = function() {

                scope.hasLoaded = true;
                scope.width = scope.source.width;
                scope.height = scope.source.height;

                // add it to somewhere...
                PIXI.texturesToUpdate.push(scope);
                scope.dispatchEvent( { type: 'loaded', content: scope } );
            };
            //this.image.src = imageUrl;
        }
    }
    else
    {
        this.hasLoaded = true;
        this.width = this.source.width;
        this.height = this.source.height;

        PIXI.texturesToUpdate.push(this);
    }

    this.imageUrl = null;
    this._powerOf2 = false;


    // used for webGL
    this._glTextures = [];

};

PIXI.BaseTexture.prototype.constructor = PIXI.BaseTexture;

/**
 * Destroys this base texture
 *
 * @method destroy
 */
PIXI.BaseTexture.prototype.destroy = function()
{
    if(this.source instanceof Image)
    {
        if (this.imageUrl in PIXI.BaseTextureCache)
            delete PIXI.BaseTextureCache[this.imageUrl];
        this.imageUrl = null;
        this.source.src = null;
    }
    this.source = null;
    PIXI.texturesToDestroy.push(this);
};

/**
 *
 *
 * @method destroy
 */

PIXI.BaseTexture.prototype.updateSourceImage = function(newSrc)
{
    this.hasLoaded = false;
    this.source.src = null;
    this.source.src = newSrc;
};

/**
 * Helper function that returns a base texture based on an image url
 * If the image is not in the base texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @return BaseTexture
 */
PIXI.BaseTexture.fromImage = function(imageUrl, crossorigin, scaleMode)
{
    var baseTexture = PIXI.BaseTextureCache[imageUrl];
    if(!baseTexture)
    {
        // new Image() breaks tex loading in some versions of Chrome.
        // See https://code.google.com/p/chromium/issues/detail?id=238071
        var image = new Image();//document.createElement('img');
        if (crossorigin)
        {
            image.crossOrigin = '';
        }
        image.src = imageUrl;
        baseTexture = new PIXI.BaseTexture(image, scaleMode);
        baseTexture.imageUrl = imageUrl;
        PIXI.BaseTextureCache[imageUrl] = baseTexture;
    }

    return baseTexture;
};

PIXI.BaseTexture.SCALE_MODE = {
    DEFAULT: 0, //default to LINEAR
    LINEAR: 0,
    NEAREST: 1
};
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.TextureCache = {};
PIXI.FrameCache = {};

/**
 * A texture stores the information that represents an image or part of an image. It cannot be added
 * to the display list directly. To do this use PIXI.Sprite. If no frame is provided then the whole image is used
 *
 * @class Texture
 * @uses EventTarget
 * @constructor
 * @param baseTexture {BaseTexture} The base texture source to create the texture from
 * @param frame {Rectangle} The rectangle frame of the texture to show
 */
PIXI.Texture = function(baseTexture, frame)
{
    PIXI.EventTarget.call( this );

    if(!frame)
    {
        this.noFrame = true;
        frame = new PIXI.Rectangle(0,0,1,1);
    }

    if(baseTexture instanceof PIXI.Texture)
        baseTexture = baseTexture.baseTexture;

    /**
     * The base texture of this texture
     *
     * @property baseTexture
     * @type BaseTexture
     */
    this.baseTexture = baseTexture;

    /**
     * The frame specifies the region of the base texture that this texture uses
     *
     * @property frame
     * @type Rectangle
     */
    this.frame = frame;

    /**
     * The trim point
     *
     * @property trim
     * @type Point
     */
    this.trim = new PIXI.Point();

    this.scope = this;

    if(baseTexture.hasLoaded)
    {
        if(this.noFrame)frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
      
        this.setFrame(frame);
    }
    else
    {
        var scope = this;
        baseTexture.addEventListener('loaded', function(){ scope.onBaseTextureLoaded(); });
    }
};

PIXI.Texture.prototype.constructor = PIXI.Texture;

/**
 * Called when the base texture is loaded
 *
 * @method onBaseTextureLoaded
 * @param event
 * @private
 */
PIXI.Texture.prototype.onBaseTextureLoaded = function()
{
    var baseTexture = this.baseTexture;
    baseTexture.removeEventListener( 'loaded', this.onLoaded );

    if(this.noFrame)this.frame = new PIXI.Rectangle(0,0, baseTexture.width, baseTexture.height);
    
    this.setFrame(this.frame);

    this.scope.dispatchEvent( { type: 'update', content: this } );
};

/**
 * Destroys this texture
 *
 * @method destroy
 * @param destroyBase {Boolean} Whether to destroy the base texture as well
 */
PIXI.Texture.prototype.destroy = function(destroyBase)
{
    if(destroyBase) this.baseTexture.destroy();
};

/**
 * Specifies the rectangle region of the baseTexture
 *
 * @method setFrame
 * @param frame {Rectangle} The frame of the texture to set it to
 */
PIXI.Texture.prototype.setFrame = function(frame)
{
    this.frame = frame;
    this.width = frame.width;
    this.height = frame.height;

    if(frame.x + frame.width > this.baseTexture.width || frame.y + frame.height > this.baseTexture.height)
    {
        throw new Error('Texture Error: frame does not fit inside the base Texture dimensions ' + this);
    }

    this.updateFrame = true;

    PIXI.Texture.frameUpdates.push(this);
    //this.dispatchEvent( { type: 'update', content: this } );
};

PIXI.Texture.prototype._updateWebGLuvs = function()
{
    if(!this._uvs)this._uvs = new Float32Array(8);

    var frame = this.frame;
    var tw = this.baseTexture.width;
    var th = this.baseTexture.height;

    this._uvs[0] = frame.x / tw;
    this._uvs[1] = frame.y / th;

    this._uvs[2] = (frame.x + frame.width) / tw;
    this._uvs[3] = frame.y / th;

    this._uvs[4] = (frame.x + frame.width) / tw;
    this._uvs[5] = (frame.y + frame.height) / th;

    this._uvs[6] = frame.x / tw;
    this._uvs[7] = (frame.y + frame.height) / th;
};

/**
 * Helper function that returns a texture based on an image url
 * If the image is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromImage
 * @param imageUrl {String} The image url of the texture
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 * @return Texture
 */
PIXI.Texture.fromImage = function(imageUrl, crossorigin, scaleMode)
{
    var texture = PIXI.TextureCache[imageUrl];

    if(!texture)
    {
        texture = new PIXI.Texture(PIXI.BaseTexture.fromImage(imageUrl, crossorigin, scaleMode));
        PIXI.TextureCache[imageUrl] = texture;
    }

    return texture;
};

/**
 * Helper function that returns a texture based on a frame id
 * If the frame id is not in the texture cache an error will be thrown
 *
 * @static
 * @method fromFrame
 * @param frameId {String} The frame id of the texture
 * @return Texture
 */
PIXI.Texture.fromFrame = function(frameId)
{
    var texture = PIXI.TextureCache[frameId];
    if(!texture) throw new Error('The frameId "' + frameId + '" does not exist in the texture cache ' + this);
    return texture;
};

/**
 * Helper function that returns a texture based on a canvas element
 * If the canvas is not in the texture cache it will be  created and loaded
 *
 * @static
 * @method fromCanvas
 * @param canvas {Canvas} The canvas element source of the texture
 * @return Texture
 */
PIXI.Texture.fromCanvas = function(canvas, scaleMode)
{
    var baseTexture = new PIXI.BaseTexture(canvas, scaleMode);
    return new PIXI.Texture(baseTexture);
};


/**
 * Adds a texture to the textureCache.
 *
 * @static
 * @method addTextureToCache
 * @param texture {Texture}
 * @param id {String} the id that the texture will be stored against.
 */
PIXI.Texture.addTextureToCache = function(texture, id)
{
    PIXI.TextureCache[id] = texture;
};

/**
 * Remove a texture from the textureCache.
 *
 * @static
 * @method removeTextureFromCache
 * @param id {String} the id of the texture to be removed
 * @return {Texture} the texture that was removed
 */
PIXI.Texture.removeTextureFromCache = function(id)
{
    var texture = PIXI.TextureCache[id];
    PIXI.TextureCache[id] = null;
    return texture;
};

// this is more for webGL.. it contains updated frames..
PIXI.Texture.frameUpdates = [];

PIXI.Texture.SCALE_MODE = PIXI.BaseTexture.SCALE_MODE;

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 A RenderTexture is a special texture that allows any pixi displayObject to be rendered to it.

 __Hint__: All DisplayObjects (exmpl. Sprites) that renders on RenderTexture should be preloaded.
 Otherwise black rectangles will be drawn instead.

 RenderTexture takes snapshot of DisplayObject passed to render method. If DisplayObject is passed to render method, position and rotation of it will be ignored. For example:

    var renderTexture = new PIXI.RenderTexture(800, 600);
    var sprite = PIXI.Sprite.fromImage("spinObj_01.png");
    sprite.position.x = 800/2;
    sprite.position.y = 600/2;
    sprite.anchor.x = 0.5;
    sprite.anchor.y = 0.5;
    renderTexture.render(sprite);

 Sprite in this case will be rendered to 0,0 position. To render this sprite at center DisplayObjectContainer should be used:

    var doc = new PIXI.DisplayObjectContainer();
    doc.addChild(sprite);
    renderTexture.render(doc);  // Renders to center of renderTexture

 @class RenderTexture
 @extends Texture
 @constructor
 @param width {Number} The width of the render texture
 @param height {Number} The height of the render texture
 */
PIXI.RenderTexture = function(width, height, renderer)
{
    PIXI.EventTarget.call( this );

    this.width = width || 100;
    this.height = height || 100;

    this.indetityMatrix = PIXI.mat3.create();

    this.frame = new PIXI.Rectangle(0, 0, this.width, this.height);

    this.baseTexture = new PIXI.BaseTexture();
    this.baseTexture.width = this.width;
    this.baseTexture.height = this.height;
    this.baseTexture._glTextures = [];

    this.baseTexture.hasLoaded = true;
    
    // each render texture can only belong to one renderer at the moment if its webGL
    this.renderer = renderer || PIXI.defaultRenderer;

    if(this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        var gl = this.renderer.gl;

        this.textureBuffer = new PIXI.FilterTexture(gl, this.width, this.height);
        this.baseTexture._glTextures[gl.id] =  this.textureBuffer.texture;

        this.render = this.renderWebGL;
        this.projection = new PIXI.Point(this.width/2 , -this.height/2);
    }
    else
    {
        this.render = this.renderCanvas;
        this.textureBuffer = new PIXI.CanvasBuffer(this.width, this.height);
        this.baseTexture.source = this.textureBuffer.canvas;
    }

    PIXI.Texture.frameUpdates.push(this);
};

PIXI.RenderTexture.prototype = Object.create( PIXI.Texture.prototype );
PIXI.RenderTexture.prototype.constructor = PIXI.RenderTexture;

PIXI.RenderTexture.prototype.resize = function(width, height)
{
    this.width = width;
    this.height = height;

    this.frame.width = this.width;
    this.frame.height = this.height;

    if(this.renderer.type === PIXI.WEBGL_RENDERER)
    {
        this.projection.x = this.width / 2;
        this.projection.y = -this.height / 2;

        var gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.baseTexture._glTextures[gl.id]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA,  this.width,  this.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    }
    else
    {
        this.textureBuffer.resize(this.width, this.height);
    }

    PIXI.Texture.frameUpdates.push(this);
};

/**
 * This function will draw the display object to the texture.
 *
 * @method renderWebGL
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderWebGL = function(displayObject, position, clear)
{
    var gl = this.renderer.gl;

    gl.colorMask(true, true, true, true);

    gl.viewport(0, 0, this.width, this.height);

    gl.bindFramebuffer(gl.FRAMEBUFFER, this.textureBuffer.frameBuffer );

    if(clear)this.textureBuffer.clear();

    // THIS WILL MESS WITH HIT TESTING!
    var children = displayObject.children;

    //TODO -? create a new one??? dont think so!
    var originalWorldTransform = displayObject.worldTransform;
    displayObject.worldTransform = PIXI.mat3.create();//sthis.indetityMatrix;
    // modify to flip...
    displayObject.worldTransform[4] = -1;
    displayObject.worldTransform[5] = this.projection.y * -2;

    if(position)
    {
        displayObject.worldTransform[2] = position.x;
        displayObject.worldTransform[5] -= position.y;
    }

    PIXI.visibleCount++;
    displayObject.vcount = PIXI.visibleCount;

    for(var i=0,j=children.length; i<j; i++)
    {
        children[i].updateTransform();
    }


    // 
    this.renderer.renderDisplayObject(displayObject, this.projection);

    displayObject.worldTransform = originalWorldTransform;
};


/**
 * This function will draw the display object to the texture.
 *
 * @method renderCanvas
 * @param displayObject {DisplayObject} The display object to render this texture on
 * @param clear {Boolean} If true the texture will be cleared before the displayObject is drawn
 * @private
 */
PIXI.RenderTexture.prototype.renderCanvas = function(displayObject, position, clear)
{
    //console.log("!!")
    var children = displayObject.children;

    displayObject.worldTransform = PIXI.mat3.create();

    if(position)
    {
        displayObject.worldTransform[2] = position.x;
        displayObject.worldTransform[5] = position.y;
    }

    for(var i = 0, j = children.length; i < j; i++)
    {
        children[i].updateTransform();
    }

    if(clear)this.textureBuffer.clear();

    var context = this.textureBuffer.context;

    this.renderer.renderDisplayObject(displayObject, context);

    context.setTransform(1,0,0,1,0,0);

};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * A Class that loads a bunch of images / sprite sheet / bitmap font files. Once the
 * assets have been loaded they are added to the PIXI Texture cache and can be accessed
 * easily through PIXI.Texture.fromImage() and PIXI.Sprite.fromImage()
 * When all items have been loaded this class will dispatch a 'onLoaded' event
 * As each individual item is loaded this class will dispatch a 'onProgress' event
 *
 * @class AssetLoader
 * @constructor
 * @uses EventTarget
 * @param {Array<String>} assetURLs an array of image/sprite sheet urls that you would like loaded
 *      supported. Supported image formats include 'jpeg', 'jpg', 'png', 'gif'. Supported
 *      sprite sheet data formats only include 'JSON' at this time. Supported bitmap font
 *      data formats include 'xml' and 'fnt'.
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.AssetLoader = function(assetURLs, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The array of asset URLs that are going to be loaded
     *
     * @property assetURLs
     * @type Array<String>
     */
    this.assetURLs = assetURLs;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * Maps file extension to loader types
     *
     * @property loadersByType
     * @type Object
     */
    this.loadersByType = {
        'jpg':  PIXI.ImageLoader,
        'jpeg': PIXI.ImageLoader,
        'png':  PIXI.ImageLoader,
        'gif':  PIXI.ImageLoader,
        'json': PIXI.JsonLoader,
        'atlas': PIXI.AtlasLoader,
        'anim': PIXI.SpineLoader,
        'xml':  PIXI.BitmapFontLoader,
        'fnt':  PIXI.BitmapFontLoader
    };
};

/**
 * Fired when an item has loaded
 * @event onProgress
 */

/**
 * Fired when all the assets have loaded
 * @event onComplete
 */

// constructor
PIXI.AssetLoader.prototype.constructor = PIXI.AssetLoader;


PIXI.AssetLoader.prototype._getDataType = function(str)
{
    var test = 'data:';
    //starts with 'data:'
    var start = str.slice(0, test.length).toLowerCase();
    if (start === test) {
        var data = str.slice(test.length);

        var sepIdx = data.indexOf(',');
        if (sepIdx === -1) //malformed data URI scheme
            return null;

        //e.g. 'image/gif;base64' => 'image/gif'
        var info = data.slice(0, sepIdx).split(';')[0];

        //We might need to handle some special cases here...
        //standardize text/plain to 'txt' file extension
        if (!info || info.toLowerCase() === 'text/plain')
            return 'txt';

        //User specified mime type, try splitting it by '/'
        return info.split('/').pop().toLowerCase();
    }

    return null;
};

/**
 * Starts loading the assets sequentially
 *
 * @method load
 */
PIXI.AssetLoader.prototype.load = function()
{
    var scope = this;

    function onLoad() {
        scope.onAssetLoaded();
    }

    this.loadCount = this.assetURLs.length;

    for (var i=0; i < this.assetURLs.length; i++)
    {
        var fileName = this.assetURLs[i];
        //first see if we have a data URI scheme..
        var fileType = this._getDataType(fileName);

        //if not, assume it's a file URI
        if (!fileType)
            fileType = fileName.split('?').shift().split('.').pop().toLowerCase();

        var Constructor = this.loadersByType[fileType];
        if(!Constructor)
            throw new Error(fileType + ' is an unsupported file type');

        var loader = new Constructor(fileName, this.crossorigin);

        loader.addEventListener('loaded', onLoad);
        loader.load();
    }
};

/**
 * Invoked after each file is loaded
 *
 * @method onAssetLoaded
 * @private
 */
PIXI.AssetLoader.prototype.onAssetLoaded = function()
{
    this.loadCount--;
    this.dispatchEvent({type: 'onProgress', content: this});
    if (this.onProgress) this.onProgress();

    if (!this.loadCount)
    {
        this.dispatchEvent({type: 'onComplete', content: this});
        if(this.onComplete) this.onComplete();
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The json file loader is used to load in JSON data and parsing it
 * When loaded this class will dispatch a 'loaded' event
 * If load failed this class will dispatch a 'error' event
 *
 * @class JsonLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.JsonLoader = function (url, crossorigin) {
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * [read-only] Whether the data has loaded yet
     *
     * @property loaded
     * @type Boolean
     * @readOnly
     */
    this.loaded = false;

};

// constructor
PIXI.JsonLoader.prototype.constructor = PIXI.JsonLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.JsonLoader.prototype.load = function () {
    this.ajaxRequest = new PIXI.AjaxRequest();
    var scope = this;
    this.ajaxRequest.onreadystatechange = function () {
        scope.onJSONLoaded();
    };

    this.ajaxRequest.open('GET', this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType('application/json');
    this.ajaxRequest.send(null);
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onJSONLoaded = function () {
    if (this.ajaxRequest.readyState === 4) {
        if (this.ajaxRequest.status === 200 || window.location.protocol.indexOf('http') === -1) {
            this.json = JSON.parse(this.ajaxRequest.responseText);

            if(this.json.frames)
            {
                // sprite sheet
                var scope = this;
                var textureUrl = this.baseUrl + this.json.meta.image;
                var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
                var frameData = this.json.frames;

                this.texture = image.texture.baseTexture;
                image.addEventListener('loaded', function() {
                    scope.onLoaded();
                });

                for (var i in frameData) {
                    var rect = frameData[i].frame;
                    if (rect) {
                        PIXI.TextureCache[i] = new PIXI.Texture(this.texture, {
                            x: rect.x,
                            y: rect.y,
                            width: rect.w,
                            height: rect.h
                        });

                        // check to see ifthe sprite ha been trimmed..
                        if (frameData[i].trimmed) {

                            var texture =  PIXI.TextureCache[i];
                            
                            texture.trimmed = true;

                            var actualSize = frameData[i].sourceSize;
                            var realSize = frameData[i].spriteSourceSize;

                            texture.trim.x = realSize.x;
                            texture.trim.y = realSize.y;
                            texture.trim.realWidth = actualSize.w;
                            texture.trim.realHeight = actualSize.h;
                        }
                    }
                }

                image.load();

            }
            else if(this.json.bones)
            {
                // spine animation
                var spineJsonParser = new spine.SkeletonJson();
                var skeletonData = spineJsonParser.readSkeletonData(this.json);
                PIXI.AnimCache[this.url] = skeletonData;
                this.onLoaded();
            }
            else
            {
                this.onLoaded();
            }
        }
        else
        {
            this.onError();
        }
    }
};

/**
 * Invoke when json file loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.JsonLoader.prototype.onLoaded = function () {
    this.loaded = true;
    this.dispatchEvent({
        type: 'loaded',
        content: this
    });
};

/**
 * Invoke when error occured
 *
 * @method onError
 * @private
 */
PIXI.JsonLoader.prototype.onError = function () {
    this.dispatchEvent({
        type: 'error',
        content: this
    });
};
/**
 * @author Martin Kelm http://mkelm.github.com
 */

/**
 * The atlas file loader is used to load in Atlas data and parsing it
 * When loaded this class will dispatch a 'loaded' event
 * If load failed this class will dispatch a 'error' event
 * @class AtlasLoader
 * @extends EventTarget
 * @constructor
 * @param {String} url the url of the JSON file
 * @param {Boolean} crossorigin
 */

PIXI.AtlasLoader = function (url, crossorigin) {
    PIXI.EventTarget.call(this);
    this.url = url;
    this.baseUrl = url.replace(/[^\/]*$/, '');
    this.crossorigin = crossorigin;
    this.loaded = false;

};

// constructor
PIXI.AtlasLoader.constructor = PIXI.AtlasLoader;

/**
 * This will begin loading the JSON file
 */
PIXI.AtlasLoader.prototype.load = function () {
    this.ajaxRequest = new PIXI.AjaxRequest();
    this.ajaxRequest.onreadystatechange = this.onAtlasLoaded.bind(this);

    this.ajaxRequest.open('GET', this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType('application/json');
    this.ajaxRequest.send(null);
};

/**
 * Invoke when JSON file is loaded
 * @private
 */
PIXI.AtlasLoader.prototype.onAtlasLoaded = function () {
    if (this.ajaxRequest.readyState === 4) {
        if (this.ajaxRequest.status === 200 || window.location.href.indexOf('http') === -1) {
            this.atlas = {
                meta : {
                    image : []
                },
                frames : []
            };
            var result = this.ajaxRequest.responseText.split(/\r?\n/);
            var lineCount = -3;

            var currentImageId = 0;
            var currentFrame = null;
            var nameInNextLine = false;

            var i = 0,
                j = 0,
                selfOnLoaded = this.onLoaded.bind(this);

            // parser without rotation support yet!
            for (i = 0; i < result.length; i++) {
                result[i] = result[i].replace(/^\s+|\s+$/g, '');
                if (result[i] === '') {
                    nameInNextLine = i+1;
                }
                if (result[i].length > 0) {
                    if (nameInNextLine === i) {
                        this.atlas.meta.image.push(result[i]);
                        currentImageId = this.atlas.meta.image.length - 1;
                        this.atlas.frames.push({});
                        lineCount = -3;
                    } else if (lineCount > 0) {
                        if (lineCount % 7 === 1) { // frame name
                            if (currentFrame != null) { //jshint ignore:line
                                this.atlas.frames[currentImageId][currentFrame.name] = currentFrame;
                            }
                            currentFrame = { name: result[i], frame : {} };
                        } else {
                            var text = result[i].split(' ');
                            if (lineCount % 7 === 3) { // position
                                currentFrame.frame.x = Number(text[1].replace(',', ''));
                                currentFrame.frame.y = Number(text[2]);
                            } else if (lineCount % 7 === 4) { // size
                                currentFrame.frame.w = Number(text[1].replace(',', ''));
                                currentFrame.frame.h = Number(text[2]);
                            } else if (lineCount % 7 === 5) { // real size
                                var realSize = {
                                    x : 0,
                                    y : 0,
                                    w : Number(text[1].replace(',', '')),
                                    h : Number(text[2])
                                };

                                if (realSize.w > currentFrame.frame.w || realSize.h > currentFrame.frame.h) {
                                    currentFrame.trimmed = true;
                                    currentFrame.realSize = realSize;
                                } else {
                                    currentFrame.trimmed = false;
                                }
                            }
                        }
                    }
                    lineCount++;
                }
            }

            if (currentFrame != null) { //jshint ignore:line
                this.atlas.frames[currentImageId][currentFrame.name] = currentFrame;
            }

            if (this.atlas.meta.image.length > 0) {
                this.images = [];
                for (j = 0; j < this.atlas.meta.image.length; j++) {
                    // sprite sheet
                    var textureUrl = this.baseUrl + this.atlas.meta.image[j];
                    var frameData = this.atlas.frames[j];
                    this.images.push(new PIXI.ImageLoader(textureUrl, this.crossorigin));

                    for (i in frameData) {
                        var rect = frameData[i].frame;
                        if (rect) {
                            PIXI.TextureCache[i] = new PIXI.Texture(this.images[j].texture.baseTexture, {
                                x: rect.x,
                                y: rect.y,
                                width: rect.w,
                                height: rect.h
                            });
                            if (frameData[i].trimmed) {
                                PIXI.TextureCache[i].realSize = frameData[i].realSize;
                                // trim in pixi not supported yet, todo update trim properties if it is done ...
                                PIXI.TextureCache[i].trim.x = 0;
                                PIXI.TextureCache[i].trim.y = 0;
                            }
                        }
                    }
                }

                this.currentImageId = 0;
                for (j = 0; j < this.images.length; j++) {
                    this.images[j].addEventListener('loaded', selfOnLoaded);
                }
                this.images[this.currentImageId].load();

            } else {
                this.onLoaded();
            }

        } else {
            this.onError();
        }
    }
};

/**
 * Invoke when json file loaded
 * @private
 */
PIXI.AtlasLoader.prototype.onLoaded = function () {
    if (this.images.length - 1 > this.currentImageId) {
        this.currentImageId++;
        this.images[this.currentImageId].load();
    } else {
        this.loaded = true;
        this.dispatchEvent({
            type: 'loaded',
            content: this
        });
    }
};

/**
 * Invoke when error occured
 * @private
 */
PIXI.AtlasLoader.prototype.onError = function () {
    this.dispatchEvent({
        type: 'error',
        content: this
    });
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The sprite sheet loader is used to load in JSON sprite sheet data
 * To generate the data you can use http://www.codeandweb.com/texturepacker and publish the 'JSON' format
 * There is a free version so thats nice, although the paid version is great value for money.
 * It is highly recommended to use Sprite sheets (also know as texture atlas') as it means sprite's can be batched and drawn together for highly increased rendering speed.
 * Once the data has been loaded the frames are stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFromeId()
 * This loader will also load the image file that the Spritesheet points to as well as the data.
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class SpriteSheetLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.SpriteSheetLoader = function (url, crossorigin) {
    /*
     * i use texture packer to load the assets..
     * http://www.codeandweb.com/texturepacker
     * make sure to set the format as 'JSON'
     */
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = null;

    /**
     * The frames of the sprite sheet
     *
     * @property frames
     * @type Object
     */
    this.frames = {};
};

// constructor
PIXI.SpriteSheetLoader.prototype.constructor = PIXI.SpriteSheetLoader;

/**
 * This will begin loading the JSON file
 *
 * @method load
 */
PIXI.SpriteSheetLoader.prototype.load = function () {
    var scope = this;
    var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
    jsonLoader.addEventListener('loaded', function (event) {
        scope.json = event.content.json;
        scope.onJSONLoaded();
    });
    jsonLoader.load();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.SpriteSheetLoader.prototype.onJSONLoaded = function () {
    var scope = this;
    var textureUrl = this.baseUrl + this.json.meta.image;
    var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
    var frameData = this.json.frames;

    this.texture = image.texture.baseTexture;
    image.addEventListener('loaded', function () {
        scope.onLoaded();
    });

    for (var i in frameData) {
        var rect = frameData[i].frame;
        if (rect) {
            PIXI.TextureCache[i] = new PIXI.Texture(this.texture, {
                x: rect.x,
                y: rect.y,
                width: rect.w,
                height: rect.h
            });
            if (frameData[i].trimmed) {
                //var realSize = frameData[i].spriteSourceSize;
                PIXI.TextureCache[i].realSize = frameData[i].spriteSourceSize;
                PIXI.TextureCache[i].trim.x = 0; // (realSize.x / rect.w)
                // calculate the offset!
            }
        }
    }

    image.load();
};

/**
 * Invoke when all files are loaded (json and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.SpriteSheetLoader.prototype.onLoaded = function () {
    this.dispatchEvent({
        type: 'loaded',
        content: this
    });
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The image loader class is responsible for loading images file formats ('jpeg', 'jpg', 'png' and 'gif')
 * Once the image has been loaded it is stored in the PIXI texture cache and can be accessed though PIXI.Texture.fromFrameId() and PIXI.Sprite.fromFromeId()
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class ImageLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the image
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.ImageLoader = function(url, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The texture being loaded
     *
     * @property texture
     * @type Texture
     */
    this.texture = PIXI.Texture.fromImage(url, crossorigin);

    /**
     * if the image is loaded with loadFramedSpriteSheet
     * frames will contain the sprite sheet frames
     *
     */
    this.frames = [];
};

// constructor
PIXI.ImageLoader.prototype.constructor = PIXI.ImageLoader;

/**
 * Loads image or takes it from cache
 *
 * @method load
 */
PIXI.ImageLoader.prototype.load = function()
{
    if(!this.texture.baseTexture.hasLoaded)
    {
        var scope = this;
        this.texture.baseTexture.addEventListener('loaded', function()
        {
            scope.onLoaded();
        });
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * Invoked when image file is loaded or it is already cached and ready to use
 *
 * @method onLoaded
 * @private
 */
PIXI.ImageLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: 'loaded', content: this});
};

/**
 * Loads image and split it to uniform sized frames
 *
 *
 * @method loadFramedSpriteSheet
 * @param frameWidth {Number} with of each frame
 * @param frameHeight {Number} height of each frame
 * @param textureName {String} if given, the frames will be cached in <textureName>-<ord> format
 */
PIXI.ImageLoader.prototype.loadFramedSpriteSheet = function(frameWidth, frameHeight, textureName)
{
    this.frames = [];
    var cols = Math.floor(this.texture.width / frameWidth);
    var rows = Math.floor(this.texture.height / frameHeight);

    var i=0;
    for (var y=0; y<rows; y++)
    {
        for (var x=0; x<cols; x++,i++)
        {
            var texture = new PIXI.Texture(this.texture, {
                x: x*frameWidth,
                y: y*frameHeight,
                width: frameWidth,
                height: frameHeight
            });

            this.frames.push(texture);
            if (textureName) PIXI.TextureCache[textureName + '-' + i] = texture;
        }
    }

    if(!this.texture.baseTexture.hasLoaded)
    {
        var scope = this;
        this.texture.baseTexture.addEventListener('loaded', function() {
            scope.onLoaded();
        });
    }
    else
    {
        this.onLoaded();
    }
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * The xml loader is used to load in XML bitmap font data ('xml' or 'fnt')
 * To generate the data you can use http://www.angelcode.com/products/bmfont/
 * This loader will also load the image file as the data.
 * When loaded this class will dispatch a 'loaded' event
 *
 * @class BitmapFontLoader
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the sprite sheet JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.BitmapFontLoader = function(url, crossorigin)
{
    /*
     * i use texture packer to load the assets..
     * http://www.codeandweb.com/texturepacker
     * make sure to set the format as 'JSON'
     */
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] The base url of the bitmap font data
     *
     * @property baseUrl
     * @type String
     * @readOnly
     */
    this.baseUrl = url.replace(/[^\/]*$/, '');

    /**
     * [read-only] The texture of the bitmap font
     *
     * @property baseUrl
     * @type String
     */
    this.texture = null;
};

// constructor
PIXI.BitmapFontLoader.prototype.constructor = PIXI.BitmapFontLoader;

/**
 * Loads the XML font data
 *
 * @method load
 */
PIXI.BitmapFontLoader.prototype.load = function()
{
    this.ajaxRequest = new XMLHttpRequest();
    var scope = this;
    this.ajaxRequest.onreadystatechange = function()
    {
        scope.onXMLLoaded();
    };

    this.ajaxRequest.open('GET', this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType('application/xml');
    this.ajaxRequest.send(null);
};

/**
 * Invoked when XML file is loaded, parses the data
 *
 * @method onXMLLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onXMLLoaded = function()
{
    if (this.ajaxRequest.readyState === 4)
    {
        if (this.ajaxRequest.status === 200 || window.location.protocol.indexOf('http') === -1)
        {
            var textureUrl = this.baseUrl + this.ajaxRequest.responseXML.getElementsByTagName('page')[0].attributes.getNamedItem('file').nodeValue;
            var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
            this.texture = image.texture.baseTexture;

            var data = {};
            var info = this.ajaxRequest.responseXML.getElementsByTagName('info')[0];
            var common = this.ajaxRequest.responseXML.getElementsByTagName('common')[0];
            data.font = info.attributes.getNamedItem('face').nodeValue;
            data.size = parseInt(info.attributes.getNamedItem('size').nodeValue, 10);
            data.lineHeight = parseInt(common.attributes.getNamedItem('lineHeight').nodeValue, 10);
            data.chars = {};

            //parse letters
            var letters = this.ajaxRequest.responseXML.getElementsByTagName('char');

            for (var i = 0; i < letters.length; i++)
            {
                var charCode = parseInt(letters[i].attributes.getNamedItem('id').nodeValue, 10);

                var textureRect = new PIXI.Rectangle(
                    parseInt(letters[i].attributes.getNamedItem('x').nodeValue, 10),
                    parseInt(letters[i].attributes.getNamedItem('y').nodeValue, 10),
                    parseInt(letters[i].attributes.getNamedItem('width').nodeValue, 10),
                    parseInt(letters[i].attributes.getNamedItem('height').nodeValue, 10)
                );

                data.chars[charCode] = {
                    xOffset: parseInt(letters[i].attributes.getNamedItem('xoffset').nodeValue, 10),
                    yOffset: parseInt(letters[i].attributes.getNamedItem('yoffset').nodeValue, 10),
                    xAdvance: parseInt(letters[i].attributes.getNamedItem('xadvance').nodeValue, 10),
                    kerning: {},
                    texture: PIXI.TextureCache[charCode] = new PIXI.Texture(this.texture, textureRect)

                };
            }

            //parse kernings
            var kernings = this.ajaxRequest.responseXML.getElementsByTagName('kerning');
            for (i = 0; i < kernings.length; i++)
            {
                var first = parseInt(kernings[i].attributes.getNamedItem('first').nodeValue, 10);
                var second = parseInt(kernings[i].attributes.getNamedItem('second').nodeValue, 10);
                var amount = parseInt(kernings[i].attributes.getNamedItem('amount').nodeValue, 10);

                data.chars[second].kerning[first] = amount;

            }

            PIXI.BitmapText.fonts[data.font] = data;

            var scope = this;
            image.addEventListener('loaded', function() {
                scope.onLoaded();
            });
            image.load();
        }
    }
};

/**
 * Invoked when all files are loaded (xml/fnt and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: 'loaded', content: this});
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * based on pixi impact spine implementation made by Eemeli Kelokorpi (@ekelokorpi) https://github.com/ekelokorpi
 *
 * Awesome JS run time provided by EsotericSoftware
 * https://github.com/EsotericSoftware/spine-runtimes
 *
 */

/**
 * The Spine loader is used to load in JSON spine data
 * To generate the data you need to use http://esotericsoftware.com/ and export the "JSON" format
 * Due to a clash of names  You will need to change the extension of the spine file from *.json to *.anim for it to load
 * See example 12 (http://www.goodboydigital.com/pixijs/examples/12/) to see a working example and check out the source
 * You will need to generate a sprite sheet to accompany the spine data
 * When loaded this class will dispatch a "loaded" event
 *
 * @class Spine
 * @uses EventTarget
 * @constructor
 * @param url {String} The url of the JSON file
 * @param crossorigin {Boolean} Whether requests should be treated as crossorigin
 */
PIXI.SpineLoader = function(url, crossorigin)
{
    PIXI.EventTarget.call(this);

    /**
     * The url of the bitmap font data
     *
     * @property url
     * @type String
     */
    this.url = url;

    /**
     * Whether the requests should be treated as cross origin
     *
     * @property crossorigin
     * @type Boolean
     */
    this.crossorigin = crossorigin;

    /**
     * [read-only] Whether the data has loaded yet
     *
     * @property loaded
     * @type Boolean
     * @readOnly
     */
    this.loaded = false;
};

PIXI.SpineLoader.prototype.constructor = PIXI.SpineLoader;

/**
 * Loads the JSON data
 *
 * @method load
 */
PIXI.SpineLoader.prototype.load = function () {

    var scope = this;
    var jsonLoader = new PIXI.JsonLoader(this.url, this.crossorigin);
    jsonLoader.addEventListener("loaded", function (event) {
        scope.json = event.content.json;
        scope.onJSONLoaded();
    });
    jsonLoader.load();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onJSONLoaded
 * @private
 */
PIXI.SpineLoader.prototype.onJSONLoaded = function () {
    var spineJsonParser = new spine.SkeletonJson();
    var skeletonData = spineJsonParser.readSkeletonData(this.json);

    PIXI.AnimCache[this.url] = skeletonData;

    this.onLoaded();
};

/**
 * Invoke when JSON file is loaded
 *
 * @method onLoaded
 * @private
 */
PIXI.SpineLoader.prototype.onLoaded = function () {
    this.loaded = true;
    this.dispatchEvent({type: "loaded", content: this});
};


/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 * This is the base class for  creating a pixi.js filter. Currently only webGL supports filters.
 * If you want to make a custom filter this should be your base class.
 * @class AbstractFilter
 * @constructor
 * @param fragmentSrc
 * @param uniforms
 */
PIXI.AbstractFilter = function(fragmentSrc, uniforms)
{
    /**
    * An array of passes - some filters contain a few steps this array simply stores the steps in a liniear fashion.
    * For example the blur filter has two passes blurX and blurY.
    * @property passes
    * @type Array an array of filter objects
    * @private
    */
    this.passes = [this];

    this.shaders = [];
    
    this.dirty = true;
    this.padding = 0;

    /**
    @property uniforms
    @private
    */
    this.uniforms = uniforms || {};

    this.fragmentSrc = fragmentSrc || [];
};

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The ColorMatrixFilter class lets you apply a 4x4 matrix transformation on the RGBA
 * color and alpha values of every pixel on your displayObject to produce a result
 * with a new set of RGBA color and alpha values. Its pretty powerful!
 * @class ColorMatrixFilter
 * @contructor
 */
PIXI.ColorMatrixFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        matrix: {type: 'mat4', value: [1,0,0,0,
                                       0,1,0,0,
                                       0,0,1,0,
                                       0,0,0,1]},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float invert;',
        'uniform mat4 matrix;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord) * matrix;',
      //  '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.ColorMatrixFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorMatrixFilter.prototype.constructor = PIXI.ColorMatrixFilter;

/**
 * Sets the matrix of the color matrix filter
 *
 * @property matrix
 * @type Array and array of 26 numbers
 * @default [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]
 */
Object.defineProperty(PIXI.ColorMatrixFilter.prototype, 'matrix', {
    get: function() {
        return this.uniforms.matrix.value;
    },
    set: function(value) {
        this.uniforms.matrix.value = value;
    }
});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This turns your displayObjects to black and white.
 * @class GrayFilter
 * @contructor
 */
PIXI.GrayFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        gray: {type: '1f', value: 1},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float gray;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.2126*gl_FragColor.r + 0.7152*gl_FragColor.g + 0.0722*gl_FragColor.b), gray);',
     //   '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.GrayFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.GrayFilter.prototype.constructor = PIXI.GrayFilter;

/**
The strength of the gray. 1 will make the object black and white, 0 will make the object its normal color
@property gray
*/
Object.defineProperty(PIXI.GrayFilter.prototype, 'gray', {
    get: function() {
        return this.uniforms.gray.value;
    },
    set: function(value) {
        this.uniforms.gray.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * The DisplacementFilter class uses the pixel values from the specified texture (called the displacement map) to perform a displacement of an object.
 * You can use this filter to apply all manor of crazy warping effects
 * Currently the r property of the texture is used offset the x and the g propery of the texture is used to offset the y.
 * @class DisplacementFilter
 * @contructor
 * @param texture {Texture} The texture used for the displacemtent map * must be power of 2 texture at the moment
 */
PIXI.DisplacementFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];
    texture.baseTexture._powerOf2 = true;

    // set the uniforms
    //console.log()
    this.uniforms = {
        displacementMap: {type: 'sampler2D', value:texture},
        scale:           {type: '2f', value:{x:30, y:30}},
        offset:          {type: '2f', value:{x:0, y:0}},
        mapDimensions:   {type: '2f', value:{x:1, y:5112}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    if(texture.baseTexture.hasLoaded)
    {
        this.uniforms.mapDimensions.value.x = texture.width;
        this.uniforms.mapDimensions.value.y = texture.height;
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);

        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D displacementMap;',
        'uniform sampler2D uSampler;',
        'uniform vec2 scale;',
        'uniform vec2 offset;',
        'uniform vec4 dimensions;',
        'uniform vec2 mapDimensions;',// = vec2(256.0, 256.0);',
        // 'const vec2 textureDimensions = vec2(750.0, 750.0);',

        'void main(void) {',
        '   vec2 mapCords = vTextureCoord.xy;',
        //'   mapCords -= ;',
        '   mapCords += (dimensions.zw + offset)/ dimensions.xy ;',
        '   mapCords.y *= -1.0;',
        '   mapCords.y += 1.0;',
        '   vec2 matSample = texture2D(displacementMap, mapCords).xy;',
        '   matSample -= 0.5;',
        '   matSample *= scale;',
        '   matSample /= mapDimensions;',
        '   gl_FragColor = texture2D(uSampler, vec2(vTextureCoord.x + matSample.x, vTextureCoord.y + matSample.y));',
        '   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb, 1.0);',
        '   vec2 cord = vTextureCoord;',

        //'   gl_FragColor =  texture2D(displacementMap, cord);',
     //   '   gl_FragColor = gl_FragColor;',
        '}'
    ];
};

PIXI.DisplacementFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.DisplacementFilter.prototype.constructor = PIXI.DisplacementFilter;

PIXI.DisplacementFilter.prototype.onTextureLoaded = function()
{
    this.uniforms.mapDimensions.value.x = this.uniforms.displacementMap.value.width;
    this.uniforms.mapDimensions.value.y = this.uniforms.displacementMap.value.height;

    this.uniforms.displacementMap.value.baseTexture.off('loaded', this.boundLoadedFunction);
};

/**
 * The texture used for the displacemtent map * must be power of 2 texture at the moment
 *
 * @property map
 * @type Texture
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'map', {
    get: function() {
        return this.uniforms.displacementMap.value;
    },
    set: function(value) {
        this.uniforms.displacementMap.value = value;
    }
});

/**
 * The multiplier used to scale the displacement result from the map calculation.
 *
 * @property scale
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'scale', {
    get: function() {
        return this.uniforms.scale.value;
    },
    set: function(value) {
        this.uniforms.scale.value = value;
    }
});

/**
 * The offset used to move the displacement map.
 *
 * @property offset
 * @type Point
 */
Object.defineProperty(PIXI.DisplacementFilter.prototype, 'offset', {
    get: function() {
        return this.uniforms.offset.value;
    },
    set: function(value) {
        this.uniforms.offset.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This filter applies a pixlate effect making display objects appear 'blocky'
 * @class PixelateFilter
 * @contructor
 */
PIXI.PixelateFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        invert: {type: '1f', value: 0},
        dimensions: {type: '4fv', value:new Float32Array([10000, 100, 10, 10])},
        pixelSize: {type: '2f', value:{x:10, y:10}},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec2 testDim;',
        'uniform vec4 dimensions;',
        'uniform vec2 pixelSize;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   vec2 coord = vTextureCoord;',

        '   vec2 size = dimensions.xy/pixelSize;',

        '   vec2 color = floor( ( vTextureCoord * size ) ) / size + pixelSize/dimensions.xy * 0.5;',
        '   gl_FragColor = texture2D(uSampler, color);',
        '}'
    ];
};

PIXI.PixelateFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.PixelateFilter.prototype.constructor = PIXI.PixelateFilter;

/**
 *
 * This a point that describes the size of the blocs. x is the width of the block and y is the the height
 * @property size
 * @type Point
 */
Object.defineProperty(PIXI.PixelateFilter.prototype, 'size', {
    get: function() {
        return this.uniforms.pixelSize.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.pixelSize.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.BlurXFilter = function()
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

        '   gl_FragColor = sum;',
        '}'
    ];
};

PIXI.BlurXFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BlurXFilter.prototype.constructor = PIXI.BlurXFilter;

Object.defineProperty(PIXI.BlurXFilter.prototype, 'blur', {
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

PIXI.BlurYFilter = function()
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

        '   gl_FragColor = sum;',
        '}'
    ];
};

PIXI.BlurYFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.BlurYFilter.prototype.constructor = PIXI.BlurYFilter;

Object.defineProperty(PIXI.BlurYFilter.prototype, 'blur', {
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

/**
 *
 * The BlurFilter applies a Gaussian blur to an object.
 * The strength of the blur can be set for x- and y-axis separately (always relative to the stage).
 *
 * @class BlurFilter
 * @contructor
 */
PIXI.BlurFilter = function()
{
    this.blurXFilter = new PIXI.BlurXFilter();
    this.blurYFilter = new PIXI.BlurYFilter();

    this.passes =[this.blurXFilter, this.blurYFilter];
};

/**
 * Sets the strength of both the blurX and blurY properties simultaneously
 *
 * @property blur
 * @type Number the strength of the blur
 * @default 2
 */
Object.defineProperty(PIXI.BlurFilter.prototype, 'blur', {
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
Object.defineProperty(PIXI.BlurFilter.prototype, 'blurX', {
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
Object.defineProperty(PIXI.BlurFilter.prototype, 'blurY', {
    get: function() {
        return this.blurYFilter.blur;
    },
    set: function(value) {
        this.blurYFilter.blur = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This inverts your displayObjects colors.
 * @class InvertFilter
 * @contructor
 */
PIXI.InvertFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        invert: {type: '1f', value: 1},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float invert;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix( (vec3(1)-gl_FragColor.rgb) * gl_FragColor.a, gl_FragColor.rgb, 1.0 - invert);',
        //'   gl_FragColor.rgb = gl_FragColor.rgb  * gl_FragColor.a;',
      //  '   gl_FragColor = gl_FragColor * vColor;',
        '}'
    ];
};

PIXI.InvertFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.InvertFilter.prototype.constructor = PIXI.InvertFilter;

/**
The strength of the invert. 1 will fully invert the colors, 0 will make the object its normal color
@property invert
*/
Object.defineProperty(PIXI.InvertFilter.prototype, 'invert', {
    get: function() {
        return this.uniforms.invert.value;
    },
    set: function(value) {
        this.uniforms.invert.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This applies a sepia effect to your displayObjects.
 * @class SepiaFilter
 * @contructor
 */
PIXI.SepiaFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        sepia: {type: '1f', value: 1},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float sepia;',
        'uniform sampler2D uSampler;',

        'const mat3 sepiaMatrix = mat3(0.3588, 0.7044, 0.1368, 0.2990, 0.5870, 0.1140, 0.2392, 0.4696, 0.0912);',

        'void main(void) {',
        '   gl_FragColor = texture2D(uSampler, vTextureCoord);',
        '   gl_FragColor.rgb = mix( gl_FragColor.rgb, gl_FragColor.rgb * sepiaMatrix, sepia);',
       // '   gl_FragColor = gl_FragColor * vColor;',
        '}'
    ];
};

PIXI.SepiaFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.SepiaFilter.prototype.constructor = PIXI.SepiaFilter;

/**
The strength of the sepia. 1 will apply the full sepia effect, 0 will make the object its normal color
@property sepia
*/
Object.defineProperty(PIXI.SepiaFilter.prototype, 'sepia', {
    get: function() {
        return this.uniforms.sepia.value;
    },
    set: function(value) {
        this.uniforms.sepia.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This filter applies a pixlate effect making display objects appear 'blocky'
 * @class PixelateFilter
 * @contructor
 */
PIXI.TwistFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        radius: {type: '1f', value:0.5},
        angle: {type: '1f', value:5},
        offset: {type: '2f', value:{x:0.5, y:0.5}},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'uniform float radius;',
        'uniform float angle;',
        'uniform vec2 offset;',

        'void main(void) {',
        '   vec2 coord = vTextureCoord - offset;',
        '   float distance = length(coord);',

        '   if (distance < radius) {',
        '       float ratio = (radius - distance) / radius;',
        '       float angleMod = ratio * ratio * angle;',
        '       float s = sin(angleMod);',
        '       float c = cos(angleMod);',
        '       coord = vec2(coord.x * c - coord.y * s, coord.x * s + coord.y * c);',
        '   }',

        '   gl_FragColor = texture2D(uSampler, coord+offset);',
        '}'
    ];
};

PIXI.TwistFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.TwistFilter.prototype.constructor = PIXI.TwistFilter;

/**
 *
 * This point describes the the offset of the twist
 * @property size
 * @type Point
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'offset', {
    get: function() {
        return this.uniforms.offset.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.offset.value = value;
    }
});

/**
 *
 * This radius describes size of the twist
 * @property size
 * @type Number
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'radius', {
    get: function() {
        return this.uniforms.radius.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.radius.value = value;
    }
});

/**
 *
 * This radius describes angle of the twist
 * @property angle
 * @type Number
 */
Object.defineProperty(PIXI.TwistFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.angle.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.angle.value = value;
    }
});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

/**
 *
 * This turns your displayObjects to black and white.
 * @class ColorStepFilter
 * @contructor
 */
PIXI.ColorStepFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        step: {type: '1f', value: 5},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform sampler2D uSampler;',
        'uniform float step;',

        'void main(void) {',
        '   vec4 color = texture2D(uSampler, vTextureCoord);',
        '   color = floor(color * step) / step;',
        '   gl_FragColor = color;',
        '}'
    ];
};

PIXI.ColorStepFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorStepFilter.prototype.constructor = PIXI.ColorStepFilter;

/**
The number of steps.
@property step
*/
Object.defineProperty(PIXI.ColorStepFilter.prototype, 'step', {
    get: function() {
        return this.uniforms.step.value;
    },
    set: function(value) {
        this.uniforms.step.value = value;
    }
});

/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * original filter: https://github.com/evanw/glfx.js/blob/master/src/filters/fun/dotscreen.js
 */

/**
 *
 * This filter applies a pixlate effect making display objects appear 'blocky'
 * @class PixelateFilter
 * @contructor
 */
PIXI.DotScreenFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        scale: {type: '1f', value:1},
        angle: {type: '1f', value:5},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'uniform float angle;',
        'uniform float scale;',

        'float pattern() {',
        '   float s = sin(angle), c = cos(angle);',
        '   vec2 tex = vTextureCoord * dimensions.xy;',
        '   vec2 point = vec2(',
        '       c * tex.x - s * tex.y,',
        '       s * tex.x + c * tex.y',
        '   ) * scale;',
        '   return (sin(point.x) * sin(point.y)) * 4.0;',
        '}',

        'void main() {',
        '   vec4 color = texture2D(uSampler, vTextureCoord);',
        '   float average = (color.r + color.g + color.b) / 3.0;',
        '   gl_FragColor = vec4(vec3(average * 10.0 - 5.0 + pattern()), color.a);',
        '}'
    ];
};

PIXI.DotScreenFilter.prototype = Object.create( PIXI.DotScreenFilter.prototype );
PIXI.DotScreenFilter.prototype.constructor = PIXI.DotScreenFilter;

/**
 *
 * This describes the the scale
 * @property scale
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'scale', {
    get: function() {
        return this.uniforms.scale.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.scale.value = value;
    }
});

/**
 *
 * This radius describes angle
 * @property angle
 * @type Number
 */
Object.defineProperty(PIXI.DotScreenFilter.prototype, 'angle', {
    get: function() {
        return this.uniforms.angle.value;
    },
    set: function(value) {
        this.dirty = true;
        this.uniforms.angle.value = value;
    }
});
/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 */

PIXI.CrossHatchFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        blur: {type: '1f', value: 1 / 512},
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform float blur;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '    float lum = length(texture2D(uSampler, vTextureCoord.xy).rgb);',

        '    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);',

        '    if (lum < 1.00) {',
        '        if (mod(gl_FragCoord.x + gl_FragCoord.y, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.75) {',
        '        if (mod(gl_FragCoord.x - gl_FragCoord.y, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.50) {',
        '        if (mod(gl_FragCoord.x + gl_FragCoord.y - 5.0, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',

        '    if (lum < 0.3) {',
        '        if (mod(gl_FragCoord.x - gl_FragCoord.y - 5.0, 10.0) == 0.0) {',
        '            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);',
        '        }',
        '    }',
        '}'
    ];
};

PIXI.CrossHatchFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.CrossHatchFilter.prototype.constructor = PIXI.BlurYFilter;

Object.defineProperty(PIXI.CrossHatchFilter.prototype, 'blur', {
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

PIXI.RGBSplitFilter = function()
{
    PIXI.AbstractFilter.call( this );

    this.passes = [this];

    // set the uniforms
    this.uniforms = {
        red: {type: '2f', value: {x:20, y:20}},
        green: {type: '2f', value: {x:-20, y:20}},
        blue: {type: '2f', value: {x:20, y:-20}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };

    this.fragmentSrc = [
        'precision mediump float;',
        'varying vec2 vTextureCoord;',
        'varying vec4 vColor;',
        'uniform vec2 red;',
        'uniform vec2 green;',
        'uniform vec2 blue;',
        'uniform vec4 dimensions;',
        'uniform sampler2D uSampler;',

        'void main(void) {',
        '   gl_FragColor.r = texture2D(uSampler, vTextureCoord + red/dimensions.xy).r;',
        '   gl_FragColor.g = texture2D(uSampler, vTextureCoord + green/dimensions.xy).g;',
        '   gl_FragColor.b = texture2D(uSampler, vTextureCoord + blue/dimensions.xy).b;',
        '   gl_FragColor.a = texture2D(uSampler, vTextureCoord).a;',
        '}'
    ];
};

PIXI.RGBSplitFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.RGBSplitFilter.prototype.constructor = PIXI.RGBSplitFilter;

Object.defineProperty(PIXI.RGBSplitFilter.prototype, 'angle', {
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

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = PIXI;
        }
        exports.PIXI = PIXI;
    } else if (typeof define !== 'undefined' && define.amd) {
        define(PIXI);
    } else {
        root.PIXI = PIXI;
    }
}).call(this);

/**
 * Loads the XML font data
 *
 * @method load
 */
PIXI.BitmapFontLoader.prototype.load = function()
{
    this.ajaxRequest = new PIXI.AjaxRequest();
    var scope = this;
    this.ajaxRequest.onreadystatechange = function () {
            scope.onJSONLoaded();
    };


    this.ajaxRequest.open("GET", this.url, true);
    if (this.ajaxRequest.overrideMimeType) this.ajaxRequest.overrideMimeType("application/json");
    this.ajaxRequest.send(null);
};


/**
 * Invoked when XML file is loaded, parses the data
 *
 * Modified method to use json instead for CocoonJS
 * with json conversion seen here:
 * http://www.freeformatter.com/xml-to-json-converter.htm
 *
 * @method onXMLLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onJSONLoaded = function()
{
    if (this.ajaxRequest.readyState == 4) {
        if (this.ajaxRequest.status == 200 || window.location.href.indexOf("http") == -1) {
            
            this.json = JSON.parse(this.ajaxRequest.responseText);
            
            var textureUrl = "content/font/" + this.json.pages[0]['@file'];
            var image = new PIXI.ImageLoader(textureUrl, this.crossorigin);
            this.texture = image.texture.baseTexture;
            
            var data = {};
            data.font = this.json.info[ '@face' ];
            data.size = parseInt( this.json.info[ '@size' ], 10 );
            data.lineHeight = parseInt( this.json.common[ '@lineHeight' ], 10 );
            data.chars = {};


            var letters = this.json.chars.char;


            for (var i = 0; i < letters.length; i++)
            {
                var charCode = parseInt(letters[i]["@id"], 10);
                var textureRect = {
                    x: parseInt(letters[i]["@x"], 10),
                    y: parseInt(letters[i]["@y"], 10),
                    width: parseInt(letters[i]["@width"], 10),
                    height: parseInt(letters[i]["@height"], 10)
                };
                PIXI.TextureCache[charCode] = new PIXI.Texture(this.texture, textureRect);
                
                data.chars[charCode] = {
                    xOffset: parseInt(letters[i]["@xoffset"], 10), 
                    yOffset: parseInt(letters[i]["@yoffset"], 10), 
                    xAdvance: parseInt(letters[i]["@xadvance"], 10), 
                    kerning: {},
                    texture:new PIXI.Texture(this.texture, textureRect)
                };                
                
            }
            
            if ( this.json.kernings && this.json.kernings.kerning ) {
                var kernings = this.json.kernings.kerning;
                for (i = 0; i < kernings.length; i++)
                {
                   var first = parseInt(kernings[i]["@first"], 10);
                   var second = parseInt(kernings[i]["@second"], 10);
                   var amount = parseInt(kernings[i]["@amount"], 10);


                   data.chars[second].kerning[first] = amount;
                }                            
            }
            
            
            PIXI.BitmapText.fonts[data.font] = data;


            var scope = this;
            image.addEventListener("loaded", function() {
                scope.onLoaded();
            });
            image.load();                 
        }
        else
        {
            this.onError();
        }
    }    
    
};


/**
 * Invoked when all files are loaded (xml/fnt and texture)
 *
 * @method onLoaded
 * @private
 */
PIXI.BitmapFontLoader.prototype.onLoaded = function()
{
    this.dispatchEvent({type: "loaded", content: this});
};

PIXI.DisplayObjectContainer.prototype.swapChildren = function(child, child2)
{
        if(child === child2) {
                return;
        }

        var index1 = this.children.indexOf(child);
        var index2 = this.children.indexOf(child2);
        
        if(index1 < 0 || index2 < 0) {
                throw new Error("swapChildren: Both the supplied DisplayObjects must be a child of the caller.");
        }

        this.removeChild(child);
        this.removeChild(child2);
        
        if(index1 < index2)
        {
                this.addChildAt(child2, index1);
                this.addChildAt(child, index2);
        }
        else
        {
                this.addChildAt(child, index2);
                this.addChildAt(child2, index1);
        }
}
/*!
* @license SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011-2013 gskinner.com, inc.
*
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*/

/**!
 * SoundJS FlashPlugin also includes swfobject (http://code.google.com/p/swfobject/)
 */

this.createjs=this.createjs||{},function(){var a=createjs.SoundJS=createjs.SoundJS||{};a.version="0.5.2",a.buildDate="Thu, 12 Dec 2013 23:33:37 GMT"}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(){},b=a.prototype;a.initialize=function(a){a.addEventListener=b.addEventListener,a.on=b.on,a.removeEventListener=a.off=b.removeEventListener,a.removeAllEventListeners=b.removeAllEventListeners,a.hasEventListener=b.hasEventListener,a.dispatchEvent=b.dispatchEvent,a._dispatchEvent=b._dispatchEvent,a.willTrigger=b.willTrigger},b._listeners=null,b._captureListeners=null,b.initialize=function(){},b.addEventListener=function(a,b,c){var d;d=c?this._captureListeners=this._captureListeners||{}:this._listeners=this._listeners||{};var e=d[a];return e&&this.removeEventListener(a,b,c),e=d[a],e?e.push(b):d[a]=[b],b},b.on=function(a,b,c,d,e,f){return b.handleEvent&&(c=c||b,b=b.handleEvent),c=c||this,this.addEventListener(a,function(a){b.call(c,a,e),d&&a.remove()},f)},b.removeEventListener=function(a,b,c){var d=c?this._captureListeners:this._listeners;if(d){var e=d[a];if(e)for(var f=0,g=e.length;g>f;f++)if(e[f]==b){1==g?delete d[a]:e.splice(f,1);break}}},b.off=b.removeEventListener,b.removeAllEventListeners=function(a){a?(this._listeners&&delete this._listeners[a],this._captureListeners&&delete this._captureListeners[a]):this._listeners=this._captureListeners=null},b.dispatchEvent=function(a,b){if("string"==typeof a){var c=this._listeners;if(!c||!c[a])return!1;a=new createjs.Event(a)}if(a.target=b||this,a.bubbles&&this.parent){for(var d=this,e=[d];d.parent;)e.push(d=d.parent);var f,g=e.length;for(f=g-1;f>=0&&!a.propagationStopped;f--)e[f]._dispatchEvent(a,1+(0==f));for(f=1;g>f&&!a.propagationStopped;f++)e[f]._dispatchEvent(a,3)}else this._dispatchEvent(a,2);return a.defaultPrevented},b.hasEventListener=function(a){var b=this._listeners,c=this._captureListeners;return!!(b&&b[a]||c&&c[a])},b.willTrigger=function(a){for(var b=this;b;){if(b.hasEventListener(a))return!0;b=b.parent}return!1},b.toString=function(){return"[EventDispatcher]"},b._dispatchEvent=function(a,b){var c,d=1==b?this._captureListeners:this._listeners;if(a&&d){var e=d[a.type];if(!e||!(c=e.length))return;a.currentTarget=this,a.eventPhase=b,a.removed=!1,e=e.slice();for(var f=0;c>f&&!a.immediatePropagationStopped;f++){var g=e[f];g.handleEvent?g.handleEvent(a):g(a),a.removed&&(this.off(a.type,g,1==b),a.removed=!1)}}},createjs.EventDispatcher=a}(),this.createjs=this.createjs||{},function(){"use strict";var a=function(a,b,c){this.initialize(a,b,c)},b=a.prototype;b.type=null,b.target=null,b.currentTarget=null,b.eventPhase=0,b.bubbles=!1,b.cancelable=!1,b.timeStamp=0,b.defaultPrevented=!1,b.propagationStopped=!1,b.immediatePropagationStopped=!1,b.removed=!1,b.initialize=function(a,b,c){this.type=a,this.bubbles=b,this.cancelable=c,this.timeStamp=(new Date).getTime()},b.preventDefault=function(){this.defaultPrevented=!0},b.stopPropagation=function(){this.propagationStopped=!0},b.stopImmediatePropagation=function(){this.immediatePropagationStopped=this.propagationStopped=!0},b.remove=function(){this.removed=!0},b.clone=function(){return new a(this.type,this.bubbles,this.cancelable)},b.toString=function(){return"[Event (type="+this.type+")]"},createjs.Event=a}(),this.createjs=this.createjs||{},function(){"use strict";createjs.indexOf=function(a,b){for(var c=0,d=a.length;d>c;c++)if(b===a[c])return c;return-1}}(),this.createjs=this.createjs||{},function(){"use strict";createjs.proxy=function(a,b){var c=Array.prototype.slice.call(arguments,2);return function(){return a.apply(b,Array.prototype.slice.call(arguments,0).concat(c))}}}(),this.createjs=this.createjs||{},function(){"use strict";function a(){throw"Sound cannot be instantiated"}function b(a,b){this.init(a,b)}function c(){this.isDefault=!0,this.addEventListener=this.removeEventListener=this.removeAllEventListeners=this.dispatchEvent=this.hasEventListener=this._listeners=this._interrupt=this._playFailed=this.pause=this.resume=this.play=this._beginPlaying=this._cleanUp=this.stop=this.setMasterVolume=this.setVolume=this.mute=this.setMute=this.getMute=this.setPan=this.getPosition=this.setPosition=this.playFailed=function(){return!1},this.getVolume=this.getPan=this.getDuration=function(){return 0},this.playState=a.PLAY_FAILED,this.toString=function(){return"[Sound Default Sound Instance]"}}function d(){}var e=a;e.DELIMITER="|",e.INTERRUPT_ANY="any",e.INTERRUPT_EARLY="early",e.INTERRUPT_LATE="late",e.INTERRUPT_NONE="none",e.PLAY_INITED="playInited",e.PLAY_SUCCEEDED="playSucceeded",e.PLAY_INTERRUPTED="playInterrupted",e.PLAY_FINISHED="playFinished",e.PLAY_FAILED="playFailed",e.SUPPORTED_EXTENSIONS=["mp3","ogg","mpeg","wav","m4a","mp4","aiff","wma","mid"],e.EXTENSION_MAP={m4a:"mp4"},e.FILE_PATTERN=/^(?:(\w+:)\/{2}(\w+(?:\.\w+)*\/?))?([/.]*?(?:[^?]+)?\/)?((?:[^/?]+)\.(\w+))(?:\?(\S+)?)?$/,e.defaultInterruptBehavior=e.INTERRUPT_NONE,e.alternateExtensions=[],e._lastID=0,e.activePlugin=null,e._pluginsRegistered=!1,e._masterVolume=1,e._masterMute=!1,e._instances=[],e._idHash={},e._preloadHash={},e._defaultSoundInstance=null,e.addEventListener=null,e.removeEventListener=null,e.removeAllEventListeners=null,e.dispatchEvent=null,e.hasEventListener=null,e._listeners=null,createjs.EventDispatcher.initialize(e),e._sendFileLoadEvent=function(a){if(e._preloadHash[a])for(var b=0,c=e._preloadHash[a].length;c>b;b++){var d=e._preloadHash[a][b];if(e._preloadHash[a][b]=!0,e.hasEventListener("fileload")){var f=new createjs.Event("fileload");f.src=d.src,f.id=d.id,f.data=d.data,e.dispatchEvent(f)}}},e.getPreloadHandlers=function(){return{callback:createjs.proxy(e.initLoad,e),types:["sound"],extensions:e.SUPPORTED_EXTENSIONS}},e.registerPlugin=function(a){try{console.log("createjs.Sound.registerPlugin has been deprecated. Please use registerPlugins.")}catch(b){}return e._registerPlugin(a)},e._registerPlugin=function(a){return e._pluginsRegistered=!0,null==a?!1:a.isSupported()?(e.activePlugin=new a,!0):!1},e.registerPlugins=function(a){for(var b=0,c=a.length;c>b;b++){var d=a[b];if(e._registerPlugin(d))return!0}return!1},e.initializeDefaultPlugins=function(){return null!=e.activePlugin?!0:e._pluginsRegistered?!1:e.registerPlugins([createjs.WebAudioPlugin,createjs.HTMLAudioPlugin])?!0:!1},e.isReady=function(){return null!=e.activePlugin},e.getCapabilities=function(){return null==e.activePlugin?null:e.activePlugin._capabilities},e.getCapability=function(a){return null==e.activePlugin?null:e.activePlugin._capabilities[a]},e.initLoad=function(a,b,c,d,f){a=a.replace(f,"");var g=e.registerSound(a,c,d,!1,f);return null==g?!1:g},e.registerSound=function(a,c,d,f,g){if(!e.initializeDefaultPlugins())return!1;if(a instanceof Object&&(g=c,c=a.id,d=a.data,a=a.src),e.alternateExtensions.length)var h=e._parsePath2(a,"sound",c,d);else var h=e._parsePath(a,"sound",c,d);if(null==h)return!1;null!=g&&(a=g+a,h.src=g+h.src),null!=c&&(e._idHash[c]=h.src);var i=null;null!=d&&(isNaN(d.channels)?isNaN(d)||(i=parseInt(d)):i=parseInt(d.channels));var j=e.activePlugin.register(h.src,i);if(null!=j&&(null!=j.numChannels&&(i=j.numChannels),b.create(h.src,i),null!=d&&isNaN(d)?d.channels=h.data.channels=i||b.maxPerChannel():d=h.data=i||b.maxPerChannel(),null!=j.tag?h.tag=j.tag:j.src&&(h.src=j.src),null!=j.completeHandler&&(h.completeHandler=j.completeHandler),j.type&&(h.type=j.type)),0!=f)if(e._preloadHash[h.src]||(e._preloadHash[h.src]=[]),e._preloadHash[h.src].push({src:a,id:c,data:d}),1==e._preloadHash[h.src].length)e.activePlugin.preload(h.src,j);else if(1==e._preloadHash[h.src][0])return!0;return h},e.registerManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.registerSound(a[d].src,a[d].id,a[d].data,a[d].preload,b);return c},e.removeSound=function(a,c){if(null==e.activePlugin)return!1;if(a instanceof Object&&(a=a.src),a=e._getSrcById(a),e.alternateExtensions.length)var d=e._parsePath2(a);else var d=e._parsePath(a);if(null==d)return!1;null!=c&&(d.src=c+d.src),a=d.src;for(var f in e._idHash)e._idHash[f]==a&&delete e._idHash[f];return b.removeSrc(a),delete e._preloadHash[a],e.activePlugin.removeSound(a),!0},e.removeManifest=function(a,b){for(var c=[],d=0,e=a.length;e>d;d++)c[d]=createjs.Sound.removeSound(a[d].src,b);return c},e.removeAllSounds=function(){e._idHash={},e._preloadHash={},b.removeAll(),e.activePlugin.removeAllSounds()},e.loadComplete=function(a){if(e.alternateExtensions.length)var b=e._parsePath2(a,"sound");else var b=e._parsePath(a,"sound");return a=b?e._getSrcById(b.src):e._getSrcById(a),1==e._preloadHash[a][0]},e._parsePath=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.split(e.DELIMITER);if(f.length>1)try{console.log('createjs.Sound.DELIMITER "|" loading approach has been deprecated. Please use the new alternateExtensions property.')}catch(g){}for(var h={type:b||"sound",id:c,data:d},i=e.getCapabilities(),j=0,k=f.length;k>j;j++){var l=f[j],m=l.match(e.FILE_PATTERN);if(null==m)return!1;var n=m[4],o=m[5];if(i[o]&&createjs.indexOf(e.SUPPORTED_EXTENSIONS,o)>-1)return h.name=n,h.src=l,h.extension=o,h}return null},e._parsePath2=function(a,b,c,d){"string"!=typeof a&&(a=a.toString());var f=a.match(e.FILE_PATTERN);if(null==f)return!1;for(var g=f[4],h=f[5],i=e.getCapabilities(),j=0;!i[h];)if(h=e.alternateExtensions[j++],j>e.alternateExtensions.length)return null;a=a.replace("."+f[5],"."+h);var k={type:b||"sound",id:c,data:d};return k.name=g,k.src=a,k.extension=h,k},e.play=function(a,b,c,d,f,g,h){var i=e.createInstance(a),j=e._playInstance(i,b,c,d,f,g,h);return j||i.playFailed(),i},e.createInstance=function(c){if(!e.initializeDefaultPlugins())return e._defaultSoundInstance;if(c=e._getSrcById(c),e.alternateExtensions.length)var d=e._parsePath2(c,"sound");else var d=e._parsePath(c,"sound");var f=null;return null!=d&&null!=d.src?(b.create(d.src),f=e.activePlugin.create(d.src)):f=a._defaultSoundInstance,f.uniqueId=e._lastID++,f},e.setVolume=function(a){if(null==Number(a))return!1;if(a=Math.max(0,Math.min(1,a)),e._masterVolume=a,!this.activePlugin||!this.activePlugin.setVolume||!this.activePlugin.setVolume(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterVolume(a)},e.getVolume=function(){return e._masterVolume},e.setMute=function(a){if(null==a||void 0==a)return!1;if(this._masterMute=a,!this.activePlugin||!this.activePlugin.setMute||!this.activePlugin.setMute(a))for(var b=this._instances,c=0,d=b.length;d>c;c++)b[c].setMasterMute(a);return!0},e.getMute=function(){return this._masterMute},e.stop=function(){for(var a=this._instances,b=a.length;b--;)a[b].stop()},e._playInstance=function(a,b,c,d,f,g,h){if(b instanceof Object&&(c=b.delay,d=b.offset,f=b.loop,g=b.volume,h=b.pan,b=b.interrupt),b=b||e.defaultInterruptBehavior,null==c&&(c=0),null==d&&(d=a.getPosition()),null==f&&(f=0),null==g&&(g=a.volume),null==h&&(h=a.pan),0==c){var i=e._beginPlaying(a,b,d,f,g,h);if(!i)return!1}else{var j=setTimeout(function(){e._beginPlaying(a,b,d,f,g,h)},c);a._delayTimeoutId=j}return this._instances.push(a),!0},e._beginPlaying=function(a,c,d,e,f,g){if(!b.add(a,c))return!1;var h=a._beginPlaying(d,e,f,g);if(!h){var i=createjs.indexOf(this._instances,a);return i>-1&&this._instances.splice(i,1),!1}return!0},e._getSrcById=function(a){return null==e._idHash||null==e._idHash[a]?a:e._idHash[a]},e._playFinished=function(a){b.remove(a);var c=createjs.indexOf(this._instances,a);c>-1&&this._instances.splice(c,1)},createjs.Sound=a,b.channels={},b.create=function(a,c){var d=b.get(a);return null==d?(b.channels[a]=new b(a,c),!0):!1},b.removeSrc=function(a){var c=b.get(a);return null==c?!1:(c.removeAll(),delete b.channels[a],!0)},b.removeAll=function(){for(var a in b.channels)b.channels[a].removeAll();b.channels={}},b.add=function(a,c){var d=b.get(a.src);return null==d?!1:d.add(a,c)},b.remove=function(a){var c=b.get(a.src);return null==c?!1:(c.remove(a),!0)},b.maxPerChannel=function(){return f.maxDefault},b.get=function(a){return b.channels[a]};var f=b.prototype;f.src=null,f.max=null,f.maxDefault=100,f.length=0,f.init=function(a,b){this.src=a,this.max=b||this.maxDefault,-1==this.max&&(this.max=this.maxDefault),this._instances=[]},f.get=function(a){return this._instances[a]},f.add=function(a,b){return this.getSlot(b,a)?(this._instances.push(a),this.length++,!0):!1},f.remove=function(a){var b=createjs.indexOf(this._instances,a);return-1==b?!1:(this._instances.splice(b,1),this.length--,!0)},f.removeAll=function(){for(var a=this.length-1;a>=0;a--)this._instances[a].stop()},f.getSlot=function(b){for(var c,d,e=0,f=this.max;f>e;e++){if(c=this.get(e),null==c)return!0;(b!=a.INTERRUPT_NONE||c.playState==a.PLAY_FINISHED)&&(0!=e?c.playState==a.PLAY_FINISHED||c.playState==a.PLAY_INTERRUPTED||c.playState==a.PLAY_FAILED?d=c:(b==a.INTERRUPT_EARLY&&c.getPosition()<d.getPosition()||b==a.INTERRUPT_LATE&&c.getPosition()>d.getPosition())&&(d=c):d=c)}return null!=d?(d._interrupt(),this.remove(d),!0):!1},f.toString=function(){return"[Sound SoundChannel]"},a._defaultSoundInstance=new c,d.init=function(){var a=window.navigator.userAgent;d.isFirefox=a.indexOf("Firefox")>-1,d.isOpera=null!=window.opera,d.isChrome=a.indexOf("Chrome")>-1,d.isIOS=a.indexOf("iPod")>-1||a.indexOf("iPhone")>-1||a.indexOf("iPad")>-1,d.isAndroid=a.indexOf("Android")>-1,d.isBlackberry=a.indexOf("Blackberry")>-1},d.init(),createjs.Sound.BrowserDetect=d}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b._capabilities=null,b.isSupported=function(){var a=createjs.Sound.BrowserDetect.isIOS||createjs.Sound.BrowserDetect.isAndroid||createjs.Sound.BrowserDetect.isBlackberry;return"file:"!=location.protocol||a||this._isFileXHRSupported()?(b._generateCapabilities(),null==b.context?!1:!0):!1},b._isFileXHRSupported=function(){var a=!0,b=new XMLHttpRequest;try{b.open("GET","fail.fail",!1)}catch(c){return a=!1}b.onerror=function(){a=!1},b.onload=function(){a=404==this.status||200==this.status||0==this.status&&""!=this.response};try{b.send()}catch(c){a=!1}return a},b._generateCapabilities=function(){if(null==b._capabilities){var a=document.createElement("audio");if(null==a.canPlayType)return null;if(window.webkitAudioContext)b.context=new webkitAudioContext;else{if(!window.AudioContext)return null;b.context=new AudioContext}b._compatibilitySetUp(),b.playEmptySound(),b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}b.context.destination.numberOfChannels<2&&(b._capabilities.panning=!1),b.dynamicsCompressorNode=b.context.createDynamicsCompressor(),b.dynamicsCompressorNode.connect(b.context.destination),b.gainNode=b.context.createGain(),b.gainNode.connect(b.dynamicsCompressorNode)}},b._compatibilitySetUp=function(){if(!b.context.createGain){b.context.createGain=b.context.createGainNode;var a=b.context.createBufferSource();a.__proto__.start=a.__proto__.noteGrainOn,a.__proto__.stop=a.__proto__.noteOff,this._panningModel=0}},b.playEmptySound=function(){var a=this.context.createBuffer(1,1,22050),b=this.context.createBufferSource();b.buffer=a,b.connect(this.context.destination),b.start(0,0,0)};var c=a.prototype;c._capabilities=null,c._volume=1,c.context=null,c._panningModel="equalpower",c.dynamicsCompressorNode=null,c.gainNode=null,c._arrayBuffers=null,c._init=function(){this._capabilities=b._capabilities,this._arrayBuffers={},this.context=b.context,this.gainNode=b.gainNode,this.dynamicsCompressorNode=b.dynamicsCompressorNode},c.register=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);return{tag:b}},c.isPreloadStarted=function(a){return null!=this._arrayBuffers[a]},c.isPreloadComplete=function(a){return!(null==this._arrayBuffers[a]||1==this._arrayBuffers[a])},c.removeSound=function(a){delete this._arrayBuffers[a]},c.removeAllSounds=function(){this._arrayBuffers={}},c.addPreloadResults=function(a,b){this._arrayBuffers[a]=b},c._handlePreloadComplete=function(){createjs.Sound._sendFileLoadEvent(this.src)},c.preload=function(a){this._arrayBuffers[a]=!0;var b=new createjs.WebAudioPlugin.Loader(a,this);b.onload=this._handlePreloadComplete,b.load()},c.create=function(a){return this.isPreloadStarted(a)||this.preload(a),new createjs.WebAudioPlugin.SoundInstance(a,this)},c.setVolume=function(a){return this._volume=a,this._updateVolume(),!0},c._updateVolume=function(){var a=createjs.Sound._masterMute?0:this._volume;a!=this.gainNode.gain.value&&(this.gainNode.gain.value=a)},c.getVolume=function(){return this._volume},c.setMute=function(){return this._updateVolume(),!0},c.toString=function(){return"[WebAudioPlugin]"},createjs.WebAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){return null==Number(a)?!1:(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume(),void 0)}})}catch(c){}b._pan=0;try{Object.defineProperty(b,"pan",{get:function(){return this._pan},set:function(a){return this._owner._capabilities.panning&&null!=Number(a)?(a=Math.max(-1,Math.min(1,a)),this._pan=a,this.panNode.setPosition(a,0,-.5),void 0):!1}})}catch(c){}b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b._soundCompleteTimeout=null,b.gainNode=null,b.panNode=null,b.sourceNode=null,b._sourceNodeNext=null,b._muted=!1,b._paused=!1,b._startTime=0,b._endedHandler=null,b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._init=function(a,b){this._owner=b,this.src=a,this.gainNode=this._owner.context.createGain(),this.panNode=this._owner.context.createPanner(),this.panNode.panningModel=this._owner._panningModel,this.panNode.connect(this.gainNode),this._owner.isPreloadComplete(this.src)&&(this._duration=1e3*this._owner._arrayBuffers[this.src].duration),this._endedHandler=createjs.proxy(this._handleSoundComplete,this)},b._cleanUp=function(){this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this.sourceNode=this._cleanUpAudioNode(this.sourceNode),this._sourceNodeNext=this._cleanUpAudioNode(this._sourceNodeNext)),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(0),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),this._startTime=0,null!=window.createjs&&createjs.Sound._playFinished(this)},b._cleanUpAudioNode=function(a){return a&&(a.stop(0),a.disconnect(this.panNode),a=null),a},b._interrupt=function(){this._cleanUp(),this.playState=createjs.Sound.PLAY_INTERRUPTED,this._paused=!1,this._sendEvent("interrupted")},b._handleSoundReady=function(){if(null!=window.createjs){if(1e3*this._offset>this.getDuration())return this.playFailed(),void 0;this._offset<0&&(this._offset=0),this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.gainNode.connect(this._owner.gainNode);var a=this._owner._arrayBuffers[this.src].duration;this.sourceNode=this._createAndPlayAudioNode(this._owner.context.currentTime-a,this._offset),this._duration=1e3*a,this._startTime=this.sourceNode.startTime-this._offset,this._soundCompleteTimeout=setTimeout(this._endedHandler,1e3*(a-this._offset)),0!=this._remainingLoops&&(this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0))}},b._createAndPlayAudioNode=function(a,b){var c=this._owner.context.createBufferSource();return c.buffer=this._owner._arrayBuffers[this.src],c.connect(this.panNode),this._owner.context.currentTime,c.startTime=a+c.buffer.duration,c.start(c.startTime,b,c.buffer.duration-b),c},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){return null!=window.createjs&&this.src?(this._offset=a/1e3,this._remainingLoops=b,this.volume=c,this.pan=d,this._owner.isPreloadComplete(this.src)?(this._handleSoundReady(null),this._sendEvent("succeeded"),1):(this.playFailed(),void 0)):void 0},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED?!1:(this._paused=!0,this._offset=this._owner.context.currentTime-this._startTime,this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),0!=this.gainNode.numberOfOutputs&&this.gainNode.disconnect(),clearTimeout(this._delayTimeoutId),clearTimeout(this._soundCompleteTimeout),!0)},b.resume=function(){return this._paused?(this._handleSoundReady(null),!0):!1},b.stop=function(){return this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._offset=0,!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){var a=this._muted?0:this._volume;return a!=this.gainNode.gain.value?(this.gainNode.gain.value=a,!0):!1},b.getVolume=function(){return this.volume},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(a){return this.pan=a,this.pan!=a?!1:void 0},b.getPan=function(){return this.pan},b.getPosition=function(){if(this._paused||null==this.sourceNode)var a=this._offset;else var a=this._owner.context.currentTime-this._startTime;return 1e3*a},b.setPosition=function(a){return this._offset=a/1e3,this.sourceNode&&this.playState==createjs.Sound.PLAY_SUCCEEDED&&(this._cleanUpAudioNode(this.sourceNode),this._cleanUpAudioNode(this._sourceNodeNext),clearTimeout(this._soundCompleteTimeout)),this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||this._handleSoundReady(null),!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){return this._offset=0,0!=this._remainingLoops?(this._remainingLoops--,this._sourceNodeNext?(this._cleanUpAudioNode(this.sourceNode),this.sourceNode=this._sourceNodeNext,this._startTime=this.sourceNode.startTime,this._sourceNodeNext=this._createAndPlayAudioNode(this._startTime,0),this._soundCompleteTimeout=setTimeout(this._endedHandler,this._duration)):this._handleSoundReady(null),this._sendEvent("loop"),void 0):(null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FINISHED,this._sendEvent("complete")),void 0)},b.playFailed=function(){null!=window.createjs&&(this._cleanUp(),this.playState=createjs.Sound.PLAY_FAILED,this._sendEvent("failed"))},b.toString=function(){return"[WebAudioPlugin SoundInstance]"},createjs.WebAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.request=null,b.owner=null,b.progress=-1,b.src=null,b.originalSrc=null,b.result=null,b.onload=null,b.onprogress=null,b.onError=null,b._init=function(a,b){this.src=a,this.originalSrc=a,this.owner=b},b.load=function(a){null!=a&&(this.src=a),this.request=new XMLHttpRequest,this.request.open("GET",this.src,!0),this.request.responseType="arraybuffer",this.request.onload=createjs.proxy(this.handleLoad,this),this.request.onError=createjs.proxy(this.handleError,this),this.request.onprogress=createjs.proxy(this.handleProgress,this),this.request.send()},b.handleProgress=function(a,b){this.progress=a/b,null!=this.onprogress&&this.onprogress({loaded:a,total:b,progress:this.progress})},b.handleLoad=function(){this.owner.context.decodeAudioData(this.request.response,createjs.proxy(this.handleAudioDecoded,this),createjs.proxy(this.handleError,this))},b.handleAudioDecoded=function(a){this.progress=1,this.result=a,this.src=this.originalSrc,this.owner.addPreloadResults(this.src,this.result),this.onload&&this.onload()},b.handleError=function(a){this.owner.removeSound(this.src),this.onerror&&this.onerror(a)},b.toString=function(){return"[WebAudioPlugin Loader]"},createjs.WebAudioPlugin.Loader=a}(),this.createjs=this.createjs||{},function(){"use strict";function a(){this._init()}var b=a;b.MAX_INSTANCES=30,b._AUDIO_READY="canplaythrough",b._AUDIO_ENDED="ended",b._AUDIO_SEEKED="seeked",b._AUDIO_STALLED="stalled",b._capabilities=null,b.enableIOS=!1,b.isSupported=function(){if(createjs.Sound.BrowserDetect.isIOS&&!b.enableIOS)return!1;b._generateCapabilities();var a=b.tag;return null==a||null==b._capabilities?!1:!0},b._generateCapabilities=function(){if(null==b._capabilities){var a=b.tag=document.createElement("audio");if(null==a.canPlayType)return null;b._capabilities={panning:!0,volume:!0,tracks:-1};for(var c=createjs.Sound.SUPPORTED_EXTENSIONS,d=createjs.Sound.EXTENSION_MAP,e=0,f=c.length;f>e;e++){var g=c[e],h=d[g]||g;b._capabilities[g]="no"!=a.canPlayType("audio/"+g)&&""!=a.canPlayType("audio/"+g)||"no"!=a.canPlayType("audio/"+h)&&""!=a.canPlayType("audio/"+h)}}};var c=a.prototype;c._capabilities=null,c._audioSources=null,c.defaultNumChannels=2,c.loadedHandler=null,c._init=function(){this._capabilities=b._capabilities,this._audioSources={}},c.register=function(a,b){this._audioSources[a]=!0;for(var c=createjs.HTMLAudioPlugin.TagPool.get(a),d=null,e=b||this.defaultNumChannels,f=0;e>f;f++)d=this._createTag(a),c.add(d);if(d.id=a,this.loadedHandler=createjs.proxy(this._handleTagLoad,this),d.addEventListener&&d.addEventListener("canplaythrough",this.loadedHandler),null==d.onreadystatechange)d.onreadystatechange=this.loadedHandler;else{var g=d.onreadystatechange;d.onreadystatechange=function(){g(),this.loadedHandler()}}return{tag:d,numChannels:e}},c._handleTagLoad=function(a){a.target.removeEventListener&&a.target.removeEventListener("canplaythrough",this.loadedHandler),a.target.onreadystatechange=null,a.target.src!=a.target.id&&createjs.HTMLAudioPlugin.TagPool.checkSrc(a.target.id)},c._createTag=function(a){var b=document.createElement("audio");return b.autoplay=!1,b.preload="none",b.src=a,b},c.removeSound=function(a){delete this._audioSources[a],createjs.HTMLAudioPlugin.TagPool.remove(a)},c.removeAllSounds=function(){this._audioSources={},createjs.HTMLAudioPlugin.TagPool.removeAll()},c.create=function(a){if(!this.isPreloadStarted(a)){var b=createjs.HTMLAudioPlugin.TagPool.get(a),c=this._createTag(a);c.id=a,b.add(c),this.preload(a,{tag:c})}return new createjs.HTMLAudioPlugin.SoundInstance(a,this)},c.isPreloadStarted=function(a){return null!=this._audioSources[a]},c.preload=function(a,b){this._audioSources[a]=!0,new createjs.HTMLAudioPlugin.Loader(a,b.tag)},c.toString=function(){return"[HTMLAudioPlugin]"},createjs.HTMLAudioPlugin=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype=new createjs.EventDispatcher;b.src=null,b.uniqueId=-1,b.playState=null,b._owner=null,b.loaded=!1,b._offset=0,b._delay=0,b._volume=1;try{Object.defineProperty(b,"volume",{get:function(){return this._volume},set:function(a){null!=Number(a)&&(a=Math.max(0,Math.min(1,a)),this._volume=a,this._updateVolume())}})}catch(c){}b.pan=0,b._duration=0,b._remainingLoops=0,b._delayTimeoutId=null,b.tag=null,b._muted=!1,b._paused=!1,b._endedHandler=null,b._readyHandler=null,b._stalledHandler=null,b.loopHandler=null,b._init=function(a,b){this.src=a,this._owner=b,this._endedHandler=createjs.proxy(this._handleSoundComplete,this),this._readyHandler=createjs.proxy(this._handleSoundReady,this),this._stalledHandler=createjs.proxy(this._handleSoundStalled,this),this.loopHandler=createjs.proxy(this.handleSoundLoop,this)},b._sendEvent=function(a){var b=new createjs.Event(a);this.dispatchEvent(b)},b._cleanUp=function(){var a=this.tag;if(null!=a){a.pause(),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),a.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{a.currentTime=0}catch(b){}createjs.HTMLAudioPlugin.TagPool.setInstance(this.src,a),this.tag=null}clearTimeout(this._delayTimeoutId),null!=window.createjs&&createjs.Sound._playFinished(this)},b._interrupt=function(){null!=this.tag&&(this.playState=createjs.Sound.PLAY_INTERRUPTED,this._cleanUp(),this._paused=!1,this._sendEvent("interrupted"))},b.play=function(a,b,c,d,e,f){this._cleanUp(),createjs.Sound._playInstance(this,a,b,c,d,e,f)},b._beginPlaying=function(a,b,c,d){if(null==window.createjs)return-1;var e=this.tag=createjs.HTMLAudioPlugin.TagPool.getInstance(this.src);return null==e?(this.playFailed(),-1):(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_ENDED,this._endedHandler,!1),this._offset=a,this.volume=c,this.pan=d,this._updateVolume(),this._remainingLoops=b,4!==e.readyState?(e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),e.addEventListener(createjs.HTMLAudioPlugin._AUDIO_STALLED,this._stalledHandler,!1),e.preload="auto",e.load()):this._handleSoundReady(null),this._sendEvent("succeeded"),1)},b._handleSoundStalled=function(){this._cleanUp(),this._sendEvent("failed")},b._handleSoundReady=function(){if(null!=window.createjs){if(this._duration=1e3*this.tag.duration,this.playState=createjs.Sound.PLAY_SUCCEEDED,this._paused=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_READY,this._readyHandler,!1),this._offset>=this.getDuration())return this.playFailed(),void 0;this._offset>0&&(this.tag.currentTime=.001*this._offset),-1==this._remainingLoops&&(this.tag.loop=!0),0!=this._remainingLoops&&(this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1),this.tag.loop=!0),this.tag.play()}},b.pause=function(){return this._paused||this.playState!=createjs.Sound.PLAY_SUCCEEDED||null==this.tag?!1:(this._paused=!0,this.tag.pause(),clearTimeout(this._delayTimeoutId),!0)},b.resume=function(){return this._paused&&null!=this.tag?(this._paused=!1,this.tag.play(),!0):!1},b.stop=function(){return this._offset=0,this.pause(),this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),!0},b.setMasterVolume=function(){return this._updateVolume(),!0},b.setVolume=function(a){return this.volume=a,!0},b._updateVolume=function(){if(null!=this.tag){var a=this._muted||createjs.Sound._masterMute?0:this._volume*createjs.Sound._masterVolume;return a!=this.tag.volume&&(this.tag.volume=a),!0}return!1},b.getVolume=function(){return this.volume},b.setMasterMute=function(){return this._updateVolume(),!0},b.setMute=function(a){return null==a||void 0==a?!1:(this._muted=a,this._updateVolume(),!0)},b.getMute=function(){return this._muted},b.setPan=function(){return!1},b.getPan=function(){return 0},b.getPosition=function(){return null==this.tag?this._offset:1e3*this.tag.currentTime},b.setPosition=function(a){if(null==this.tag)this._offset=a;else{this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1);try{this.tag.currentTime=.001*a}catch(b){return!1}this.tag.addEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)}return!0},b.getDuration=function(){return this._duration},b._handleSoundComplete=function(){this._offset=0,null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FINISHED,this._cleanUp(),this._sendEvent("complete"))},b.handleSoundLoop=function(){this._offset=0,this._remainingLoops--,0==this._remainingLoops&&(this.tag.loop=!1,this.tag.removeEventListener(createjs.HTMLAudioPlugin._AUDIO_SEEKED,this.loopHandler,!1)),this._sendEvent("loop")},b.playFailed=function(){null!=window.createjs&&(this.playState=createjs.Sound.PLAY_FAILED,this._cleanUp(),this._sendEvent("failed"))},b.toString=function(){return"[HTMLAudioPlugin SoundInstance]"},createjs.HTMLAudioPlugin.SoundInstance=a}(),function(){"use strict";function a(a,b){this._init(a,b)}var b=a.prototype;b.src=null,b.tag=null,b.preloadTimer=null,b.loadedHandler=null,b._init=function(a,b){if(this.src=a,this.tag=b,this.preloadTimer=setInterval(createjs.proxy(this.preloadTick,this),200),this.loadedHandler=createjs.proxy(this.sendLoadedEvent,this),this.tag.addEventListener&&this.tag.addEventListener("canplaythrough",this.loadedHandler),null==this.tag.onreadystatechange)this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this);else{var c=this.tag.onreadystatechange;this.tag.onreadystatechange=function(){c(),this.tag.onreadystatechange=createjs.proxy(this.sendLoadedEvent,this)}
}this.tag.preload="auto",this.tag.load()},b.preloadTick=function(){var a=this.tag.buffered,b=this.tag.duration;a.length>0&&a.end(0)>=b-1&&this.handleTagLoaded()},b.handleTagLoaded=function(){clearInterval(this.preloadTimer)},b.sendLoadedEvent=function(){this.tag.removeEventListener&&this.tag.removeEventListener("canplaythrough",this.loadedHandler),this.tag.onreadystatechange=null,createjs.Sound._sendFileLoadEvent(this.src)},b.toString=function(){return"[HTMLAudioPlugin Loader]"},createjs.HTMLAudioPlugin.Loader=a}(),function(){"use strict";function a(a){this._init(a)}var b=a;b.tags={},b.get=function(c){var d=b.tags[c];return null==d&&(d=b.tags[c]=new a(c)),d},b.remove=function(a){var c=b.tags[a];return null==c?!1:(c.removeAll(),delete b.tags[a],!0)},b.removeAll=function(){for(var a in b.tags)b.tags[a].removeAll();b.tags={}},b.getInstance=function(a){var c=b.tags[a];return null==c?null:c.get()},b.setInstance=function(a,c){var d=b.tags[a];return null==d?null:d.set(c)},b.checkSrc=function(a){var c=b.tags[a];return null==c?null:(c.checkSrcChange(),void 0)};var c=a.prototype;c.src=null,c.length=0,c.available=0,c.tags=null,c._init=function(a){this.src=a,this.tags=[]},c.add=function(a){this.tags.push(a),this.length++,this.available++},c.removeAll=function(){for(;this.length--;)delete this.tags[this.length];this.src=null,this.tags.length=0},c.get=function(){if(0==this.tags.length)return null;this.available=this.tags.length;var a=this.tags.pop();return null==a.parentNode&&document.body.appendChild(a),a},c.set=function(a){var b=createjs.indexOf(this.tags,a);-1==b&&this.tags.push(a),this.available=this.tags.length},c.checkSrcChange=function(){for(var a=this.tags.length-1,b=this.tags[a].src;a--;)this.tags[a].src=b},c.toString=function(){return"[HTMLAudioPlugin TagPool]"},createjs.HTMLAudioPlugin.TagPool=a}();
/** vim: et:ts=4:sw=4:sts=4
 * @license RequireJS 2.1.9 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/requirejs for details
 */
//Not using strict: uneven strict support in browsers, #392, and causes
//problems with requirejs.exec()/transpiler plugins that may not be strict.
/*jslint regexp: true, nomen: true, sloppy: true */
/*global window, navigator, document, importScripts, setTimeout, opera */

var requirejs, require, define;
(function (global) {
    var req, s, head, baseElement, dataMain, src,
        interactiveScript, currentlyAddingScript, mainScript, subPath,
        version = '2.1.9',
        commentRegExp = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,
        cjsRequireRegExp = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
        jsSuffixRegExp = /\.js$/,
        currDirRegExp = /^\.\//,
        op = Object.prototype,
        ostring = op.toString,
        hasOwn = op.hasOwnProperty,
        ap = Array.prototype,
        apsp = ap.splice,
        isBrowser = !!(typeof window !== 'undefined' && typeof navigator !== 'undefined' && window.document),
        isWebWorker = !isBrowser && typeof importScripts !== 'undefined',
        //PS3 indicates loaded and complete, but need to wait for complete
        //specifically. Sequence is 'loading', 'loaded', execution,
        // then 'complete'. The UA check is unfortunate, but not sure how
        //to feature test w/o causing perf issues.
        readyRegExp = isBrowser && navigator.platform === 'PLAYSTATION 3' ?
                      /^complete$/ : /^(complete|loaded)$/,
        defContextName = '_',
        //Oh the tragedy, detecting opera. See the usage of isOpera for reason.
        isOpera = typeof opera !== 'undefined' && opera.toString() === '[object Opera]',
        contexts = {},
        cfg = {},
        globalDefQueue = [],
        useInteractive = false;

    function isFunction(it) {
        return ostring.call(it) === '[object Function]';
    }

    function isArray(it) {
        return ostring.call(it) === '[object Array]';
    }

    /**
     * Helper function for iterating over an array. If the func returns
     * a true value, it will break out of the loop.
     */
    function each(ary, func) {
        if (ary) {
            var i;
            for (i = 0; i < ary.length; i += 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    /**
     * Helper function for iterating over an array backwards. If the func
     * returns a true value, it will break out of the loop.
     */
    function eachReverse(ary, func) {
        if (ary) {
            var i;
            for (i = ary.length - 1; i > -1; i -= 1) {
                if (ary[i] && func(ary[i], i, ary)) {
                    break;
                }
            }
        }
    }

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    function getOwn(obj, prop) {
        return hasProp(obj, prop) && obj[prop];
    }

    /**
     * Cycles over properties in an object and calls a function for each
     * property value. If the function returns a truthy value, then the
     * iteration is stopped.
     */
    function eachProp(obj, func) {
        var prop;
        for (prop in obj) {
            if (hasProp(obj, prop)) {
                if (func(obj[prop], prop)) {
                    break;
                }
            }
        }
    }

    /**
     * Simple function to mix in properties from source into target,
     * but only if target does not already have a property of the same name.
     */
    function mixin(target, source, force, deepStringMixin) {
        if (source) {
            eachProp(source, function (value, prop) {
                if (force || !hasProp(target, prop)) {
                    if (deepStringMixin && typeof value !== 'string') {
                        if (!target[prop]) {
                            target[prop] = {};
                        }
                        mixin(target[prop], value, force, deepStringMixin);
                    } else {
                        target[prop] = value;
                    }
                }
            });
        }
        return target;
    }

    //Similar to Function.prototype.bind, but the 'this' object is specified
    //first, since it is easier to read/figure out what 'this' will be.
    function bind(obj, fn) {
        return function () {
            return fn.apply(obj, arguments);
        };
    }

    function scripts() {
        return document.getElementsByTagName('script');
    }

    function defaultOnError(err) {
        throw err;
    }

    //Allow getting a global that expressed in
    //dot notation, like 'a.b.c'.
    function getGlobal(value) {
        if (!value) {
            return value;
        }
        var g = global;
        each(value.split('.'), function (part) {
            g = g[part];
        });
        return g;
    }

    /**
     * Constructs an error with a pointer to an URL with more information.
     * @param {String} id the error ID that maps to an ID on a web page.
     * @param {String} message human readable error.
     * @param {Error} [err] the original error, if there is one.
     *
     * @returns {Error}
     */
    function makeError(id, msg, err, requireModules) {
        var e = new Error(msg + '\nhttp://requirejs.org/docs/errors.html#' + id);
        e.requireType = id;
        e.requireModules = requireModules;
        if (err) {
            e.originalError = err;
        }
        return e;
    }

    if (typeof define !== 'undefined') {
        //If a define is already in play via another AMD loader,
        //do not overwrite.
        return;
    }

    if (typeof requirejs !== 'undefined') {
        if (isFunction(requirejs)) {
            //Do not overwrite and existing requirejs instance.
            return;
        }
        cfg = requirejs;
        requirejs = undefined;
    }

    //Allow for a require config object
    if (typeof require !== 'undefined' && !isFunction(require)) {
        //assume it is a config object.
        cfg = require;
        require = undefined;
    }

    function newContext(contextName) {
        var inCheckLoaded, Module, context, handlers,
            checkLoadedTimeoutId,
            config = {
                //Defaults. Do not set a default for map
                //config to speed up normalize(), which
                //will run faster if there is no default.
                waitSeconds: 7,
                baseUrl: './',
                paths: {},
                pkgs: {},
                shim: {},
                config: {}
            },
            registry = {},
            //registry of just enabled modules, to speed
            //cycle breaking code when lots of modules
            //are registered, but not activated.
            enabledRegistry = {},
            undefEvents = {},
            defQueue = [],
            defined = {},
            urlFetched = {},
            requireCounter = 1,
            unnormalizedCounter = 1;

        /**
         * Trims the . and .. from an array of path segments.
         * It will keep a leading path segment if a .. will become
         * the first path segment, to help with module name lookups,
         * which act like paths, but can be remapped. But the end result,
         * all paths that use this function should look normalized.
         * NOTE: this method MODIFIES the input array.
         * @param {Array} ary the array of path segments.
         */
        function trimDots(ary) {
            var i, part;
            for (i = 0; ary[i]; i += 1) {
                part = ary[i];
                if (part === '.') {
                    ary.splice(i, 1);
                    i -= 1;
                } else if (part === '..') {
                    if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                        //End of the line. Keep at least one non-dot
                        //path segment at the front so it can be mapped
                        //correctly to disk. Otherwise, there is likely
                        //no path mapping for a path starting with '..'.
                        //This can still fail, but catches the most reasonable
                        //uses of ..
                        break;
                    } else if (i > 0) {
                        ary.splice(i - 1, 2);
                        i -= 2;
                    }
                }
            }
        }

        /**
         * Given a relative module name, like ./something, normalize it to
         * a real name that can be mapped to a path.
         * @param {String} name the relative name
         * @param {String} baseName a real name that the name arg is relative
         * to.
         * @param {Boolean} applyMap apply the map config to the value. Should
         * only be done if this normalization is for a dependency ID.
         * @returns {String} normalized name
         */
        function normalize(name, baseName, applyMap) {
            var pkgName, pkgConfig, mapValue, nameParts, i, j, nameSegment,
                foundMap, foundI, foundStarMap, starI,
                baseParts = baseName && baseName.split('/'),
                normalizedBaseParts = baseParts,
                map = config.map,
                starMap = map && map['*'];

            //Adjust any relative paths.
            if (name && name.charAt(0) === '.') {
                //If have a base name, try to normalize against it,
                //otherwise, assume it is a top-level require that will
                //be relative to baseUrl in the end.
                if (baseName) {
                    if (getOwn(config.pkgs, baseName)) {
                        //If the baseName is a package name, then just treat it as one
                        //name to concat the name with.
                        normalizedBaseParts = baseParts = [baseName];
                    } else {
                        //Convert baseName to array, and lop off the last part,
                        //so that . matches that 'directory' and not name of the baseName's
                        //module. For instance, baseName of 'one/two/three', maps to
                        //'one/two/three.js', but we want the directory, 'one/two' for
                        //this normalization.
                        normalizedBaseParts = baseParts.slice(0, baseParts.length - 1);
                    }

                    name = normalizedBaseParts.concat(name.split('/'));
                    trimDots(name);

                    //Some use of packages may use a . path to reference the
                    //'main' module name, so normalize for that.
                    pkgConfig = getOwn(config.pkgs, (pkgName = name[0]));
                    name = name.join('/');
                    if (pkgConfig && name === pkgName + '/' + pkgConfig.main) {
                        name = pkgName;
                    }
                } else if (name.indexOf('./') === 0) {
                    // No baseName, so this is ID is resolved relative
                    // to baseUrl, pull off the leading dot.
                    name = name.substring(2);
                }
            }

            //Apply map config if available.
            if (applyMap && map && (baseParts || starMap)) {
                nameParts = name.split('/');

                for (i = nameParts.length; i > 0; i -= 1) {
                    nameSegment = nameParts.slice(0, i).join('/');

                    if (baseParts) {
                        //Find the longest baseName segment match in the config.
                        //So, do joins on the biggest to smallest lengths of baseParts.
                        for (j = baseParts.length; j > 0; j -= 1) {
                            mapValue = getOwn(map, baseParts.slice(0, j).join('/'));

                            //baseName segment has config, find if it has one for
                            //this name.
                            if (mapValue) {
                                mapValue = getOwn(mapValue, nameSegment);
                                if (mapValue) {
                                    //Match, update name to the new value.
                                    foundMap = mapValue;
                                    foundI = i;
                                    break;
                                }
                            }
                        }
                    }

                    if (foundMap) {
                        break;
                    }

                    //Check for a star map match, but just hold on to it,
                    //if there is a shorter segment match later in a matching
                    //config, then favor over this star map.
                    if (!foundStarMap && starMap && getOwn(starMap, nameSegment)) {
                        foundStarMap = getOwn(starMap, nameSegment);
                        starI = i;
                    }
                }

                if (!foundMap && foundStarMap) {
                    foundMap = foundStarMap;
                    foundI = starI;
                }

                if (foundMap) {
                    nameParts.splice(0, foundI, foundMap);
                    name = nameParts.join('/');
                }
            }

            return name;
        }

        function removeScript(name) {
            if (isBrowser) {
                each(scripts(), function (scriptNode) {
                    if (scriptNode.getAttribute('data-requiremodule') === name &&
                            scriptNode.getAttribute('data-requirecontext') === context.contextName) {
                        scriptNode.parentNode.removeChild(scriptNode);
                        return true;
                    }
                });
            }
        }

        function hasPathFallback(id) {
            var pathConfig = getOwn(config.paths, id);
            if (pathConfig && isArray(pathConfig) && pathConfig.length > 1) {
                //Pop off the first array value, since it failed, and
                //retry
                pathConfig.shift();
                context.require.undef(id);
                context.require([id]);
                return true;
            }
        }

        //Turns a plugin!resource to [plugin, resource]
        //with the plugin being undefined if the name
        //did not have a plugin prefix.
        function splitPrefix(name) {
            var prefix,
                index = name ? name.indexOf('!') : -1;
            if (index > -1) {
                prefix = name.substring(0, index);
                name = name.substring(index + 1, name.length);
            }
            return [prefix, name];
        }

        /**
         * Creates a module mapping that includes plugin prefix, module
         * name, and path. If parentModuleMap is provided it will
         * also normalize the name via require.normalize()
         *
         * @param {String} name the module name
         * @param {String} [parentModuleMap] parent module map
         * for the module name, used to resolve relative names.
         * @param {Boolean} isNormalized: is the ID already normalized.
         * This is true if this call is done for a define() module ID.
         * @param {Boolean} applyMap: apply the map config to the ID.
         * Should only be true if this map is for a dependency.
         *
         * @returns {Object}
         */
        function makeModuleMap(name, parentModuleMap, isNormalized, applyMap) {
            var url, pluginModule, suffix, nameParts,
                prefix = null,
                parentName = parentModuleMap ? parentModuleMap.name : null,
                originalName = name,
                isDefine = true,
                normalizedName = '';

            //If no name, then it means it is a require call, generate an
            //internal name.
            if (!name) {
                isDefine = false;
                name = '_@r' + (requireCounter += 1);
            }

            nameParts = splitPrefix(name);
            prefix = nameParts[0];
            name = nameParts[1];

            if (prefix) {
                prefix = normalize(prefix, parentName, applyMap);
                pluginModule = getOwn(defined, prefix);
            }

            //Account for relative paths if there is a base name.
            if (name) {
                if (prefix) {
                    if (pluginModule && pluginModule.normalize) {
                        //Plugin is loaded, use its normalize method.
                        normalizedName = pluginModule.normalize(name, function (name) {
                            return normalize(name, parentName, applyMap);
                        });
                    } else {
                        normalizedName = normalize(name, parentName, applyMap);
                    }
                } else {
                    //A regular module.
                    normalizedName = normalize(name, parentName, applyMap);

                    //Normalized name may be a plugin ID due to map config
                    //application in normalize. The map config values must
                    //already be normalized, so do not need to redo that part.
                    nameParts = splitPrefix(normalizedName);
                    prefix = nameParts[0];
                    normalizedName = nameParts[1];
                    isNormalized = true;

                    url = context.nameToUrl(normalizedName);
                }
            }

            //If the id is a plugin id that cannot be determined if it needs
            //normalization, stamp it with a unique ID so two matching relative
            //ids that may conflict can be separate.
            suffix = prefix && !pluginModule && !isNormalized ?
                     '_unnormalized' + (unnormalizedCounter += 1) :
                     '';

            return {
                prefix: prefix,
                name: normalizedName,
                parentMap: parentModuleMap,
                unnormalized: !!suffix,
                url: url,
                originalName: originalName,
                isDefine: isDefine,
                id: (prefix ?
                        prefix + '!' + normalizedName :
                        normalizedName) + suffix
            };
        }

        function getModule(depMap) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (!mod) {
                mod = registry[id] = new context.Module(depMap);
            }

            return mod;
        }

        function on(depMap, name, fn) {
            var id = depMap.id,
                mod = getOwn(registry, id);

            if (hasProp(defined, id) &&
                    (!mod || mod.defineEmitComplete)) {
                if (name === 'defined') {
                    fn(defined[id]);
                }
            } else {
                mod = getModule(depMap);
                if (mod.error && name === 'error') {
                    fn(mod.error);
                } else {
                    mod.on(name, fn);
                }
            }
        }

        function onError(err, errback) {
            var ids = err.requireModules,
                notified = false;

            if (errback) {
                errback(err);
            } else {
                each(ids, function (id) {
                    var mod = getOwn(registry, id);
                    if (mod) {
                        //Set error on module, so it skips timeout checks.
                        mod.error = err;
                        if (mod.events.error) {
                            notified = true;
                            mod.emit('error', err);
                        }
                    }
                });

                if (!notified) {
                    req.onError(err);
                }
            }
        }

        /**
         * Internal method to transfer globalQueue items to this context's
         * defQueue.
         */
        function takeGlobalQueue() {
            //Push all the globalDefQueue items into the context's defQueue
            if (globalDefQueue.length) {
                //Array splice in the values since the context code has a
                //local var ref to defQueue, so cannot just reassign the one
                //on context.
                apsp.apply(defQueue,
                           [defQueue.length - 1, 0].concat(globalDefQueue));
                globalDefQueue = [];
            }
        }

        handlers = {
            'require': function (mod) {
                if (mod.require) {
                    return mod.require;
                } else {
                    return (mod.require = context.makeRequire(mod.map));
                }
            },
            'exports': function (mod) {
                mod.usingExports = true;
                if (mod.map.isDefine) {
                    if (mod.exports) {
                        return mod.exports;
                    } else {
                        return (mod.exports = defined[mod.map.id] = {});
                    }
                }
            },
            'module': function (mod) {
                if (mod.module) {
                    return mod.module;
                } else {
                    return (mod.module = {
                        id: mod.map.id,
                        uri: mod.map.url,
                        config: function () {
                            var c,
                                pkg = getOwn(config.pkgs, mod.map.id);
                            // For packages, only support config targeted
                            // at the main module.
                            c = pkg ? getOwn(config.config, mod.map.id + '/' + pkg.main) :
                                      getOwn(config.config, mod.map.id);
                            return  c || {};
                        },
                        exports: defined[mod.map.id]
                    });
                }
            }
        };

        function cleanRegistry(id) {
            //Clean up machinery used for waiting modules.
            delete registry[id];
            delete enabledRegistry[id];
        }

        function breakCycle(mod, traced, processed) {
            var id = mod.map.id;

            if (mod.error) {
                mod.emit('error', mod.error);
            } else {
                traced[id] = true;
                each(mod.depMaps, function (depMap, i) {
                    var depId = depMap.id,
                        dep = getOwn(registry, depId);

                    //Only force things that have not completed
                    //being defined, so still in the registry,
                    //and only if it has not been matched up
                    //in the module already.
                    if (dep && !mod.depMatched[i] && !processed[depId]) {
                        if (getOwn(traced, depId)) {
                            mod.defineDep(i, defined[depId]);
                            mod.check(); //pass false?
                        } else {
                            breakCycle(dep, traced, processed);
                        }
                    }
                });
                processed[id] = true;
            }
        }

        function checkLoaded() {
            var map, modId, err, usingPathFallback,
                waitInterval = config.waitSeconds * 1000,
                //It is possible to disable the wait interval by using waitSeconds of 0.
                expired = waitInterval && (context.startTime + waitInterval) < new Date().getTime(),
                noLoads = [],
                reqCalls = [],
                stillLoading = false,
                needCycleCheck = true;

            //Do not bother if this call was a result of a cycle break.
            if (inCheckLoaded) {
                return;
            }

            inCheckLoaded = true;

            //Figure out the state of all the modules.
            eachProp(enabledRegistry, function (mod) {
                map = mod.map;
                modId = map.id;

                //Skip things that are not enabled or in error state.
                if (!mod.enabled) {
                    return;
                }

                if (!map.isDefine) {
                    reqCalls.push(mod);
                }

                if (!mod.error) {
                    //If the module should be executed, and it has not
                    //been inited and time is up, remember it.
                    if (!mod.inited && expired) {
                        if (hasPathFallback(modId)) {
                            usingPathFallback = true;
                            stillLoading = true;
                        } else {
                            noLoads.push(modId);
                            removeScript(modId);
                        }
                    } else if (!mod.inited && mod.fetched && map.isDefine) {
                        stillLoading = true;
                        if (!map.prefix) {
                            //No reason to keep looking for unfinished
                            //loading. If the only stillLoading is a
                            //plugin resource though, keep going,
                            //because it may be that a plugin resource
                            //is waiting on a non-plugin cycle.
                            return (needCycleCheck = false);
                        }
                    }
                }
            });

            if (expired && noLoads.length) {
                //If wait time expired, throw error of unloaded modules.
                err = makeError('timeout', 'Load timeout for modules: ' + noLoads, null, noLoads);
                err.contextName = context.contextName;
                return onError(err);
            }

            //Not expired, check for a cycle.
            if (needCycleCheck) {
                each(reqCalls, function (mod) {
                    breakCycle(mod, {}, {});
                });
            }

            //If still waiting on loads, and the waiting load is something
            //other than a plugin resource, or there are still outstanding
            //scripts, then just try back later.
            if ((!expired || usingPathFallback) && stillLoading) {
                //Something is still waiting to load. Wait for it, but only
                //if a timeout is not already in effect.
                if ((isBrowser || isWebWorker) && !checkLoadedTimeoutId) {
                    checkLoadedTimeoutId = setTimeout(function () {
                        checkLoadedTimeoutId = 0;
                        checkLoaded();
                    }, 50);
                }
            }

            inCheckLoaded = false;
        }

        Module = function (map) {
            this.events = getOwn(undefEvents, map.id) || {};
            this.map = map;
            this.shim = getOwn(config.shim, map.id);
            this.depExports = [];
            this.depMaps = [];
            this.depMatched = [];
            this.pluginMaps = {};
            this.depCount = 0;

            /* this.exports this.factory
               this.depMaps = [],
               this.enabled, this.fetched
            */
        };

        Module.prototype = {
            init: function (depMaps, factory, errback, options) {
                options = options || {};

                //Do not do more inits if already done. Can happen if there
                //are multiple define calls for the same module. That is not
                //a normal, common case, but it is also not unexpected.
                if (this.inited) {
                    return;
                }

                this.factory = factory;

                if (errback) {
                    //Register for errors on this module.
                    this.on('error', errback);
                } else if (this.events.error) {
                    //If no errback already, but there are error listeners
                    //on this module, set up an errback to pass to the deps.
                    errback = bind(this, function (err) {
                        this.emit('error', err);
                    });
                }

                //Do a copy of the dependency array, so that
                //source inputs are not modified. For example
                //"shim" deps are passed in here directly, and
                //doing a direct modification of the depMaps array
                //would affect that config.
                this.depMaps = depMaps && depMaps.slice(0);

                this.errback = errback;

                //Indicate this module has be initialized
                this.inited = true;

                this.ignore = options.ignore;

                //Could have option to init this module in enabled mode,
                //or could have been previously marked as enabled. However,
                //the dependencies are not known until init is called. So
                //if enabled previously, now trigger dependencies as enabled.
                if (options.enabled || this.enabled) {
                    //Enable this module and dependencies.
                    //Will call this.check()
                    this.enable();
                } else {
                    this.check();
                }
            },

            defineDep: function (i, depExports) {
                //Because of cycles, defined callback for a given
                //export can be called more than once.
                if (!this.depMatched[i]) {
                    this.depMatched[i] = true;
                    this.depCount -= 1;
                    this.depExports[i] = depExports;
                }
            },

            fetch: function () {
                if (this.fetched) {
                    return;
                }
                this.fetched = true;

                context.startTime = (new Date()).getTime();

                var map = this.map;

                //If the manager is for a plugin managed resource,
                //ask the plugin to load it now.
                if (this.shim) {
                    context.makeRequire(this.map, {
                        enableBuildCallback: true
                    })(this.shim.deps || [], bind(this, function () {
                        return map.prefix ? this.callPlugin() : this.load();
                    }));
                } else {
                    //Regular dependency.
                    return map.prefix ? this.callPlugin() : this.load();
                }
            },

            load: function () {
                var url = this.map.url;

                //Regular dependency.
                if (!urlFetched[url]) {
                    urlFetched[url] = true;
                    context.load(this.map.id, url);
                }
            },

            /**
             * Checks if the module is ready to define itself, and if so,
             * define it.
             */
            check: function () {
                if (!this.enabled || this.enabling) {
                    return;
                }

                var err, cjsModule,
                    id = this.map.id,
                    depExports = this.depExports,
                    exports = this.exports,
                    factory = this.factory;

                if (!this.inited) {
                    this.fetch();
                } else if (this.error) {
                    this.emit('error', this.error);
                } else if (!this.defining) {
                    //The factory could trigger another require call
                    //that would result in checking this module to
                    //define itself again. If already in the process
                    //of doing that, skip this work.
                    this.defining = true;

                    if (this.depCount < 1 && !this.defined) {
                        if (isFunction(factory)) {
                            //If there is an error listener, favor passing
                            //to that instead of throwing an error. However,
                            //only do it for define()'d  modules. require
                            //errbacks should not be called for failures in
                            //their callbacks (#699). However if a global
                            //onError is set, use that.
                            if ((this.events.error && this.map.isDefine) ||
                                req.onError !== defaultOnError) {
                                try {
                                    exports = context.execCb(id, factory, depExports, exports);
                                } catch (e) {
                                    err = e;
                                }
                            } else {
                                exports = context.execCb(id, factory, depExports, exports);
                            }

                            if (this.map.isDefine) {
                                //If setting exports via 'module' is in play,
                                //favor that over return value and exports. After that,
                                //favor a non-undefined return value over exports use.
                                cjsModule = this.module;
                                if (cjsModule &&
                                        cjsModule.exports !== undefined &&
                                        //Make sure it is not already the exports value
                                        cjsModule.exports !== this.exports) {
                                    exports = cjsModule.exports;
                                } else if (exports === undefined && this.usingExports) {
                                    //exports already set the defined value.
                                    exports = this.exports;
                                }
                            }

                            if (err) {
                                err.requireMap = this.map;
                                err.requireModules = this.map.isDefine ? [this.map.id] : null;
                                err.requireType = this.map.isDefine ? 'define' : 'require';
                                return onError((this.error = err));
                            }

                        } else {
                            //Just a literal value
                            exports = factory;
                        }

                        this.exports = exports;

                        if (this.map.isDefine && !this.ignore) {
                            defined[id] = exports;

                            if (req.onResourceLoad) {
                                req.onResourceLoad(context, this.map, this.depMaps);
                            }
                        }

                        //Clean up
                        cleanRegistry(id);

                        this.defined = true;
                    }

                    //Finished the define stage. Allow calling check again
                    //to allow define notifications below in the case of a
                    //cycle.
                    this.defining = false;

                    if (this.defined && !this.defineEmitted) {
                        this.defineEmitted = true;
                        this.emit('defined', this.exports);
                        this.defineEmitComplete = true;
                    }

                }
            },

            callPlugin: function () {
                var map = this.map,
                    id = map.id,
                    //Map already normalized the prefix.
                    pluginMap = makeModuleMap(map.prefix);

                //Mark this as a dependency for this plugin, so it
                //can be traced for cycles.
                this.depMaps.push(pluginMap);

                on(pluginMap, 'defined', bind(this, function (plugin) {
                    var load, normalizedMap, normalizedMod,
                        name = this.map.name,
                        parentName = this.map.parentMap ? this.map.parentMap.name : null,
                        localRequire = context.makeRequire(map.parentMap, {
                            enableBuildCallback: true
                        });

                    //If current map is not normalized, wait for that
                    //normalized name to load instead of continuing.
                    if (this.map.unnormalized) {
                        //Normalize the ID if the plugin allows it.
                        if (plugin.normalize) {
                            name = plugin.normalize(name, function (name) {
                                return normalize(name, parentName, true);
                            }) || '';
                        }

                        //prefix and name should already be normalized, no need
                        //for applying map config again either.
                        normalizedMap = makeModuleMap(map.prefix + '!' + name,
                                                      this.map.parentMap);
                        on(normalizedMap,
                            'defined', bind(this, function (value) {
                                this.init([], function () { return value; }, null, {
                                    enabled: true,
                                    ignore: true
                                });
                            }));

                        normalizedMod = getOwn(registry, normalizedMap.id);
                        if (normalizedMod) {
                            //Mark this as a dependency for this plugin, so it
                            //can be traced for cycles.
                            this.depMaps.push(normalizedMap);

                            if (this.events.error) {
                                normalizedMod.on('error', bind(this, function (err) {
                                    this.emit('error', err);
                                }));
                            }
                            normalizedMod.enable();
                        }

                        return;
                    }

                    load = bind(this, function (value) {
                        this.init([], function () { return value; }, null, {
                            enabled: true
                        });
                    });

                    load.error = bind(this, function (err) {
                        this.inited = true;
                        this.error = err;
                        err.requireModules = [id];

                        //Remove temp unnormalized modules for this module,
                        //since they will never be resolved otherwise now.
                        eachProp(registry, function (mod) {
                            if (mod.map.id.indexOf(id + '_unnormalized') === 0) {
                                cleanRegistry(mod.map.id);
                            }
                        });

                        onError(err);
                    });

                    //Allow plugins to load other code without having to know the
                    //context or how to 'complete' the load.
                    load.fromText = bind(this, function (text, textAlt) {
                        /*jslint evil: true */
                        var moduleName = map.name,
                            moduleMap = makeModuleMap(moduleName),
                            hasInteractive = useInteractive;

                        //As of 2.1.0, support just passing the text, to reinforce
                        //fromText only being called once per resource. Still
                        //support old style of passing moduleName but discard
                        //that moduleName in favor of the internal ref.
                        if (textAlt) {
                            text = textAlt;
                        }

                        //Turn off interactive script matching for IE for any define
                        //calls in the text, then turn it back on at the end.
                        if (hasInteractive) {
                            useInteractive = false;
                        }

                        //Prime the system by creating a module instance for
                        //it.
                        getModule(moduleMap);

                        //Transfer any config to this other module.
                        if (hasProp(config.config, id)) {
                            config.config[moduleName] = config.config[id];
                        }

                        try {
                            req.exec(text);
                        } catch (e) {
                            return onError(makeError('fromtexteval',
                                             'fromText eval for ' + id +
                                            ' failed: ' + e,
                                             e,
                                             [id]));
                        }

                        if (hasInteractive) {
                            useInteractive = true;
                        }

                        //Mark this as a dependency for the plugin
                        //resource
                        this.depMaps.push(moduleMap);

                        //Support anonymous modules.
                        context.completeLoad(moduleName);

                        //Bind the value of that module to the value for this
                        //resource ID.
                        localRequire([moduleName], load);
                    });

                    //Use parentName here since the plugin's name is not reliable,
                    //could be some weird string with no path that actually wants to
                    //reference the parentName's path.
                    plugin.load(map.name, localRequire, load, config);
                }));

                context.enable(pluginMap, this);
                this.pluginMaps[pluginMap.id] = pluginMap;
            },

            enable: function () {
                enabledRegistry[this.map.id] = this;
                this.enabled = true;

                //Set flag mentioning that the module is enabling,
                //so that immediate calls to the defined callbacks
                //for dependencies do not trigger inadvertent load
                //with the depCount still being zero.
                this.enabling = true;

                //Enable each dependency
                each(this.depMaps, bind(this, function (depMap, i) {
                    var id, mod, handler;

                    if (typeof depMap === 'string') {
                        //Dependency needs to be converted to a depMap
                        //and wired up to this module.
                        depMap = makeModuleMap(depMap,
                                               (this.map.isDefine ? this.map : this.map.parentMap),
                                               false,
                                               !this.skipMap);
                        this.depMaps[i] = depMap;

                        handler = getOwn(handlers, depMap.id);

                        if (handler) {
                            this.depExports[i] = handler(this);
                            return;
                        }

                        this.depCount += 1;

                        on(depMap, 'defined', bind(this, function (depExports) {
                            this.defineDep(i, depExports);
                            this.check();
                        }));

                        if (this.errback) {
                            on(depMap, 'error', bind(this, this.errback));
                        }
                    }

                    id = depMap.id;
                    mod = registry[id];

                    //Skip special modules like 'require', 'exports', 'module'
                    //Also, don't call enable if it is already enabled,
                    //important in circular dependency cases.
                    if (!hasProp(handlers, id) && mod && !mod.enabled) {
                        context.enable(depMap, this);
                    }
                }));

                //Enable each plugin that is used in
                //a dependency
                eachProp(this.pluginMaps, bind(this, function (pluginMap) {
                    var mod = getOwn(registry, pluginMap.id);
                    if (mod && !mod.enabled) {
                        context.enable(pluginMap, this);
                    }
                }));

                this.enabling = false;

                this.check();
            },

            on: function (name, cb) {
                var cbs = this.events[name];
                if (!cbs) {
                    cbs = this.events[name] = [];
                }
                cbs.push(cb);
            },

            emit: function (name, evt) {
                each(this.events[name], function (cb) {
                    cb(evt);
                });
                if (name === 'error') {
                    //Now that the error handler was triggered, remove
                    //the listeners, since this broken Module instance
                    //can stay around for a while in the registry.
                    delete this.events[name];
                }
            }
        };

        function callGetModule(args) {
            //Skip modules already defined.
            if (!hasProp(defined, args[0])) {
                getModule(makeModuleMap(args[0], null, true)).init(args[1], args[2]);
            }
        }

        function removeListener(node, func, name, ieName) {
            //Favor detachEvent because of IE9
            //issue, see attachEvent/addEventListener comment elsewhere
            //in this file.
            if (node.detachEvent && !isOpera) {
                //Probably IE. If not it will throw an error, which will be
                //useful to know.
                if (ieName) {
                    node.detachEvent(ieName, func);
                }
            } else {
                node.removeEventListener(name, func, false);
            }
        }

        /**
         * Given an event from a script node, get the requirejs info from it,
         * and then removes the event listeners on the node.
         * @param {Event} evt
         * @returns {Object}
         */
        function getScriptData(evt) {
            //Using currentTarget instead of target for Firefox 2.0's sake. Not
            //all old browsers will be supported, but this one was easy enough
            //to support and still makes sense.
            var node = evt.currentTarget || evt.srcElement;

            //Remove the listeners once here.
            removeListener(node, context.onScriptLoad, 'load', 'onreadystatechange');
            removeListener(node, context.onScriptError, 'error');

            return {
                node: node,
                id: node && node.getAttribute('data-requiremodule')
            };
        }

        function intakeDefines() {
            var args;

            //Any defined modules in the global queue, intake them now.
            takeGlobalQueue();

            //Make sure any remaining defQueue items get properly processed.
            while (defQueue.length) {
                args = defQueue.shift();
                if (args[0] === null) {
                    return onError(makeError('mismatch', 'Mismatched anonymous define() module: ' + args[args.length - 1]));
                } else {
                    //args are id, deps, factory. Should be normalized by the
                    //define() function.
                    callGetModule(args);
                }
            }
        }

        context = {
            config: config,
            contextName: contextName,
            registry: registry,
            defined: defined,
            urlFetched: urlFetched,
            defQueue: defQueue,
            Module: Module,
            makeModuleMap: makeModuleMap,
            nextTick: req.nextTick,
            onError: onError,

            /**
             * Set a configuration for the context.
             * @param {Object} cfg config object to integrate.
             */
            configure: function (cfg) {
                //Make sure the baseUrl ends in a slash.
                if (cfg.baseUrl) {
                    if (cfg.baseUrl.charAt(cfg.baseUrl.length - 1) !== '/') {
                        cfg.baseUrl += '/';
                    }
                }

                //Save off the paths and packages since they require special processing,
                //they are additive.
                var pkgs = config.pkgs,
                    shim = config.shim,
                    objs = {
                        paths: true,
                        config: true,
                        map: true
                    };

                eachProp(cfg, function (value, prop) {
                    if (objs[prop]) {
                        if (prop === 'map') {
                            if (!config.map) {
                                config.map = {};
                            }
                            mixin(config[prop], value, true, true);
                        } else {
                            mixin(config[prop], value, true);
                        }
                    } else {
                        config[prop] = value;
                    }
                });

                //Merge shim
                if (cfg.shim) {
                    eachProp(cfg.shim, function (value, id) {
                        //Normalize the structure
                        if (isArray(value)) {
                            value = {
                                deps: value
                            };
                        }
                        if ((value.exports || value.init) && !value.exportsFn) {
                            value.exportsFn = context.makeShimExports(value);
                        }
                        shim[id] = value;
                    });
                    config.shim = shim;
                }

                //Adjust packages if necessary.
                if (cfg.packages) {
                    each(cfg.packages, function (pkgObj) {
                        var location;

                        pkgObj = typeof pkgObj === 'string' ? { name: pkgObj } : pkgObj;
                        location = pkgObj.location;

                        //Create a brand new object on pkgs, since currentPackages can
                        //be passed in again, and config.pkgs is the internal transformed
                        //state for all package configs.
                        pkgs[pkgObj.name] = {
                            name: pkgObj.name,
                            location: location || pkgObj.name,
                            //Remove leading dot in main, so main paths are normalized,
                            //and remove any trailing .js, since different package
                            //envs have different conventions: some use a module name,
                            //some use a file name.
                            main: (pkgObj.main || 'main')
                                  .replace(currDirRegExp, '')
                                  .replace(jsSuffixRegExp, '')
                        };
                    });

                    //Done with modifications, assing packages back to context config
                    config.pkgs = pkgs;
                }

                //If there are any "waiting to execute" modules in the registry,
                //update the maps for them, since their info, like URLs to load,
                //may have changed.
                eachProp(registry, function (mod, id) {
                    //If module already has init called, since it is too
                    //late to modify them, and ignore unnormalized ones
                    //since they are transient.
                    if (!mod.inited && !mod.map.unnormalized) {
                        mod.map = makeModuleMap(id);
                    }
                });

                //If a deps array or a config callback is specified, then call
                //require with those args. This is useful when require is defined as a
                //config object before require.js is loaded.
                if (cfg.deps || cfg.callback) {
                    context.require(cfg.deps || [], cfg.callback);
                }
            },

            makeShimExports: function (value) {
                function fn() {
                    var ret;
                    if (value.init) {
                        ret = value.init.apply(global, arguments);
                    }
                    return ret || (value.exports && getGlobal(value.exports));
                }
                return fn;
            },

            makeRequire: function (relMap, options) {
                options = options || {};

                function localRequire(deps, callback, errback) {
                    var id, map, requireMod;

                    if (options.enableBuildCallback && callback && isFunction(callback)) {
                        callback.__requireJsBuild = true;
                    }

                    if (typeof deps === 'string') {
                        if (isFunction(callback)) {
                            //Invalid call
                            return onError(makeError('requireargs', 'Invalid require call'), errback);
                        }

                        //If require|exports|module are requested, get the
                        //value for them from the special handlers. Caveat:
                        //this only works while module is being defined.
                        if (relMap && hasProp(handlers, deps)) {
                            return handlers[deps](registry[relMap.id]);
                        }

                        //Synchronous access to one module. If require.get is
                        //available (as in the Node adapter), prefer that.
                        if (req.get) {
                            return req.get(context, deps, relMap, localRequire);
                        }

                        //Normalize module name, if it contains . or ..
                        map = makeModuleMap(deps, relMap, false, true);
                        id = map.id;

                        if (!hasProp(defined, id)) {
                            return onError(makeError('notloaded', 'Module name "' +
                                        id +
                                        '" has not been loaded yet for context: ' +
                                        contextName +
                                        (relMap ? '' : '. Use require([])')));
                        }
                        return defined[id];
                    }

                    //Grab defines waiting in the global queue.
                    intakeDefines();

                    //Mark all the dependencies as needing to be loaded.
                    context.nextTick(function () {
                        //Some defines could have been added since the
                        //require call, collect them.
                        intakeDefines();

                        requireMod = getModule(makeModuleMap(null, relMap));

                        //Store if map config should be applied to this require
                        //call for dependencies.
                        requireMod.skipMap = options.skipMap;

                        requireMod.init(deps, callback, errback, {
                            enabled: true
                        });

                        checkLoaded();
                    });

                    return localRequire;
                }

                mixin(localRequire, {
                    isBrowser: isBrowser,

                    /**
                     * Converts a module name + .extension into an URL path.
                     * *Requires* the use of a module name. It does not support using
                     * plain URLs like nameToUrl.
                     */
                    toUrl: function (moduleNamePlusExt) {
                        var ext,
                            index = moduleNamePlusExt.lastIndexOf('.'),
                            segment = moduleNamePlusExt.split('/')[0],
                            isRelative = segment === '.' || segment === '..';

                        //Have a file extension alias, and it is not the
                        //dots from a relative path.
                        if (index !== -1 && (!isRelative || index > 1)) {
                            ext = moduleNamePlusExt.substring(index, moduleNamePlusExt.length);
                            moduleNamePlusExt = moduleNamePlusExt.substring(0, index);
                        }

                        return context.nameToUrl(normalize(moduleNamePlusExt,
                                                relMap && relMap.id, true), ext,  true);
                    },

                    defined: function (id) {
                        return hasProp(defined, makeModuleMap(id, relMap, false, true).id);
                    },

                    specified: function (id) {
                        id = makeModuleMap(id, relMap, false, true).id;
                        return hasProp(defined, id) || hasProp(registry, id);
                    }
                });

                //Only allow undef on top level require calls
                if (!relMap) {
                    localRequire.undef = function (id) {
                        //Bind any waiting define() calls to this context,
                        //fix for #408
                        takeGlobalQueue();

                        var map = makeModuleMap(id, relMap, true),
                            mod = getOwn(registry, id);

                        removeScript(id);

                        delete defined[id];
                        delete urlFetched[map.url];
                        delete undefEvents[id];

                        if (mod) {
                            //Hold on to listeners in case the
                            //module will be attempted to be reloaded
                            //using a different config.
                            if (mod.events.defined) {
                                undefEvents[id] = mod.events;
                            }

                            cleanRegistry(id);
                        }
                    };
                }

                return localRequire;
            },

            /**
             * Called to enable a module if it is still in the registry
             * awaiting enablement. A second arg, parent, the parent module,
             * is passed in for context, when this method is overriden by
             * the optimizer. Not shown here to keep code compact.
             */
            enable: function (depMap) {
                var mod = getOwn(registry, depMap.id);
                if (mod) {
                    getModule(depMap).enable();
                }
            },

            /**
             * Internal method used by environment adapters to complete a load event.
             * A load event could be a script load or just a load pass from a synchronous
             * load call.
             * @param {String} moduleName the name of the module to potentially complete.
             */
            completeLoad: function (moduleName) {
                var found, args, mod,
                    shim = getOwn(config.shim, moduleName) || {},
                    shExports = shim.exports;

                takeGlobalQueue();

                while (defQueue.length) {
                    args = defQueue.shift();
                    if (args[0] === null) {
                        args[0] = moduleName;
                        //If already found an anonymous module and bound it
                        //to this name, then this is some other anon module
                        //waiting for its completeLoad to fire.
                        if (found) {
                            break;
                        }
                        found = true;
                    } else if (args[0] === moduleName) {
                        //Found matching define call for this script!
                        found = true;
                    }

                    callGetModule(args);
                }

                //Do this after the cycle of callGetModule in case the result
                //of those calls/init calls changes the registry.
                mod = getOwn(registry, moduleName);

                if (!found && !hasProp(defined, moduleName) && mod && !mod.inited) {
                    if (config.enforceDefine && (!shExports || !getGlobal(shExports))) {
                        if (hasPathFallback(moduleName)) {
                            return;
                        } else {
                            return onError(makeError('nodefine',
                                             'No define call for ' + moduleName,
                                             null,
                                             [moduleName]));
                        }
                    } else {
                        //A script that does not call define(), so just simulate
                        //the call for it.
                        callGetModule([moduleName, (shim.deps || []), shim.exportsFn]);
                    }
                }

                checkLoaded();
            },

            /**
             * Converts a module name to a file path. Supports cases where
             * moduleName may actually be just an URL.
             * Note that it **does not** call normalize on the moduleName,
             * it is assumed to have already been normalized. This is an
             * internal API, not a public one. Use toUrl for the public API.
             */
            nameToUrl: function (moduleName, ext, skipExt) {
                var paths, pkgs, pkg, pkgPath, syms, i, parentModule, url,
                    parentPath;

                //If a colon is in the URL, it indicates a protocol is used and it is just
                //an URL to a file, or if it starts with a slash, contains a query arg (i.e. ?)
                //or ends with .js, then assume the user meant to use an url and not a module id.
                //The slash is important for protocol-less URLs as well as full paths.
                if (req.jsExtRegExp.test(moduleName)) {
                    //Just a plain path, not module name lookup, so just return it.
                    //Add extension if it is included. This is a bit wonky, only non-.js things pass
                    //an extension, this method probably needs to be reworked.
                    url = moduleName + (ext || '');
                } else {
                    //A module that needs to be converted to a path.
                    paths = config.paths;
                    pkgs = config.pkgs;

                    syms = moduleName.split('/');
                    //For each module name segment, see if there is a path
                    //registered for it. Start with most specific name
                    //and work up from it.
                    for (i = syms.length; i > 0; i -= 1) {
                        parentModule = syms.slice(0, i).join('/');
                        pkg = getOwn(pkgs, parentModule);
                        parentPath = getOwn(paths, parentModule);
                        if (parentPath) {
                            //If an array, it means there are a few choices,
                            //Choose the one that is desired
                            if (isArray(parentPath)) {
                                parentPath = parentPath[0];
                            }
                            syms.splice(0, i, parentPath);
                            break;
                        } else if (pkg) {
                            //If module name is just the package name, then looking
                            //for the main module.
                            if (moduleName === pkg.name) {
                                pkgPath = pkg.location + '/' + pkg.main;
                            } else {
                                pkgPath = pkg.location;
                            }
                            syms.splice(0, i, pkgPath);
                            break;
                        }
                    }

                    //Join the path parts together, then figure out if baseUrl is needed.
                    url = syms.join('/');
                    url += (ext || (/^data\:|\?/.test(url) || skipExt ? '' : '.js'));
                    url = (url.charAt(0) === '/' || url.match(/^[\w\+\.\-]+:/) ? '' : config.baseUrl) + url;
                }

                return config.urlArgs ? url +
                                        ((url.indexOf('?') === -1 ? '?' : '&') +
                                         config.urlArgs) : url;
            },

            //Delegates to req.load. Broken out as a separate function to
            //allow overriding in the optimizer.
            load: function (id, url) {
                req.load(context, id, url);
            },

            /**
             * Executes a module callback function. Broken out as a separate function
             * solely to allow the build system to sequence the files in the built
             * layer in the right sequence.
             *
             * @private
             */
            execCb: function (name, callback, args, exports) {
                return callback.apply(exports, args);
            },

            /**
             * callback for script loads, used to check status of loading.
             *
             * @param {Event} evt the event from the browser for the script
             * that was loaded.
             */
            onScriptLoad: function (evt) {
                //Using currentTarget instead of target for Firefox 2.0's sake. Not
                //all old browsers will be supported, but this one was easy enough
                //to support and still makes sense.
                if (evt.type === 'load' ||
                        (readyRegExp.test((evt.currentTarget || evt.srcElement).readyState))) {
                    //Reset interactive script so a script node is not held onto for
                    //to long.
                    interactiveScript = null;

                    //Pull out the name of the module and the context.
                    var data = getScriptData(evt);
                    context.completeLoad(data.id);
                }
            },

            /**
             * Callback for script errors.
             */
            onScriptError: function (evt) {
                var data = getScriptData(evt);
                if (!hasPathFallback(data.id)) {
                    return onError(makeError('scripterror', 'Script error for: ' + data.id, evt, [data.id]));
                }
            }
        };

        context.require = context.makeRequire();
        return context;
    }

    /**
     * Main entry point.
     *
     * If the only argument to require is a string, then the module that
     * is represented by that string is fetched for the appropriate context.
     *
     * If the first argument is an array, then it will be treated as an array
     * of dependency string names to fetch. An optional function callback can
     * be specified to execute when all of those dependencies are available.
     *
     * Make a local req variable to help Caja compliance (it assumes things
     * on a require that are not standardized), and to give a short
     * name for minification/local scope use.
     */
    req = requirejs = function (deps, callback, errback, optional) {

        //Find the right context, use default
        var context, config,
            contextName = defContextName;

        // Determine if have config object in the call.
        if (!isArray(deps) && typeof deps !== 'string') {
            // deps is a config object
            config = deps;
            if (isArray(callback)) {
                // Adjust args if there are dependencies
                deps = callback;
                callback = errback;
                errback = optional;
            } else {
                deps = [];
            }
        }

        if (config && config.context) {
            contextName = config.context;
        }

        context = getOwn(contexts, contextName);
        if (!context) {
            context = contexts[contextName] = req.s.newContext(contextName);
        }

        if (config) {
            context.configure(config);
        }

        return context.require(deps, callback, errback);
    };

    /**
     * Support require.config() to make it easier to cooperate with other
     * AMD loaders on globally agreed names.
     */
    req.config = function (config) {
        return req(config);
    };

    /**
     * Execute something after the current tick
     * of the event loop. Override for other envs
     * that have a better solution than setTimeout.
     * @param  {Function} fn function to execute later.
     */
    req.nextTick = typeof setTimeout !== 'undefined' ? function (fn) {
        setTimeout(fn, 4);
    } : function (fn) { fn(); };

    /**
     * Export require as a global, but only if it does not already exist.
     */
    if (!require) {
        require = req;
    }

    req.version = version;

    //Used to filter out dependencies that are already paths.
    req.jsExtRegExp = /^\/|:|\?|\.js$/;
    req.isBrowser = isBrowser;
    s = req.s = {
        contexts: contexts,
        newContext: newContext
    };

    //Create default context.
    req({});

    //Exports some context-sensitive methods on global require.
    each([
        'toUrl',
        'undef',
        'defined',
        'specified'
    ], function (prop) {
        //Reference from contexts instead of early binding to default context,
        //so that during builds, the latest instance of the default context
        //with its config gets used.
        req[prop] = function () {
            var ctx = contexts[defContextName];
            return ctx.require[prop].apply(ctx, arguments);
        };
    });

    if (isBrowser) {
        head = s.head = document.getElementsByTagName('head')[0];
        //If BASE tag is in play, using appendChild is a problem for IE6.
        //When that browser dies, this can be removed. Details in this jQuery bug:
        //http://dev.jquery.com/ticket/2709
        baseElement = document.getElementsByTagName('base')[0];
        if (baseElement) {
            head = s.head = baseElement.parentNode;
        }
    }

    /**
     * Any errors that require explicitly generates will be passed to this
     * function. Intercept/override it if you want custom error handling.
     * @param {Error} err the error object.
     */
    req.onError = defaultOnError;

    /**
     * Creates the node for the load command. Only used in browser envs.
     */
    req.createNode = function (config, moduleName, url) {
        var node = config.xhtml ?
                document.createElementNS('http://www.w3.org/1999/xhtml', 'html:script') :
                document.createElement('script');
        node.type = config.scriptType || 'text/javascript';
        node.charset = 'utf-8';
        node.async = true;
        return node;
    };

    /**
     * Does the request to load a module for the browser case.
     * Make this a separate function to allow other environments
     * to override it.
     *
     * @param {Object} context the require context to find state.
     * @param {String} moduleName the name of the module.
     * @param {Object} url the URL to the module.
     */
    req.load = function (context, moduleName, url) {
        var config = (context && context.config) || {},
            node;
        if (isBrowser) {
            //In the browser so use a script tag
            node = req.createNode(config, moduleName, url);

            node.setAttribute('data-requirecontext', context.contextName);
            node.setAttribute('data-requiremodule', moduleName);

            //Set up load listener. Test attachEvent first because IE9 has
            //a subtle issue in its addEventListener and script onload firings
            //that do not match the behavior of all other browsers with
            //addEventListener support, which fire the onload event for a
            //script right after the script execution. See:
            //https://connect.microsoft.com/IE/feedback/details/648057/script-onload-event-is-not-fired-immediately-after-script-execution
            //UNFORTUNATELY Opera implements attachEvent but does not follow the script
            //script execution mode.
            if (node.attachEvent &&
                    //Check if node.attachEvent is artificially added by custom script or
                    //natively supported by browser
                    //read https://github.com/jrburke/requirejs/issues/187
                    //if we can NOT find [native code] then it must NOT natively supported.
                    //in IE8, node.attachEvent does not have toString()
                    //Note the test for "[native code" with no closing brace, see:
                    //https://github.com/jrburke/requirejs/issues/273
                    !(node.attachEvent.toString && node.attachEvent.toString().indexOf('[native code') < 0) &&
                    !isOpera) {
                //Probably IE. IE (at least 6-8) do not fire
                //script onload right after executing the script, so
                //we cannot tie the anonymous define call to a name.
                //However, IE reports the script as being in 'interactive'
                //readyState at the time of the define call.
                useInteractive = true;

                node.attachEvent('onreadystatechange', context.onScriptLoad);
                //It would be great to add an error handler here to catch
                //404s in IE9+. However, onreadystatechange will fire before
                //the error handler, so that does not help. If addEventListener
                //is used, then IE will fire error before load, but we cannot
                //use that pathway given the connect.microsoft.com issue
                //mentioned above about not doing the 'script execute,
                //then fire the script load event listener before execute
                //next script' that other browsers do.
                //Best hope: IE10 fixes the issues,
                //and then destroys all installs of IE 6-9.
                //node.attachEvent('onerror', context.onScriptError);
            } else {
                node.addEventListener('load', context.onScriptLoad, false);
                node.addEventListener('error', context.onScriptError, false);
            }
            node.src = url;

            //For some cache cases in IE 6-8, the script executes before the end
            //of the appendChild execution, so to tie an anonymous define
            //call to the module name (which is stored on the node), hold on
            //to a reference to this node, but clear after the DOM insertion.
            currentlyAddingScript = node;
            if (baseElement) {
                head.insertBefore(node, baseElement);
            } else {
                head.appendChild(node);
            }
            currentlyAddingScript = null;

            return node;
        } else if (isWebWorker) {
            try {
                //In a web worker, use importScripts. This is not a very
                //efficient use of importScripts, importScripts will block until
                //its script is downloaded and evaluated. However, if web workers
                //are in play, the expectation that a build has been done so that
                //only one script needs to be loaded anyway. This may need to be
                //reevaluated if other use cases become common.
                importScripts(url);

                //Account for anonymous modules
                context.completeLoad(moduleName);
            } catch (e) {
                context.onError(makeError('importscripts',
                                'importScripts failed for ' +
                                    moduleName + ' at ' + url,
                                e,
                                [moduleName]));
            }
        }
    };

    function getInteractiveScript() {
        if (interactiveScript && interactiveScript.readyState === 'interactive') {
            return interactiveScript;
        }

        eachReverse(scripts(), function (script) {
            if (script.readyState === 'interactive') {
                return (interactiveScript = script);
            }
        });
        return interactiveScript;
    }

    //Look for a data-main script attribute, which could also adjust the baseUrl.
    if (isBrowser && !cfg.skipDataMain) {
        //Figure out baseUrl. Get it from the script tag with require.js in it.
        eachReverse(scripts(), function (script) {
            //Set the 'head' where we can append children by
            //using the script's parent.
            if (!head) {
                head = script.parentNode;
            }

            //Look for a data-main attribute to set main script for the page
            //to load. If it is there, the path to data main becomes the
            //baseUrl, if it is not already set.
            dataMain = script.getAttribute('data-main');
            if (dataMain) {
                //Preserve dataMain in case it is a path (i.e. contains '?')
                mainScript = dataMain;

                //Set final baseUrl if there is not already an explicit one.
                if (!cfg.baseUrl) {
                    //Pull off the directory of data-main for use as the
                    //baseUrl.
                    src = mainScript.split('/');
                    mainScript = src.pop();
                    subPath = src.length ? src.join('/')  + '/' : './';

                    cfg.baseUrl = subPath;
                }

                //Strip off any trailing .js since mainScript is now
                //like a module name.
                mainScript = mainScript.replace(jsSuffixRegExp, '');

                 //If mainScript is still a path, fall back to dataMain
                if (req.jsExtRegExp.test(mainScript)) {
                    mainScript = dataMain;
                }

                //Put the data-main script in the files to load.
                cfg.deps = cfg.deps ? cfg.deps.concat(mainScript) : [mainScript];

                return true;
            }
        });
    }

    /**
     * The function that handles definitions of modules. Differs from
     * require() in that a string for the module should be the first argument,
     * and the function to execute after dependencies are loaded should
     * return a value to define the module corresponding to the first argument's
     * name.
     */
    define = function (name, deps, callback) {
        var node, context;

        //Allow for anonymous modules
        if (typeof name !== 'string') {
            //Adjust args appropriately
            callback = deps;
            deps = name;
            name = null;
        }

        //This module may not have dependencies
        if (!isArray(deps)) {
            callback = deps;
            deps = null;
        }

        //If no name, and callback is a function, then figure out if it a
        //CommonJS thing with dependencies.
        if (!deps && isFunction(callback)) {
            deps = [];
            //Remove comments from the callback string,
            //look for require calls, and pull them into the dependencies,
            //but only if there are function args.
            if (callback.length) {
                callback
                    .toString()
                    .replace(commentRegExp, '')
                    .replace(cjsRequireRegExp, function (match, dep) {
                        deps.push(dep);
                    });

                //May be a CommonJS thing even without require calls, but still
                //could use exports, and module. Avoid doing exports and module
                //work though if it just needs require.
                //REQUIRES the function to expect the CommonJS variables in the
                //order listed below.
                deps = (callback.length === 1 ? ['require'] : ['require', 'exports', 'module']).concat(deps);
            }
        }

        //If in IE 6-8 and hit an anonymous define() call, do the interactive
        //work.
        if (useInteractive) {
            node = currentlyAddingScript || getInteractiveScript();
            if (node) {
                if (!name) {
                    name = node.getAttribute('data-requiremodule');
                }
                context = contexts[node.getAttribute('data-requirecontext')];
            }
        }

        //Always save off evaluating the def call until the script onload handler.
        //This allows multiple modules to be in a file without prematurely
        //tracing dependencies, and allows for anonymous module support,
        //where the module name is not known until the script onload event
        //occurs. If no context, use the global queue, and get it processed
        //in the onscript load callback.
        (context ? context.defQueue : globalDefQueue).push([name, deps, callback]);
    };

    define.amd = {
        jQuery: true
    };


    /**
     * Executes the text. Normally just uses eval, but can be modified
     * to use a better, environment-specific call. Only used for transpiling
     * loader plugins, not for plain JS modules.
     * @param {String} text the text to execute/evaluate.
     */
    req.exec = function (text) {
        /*jslint evil: true */
        return eval(text);
    };

    //Set up with config info.
    req(cfg);
}(this));


/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
define('sge/class',[],function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
 
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
   
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
   
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" &&
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
           
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
           
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
           
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
   
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
   
    // Populate our constructed prototype object
    Class.prototype = prototype;
   
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
   
    return Class;
  };

  return Class
});

define('sge/observable',[
    './class'
    ],
    function(Class){
        /**
         * Base class for all observable objects utilizing event system.
         *
         */
        var Observable = Class.extend({
            init: function(){
                this._lisenters = {};
            },
            /**
             * Register a `callback` with this observable, for the given `eventName`. The option 'once'
             * be set to true, for the callback to be removed automatically after the event is fired the first time.
             * 
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             * 
             */
            on: function(eventName, callback, options){
                options = options || {};
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName].push([callback, options]);
            },

            /**
             * Removed a registered callback and returns the callback.
             * @param  {String}   eventName
             * @param  {Function} callback
             * @param  {Object}   options
             * @return {Function}
             */
            off: function(eventName, callback, options){
                if (this._lisenters[eventName]==undefined){
                    this._lisenters[eventName]=[];
                }
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    return data[0]!=callback;
                });
            },

            /**
             * Trigger the named event.
             * @param  {String} eventName
             * 
             */
            trigger: function(){
                var args = Array.prototype.slice.call(arguments);
                var eventName = args.shift();
                if (this._lisenters[eventName]==undefined){
                    return;
                }
                var callbacks = this._lisenters[eventName];
                this._lisenters[eventName] = this._lisenters[eventName].filter(function(data){
                    data[0].apply(this, args);
                    if (data[1].once){
                        return false;
                    }
                    return true;
                })
            }
        });

        return Observable;
    }
);
define(
    'sge/input',['./observable'],
function(Observable){
    var KEYMAP = {
        "B1" : "space",
        "B2" : "enter"
    }
    var KEYCODES = {
        "backspace" : 8,
        "tab" : 9,
        "enter" : 13,
        "shift" : 16,
        "ctrl" : 17,
        "alt" : 18,
        "pause" : 19,
        "capslock" : 20,
        "escape" : 27,
        "space" : 32,
        "pageup" : 33,
        "pagedown" : 34,
        "end" : 35,
        "home" : 36,
        "left" : 37,
        "up" : 38,
        "right" : 39,
        "down" : 40,
        "insert" : 45,
        "delete" : 46,
        "0" : 48,
        "1" : 49,
        "2" : 50,
        "3" : 51,
        "4" : 52,
        "5" : 53,
        "6" : 54,
        "7" : 55,
        "8" : 56,
        "9" : 57,
        "A" : 65,
        "B" : 66,
        "C" : 67,
        "D" : 68,
        "E" : 69,
        "F" : 70,
        "G" : 71,
        "H" : 72,
        "I" : 73,
        "J" : 74,
        "K" : 75,
        "L" : 76,
        "M" : 77,
        "N" : 78,
        "O" : 79,
        "P" : 80,
        "Q" : 81,
        "R" : 82,
        "S" : 83,
        "T" : 84,
        "U" : 85,
        "V" : 86,
        "W" : 87,
        "X" : 88,
        "Y" : 89,
        "Z" : 90,
        "left-window-key" : 91,
        "right-window-key" : 92,
        "select" : 93,
        "numpad0" : 96,
        "numpad1" : 97,
        "numpad2" : 98,
        "numpad3" : 99,
        "numpad4" : 100,
        "numpad5" : 101,
        "numpad6" : 102,
        "numpad7" : 103,
        "numpad8" : 104,
        "numpad9" : 105,
        "multiply" : 106,
        "add" : 107,
        "subtract" : 109,
        "decimal-point" : 110,
        "divide" : 111,
        "F1" : 112,
        "F2" : 113,
        "F3" : 114,
        "F4" : 115,
        "F5" : 116,
        "F6" : 117,
        "F7" : 118,
        "F8" : 119,
        "F9" : 120,
        "F10" : 121,
        "F11" : 122,
        "F12" : 123,
        "numlock" : 144,
        "scrolllock" : 145,
        "semi-colon" : 186,
        "equals" : 187,
        "comma" : 188,
        "dash" : 189,
        "period" : 190,
        "slash" : 191,
        "accent" : 192,
        "lbracket" : 219,
        "backslash" : 220,
        "rbraket" : 221,
        "singlequote" : 222
    };

    var REVERSE_KEYCODES = {};
    var keys = Object.keys(KEYCODES);
    for (var i=0; i<keys.length; i++){
        var key = keys[i];
        var value = KEYCODES[key];
        REVERSE_KEYCODES[value] = key;
    }

    var InputProxy = Observable.extend({
        init: function(input){
            this._super();
            this._input = input
            this.enable = false;
            this.joystick = input.joystick;
            this._dpad = []
        },
        trigger: function(){
            var args = Array.prototype.slice.call(arguments);
            if (this.enable){
                this._super.apply(this, args);
            }
        },
        isPressed: function(keyCode){
            return this._input.isPressed(keyCode);
        },
        isDown: function(keyCode){
            return this._input.isDown(keyCode);
        },
        dpad: function(){
            var xaxis = 0;
            var yaxis = 0;
            if (this.joystick){
                if (this.joystick.down()){
                    yaxis++;
                }
                if (this.joystick.up()){
                    yaxis--;
                }
                if (this.joystick.right()){
                    xaxis++;
                }
                if (this.joystick.left()){
                    xaxis--;
                }
            } else {
                if (this.isDown('down')){
                    yaxis++;
                }
                if (this.isDown('up')){
                    yaxis--;
                }
                if (this.isDown('right')){
                    xaxis++;
                }
                if (this.isDown('left')){
                    xaxis--;
                }
            }
            this._dpad[0] = xaxis;
            this._dpad[1] = yaxis;
            return this._dpad;
        }
    });

    var Input = Observable.extend({
        init: function(elem){
            this._elem = document.body
            this._super()
            this._isNewKeyDown = {}
            this._isKeyDown = {};
            this._proxies = [];
            this._events = [];
            this.joystick = null;
            this._isKeyPress = {};

            if ('ontouchstart' in window){
                    
                    var isUp = false;
                    var isDown = false;
                    var isLeft = false;
                    var isRight = false;

                    var joystickStartX, joystickStartY;
                    var joystickIndex = -1;

                    elem.addEventListener('touchstart', function(evt){
                        for (var i = 0; i < evt.changedTouches.length; i++) {
                            var touch = evt.changedTouches[i];
                            if (touch.pageX < (window.innerWidth/4)){
                                
                                joystickIndex = touch.identifier;
                                joystickStartX = touch.pageX;
                                joystickStartY = touch.pageY;
                            } else {
                                this.tapCallback()
                            }
                        }
                    }.bind(this))

                    elem.addEventListener('touchmove', function(evt){
                        for (var i = 0; i < evt.changedTouches.length; i++) {
                            var touch = evt.changedTouches[i];
                            if (touch.identifier==joystickIndex){
                                var deltaX = joystickStartX - touch.pageX;
                                var deltaY = joystickStartY - touch.pageY;
                                if (deltaY>12){
                                    if (!isUp){
                                        this.keyDownCallback({keyCode: KEYCODES['up']});
                                        isUp = true;
                                    }
                                } else {
                                    if (isUp){
                                        isUp = false;
                                        this.keyUpCallback({keyCode: KEYCODES['up']});
                                    }
                                    
                                }

                                if (deltaY<-12){
                                    if (!isDown){
                                        this.keyDownCallback({keyCode: KEYCODES['down']});
                                        isDown = true;
                                    }
                                } else {
                                    if (isDown){
                                        isDown = false;
                                        this.keyUpCallback({keyCode: KEYCODES['down']});
                                    }
                                    
                                }

                                if (deltaX<-12){
                                    if (!isRight){
                                        this.keyDownCallback({keyCode: KEYCODES['right']});
                                        isRight = true;
                                    }
                                } else {
                                    if (isRight){
                                        isRight = false;
                                        this.keyUpCallback({keyCode: KEYCODES['right']});
                                    }
                                    
                                }

                                if (deltaX>12){
                                    if (!isLeft){
                                        this.keyDownCallback({keyCode: KEYCODES['left']});
                                        isLeft = true;
                                    }
                                } else {
                                    if (isLeft){
                                        isLeft = false;
                                        this.keyUpCallback({keyCode: KEYCODES['left']});
                                    }
                                    
                                }
                            }
                        }
                    }.bind(this))

                    elem.addEventListener('touchend', function(evt){
                        for (var i = evt.changedTouches.length - 1; i >= 0; i--) {
                            var touch = evt.changedTouches[i];
                            if (touch.identifier==joystickIndex){

                                if (isUp){
                                    isUp=false;
                                    this.keyUpCallback({keyCode: KEYCODES['up']});
                                }
                                if (isDown){
                                    isDown=false;
                                    this.keyUpCallback({keyCode: KEYCODES['down']});
                                }
                                if (isRight){
                                    isRight=false;
                                    this.keyUpCallback({keyCode: KEYCODES['right']});
                                }
                                if (isLeft){
                                    isLeft=false;
                                    this.keyUpCallback({keyCode: KEYCODES['left']});
                                }
                                joystickIndex=-1;
                            
                            }
                        }
                    }.bind(this))
                        
                        
            } 
            if ('onkeydown' in window) {
                window.onkeydown = this.keyDownCallback.bind(this);
                window.onkeyup = this.keyUpCallback.bind(this);
            }
            //
        },
        tapCallback : function(e){
            this._events.push('tap');
            this.keyDownCallback({keyCode: 32});
            setTimeout(function(){
                this.keyUpCallback({keyCode: 32});
            }.bind(this), 100)
        },
        keyDownCallback : function(e){
            //console.log('keydown:' + REVERSE_KEYCODES[e.keyCode]);
            if (!this._isKeyDown[e.keyCode]){
                this._isNewKeyDown[e.keyCode] = true;
            }
        },
        keyUpCallback : function(e){
            //console.log('keyup:' + REVERSE_KEYCODES[e.keyCode]);
            delete this._isNewKeyDown[e.keyCode];
            this._isKeyDown[e.keyCode] = undefined;
        },
        isPressed : function(keyCode){
            return (this._isKeyPress[KEYCODES[keyCode]] === true);
        },
        isDown : function(keyCode){
            return (this._isKeyDown[KEYCODES[keyCode]] === true);
        },
        tick : function(delta){
           this._isKeyPress = {};
           keys = Object.keys(this._isNewKeyDown);
           
           for (var i = keys.length - 1; i >= 0; i--) {
                var keyCode = keys[i];
                this._isKeyDown[keyCode] = true;
                this._isKeyPress[keyCode] = true;
                delete this._isNewKeyDown[keyCode];
                this.trigger('keydown:' + REVERSE_KEYCODES[keyCode])
           }

           for (var j = this._events.length - 1; j >= 0; j--) {
               this.trigger(this._events[j]);
           }
           this._events = [];
        },
        createProxy: function(){
            var proxy = new InputProxy(this);
            this._proxies.push(proxy);
            return proxy;
        },
        trigger: function(){
            var args = Array.prototype.slice.call(arguments);
            this._super.apply(this, args);
            var proxies = this._proxies.filter(function(p){return p.enable});
            for (var i = proxies.length - 1; i >= 0; i--) {
                proxies[i].trigger.apply(proxies[i], args);
            };
        },
    });

    return Input
})
;
define('sge/game',[
		'./class',
		'./input'
	], 
	function(Class, Input){
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

				this._nextState = null;
				this._states = {};
				this._stateClassMap = {};
				this._currentState = null;
				this.renderer = PIXI.autoDetectRenderer(this.width, this.height, canvas);
				this.input = new Input(canvas);
			},
			start: function(data){
				this.data = data || {};
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
				this.input.tick(delta);
				this.tick(delta/1000);
			},

			tick: function(delta){
				if (this._currentState){
					this._currentState.tick(delta);
				}
				if (this._nextState!=null){
					this._changeState(this._nextState);
					this._nextState=null;
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
				this._nextState = name;
			},

			_changeState: function(name){
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
);
define('sge/gamestate',[
		'./class'
	], 
	function(Class){

		var GameState =  Class.extend({
			init: function(game, options){
				this.game = game;
				this._time = 0;
				this.input = game.input.createProxy();
			},
			startState: function(){},
			endState: function(){},
			tick: function(delta){
			    this._time += delta;
			},
		    getTime: function(){
		        return this._time;
		    }
		});



		return GameState;
	}
);
/** @license MIT License (c) copyright 2011-2013 original author or authors */

/**
 * A lightweight CommonJS Promises/A and when() implementation
 * when is part of the cujo.js family of libraries (http://cujojs.com/)
 *
 * Licensed under the MIT License at:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * @author Brian Cavalier
 * @author John Hann
 * @version 2.4.0
 */
(function(define, global) { 
define('sge/when',['require'],function (require) {

	// Public API

	when.promise   = promise;    // Create a pending promise
	when.resolve   = resolve;    // Create a resolved promise
	when.reject    = reject;     // Create a rejected promise
	when.defer     = defer;      // Create a {promise, resolver} pair

	when.join      = join;       // Join 2 or more promises

	when.all       = all;        // Resolve a list of promises
	when.map       = map;        // Array.map() for promises
	when.reduce    = reduce;     // Array.reduce() for promises
	when.settle    = settle;     // Settle a list of promises

	when.any       = any;        // One-winner race
	when.some      = some;       // Multi-winner race

	when.isPromise = isPromiseLike;  // DEPRECATED: use isPromiseLike
	when.isPromiseLike = isPromiseLike; // Is something promise-like, aka thenable

	/**
	 * Register an observer for a promise or immediate value.
	 *
	 * @param {*} promiseOrValue
	 * @param {function?} [onFulfilled] callback to be called when promiseOrValue is
	 *   successfully fulfilled.  If promiseOrValue is an immediate value, callback
	 *   will be invoked immediately.
	 * @param {function?} [onRejected] callback to be called when promiseOrValue is
	 *   rejected.
	 * @param {function?} [onProgress] callback to be called when progress updates
	 *   are issued for promiseOrValue.
	 * @returns {Promise} a new {@link Promise} that will complete with the return
	 *   value of callback or errback or the completion value of promiseOrValue if
	 *   callback and/or errback is not supplied.
	 */
	function when(promiseOrValue, onFulfilled, onRejected, onProgress) {
		// Get a trusted promise for the input promiseOrValue, and then
		// register promise handlers
		return resolve(promiseOrValue).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Trusted Promise constructor.  A Promise created from this constructor is
	 * a trusted when.js promise.  Any other duck-typed promise is considered
	 * untrusted.
	 * @constructor
	 * @param {function} sendMessage function to deliver messages to the promise's handler
	 * @param {function?} inspect function that reports the promise's state
	 * @name Promise
	 */
	function Promise(sendMessage, inspect) {
		this._message = sendMessage;
		this.inspect = inspect;
	}

	Promise.prototype = {
		/**
		 * Register handlers for this promise.
		 * @param [onFulfilled] {Function} fulfillment handler
		 * @param [onRejected] {Function} rejection handler
		 * @param [onProgress] {Function} progress handler
		 * @return {Promise} new Promise
		 */
		then: function(onFulfilled, onRejected, onProgress) {
			/*jshint unused:false*/
			var args, sendMessage;

			args = arguments;
			sendMessage = this._message;

			return _promise(function(resolve, reject, notify) {
				sendMessage('when', args, resolve, notify);
			}, this._status && this._status.observed());
		},

		/**
		 * Register a rejection handler.  Shortcut for .then(undefined, onRejected)
		 * @param {function?} onRejected
		 * @return {Promise}
		 */
		otherwise: function(onRejected) {
			return this.then(undef, onRejected);
		},

		/**
		 * Ensures that onFulfilledOrRejected will be called regardless of whether
		 * this promise is fulfilled or rejected.  onFulfilledOrRejected WILL NOT
		 * receive the promises' value or reason.  Any returned value will be disregarded.
		 * onFulfilledOrRejected may throw or return a rejected promise to signal
		 * an additional error.
		 * @param {function} onFulfilledOrRejected handler to be called regardless of
		 *  fulfillment or rejection
		 * @returns {Promise}
		 */
		ensure: function(onFulfilledOrRejected) {
			return this.then(injectHandler, injectHandler)['yield'](this);

			function injectHandler() {
				return resolve(onFulfilledOrRejected());
			}
		},

		/**
		 * Shortcut for .then(function() { return value; })
		 * @param  {*} value
		 * @return {Promise} a promise that:
		 *  - is fulfilled if value is not a promise, or
		 *  - if value is a promise, will fulfill with its value, or reject
		 *    with its reason.
		 */
		'yield': function(value) {
			return this.then(function() {
				return value;
			});
		},

		/**
		 * Runs a side effect when this promise fulfills, without changing the
		 * fulfillment value.
		 * @param {function} onFulfilledSideEffect
		 * @returns {Promise}
		 */
		tap: function(onFulfilledSideEffect) {
			return this.then(onFulfilledSideEffect)['yield'](this);
		},

		/**
		 * Assumes that this promise will fulfill with an array, and arranges
		 * for the onFulfilled to be called with the array as its argument list
		 * i.e. onFulfilled.apply(undefined, array).
		 * @param {function} onFulfilled function to receive spread arguments
		 * @return {Promise}
		 */
		spread: function(onFulfilled) {
			return this.then(function(array) {
				// array may contain promises, so resolve its contents.
				return all(array, function(array) {
					return onFulfilled.apply(undef, array);
				});
			});
		},

		/**
		 * Shortcut for .then(onFulfilledOrRejected, onFulfilledOrRejected)
		 * @deprecated
		 */
		always: function(onFulfilledOrRejected, onProgress) {
			return this.then(onFulfilledOrRejected, onFulfilledOrRejected, onProgress);
		}
	};

	/**
	 * Returns a resolved promise. The returned promise will be
	 *  - fulfilled with promiseOrValue if it is a value, or
	 *  - if promiseOrValue is a promise
	 *    - fulfilled with promiseOrValue's value after it is fulfilled
	 *    - rejected with promiseOrValue's reason after it is rejected
	 * @param  {*} value
	 * @return {Promise}
	 */
	function resolve(value) {
		return promise(function(resolve) {
			resolve(value);
		});
	}

	/**
	 * Returns a rejected promise for the supplied promiseOrValue.  The returned
	 * promise will be rejected with:
	 * - promiseOrValue, if it is a value, or
	 * - if promiseOrValue is a promise
	 *   - promiseOrValue's value after it is fulfilled
	 *   - promiseOrValue's reason after it is rejected
	 * @param {*} promiseOrValue the rejected value of the returned {@link Promise}
	 * @return {Promise} rejected {@link Promise}
	 */
	function reject(promiseOrValue) {
		return when(promiseOrValue, rejected);
	}

	/**
	 * Creates a {promise, resolver} pair, either or both of which
	 * may be given out safely to consumers.
	 * The resolver has resolve, reject, and progress.  The promise
	 * has then plus extended promise API.
	 *
	 * @return {{
	 * promise: Promise,
	 * resolve: function:Promise,
	 * reject: function:Promise,
	 * notify: function:Promise
	 * resolver: {
	 *	resolve: function:Promise,
	 *	reject: function:Promise,
	 *	notify: function:Promise
	 * }}}
	 */
	function defer() {
		var deferred, pending, resolved;

		// Optimize object shape
		deferred = {
			promise: undef, resolve: undef, reject: undef, notify: undef,
			resolver: { resolve: undef, reject: undef, notify: undef }
		};

		deferred.promise = pending = promise(makeDeferred);

		return deferred;

		function makeDeferred(resolvePending, rejectPending, notifyPending) {
			deferred.resolve = deferred.resolver.resolve = function(value) {
				if(resolved) {
					return resolve(value);
				}
				resolved = true;
				resolvePending(value);
				return pending;
			};

			deferred.reject  = deferred.resolver.reject  = function(reason) {
				if(resolved) {
					return resolve(rejected(reason));
				}
				resolved = true;
				rejectPending(reason);
				return pending;
			};

			deferred.notify  = deferred.resolver.notify  = function(update) {
				notifyPending(update);
				return update;
			};
		}
	}

	/**
	 * Creates a new promise whose fate is determined by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @returns {Promise} promise whose fate is determine by resolver
	 */
	function promise(resolver) {
		return _promise(resolver, monitorApi.PromiseStatus && monitorApi.PromiseStatus());
	}

	/**
	 * Creates a new promise, linked to parent, whose fate is determined
	 * by resolver.
	 * @param {function} resolver function(resolve, reject, notify)
	 * @param {Promise?} status promise from which the new promise is begotten
	 * @returns {Promise} promise whose fate is determine by resolver
	 * @private
	 */
	function _promise(resolver, status) {
		var self, value, consumers = [];

		self = new Promise(_message, inspect);
		self._status = status;

		// Call the provider resolver to seal the promise's fate
		try {
			resolver(promiseResolve, promiseReject, promiseNotify);
		} catch(e) {
			promiseReject(e);
		}

		// Return the promise
		return self;

		/**
		 * Private message delivery. Queues and delivers messages to
		 * the promise's ultimate fulfillment value or rejection reason.
		 * @private
		 * @param {String} type
		 * @param {Array} args
		 * @param {Function} resolve
		 * @param {Function} notify
		 */
		function _message(type, args, resolve, notify) {
			consumers ? consumers.push(deliver) : enqueue(function() { deliver(value); });

			function deliver(p) {
				p._message(type, args, resolve, notify);
			}
		}

		/**
		 * Returns a snapshot of the promise's state at the instant inspect()
		 * is called. The returned object is not live and will not update as
		 * the promise's state changes.
		 * @returns {{ state:String, value?:*, reason?:* }} status snapshot
		 *  of the promise.
		 */
		function inspect() {
			return value ? value.inspect() : toPendingState();
		}

		/**
		 * Transition from pre-resolution state to post-resolution state, notifying
		 * all listeners of the ultimate fulfillment or rejection
		 * @param {*|Promise} val resolution value
		 */
		function promiseResolve(val) {
			if(!consumers) {
				return;
			}

			value = coerce(val);
			scheduleConsumers(consumers, value);
			consumers = undef;

			if(status) {
				updateStatus(value, status);
			}
		}

		/**
		 * Reject this promise with the supplied reason, which will be used verbatim.
		 * @param {*} reason reason for the rejection
		 */
		function promiseReject(reason) {
			promiseResolve(rejected(reason));
		}

		/**
		 * Issue a progress event, notifying all progress listeners
		 * @param {*} update progress event payload to pass to all listeners
		 */
		function promiseNotify(update) {
			if(consumers) {
				scheduleConsumers(consumers, progressed(update));
			}
		}
	}

	/**
	 * Creates a fulfilled, local promise as a proxy for a value
	 * NOTE: must never be exposed
	 * @param {*} value fulfillment value
	 * @returns {Promise}
	 */
	function fulfilled(value) {
		return near(
			new NearFulfilledProxy(value),
			function() { return toFulfilledState(value); }
		);
	}

	/**
	 * Creates a rejected, local promise with the supplied reason
	 * NOTE: must never be exposed
	 * @param {*} reason rejection reason
	 * @returns {Promise}
	 */
	function rejected(reason) {
		return near(
			new NearRejectedProxy(reason),
			function() { return toRejectedState(reason); }
		);
	}

	/**
	 * Creates a near promise using the provided proxy
	 * NOTE: must never be exposed
	 * @param {object} proxy proxy for the promise's ultimate value or reason
	 * @param {function} inspect function that returns a snapshot of the
	 *  returned near promise's state
	 * @returns {Promise}
	 */
	function near(proxy, inspect) {
		return new Promise(function (type, args, resolve) {
			try {
				resolve(proxy[type].apply(proxy, args));
			} catch(e) {
				resolve(rejected(e));
			}
		}, inspect);
	}

	/**
	 * Create a progress promise with the supplied update.
	 * @private
	 * @param {*} update
	 * @return {Promise} progress promise
	 */
	function progressed(update) {
		return new Promise(function (type, args, _, notify) {
			var onProgress = args[2];
			try {
				notify(typeof onProgress === 'function' ? onProgress(update) : update);
			} catch(e) {
				notify(e);
			}
		});
	}

	/**
	 * Coerces x to a trusted Promise
	 *
	 * @private
	 * @param {*} x thing to coerce
	 * @returns {*} Guaranteed to return a trusted Promise.  If x
	 *   is trusted, returns x, otherwise, returns a new, trusted, already-resolved
	 *   Promise whose resolution value is:
	 *   * the resolution value of x if it's a foreign promise, or
	 *   * x if it's a value
	 */
	function coerce(x) {
		if (x instanceof Promise) {
			return x;
		}

		if (!(x === Object(x) && 'then' in x)) {
			return fulfilled(x);
		}

		return promise(function(resolve, reject, notify) {
			enqueue(function() {
				try {
					// We must check and assimilate in the same tick, but not the
					// current tick, careful only to access promiseOrValue.then once.
					var untrustedThen = x.then;

					if(typeof untrustedThen === 'function') {
						fcall(untrustedThen, x, resolve, reject, notify);
					} else {
						// It's a value, create a fulfilled wrapper
						resolve(fulfilled(x));
					}

				} catch(e) {
					// Something went wrong, reject
					reject(e);
				}
			});
		});
	}

	/**
	 * Proxy for a near, fulfilled value
	 * @param {*} value
	 * @constructor
	 */
	function NearFulfilledProxy(value) {
		this.value = value;
	}

	NearFulfilledProxy.prototype.when = function(onResult) {
		return typeof onResult === 'function' ? onResult(this.value) : this.value;
	};

	/**
	 * Proxy for a near rejection
	 * @param {*} reason
	 * @constructor
	 */
	function NearRejectedProxy(reason) {
		this.reason = reason;
	}

	NearRejectedProxy.prototype.when = function(_, onError) {
		if(typeof onError === 'function') {
			return onError(this.reason);
		} else {
			throw this.reason;
		}
	};

	/**
	 * Schedule a task that will process a list of handlers
	 * in the next queue drain run.
	 * @private
	 * @param {Array} handlers queue of handlers to execute
	 * @param {*} value passed as the only arg to each handler
	 */
	function scheduleConsumers(handlers, value) {
		enqueue(function() {
			var handler, i = 0;
			while (handler = handlers[i++]) {
				handler(value);
			}
		});
	}

	function updateStatus(value, status) {
		value.then(statusFulfilled, statusRejected);

		function statusFulfilled() { status.fulfilled(); }
		function statusRejected(r) { status.rejected(r); }
	}

	/**
	 * Determines if x is promise-like, i.e. a thenable object
	 * NOTE: Will return true for *any thenable object*, and isn't truly
	 * safe, since it may attempt to access the `then` property of x (i.e.
	 *  clever/malicious getters may do weird things)
	 * @param {*} x anything
	 * @returns {boolean} true if x is promise-like
	 */
	function isPromiseLike(x) {
		return x && typeof x.then === 'function';
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * howMany of the supplied promisesOrValues have resolved, or will reject when
	 * it becomes impossible for howMany to resolve, for example, when
	 * (promisesOrValues.length - howMany) + 1 input promises reject.
	 *
	 * @param {Array} promisesOrValues array of anything, may contain a mix
	 *      of promises and values
	 * @param howMany {number} number of promisesOrValues to resolve
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to an array of howMany values that
	 *  resolved first, or will reject with an array of
	 *  (promisesOrValues.length - howMany) + 1 rejection reasons.
	 */
	function some(promisesOrValues, howMany, onFulfilled, onRejected, onProgress) {

		return when(promisesOrValues, function(promisesOrValues) {

			return promise(resolveSome).then(onFulfilled, onRejected, onProgress);

			function resolveSome(resolve, reject, notify) {
				var toResolve, toReject, values, reasons, fulfillOne, rejectOne, len, i;

				len = promisesOrValues.length >>> 0;

				toResolve = Math.max(0, Math.min(howMany, len));
				values = [];

				toReject = (len - toResolve) + 1;
				reasons = [];

				// No items in the input, resolve immediately
				if (!toResolve) {
					resolve(values);

				} else {
					rejectOne = function(reason) {
						reasons.push(reason);
						if(!--toReject) {
							fulfillOne = rejectOne = identity;
							reject(reasons);
						}
					};

					fulfillOne = function(val) {
						// This orders the values based on promise resolution order
						values.push(val);
						if (!--toResolve) {
							fulfillOne = rejectOne = identity;
							resolve(values);
						}
					};

					for(i = 0; i < len; ++i) {
						if(i in promisesOrValues) {
							when(promisesOrValues[i], fulfiller, rejecter, notify);
						}
					}
				}

				function rejecter(reason) {
					rejectOne(reason);
				}

				function fulfiller(val) {
					fulfillOne(val);
				}
			}
		});
	}

	/**
	 * Initiates a competitive race, returning a promise that will resolve when
	 * any one of the supplied promisesOrValues has resolved or will reject when
	 * *all* promisesOrValues have rejected.
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise} promise that will resolve to the value that resolved first, or
	 * will reject with an array of all rejected inputs.
	 */
	function any(promisesOrValues, onFulfilled, onRejected, onProgress) {

		function unwrapSingleResult(val) {
			return onFulfilled ? onFulfilled(val[0]) : val[0];
		}

		return some(promisesOrValues, 1, unwrapSingleResult, onRejected, onProgress);
	}

	/**
	 * Return a promise that will resolve only once all the supplied promisesOrValues
	 * have resolved. The resolution value of the returned promise will be an array
	 * containing the resolution values of each of the promisesOrValues.
	 * @memberOf when
	 *
	 * @param {Array|Promise} promisesOrValues array of anything, may contain a mix
	 *      of {@link Promise}s and values
	 * @param {function?} [onFulfilled] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onRejected] DEPRECATED, use returnedPromise.then()
	 * @param {function?} [onProgress] DEPRECATED, use returnedPromise.then()
	 * @returns {Promise}
	 */
	function all(promisesOrValues, onFulfilled, onRejected, onProgress) {
		return _map(promisesOrValues, identity).then(onFulfilled, onRejected, onProgress);
	}

	/**
	 * Joins multiple promises into a single returned promise.
	 * @return {Promise} a promise that will fulfill when *all* the input promises
	 * have fulfilled, or will reject when *any one* of the input promises rejects.
	 */
	function join(/* ...promises */) {
		return _map(arguments, identity);
	}

	/**
	 * Settles all input promises such that they are guaranteed not to
	 * be pending once the returned promise fulfills. The returned promise
	 * will always fulfill, except in the case where `array` is a promise
	 * that rejects.
	 * @param {Array|Promise} array or promise for array of promises to settle
	 * @returns {Promise} promise that always fulfills with an array of
	 *  outcome snapshots for each input promise.
	 */
	function settle(array) {
		return _map(array, toFulfilledState, toRejectedState);
	}

	/**
	 * Promise-aware array map function, similar to `Array.prototype.map()`,
	 * but input array may contain promises or values.
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function map(array, mapFunc) {
		return _map(array, mapFunc);
	}

	/**
	 * Internal map that allows a fallback to handle rejections
	 * @param {Array|Promise} array array of anything, may contain promises and values
	 * @param {function} mapFunc map function which may return a promise or value
	 * @param {function?} fallback function to handle rejected promises
	 * @returns {Promise} promise that will fulfill with an array of mapped values
	 *  or reject if any input promise rejects.
	 */
	function _map(array, mapFunc, fallback) {
		return when(array, function(array) {

			return _promise(resolveMap);

			function resolveMap(resolve, reject, notify) {
				var results, len, toResolve, i;

				// Since we know the resulting length, we can preallocate the results
				// array to avoid array expansions.
				toResolve = len = array.length >>> 0;
				results = [];

				if(!toResolve) {
					resolve(results);
					return;
				}

				// Since mapFunc may be async, get all invocations of it into flight
				for(i = 0; i < len; i++) {
					if(i in array) {
						resolveOne(array[i], i);
					} else {
						--toResolve;
					}
				}

				function resolveOne(item, i) {
					when(item, mapFunc, fallback).then(function(mapped) {
						results[i] = mapped;
						notify(mapped);

						if(!--toResolve) {
							resolve(results);
						}
					}, reject);
				}
			}
		});
	}

	/**
	 * Traditional reduce function, similar to `Array.prototype.reduce()`, but
	 * input may contain promises and/or values, and reduceFunc
	 * may return either a value or a promise, *and* initialValue may
	 * be a promise for the starting value.
	 *
	 * @param {Array|Promise} promise array or promise for an array of anything,
	 *      may contain a mix of promises and values.
	 * @param {function} reduceFunc reduce function reduce(currentValue, nextValue, index, total),
	 *      where total is the total number of items being reduced, and will be the same
	 *      in each call to reduceFunc.
	 * @returns {Promise} that will resolve to the final reduced value
	 */
	function reduce(promise, reduceFunc /*, initialValue */) {
		var args = fcall(slice, arguments, 1);

		return when(promise, function(array) {
			var total;

			total = array.length;

			// Wrap the supplied reduceFunc with one that handles promises and then
			// delegates to the supplied.
			args[0] = function (current, val, i) {
				return when(current, function (c) {
					return when(val, function (value) {
						return reduceFunc(c, value, i, total);
					});
				});
			};

			return reduceArray.apply(array, args);
		});
	}

	// Snapshot states

	/**
	 * Creates a fulfilled state snapshot
	 * @private
	 * @param {*} x any value
	 * @returns {{state:'fulfilled',value:*}}
	 */
	function toFulfilledState(x) {
		return { state: 'fulfilled', value: x };
	}

	/**
	 * Creates a rejected state snapshot
	 * @private
	 * @param {*} x any reason
	 * @returns {{state:'rejected',reason:*}}
	 */
	function toRejectedState(x) {
		return { state: 'rejected', reason: x };
	}

	/**
	 * Creates a pending state snapshot
	 * @private
	 * @returns {{state:'pending'}}
	 */
	function toPendingState() {
		return { state: 'pending' };
	}

	//
	// Internals, utilities, etc.
	//

	var reduceArray, slice, fcall, nextTick, handlerQueue,
		setTimeout, funcProto, call, arrayProto, monitorApi,
		cjsRequire, undef;

	cjsRequire = require;

	//
	// Shared handler queue processing
	//
	// Credit to Twisol (https://github.com/Twisol) for suggesting
	// this type of extensible queue + trampoline approach for
	// next-tick conflation.

	handlerQueue = [];

	/**
	 * Enqueue a task. If the queue is not currently scheduled to be
	 * drained, schedule it.
	 * @param {function} task
	 */
	function enqueue(task) {
		if(handlerQueue.push(task) === 1) {
			nextTick(drainQueue);
		}
	}

	/**
	 * Drain the handler queue entirely, being careful to allow the
	 * queue to be extended while it is being processed, and to continue
	 * processing until it is truly empty.
	 */
	function drainQueue() {
		var task, i = 0;

		while(task = handlerQueue[i++]) {
			task();
		}

		handlerQueue = [];
	}

	// capture setTimeout to avoid being caught by fake timers
	// used in time based tests
	setTimeout = global.setTimeout;

	// Allow attaching the monitor to when() if env has no console
	monitorApi = typeof console != 'undefined' ? console : when;

	// Prefer setImmediate or MessageChannel, cascade to node,
	// vertx and finally setTimeout
	/*global setImmediate,MessageChannel,process*/
	if (typeof setImmediate === 'function') {
		nextTick = setImmediate.bind(global);
	} else if(typeof MessageChannel !== 'undefined') {
		var channel = new MessageChannel();
		channel.port1.onmessage = drainQueue;
		nextTick = function() { channel.port2.postMessage(0); };
	} else if (typeof process === 'object' && process.nextTick) {
		nextTick = process.nextTick;
	} else {
		try {
			// vert.x 1.x || 2.x
			nextTick = cjsRequire('vertx').runOnLoop || cjsRequire('vertx').runOnContext;
		} catch(ignore) {
			nextTick = function(t) { setTimeout(t, 0); };
		}
	}

	//
	// Capture/polyfill function and array utils
	//

	// Safe function calls
	funcProto = Function.prototype;
	call = funcProto.call;
	fcall = funcProto.bind
		? call.bind(call)
		: function(f, context) {
			return f.apply(context, slice.call(arguments, 2));
		};

	// Safe array ops
	arrayProto = [];
	slice = arrayProto.slice;

	// ES5 reduce implementation if native not available
	// See: http://es5.github.com/#x15.4.4.21 as there are many
	// specifics and edge cases.  ES5 dictates that reduce.length === 1
	// This implementation deviates from ES5 spec in the following ways:
	// 1. It does not check if reduceFunc is a Callable
	reduceArray = arrayProto.reduce ||
		function(reduceFunc /*, initialValue */) {
			/*jshint maxcomplexity: 7*/
			var arr, args, reduced, len, i;

			i = 0;
			arr = Object(this);
			len = arr.length >>> 0;
			args = arguments;

			// If no initialValue, use first item of array (we know length !== 0 here)
			// and adjust i to start at second item
			if(args.length <= 1) {
				// Skip to the first real element in the array
				for(;;) {
					if(i in arr) {
						reduced = arr[i++];
						break;
					}

					// If we reached the end of the array without finding any real
					// elements, it's a TypeError
					if(++i >= len) {
						throw new TypeError();
					}
				}
			} else {
				// If initialValue provided, use it
				reduced = args[1];
			}

			// Do the actual reduce
			for(;i < len; ++i) {
				if(i in arr) {
					reduced = reduceFunc(reduced, arr[i], i, arr);
				}
			}

			return reduced;
		};

	function identity(x) {
		return x;
	}

	return when;
});
})(typeof define === 'function' && define.amd ? define : function (factory) { module.exports = factory(require); }, this);

define('sge/loader',[
        './class',
        './when'
    ], function(Class, when){
        var ajax = function(url, callback, failure){
            var xmlHttp = new XMLHttpRequest();
            xmlHttp.open('get', url, true);
            xmlHttp.send(null);
            xmlHttp.onreadystatechange = function() {
                if (xmlHttp.readyState === 4) {
                    if (xmlHttp.status === 200) {
                        callback(xmlHttp.responseText, xmlHttp);
                    } else {
                        failure(xmlHttp);
                    }
                } else {
                  //still loading
                }
            }
        }



        var Loader = Class.extend({
            init: function(){
                this._hasAudio = false;
                if (createjs.Sound.initializeDefaultPlugins()) {

                    //createjs.Sound.registerPlugins([createjs.WebAudioPlugin]);
                    createjs.Sound.addEventListener("fileload", this._loadAudio.bind(this));
                    this._soundPromises = {};
                    console.log('Audio Config')
                    this._hasAudio = true;
                } else {
                    console.log('No Audio')
                }
            },
            loadJSON: function(url){
                var defered = new when.defer();
                ajax(url, function(text){
                    var data = JSON.parse(text);
                    defered.resolve(data);
                }, function(xmlHttp){
                    defered.reject(xmlHttp);
                });
                return defered.promise;
            },
            loadJS: function(url, that, locals) {
                var defered = new when.defer();
                console.log('Src', url)
                ajax(url, function(text){
                    var sandbox = this.createSandbox(text, that, locals);
                    defered.resolve(sandbox);
                }.bind(this), function(xmlHttp){
                    defered.reject(xmlHttp);
                });
                return defered.promise;
            },
            loadFont: function(url){
                var defered = new when.defer();
                var loader = new PIXI.AssetLoader([url]);
                loader.onComplete = function(){
                    defered.resolve();
                }
                loader.load();
                return defered.promise;
            },
            loadTexture: function(url, textureName){
                var defered = new when.defer();
                var tex = new PIXI.ImageLoader(url);
                tex.addEventListener("loaded", function(event){
                    PIXI.TextureCache[textureName] = new PIXI.Texture(tex.texture.baseTexture);
                    defered.resolve(tex);
                });
                tex.load();
                return defered.promise;
            },
            loadSpriteFrames: function(url, textureName, width, height){
                var defered = new when.defer();
                var tex = new PIXI.ImageLoader(url);
                tex.addEventListener("loaded", function(event){
                    var xcount = Math.floor(tex.texture.width/width);
                    var ycount = Math.floor(tex.texture.height/height);
                    var frame = 0;
                    var texture;
                    for (var y=0;y<ycount;y++){
                        for(var x=0;x<xcount;x++){
                            texture = new PIXI.Texture(tex.texture, {x: x*width, y: y*height, width: width, height: height});
                            PIXI.TextureCache[textureName+'-'+frame] = texture;
                            frame++;
                            
                        }
                    }
                    defered.resolve(tex);
                });
                tex.load();
                return defered.promise;
            },
            loadAudio: function(url, id){
                var defered = new when.defer();
                if (this._hasAudio){
                    this._soundPromises[id] = defered;
                    createjs.Sound.registerSound(url, id);
                } else {
                    defered.resolve();
                }
                return defered.promise;
            },
            _loadAudio: function(evt){
                console.log('Event', evt);
                this._soundPromises[evt.id].resolve()
            },
            createSandbox: function(code, that, locals) {
                that = that || Object.create(null);
                locals = locals || {};
                var params = []; // the names of local variables
                var args = []; // the local variables

                for (var param in locals) {
                    if (locals.hasOwnProperty(param)) {
                        args.push(locals[param]);
                        params.push(param);
                    }
                }

                var context = Array.prototype.concat.call(that, params, code); // create the parameter list for the sandbox
                var sandbox = new (Function.prototype.bind.apply(Function, context)); // create the sandbox function
                context = Array.prototype.concat.call(that, args); // create the argument list for the sandbox

                return Function.prototype.bind.apply(sandbox, context); // bind the local variables to the sandbox
            },

        })

        return Loader
    }
);
define('sge/main',[
		'./class',
		'./observable',
		'./game',
		'./gamestate',
		'./loader',
		'./when'
	], function(Class, Observable, Game, GameState, Loader, When){
		return {
			Class : Class,
			Observable : Observable,
			Game : Game,
			GameState : GameState,
			Loader : Loader,
			When : When
		}
	}
);
define('sge', ['sge/main'], function (main) { return main; });

define('subzero/config',[], function(){
	return {
		colors : {
			primaryBright:    '0x0B61A4',
			primaryMid:       '0x25567B',
			primaryDark: 	  '0x033E6B',
			primaryAlt1:      '0x3F92D2',
			primaryAlt2:      '0x66A3D2', 
			complementBright: '0xFF9200',
			complementMid:    '0xBF8230',
			complementDark:   '0xA65F00',
			complementAlt1:   '0xFFAD40',
			complementAlt2:   '0xFFC373'
		}
	}
});
define('subzero/tilemap',[
		'sge'
	], function(sge){
		var Tile = sge.Class.extend({
			init: function(){
				this.layers = {};
				this.data = {};
			}
		});

		var TileMap = sge.Class.extend({
			init: function(width, height, renderer){
				this.renderer = renderer;
				this.width = width;
				this.height = height;
				this.tileSize = 32;
				this._tileTextures = [];

				this.tiles = [];
				this._chunkSize = 1024;
				this.chunk = {};
				this.chunkBase = {};
				this.chunkCanopy = {};
				this._ready = false;
				this.container = new PIXI.DisplayObjectContainer();
				this.container.position.x=this.container.position.y=0;

				this.containerBase = new PIXI.DisplayObjectContainer();
				this.containerBase.position.x=this.containerBase.position.y=0;

				this.containerCanopy = new PIXI.DisplayObjectContainer();
				this.containerCanopy.position.x=this.containerCanopy.position.y=0;

				this.maskBase = new PIXI.Graphics();
				this.maskBase.beginFill();

				this.maskCanopy = new PIXI.Graphics();
				this.maskCanopy.beginFill();

				for (var i = (width * height) -1; i >= 0; i--) {
					var tile = new Tile();
					tile.layers.base = 0;
					this.tiles.push(tile);
				};
			},
	        getIndex : function(x, y){
	            var index = (y * this.width) + x;
	            if (x > this.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getTile : function(x, y){
	            return this.tiles[this.getIndex(x, y)] || null;
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
	        getTiles: function(){
	        	return this.tiles.slice(0);
	        },
			render: function(){
				if (!this._ready){
					return
				}
				var pixelWidth = this.width * this.tileSize;
				var pixelHeight = this.height * this.tileSize;
				var chunks = [Math.ceil(pixelWidth/this._chunkSize),Math.ceil(pixelHeight/this._chunkSize)];
				var startX = -this.container.position.x;
				var startY = -this.container.position.y;
				var endX = startX + this.renderer.width;
				var endY = startY + this.renderer.height;
				var scx = Math.floor(startX/this._chunkSize);
				var sex = Math.ceil(endX/this._chunkSize);
				var scy = Math.floor(startY/this._chunkSize);
				var sey = Math.ceil(endY/this._chunkSize);
				for (var x=0; x<chunks[0]; x++){
					for (var y=0; y<chunks[1]; y++){
						if ((x>=scx) && (x<= sex) &&  y>= scy && y<=sey){
							if (this.container.children.indexOf(this.chunk[x+'.'+y])<0){
								this.container.addChild(this.chunk[x+'.'+y]);
							}
						} else {
							if (this.container.children.indexOf(this.chunk[x+'.'+y])>=0){
								this.container.removeChild(this.chunk[x+'.'+y])
							}
						}
					}
				}
			},
			preRender : function(){
				var pixelWidth = this.width * this.tileSize;
				var pixelHeight = this.height * this.tileSize;
				var chunks = [Math.ceil(pixelWidth/this._chunkSize),Math.ceil(pixelHeight/this._chunkSize)];
				
				for (var x=0; x<chunks[0]; x++){
					for (var y=0; y<chunks[1]; y++){
						this.preRenderChunk(x, y);
					}
				}

				this._ready = true;
				this.render();

			},
			preRenderChunk: function(cx, cy){

				var startX = cx * this._chunkSize;
				var startY = cy * this._chunkSize;
				var endX = Math.min((cx + 1) * (this._chunkSize), this.width * this.tileSize);
				var endY = Math.min((cy + 1) * (this._chunkSize), this.height * this.tileSize);

				var chunkStartX = Math.floor(startX / this.tileSize);
				var chunkStartY = Math.floor(startY / this.tileSize);

				var chunkEndX = Math.ceil(endX / this.tileSize);
				var chunkEndY = Math.ceil(endY / this.tileSize);

				var chunk = new PIXI.DisplayObjectContainer();


				for (var x=chunkStartX; x<chunkEndX; x++){
					for (var y=chunkStartY; y<chunkEndY; y++){
						var tile = this.getTile(x, y);
						if (tile){
							if (tile.layers.base!==undefined){
								var sprite = new PIXI.Sprite(this._tileTextures[tile.layers.base]);

								sprite.position.x = (x*this.tileSize) - startX;
								sprite.position.y = (y*this.tileSize) - startY;
								chunk.addChild(sprite);
							}
							name='layer0'
							if (tile.layers[name]!==undefined){
								var sprite = new PIXI.Sprite(this._tileTextures[tile.layers[name]]);
								sprite.position.x = (x*this.tileSize) - startX;
								sprite.position.y = (y*this.tileSize) - startY;
								chunk.addChild(sprite);
							} else {
								this.maskBase.drawRect(x*this.tileSize,y*this.tileSize,this.tileSize,this.tileSize);
							}

							if (!tile.layers.canopy){
								this.maskCanopy.drawRect(x*this.tileSize,y*this.tileSize,this.tileSize,this.tileSize);
							}
						}
					}
				}

				// render the tilemap to a render texture
				var texture = new PIXI.RenderTexture(endX-startX, endY-startY);
				texture.render(chunk);
				// create a single background sprite with the texture
				var background = new PIXI.Sprite(texture, {x: 0, y: 0, width: this._chunkSize, heigh:this._chunkSize});
				background.position.x = cx * this._chunkSize;
				background.position.y = cy * this._chunkSize;
				this.chunk[cx+'.'+cy] = chunk;
			}

		});

		return TileMap;
	}
);
define('subzero/tiledlevel',[
		'sge'
	], function(sge){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };
        
		var TiledLevel = function(state, map, levelData){
			var defered = new sge.When.defer();
			var tileset = new PIXI.ImageLoader('content/tiles/base_tiles.png', false);
			tileset.addEventListener("loaded", function(event){

				var layerData = {};

				levelData.layers.forEach(function(layer){
					layerData[layer.name] = layer;
					if (layer.type=='tilelayer'){
						var layerName = layer.name;
						var xTileCount = levelData.tilesets[0].imagewidth / levelData.tilesets[0].tilewidth;
						var yTileCount = levelData.tilesets[0].imageheight / levelData.tilesets[0].tileheight;
						for (var i = 0; i < (xTileCount * yTileCount); i++) {
							var tex = new PIXI.Texture(tileset.texture.baseTexture, {x: (i % xTileCount) * 32 , y: Math.floor(i / xTileCount) * 32, width:32, height: 32});
							map._tileTextures.push(tex);
						};
						for (var i = layer.data.length - 1; i >= 0; i--) {
							var tileIdx = layer.data[i]-1;
							if (layerName=='terrain'){
								map.tiles[i].data.passable = (tileIdx<0)
							} else {
								if (tileIdx>=0){
									map.tiles[i].layers[layerName] = tileIdx;
								}
							}
						};
					}
				}.bind(this));
				
				var regionLayer = layerData['regions'];
				if (regionLayer){
					for (var i = regionLayer.objects.length - 1; i >= 0; i--) {
						var regionData = regionLayer.objects[i];
						var tx = regionData.x;
						var ty = regionData.y;
						var width = regionData.width;
						var height = regionData.height;

						//Create Region
						
						if (regionData.properties.spawn){
							spawnData = regionData.properties.spawn.split(':');
							var count = parseInt(spawnData[1])
							for (var j=0;j<count;j++){
								var spawnX = tx + (Math.random()*width);
								var spawnY = ty + (Math.random()*height);
								var e= state.factory.create(spawnData[0], {xform: {tx: spawnX, ty: spawnY}});
								state.addEntity(e);
							}
						}



						if (regionData.properties.socialValue){
							socialValue = parseInt(regionData.properties.socialValue);
							var startX = Math.floor(tx/map.tileSize);
							var startY = Math.floor(ty/map.tileSize);
							for (var x=0;x<width/32;x++){
								for (var y=0;y<height/32;y++){
									map.getTile(x, y).data.socialValue = socialValue;
								}
							}

						}
					};
				}

				var entityLayer = layerData['entities']
				if (entityLayer){
					for (var i = entityLayer.objects.length - 1; i >= 0; i--) {
						var entityData = entityLayer.objects[i];
						if (state.factory.has(entityData.type)){
							var eData = {};
							var decorators = []
							var keys = Object.keys(entityData.properties);
							keys.forEach(function(key){
								
								var subpaths = key.split('.');
								var pointer = eData;
								var val = entityData.properties[key];

								while (subpaths.length){
									var sp = subpaths.shift();
									if (pointer[sp]==undefined){
										pointer[sp]={}
									}
									if (subpaths.length==0){
										pointer[sp] = val;
									} else {
										pointer = pointer[sp];
									}
								}
								

							}.bind(this));
							eData = deepExtend(eData, {xform: {tx: entityData.x+16, ty: entityData.y-32+16}}); //-32 for tiled hack.
							
							var spawn = true;
							if (eData.meta!==undefined){
								if (eData.meta.spawn!==undefined){
									spawn = Boolean(eData.meta.spawn);
								}
							}
							var entity = state.factory.create(entityData.type, eData);
							entity.name = entityData.name;

							if (spawn){
								state.addEntity(entity);	
							} else {
								state._unspawnedEntities[entity.name] = entity;
							}
							state._entity_name[entityData.name] = entity;
						} else {
							console.error('Missing:', entityData.type);
						}
					}

				}
				//*/

				defered.resolve();
			})
			tileset.load();

			return defered.promise;
		}
		return TiledLevel
	}
);
define('subzero/component',[
		'sge'
	], function(sge){
		var Component = sge.Class.extend({
			init: function(entity, data){
				this.entity = entity;
				this._callbacks = [];
				this.enabled = data.enabled!==undefined ? Boolean(data.enabled) : true;
			},
			get: function(attr){
				return this.entity.get(attr)
			},
			set: function(attr, value){
				return this.entity.set(attr, value);
			},
			register: function(state){
				this.state = state
			},
			deregister: function(){

			},
			on: function(evt, cb, options){
				if (this._callbacks[cb]===undefined){
					this._callbacks[cb] = cb.bind(this);
				}
				this.entity.on(evt, this._callbacks[cb], options);
			},
			off: function(evt, cb){
				this.entity.off(evt, this._callbacks[cb]);
			}
		})

		Component._classMap = {};

		Component.add = function(type, data){
			klass = Component.extend(data);
			Component._classMap[type] = klass;
			return klass;
		}

		Component.Create = function(entity, type, data){
			if (Component._classMap[type]==undefined){
				console.error('Missing Component:', type);
				return null;
			}
			comp = new Component._classMap[type](entity, data);
			return comp;
		}

		Component.add('xform', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('xform.tx', data.tx || 0);
				this.set('xform.ty', data.ty || 0);
			}
		});

		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame || 1);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				this.parent.addChild(this._sprite);
				this._sprite.position.x = this.get('xform.tx');
				this._sprite.position.y = this.get('xform.ty');
				this._test_a = this.get('xform.ty');
				this._test_b = Math.random() * 2 * Math.PI;
				var idx = this.parent.children.indexOf(this._sprite);
				
				var next = this.parent.children[idx-1];
				
				if (next){
					while (next.position.y>this._sprite.position.y){
						this.parent.swapChildren(this._sprite, next);
						idx--;
						if (idx<=0){
							break;
						}
						next = this.parent.children[idx-1];
					}
				}
			},


			render: function(){
				
				var dx = this.get('xform.tx') - this._sprite.position.x;
				var dy = this.get('xform.ty') - this._sprite.position.y;
				if (dx != 0 || dy != 0){
					//*
					if (dy>0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx+1];
						if (next){
							if (next.position.y<this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					} else if(dy<0){
						var idx = this.parent.children.indexOf(this._sprite);
						var next = this.parent.children[idx-1];
						if (next){
							if (next.position.y>this.get('xform.ty')){
								this.parent.swapChildren(this._sprite, next);
							}
						}
					}
					//*/
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				}
				this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
			}
		});

		return Component;
	}
);
define('subzero/entity',[
		'sge',
		'./component',
	], function(sge, Component){
		var Entity = sge.Observable.extend({
			init: function(){
				this._super();
				this.id = null
				this.data = {};
				this.components = {};
				this.tags = [];
				this._tick_funcs = [];
				this._render_funcs = [];
			},
			get: function(attr){
				return this.data[attr]
			},
			set: function(attr, value){
				this.data[attr] = value;
				return value
			},
			tick: function(delta){
				for (var i = this._tick_funcs.length - 1; i >= 0; i--) {
					this._tick_funcs[i](delta);
				};
			},
			render: function(delta){
				for (var i = this._render_funcs.length - 1; i >= 0; i--) {
					this._render_funcs[i]();
				};
			},
			register: function(state){
				var keys = Object.keys(this.components);
				keys.forEach(function(key){
					this.components[key].register(state);
					if (this.components[key].render){
						this._render_funcs.push(this.components[key].render.bind(this.components[key]))
					}
					if (this.components[key].tick){
						this._tick_funcs.push(function(delta){
							if (this.components[key].enabled){
								this.components[key].tick(delta)
							}
						}.bind(this));
					}
				}.bind(this));
			},
			deregister: function(state){
				var keys = Object.keys(this.components);
				keys.forEach(function(key){
					this.components[key].deregister(state);
				}.bind(this));
			}
		})

		Entity.Factory = function(data){
			var entity = new Entity();
			Object.keys(data).forEach(function(comp){
				var compData = data[comp];
				var c = Component.Create(entity, comp, compData);
				if (c){
					entity.components[comp] = c;
				}
			});
			return entity;
		}

		return Entity;
	}
);
// Version 0.2 - Copyright 2013 -  Jim Riecken <jimr@jimr.ca>
//
// Released under the MIT License - https://github.com/jriecken/sat-js
//
// A simple library for determining intersections of circles and
// polygons using the Separating Axis Theorem.
/** @preserve SAT.js - Version 0.2 - Copyright 2013 - Jim Riecken <jimr@jimr.ca> - released under the MIT License. https://github.com/jriecken/sat-js */

/*global define: false, module: false*/
/*jshint shadow:true, sub:true, forin:true, noarg:true, noempty:true, 
  eqeqeq:true, bitwise:true, strict:true, undef:true, 
  curly:true, browser:true */

// Create a UMD wrapper for SAT. Works in:
//
//  - Plain browser via global SAT variable
//  - AMD loader (like require.js)
//  - Node.js
//
// The quoted properties all over the place are used so that the Closure Compiler
// does not mangle the exposed API in advanced mode.
/**
 * @param {*} root - The global scope
 * @param {Function} factory - Factory that creates SAT module
 */
(function (root, factory) {
  
  if (typeof define === 'function' && define['amd']) {
    define('subzero/sat',factory);
  } else if (typeof exports === 'object') {
    module['exports'] = factory();
  } else {
    root['SAT'] = factory();
  }
}(this, function () {
  

  var SAT = {};

  //
  // ## Vector
  //
  // Represents a vector in two dimensions with `x` and `y` properties.


  // Create a new Vector, optionally passing in the `x` and `y` coordinates. If
  // a coordinate is not specified, it will be set to `0`
  /** 
   * @param {?number=} x The x position.
   * @param {?number=} y The y position.
   * @constructor
   */
  function Vector(x, y) {
    this['x'] = x || 0;
    this['y'] = y || 0;
  }
  SAT['Vector'] = Vector;
  // Alias `Vector` as `V`
  SAT['V'] = Vector;


  // Copy the values of another Vector into this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['copy'] = Vector.prototype.copy = function(other) {
    this['x'] = other['x'];
    this['y'] = other['y'];
    return this;
  };

  // Change this vector to be perpendicular to what it was before. (Effectively
  // roatates it 90 degrees in a clockwise direction)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['perp'] = Vector.prototype.perp = function() {
    var x = this['x'];
    this['x'] = this['y'];
    this['y'] = -x;
    return this;
  };

  // Rotate this vector (counter-clockwise) by the specified angle (in radians).
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Vector} This for chaining.
   */
  Vector.prototype['rotate'] = Vector.prototype.rotate = function (angle) {
    var x = this['x'];
    var y = this['y'];
    this['x'] = x * Math.cos(angle) - y * Math.sin(angle);
    this['y'] = x * Math.sin(angle) + y * Math.cos(angle);
    return this;
  };

  // Reverse this vector.
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reverse'] = Vector.prototype.reverse = function() {
    this['x'] = -this['x'];
    this['y'] = -this['y'];
    return this;
  };
  

  // Normalize this vector.  (make it have length of `1`)
  /**
   * @return {Vector} This for chaining.
   */
  Vector.prototype['normalize'] = Vector.prototype.normalize = function() {
    var d = this.len();
    if(d > 0) {
      this['x'] = this['x'] / d;
      this['y'] = this['y'] / d;
    }
    return this;
  };
  
  // Add another vector to this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['add'] = Vector.prototype.add = function(other) {
    this['x'] += other['x'];
    this['y'] += other['y'];
    return this;
  };
  
  // Subtract another vector from this one.
  /**
   * @param {Vector} other The other Vector.
   * @return {Vector} This for chaiing.
   */
  Vector.prototype['sub'] = Vector.prototype.sub = function(other) {
    this['x'] -= other['x'];
    this['y'] -= other['y'];
    return this;
  };
  
  // Scale this vector. An independant scaling factor can be provided
  // for each axis, or a single scaling factor that will scale both `x` and `y`.
  /**
   * @param {number} x The scaling factor in the x direction.
   * @param {?number=} y The scaling factor in the y direction.  If this
   *   is not specified, the x scaling factor will be used.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['scale'] = Vector.prototype.scale = function(x,y) {
    this['x'] *= x;
    this['y'] *= y || x;
    return this; 
  };
  
  // Project this vector on to another vector.
  /**
   * @param {Vector} other The vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['project'] = Vector.prototype.project = function(other) {
    var amt = this.dot(other) / other.len2();
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Project this vector onto a vector of unit length. This is slightly more efficient
  // than `project` when dealing with unit vectors.
  /**
   * @param {Vector} other The unit vector to project onto.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['projectN'] = Vector.prototype.projectN = function(other) {
    var amt = this.dot(other);
    this['x'] = amt * other['x'];
    this['y'] = amt * other['y'];
    return this;
  };
  
  // Reflect this vector on an arbitrary axis.
  /**
   * @param {Vector} axis The vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflect'] = Vector.prototype.reflect = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.project(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Reflect this vector on an arbitrary axis (represented by a unit vector). This is
  // slightly more efficient than `reflect` when dealing with an axis that is a unit vector.
  /**
   * @param {Vector} axis The unit vector representing the axis.
   * @return {Vector} This for chaining.
   */
  Vector.prototype['reflectN'] = Vector.prototype.reflectN = function(axis) {
    var x = this['x'];
    var y = this['y'];
    this.projectN(axis).scale(2);
    this['x'] -= x;
    this['y'] -= y;
    return this;
  };
  
  // Get the dot product of this vector and another.
  /**
   * @param {Vector}  other The vector to dot this one against.
   * @return {number} The dot product.
   */
  Vector.prototype['dot'] = Vector.prototype.dot = function(other) {
    return this['x'] * other['x'] + this['y'] * other['y'];
  };
  
  // Get the squared length of this vector.
  /**
   * @return {number} The length^2 of this vector.
   */
  Vector.prototype['len2'] = Vector.prototype.len2 = function() {
    return this.dot(this);
  };
  
  // Get the length of this vector.
  /**
   * @return {number} The length of this vector.
   */
  Vector.prototype['len'] = Vector.prototype.len = function() {
    return Math.sqrt(this.len2());
  };
  
  // ## Circle
  //
  // Represents a circle with a position and a radius.

  // Create a new circle, optionally passing in a position and/or radius. If no position
  // is given, the circle will be at `(0,0)`. If no radius is provided, the circle will
  // have a radius of `0`.
  /**
   * @param {Vector=} pos A vector representing the position of the center of the circle
   * @param {?number=} r The radius of the circle
   * @constructor
   */
  function Circle(pos, r) {
    this['pos'] = pos || new Vector();
    this['r'] = r || 0;
  }
  SAT['Circle'] = Circle;

  // ## Polygon
  //
  // Represents a *convex* polygon with any number of points (specified in counter-clockwise order)
  //
  // The edges/normals of the polygon will be calculated on creation and stored in the
  // `edges` and `normals` properties. If you change the polygon's points, you will need
  // to call `recalc` to recalculate the edges/normals.

  // Create a new polygon, passing in a position vector, and an array of points (represented
  // by vectors relative to the position vector). If no position is passed in, the position
  // of the polygon will be `(0,0)`.
  /**
   * @param {Vector=} pos A vector representing the origin of the polygon. (all other
   *   points are relative to this one)
   * @param {Array.<Vector>=} points An array of vectors representing the points in the polygon,
   *   in counter-clockwise order.
   * @constructor
   */
  function Polygon(pos, points) {
    this['pos'] = pos || new Vector();
    this['points'] = points || [];
    this.recalc();
  }
  SAT['Polygon'] = Polygon;
  
  // Recalculates the edges and normals of the polygon. This **must** be called
  // if the `points` array is modified at all and the edges or normals are to be
  // accessed.
  /**
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['recalc'] = Polygon.prototype.recalc = function() {
    // The edges here are the direction of the `n`th edge of the polygon, relative to
    // the `n`th point. If you want to draw a given edge from the edge value, you must
    // first translate to the position of the starting point.
    this['edges'] = [];
    // The normals here are the direction of the normal for the `n`th edge of the polygon, relative
    // to the position of the `n`th point. If you want to draw an edge normal, you must first
    // translate to the position of the starting point.
    this['normals'] = [];
    var points = this['points'];
    var len = points.length;
    for (var i = 0; i < len; i++) {
      var p1 = points[i]; 
      var p2 = i < len - 1 ? points[i + 1] : points[0];
      var e = new Vector().copy(p2).sub(p1);
      var n = new Vector().copy(e).perp().normalize();
      this['edges'].push(e);
      this['normals'].push(n);
    }
    return this;
  };

  // Rotates this polygon counter-clockwise around the origin of *its local coordinate system* (i.e. `pos`).
  //
  // Note: You do **not** need to call `recalc` after rotation.
  /**
   * @param {number} angle The angle to rotate (in radians)
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['rotate'] = Polygon.prototype.rotate = function(angle) {
    var i;
    var points = this['points'];
    var edges = this['edges'];
    var normals = this['normals'];
    var len = points.length;
    for (i = 0; i < len; i++) {
      points[i].rotate(angle);
      edges[i].rotate(angle);
      normals[i].rotate(angle);
    }
    return this;
  };

  // Translates the points of this polygon by a specified amount relative to the origin of *its own coordinate
  // system* (i.e. `pos`).
  //
  // This is most useful to change the "center point" of a polygon.
  //
  // Note: You do **not** need to call `recalc` after translation.
  /**
   * @param {number} x The horizontal amount to translate.
   * @param {number} y The vertical amount to translate.
   * @return {Polygon} This for chaining.
   */
  Polygon.prototype['translate'] = Polygon.prototype.translate = function (x, y) {
    var i;
    var points = this['points'];
    var len = points.length;
    for (i = 0; i < len; i++) {
      points[i].x += x;
      points[i].y += y;
    }
    return this;
  };

  // ## Box
  //
  // Represents an axis-aligned box, with a width and height.


  // Create a new box, with the specified position, width, and height. If no position
  // is given, the position will be `(0,0)`. If no width or height are given, they will
  // be set to `0`.
  /**
   * @param {Vector=} pos A vector representing the top-left of the box.
   * @param {?number=} w The width of the box.
   * @param {?number=} h The height of the box.
   * @constructor
   */
  function Box(pos, w, h) {
    this['pos'] = pos || new Vector();
    this['w'] = w || 0;
    this['h'] = h || 0;
  }
  SAT['Box'] = Box;

  // Returns a polygon whose edges are the same as this box.
  /**
   * @return {Polygon} A new Polygon that represents this box.
   */
  Box.prototype['toPolygon'] = Box.prototype.toPolygon = function() {
    var pos = this['pos'];
    var w = this['w'];
    var h = this['h'];
    return new Polygon(new Vector(pos['x'], pos['y']), [
     new Vector(), new Vector(w, 0), 
     new Vector(w,h), new Vector(0,h)
    ]);
  };
  
  // ## Response
  //
  // An object representing the result of an intersection. Contains:
  //  - The two objects participating in the intersection
  //  - The vector representing the minimum change necessary to extract the first object
  //    from the second one (as well as a unit vector in that direction and the magnitude
  //    of the overlap)
  //  - Whether the first object is entirely inside the second, and vice versa.
  /**
   * @constructor
   */  
  function Response() {
    this['a'] = null;
    this['b'] = null;
    this['overlapN'] = new Vector();
    this['overlapV'] = new Vector();
    this.clear();
  }
  SAT['Response'] = Response;

  // Set some values of the response back to their defaults.  Call this between tests if
  // you are going to reuse a single Response object for multiple intersection tests (recommented
  // as it will avoid allcating extra memory)
  /**
   * @return {Response} This for chaining
   */
  Response.prototype['clear'] = Response.prototype.clear = function() {
    this['aInB'] = true;
    this['bInA'] = true;
    this['overlap'] = Number.MAX_VALUE;
    return this;
  };

  // ## Object Pools

  // A pool of `Vector` objects that are used in calculations to avoid
  // allocating memory.
  /**
   * @type {Array.<Vector>}
   */
  var T_VECTORS = [];
  for (var i = 0; i < 10; i++) { T_VECTORS.push(new Vector()); }
  
  // A pool of arrays of numbers used in calculations to avoid allocating
  // memory.
  /**
   * @type {Array.<Array.<number>>}
   */
  var T_ARRAYS = [];
  for (var i = 0; i < 5; i++) { T_ARRAYS.push([]); }

  // ## Helper Functions

  // Flattens the specified array of points onto a unit vector axis,
  // resulting in a one dimensional range of the minimum and
  // maximum value on that axis.
  /**
   * @param {Array.<Vector>} points The points to flatten.
   * @param {Vector} normal The unit vector axis to flatten on.
   * @param {Array.<number>} result An array.  After calling this function,
   *   result[0] will be the minimum value,
   *   result[1] will be the maximum value.
   */
  function flattenPointsOn(points, normal, result) {
    var min = Number.MAX_VALUE;
    var max = -Number.MAX_VALUE;
    var len = points.length;
    for (var i = 0; i < len; i++ ) {
      // The magnitude of the projection of the point onto the normal
      var dot = points[i].dot(normal);
      if (dot < min) { min = dot; }
      if (dot > max) { max = dot; }
    }
    result[0] = min; result[1] = max;
  }
  
  // Check whether two convex polygons are separated by the specified
  // axis (must be a unit vector).
  /**
   * @param {Vector} aPos The position of the first polygon.
   * @param {Vector} bPos The position of the second polygon.
   * @param {Array.<Vector>} aPoints The points in the first polygon.
   * @param {Array.<Vector>} bPoints The points in the second polygon.
   * @param {Vector} axis The axis (unit sized) to test against.  The points of both polygons
   *   will be projected onto this axis.
   * @param {Response=} response A Response object (optional) which will be populated
   *   if the axis is not a separating axis.
   * @return {boolean} true if it is a separating axis, false otherwise.  If false,
   *   and a response is passed in, information about how much overlap and
   *   the direction of the overlap will be populated.
   */
  function isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, response) {
    var rangeA = T_ARRAYS.pop();
    var rangeB = T_ARRAYS.pop();
    // The magnitude of the offset between the two polygons
    var offsetV = T_VECTORS.pop().copy(bPos).sub(aPos);
    var projectedOffset = offsetV.dot(axis);
    // Project the polygons onto the axis.
    flattenPointsOn(aPoints, axis, rangeA);
    flattenPointsOn(bPoints, axis, rangeB);
    // Move B's range to its position relative to A.
    rangeB[0] += projectedOffset;
    rangeB[1] += projectedOffset;
    // Check if there is a gap. If there is, this is a separating axis and we can stop
    if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
      T_VECTORS.push(offsetV); 
      T_ARRAYS.push(rangeA); 
      T_ARRAYS.push(rangeB);
      return true;
    }
    // This is not a separating axis. If we're calculating a response, calculate the overlap.
    if (response) {
      var overlap = 0;
      // A starts further left than B
      if (rangeA[0] < rangeB[0]) {
        response['aInB'] = false;
        // A ends before B does. We have to pull A out of B
        if (rangeA[1] < rangeB[1]) { 
          overlap = rangeA[1] - rangeB[0];
          response['bInA'] = false;
        // B is fully inside A.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      // B starts further left than A
      } else {
        response['bInA'] = false;
        // B ends before A ends. We have to push A out of B
        if (rangeA[1] > rangeB[1]) { 
          overlap = rangeA[0] - rangeB[1];
          response['aInB'] = false;
        // A is fully inside B.  Pick the shortest way out.
        } else {
          var option1 = rangeA[1] - rangeB[0];
          var option2 = rangeB[1] - rangeA[0];
          overlap = option1 < option2 ? option1 : -option2;
        }
      }
      // If this is the smallest amount of overlap we've seen so far, set it as the minimum overlap.
      var absOverlap = Math.abs(overlap);
      if (absOverlap < response['overlap']) {
        response['overlap'] = absOverlap;
        response['overlapN'].copy(axis);
        if (overlap < 0) {
          response['overlapN'].reverse();
        }
      }      
    }
    T_VECTORS.push(offsetV); 
    T_ARRAYS.push(rangeA); 
    T_ARRAYS.push(rangeB);
    return false;
  }
  
  // Calculates which Vornoi region a point is on a line segment.
  // It is assumed that both the line and the point are relative to `(0,0)`
  //
  //            |       (0)      |
  //     (-1)  [S]--------------[E]  (1)
  //            |       (0)      |
  /**
   * @param {Vector} line The line segment.
   * @param {Vector} point The point.
   * @return  {number} LEFT_VORNOI_REGION (-1) if it is the left region, 
   *          MIDDLE_VORNOI_REGION (0) if it is the middle region, 
   *          RIGHT_VORNOI_REGION (1) if it is the right region.
   */
  function vornoiRegion(line, point) {
    var len2 = line.len2();
    var dp = point.dot(line);
    // If the point is beyond the start of the line, it is in the
    // left vornoi region.
    if (dp < 0) { return LEFT_VORNOI_REGION; }
    // If the point is beyond the end of the line, it is in the
    // right vornoi region.
    else if (dp > len2) { return RIGHT_VORNOI_REGION; }
    // Otherwise, it's in the middle one.
    else { return MIDDLE_VORNOI_REGION; }
  }
  // Constants for Vornoi regions
  /**
   * @const
   */
  var LEFT_VORNOI_REGION = -1;
  /**
   * @const
   */
  var MIDDLE_VORNOI_REGION = 0;
  /**
   * @const
   */
  var RIGHT_VORNOI_REGION = 1;
  
  // ## Collision Tests

  // Check if two circles collide.
  /**
   * @param {Circle} a The first circle.
   * @param {Circle} b The second circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   the circles intersect.
   * @return {boolean} true if the circles intersect, false if they don't. 
   */
  function testCircleCircle(a, b, response) {
    // Check if the distance between the centers of the two
    // circles is greater than their combined radius.
    var differenceV = T_VECTORS.pop().copy(b['pos']).sub(a['pos']);
    var totalRadius = a['r'] + b['r'];
    var totalRadiusSq = totalRadius * totalRadius;
    var distanceSq = differenceV.len2();
    // If the distance is bigger than the combined radius, they don't intersect.
    if (distanceSq > totalRadiusSq) {
      T_VECTORS.push(differenceV);
      return false;
    }
    // They intersect.  If we're calculating a response, calculate the overlap.
    if (response) { 
      var dist = Math.sqrt(distanceSq);
      response['a'] = a;
      response['b'] = b;
      response['overlap'] = totalRadius - dist;
      response['overlapN'].copy(differenceV.normalize());
      response['overlapV'].copy(differenceV).scale(response['overlap']);
      response['aInB']= a['r'] <= b['r'] && dist <= b['r'] - a['r'];
      response['bInA'] = b['r'] <= a['r'] && dist <= a['r'] - b['r'];
    }
    T_VECTORS.push(differenceV);
    return true;
  }
  SAT['testCircleCircle'] = testCircleCircle;
  
  // Check if a polygon and a circle collide.
  /**
   * @param {Polygon} polygon The polygon.
   * @param {Circle} circle The circle.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonCircle(polygon, circle, response) {
    // Get the position of the circle relative to the polygon.
    var circlePos = T_VECTORS.pop().copy(circle['pos']).sub(polygon['pos']);
    var radius = circle['r'];
    var radius2 = radius * radius;
    var points = polygon['points'];
    var len = points.length;
    var edge = T_VECTORS.pop();
    var point = T_VECTORS.pop();
    
    // For each edge in the polygon:
    for (var i = 0; i < len; i++) {
      var next = i === len - 1 ? 0 : i + 1;
      var prev = i === 0 ? len - 1 : i - 1;
      var overlap = 0;
      var overlapN = null;
      
      // Get the edge.
      edge.copy(polygon['edges'][i]);
      // Calculate the center of the circle relative to the starting point of the edge.
      point.copy(circlePos).sub(points[i]);
      
      // If the distance between the center of the circle and the point
      // is bigger than the radius, the polygon is definitely not fully in
      // the circle.
      if (response && point.len2() > radius2) {
        response['aInB'] = false;
      }
      
      // Calculate which Vornoi region the center of the circle is in.
      var region = vornoiRegion(edge, point);
      // If it's the left region:
      if (region === LEFT_VORNOI_REGION) { 
        // We need to make sure we're in the RIGHT_VORNOI_REGION of the previous edge.
        edge.copy(polygon['edges'][prev]);
        // Calculate the center of the circle relative the starting point of the previous edge
        var point2 = T_VECTORS.pop().copy(circlePos).sub(points[prev]);
        region = vornoiRegion(edge, point2);
        if (region === RIGHT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge);
            T_VECTORS.push(point); 
            T_VECTORS.push(point2);
            return false;
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
        T_VECTORS.push(point2);
      // If it's the right region:
      } else if (region === RIGHT_VORNOI_REGION) {
        // We need to make sure we're in the left region on the next edge
        edge.copy(polygon['edges'][next]);
        // Calculate the center of the circle relative to the starting point of the next edge.
        point.copy(circlePos).sub(points[next]);
        region = vornoiRegion(edge, point);
        if (region === LEFT_VORNOI_REGION) {
          // It's in the region we want.  Check if the circle intersects the point.
          var dist = point.len();
          if (dist > radius) {
            // No intersection
            T_VECTORS.push(circlePos); 
            T_VECTORS.push(edge); 
            T_VECTORS.push(point);
            return false;              
          } else if (response) {
            // It intersects, calculate the overlap.
            response['bInA'] = false;
            overlapN = point.normalize();
            overlap = radius - dist;
          }
        }
      // Otherwise, it's the middle region:
      } else {
        // Need to check if the circle is intersecting the edge,
        // Change the edge into its "edge normal".
        var normal = edge.perp().normalize();
        // Find the perpendicular distance between the center of the 
        // circle and the edge.
        var dist = point.dot(normal);
        var distAbs = Math.abs(dist);
        // If the circle is on the outside of the edge, there is no intersection.
        if (dist > 0 && distAbs > radius) {
          // No intersection
          T_VECTORS.push(circlePos); 
          T_VECTORS.push(normal); 
          T_VECTORS.push(point);
          return false;
        } else if (response) {
          // It intersects, calculate the overlap.
          overlapN = normal;
          overlap = radius - dist;
          // If the center of the circle is on the outside of the edge, or part of the
          // circle is on the outside, the circle is not fully inside the polygon.
          if (dist >= 0 || overlap < 2 * radius) {
            response['bInA'] = false;
          }
        }
      }
      
      // If this is the smallest overlap we've seen, keep it. 
      // (overlapN may be null if the circle was in the wrong Vornoi region).
      if (overlapN && response && Math.abs(overlap) < Math.abs(response['overlap'])) {
        response['overlap'] = overlap;
        response['overlapN'].copy(overlapN);
      }
    }
    
    // Calculate the final overlap vector - based on the smallest overlap.
    if (response) {
      response['a'] = polygon;
      response['b'] = circle;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    T_VECTORS.push(circlePos); 
    T_VECTORS.push(edge); 
    T_VECTORS.push(point);
    return true;
  }
  SAT['testPolygonCircle'] = testPolygonCircle;
  
  // Check if a circle and a polygon collide.
  //
  // **NOTE:** This is slightly less efficient than polygonCircle as it just
  // runs polygonCircle and reverses everything at the end.
  /**
   * @param {Circle} circle The circle.
   * @param {Polygon} polygon The polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testCirclePolygon(circle, polygon, response) {
    // Test the polygon against the circle.
    var result = testPolygonCircle(polygon, circle, response);
    if (result && response) {
      // Swap A and B in the response.
      var a = response['a'];
      var aInB = response['aInB'];
      response['overlapN'].reverse();
      response['overlapV'].reverse();
      response['a'] = response['b'];
      response['b'] = a;
      response['aInB'] = response['bInA'];
      response['bInA'] = aInB;
    }
    return result;
  }
  SAT['testCirclePolygon'] = testCirclePolygon;
  
  // Checks whether polygons collide.
  /**
   * @param {Polygon} a The first polygon.
   * @param {Polygon} b The second polygon.
   * @param {Response=} response Response object (optional) that will be populated if
   *   they interset.
   * @return {boolean} true if they intersect, false if they don't.
   */
  function testPolygonPolygon(a, b, response) {
    var aPoints = a['points'];
    var aLen = aPoints.length;
    var bPoints = b['points'];
    var bLen = bPoints.length;
    // If any of the edge normals of A is a separating axis, no intersection.
    for (var i = 0; i < aLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, a['normals'][i], response)) {
        return false;
      }
    }
    // If any of the edge normals of B is a separating axis, no intersection.
    for (var i = 0;i < bLen; i++) {
      if (isSeparatingAxis(a['pos'], b['pos'], aPoints, bPoints, b['normals'][i], response)) {
        return false;
      }
    }
    // Since none of the edge normals of A or B are a separating axis, there is an intersection
    // and we've already calculated the smallest overlap (in isSeparatingAxis).  Calculate the
    // final overlap vector.
    if (response) {
      response['a'] = a;
      response['b'] = b;
      response['overlapV'].copy(response['overlapN']).scale(response['overlap']);
    }
    return true;
  }
  SAT['testPolygonPolygon'] = testPolygonPolygon;

  return SAT;
}));
define('subzero/physics',[
	'sge',
	'./sat'
	], function(sge, sat){
		var Physics = sge.Class.extend({
			init: function(){
				this.entities = [];
				this.map = null;
			},
			tick: function(delta){
				this.entities.forEach(function(entity){
					this.move(entity, delta);
				}.bind(this));
				this.detectCollision();
			},
			_collisionHash: function(a, b){
				if (a.id>b.id){
					return b.id + '.' + a.id;
				} else {
					return a.id + '.' + b.id;
				}
			},
			detectCollision: function(){
				var e, ep, aRect, bRect;
				var response = new sat.Response();
				var testEntities = this.entities.filter(function(q){
					return q.get('physics.type')==0;
				});
				var testHashes = [];
				var collisionHashes = [];
				for (var i = testEntities.length - 1; i >= 0; i--) {
					e = testEntities[i];
					tx = e.get('xform.tx');
					ty = e.get('xform.ty');
					
					aRect = new sat.Box(new sat.Vector(tx, ty), e.get('physics.width'), e.get('physics.height'));
					potential = this.state.findEntities(tx,ty, 32).filter(function(q){return q.components.physics!=null && q!=e});
					for (var k = potential.length - 1; k >= 0; k--) {
						var hash = this._collisionHash(e, potential[k])
						if (testHashes.indexOf(hash)<0){
							testHashes.push(hash);
							ep = potential[k];
							/*
							if (ep.get('physics.type')==2){
								continue;
							}
							*/
							bRect = new sat.Box(new sat.Vector(ep.get('xform.tx'),ep.get('xform.ty')), ep.get('physics.width'), ep.get('physics.height'));
							collided = sat.testPolygonPolygon(aRect.toPolygon(), bRect.toPolygon(), response)
							if (collided){
								e.trigger('contact.start', ep);
								ep.trigger('contact.start', e);
								if (ep.get('physics.type')==2||e.get('physics.type')==2){
									//Don't resolve the collision.
								} else if (ep.get('physics.type')==1){
									this.move(e, 0, -response.overlapV.x, -response.overlapV.y);
								} else {
									this.move(e, 0, -0.5*response.overlapV.x, -0.5*response.overlapV.y);
									this.move(ep, 0, 0.5*response.overlapV.x,  0.5*response.overlapV.y);
								}
								
								response.clear();
								
								

							}
							
						}
					};
				};
			},
			move: function(entity, delta, vx, vy){

				if (vx==undefined){
					vx = entity.get('movement.vx') * delta * entity.get('movement.speed');
					vy = entity.get('movement.vy') * delta * entity.get('movement.speed');
				}

				var tx = entity.get('xform.tx');
				var ty = entity.get('xform.ty');

				

				var ptx = tx + vx;
				var pty = ty + vy;

				
				if (this.map){
					var testPoints = [
							[entity.get('physics.width')/2, entity.get('physics.height')/2],
							[entity.get('physics.width')/2, -entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, entity.get('physics.height')/2],
							[-entity.get('physics.width')/2, -entity.get('physics.height')/2]
						]
						var horzMove = true;
						var vertMove = true;
						for (var i = testPoints.length - 1; i >= 0; i--) {
							testPoints[i];
							var newTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+vy+ty);
							if (newTile){
							    if (!newTile.data.passable){
									if (horzMove){
									    horzTile = this.map.getTileAtPos(testPoints[i][0]+vx+tx, testPoints[i][1]+ty);
										if (horzTile){
										    if (!horzTile.data.passable){
											    horzMove=false;
										    }
										}
									}
									if (vertMove){
									    vertTile = this.map.getTileAtPos(testPoints[i][0]+tx, testPoints[i][1]+vy+ty);
										if (vertTile){
										    if (!vertTile.data.passable){
											    vertMove=false;
										    }
										}
									}
							    }
							}
							if (!horzMove){
								ptx=tx;
							}
							if (!vertMove){
								pty=ty;
							}
						};
						
				}
				if (tx!=ptx||ty!=pty){
					entity.trigger('entity.moved', entity, ptx, pty, ptx-tx, pty-ty);
					entity.set('xform.tx', ptx);
					entity.set('xform.ty', pty);
				}
			},
			setMap: function(state){
				this.state = state;
				this.map = state.map;
			}
		});

		return Physics;
	}
);
define('subzero/components/sprite',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('sprite', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('sprite.width', data.width || 64);
				this.set('sprite.height', data.height || 64);

				this.set('sprite.offsetx', data.offsetx || 0);
				this.set('sprite.offsety', data.offsety || 0);

				this.set('sprite.scalex', data.scalex || 1);
				this.set('sprite.scaley', data.scaley || 1);

				
				this.set('sprite.src', data.src || 'man_a');
				this.set('sprite.frame', data.frame== undefined ? 0 : data.frame);

				this.set('sprite.visible', true);

				this.set('sprite.container', data.container || 'stage');
				this._sprite = new PIXI.Sprite.fromFrame(this.get('sprite.src') + '-' + this.get('sprite.frame'));


			},

			show: function(){
				this.set('sprite.visible', true);
				this.parent.addChild(this._sprite);
			},

			hide: function(){
				this.set('sprite.visible', false);
				if (this.parent.children.indexOf(this._sprite)>=0){
					this.parent.removeChild(this._sprite);
				}
			},

			deregister: function(state){
				this.hide();
				this.off('sprite.show', this.show);
				this.off('sprite.hide', this.hide);
				this._super(state);
			},

			register: function(state){
				this._super(state);
				this.parent = state.containers[this.get('sprite.container')];
				
				this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
				this._test_a = this.get('xform.ty');
				this._test_b = Math.random() * 2 * Math.PI;
				var idx = this.parent.children.indexOf(this._sprite);
				
				var next = this.parent.children[idx-1];
				
				if (next){
					while (next.position.y>this._sprite.position.y){
						this.parent.swapChildren(this._sprite, next);
						idx--;
						if (idx<=0){
							break;
						}
						next = this.parent.children[idx-1];
					}
				}
				this.on('sprite.show', this.show);
				this.on('sprite.hide', this.hide);
				if (this.get('sprite.visible')){
					this.show();
				}
			},
			render: function(){
				if (this.get('sprite.visible')){
					this._sprite.position.x = this.get('xform.tx') + this.get('sprite.offsetx');
					this._sprite.position.y = this.get('xform.ty') + this.get('sprite.offsety');
					this._sprite.scale.x = this.get('sprite.scalex');
					this._sprite.scale.y = this.get('sprite.scaley');
					this._sprite.setTexture(PIXI.TextureCache[this.get('sprite.src') + '-' + this.get('sprite.frame')])
				}
			}
		});
	}
);
define('subzero/components/rpgcontrols',[
	'sge',
	'../component'
	], function(sge, Component){
		var ControlComponent = Component.add('controls', {
			init: function(entity, data){
				this._super(entity, data);
			},
			tick: function(){
				var dpad = this.input.dpad();
				this.set('movement.vx', dpad[0]);
				this.set('movement.vy', dpad[1]);

				if (this.input.isDown('X')){
					this.set('movement.vx', dpad[0]*2);
					this.set('movement.vy', dpad[1]*2);
				}

				if (this.input.isDown('Z')){
					this.state.openInventory();
				}

				if (this.input.isPressed('enter')){
					this.entity.trigger('interact');
				}
				
				if (this.input.isPressed('space')){
					this.entity.trigger('item.use');
				}
			},
			register: function(state){
				this._super(state);
				this.input = state.input;
			}
		});
	}
);
define('subzero/components/chara',[
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
				this.set('movement.speed', 96);
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
);
define('subzero/behaviour',[
		'sge'
	], function(sge){
		var Behaviour = sge.Class.extend({
			init: function(ai, data){
				data = data || {};
				this.comp = ai;
				this.entity = ai.entity;
				this.state = ai.state;
				this.running = false;
				this.importance = data.importance || 3;
			},
			start: function(){
				this.running = true;
			},
			stop: function(){
				this.running = false;
				this.comp.next();
			}
		});

		Behaviour._classMap = {};

		Behaviour.add = function(type, data){
			klass = Behaviour.extend(data);
			Behaviour._classMap[type] = klass;
			return klass;
		}

		Behaviour.Create = function(entity, data){
			if (Behaviour._classMap[data.xtype]==undefined){
				console.error('Missing Behaviour:', data.xtype);
				return null;
			}
			comp = new Behaviour._classMap[data.xtype](entity, data);
			return comp;
		}

		Behaviour.add('idle', {
			start: function(){
				this._timeout = this.state.getTime() + Math.random() + 0.5;
				this.entity.set('movement.vx', Math.random() * 2 - 1);
				this.entity.set('movement.vy', Math.random() * 2 - 1);
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.stop();
				}
			}
		})

		Behaviour.add('goto', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
				this.distance = data.distance || 64;
			},
			start: function(){
				this._timeout = 0;

			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 1.35 : 1;
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<this.distance){
					this.stop();
				}
				this.entity.set('movement.vx', -dx/dist * speed);
				this.entity.set('movement.vy', -dy/dist * speed);

			}
		})

		Behaviour.add('goaway', {
			init: function(comp, data){
				this._super(comp, data);
				this.target = data.target;
				this._timeout = data.timeout || 0;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout = this.state.getTime() + this._timeout;
				}
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				var speed = this.importance >= 7 ? 2 : 1;
				if (this._timeout>0 && this._timeout<this.state.getTime()){
					this.stop();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this.target.get('xform.tx');
				var targety = this.target.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist>1024){
					this.stop();
				}
				this.entity.set('movement.vx', dx/dist * speed);
				this.entity.set('movement.vy', dy/dist * speed);

			}
		})

		Behaviour.add('wait', {
			init: function(comp, data){
				this._super(comp, data);
				this._timeout = data.timeout || -1;
			},
			start: function(){
				if (this._timeout>0){
					this._timeout += this.state.getTime();
				}
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				return false;
			},
			tick: function(delta){
				if (this._timeout>0 && this.state.getTime()>this._timeout){
					this.stop()
				} else {
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return true;
			}
		})

		Behaviour.add('social', {
			start: function(){
				this._timeout = 0;
			},
			isSatisfied: function(){
				var tile = this.entity.get('map.tile');
				if (!tile){
					return true;
				}
				return (tile.data.socialValue>=0.9)
			},
			tick: function(delta){
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<1){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
					}
				}
			}
		});

		Behaviour.add('sell', {
			start: function(){
				this._timeout = 0;
				this._moveTimeout = this.state.getTime() + 5;
				this._selling = false;
				this.entity.on('merchant.sell', this.startSell.bind(this));
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
			},
			isSatisfied: function(){
				if (this._selling){
					this.entity.set('movement.vx', 0);
					this.entity.set('movement.vy', 0);
				}
				return (this._selling)
			},
			tick: function(delta){
				if (this.state.getTime()>this._moveTimeout){
					var tx = this.entity.get('xform.tx');
					var ty = this.entity.get('xform.ty');
					var entities = this.state.findEntities(tx, ty, 512);
					var avg = [0,0];
					var count = 0;
					entities.forEach(function(e){
						avg = [avg[0]+e.get('xform.tx'),avg[1]+e.get('xform.ty')];
						count++;
					});
					var targetx = avg[0]/count;
					var targety = avg[0]/count;
					var dx = tx - targetx;
					var dy = ty - targety;
					var dist = Math.sqrt(dx*dx+dy*dy);
					if (dist<64){
						this.stop();
					}
					this.entity.set('movement.vx', -dx/dist);
					this.entity.set('movement.vy', -dy/dist);
					this._moveTimeout += 3
					return
				}
				if (this.state.getTime()>this._timeout){
					this._timeout = this.state.getTime()+1+Math.random();
					this.entity.trigger('sound.emit', {
						type: 0,
						instructions: [{
							xtype: "goto",
							target: this.entity
						},{
							xtype: "event.trigger",
							event: "merchant.sell",
							entity: this.entity
						},{
							xtype: "wait",
							timeout: 2
						}]
					})
				}

			},
			startSell: function(){
				this.entity.set('movement.vx', 0);
				this.entity.set('movement.vy', 0);
				this._moveTimeout = this.state.getTime() + 3;
			},
		});
		Behaviour.add('event.trigger', {
			init: function(comp, data){
				this._super(comp, data);
				this._eventName = data.event;
				this._entity = data.entity;
			},
			tick: function(){
				this._entity.trigger(this._eventName);
				this.stop();
			}
		})
		return Behaviour;
	}
);
define('subzero/ai',[
	'sge',
	'./behaviour'
	], function(sge, Behaviour){
		var AI = {blueprints: {}};
		AI.load = function(allData){
			var data = allData.ai;
			for (var prop in data) {
		      // important check that this is objects own property 
		      // not from prototype prop inherited
		      if(data.hasOwnProperty(prop)){
		        AI.blueprints[prop] = data[prop];
		      }
		   }

		}
		AI.has = function(typ){
			return (AI.blueprints[typ]!==undefined);
		}
		AI.Create = function(type, entity){
			var behaviourData = AI.blueprints[type];
			if (behaviourData==undefined){
				console.error('No Behavour Data for ' + type);
				return;
			}
			var behavoiurs = [];
			for (var i=0; i<behaviourData.objectives.length;i++){
				var bd = behaviourData.objectives[i];
				var n = Behaviour.Create(bd.behaviour, entity, bd);
				behavoiurs.push(n);
			}
			return behavoiurs;
		}

		return AI;
	}
);
define('subzero/components/ai',[
	'sge',
	'../component',
	'../behaviour',
	'../ai'
	], function(sge, Component, Behaviour, AI){
		var proxyTarget = function(tx, ty){
			this.data = {
				'xform.tx': tx,
				'xform.ty': ty
			}
			this.get = function(attr){
				return this.data[attr];
			}
		}

		var Planner = sge.Observable.extend({
			init: function(comp){
				this.comp = comp;
				this.entity = comp.entity;
				this.state = comp.state;
				this._interupt = false;
				this._instructions=[];
				this._ignoreList=[];
			},
			interupt: function(){
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				return {xtype: 'idle'}
			}
		});

		var CitizenPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._instructions = [];
				this._ignoreList = [];
				this._interupt=false;
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==0){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = sound.instructions;
						this._interupt=true;
					}
				}
				if (sound.type==1){
					if (this._ignoreList.indexOf(sound.entity)<0){
						this._ignoreList.push(sound.entity)
						this._instructions = [{xtype: 'goaway', importance: sound.importance, target: new proxyTarget(tx, ty), timeout: sound.volume/64, importance: 8}];
						this._interupt=true;
					}
				}
			},
			interupt: function(){
				if (this._super()){
					return true;
				}
				if (this.comp.behaviour.importance>=6){
					return false;
				}
				var tile = this.entity.get('map.tile');
				if (tile){
					if (tile.data.socialValue<0.8){
						this.entity.set('movement.vx', tile.data.socialVector[0]);
						this.entity.set('movement.vy', tile.data.socialVector[1]);
						return true;
					}
				}
				if (this._interupt){
					this._interupt=false;
					this.comp.next();
					return true;
				}
				return false;
			},
			next: function(){
				if (this._instructions.length){
					return this._instructions.shift();
				}
				return {xtype: 'idle'}
			}
		});

		var MerchantPlanner = Planner.extend({
			interupt: function(){
				
					var tile = this.entity.get('map.tile');
					if (tile){
						if (tile.data.socialValue<0.8){
							this.entity.set('movement.vx', tile.data.socialVector[0]);
							this.entity.set('movement.vy', tile.data.socialVector[1]);
							return true;
						}
					}
				
				return false;
			},
			next: function(){
				return {xtype: 'sell'}
			}
		});

		var GuardPlanner = Planner.extend({
			init: function(comp){
				this._super(comp);
				this.entity.on('sound.hear', this.soundCallback.bind(this));
				this._home = new proxyTarget(this.entity.get('xform.tx'),this.entity.get('xform.ty'))
				
			},
			soundCallback: function(tx, ty, sound){
				if (sound.type==1){
						this._ignoreList.push(sound.entity);
						var instructions = [{xtype: 'goto', distance: 32, importance: sound.importance, target: new proxyTarget(tx, ty)},{xtype:'wait', timeout:5, importance: sound.importance}];
						if (sound.importance>=this.comp.behaviour.importance){
							this._instructions = instructions;
							this._interupt=true;
						} else {
							this._instructions = this._instructions.concat(instructions);
						}
						this.entity.trigger('emote.msg', 'What the hell?');
				}
			},
			next: function(){
				if (this._instructions.length>0){
					return this._instructions.shift();
				}
				var tx = this.entity.get('xform.tx');
				var ty = this.entity.get('xform.ty');

				var targetx = this._home.get('xform.tx');
				var targety = this._home.get('xform.ty');

				var dx = tx - targetx;
				var dy = ty - targety;
				var dist = Math.sqrt(dx*dx+dy*dy);
				if (dist<16){
					this.entity.set('chara.dir', 'down')
					return {xtype: 'wait'}
				}
				return {xtype: 'goto', target: this._home};
			}
		});

		PLANNER = {
			'citizen' : CitizenPlanner,
			'merchant' : MerchantPlanner,
			'guard' : GuardPlanner
		}

		Component.add('ai', {
			init: function(entity, data){
				this._super(entity, data);
			    this.set('ai.planner', data.planner || 'citizen');
			    this._timeout = 0;
			    this.behaviour = null;

			},
			register: function(state){
				this._super(state);
				this.planner = new PLANNER[this.get('ai.planner')](this)
				this.next();
			},
			next : function(){
				this.changeBehaviour(this.planner.next());
			},
			changeBehaviour: function(data){
				if (this.behaviour && this.behaviour.running){
					this.behaviour.stop();
				}
				this.behaviour = Behaviour.Create(this, data);
				this.behaviour.start()
			},
			tick: function(delta){
				//Check planning for interupt.
				if (this.planner.interupt()){
					return;
				}
				
				//Tick current behaviour.
				this.behaviour.tick(delta);
			}
		});		
	}
);
define('subzero/components/physics',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('physics', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('physics.type', data.type!=undefined ? data.type : 0);
				this.set('physics.width', data.width || 24);
				this.set('physics.height', data.height || 24);
				
			},
			register: function(state){
				this._super(state);
				if (this.get('physics.type')==0){
				    state.physics.entities.push(this.entity);   
				}
			},
			deregister: function(state){
			},
		});		
	}
);
define('subzero/components/sound',[
	'sge',
	'../component'
	], function(sge, Component){
		var extend = function(destination, source)
        {
            for (var property in source)
            {
                if (destination[property] && (typeof(destination[property]) == 'object')
                        && (destination[property].toString() == '[object Object]') && source[property])
                    extend(destination[property], source[property]);
                else
                    destination[property] = source[property];
            }
            return destination;
        }

		Component.add('sound', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this.on('sound.emit', this.emit);
			},
			emit: function(sound){
				sound = extend({
					importance: 3,
					entity: this.entity
				}, sound)
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				sound.entity = this.entity;
				var found = this.state.findEntities(
						tx, 
						ty,
						sound.volume || 128
					)
				for (var i = found.length - 1; i >= 0; i--) {
					found[i].trigger('sound.hear', tx, ty, sound)
				};
			}
		});		
	}
);
define('subzero/components/bomb',[
		'sge',
		'../component'
	], function(sge, Component){
		Component.add('explosion', {
			register: function(state){
				this._super(state);
				this._frame= 0;
				this._anim = 0;
				createjs.Sound.play('explosion');
			},
			tick: function(delta){
				if (this._anim<=0){
					this._anim = (1/30);
					this.set('sprite.frame', this._frame++);
					if (this._frame>=16){
						this.state.removeEntity(this.entity);
					}
				} else {
					this._anim -= delta;
				}
			}
	})

		Component.add('bomb', {
			register: function(state){
				this._super(state);
				this._timeout = state.getTime() + 3;
			},
			tick: function(delta){
				if (this.state.getTime()>this._timeout){
					this.entity.trigger('sound.emit', {
						type: 1,
						volume: 1024,
						importance: 6
					})
					
					
					for (var i = 0; i < 3; i++) {
						var scale = (Math.random()*2-1)*0.5 + 1;
						var explo = this.state.factory.create('explosion', {
							xform: {
								tx: this.get('xform.tx') + (Math.random()*2-1)*32,
								ty: this.get('xform.ty') + (Math.random()*2-1)*32
							},
							"sprite" : {
					            "src" : "explosion",
					            "container": "glow",
					            "offsetx" : -32,
					            "offsety" : -32,
								scalex: scale,
								scaley: scale
							}
						})
						this.state.addEntity(explo);
						
					}
					this.state.removeEntity(this.entity);

				}
			}
		})
	}
);
define('subzero/components/emote',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('emote', {
			init: function(entity, data){
				this._super(entity, data);
			},
			register: function(state){
				this._super(state);
				this._visible = false;
				this.text = new PIXI.BitmapText("", {font: "20px 8bit"});
				this.text.position.x = 300;
				this.text.position.y = 300;
				this._timeout = -1;
				this.on('emote.msg', this.emote);
			},
			emote: function(msg){
				if (!this._visible){
					this.text.setText(msg);
					this.state.containers.overhead.addChild(this.text);
					this._timeout = this.state.getTime() + 1;
					this._visible = true;
				}
			},
			clear: function(){
				this._timeout = -1;
				this.state.containers.overhead.removeChild(this.text);
				this._visible = false;
			},
			tick: function(){
				if(this._timeout>0 && this._timeout<this.state.getTime()){
					this.clear()
				}
			},
			render: function(){
				if (this._visible){
					this.text.position.x = this.get('xform.tx');
					this.text.position.y = this.get('xform.ty')-64;
				}
			}
		});		
	}
);
define('subzero/components/guardpost',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('guardpost', {
			init: function(entity, data){
				this._super(entity, data);
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.active = null;
				this._alarm = false;
				this._timeout  = 0;
			},
			update: function(active){
				this.active = active;
				this.indicater.clear();
				if (this._alarm){
					var radius = 16 + (8 * Math.sin(this.state.getTime()*4))
					this.indicater.beginFill('0xFF0000');
					this.indicater.drawCircle(0,0,radius);
				} else  if (active){
					this.indicater.beginFill('0x00FF00');
					this.indicater.drawCircle(0,0,24);
				} else {
					this.indicater.beginFill('0xFFFF00');
					this.indicater.drawCircle(0,0,24);
				}
			},
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														64);
				var guards = nearby.filter(function(e){return e.tags.indexOf('guard')>=0});
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0 && this.active){
					if (!this._alarm){
						this.alarm();
					}
					if (this._timeout<this.state.getTime()){
						this.state.loseGame();
					}
				} else {
					this._alarm = false;
				}
				this.update(guards.length>0);
			},
			register: function(state){
				this._super(state);
				this.state.containers.underfoot.addChild(this.indicater)
			},
			render: function(){
				this.indicater.position.x = this.get('xform.tx');
				this.indicater.position.y = this.get('xform.ty');
			},
			alarm: function(){
				this._alarm = true;
				this.entity.trigger('sound.emit', {
					type: 1,
					volume: 96,
					importance: 9
				});
				this._timeout = this.state.getTime() + 1.5;
			}
		});		
	}
);
define('subzero/components/goalpost',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('goalpost', {
			tick: function(delta){
				var nearby = this.state.findEntities(this.get('xform.tx'),
														this.get('xform.ty'),
														12);
				var pcs = nearby.filter(function(e){return e.tags.indexOf('pc')>=0});
				
				if (pcs.length>0){
					this.state.winGame();
				}
			},
		});		
	}
);
define('subzero/components/door',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('door', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.map = state.map;
				this.update();
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			update: function(){
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty'));
				tile.data.passable = this._open;
				var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-32);
				tile.data.passable = this._open;
				//var tile = this.map.getTileAtPos(this.get('xform.tx'),this.get('xform.ty')-64);
				//tile.data.passable = this._open;
			},
			toggle: function(){
				if (this._open){
					this._open = false;
					this.entity.trigger('sprite.show');
				} else {
					this._open = true;
					this.entity.trigger('sprite.hide');
				}
				this.update();
			}
		});		
	}
);
define('subzero/components/interact',[
	'sge',
	'../component'
	], function(sge, Component){
		var InteractComponent = Component.add('interact', {
			init: function(entity, data){
				this._super(entity, data);
				this._targets = data.targets;
				this._proxy = data.proxy;
			},
			register: function(state){
				this._super(state);
				if (this._targets){
					this._proxies = [];
					for (var i = this._targets.length - 1; i >= 0; i--) {
						var target = this._targets[i];
						if (target[0]==0 && target[1]==0){
							continue;
						}
						var proto = {
							xform: {
								tx: this.get('xform.tx') + (target[0]*32),
								ty: this.get('xform.ty') + (target[1]*32),
							},
							interact: {
								proxy: this.entity,
							},
							highlight: {
								radius: 24
							}
						}
						var proxy = state.factory.create('trigger', proto);
						state.addEntity(proxy)
						this._proxies.push(proxy);
					};
				}
				if (this._proxy){
					this.on('interact', this.interact);
				}
			},
			deregister: function(state){
				this._super(state);
				if (this._proxy){
					this.off('interact', this.interact);
				}
			},
			interact: function(entity){
				this._proxy.trigger('interact', entity)
			}
		});

		var InteractControlComponent = Component.add('interact.control', {
			init: function(entity, data){
				this._super(entity, data);
				this._current = null;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(){
				if (this._current){
					this._current.trigger('interact', this.entity);
				}
			},
			tick: function(delta){
				var tx = this.get('xform.tx');
				var ty = this.get('xform.ty');
				var targets = this.state.findEntities(tx, ty, 32).filter(function(e){
					return e.components.interact!=undefined && e.components.interact.enabled;
				});
				targets.sort(function(a,b){return b._findDist-a._findDist});
				if (this._current!=targets[0]){
					if (this._current){
						this._current.trigger('highlight.off');
						this._current = null;
					}
					this._current=targets[0];
					if (this._current){
						this._current.trigger('highlight.on');
					}
				}
			}
		});
	}
);
define('subzero/components/highlight',[
	'sge',
	'../component'
	], function(sge, Component){

		var HighlightComponent = Component.add('highlight', {
			init: function(entity, data){
				this._super(entity, data);
				this._radius = data.radius || 16;
				this.indicater = new PIXI.Graphics();
				this.indicater.alpha = 0.65;
				this.indicater.beginFill('0x00FFF0');
				this.indicater.drawCircle(0,0, this._radius);
				this.indicater.endFill();
				this._active = false;
			},
			register: function(state){
				this._super(state);
				this.on('highlight.on', this.turnOn);
				this.on('highlight.off', this.turnOff);
			},
			deregister: function(state){
				this._super(state);
				this.off('highlight.on', this.turnOn);
				this.off('highlight.off', this.turnOff);
				this.turnOff();
			},
			turnOn: function(){
				this._active = true;
				this.state.containers.underfoot.addChild(this.indicater);
			},
			turnOff: function(){
				this._active = false;
				if (this.state.containers.underfoot.children.indexOf(this.indicater)){
					this.state.containers.underfoot.removeChild(this.indicater);
				}
			},
			render: function(){
				if (this._active){
					this.indicater.position.x = this.get('xform.tx');
					this.indicater.position.y = this.get('xform.ty');
				}
			}
		});
	}
);
define('subzero/components/container',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('container', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			toggle: function(entity){
				this.set('sprite.frame', 1);
				this.state.swapInventory(entity, this.entity);
			}
		});		
	}
);
define('subzero/components/computer',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('computer', {
			init: function(entity, data){
				this._super(entity, data);
				this._open = false;
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.toggle);
			},
			deregister: function(state){
				this.off('interact', this.toggle);
				this._super(state);
			},
			toggle: function(){
				this.entity.trigger('anim.set', 'on');
				this.on('anim.done', function(){
					this.state.startCutscene();
					cutsceneState = this.state.game.getState('cutscene');
					cutsceneState.setDialog('Computer: 00101100110100110101001');
					this.entity.trigger('anim.set', 'off');
				}.bind(this), { once: true })
			}
		});		
	}
);
define('subzero/components/anim',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('anim', {
			init: function(entity, data){
				this._super(entity, data);
				this._tracks = data.tracks;
				this._currentTrack = null
				this._index=0;
				this._animTimeout = 0;
			},
			register: function(state){
				this._super(state);
				this.on('anim.set', this.setAnim);
			},
			deregister: function(state){
				this._super(state);
				this.off('anim.set', this.setAnim);
			},
			setAnim: function(anim){
				this._currentTrack = this._tracks[anim];
			},
			tick: function(delta){
				if (this._currentTrack!=null){
					this._animTimeout-=delta;
					if (this._animTimeout<=0){
						this._animTimeout=1/30;
						this._index++;
						if (this._index>=this._currentTrack.frames.length){
							if (this._currentTrack.once){
								this._index=0;
								this._currentTrack = null;
								this.entity.trigger('anim.done');
								return;
							} else {
								this._index = 0;
							}
						}
						this.set('sprite.frame', this._currentTrack.frames[this._index]);
					}
				}
				
			}
		});		
	}
);
define('subzero/components/item',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('item', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('item.item', data.item);
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(e){
				if (e.components.inventory){
					e.components.inventory.addItem(this.get('item.item'));
				}
				this.state.removeEntity(this.entity);
			},
			tick: function(delta){

			}
		});		
	}
);
define('subzero/components/equipable',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('equipable', {
			init: function(entity, data){
				this._super(entity, data);
				this._equiped = null;
			},
			register: function(state){
				this._super(state);
				this.on('item.equip', this.itemEquip)
				this.on('item.use', this.itemUse)
			},
			deregister: function(state){
				this._super(state);
				this.off('item.equip', this.itemEquip);
				this.off('item.use', this.itemUse)
			},
			itemEquip: function(item){
				this._equiped = item;
				this.entity.trigger('item.equiped', this._equiped);
			},
			itemUse: function(){
				if (this._equiped){
					inv = this.get('inventory.items');
					if (inv[this._equiped]>0){
						inv[this._equiped]--;
						//TODO: Replace with real item used code.
						var bomb = this.state.factory.create(this._equiped, {
							xform: {
								tx: this.get('xform.tx'),
								ty: this.get('xform.ty')
							}
						})
						this.state.addEntity(bomb);
						if (inv[this._equiped]<=0){
							this.itemEquip(null);
						}
					}
				}
			}

		});		
	}
);
define('subzero/components/switch',[
	'sge',
	'../component'
	], function(sge, Component){
		Component.add('switch', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('switch.on', data.on || false);
				this.set('switch.entity', data.entity);
			},
			register: function(state){
				this._super(state);
				this.on('interact', this.interact);
			},
			deregister: function(state){
				this._super(state);
				this.off('interact', this.interact);
			},
			interact: function(){
				this.set('switch.on', !this.get('switch.on'));
				this.update();
				var entityName = this.get('switch.entity');
				if (entityName){
					var entity = this.state.getEntity(entityName);
					if (entity){
						entity.trigger('interact');
					}
				}
			},
			update: function(){
				this.set('sprite.frame', this.get('switch.on') ? 1 : 0);
			}
		});		
	}
);
define('subzero/factory',[
	'sge',
	'./entity',
	'./components/sprite',
	'./components/rpgcontrols',
	'./components/chara',
	'./components/ai',
	'./components/physics',
	'./components/sound',
	'./components/bomb',
	'./components/emote',
	'./components/guardpost',
	'./components/goalpost',
	'./components/door',
	'./components/interact',
	'./components/highlight',
	'./components/container',
	'./components/computer',
	'./components/anim',
	'./components/item',
	'./components/equipable',
	'./components/switch'
	],function(sge, Entity){
		var deepExtend = function(destination, source) {
          for (var property in source) {
            if (source[property] && source[property].constructor &&
             source[property].constructor === Object) {
              destination[property] = destination[property] || {};
              arguments.callee(destination[property], source[property]);
            } else {
              destination[property] = source[property];
            }
          }
          return destination;
        };

		var _Factory = sge.Class.extend({
			init: function(){
				this.blueprints = {}
			},
			load: function(data){
				for (var prop in data) {
			      // important check that this is objects own property 
			      // not from prototype prop inherited
			      if(data.hasOwnProperty(prop)){
			        this.blueprints[prop] = data[prop];
			      }
			   }
			},
			has: function(typ){
				return (this.blueprints[typ]!==undefined);
			},
			create: function(typ, data){
				var tags = [];
				if (data===undefined){
					data = {}
				}

				if (this.blueprints[typ]==undefined){
					return;
				}

				var entityData = deepExtend({}, this.blueprints[typ]);

				if (data.meta!==undefined){
					if (data.meta.tag){
						tags = tags.concat(data.meta.tag);
					}
				}
				if (entityData.meta!==undefined){
					if (entityData.meta.tagsBase){
						tags = tags.concat(entityData.meta.tagsBase);
					}

					if (entityData.meta.inherit!==undefined){
						var inherit = entityData.meta.inherit;
						var bases = [typ, inherit];
						while (inherit!=null){
							baseData = this.blueprints[inherit];
							inherit = null;
							if (baseData.meta!==undefined){
								if (baseData.meta.tags){
									tags = tags.concat(baseData.meta.tags);
								}
								if (baseData.meta.inherit){
									inherit = baseData.meta.inherit;
									bases.push(inherit);
								}
							}
						}
						entityData = {};
						bases.reverse();
						while (bases.length){
							base = bases.shift();
							entityData = deepExtend(entityData, this.blueprints[base]);
						}
					}

				}
				
				entityData = deepExtend(entityData, data);
				

				if (entityData['meta']!==undefined){
					delete entityData['meta'];
				}
				var entity = Entity.Factory(entityData);
				entity.tags = entity.tags.concat(tags);
				return entity;
			}
		})
		Factory = new _Factory();
		return Factory;
});
define('subzero/social',[
	'sge',
	], function(sge){
		var SocialSystem = sge.Class.extend({
			init: function(){
				this._socialMap = [];
			},
			setMap : function(map){
				this.map = map;
				/*
				this.map.getTiles().forEach(function(t){
						return t.data.socialValue = t.layers.base==16 ? 1 : 0;
				});
				*/
				for (var i = this.map.width - 1; i >= 0; i--) {
					this.map.getTile(i,0).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, -1];
					this.map.getTile(i,this.map.height-1).data.socialValue=-1;
					this.map.getTile(i,0).data.socialVector = [0, 1];
				};
				for (var i=0; i<2;i++){
					this.diffuseMap();
				}
				this.calcGradient();
			},
			diffuseMap: function(){
				var origMap = this.map.getTiles().map(function(x){return x.data.socialValue});
				for (var x = 0; x<this.map.width; x++){
					for (var y=0; y<this.map.height; y++){

						var value = 0;
						var count = 0;

						for (var j=-1;j<2;j++){
							for(var k=-1;k<2;k++){
								var amt = this.getData(x+j,y+k, origMap);
								if (amt!=undefined){
									value += amt;
									count++;
								}
							}
						}
						this.map.getTile(x, y).data.socialValue = Math.max((value/count),this.getData(x,y, origMap));
					}
				}
			},
			calcGradient : function(){
				for (var x = 1; x<this.map.width-1; x++){

					for (var y=1; y<this.map.height-1; y++){
						
						var ax = x-1;
						var bx = x+1;

						var amtAx = this.map.getTile(ax,y).data.socialValue;
						var amtBx = this.map.getTile(bx,y).data.socialValue;
						
						var dx = (amtBx - amtAx) / 2;

						var ay = y-1;
						var by = y+1;

						var amtAy = this.map.getTile(x,ay).data.socialValue;
						var amtBy = this.map.getTile(x,by).data.socialValue;
						
						var dy = (amtBy - amtAy) / 2;

						var dist = Math.sqrt((dx*dx)+(dy*dy));
						if (dist==0){
							this.map.getTile(x,y).data.socialVector=[0,0];
						} else {
							this.map.getTile(x,y).data.socialVector=[dx/dist,dy/dist];
						}
					}
				}
			},
			getIndex : function(x, y){
	            var index = (y * this.map.width) + x;
	            if (x > this.map.width-1 || x < 0){
	                return null;
	            }
	            if (y > this.map.height-1 || y < 0){
	                return null;
	            }
	            return index;
	        },
	        getData : function(x, y, arr){
	            return arr[this.getIndex(x, y)];
	        },
	        getTileAtPos : function(x, y){
	        	return this.getTile(Math.floor(x / this.tileSize), Math.floor(y / this.tileSize))
	        },
		})

		return SocialSystem;
	}
);
define('subzero/hud',[
	'sge'
	], function(sge){
		var PlayerHUD = sge.Class.extend({
			init: function(state){
				this.pc = null;
				this.state = state;
				this.container = new PIXI.DisplayObjectContainer	();
			},
			setPC: function(pc){
				this.pc = pc;
				this.createDisplay();
				this.state.containers.hud.addChild(this.container);
				this.pc.on('item.equiped', this.updateItem.bind(this));
			},
			updateItem: function(item){
				console.log(item);
				this._equiped.setText('Equiped:' + item);
			},
			createDisplay: function(){
				this._equiped = new PIXI.BitmapText('Equiped: null', {font: '16px 8bit'});
				this.container.addChild(this._equiped);
			}
		})

		return PlayerHUD
	}
);
define('subzero/subzerostate',[
		'sge',
		'./tilemap',
		'./tiledlevel',
		'./entity',
		'./physics',
		'./factory',
		'./social',
		'./ai',
		'./hud'
	], function(sge, TileMap, TiledLevel, Entity, Physics, Factory, Social, AI, HUD){
		var SubzeroState = sge.GameState.extend({
			init: function(game){
				this._super(game);
				this._entities = {};
				this._entity_ids = [];
				this._entity_name = {};

				this._entity_spatial_hash = {}
				this._unspawnedEntities={}


				this.stage = new PIXI.Stage(0x000000);
				this.container = new PIXI.DisplayObjectContainer();
				this._scale = 2;
				//if (navigator.isCocoonJS){
					this.container.scale.x= window.innerWidth / game.width;
					this.container.scale.y= window.innerHeight / game.height;
				//}
				this.container.scale.x *= this._scale;
				this.container.scale.y *= this._scale
				this.containers={};
				this.containers.entities = new PIXI.DisplayObjectContainer();
				this.containers.map = new PIXI.DisplayObjectContainer();
				this.containers.overhead = new PIXI.DisplayObjectContainer();
				this.containers.underfoot = new PIXI.DisplayObjectContainer();
				this.containers.glow = new PIXI.DisplayObjectContainer();
				this.containers.hud = new PIXI.DisplayObjectContainer();
				this.container.addChild(this.containers.map);
				this.container.addChild(this.containers.hud);
				
				this.physics = new Physics();
				this.factory = Factory;
				this.social = new Social();
				this.hud = new HUD(this);
				var loader = game.loader;
				loader.loadJSON('content/manifest.json').then(this.loadManifest.bind(this));
			},
			winGame: function(){
				this.game.changeState('win');
			},
			openInventory: function(){
				this.game.getState('inventory').createMenu(this.getEntity('pc'));
				this.game.changeState('inventory');
			},
			swapInventory: function(a, b){
				this.game.getState('swap').createMenu(a, b);
				this.game.changeState('swap');
			},
			loseGame: function(){
				this.game.changeState('lose');
			},
			startCutscene: function(){
				this.game.changeState('cutscene');
			},
			loadManifest: function(manifest){
				console.log('Loaded Manifest')
				var loader = this.game.loader;
				var promises = [];
				if (manifest.sprites){
					manifest.sprites.forEach(function(data){
						promises.push(loader.loadSpriteFrames('content/sprites/' + data[0] +'.png',data[0], data[1][0],data[1][1]));
					})
				}
				if (manifest.fonts){
					manifest.fonts.forEach(function(data){
						promises.push(loader.loadFont('content/font/' + data + '.fnt'));
					}.bind(this))
				}
				if (manifest.images){
					manifest.images.forEach(function(data){
						promises.push(loader.loadTexture('content/' + data + '.png', data));
					}.bind(this))
				}
				if (manifest.entities){
					manifest.entities.forEach(function(data){
						promises.push(loader.loadJSON('content/entities/' + data +'.json').then(Factory.load.bind(Factory)));
					}.bind(this))
				}
				if (manifest.ai){
					manifest.ai.forEach(function(data){
						promises.push(loader.loadJSON('content/ai/' + data +'.json').then(AI.load.bind(AI)));
					}.bind(this))
				}
				if (manifest.audio){
				    createjs.Sound.removeAllSounds()
					manifest.audio.forEach(function(data){
						promises.push(loader.loadAudio('content/audio/' + data +'.wav', data));
					}.bind(this))
				}

				sge.When.all(promises).then(function(){
					console.log('Loaded Assets');
					loader.loadJSON('content/levels/' + this.game.data.map + '.json').then(function(data){
						this.loadLevelData(data);
					}.bind(this))
				}.bind(this));
			},
			loadLevelData : function(levelData){
				this.background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
				this.stage.addChild(this.background);
				this.stage.addChild(this.container);
				this.map = new TileMap(levelData.width, levelData.height, this.game.renderer);
				TiledLevel(this, this.map, levelData).then(function(){
					this.social.setMap(this.map);
					this.map.preRender();
					this.physics.setMap(this);
					var loader = this.game.loader;
					loader.loadJS('content/levels/' + this.game.data.map + '.js', null, {state : this}).then(this.loadLevelEvents.bind(this), this.initGame.bind(this));
				}.bind(this), 500);
			},
			loadLevelEvents: function(sandbox){
				sandbox();
				this.initGame();
			},
			changeLevel: function(map, location){
				console.log('Change Level', map)
				this.game.changeState('load');
				this.game.data.map = map;
				this.game.data.spawn = location;
				this.game.createState('game');
			},
			initGame: function(){

				var pc = this.getEntity('pc');
				this.pc = pc;
				if (this.pc){
					this.hud.setPC(pc);
					if (this.game.data.spawn){
						var spawnEntity = this.getEntity(this.game.data.spawn);
						this.pc.set('xform.tx', spawnEntity.get('xform.tx'));
						this.pc.set('xform.ty', spawnEntity.get('xform.ty'));
					}
				}

				this.containers.underfoot.mask = this.map.maskBase;
				this.containers.map.addChild(this.map.maskBase);

				var mask = new PIXI.Graphics();
				mask.beginFill()
				mask.drawRect(32, 32, 800, 480+64);
				mask.endFill();

				this.containers.entities.mask = this.map.maskCanopy;
				this.containers.map.addChild(this.map.maskCanopy);

				this.containers.map.addChild(this.map.container);
				this.containers.map.addChild(this.containers.underfoot);
				this.containers.map.addChild(this.containers.entities);
				this.containers.map.addChild(this.containers.overhead);
				this.containers.map.addChild(this.containers.glow);
				this.containers.map.position.x = this.game.width/(2*this._scale)-(this.map.width*this.map.tileSize*0.5);
				this.containers.map.position.y = this.game.height/(2*this._scale)-(this.map.height*this.map.tileSize*0.5);
				console.log('Starting Game')
				this.game.changeState('game');

			},
			tick: function(delta){
			    this._super(delta);
				
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.tick(delta);
				};
				this.physics.tick(delta);

				if (this.pc){
					this.containers.map.position.x = -this.pc.get('xform.tx')+this.game.width/(2*this._scale);
					this.containers.map.position.y = 32-this.pc.get('xform.ty')+this.game.height/(2*this._scale);
				}
				
				this.map.render();
				for (var i = this._entity_ids.length - 1; i >= 0; i--) {
					var e = this._entities[this._entity_ids[i]];
					e.render();
				};
				this.spriteSort(this.containers.entities);
			},

			spriteSort: function(parent) {
				var sortMe = parent.children;
			    for (var i = 0, j, tmp; i < sortMe.length; ++i) {
			      tmp = sortMe[i];
			      for (j = i - 1; j >= 0 && sortMe[j].position.y > tmp.position.y; --j)
			         parent.swapChildren(sortMe[j + 1], sortMe[j]);

			      sortMe[j + 1] = tmp;
			   }
			},

			render: function(){
				this.game.renderer.render(this.stage);
			},

			addEntity : function(e){
				var id = 0;
				while (this._entities[id]!==undefined){
					id++;
				}
				e.id = id;
				this._entity_ids.push(e.id);
				this._entities[e.id] = e;
				e.register(this);

				tx = e.get('xform.tx');
				ty = e.get('xform.ty');
				e.on('entity.moved', this._updateHash.bind(this));
				this._updateHash(e, tx, ty);
				return e;
			},
			
			removeEntity: function(e){
				e.deregister(this);
				var id = e.id;
				var idx = this._entity_ids.indexOf(e.id);
				this._entity_ids.splice(idx,1);
				tile = e.get('map.tile');
				if (tile){
					idx = tile.data.entities.indexOf(e);
					tile.data.entities.splice(idx, 1);
				}
				delete this._entities[id];
			},

			_updateHash: function(e, tx, ty){
				if (!e){
					return;
				}
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var hash = e.get('map.hash');
				var tile = null;
				
				if (hash != hx + '.' + hy){
					
					tile = e.get('map.tile');
					if (tile){
						idx = tile.data.entities.indexOf(e);
						tile.data.entities.splice(idx, 1);
					}
					e.set('map.hash', hx + '.' + hy)
					tile = this.map.getTile(hx, hy);
					if (tile){
						e.set('map.tile', tile);
						if (tile.data.entities==undefined){
							tile.data.entities=[];
						}
						tile.data.entities.push(e);
					}	
				}
			},
			
			findEntities: function(tx, ty, radius){
				var hx = Math.floor(tx/32);
				var hy = Math.floor(ty/32);
				var tileRad = Math.max(Math.ceil(radius/32),1);
				var sqrRad = (radius*radius);
				var tile = null;
				var entities = [];
				var dx, dy, es;
				for (var j=hx-tileRad;j<tileRad+1+hx;j++){
					for(var k=hy-tileRad;k<tileRad+1+hy;k++){
						tile = this.map.getTile(j,k);
						if (tile){
							es = (tile.data.entities || []).filter(function(e){
								dx = (e.get('xform.tx')-tx);
								dy = (e.get('xform.ty')-ty);
								e._findDist = (dx*dx)+(dy*dy);
								return ((dx*dx)+(dy*dy)<=sqrRad);
							});
							if (es){
								entities = entities.concat(es);
							}
						}
					}
				}
				return entities;
			},
			
			getEntity: function(name){
				return this._entity_name[name.replace(/@/,'')];
			},
			
			getEntities: function(query){

			},

			get: function(path){
				return this.game.data.persist[path]
			},

			set: function(path, value){
				return this.game.data.persist[path]=value;
			},
			startState: function(){
				window.onblur = function(){
                    this.game.changeState('paused')
                }.bind(this);
			},
			endState: function(){
				//window.onblue = null;
			}
		})

		return SubzeroState
	}
);
define('subzero/paused',[
        'sge',
        './config'
    ], function(sge, config){
    	PausedState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x66FF99);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;
            
                
                var background = new PIXI.Sprite.fromFrame('backgrounds/space_a');
                this.stage.addChild(background);

                var text = new PIXI.BitmapText('Paused', {font: '96px 8bit'});
                this.container.addChild(text);

                var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
                text.position.y = game.renderer.height - 64;
                this.container.addChild(text);

                this.stage.addChild(this.container);
            },
            tick: function(){
                if (this.input.isPressed('space')){
                    this.game.changeState('game');
                }
            },
            render: function(){
                this.game.renderer.render(this.stage);
            }
        });
		return PausedState;
	}
);
define('subzero/load',[
        'sge',
        './config'
    ], function(sge, config){
    	var LoadState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x66FF99);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;
            
                
                var background = new PIXI.Sprite.fromFrame('backgrounds/space_d');
                this.stage.addChild(background);

                var text = new PIXI.BitmapText('Loading', {font: '96px 8bit', align: 'center'});
                text.position.x = game.renderer.width / 2;
                text.position.y = game.renderer.height / 2;
                this.container.addChild(text);

                this.stage.addChild(this.container);
            },
            render: function(){
                this.game.renderer.render(this.stage);
            }
        });
		return LoadState;
	}
);
define('subzero/mainmenu',[
        'sge',
        './config'
    ], function(sge, config){
    	var MenuState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x66FF99);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;
            
                
                var background = new PIXI.Sprite.fromFrame('backgrounds/space_b');
                this.stage.addChild(background);

                var text = new PIXI.BitmapText('Subzero', {font: '96px 8bit', align: 'center'});
                text.position.x = game.renderer.width / 2;
                text.position.y = game.renderer.height / 2;
                this.container.addChild(text);

                var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
                text.position.y = game.renderer.height - 64;
                this.container.addChild(text);

                this.stage.addChild(this.container);
            },
            tick: function(){
                if (this.input.isPressed('space')){
                    this.game.createState('game');
                    this.game.changeState('load');
                    return;
                }
            },
            render: function(){
                this.game.renderer.render(this.stage);
            }
        });
		return MenuState;
	}
);
define('subzero/cutscene',[
        'sge',
        './config'
    ], function(sge, config){
    	var CutsceneState = sge.GameState.extend({
                init: function(game){
                    this._super(game);
                    this.stage = new PIXI.Stage(0x000000);
                    this.container = new PIXI.DisplayObjectContainer();
                    this._scale = 1;
                    this.container.scale.x= window.innerWidth / game.width;
                    this.container.scale.y= window.innerHeight / game.height;

                    this.background = new PIXI.Graphics();
                    this.background.beginFill('0x000000');
                    this.background.drawRect(0,0,game.width,game.height);
                    this.background.endFill()
                    this.background.alpha = 0.65;
                },
                tick: function(){
                    if (this.input.isPressed('space')){
                        this.game.changeState('game');
                    }
                },
                startState: function(){
                    this.gameState = this.game.getState('game');
                    this.gameState.stage.addChild(this.container);
                },
                endState: function(){
                    this.gameState.stage.removeChild(this.container);
                },
                render: function(){
                    this.game.renderer.render(this.gameState.stage);
                },
                setDialog: function(dialog){
                    while (this.container.children.length){
                        this.container.removeChild(this.container.children[0]);
                    }
                    var text = new PIXI.BitmapText(dialog, {font: '32px 8bit'});
                    text.position.y = this.game.height / (2*this._scale);
                    text.position.x = 32;
                    this.container.addChild(this.background)
                    this.container.addChild(text);
                }
            })
		return CutsceneState;
	}
);
define('subzero/states',[
        'sge',
        './config'
    ], function(sge, config){
    	var WinState = sge.GameState.extend({
                init: function(game){
                    this._super(game);
                    this.stage = new PIXI.Stage(0x66FF99);
                    this.container = new PIXI.DisplayObjectContainer();
                    this._scale = 1;
                    this.container.scale.x= window.innerWidth / game.width;
                    this.container.scale.y= window.innerHeight / game.height;
                
                    
                    var background = new PIXI.Sprite.fromFrame('backgrounds/space_d');
                    this.stage.addChild(background);

                    var text = new PIXI.BitmapText('Win', {font: '96px 8bit', align: 'center'});
                    text.position.x = game.renderer.width / 2;
                    text.position.y = game.renderer.height / 2;
                    this.container.addChild(text);

                    var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
                    text.position.y = game.renderer.height - 64;
                    this.container.addChild(text);

                    this.stage.addChild(this.container);
                },
                tick: function(){
                    if (this.input.isPressed('space')){
                        this.game.changeState('menu');
                        return;
                    }
                },
                render: function(){
                    this.game.renderer.render(this.stage);
                }
            });
        var LoseState = sge.GameState.extend({
                init: function(game){
                    this._super(game);
                    this.stage = new PIXI.Stage(0x66FF99);
                    this.container = new PIXI.DisplayObjectContainer();
                    this._scale = 1;
                    this.container.scale.x= window.innerWidth / game.width;
                    this.container.scale.y= window.innerHeight / game.height;
                
                    
                    var background = new PIXI.Sprite.fromFrame('backgrounds/space_e');
                    this.stage.addChild(background);

                    var text = new PIXI.BitmapText('Lose', {font: '96px 8bit', align: 'center'});
                    text.position.x = game.renderer.width / 2;
                    text.position.y = game.renderer.height / 2;
                    this.container.addChild(text);

                    var text = new PIXI.BitmapText('Press Space to Start Game', {font: '32px 8bit', align:'center'});
                    text.position.y = game.renderer.height - 64;
                    this.container.addChild(text);

                    this.stage.addChild(this.container);
                },
                tick: function(){
                    if (this.input.isPressed('space')){
                        this.game.changeState('menu');
                        return;
                    }
                },
                render: function(){
                    this.game.renderer.render(this.stage);
                }
            });
		return {
			WinState : WinState,
			LoseState : LoseState
		}
	}
);
define('subzero/inventory',[
	'sge',
	'./config',
	'./component'
	], function(sge, config, Component){
		Component.add('inventory', {
			init: function(entity, data){
				this._super(entity, data);
				this.set('inventory.items', {});
				if (data.items){
					data.items.split(',').forEach(function(item){
						this.addItem(item);
					}.bind(this));
				}
			},
			register: function(state){
				this._super(state);
			},
			addItem: function(item){
				var inv = this.get('inventory.items');
				if (inv[item]==undefined){
					inv[item]=1;
				} else {
					inv[item]++;
				}
				this.set('inventory.items', inv);
			},
			removeItem: function(item){
				var inv = this.get('inventory.items');
				if (inv[item]==undefined){
					inv[item]=0;
				} else {
					inv[item]--;
				}
				if (inv[item]<=0){
					delete inv[item];
				}
				this.set('inventory.items', inv);
			}
		});

		var MenuItem = sge.Class.extend({
            init: function(data){
            	this.entity = data[0];
            	this.key = data[1];
            	this._counting = false;
            	if (typeof data[0]!==typeof "string"){
            		this._counting = true;
                	this._count = this.entity.get('inventory.items')[this.key];
        		}
                this._callback = data[2];
                this.container = new PIXI.DisplayObjectContainer();
                this.background = new PIXI.Graphics();
                this.background.lineStyle(4, config.colors.primaryDark, 1);
                this.background.drawRect(0,0, 250, 32);
                this.text = new PIXI.BitmapText(this.key, {font: '24px 8bit'});
                this.text.position.y = 4;
                this.text.position.x = 8;
                
                this.container.addChild(this.background);
                this.container.addChild(this.text);

                if (this._count!==undefined&&this._count!==null){
                    this.count = new PIXI.BitmapText('x' + this._count, {font: '24px 8bit'});
                    this.count.position.y = 4;
                    this.count.position.x = 210;
                    this.container.addChild(this.count);
                }
            },
            select: function(){
                this._selected = true
            },
            unselect: function(){
                this._selected = false
            },
            update: function(){
            	if (this._counting){
	            	this._count = this.entity.get('inventory.items')[this.key];
		        	this.count.setText('x' + this._count)
		        }
                if (this._selected){
                    //this.container.position.x = 24;
                    this.background.lineStyle(4, config.colors.complementBright, 1);
                    this.background.drawRect(0,0, 250, 32);
                } else {
                    this.container.position.x = 0;
                    this.background.lineStyle(4, config.colors.primaryDark, 1);
                    this.background.drawRect(0,0, 250, 32);
                }
            },
            callback: function(){
                this._callback();
            }
        });

		var InventoryState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;

                this.background = new PIXI.Graphics();
                this.background.beginFill('0x000000');
                this.background.drawRect(0,0,game.width,game.height);
                this.background.endFill()
                this.background.alpha = 0.65;
            
                this.container.addChild(this.background);

                this._index = 0;
                
                this.menuContainer = null;
                
                this._itemText = ['','','','',''];
                this.items = [];
            },

            createMenu: function(entity){
                var inv = entity.get('inventory.items');
                var keys = Object.keys(inv);
                var items = keys.map(function(key){
                    return [entity, key, function(){
                        entity.trigger('item.equip', key);
                        this.quit();
                    }.bind(this)];
                }.bind(this));
                var menuContainer = new PIXI.DisplayObjectContainer();
                for (var i=0;i<items.length;i++){
                    var item = new MenuItem(items[i]);
                    item.container.position.y = i * 40;
                    menuContainer.addChild(item.container);
                    this.items.push(item);
                }
                var item = new MenuItem(['Quit', 'Quit', function(){
                    this.quit();
                }.bind(this)]);
                item.container.position.y = i * 40;
                menuContainer.addChild(item.container);
                this.items.push(item);
                this.container.addChild(menuContainer);
                this.menuContainer = menuContainer;
                this.menuContainer.position.x = 64;
                this.menuContainer.position.y = 64;
                this.updateMenu();
            },
            quit: function(){
                this.game.changeState('game');
            },
            tick: function(){
                if (this.input.isPressed('up')){
                    this.up();
                }

                if (this.input.isPressed('down')){
                    this.down();
                }

                if (this.input.isPressed('enter') || this.input.isPressed('space')){
                    this.items[this._index].callback();
                }
            },

            up: function(){
                this._index--;
                if (this._index<0){
                    this._index=0;
                }
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            down: function(){
                this._index++;
                if (this._index>=this.items.length){
                    this._index=this.items.length-1;
                }
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            updateMenu: function(){
                this.items.forEach(function(i){i.unselect()});
                this.items[this._index].select();
                this.items.forEach(function(i){i.update()});
                
            },

            resetMenu: function(){
            	this._index = 0;
            	this.items = [];
            	this.container.removeChild(this.menuContainer);
                this.menuContainer=null;
            },

            startState: function(){
            	
                this.gameState = this.game.getState('game');
                this.gameState.stage.addChild(this.container);
            },
            endState: function(){
                this.gameState.stage.removeChild(this.container);
                this.resetMenu();
                
            },
            render: function(){
                this.game.renderer.render(this.gameState.stage);
            }
        })

        var InventorySwapState = sge.GameState.extend({
            init: function(game){
                this._super(game);
                this.stage = new PIXI.Stage(0x000000);
                this.container = new PIXI.DisplayObjectContainer();
                this._scale = 1;
                this.container.scale.x= window.innerWidth / game.width;
                this.container.scale.y= window.innerHeight / game.height;

                this.background = new PIXI.Graphics();
                this.background.beginFill('0x000000');
                this.background.drawRect(0,0,game.width,game.height);
                this.background.endFill()
                this.background.alpha = 0.65;
            
                this.container.addChild(this.background);

                this._index = [0,0];
                
                this.menuContainer = null;
                
                this._itemText = ['','','','',''];
                this.items = [];
            },

            createMenu: function(entityA, entityB){
            	this._a = entityA;
            	this._b = entityB;
                var invA = entityA.get('inventory.items');
                var keysA = Object.keys(invA);
                var invB = entityB.get('inventory.items');
                var keysB = Object.keys(invB);
                var itemsA = keysA.map(function(key){
                    return [entityA, key, function(){
                        while (invA[key]){
                        	entityA.components.inventory.removeItem(key);
                        	entityB.components.inventory.addItem(key);
                        }
                        this.rebuildMenu();
                    }.bind(this)];
                }.bind(this));
                
                var itemsB = keysB.map(function(key){
                    return [entityB, key, function(){
                        while (invB[key]){
                        	entityB.components.inventory.removeItem(key);
                        	entityA.components.inventory.addItem(key);
                        }
                        this.rebuildMenu();
                    }.bind(this)];
                }.bind(this));
                var maxcount = Math.max(itemsA.length, itemsB.length);
                for (var i=0;i<maxcount;i++){
                	this.items.push([null,null]);
                }
                var menuContainerA = new PIXI.DisplayObjectContainer();
                var menuContainerB = new PIXI.DisplayObjectContainer();
                for (var i=0;i<itemsA.length;i++){
                    itemA = new MenuItem(itemsA[i]);
                    itemA.container.position.y = i * 40;
                    menuContainerA.addChild(itemA.container);
                    if (this.items[i]===undefined){
                    	this.items[i] = {}
                    }
                    this.items[i][0] = itemA;
                }

                for (var i=0;i<itemsB.length;i++){
                    itemB = new MenuItem(itemsB[i]);
                    itemB.container.position.y = i * 40;
                    menuContainerB.addChild(itemB.container);
                    if (this.items[i]===undefined){
                    	this.items[i] = {}
                    }
                    this.items[i][1] = itemB;
                }

                var item = new MenuItem(['Quit', 'Quit', function(){
                    this.quit();
                }.bind(this)]);
                item.container.position.y = maxcount * 40;
                menuContainerA.addChild(item.container);
                this.items[maxcount] = [item,item];
                this.container.addChild(menuContainerA);
                this.menuContainerA = menuContainerA;
                this.menuContainerA.position.x = 64;
                this.menuContainerA.position.y = 64;

                this.container.addChild(menuContainerB);
                this.menuContainerB = menuContainerB;
                this.menuContainerB.position.x = 320;
                this.menuContainerB.position.y = 64;
                this.updateMenu();
            },
            quit: function(){
                this.game.changeState('game');
            },
            tick: function(){
                if (this.input.isPressed('up')){
                    this.up();
                }

                if (this.input.isPressed('down')){
                    this.down();
                }

                if (this.input.isPressed('left')){
                    this.left();
                }

                if (this.input.isPressed('right')){
                    this.right();
                }

                if (this.input.isPressed('enter') || this.input.isPressed('space')){
                    this.items[this._index[1]][this._index[0]].callback();
                }
            },

            up: function(){
            	var y = this._index[1];
                y--;
                if (y<0){
                    y=0;
                }
                this._index[1] = y;
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            down: function(){
            	var y = this._index[1]
                y++;
                if (y>=this.items.length){
                    y=this.items.length-1;
                }
                this._index[1] = y;
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            left: function(){
            	var x = this._index[0];
                x--;
                if (x<0){
                    x=0;
                }
                this._index[0] = x;
                this.updateMenu();
                createjs.Sound.play('select.up');
            },

            right: function(){
            	var x = this._index[0];
                x++;
                if (x>=this.items.length){
                    x=this.items.length-1;
                }
                this._index[0] = x;
                this.updateMenu();
                createjs.Sound.play('select.down');
            },

            updateMenu: function(){
                this.items.forEach(function(t){
                	if (t[0]) {
 	               		t[0].unselect();
					}
                	if (t[1]) {
 	               		t[1].unselect();
					}
               	});

               	var item = this.items[this._index[1]][this._index[0]];
               	if (item){
               		item.select();
               	}
                this.items.forEach(function(t){
                	if (t[0]) {
 	               		t[0].update();
					}
                	if (t[1]) {
 	               		t[1].update();
					}
               	});
            },

            rebuildMenu: function(){
            	this.resetMenu();
            	this.createMenu(this._a, this._b);
            },

            resetMenu: function(){
            	this._index = [0,0];
            	this.items = [];
            	this.container.removeChild(this.menuContainerA);
            	this.container.removeChild(this.menuContainerB);
                this.menuContainerA=null;
                this.menuContainerB=null;
            },

            startState: function(){
            	
                this.gameState = this.game.getState('game');
                this.gameState.stage.addChild(this.container);
            },
            endState: function(){
                this.gameState.stage.removeChild(this.container);
                this.resetMenu();
                
            },
            render: function(){
                this.game.renderer.render(this.gameState.stage);
            }
        })

		return {
			InventoryState : InventoryState,
			InventorySwapState : InventorySwapState
		}
	}
);
define('subzero/main',[
        'sge',
        './config',
        './subzerostate',
        './paused',
        './load',
        './mainmenu',
        './cutscene',
        './states',
        './inventory',
    ], function(sge, config, SubzeroState, PausedState, LoadState, MenuState, CutsceneState, states, inventory){
        
        var createGame = function(options){

            var loader = new sge.Loader();
            var promises = [];
            promises.push(loader.loadFont('content/font/standard_white.fnt'))
            promises.push(loader.loadTexture('content/backgrounds/space_a.png', 'backgrounds/space_a'))
            promises.push(loader.loadTexture('content/backgrounds/space_b.png', 'backgrounds/space_b'))
            promises.push(loader.loadTexture('content/backgrounds/space_c.png', 'backgrounds/space_c'))
            promises.push(loader.loadTexture('content/backgrounds/space_d.png', 'backgrounds/space_d'))
            promises.push(loader.loadTexture('content/backgrounds/space_e.png', 'backgrounds/space_e'))
            sge.When.all(promises).then(function(){

                game = new sge.Game();
                game.loader = loader;
                game.setStateClass('paused', PausedState);
                game.createState('paused');
                
                game.setStateClass('menu', MenuState);
                game.createState('menu');

                game.setStateClass('load', MenuState);
                game.createState('load');
                
                game.setStateClass('win', states.WinState);
                game.createState('win');
                
                game.setStateClass('lose', states.LoseState);
                game.createState('lose');
                
                game.setStateClass('cutscene', CutsceneState);
                game.createState('cutscene');

                game.setStateClass('inventory', inventory.InventoryState);
                game.createState('inventory');

                game.setStateClass('swap', inventory.InventorySwapState);
                game.createState('swap');

                game.setStateClass('game', SubzeroState);
                game.start(options);
                game.changeState('menu')
                

            })
            
        }

        return {
            createGame : createGame
        }
    }
);
define('subzero', ['subzero/main'], function (main) { return main; });
