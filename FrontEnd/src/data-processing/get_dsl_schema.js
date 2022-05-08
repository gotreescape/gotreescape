//	导出层次结构数据
export async function getDSLSchema () {
	//	全局的graph对象
	var dslSchema = await d3.json('config/schema_final.json')//.json
	return dslSchema
}
