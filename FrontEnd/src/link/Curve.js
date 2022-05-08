//	定义curve内部的参数
export function Curve (beginPos, endPos) {
	this.beginPos = beginPos
	this.endPos = endPos
}
//	定义circle的prototype, 即rect对象内部的方法
Curve.prototype = {
	init: function() {
		
	},
	updateData: function() {
		
	},
	generatePath: function () {
		let PosData = {source: this.beginPos, target: this.endPos}
        let lineGenerator = d3.linkVertical()
        let lineData = lineGenerator(PosData)
        return lineData
	},
	generatePolarPath: function() {
		let PosData = {source: this.beginPos, target: this.endPos}
        let lineGenerator = d3.linkVertical()
        let lineData = lineGenerator(PosData)
        return lineData
	}
}
