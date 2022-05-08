import translation from './translation'
import solveMatrix from './solveMatrix'
import resultTransform from './resultTransform'
export default function (treeUnit, layouts, m) {
    let treeData = treeUnit.data
    let treeDsl = treeUnit.dsl

    // console.log('treeData', treeData, 'treeDsl', treeDsl, 'layouts', layouts)
    // translation grammar -> Matrix
    let constraints = translation(treeData, treeDsl, layouts)
    // solve Matrix
    // constraint.A 和 constraint.B 分别是AX = B的两个矩阵，m是线性求解器
    let result = solveMatrix(constraints.A, constraints.B, m)
    // format
    let layout = resultTransform(result, treeData, constraints.widthWithValue, constraints.heightWithValue, constraints.isCompatible)
    return layout
}