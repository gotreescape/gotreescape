//  定义的放置视觉元素的坐标系
export function Polar (polarAxis, polarInnerRadius, polarStartAngle, polarCenterAngle, polarCenterPara, polarDirection) {
  this.polarAxis = polarAxis
  //  极坐标系下的中心环形的半径
  this.polarInnerRadius = polarInnerRadius
  //   极坐标系的起始角度
  this.polarStartAngle = polarStartAngle * 2
  //  极坐标系下的中心的角度
  this.polarCenterAngle = polarCenterAngle
  //  极坐标系下中心的位置
  this.polarCenterPara = polarCenterPara
  //  指定极坐标系环轴的方向
  this.polarDirection = polarDirection
}
//  定义Polar coordinate system的prototype, 即rect对象内部的方法
Polar.prototype = {
  //  更新数据
  updateData: function(SubTreeData) {
    //  更新subtree的数据
    this.SubTreeData = SubTreeData
    //  初始化极坐标中心
    this.initOrigin()
    //  初始化比例尺
    this.initScale()
  },
  //  更新计算的比例尺
  initScale: function() {
    let SubTreeData = this.SubTreeData
    //  因为变成环形之后发生了重复，所以需要将距离 / 2
    let rRange = SubTreeData.TreeWidth > SubTreeData.TreeHeight ? SubTreeData.TreeHeight / 2 : SubTreeData.TreeWidth / 2
    // let rRange = SubTreeData.TreeWidth > SubTreeData.TreeHeight ? SubTreeData.TreeHeight / 2 : SubTreeData.TreeWidth / 2
    let angleScale = this.polarDirection === "clockwise" ? 
      d3.scaleLinear().range([Math.PI * (this.polarCenterAngle + this.polarStartAngle), Math.PI * (-this.polarCenterAngle + this.polarStartAngle)]):
      d3.scaleLinear().range([Math.PI * (-this.polarCenterAngle + this.polarStartAngle), Math.PI * (this.polarCenterAngle + this.polarStartAngle)])
    let rScale = d3.scaleLinear().range([rRange * this.polarInnerRadius, rRange])
    if (this.polarAxis === 'y-axis') {
      //  极轴是纵轴, 那么表示角度的轴是横轴，使用width进行计算
      //  因为angle所构成的是一个圆，处在圆的不同角度是具有相同地位的
      angleScale.domain([this.x, this.x + SubTreeData.TreeWidth])
      //  r的取值范围就与坐标轴origin的位置相关, r的0位置映射的是中心节点的位置，rRange的位置是距离中心节点最远的位置
      if (this.polarCenterPara === 'top') {
        //  如果当前的极坐标系的中心是在可视化形式的上方
        rScale.domain([this.y, Math.abs(this.y + SubTreeData.TreeHeight)])
      } else if (this.polarCenterPara === 'bottom') {
        //  如果极坐标系的中心在可视化形式的下方
        rScale.domain([this.y, Math.abs(this.y - SubTreeData.TreeHeight)])
      } 
    } else if (this.polarAxis === 'x-axis') {
      //  极轴是横轴，那么表示角度的轴是纵轴，使用height进行计算
      angleScale.domain([this.y, this.y + SubTreeData.TreeHeight])
      //  r的取值范围就与坐标轴origin的位置相关, r的0位置映射的是中心节点的位置，rRange的位置是距离中心节点最远的位置
      if (this.polarCenterPara === 'left') {
        //  如果极坐标系的中心在可视化形式的左侧
        rScale.domain([this.x, Math.abs(this.x + SubTreeData.TreeWidth)])
      } else if (this.polarCenterPara === 'right') {
        //  如果极坐标系的中心在可视化形式的额右侧
        rScale.domain([this.x, Math.abs(this.x - SubTreeData.TreeWidth)])
      }
    }
    //  更新角度以及直径的scale
    this.angleScale = angleScale
    this.rScale = rScale
  },
  initOrigin: function() {
    let polarCenter = this._getPolarCenter()
    this.x = polarCenter.x;
    this.y = polarCenter.y;
  },
  //  设定坐标系的原点位置
  setOrigin: function (origin) {
    this.x = origin.x
    this.y = origin.y
  },
  //  计算得到icicle plot的path路径
  generatePath: function (nodePosArray, SubTreeData, direction) {
      let polarPointArray = []
      let angleScale = this.angleScale
      let rScale = this.rScale
      //  scale不能是undefined
      if ((typeof(angleScale) === 'undefined') || (typeof(rScale) === 'undefined')) {
        console.log('scale is undefined')
      }
      //  根据不同的极坐标轴的计算角度
      if (this.polarAxis === 'y-axis') {
        //  计算极坐标系下的节点
        for (let i = 0; i < nodePosArray.length; i++) {
          let nodeObj = nodePosArray[i]
          let angle = angleScale(nodeObj.x)
          let radius = rScale(nodeObj.y)
          let polarPoint = {angle: angle, radius: radius}
          polarPointArray.push(polarPoint)
        }
      } else if (this.polarAxis === 'x-axis') {
        //  计算极坐标系下的节点
        for (let i = 0; i < nodePosArray.length; i++) {
          let nodeObj = nodePosArray[i]
          let angle = angleScale(nodeObj.y)
          let radius = rScale(nodeObj.x)
          let polarPoint = {angle: angle, radius: radius} 
          polarPointArray.push(polarPoint)
        }
      }
      //  计算radius的范围
      polarPointArray = polarPointArray.sort(function(a, b) {
        return a.radius - b.radius
      })
      let innerRadius = polarPointArray[0].radius
      let outerRadius = polarPointArray[polarPointArray.length - 1].radius
      //  计算angle的范围
      polarPointArray = polarPointArray.sort(function(a, b) {
        return a.angle - b.angle
      })
      let startAngle = polarPointArray[0].angle
      let endAngle = polarPointArray[polarPointArray.length - 1].angle
      //  创建sector的视觉元素
      let rectPathObj = d3.arc()
          .innerRadius(function(d) { return innerRadius; })
          .outerRadius(function(d) { return outerRadius; })
          .startAngle(function(d) { return startAngle; })
          .endAngle(function(d) { return endAngle; })
          .padAngle(0.01)
          .padRadius(0)
      return rectPathObj()
  },
  //  计算极坐标系下的位置
  calPolarPosition: function(nodeObj) {
    let angleScale = this.angleScale
    let rScale = this.rScale
    if (this.polarAxis === 'y-axis') {
      //  计算极坐标系下的节点
      let angle = angleScale(nodeObj.x) - Math.PI / 2
      let radius = rScale(nodeObj.y)
      let polarPoint = {angle: angle, radius: radius}
      return polarPoint
    } else if (this.polarAxis === 'x-axis') {
      //  计算极坐标系下的节点
      let angle = angleScale(nodeObj.y) - Math.PI / 2
      let radius = rScale(nodeObj.x)
      let polarPoint = {angle: angle, radius: radius} 
      return polarPoint
    }
  },
  //  给定一个笛卡尔坐标系下的位置计算极坐标系下的位置
  calPosition: function (nodeObj) {
      let angleScale = this.angleScale
      let rScale = this.rScale
      let polarPoint;
      if (this.polarAxis === 'y-axis') {
        //  计算极坐标系下的节点
        let angle = angleScale(nodeObj.x)
        let radius = rScale(nodeObj.y)
        polarPoint = {angle: angle, radius: radius}
      } else if (this.polarAxis === 'x-axis') {
        //  计算极坐标系下的节点
        let angle = angleScale(nodeObj.y)
        let radius = rScale(nodeObj.x)
        polarPoint = {angle: angle, radius: radius} 
      }
      let posAngle = polarPoint.angle - Math.PI / 2
      //  计算某一个点的位置
      let posX = Math.cos(posAngle) * polarPoint.radius
      let posY = Math.sin(posAngle) * polarPoint.radius
      let cartesianPos = {"x": posX, "y": posY}
      return cartesianPos
  },
  /**
   * get the center axis of the polar coord system
   */
  _getPolarCenter: function () {
    let SubTreeData = this.SubTreeData
    let polarCenterPara = this.polarCenterPara
    if (polarCenterPara === 'bottom') {
      return {x: SubTreeData.x + SubTreeData.TreeWidth / 2, y: SubTreeData.y + SubTreeData.TreeHeight}
    } else if (polarCenterPara === 'left') {
      return {x: SubTreeData.x, y: SubTreeData.y + SubTreeData.TreeHeight / 2}
    } else if (polarCenterPara === 'right') {
      return {x: SubTreeData.x + SubTreeData.TreeWidth, y: SubTreeData.y + SubTreeData.TreeHeight / 2}  
    }
    // the default center position is 'top'
    if (polarCenterPara === 'top') {
      return {x: SubTreeData.x + SubTreeData.TreeWidth / 2, y: SubTreeData.y}
    }
  }
}
 