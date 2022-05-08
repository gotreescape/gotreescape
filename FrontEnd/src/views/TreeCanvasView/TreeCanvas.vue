<template>
  <div class='container' :id="treeCanvasContainerId">
    <svg class='tree-canvas' ref="treeCanvas" :id="treeCanvasSvgId">
      <g :id="treeCanvasId"></g>
    </svg>
    <!-- <div id="NodeLabel"></div> -->
  </div>
</template>

<script>
/* eslint-disable no-console */
/* jshint esversion: 8 */
/* eslint-disable no-undef */
import { mapState, mapMutations, mapActions } from 'vuex'
import { Cartesian } from '@/coordinatesystem/cartesian.js'
import { Polar } from '@/coordinatesystem/polar.js'
import { getTreeLayout } from '@/data-processing/get_tree_layout.js'
import { getLayoutValue } from '@/data-processing/get_layout_value.js'
import { getNodeLinkAttr } from '@/data-processing/get_node_link_attr.js'
import { extractTreeIndexWithDSL } from '@/data-processing/extract_tree_index_with_dsl.js'
import { tweenPaths } from 'svg-tween'
import { tween } from 'svg-tween'
import OriginalDataView from './OriginalDataView.vue'
import { getTreeNodeStyle } from '@/treevis-style/get_tree_node_style.js'
import { getTreeLinkStyle } from '@/treevis-style/get_tree_link_style.js'
import { addDefaultCoordElement } from '@/data-processing/add_default_coord_element.js'
import { treeNodeValidate, treeLayoutValidate, areaDataValidate } from '@/error/ErrorValidate.js';
import { throwGoTreeError } from '@/error/GoTreeError.js';

export default {
  name: 'TreeCanvas',
  props: {
    treeCanvasKey: {
      type: Number
    },
    sendSVGData: {
      type: Boolean,
      default: false
    },
    dslObj: {
      type: Object
    },
    dslIndex: {
      type: Number
    },
    initRender: {
      type: Boolean,
      default: false
    },
    nodeArrayWithValue: {
      type: Array
    },
    nodeArrayWithValueObj: {
      type: Object
    },
    hierarchicalData: {
      type: Object
    },
    canvasOpacity: {
      type: Boolean,
      default: true
    },
    aspectRatio: {
      type: Number,
      default: 1
    }
  },
  data() {
    return {
      nodeArray: [],
      // hierarchicalData: {},
      layoutParas: {},
      //  用于绘制树可视化形式的svg的id
      treeCanvasSvgId: 'tree-dsl-svg-canvas',
      //  用于绘制树可视化形式的svg外部的div的id
      treeCanvasContainerId: 'tree-dsl-canvas-container',
      //  用于绘制树可视化形式的svg内部的g的id
      treeCanvasId: 'tree-dsl-canvas',
      //  用于展示用户能够绘制的树的大小所增加的矩形的id
      treeCanvasRectId: 'canvas-region-outer-rect',
      //  进行动画变换的时长
      DURATION: 1000,
      //  用户点击选择的子树对象
      selectedItem: null,
      //  用于控制子树中节点的位置以及长度的对象的集合
      posLenCollectionObj: {},
      //  用于表示切割的子树之间连线的集合
      regionOuterRectPos: {},
      //  在svg上增加的g的class
      singleTreeG: 'tree-g',
      //  发生动画变换的时长
      POSITION_DURATION: 900,
      colorAttr: 'depth',
      treeViewPosLenObj: {},
      currentRootID: 'index-0',
      treeGId: 'index-0-g',
      previewPanelOpen: false, // 初始的preview视图处于关闭的状态
      hybridNodeObjectNum: 10,
      OPEN_PREVIEW_PANEL_DURATION: 500,
      horizontalArray: [0, 0.5, 1], //  横向的控制线的位置
      verticalArray: [0, 0.5, 1], //  纵向的控制线的位置
      treeViewWidth: 0, // 绘制层次结构数据视图的宽度
      treeViewHeight: 0, // 绘制层次结构数据视图的高度
      viewWidth: 0, //  视图的宽度
      viewHeight: 0, //  视图的高度
      layouts: {}, // 计算得到的节点的布局
      areaDataArray: [],  
      AreaData: {}, //  AreaData is an object to save all the positions and sizes of the visual element in tree visualization
      linkDataArray: [],  
      treeNodeErrorMessage: 'The width or height of tree nodes is less than zero.',
      treeNodeHintMessage: 'Please change the unit or reduce the value of margin or padding.',
    }
  },
  components: {
    OriginalDataView
  },
  created: function() {},
  mounted: function() {
    let self = this
    self.adjustTreeCanvas()
    self.addZoomFunc()
    self.updateSVGViewbox()
    if (self.initRender) {
      self.adjustTreeCanvas()
      self.updateTreeVisResults()
      self.updateSVGViewbox()
    }
  },
  watch: {
    // 计算得到的布局会存储在state的layout参数中，如果数据发生变化，那么就会对应地调用方法并且更新
    treeCanvasKey: function() {
      this.adjustTreeCanvas()
      this.updateTreeVisResults()
      this.updateSVGViewbox()
      this.addZoomFunc()
    },
    dslIndex: function() {
      this.adjustTreeCanvas()
      this.updateTreeVisResults()
      this.updateSVGViewbox()
      this.addZoomFunc()
    },
    assignRecursiveMode: function() {
      this.highlightFocusedTreeObjIdArray(this.previewTreeObj)
    },
    assignNodeQuery: function() {
      this.highlightFocusedTreeObjIdArray(this.previewTreeObj)
    },
    changedDSLNameState: function() {
      let layoutParas = sysDatasetObj.getLayoutParas()
      let dslContentObject = layoutParas.treeDSLContentObj
      if ((typeof(dslContentObject) !== 'undefined') && (this.treeUnitDSLName != null)) {
        if (typeof(dslContentObject[this.treeUnitDSLName]) !== 'undefined') {
          this.updateTreeVisResults()
        }        
      }
    },
    treeCanvasLayoutState: function() {
      this.updateTreeVisResults()
    },
    currentTreeDSLArray: function() {
      // if (this.currentTreeDSLArray.length === 0) {
      //   //  清空treecanvas视图
      //   d3.select(this.$el)
      //     .selectAll('.link').remove()
      //   d3.select(this.$el)
      //     .selectAll('.lineartree-node').remove()
      //   d3.select(this.$el)
      //     .selectAll('.node-label').remove()        
      // }
    },
    selectedTreeDSLIndex: function() {
      console.log('selectedTreeDSLIndex', this.selectedTreeDSLIndex)
      this.adjustTreeCanvas()
      this.updateTreeVisResults()
      this.updateSVGViewbox()
    }
  },
  computed: {
    ...mapState([
      'treeDSLArray',
      'assignRecursiveMode',
      'assignNodeQuery',
      'focusedTreeObjArray',
      'changedDSLNameState',
      'treeUnitDSLName',
      'treeCanvasLayoutState',
      'previewTreeObj',
      'currentTreeDSLArray',
      'selectedTreeDSLIndex'
    ])
  },  
  methods: {
    updateTreeVisResults: function() {
      let self = this
      let layoutParas = JSON.parse(JSON.stringify(sysDatasetObj.getLayoutParas()))
      self.layoutParas = layoutParas
      let hierarchicalData = self.hierarchicalData
      if ((typeof(self.dslObj) !== 'undefined') && (self.dslObj != null)) {
        let selectedTreeDSLIndex = self.dslIndex
        // let nodeArrayWithValueObj = sysDatasetObj.getNodeArrayWithValueObj()
        let nodeArrayWithValueObj = self.nodeArrayWithValueObj
        let treeIndexWithDSL = sysDatasetObj.computeAllNodeTreeIndexWithDSL(nodeArrayWithValueObj, selectedTreeDSLIndex)
        layoutParas.treeIndexWithDSL = treeIndexWithDSL
        let treeDSLContentObj = {}
        treeDSLContentObj[selectedTreeDSLIndex] = self.dslObj
        // assign the content
        layoutParas.treeIndexWithDSL = treeIndexWithDSL
        layoutParas.treeDSLContentObj = treeDSLContentObj
        layoutParas.hierarchicalData = hierarchicalData
      }
      let nodeArray = self.nodeArrayWithValue
      let assignedAllNodesBoolean = assignedAllNodes(nodeArray, layoutParas.treeIndexWithDSL)
      let assignedAllDSLIndexBoolean = assignedAllDSLIndex(layoutParas.treeDSLContentObj, layoutParas.treeIndexWithDSL)
      if (!assignedAllNodesBoolean) {
        console.log('not assign all nodes')
      }
      if (!assignedAllDSLIndexBoolean) {
        console.log('not assign all DSL')
      }
      if (assignedAllNodesBoolean && assignedAllDSLIndexBoolean) {
        getLayoutValue(layoutParas).then(function(treeLayout) {
          if (!treeLayoutValidate(treeLayout)) {
            self.clearTreeCanvas()
            console.log('not validated')
            throwGoTreeError(self.treeNodeErrorMessage)
            self.showHintMessage(self.treeNodeHintMessage, 'error')
            return 
          }
          self.layouts = treeLayout
          self.renderTreeVisResults(treeLayout)
        })
      } else {
        //  重置state中的layoutParas中treeIndexWithDSL变量
        let layoutParas = sysDatasetObj.getLayoutParas()
        layoutParas.treeIndexWithDSL = {}
        //  重置state中的currentTreeDSLArray变量
        let currentTreeDSLArray = sysDatasetObj.getCurrentTreeDSLArray(this.focusedTreeObjArray)
        self.UPDATE_CURRENT_TREE_DSL_ARRAY(currentTreeDSLArray)
        //  清空所有绘制的部分
        d3.select(this.$el)
          .select('#' + this.treeGId)
          .selectAll('*')
          .remove()
      }
      function assignedAllDSLIndex(treeDSLContentObj, treeIndexWithDSL) {
        // whether all the tree dsl are valid
        let assignedAllDSLIndex = true
        for (let nodeIndex in treeIndexWithDSL) {
          let treeDSLIndex = treeIndexWithDSL[nodeIndex]
          if (typeof(treeDSLContentObj[treeDSLIndex]) === 'undefined') {
            assignedAllDSLIndex = false
            return assignedAllDSLIndex
          }
        }
        return assignedAllDSLIndex
      }
      function assignedAllNodes(nodeArray, treeIndexWithDSL) {
        // whether all the nodes are assigned with treeDSLIndex
        let nodeIndexArray = []
        // if the node array is undefined, then the nodes are not matched. 
        if ((typeof(nodeArray) === 'undefined') || (nodeArray == null)) {
          return false
        }
        for(let i = 0;i < nodeArray.length;i++) {
          nodeIndexArray.push(nodeArray[i].data.index)
        }
        let dslIndexArray = []
        for(let item in treeIndexWithDSL) {
          dslIndexArray.push(item)
        }
        if ((nodeIndexArray.length === dslIndexArray.length) 
            && (nodeIndexArray.length !== 0) && (dslIndexArray.length !== 0)) {
          return true
        }
        return false
      }
    },
    //  根据当前参数渲染树可视化形式
    renderTreeVisResults: function(treelayout) {
      //  层次结构数据遍历得到的节点数组
      let nodeArray = this.nodeArrayWithValue
      // this.nodeArray = nodeArray
      // this.layoutParas = sysDatasetObj.getLayoutParas()
      // this.hierarchicalData = this.layoutParas.hierarchicalData
      //  index为dsl的id，属性值为dsl的具体参数的对象
      let dslContentObject = this.layoutParas.treeDSLContentObj
      this.dslContentObject = dslContentObject
      //  treeIndexWithDSLWithDefault; index为节点id, 属性值为DSL的index; 增加default值表示如果未赋值的情况下则取default数值
      let treeIndexWithDSL = this.layoutParas.treeIndexWithDSL
      //  treeIndexWithDSL对象为index为节点的id，属性值为DSL的id
      this.treeIndexWithDSL = treeIndexWithDSL
      let treeViewPosLenObj = this.treeViewPosLenObj
      let currentRootID = this.currentRootID
      //  get the attribute of whether the link display on the top of nodes
      this.linkDisplayTop = sysDatasetObj.getLinkDisplayTop(dslContentObject)
      //  对treelayout进一步计算，得到各个结点在笛卡尔坐标系下的绝对坐标
      if ((typeof(treeIndexWithDSL) === 'undefined') || (typeof(dslContentObject) === 'undefined') 
          || (treelayout == null) || (typeof(treelayout) === 'undefined')) {
        return
      }
      this.AreaData = getTreeLayout(treeIndexWithDSL, dslContentObject, treelayout, nodeArray, treeViewPosLenObj)
      if (!areaDataValidate(this.AreaData)) {
        this.clearTreeCanvas()
        throwGoTreeError(this.treeNodeErrorMessage)
        this.showHintMessage(this.treeNodeHintMessage, 'error')
        return 
      }
      //  获取所有的linear对象的link参数
      this.renderTree()
      //  调整层次结构可视化形式的位置
      this.adjustTreePos()
    },
    //  在svg上增加zoom的函数
    addZoomFunc: function() {
      let self = this
      let svgWidth = +$('#' + self.treeCanvasSvgId).width();
      let svgHeight = +$('#' + self.treeCanvasSvgId).height();
      var zoom = d3.zoom()
        .scaleExtent([0.5, 3])
        // .translateExtent([[-100, -100], [svgWidth + 90, svgHeight + 100]])
        .on("zoom", zoomed);
      //  对于视图进行zoom
      function zoomed() {
        let treeCanvasRect = d3.select(self.$el).select('#' + self.treeCanvasRectId)
        d3.select(self.$el).select('#' + self.treeCanvasId).attr("transform", d3.event.transform);
      }
      d3.select(self.$el).select('#' + self.treeCanvasSvgId).call(zoom);
      // reset the zooming level
      d3.select(self.$el).select('#' + self.treeCanvasSvgId).call(zoom.transform, d3.zoomIdentity);
    },
    // update view box attribute of svg
    updateSVGViewbox: function() {
      let svgWidth = +this.$refs.treeCanvas.clientWidth
      let svgHeight = +this.$refs.treeCanvas.clientHeight
      let viewBoxAttrs = [0, 0, svgWidth, svgHeight]
      let viewBoxStr = viewBoxAttrs.join(" ")
      this.svgViewBoxAttr = viewBoxStr
    },
    //  调整层次结构可视化形式的位置
    adjustTreePos: function() {
      let currentRootGId = this.treeGId
      let treeViewPosLenObj = this.treeViewPosLenObj
      //  调整视图的位置
      d3.select(self.$el)
        .select('#' + currentRootGId)
        .attr('transform', 'translate(' + treeViewPosLenObj.x + ',' + treeViewPosLenObj.y + ')')
    }, 
    /**
     * 确定视图的大小以及视图内部中矩形的大小
     */
    adjustTreeCanvas: function() {
      let self = this
      //  在svg上增加背景矩形
      //  svg上的背景矩形的width与height的比例
      let widthHeightRatio = self.aspectRatio
      let miniPadding = 0.1
      let svgWidth = +this.$refs.treeCanvas.clientWidth
      let svgHeight = +this.$refs.treeCanvas.clientHeight
      this.viewWidth = svgWidth
      this.viewHeight = svgHeight
      let innerViewWidth = this.viewWidth * 0.88
      let innerViewHeight = this.viewHeight * 0.88
      if ((innerViewWidth * widthHeightRatio) >= innerViewHeight) {
        //  如果按照innerViewWidth计算的数值超过innerViewHeight，那么就按照innerViewHeight计算
        innerViewWidth = innerViewHeight / widthHeightRatio
      } else {
        //  否则就按照innerViewWidth进行计算
        innerViewHeight = innerViewWidth * widthHeightRatio
      }
      this.treeWidth = innerViewWidth
      this.treeHeight = innerViewHeight
      this.viewPaddingTop = (this.viewHeight - this.treeHeight) / 2
      this.viewPaddingLeft = (this.viewWidth - this.treeWidth) / 2      
      let canvasOuterPosLenObj = {
        x: this.viewPaddingLeft,
        y: this.viewPaddingTop,
        width: this.treeWidth,
        height: this.treeHeight
      }
      d3.select(self.$el)
        .select('#' + this.treeCanvasSvgId)
        .style('background', function() {
          if (self.canvasOpacity) {
            return "rgb(255, 255, 255, 0)"; // set the opacity as the transparent color
          } else {
            return "#f9f9f9" // set the opacity as the untransparent color
          }
        })
      // if (d3.select(self.$el).select('#' + this.treeCanvasId).select('#' + this.treeCanvasRectId).empty()) {
      //   d3.select(self.$el)
      //     .select('#' + this.treeCanvasId)
      //     .append('rect')
      //     .attr('class', 'canvas-region-outer')
      //     .attr('id', this.treeCanvasRectId)
      //     .attr('x', canvasOuterPosLenObj.x)
      //     .attr('y', canvasOuterPosLenObj.y)
      //     .attr('width', canvasOuterPosLenObj.width)
      //     .attr('height', canvasOuterPosLenObj.height)
      //     .attr('opacity', function() {
      //       if (self.canvasOpacity) {
      //         return 0 // set the opacity as the transparent color
      //       } else {
      //         return 1 // set the opacity as the untransparent color
      //       }
      //     })
      //     .on('click', function() {
      //       //  关闭树可视化形式的preview视图
      //       self.removeControlHighlight()
      //     })
      // } else {
      //     d3.select(self.$el)
      //       .select('#' + this.treeCanvasId)
      //       .select('#' + this.treeCanvasRectId)
      //       .attr('x', canvasOuterPosLenObj.x)
      //       .attr('y', canvasOuterPosLenObj.y)
      //       .attr('width', canvasOuterPosLenObj.width)
      //       .attr('height', canvasOuterPosLenObj.height)
      // }
      //  计算内部的可视化形式的大小
      // TODO, official version is 0.08
      let paddingRatio = 0.01
      this.treeViewPaddingTop = this.treeHeight * paddingRatio
      this.treeViewPaddingBottom = this.treeHeight * paddingRatio
      this.treeViewPaddingLeft = this.treeWidth * paddingRatio
      this.treeViewPaddingRight = this.treeWidth * paddingRatio
      this.treeViewWidth = this.treeWidth - this.treeViewPaddingLeft - this.treeViewPaddingRight
      this.treeViewHeight = this.treeHeight - this.treeViewPaddingTop - this.treeViewPaddingBottom
      //  树可视化形式的boundingBox的位置以及长度的属性信息
      let treeViewPosLenObj = {
        x: this.treeViewPaddingLeft + this.viewPaddingLeft,
        y: this.treeViewPaddingTop + this.viewPaddingTop,
        width: this.treeViewWidth,
        height: this.treeViewHeight
      }
      this.treeViewPosLenObj = treeViewPosLenObj
      //  在svg上增加绘制树可视化形式的g, 移动currentRootG的位置
      d3.select(this.$el).select('#' + this.treeCanvasId).select('#' + this.treeGId).remove();
      d3.select(this.$el)
        .select('#' + this.treeCanvasId)
        .append('g')
        .attr('id', this.treeGId)
        .attr('class', this.singleTreeG)
        .attr('transform', 'translate(' + treeViewPosLenObj.x + ',' + treeViewPosLenObj.y + ')')
    },
    /**
     * 点击背景矩形之后，取消对于控制数可视化形式大小的矩形的高亮
     */
    removeControlHighlight: function() {
      let self = this
      d3.select(self.$el)
        .select('#' + this.treeCanvasId)
        .selectAll('.resize-circle-g')
        .classed('highlight', false)
      d3.select(self.$el)
        .select('#' + this.treeCanvasId)
        .selectAll('.tree-vis-region-outer')
        .classed('highlight', false)
    },
    /**
     * 点击背景矩形即将控制书可视化大小的控制点以及背景矩形显示出来
     */
    addControlHighlight: function() {
      let self = this
      d3.select(self.$el)
        .select('#' + self.treeCanvasId)
        .select('.resize-circle-g')
        .classed('highlight',true)
      d3.select(self.$el)
        .select('#' + self.treeCanvasId)
        .select('.tree-vis-region-outer')
        .classed('highlight',true)
    },
    /**
     * [clear the canvas of the GoTree rendering results]
     * @return {[Null]} [description]
     */
    clearTreeCanvas: function() {
      let self = this
      let currentRootGId = self.treeGId
      d3.select(this.$el)
        .select('#' + currentRootGId)
        .selectAll('*')
        .remove()
    },
    //  渲染节点之间的link
    renderTreeLink: function (linkDataArray) {
      let self = this
      let currentRootGId = self.treeGId
      d3.select(this.$el).select('#' + currentRootGId)
        .selectAll('.link').remove()
      //绘制link
      let linkElements = d3.select(this.$el).select('#' + currentRootGId)
        .selectAll('.link')
        .data(linkDataArray.filter(function(d){
          return ((typeof(d.pathAttr) !== 'undefined') && (d.pathAttr.indexOf('NaN') === -1))
        }))
      //  增加视觉元素
      linkElements.enter()
        .append('path')
        .attr('id', function(d, i) {
          return 'link' + d.beginid + 'to' + d.endid
        })
        .attr('class', function(d, i) {
          return 'link' + ' link-parent-' + d.beginid + ' link-child-' + d.endid
        })
        .attr('d', function(d, i){
          return d.pathAttr
        })
        .attr('stroke-width', function(d, i) {
          return d.link_width
        })
        .attr('fill', 'none')
        .attr('stroke', '#606060')
      linkElements.exit().remove()
     },
    renderTreeNode: function(areaDataArray) {
      let self = this
      let nodeArray = self.nodeArrayWithValue
      let currentRootGId = self.treeGId
      let treelayout = this.layouts
      //  not valid -> stop rendering and remove all the nodes
      if (!treeNodeValidate(areaDataArray)) {
        d3.select(this.$el)
          .select('#' + currentRootGId)
          .selectAll('.lineartree-node-g')
          .remove()
        let message = "The element of tree node is none. | TreeCanvas.js"
        throwGoTreeError(message)
        return
      } 
      d3.select(this.$el).selectAll('.lineartree-node-g').remove()
      //  表示节点的视觉元素
      let treeNodeElementG = d3.select(this.$el)
        .select('#' + currentRootGId)
        .selectAll('.lineartree-node-g')
        .data(areaDataArray, function(d, i) {
          return d.id
        })
      //  创建视觉元素
      treeNodeElementG.enter()
        .append('g')
        .attr('class', 'lineartree-node-g')
        .attr('id',function(d,i) {
          return 'nodeg'+d.id
        })
        .append('path')
        .attr('class', 'lineartree-node')
        .attr('id',function(d,i) {
          return 'rootnode'+d.id
        })
        .attr('d', function(d, i) {
          return d.element
        })
        .on("mousemove",this.mousemove)
        .on("mouseover",this.mouseover)
        .on("mouseout",this.mouseout)
        .on("click", function(d, i) {
          let dataObj = JSON.parse(JSON.stringify(d.data))
          dataObj.fatherID = d.fatherID
          self.onclick(dataObj)
        })
        .attr('fill', function(d) {
          return d.node_color
        })
        .style('stroke-width', function(d) {
          return d.stroke_width
        })
        .style("opacity",1)
      treeNodeElementG.exit().remove()
    },
    mousemove: function(d) {
      let treeViewPosLenObj = this.treeViewPosLenObj
      d3.select("#NodeLabel").style("visibility", "visible")
      d3.select("#NodeLabel").style("opacity", .9)
      let tooltipAttrArray = d.tooltip
      let offset = $('#tree-dsl-canvas-container').offset()
      if (tooltipAttrArray.length > 0) {
        d3.select("#NodeLabel").html(NodeLabelHtml(d, tooltipAttrArray))
          .style("left", (d3.event.pageX - offset.left) + "px")
          .style("top", (d3.event.pageY - offset.top) + "px")
        d3.select("#NodeLabel").style("visibility", "visible")
      } else {
        d3.select("#NodeLabel").style("visibility", "hidden")
      }
      // d3.select("#NodeLabel").style("left", (d3.event.pageX) + "px")
      //   .style("top", (d3.event.pageY - 28) + "px")
      //  hover显示label中的文字排版
      function NodeLabelHtml(d, tooltipAttrArray) {
        let innerContent = '<h4>'
        for (let i = 0; i < tooltipAttrArray.length; i++) {
          if (i === (tooltipAttrArray.length - 1)) {
            innerContent = innerContent + tooltipAttrArray[i] + ': ' + d[tooltipAttrArray[i]]
          } else {
            innerContent = innerContent + tooltipAttrArray[i] + ': ' + d[tooltipAttrArray[i]] + "<br/>"
          }
        }
        innerContent = innerContent + "</h4>"
        return innerContent
      }
    },
    mouseover: function(d) {
    },
    //  鼠标移开的事件
    mouseout: function (d) {
      d3.select("#NodeLabel").style("visibility", "hidden")
    },
    //  获取单个节点，兄弟节点，或者同层节点的数组
    getSelectedTreeUnitRootIdArray: function(selectId) {
      let AreaData = this.AreaData
      let treelayout = this.layouts
      let viewSelectionMode = this.viewSelectionMode
      let assignNodeQuery = this.assignNodeQuery
      let selectedTreeUnitRootIdArray = []
      let assignNodeAttr = this.previewTreeObj[assignNodeQuery]
      for (let i = 0;i < this.areaDataArray.length;i++) {
        if (assignNodeQuery === 'fatherID') {
          if (this.areaDataArray[i][assignNodeQuery] === assignNodeAttr) {
            selectedTreeUnitRootIdArray.push(this.areaDataArray[i]['data'].index)
          }
        } else {
          if (this.areaDataArray[i]['data'][assignNodeQuery] === assignNodeAttr) {
            selectedTreeUnitRootIdArray.push(this.areaDataArray[i]['data'].index)
          }
        }
      }
      return selectedTreeUnitRootIdArray   
      //  获取兄弟节点
      function getSiblingNodeArray(selectId) {
        var nodeArray = []
        var sfatherid = AreaData[selectId].fatherID
        if (sfatherid != null) {
          for(let i=0;i<treelayout[sfatherid].subtreeLayout.length;i++){
            let siblingNodeId = treelayout[sfatherid].subtreeLayout[i].id
            nodeArray.push(siblingNodeId)
          }
        } else {
          nodeArray.push(selectId)
        }
        return nodeArray
      }
      //  获取同层的节点
      function getSameDepthNodeArray(selectid) {
         var nodeArray = []
         var selectObj = AreaData[selectId]
         for (let item in AreaData) {
            let areaDataObj = AreaData[item]
            if (areaDataObj.depth === selectObj.depth) {
              nodeArray.push(areaDataObj.id)
            }
         }
         return nodeArray
      }      
    },
    highlightFocusedTreeObjIdArray: function(dataObj) {
      let self = this
      let nodeId = dataObj.index
      if (dataObj.name !== 'A') {
        d3.select(self.$el)
          .select('#'+self.treeCanvasId)
          .selectAll('.select-root-node')
          .classed('select-root-node', false)
        //  仅仅高亮点击的节点
        d3.select(self.$el)
          .select('#'+self.treeCanvasId)
          .select('#'+"rootnode"+nodeId)
          .classed('select-root-node', true)
      }      
      //  更新当前点击的节点的对象
      let nodeArray = this.getSelectedTreeUnitRootIdArray(nodeId)
      // 高亮数组中的节点
      let focusedTreeObjIdArray = this.getFocusedTreeObjIdArray(nodeArray)
      this.UPDATE_FOCUS_TREE_OBJ_ARRAY(focusedTreeObjIdArray)
      //  按照选择的节点进行高亮
      d3.select(self.$el)
        .select('#'+self.treeCanvasId)
        .selectAll('.lineartree-node')
        .classed('clickhighlight', false)
        .classed('clickunhighlight', false)
      d3.select(self.$el)
        .select('#'+self.treeCanvasId)
        .selectAll('.lineartree-node')
        .classed('clickunhighlight',true)
      for (let i = 0; i < focusedTreeObjIdArray.length; i++) {
        d3.select(self.$el)
          .select('#'+self.treeCanvasId)
          .selectAll("#" + "rootnode" + focusedTreeObjIdArray[i])
          .classed('clickhighlight',true)
          .classed('clickunhighlight',false)
      }
    },
    //  高亮选择的节点数组
    getFocusedTreeObjIdArray: function (nodeArray) {
      let assignRecursiveMode = this.assignRecursiveMode   
      let treelayout = this.layouts
      let AreaData = this.AreaData  
      let focusedTreeObjIdArray = []
      for (let i = 0;i < nodeArray.length;i++) {
        let nodeId = nodeArray[i]
        let selectedNodeArray = []
        // 根据是否递归的条件判断
        if (assignRecursiveMode === 'true') {

          selectedNodeArray = getDescendantNodeArray(nodeId)
        } else if (assignRecursiveMode === 'false') {
          selectedNodeArray = [nodeId]
        }
        for (let sI = 0; sI < selectedNodeArray.length; sI++) {
          if (focusedTreeObjIdArray.indexOf(selectedNodeArray[sI]) === -1) {
            focusedTreeObjIdArray.push(selectedNodeArray[sI])
          }
        }
      }
      return focusedTreeObjIdArray
      //  获取后代的节点
      function getDescendantNodeArray(lightupID) {
        var node = []
        var allNodeArray = [lightupID]
        while(lightupID !== undefined){
          for(let i=0;i<treelayout[lightupID].subtreeLayout.length;i++){
            let SonID = treelayout[lightupID].subtreeLayout[i].id
            node.push(SonID)
            allNodeArray.push(SonID)
          }
          lightupID = node.shift()
        }
        return allNodeArray
      }
    },
    //  取消选择节点
    unhighlightSelectedNodeArray: function() {
      let self = this
      d3.select(self.$el)
        .select('#'+self.treeCanvasId)
        .selectAll('.lineartree-node')
        .classed('clickunhighlight',false)
        .classed('clickhighlight',false)
        .classed('select-root-node', false)
    },
    //  鼠标的节点点击事件
    onclick: function (dataObj) {
      let self = this
      let nodeId = dataObj.index
      //  显示树可视化形式背后的控制点
      self.addControlHighlight()   
      if (!d3.select(self.$el)
          .select('#'+self.treeCanvasId)
          .select('#' + "rootnode" + nodeId)
          .classed('select-root-node')) {
          //  更新当前点击选中的节点id
          self.UPDATE_SELECTED_PREVIEW_NODE_ID(nodeId)
          //  该节点的父亲节点，需要获取该节点的id，计算该计算的属性值
          //  更新当前点击的层次结构数据
          self.UPDATE_PREVIEW_TREE_OBJ(dataObj)
          //  高亮选中的节点
          self.highlightFocusedTreeObjIdArray(dataObj)
      } else {
        self.removePreviewObjectSelection()
      }
      //  更新当前选中的DSL数组
      let currentTreeDSLArray = sysDatasetObj.getCurrentTreeDSLArray(this.focusedTreeObjArray)
      self.UPDATE_CURRENT_TREE_DSL_ARRAY(currentTreeDSLArray)   
    },
    //  删除当前preview object的选择
    removePreviewObjectSelection: function() {
      let self = this
      //  清除当前选中的节点id
      self.UPDATE_SELECTED_PREVIEW_NODE_ID(null)
      //  取消高亮数组中的节点
      self.unhighlightSelectedNodeArray()
      //  取消选中，应该将focusedTreeObjIdArray置为全部的节点数组
      let allTreeObjIdArray = sysDatasetObj.getAllTreeObjIdArray()
      self.UPDATE_FOCUS_TREE_OBJ_ARRAY(allTreeObjIdArray)
      //  该节点的父亲节点，需要获取该节点的id，计算该计算的属性值
      //  更新当前点击的层次结构数据
      let areaDataArray = self.areaDataArray
      if (areaDataArray.length > 0) {
        let previewAllDataObj = JSON.parse(JSON.stringify(areaDataArray[0].data))
        self.UPDATE_PREVIEW_TREE_OBJ(previewAllDataObj)
      }
    },
    /**
     * 渲染最终的树可视化形式的方法，需要保证这个方法中只能绘制单纯的树可视化形式，而不包括其他的部分，这样可以将GoTree实现为一个library
     * 将link与node绘制的部分区分开
     */
    renderTree: function () {
        let self = this
        let treeIndexWithDSL = this.treeIndexWithDSL
        let dslContentObject = this.dslContentObject
        let treeViewPosLenObj = this.treeViewPosLenObj
        let treelayout = this.layouts
        let AreaData = this.AreaData
        let nodeArray = this.nodeArrayWithValue
        let currentRootID = this.currentRootID
        let dslContentObjectWithDefault = addDefaultCoordElement(dslContentObject)
        //  根据节点的id得到节点所对应的g
        let [areaDataArray, linkDataArray] = getNodeLinkAttr(AreaData, dslContentObjectWithDefault, treeIndexWithDSL, treeViewPosLenObj, nodeArray)
        areaDataArray = getTreeNodeStyle(areaDataArray, dslContentObjectWithDefault, treeIndexWithDSL, nodeArray)
        linkDataArray = getTreeLinkStyle(linkDataArray, AreaData, dslContentObjectWithDefault, treeIndexWithDSL, nodeArray, this.treeViewWidth, this.treeViewHeight)
        this.areaDataArray = areaDataArray
        this.linkDataArray = linkDataArray
        /**
         * 绘制节点之间的连接边的方法
         */
        //  调用绘制树可视化上节点
        if (this.linkDisplayTop) {
          //  render nodes at first and then render links between nodes
          self.renderTreeNode(areaDataArray)
          self.renderTreeLink(linkDataArray)
        } else {
          //  render links at first and then render nodes
          self.renderTreeLink(linkDataArray) 
          self.renderTreeNode(areaDataArray)      
        }
    },
    //  提取传递的treeDsl的文件
    extractDSLContentObject: function () {
      let treeDSLArray = this.treeDSLArray
      let dslContentObj = {}
      for (let tI = 0; tI < treeDSLArray.length; tI++) {
        let dslObj = treeDSLArray[tI]
        let editorId = dslObj.editorId
        let content = dslObj.content
        dslContentObj[editorId] = content
      }
      return dslContentObj
    },
    // ZWT ADD HERE
    getSvgCoordinates(g, x, y) {
      let svg = document.getElementById(this.treeCanvasSvgId);
      let pt = svg.createSVGPoint();
      pt.x = x;
      pt.y = y;
      let globalPoint = pt.matrixTransform(g.getScreenCTM().inverse());
      return globalPoint;
    },
    repositionResizeCircle: function (currentRootGId) {
      let self = this
      let g = d3.select(self.$el).select('#'+self.treeCanvasId)
      let circleG = g.select('.resize-circle-g')
      let rect = g.select('.tree-vis-region-outer')
      let x = +rect.attr('x')
      let y = +rect.attr('y')
      let w = +rect.attr('width')
      let h = +rect.attr('height')
      circleG.select('.topleft')
        .attr("cx", x)
        .attr("cy", y)
      circleG.select('.bottomright')
        .attr("cx", x + w)
        .attr("cy", y + h)
    },
    //  输入的是某一个group的id，该方法即在这个group内部增加控制点，进而控制可视化形式的大小
    appendResizeCircle: function (currentRootGId) {
      let self = this
      //  选中绘制树的canvas
      let treeCanvas = d3.select(self.$el).select('#'+self.treeCanvasId)
      //  选中这个g中的矩形
      let rect = d3.select(self.$el).select('#' + self.treeCanvasId)
        .select('.tree-vis-region-outer')
      //  获取g中矩形的属性值
      let x = +rect.attr('x')
      let y = +rect.attr('y')
      let w = +rect.attr('width')
      let h = +rect.attr('height')
      //  在这个g中增加resize的控制
      let circleG = treeCanvas.append('g').attr('class', 'resize-circle-g')
      circleG.append("circle")
        .attr("class", "topleft")
        .attr("cx",  x)
        .attr("cy", y)
        .call(d3.drag()
          .container(d3.select(self.$el).select('#'+self.treeCanvasId).node())
          .subject(function () {
            return {x: d3.event.x, y: d3.event.y}
          })
          .on("start end", rectResizeStartEnd)
          .on("drag", rectResizing)
        )
      circleG.append("circle")
        .attr("class", "bottomright")
        .attr("cx", x + w)
        .attr("cy", y + h)
        .call(d3.drag()
          .container(d3.select(self.$el).select('#'+self.treeCanvasId).node())
          .subject(function () {
            return {x: d3.event.x, y: d3.event.y}
          })
          .on("start end", rectResizeStartEnd)
          .on("drag", rectResizing)
        )
      function rectResizeStartEnd() {
        let treeViewPosLenObj = self.treeViewPosLenObj
        let el = d3.select(this), isStarting = d3.event.type === "start"
        // d3.select(this)
        //   .classed("resizing", isStarting)
        //   .attr("r", isStarting || el.classed("hovering") ? circleActiveRadius : circleRadius)
        if (isStarting || el.classed("hovering")) {
          d3.select(self.$el)
            .select('#'+self.treeCanvasId)
            .select('.tree-vis-region-outer')
            .classed('resizing', true)
        } else {
          d3.select(self.$el)
            .select('#'+self.treeCanvasId)
            .select('.tree-vis-region-outer.resizing')
            .classed('resizing', false)
        }
        //  开始时的响应函数
        if (isStarting) {
          let rect = d3.select(self.$el)
            .select('#'+self.treeCanvasId)
            .select('.tree-vis-region-outer')
          let x = +rect.attr('x')
          let y = +rect.attr('y')
          let w = +rect.attr('width')
          let h = +rect.attr('height')
          self.regionOuterRectPos = {x: x, y: y, width: w, height: h}
        }
        // 拖动之后，输出修改之后的x, y, width, height
        if (!isStarting) {
          let rect = d3.select(self.$el)
            .select('#'+self.treeCanvasId)
            .select('.tree-vis-region-outer')
          let x = +rect.attr('x')
          let y = +rect.attr('y')
          let w = +rect.attr('width')
          let h = +rect.attr('height')
          let diffX = x - self.regionOuterRectPos.x
          let diffY = y - self.regionOuterRectPos.y
          let diffWidth = w - self.regionOuterRectPos.width
          let diffHeight = h - self.regionOuterRectPos.height
          //  改变对应的g的范围
          treeViewPosLenObj.x = treeViewPosLenObj.x + diffX
          treeViewPosLenObj.y = treeViewPosLenObj.y + diffY
          treeViewPosLenObj.width = treeViewPosLenObj.width + diffWidth
          treeViewPosLenObj.height = treeViewPosLenObj.height + diffHeight
          //  重新请求数据
          let currentRootIndex = currentRootGId.replace('-g', '')
          //   调整大小之后更新渲染结果
          self.updateTreeVisResults()
        }
      }
      // 限制矩形位置和大小
      let MAX_TRANSLATE_X = self.treeWidth + self.viewPaddingLeft
      let MIN_TRANSLATE_X = self.viewPaddingLeft
      let MAX_TRANSLATE_Y = self.treeHeight + self.viewPaddingTop
      let MIN_TRANSLATE_Y = self.viewPaddingTop
      let MIN_RECT_WIDTH = 0
      let MIN_RECT_HEIGHT = 0
      function rectResizing(d) {
        let pt = self.getSvgCoordinates(treeCanvas.node(), d3.event.sourceEvent.clientX, d3.event.sourceEvent.clientY)
        let dragX = Math.max(
          Math.min(pt.x, MAX_TRANSLATE_X),
          MIN_TRANSLATE_X
        );
        let dragY = Math.max(
          Math.min(pt.y, MAX_TRANSLATE_Y),
          MIN_TRANSLATE_Y
        );
        let rect = d3.select(self.$el)
          .select('#'+self.treeCanvasId)
          .select('.tree-vis-region-outer')
        let x = +rect.attr('x')
        let y = +rect.attr('y')
        let w = +rect.attr('width')
        let h = +rect.attr('height')
        if (d3.select(this).classed("topleft")) {
          let newWidth = Math.max(w + x - dragX, MIN_RECT_WIDTH)
          x += w - newWidth;
          w = newWidth;
          let newHeight = Math.max(h + y - dragY, MIN_RECT_HEIGHT)
          y += h - newHeight;
          h = newHeight;
          d3.select(this)
            .attr('cx', x)
            .attr('cy', y)
        } else {
          // w = Math.max(dragX - x, MIN_RECT_WIDTH)
          // h = Math.max(dragY - y, MIN_RECT_HEIGHT)
          w = dragX - x, h = dragY - y
          d3.select(this)
            .attr('cx', x + w)
            .attr('cy', y + h)
        }
        rect.attr('x', x)
          .attr('y', y)
          .attr('width', w)
          .attr('height', h)
      }
    },
    //  展示message的信息
    showHintMessage: function(message, type) {
      this.$message({
        showClose: true,
        message: message,
        type: type
      });
    },
    // ZWT ADD END
    ...mapMutations([
      'UPDATE_TREE_DSL_ARRAY_KEY',
      'UPDATE_FOCUS_TREE_OBJ_ARRAY',
      'UPDATE_PREVIEW_TREE_OBJ',
      'UPDATE_SELECTED_PREVIEW_NODE_ID',
      'UPDATE_CURRENT_TREE_DSL_ARRAY'
    ])
  }
}
</script>

<!-- ZWT ADD HERE -->
<style lang="less">
.resize-circle-g circle:hover {
  cursor: move;
  r: 0.2rem;
}
.resize-circle-g circle.resizing {
  fill: #fff;
  fill-opacity: 1;
}
.resize-circle-g circle {
  stroke: #dadada;
  stroke-width: 0.05rem;
  fill: #dadada;
  fill-opacity: 1;
  visibility: hidden;
  r: 0.3rem;
}
.resize-circle-g.highlight circle {
  stroke: #dadada;
  stroke-width: 0.05rem;
  fill: #dadada;
  fill-opacity: 1;
  visibility: visible;
  r: 0.3rem;
}
</style>
<!-- ZWT ADD END -->

<style lang="less">
  .lineartree-node {
    stroke: white;
    // stroke-width: 0.01rem;
  }
  .lineartree-node.clickunhighlight:not(.mouseoverhighlight) {
    fill: #ccc;
    stroke: white;
    // opacity: 0.3;
  }
  .lineartree-node.mouseoverunhighlight:not(.clickhighlight) {
    fill: #ccc;
    // opacity: 0.3;
  }
  .lineartree-node[class~=mouseoverhighlight] {
    opacity: 1 !important;
  }
  .lineartree-node[class~=clickhighlight] {
    opacity: 1 !important;
  }
  .lineartree-node[class~=unselecttree] {
    opacity: 0 !important;
  }
  .lineartree-node[class~=select-root-node] {
    stroke: #fdae61;
    stroke-width: 0.15rem !important;
  }
</style>

<style lang="less">
  .tree-canvas {
    cursor: pointer;
    .canvas-region-outer {
      // OPACITY
      fill: rgba(255, 255, 255);
      // stroke: #9e9e9e;
      stroke-width: 0.05rem;
    }
    .mark-line {
      stroke: #dadada;
      fill: none;
    }
    .link {
      stroke: #4d4d4d;
      fill: none;
      &.unhighlight{
        opacity: 0.1;
      }
      shape-rendering: geometricPrecision;
    }
    .tree-vis-region-outer {
      fill: white;
      stroke-width: 0.1rem;
      &.highlight {
        stroke: #238af8;
      }
      &.hidden {
        opacity: 0;
      }
    }
    .resize-circle-g {
      &.hidden {
        opacity: 0 !important;
      }      
    }
    .partition-link-circle {
      fill: gray;
      r: 0.25rem;
      opacity: 0.3;
    }
    .partition-link-path {
      stroke: gray;
      stroke-width: 0.4rem;
      fill: none;
      opacity: 0.3;
    }
  }
</style>
<style scoped lang="less">
  @treevis-canvas-color: #f9f9f9;
  // .container, .tree-canvas {
  //   margin: 0;
  //   height: 100%;
  //   width: 100%;
  //   overflow: hidden;
  // }
  .container {
    position: relative;
    left: 0%;
    top: 0%;
    width: 100%;
    height: 100%;
    // border: solid 0.05rem #ccc;
    // OPACITY
    // background: @treevis-canvas-color;
    // background: rgba(255, 255, 255, 0);
    touch-action: pinch-zoom;
    .tree-canvas {
      // position: absolute;
      left: 0%;
      top: 0%;
      height: 100%;
      width: 100%;
      // OPACITY
      // background: rgba(255, 255, 255, 0);
    }
  }
  .container.highlight {
    background: #eeeeee;
  }
  .tree-node {
    stroke: white;
  }
  .Label {
    font: 8px sans-serif;
    text-anchor: middle;
  }
  #NodeLabel {   
    position: absolute;           
    text-align: left;
    padding: 20px;             
    margin: 10px;
    font: 12px sans-serif;        
    background: lightsteelblue;   
    border: 1px;      
    border-radius: 2px;           
    pointer-events: none;         
  }
  #NodeLabel h4{
    margin:0;
    font-size:14px;
  }
  #NodeLabel{
    background:rgba(0,0,0,0.9);
    border:1px solid grey;
    border-radius:5px;
    font-size:12px;
    width:auto;
    padding:4px;
    color:white;
    opacity:0;
  }
  #NodeLabel table{
    table-layout:fixed;
  }
  #NodeLabel tr td{
    padding:0;
    margin:0;
  }
  #NodeLabel tr td:nth-child(1){
    width:50px;
  }
  #NodeLabel tr td:nth-child(2){
    text-align:center;
  }

</style>