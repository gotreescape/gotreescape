//  如果不存在节点，连边或者坐标系的参数，就自动增加这些参数
export function addDefaultCoordElement(dslContentObject) {
  let dslContentObjectWithDefault = JSON.parse(JSON.stringify(dslContentObject))
  for (let item in dslContentObjectWithDefault) {
      if(!('Element' in dslContentObjectWithDefault[item])) {
        dslContentObjectWithDefault[item].Element = {}
      }
      //  element的赋值始终未rectangle
      if (!('Node' in dslContentObjectWithDefault[item].Element)) {
        dslContentObjectWithDefault[item].Element.Node = 'rectangle'
      }
      if (!('Link' in dslContentObjectWithDefault[item].Element)) {
        dslContentObjectWithDefault[item].Element.Link = 'hidden'
      }
      if (!('CoordinateSystem' in dslContentObjectWithDefault[item])) {
        dslContentObjectWithDefault[item].CoordinateSystem = {}
        dslContentObjectWithDefault[item].CoordinateSystem.Category = 'cartesian'
      }
  }
  return dslContentObjectWithDefault
}
