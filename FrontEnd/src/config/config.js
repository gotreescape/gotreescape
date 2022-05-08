export function getConfig () {
	//	全部的配置文件
	let config = {
		treeDataArray: [{
		  fileName: 'flare.json',
		  nodeNum: 100,
		  depth: 5
		}, {
		  fileName: 'flare-vis.json',
		  nodeNum: 100,
		  depth: 5
		}, {
		  fileName: 'tmp50.json',
		  nodeNum: 120,
		  depth: 3
		}, {
		  fileName: 'binaryTree.json',
		  nodeNum: 120,
		  depth: 3
		}],
		initTreeDataName: 'flare-vis.json',
		defaultLinkWidth: 5, // 默认的连边的宽度
		defaultMaxLinkWidth: 30, //	最大的连边的宽度
		//	不同坐标系的DSL数组
		cartesianDSLArray: ['ArcTree', 'BCTh', 'BCTw', 'BeamTree', 'BeamTreeV', 
			'CurveTree', 'GoTree1', 'GoTree3', 'IciclePlot', 'IPTP', 
			'NodeLink', 'NodeLink1', 'PedVis', 'Dendrogram', 'TreemapSlice', 
			'TreemapSliceDice'],
		polarDSLArray: ['GoTree2', 'Sunburst1', 'Sunburst'],
		//	选择到DSL list视图的DSL数组
		selectedDSLArray: ['ArcTree', 'CurveTree', 'NodeLink', 'Sunburst'],
	}
	return config
}
