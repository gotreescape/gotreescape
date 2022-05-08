/* eslint-disable no-console */
/* jshint esversion: 8 */
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import * as m from 'lscg-solver'
import { mergeDeep } from '@/computation/deep_merge.js'
import { addDslDefaultSetting } from '@/dsl-processing/add_dsl_default_setting.js' 
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    attrObjArray: [],
    previewTreeObj: null,//  当前focused的层次结构对象
    selectedPreviewNodeId: null,
    viewSelectionMode: 'Sibling', // 'SingleNode', "Sibling", "SameDepth"
    viewSelectionMode2: 'Subtree', //  'SingleNode', 'Subtree'
    focusedTreeObjArray: [],
    selectedDataset: null, // 当前选择的层次结构数据集
    treeUnitDSLArray: [], // 当前在TreeUnit视图中显示的DSL数组
    treeUnitDSLName: null, // 当前在TreeUnit视图中显示的DSL的名称
    selectedDSLArray: [], //  在DSLlist视图中选择的DSL数组
    changedDSLNameState: 0, // 当前更新的DSL名称
    treeCanvasLayoutState: 0,
    treeUnitLayoutState: 0,
    treePreviewLayoutState: 0,
    selectParaName: null,
    dslListSelectedDSLName: null, // 在DSLlist中当前选中的DSL的名称，相当于点击某一个DSL对象
    dslListSelectedDSLState: 0,
    manipulateParaValue: null,
    manipulateValue: 0,
    manipulatePara: '',
    assignNodeQuery: 'index',
    assignRecursiveMode: 'true',
    assignDSLName: '',
    assembleMode: 'bottom-up',
    assembleSubtreeWidth: 'adaptive',
    assembleSubtreeHeight: 'adaptive',
    currentTreeDSLArray: [],
    userInfoName: 'Login',
    userInfoObj: null,
    currentDragComponent: null,
    //=========================
    hierarchicalData: null,
    originalHierarchicalDataObj: null,
    nodeArray: [],
    originalNodeArray: [],
    hierarchicalDSL: {},
    focusedDSLObj: {},
    treeDSLArray: [],
    treeDSLArrayKey: 0,
    //  鼠标hover的dsl对象
    hoveringDSLItem: null,
    treeViewUpdate: 0,
    currentTree: "test",
    treeDSLViewFormat: "block",
    treeDataViewFormat: "tree",
    treeDataViewSetting: false,
    dataDisplayMode: "tree", // "tree", "level"
    selectionMode: "Subtree", //  "SingleNode", "Subtree"
    //  表示layout的数据
    layouts: [], 
    //  表示layout的参数
    layoutParas: {},
    treeUnitLayout: [],
    partitionValue: 0,
    //  请求数据对象的数组
    partitionDataObjDic: {},
    drawerViewSelectionState: 'template', //在drawer视图上的选择状态
    focusedDSLObjIndex: 0,
    //  dragComponentState 可以是'DRAG-START', 'DRAG-OVER', 'DRAG-END' 三个状态
    dragComponentState: 'DRAG-END',
    //  树可视化形式语法的不同组件
    rootLayoutComponent: null,
    subtreeLayoutComponent: null,
    nodeComponent: null,
    linkComponent: null,
    coordComponent: null,
    hoverParam: '',
    hoverParamAxis: '',
    displayTapName: 'gotreescape', //  the attribute of displayTapName is either "gotreescape" or "treeillustrator"
    //=========================
    //  记录一组树的节点位置，便于计算距离
    positionArray: [],
    displayedPanel: 'map', // this state controls the displayed view, either vanvas or map
    selectedTreeDSLObj: null,
    selectedDatasetFilterList: [], // the default dataset filter\
    galleryDSLObjDict: {},
    relatedViewOpen: false,
    galleryOpen: false,
    showDSLInGalery: true,
    showDSLLinkInGalery: false,
    treevisSearchResult: [],
    showLandmarkPoint: true,
    showLandmarkPreview: true,
    showExistTreePoint: false,
    showExistTreePreview: false,
    landmarkPreviewAmount: 25,
    refreshLandmarkPreviewState: 0,
    selectedNodeListInThumbnail: [],
    // selectedTreeDSLIndex: -1
  },
  mutations: {
    ['UPDATE_CURRENT_DARG_COMPONENT'] (state, currentDragComponent) {
      state.currentDragComponent = currentDragComponent
    },
    ['UPDATE_USER_INFO_OBJ'] (state, userInfoObj) {
      state.userInfoObj = userInfoObj
    },
    ['UPDATE_USER_INFO_NAME'] (state, userInfoName) {
      state.userInfoName = userInfoName
    },
    ['UPDATE_CURRENT_TREE_DSL_ARRAY'] (state, currentTreeDSLArray) {
      state.currentTreeDSLArray = currentTreeDSLArray
    },
    ['UPDATE_ASSEMBLE_SUBTREE_HEIGHT'] (state, assembleSubtreeHeight) {
      state.assembleSubtreeHeight = assembleSubtreeHeight
    },
    ['UPDATE_ASSEMBLE_SUBTREE_WIDTH'] (state, assembleSubtreeWidth) {
      state.assembleSubtreeWidth = assembleSubtreeWidth
    },
    ['UPDATE_ASSEMBLE_MODE'] (state, assembleMode) {
      state.assembleMode = assembleMode
    },
    ['UPDATE_ASSIGN_DSL_NAME'] (state, assignDSLName) {
      state.assignDSLName = assignDSLName
    },
    ['UPDATE_ASSIGN_NODE_QUERY'] (state, assignNodeQuery) {
      state.assignNodeQuery = assignNodeQuery
    },
    ['UPDATE_ASSIGN_RECURSIVE_MODE'] (state, assignRecursiveMode) {
      state.assignRecursiveMode = assignRecursiveMode
    },
    //  更新属性值对象数组
    ['UPDATE_ATTR_OBJ_ARRAY'] (state, attrObjArray) {
      state.attrObjArray = attrObjArray
    },
    ['UPDATE_VIEW_SELECTION_MODE'] (state, viewSelectionMode) {
      state.viewSelectionMode = viewSelectionMode
    },
    ['UPDATE_VIEW_SELECTION_MODE2'] (state, viewSelectionMode2) {
      state.viewSelectionMode2 = viewSelectionMode2
    },
    ['UPDATE_PREVIEW_TREE_OBJ'] (state, previewTreeObj) {
      state.previewTreeObj = previewTreeObj
    },
    ['UPDATE_FOCUS_TREE_OBJ_ARRAY'] (state, focusedTreeObjArray) {
      state.focusedTreeObjArray = focusedTreeObjArray
    },
    ['UPDATE_SELECTED_PREVIEW_NODE_ID'] (state, selectedPreviewNodeId) {
      state.selectedPreviewNodeId = selectedPreviewNodeId
    },
    //  更新当前选择的层次结构数据集
    ['UPDATE_SELECTED_DATASET'] (state, selectedDataset) {
      state.selectedDataset = selectedDataset;
    },
    ['UPDATE_TREEUNIT_DSL_ARRAY'] (state, treeUnitDSLArray) {
      state.treeUnitDSLArray = treeUnitDSLArray;
    },
    ['UPDATE_TREEUNIT_DSL_NAME'] (state, treeUnitDSLName) {
      state.treeUnitDSLName = treeUnitDSLName;
    },
    ['UPDATE_CHANGED_DSL_NAME_STATE'] (state, changedDSLNameState) {
      state.changedDSLNameState = (state.changedDSLNameState + 1) % 2
    },
    ['UPDATE_TREE_CANVAS_LAYOUT_STATE'] (state, treeCanvasLayoutState) {
      state.treeCanvasLayoutState = (state.treeCanvasLayoutState + 1) % 2
    },
    ['UPDATE_TREE_UNIT_LAYOUT_STATE'] (state, treeUnitLayoutState) {
      state.treeUnitLayoutState = (state.treeUnitLayoutState + 1) % 2
    },
    ['UPDATE_TREE_PREVIEW_LAYOUT_STATE'] (state, treePreviewLayoutState) {
      state.treePreviewLayoutState = (state.treePreviewLayoutState + 1) % 2
    },
    //  更新TreeLayout
    ['UPDATE_LAYOUTS'] (state, layouts) {
      state.layouts = layouts
    },  
    ['UPDATE_TREE_UNIT_LAYOUTS'] (state, treeUnitLayout) {
      state.treeUnitLayout = treeUnitLayout
    },
    ['UPDATE_SELECT_PARA_NAME'] (state, selectParaName) {
      state.selectParaName = selectParaName
    },
    ['UPDATE_HOVER_PARAM'] (state, payload) {
      state.hoverParam = payload.param
      state.hoverParamAxis = payload.axis
    },
    ['UPDATE_DSLLIST_SELECTED_DSL_NAME'] (state, dslListSelectedDSLName) {
      state.dslListSelectedDSLName = dslListSelectedDSLName
    },
    ['UPDATE_DSLLIST_SELECTED_DSL_STATE'] (state) {
      state.dslListSelectedDSLState = (state.dslListSelectedDSLState + 1) % 2
    },
    ['MANIPULATE_PARA'] (state, payload) {
      state.manipulatePara = payload
    },
    ['MANIPULATE_VALUE'] (state, payload) {
      state.manipulateValue = payload
    },
    //  ===================
    //	更新读取的层次结构数据
    ['UPDATE_HIERARCHICAL_DATA'] (state, hierarchicalData) {
      state.hierarchicalData = hierarchicalData;
    },
    //  更新当前选择的DSL的数组
    ['UPDATE_SELECTED_DSL_ARRAY'] (state, selectedDSLArray) {
      state.selectedDSLArray = selectedDSLArray;
    },
    //  更新读取的原始层次结构数据
    ['UPDATE_ORIGINAL_HIERARCHICAL_DATA'] (state, originalHierarchicalDataObj) {
      state.originalHierarchicalDataObj = originalHierarchicalDataObj;
    },
    //	更新对于层次结构数据进行线性化得到的节点数组
    ['UPDATE_NODE_ARRAY'] (state, nodeArray) {
      state.nodeArray = nodeArray;
    },
    //  更新原始层次结构数据进行线性化得到的节点数组   
    ['UPDATE_ORIGINAL_NODE_ARRAY'] (state, originalNodeArray) {
      state.originalNodeArray = originalNodeArray;
    },
    //  更新层次结构数据的domain specific language
    ['UPDATE_HIERARCHICAL_DSL'] (state, hierarchicalDSL) {
      state.hierarchicalDSL = hierarchicalDSL;
    },
    //  Update current tree visualization
    ['UPDATE_CURRENT_TREE'] (state, currentTree) {
      state.currentTree = currentTree;
    },
    //  更新dsl视图中的显示格式
    ['UPDATE_DSL_VIEW_FORMAT'] (state, currentDSLFormat) {
      state.treeDSLViewFormat = currentDSLFormat
    },
    //  更新data视图中的显示格式
    ['UPDATE_DATA_VIEW_FORMAT'] (state, currentDataFormat) {
      state.treeDataViewFormat = currentDataFormat
    },
    //  更新data视图中的设置的菜单栏是否显示
    ['UPDATE_DATA_VIEW_SETTING'] (state, treeDataViewSetting) {
      state.treeDataViewSetting = treeDataViewSetting
    },
    //  更新存储treeDSL的数组
    ['UPDATE_TREE_DSL_ARRAY'] (state, treeDSLArray) {
      state.treeDSLArray = treeDSLArray
    },
    //  更新存储treeDSL的数组的key值
    ['UPDATE_TREE_DSL_ARRAY_KEY'] (state, treeDSLArrayKey) {
      state.treeDSLArrayKey = treeDSLArrayKey
    },
    //  更新数据的显示模式
    ['UPDATE_DATA_DISPLAY_MODE'] (state, dataDisplayMode) {
      state.dataDisplayMode = dataDisplayMode
    },
    //  更新数据的选择模式
    ['UPDATE_SELECTION_MODE'] (state, selectionMode) {
      state.selectionMode = selectionMode
    },
    ['UPDATE_HOVERING_DSL_ITEM'] (state, hoveringDSLItem) {
      state.hoveringDSLItem = hoveringDSLItem
    },
    ['UPDATE_FOCUSED_DSL_OBJ'] (state, focusedDSLObj) {
      state.focusedDSLObj = focusedDSLObj
    },
    ['UPDATE_LAYOUT_PARAS'] (state, layoutParas) {
      state.layoutParas = layoutParas
    },
    ['UPDATE_PARTITION_VALUE'] (state, partitionValue) {
      state.partitionValue = partitionValue
    },
    ['UPDATE_PARTITION_DATA_OBJ_DIC'] (state, partitionDataObjDic) {
      state.partitionDataObjDic = partitionDataObjDic
    },
    ['UPDATA_DRAWER_VIEW_SELECTION_STATE'] (state, drawerViewSelectionState) {
      state.drawerViewSelectionState = drawerViewSelectionState
    },
    ['UPDATE_FOCUSED_DSL_OBJ_INDEX'] (state, focusedDSLObjIndex) {
      state.focusedDSLObjIndex = focusedDSLObjIndex
    },
    //  更新当前drag component的状态
    ['UPDATE_DRAG_COMPONENT_STATE'] (state, dragComponentState) {
      state.dragComponentState = dragComponentState
    },
    //  下面是更新Grammar的不同组件
    ['UPDATE_ROOT_LAYOUT'] (state, rootLayoutComponent) {
      state.rootLayoutComponent = rootLayoutComponent
    },
    ['UPDATE_SUBTREE_LAYOUT'] (state, subtreeLayoutComponent) {
      state.subtreeLayoutComponent = subtreeLayoutComponent
    },
    ['UPDATE_NODE'] (state, nodeComponent) {
      state.nodeComponent = nodeComponent
    },
    ['UPDATE_LINK'] (state, linkComponent) {
      state.linkComponent = linkComponent
    },
    ['UPDATE_COORD'] (state, coordComponent) {
      state.coordComponent = coordComponent
    },
    ['UPDATE_DISPLAYED_PANEL'] (state) {
      if (state.displayedPanel === 'map') {
        state.displayedPanel = 'canvas'
      } else {
        state.displayedPanel = 'map'
      }
    },
    ['UPDATE_SELECTED_TREE_DSL_OBJ'] (state, selectedTreeDSLObj) {
      state.selectedTreeDSLObj = selectedTreeDSLObj
    },
    ['UPDATE_SELECTED_DATASET_FILTER_LIST'] (state, selectedDatasetFilterList) {
      state.selectedDatasetFilterList = selectedDatasetFilterList
    },
    ['UPDATE_GALLERY_DSL_OBJ_DICT'] (state, galleryDSLObjDict) {
      state.galleryDSLObjDict = galleryDSLObjDict
    },
    ['UPDATE_RELATED_VIEW_OPEN'] (state, relatedViewOpen) {
      state.relatedViewOpen = relatedViewOpen
    },
    ['UPDATE_GALLERY_OPEN'] (state, galleryOpen) {
      state.galleryOpen = galleryOpen
    },
    ['UPDATE_SHOW_DSL_IN_GALLERY'] (state, showDSLInGalery) {
      state.showDSLInGalery = showDSLInGalery
    },
    ['UPDATE_SHOW_DSL_LINK_IN_GALLERY'] (state, showDSLLinkInGalery) {
      state.showDSLLinkInGalery = showDSLLinkInGalery
    },
    ['UPDATE_TREEVIS_SEARCH_RESULT'] (state, treevisSearchResult) {
      state.treevisSearchResult = treevisSearchResult
    },
    ['UPDATE_SHOW_LAND_MARK_POINT_STATE'] (state, showLandmarkPoint) {
      state.showLandmarkPoint = showLandmarkPoint
    },
    ['UPDATE_SHOW_LAND_MARK_PREVIEW_STATE'] (state, showLandmarkPreview) {
      state.showLandmarkPreview = showLandmarkPreview
    },
    ['UPDATE_SHOW_EXISTED_TREE_POINT_STATE'] (state, showExistTreePoint) {
      state.showExistTreePoint = showExistTreePoint
    },
    ['UPDATE_SHOW_EXISTED_TREE_PREVIEW_STATE'] (state, showExistTreePreview) {
      state.showExistTreePreview = showExistTreePreview
    },
    ['UPDATE_LAND_PREVIEW_AMOUNT'] (state, landmarkPreviewAmount) {
      state.landmarkPreviewAmount = landmarkPreviewAmount
    },
    ['REFRESH_LANDMARK_PREVIEW'] (state) {
      state.refreshLandmarkPreviewState = (state.refreshLandmarkPreviewState + 1) % 2
    },
    ['UPDATE_DISPLAY_TAP_NAME'] (state, displayTapName) {
      state.displayTapName = displayTapName
    },
    ['UPDATE_SELECTED_NODE_LIST_IN_THUMBNAIL'] (state, selectedNodeListInThumbnail) {
      state.selectedNodeListInThumbnail = selectedNodeListInThumbnail
    },
    // ['UPDATE_SELECTED_TREE_DSL_INDEX'] (state, selectedTreeDSLIndex) {
    //   state.selectedTreeDSLIndex = selectedTreeDSLIndex
    // },
  },
  actions: {
    // eslint-disable-next-line no-unused-vars
    updateTreeDSL({commit, state}, updateDSLInfo) {
      let treeDSLContent = updateDSLInfo.treeDSLContent
      let editorId = updateDSLInfo.editorId
      for (let i = 0;i < state.treeDSLArray.length;i++) {
        if(state.treeDSLArray[i].editorId === editorId) {
          state.treeDSLArray[i].content = treeDSLContent
        }
      }
    },
    updateTreeUnitLayout({commit}, payload) {
      commit('UPDATE_TREE_UNIT_LAYOUTS', payload)
    },
    setDSLComponent({commit, state}, componentObj) {
      if (state.treeUnitDSLArray.length === 0) {
        //  如果当前TreeUnitDSLArray为空，那么就创建一个新的DSLObj
        let treeUnitDSLObj = {}
        treeUnitDSLObj.name = "untitled0"
        //  初始化treeUnitDSLObj中的DSL对象
        treeUnitDSLObj.dslObj = get_new_tree_dsl_obj(treeUnitDSLObj.name)
        //  将初始化的DSL对象与componentObj进行合并
        treeUnitDSLObj.dslObj = mergeDeep(treeUnitDSLObj.dslObj, componentObj)
        //  更新选择的DSL对象
        sysDatasetObj.updateSelectedDSLObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
        //  向选择的DSL数组中增加DSL名称
        state.selectedDSLArray.push(treeUnitDSLObj.name)
        sysDatasetObj.updateTreeDSLContentObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
        //  向TreeUnitDSL数组中增加新的UnitDSL对象
        state.treeUnitDSLArray.push(treeUnitDSLObj)
        state.treeUnitDSLArray = JSON.parse(JSON.stringify(state.treeUnitDSLArray))
        setTimeout(function() {
          if (state.treeUnitDSLArray.length >= 1) {
            let treeUnitDSLName = state.treeUnitDSLArray[0].name
            // 选中在DSLlist中当前新建的dsl对象
            commit('UPDATE_DSLLIST_SELECTED_DSL_NAME', treeUnitDSLName)
            commit('UPDATE_TREEUNIT_DSL_NAME', treeUnitDSLName)
          }
          // 在修改参数之后更新TREEUNIT视图
          commit('UPDATE_TREE_UNIT_LAYOUT_STATE')
          // 更新Treecanvas视图中的DSL对象，并且触发信号更新
          sysDatasetObj.updateTreeDSLContentObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
          commit('UPDATE_TREE_CANVAS_LAYOUT_STATE')
          // 更新preview视图中的DSL对象，并且触发信号更新
          sysDatasetObj.updateSelectedDSLObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
          commit('UPDATE_TREE_PREVIEW_LAYOUT_STATE')        
        }, 200)
      } else {
        //  如果DSL已经存在，那么就更新当前的DSL
        for (let i = 0;i < state.treeUnitDSLArray.length;i++) {
          let treeUnitDSLObj = state.treeUnitDSLArray[i]
          if (treeUnitDSLObj.name === state.treeUnitDSLName) {
            let existingTreeDSLObj = mergeDeep(treeUnitDSLObj.dslObj, componentObj)
            console.log('existingTreeDSLObj', existingTreeDSLObj)
            treeUnitDSLObj.dslObj = existingTreeDSLObj
            // 在修改参数之后更新TREEUNIT视图
            commit('UPDATE_TREE_UNIT_LAYOUT_STATE')  
            // 更新Treecanvas视图中的DSL对象，并且触发信号更新
            sysDatasetObj.updateTreeDSLContentObject(state.treeUnitDSLName, existingTreeDSLObj)
            commit('UPDATE_TREE_CANVAS_LAYOUT_STATE')
            // 更新preview视图中的DSL对象，并且触发信号更新
            sysDatasetObj.updateSelectedDSLObject(state.treeUnitDSLName, existingTreeDSLObj)
            commit('UPDATE_TREE_PREVIEW_LAYOUT_STATE')
          }
        }
        // state.treeUnitDSLArray = JSON.parse(JSON.stringify(state.treeUnitDSLArray))       
      }
      //  初始化一个新的DSL对象
      function get_new_tree_dsl_obj(dslName) {
        let newTreeDSLObj = {}
        addDslDefaultSetting(newTreeDSLObj)
        newTreeDSLObj.Name = dslName
        return newTreeDSLObj
      }
    },
    removeDSLComponent: function({commit, state}, componentType) {
      for (let i = 0;i < state.treeUnitDSLArray.length;i++) {
        let treeUnitDSLObj = state.treeUnitDSLArray[i]
        if (treeUnitDSLObj.name === state.treeUnitDSLName) {
          let editDSLObj = treeUnitDSLObj.dslObj
          // 删除当前的TreeUnit的某些组件部分
          if (componentType === 'Root') {
            editDSLObj.Layout.X.Root.Relation = 'Undefined'
            editDSLObj.Layout.Y.Root.Relation = 'Undefined'
          } else if (componentType === 'Subtree') {
            editDSLObj.Layout.X.Subtree.Relation = 'Undefined'
            editDSLObj.Layout.Y.Subtree.Relation = 'Undefined'
          } else if (componentType === 'Node') {
            editDSLObj.Element.Node = 'hidden'
          } else if (componentType === 'Link') {
            editDSLObj.Element.Link = 'hidden'
          } else if (componentType === 'CoordinateSystem') {
            delete editDSLObj.CoordinateSystem 
          }
          // 更新Treecanvas视图中的DSL对象，并且触发信号更新
          sysDatasetObj.updateTreeDSLContentObject(state.treeUnitDSLName, editDSLObj)
          commit('UPDATE_TREE_CANVAS_LAYOUT_STATE')
          // 更新preview视图中的DSL对象，并且触发信号更新          
          sysDatasetObj.updateSelectedDSLObject(state.treeUnitDSLName, editDSLObj)
          commit('UPDATE_TREE_PREVIEW_LAYOUT_STATE')  
        }
      }
      state.treeUnitDSLArray = JSON.parse(JSON.stringify(state.treeUnitDSLArray))
      commit('UPDATE_TREE_UNIT_LAYOUT_STATE') 
    }
  }
})

