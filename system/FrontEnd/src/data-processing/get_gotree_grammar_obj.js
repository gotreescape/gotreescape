//  导出层次结构数据
export async function getGoTreeGrammarObj(dslIndex) {
    //  全局的graph对象
    console.log('getGoTreeGrammarObj')
    let folderName = Math.round(dslIndex / 10000)
    var data = await d3.json('projectionResults/' + folderName + '/' + dslIndex + '.json')
    return data
}