//	path的宽度可能映射层级，path的宽度需要与所绘制的canvas大小相关
export function getLinkStrokeWidth (beginNodeObj, endNodeObj, beginNodeDSLObj, endNodeDSLObj, 
		treeViewWidth, treeViewHeight, treeNodeArray) {
	//	link的style如果父亲节点和孩子节点都存在link，那么link的style是跟随父亲节点的，
	//	否则link的style跟随孩子节点
	//	link的宽度与节点的数量也有关系
	let beginLinkType = beginNodeDSLObj.Element.Link
	let endLinkType = endNodeDSLObj.Element.Link
	let linkDSLObj = beginNodeDSLObj
	if ((beginLinkType === 'hidden') && (endLinkType !== 'hidden')) {
		linkDSLObj = endNodeDSLObj
	}
	let linkWidthType = linkDSLObj.Element.LinkWidth
	//	TODO
	let ratio = linkDSLObj.Element.LinkWidthRatio
	if (typeof(ratio) === 'undefined') {
		ratio = 1
	}
	if (linkWidthType === 'depth') {
		let maximumLinkWidth = treeViewWidth / 40
		maximumLinkWidth = maximumLinkWidth * ratio
		let depth = endNodeObj.depth
		return maximumLinkWidth / depth
	} else if (linkWidthType === 'adaptive') {
			//	常数的link的宽度
		let adaptiveLinkWidth = treeViewWidth/200<2?2:treeViewWidth/200
		adaptiveLinkWidth = adaptiveLinkWidth * ratio
		return adaptiveLinkWidth
	} else if (linkWidthType === 'value') {
		let maximumLinkWidth = treeViewWidth / 20
		let minimumLinkWidth = treeViewWidth / 100
		let maxvalue = treeNodeArray[0].data.value
	  	let minvalue = maxvalue	
	  	for (let i=0;i<treeNodeArray.length;i++) {
		   	if (minvalue > treeNodeArray[i].data.value) {
		     	minvalue = treeNodeArray[i].data.value
		   	}
		}
		let widthLinearScale = d3.scaleLinear()
			.domain([minvalue, maxvalue])
			.range([minimumLinkWidth, maximumLinkWidth])
		return widthLinearScale(endNodeObj.value)
	}
}