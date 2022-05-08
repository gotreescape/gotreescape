//	定义circle内部的参数
export function Circle (pos, radius) {
	this.x = pos.x;
	this.y = pos.y;
	this.radius = radius;
}
//	定义circle的prototype, 即rect对象内部的方法
Circle.prototype = {
	init: function() {
		
	},
	updateData: function() {
		
	},
	generatePath: function (){
		let rectPathObj = d3.arc()
          .innerRadius(0)
          .outerRadius(this.radius)
          .startAngle(-Math.PI)
          .endAngle(Math.PI)
        return rectPathObj()
	}
}
