define(['sge/class'],
	function(Class){
		console.log('Node')

		var SOCKETWIDTH=12;

		var tool = 'select'; // select, connect.
		var toolData = {};
		var draw = SVG('canvas');

		var Connection = Class.extend({
			init: function(a, indexOut, b){
				this._a = a;
				this._aIndex = indexOut;
				this._b = b;
				this._a._connections.push(this);
				this._b._connections.push(this);
				this._line = draw.line(0,0,1,1).attr({ fill: 'none', stroke: '#000', 'stroke-width': 4 });
				this.update();
			},
			update: function(){
				this._line.attr({
					x1: this._a._group.x() + this._a._outputShapes[this._aIndex].x() + SOCKETWIDTH/2,
					y1: this._a._group.y() + this._a._outputShapes[this._aIndex].y() + SOCKETWIDTH/2
				});
				this._line.attr({
					x2: this._b._group.x() + this._a._inputShape.x() + SOCKETWIDTH/2,
					y2: this._b._group.y() + this._a._inputShape.y() + SOCKETWIDTH/2
				});
			},
			remove: function(){
				this._a._connections.splice(this._a._connections.indexOf(this), 1);
				this._b._connections.splice(this._b._connections.indexOf(this), 1);
				this._line.remove();
			}
		})

		var Node = Class.extend({
			init: function(){
				this._inputs = [];
				this._outputs = [];
				this._connections = [];

				this._group = draw.group();
				var bg = draw.rect(180, 90);
				this._group.add(bg);

				var title = draw.text('Title').fill('#FFF').x(8);
				this._group.add(title);
				title.dblclick(function(){
					var tmp = prompt('Node Title');
					title.text(tmp);
				})

				this._group.draggable();
				this._group.dragmove = this.onMove.bind(this);
				this._outputShapes = [];
				[0,1,2].forEach(function(i){
					var outputShape = draw.rect(SOCKETWIDTH,SOCKETWIDTH).y(16 + (i * 24)).x(180);
					this._group.add(outputShape);
					this._outputShapes.push(outputShape);
					outputShape.click(function(){
						this.startConnectOutput(i);
					}.bind(this));
				}.bind(this));

				this._inputShape = draw.rect(SOCKETWIDTH,SOCKETWIDTH).y(24).x(-SOCKETWIDTH);
				this._inputShape.click(this.startConnectInput.bind(this));
				this._group.add(this._inputShape);
			},
			startConnectOutput: function(idx){
				if (tool!=='select'){
					return;
				}
				var connection = this._connections.filter(function(conn){return conn._aIndex==idx});
				if (connection.length>0){
					connection[0].remove();
				} else {
					var shape = this._outputShapes[idx];
					tool = 'connect';
					toolData = {node: this, index : idx};
					shape.fill('#F60');
				}
			},
			endConnectOutput: function(idx){
				var shape = this._outputShapes[idx];
				shape.fill('#000');
			},
			startConnectInput: function(){
				if (tool!=='connect'){
					return;
				}
				var shape = this._inputShape;
				new Connection(toolData.node, toolData.index, this);
				toolData.node.endConnectOutput(toolData.index);
				tool='select';
			},
			onMove: function(){
				for (var i = this._connections.length - 1; i >= 0; i--) {
					this._connections[i].update();
				};
			}
		})
		return {
			Node : Node
		}
	}
)