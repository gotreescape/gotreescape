//	定义的放置视觉元素的坐标系
export function Cartesian (origin = {x: 0, y: 0}) {
	this.x = origin.x;
	this.y = origin.y;
}
//	定义rect的prototype, 即rect对象内部的方法
Cartesian.prototype = {
	init: function() {

	},
	updateData: function() {

	},
	//  计算得到icicle plot的path路径
  	generatePath: function (nodePosArray) {
    	let lineFunction = d3.line()
                        .x(function(d) { return d.x; })
                        .y(function(d) { return d.y; })
    	let rectPathObj = lineFunction(nodePosArray)
    	return rectPathObj
 	}
}
