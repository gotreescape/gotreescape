//  导出层次结构数据
export async function getTreeVisCollection() {
    //  全局的graph对象
    console.log('getTreeVisCollection')
    // var treevisCollection = await d3.text('treevisCollection/dsl_collection_314640.txt')
    var treevisCollection = await d3.text('treevisCollection/dsl_collection_62340.txt')
    return treevisCollection
}