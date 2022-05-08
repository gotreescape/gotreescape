//	计算层次结构数据的节点数量以及深度信息
export function getTreeDataInfo (tree_json, username, filename) {
	var treeObj = d3.hierarchy(tree_json)
	var nodesArray = []
	appendNodeObj(treeObj, nodesArray)
	let nodeNum = nodesArray.length
	let treeDepth = 0
	for (let i = 0;i < nodesArray.length; i++) {
		let nodeDepth = nodesArray[i].depth
		if(nodeDepth > treeDepth) {
			treeDepth = nodeDepth
		}
	}
	let treeInfo = { 
		nodenum: nodeNum, 
		depth: (treeDepth + 1),
		treedata: tree_json,
		date: new Date().toISOString().split('T')[0],
		username: username,
		filename: filename
	}
	return treeInfo
}
//	传入层次结构数据，计算层次结构数据中节点的属性值
function appendNodeObj (nodes, nodesArray) {
	let children = nodes.children
	nodesArray.push(nodes)
	if (typeof(children) !== 'undefined') {
		for (let i = 0; i < children.length; i++) {
			appendNodeObj(children[i], nodesArray)
		}
	}
}
