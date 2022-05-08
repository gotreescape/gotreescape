//	定义rect内部的参数
export function Rect (x, y, width, height, id, path) {
	this.width = width;
	this.height = height;
	this.x = x;
	this.y = y;
	this.id = id;
	//	初始化rect对象的path路径
	this.path = path;
}
//	定义rect的prototype, 即rect对象内部的方法
Rect.prototype = {
	init: function() {

	},
	updateData: function() {

	}
}
