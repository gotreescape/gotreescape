//  提取传递的treeNodeIndex与dsl的对应文件
export function extractTreeIndexWithDSL (treeIndexWithDefaultDSL, nodeArray) {
  let treeIndexWithDSL = {}
  for (let nI = 0; nI < nodeArray.length; nI++) {
    let treeData = nodeArray[nI].data
    let index = treeData.index
    //  不是所有的节点存在dsl对象，需要判断节点中是否存在dsl对象
    if (typeof(treeIndexWithDefaultDSL[index]) !== 'undefined') {      
      treeIndexWithDSL[index] = treeIndexWithDefaultDSL[index]
    } else {
      //  如果在treeData上不包含dsl对象， 那么将其设置为default的DSL
      treeIndexWithDSL[index] = treeIndexWithDefaultDSL.default
    }        
  }
  return treeIndexWithDSL
}