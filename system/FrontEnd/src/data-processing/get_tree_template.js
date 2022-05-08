//	导出层次结构数据
export async function getTreeTemplate (fileName) {
	//	全局的graph对象
	var treeTemplateObj = await d3.json('template/' + fileName)
	return treeTemplateObj
}