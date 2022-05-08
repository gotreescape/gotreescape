//	定义Straight内部的参数
export function Straight (beginPos, endPos) {
	this.beginPos = beginPos
	this.endPos = endPos
}
//	定义circle的prototype, 即rect对象内部的方法
Straight.prototype = {
	init: function() {
	},
	updateData: function() {
	},
	generatePath: function () {
		let PosData = []
        PosData.push(this.beginPos)
        PosData.push(this.endPos)
        let lineGenerator = d3.line()
        let lineData = lineGenerator(PosData)
        return lineData
	},
	generatePolarPath: function() {
		return this.generatePath()
	}
}
