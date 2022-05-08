//	导出层次结构数据
export async function getHierarchicalData (fileName) {
	//	全局的graph对象
	var data = await d3.json('hierarchicalData/' + fileName)
	return data
}