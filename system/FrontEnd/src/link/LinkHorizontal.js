//	定义LinkHorizontal内部的参数
export function LinkHorizontal (beginPos, endPos) {
	this.beginPos = beginPos
	this.endPos = endPos
}
//	定义circle的prototype, 即rect对象内部的方法
LinkHorizontal.prototype = {
	init: function() {
		
	},
	updateData: function() {
		
	},
	generatePath: function () {
		let PosData = {source: this.beginPos, target: this.endPos}
        let lineGenerator = d3.linkHorizontal()
        let lineData = lineGenerator(PosData)
        return lineData
	},
	generatePolarPath: function() {
		return this.generatePath()
	}
}
