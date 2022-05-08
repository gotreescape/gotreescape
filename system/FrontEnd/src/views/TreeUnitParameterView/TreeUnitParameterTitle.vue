<template>
  <div class = "treeunit-view-title">
    <span class = "text">{{title}}</span>
    <span class = "operation">
      <el-tooltip class='labelIcon' content="new" effect="light"> 
        <span class = "operation-icon" @click.stop.prevent="newDSL">
          <span class="icon iconfont icon-xinjian"></span>
        </span>
      </el-tooltip>      
      <!-- <el-divider direction="vertical"></el-divider>
      <el-tooltip class='labelIcon' content="save" effect="light"> 
        <span class = "operation-icon" @click.stop.prevent="saveDSL">
          <span class="icon iconfont icon-baocun"></span>
        </span>
      </el-tooltip> -->
      <!-- <el-divider direction="vertical"></el-divider>
    	<el-tooltip class='labelIcon' content="remove" effect="light"> 
	        <span class = "operation-icon">
		        <span class="icon iconfont icon-iconfontshanchu"
		                  @click.stop.prevent="removeCurrentDSL"></span>
	        </span>
      </el-tooltip> -->
    	<el-divider direction="vertical"></el-divider>
    	<el-tooltip class='labelIcon' content="save as" effect="light"> 
	    	<span class = "operation-icon" @click.stop.prevent="saveAsNewDSL">
	    		<span class="icon iconfont icon-lingcunwei"></span>
	    	</span>
    	</el-tooltip>
    </span>
    <el-dialog
      id="dsl-name-dialog"
      title="GoTree Name"
      :visible.sync="saveDialogVisible"
      @opened="initShowDSLName"
      width="30%">
      <div id="dsl-name-hint">Please enter the name of the GoTree DSL. You can use letters ( <b>A-Z</b>, <b>a-z</b> ), numbers ( <b>0-9</b> ) & underline ( <b>_</b> ). </div>
      <el-input placeholder="GoTreeExample1" v-model="gotreeName" :autofocus="true" @change="changeGoTreeName"></el-input>
      <div id="dsl-name-warning-hint">{{dslNameWarningHint}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelGoTreeName">Cancel</el-button>
        <el-button type="primary" @click="confirmGoTreeName">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- save as的对话框 -->
    <el-dialog
      id="dsl-name-dialog"
      title="GoTree Template Rename"
      :visible.sync="saveAsDialogVisible"
      @opened="initShowDSLName"
      width="30%">
      <!-- 覆盖存在的DSL的确认对话框 -->
      <el-dialog
          width="30%"
          title="Warning"
          :visible.sync="overlapDSLDialogVisible"
          append-to-body>
          <div id="dsl-name-hint">Do you want to overwrite the existing 
            <span class="highlight"><b>{{ gotreeName }}</b></span> DSL?
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="cancelOverlapExistingDSL">Cancel</el-button>
            <el-button type="primary" @click="confirmOverlapExistingDSL">Confirm</el-button>
          </span>
      </el-dialog>
      <div id="dsl-name-hint">Please enter the name of the GoTree DSL. You can use letters ( <b>A-Z</b>, <b>a-z</b> ), numbers ( <b>0-9</b> ) & underline ( <b>_</b> ). </div>
      <el-input placeholder="GoTreeExample1" v-model="gotreeName" :autofocus="true" @change="changeGoTreeName"></el-input>
      <div id="dsl-name-warning-hint">{{dslNameWarningHint}}</div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelGoTreeName">Cancel</el-button>
        <el-button type="primary" @click="confirmGoTreeName">Confirm</el-button>
      </span>
    </el-dialog>
    <!-- 提示创建DSL的对话框 -->
    <el-dialog
      id="selection-alert-dialog"
      title="Warning"
      :visible.sync="selectionAlertDialog"
      width="30%">
      <div id="dsl-name-hint">Please select one GoTree DSL from GoTreeListView or select components to create one GoTree DSL. </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectionAlertDialog = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script> 
import { mapState, mapMutations } from 'vuex';
import { getConfig } from '@/config/config.js'
import { addDslDefaultSetting } from '@/dsl-processing/add_dsl_default_setting.js'

export default {
  name: 'TreeUnitParameterTitle',
  props: {
  },
  data() {
    return {
    	title: 'TreeUnitView',
      saveAsDialogVisible: false,
      saveDialogVisible: false,
      selectionAlertDialog: false,
      overlapDSLDialogVisible: false,
      gotreeName: '',
      dslNameDialogComponentKey: 1,
      dslNameWarningHint: ''
    }
  },
  created: function() {},
  beforeMount: function() {
    // 初始化GoTreeName的名称
  },
  mounted: function() {
  },
  watch: {
  },
  computed: { 
    ...mapState([
      'treeUnitDSLArray',
      'treeUnitDSLName',
      'dslListSelectedDSLName',
      'selectedDSLArray',
      'selectedTreeDSLObj',
      'galleryDSLObjDict'
    ])
  }, 
  methods: {
    newDSL: function() {
      let maximumIndex = 0
      // 找到treeUnitDSLArray所有未命名的DSL对象的index最大值
      // for (let i = 0;i < this.treeUnitDSLArray.length;i++) {
      //   let treeUnitDSLObj = this.treeUnitDSLArray[i]
      //   let name = treeUnitDSLObj.name
      //   let untitledIndex = +name.replace('untitled','')
      //   if (untitledIndex > maximumIndex) {
      //     maximumIndex = untitledIndex
      //   }
      // }
      for (let i = 0;i < this.selectedDSLArray.length;i++) {
        let name = this.selectedDSLArray[i]
        let untitledIndex = +name.replace('untitled','')
        if (untitledIndex > maximumIndex) {
          maximumIndex = untitledIndex
        }
      }
      console.log('newTreeDSLObj', newTreeDSLObj)
      let treeUnitDSLObj = {}
      treeUnitDSLObj.name = "untitled" + (maximumIndex + 1)
      let newTreeDSLObj = this.get_new_tree_dsl_obj(treeUnitDSLObj.name)
      treeUnitDSLObj.dslObj = newTreeDSLObj
      console.log('newTreeDSLObj', newTreeDSLObj)
      // {
      //   Name: treeUnitDSLObj.name,
      //   Layout:{
      //     Category: "AxisIndependent",
      //     Mode: "bottom-up",
      //     X: {
      //       Subtree: {
      //         Relation: 'flatten'
      //       },
      //       Root: {
      //         Relation: 'juxtapose'
      //       }
      //     },
      //     Y: {
      //       Subtree: {
      //         Relation: 'align'
      //       },
      //       Root: {
      //         Relation: 'within'
      //       }
      //     }
      //   },
      //   CoordinateSystem: {
      //     Category: "cartesian"
      //   },
      //   Element: {
      //     Node: "circle"
      //   }
      // }
      //  更新DSL数组以及名称
      this.treeUnitDSLArray.push(treeUnitDSLObj)
      console.log('treeUnitDSLArray', this.treeUnitDSLArray)
      //  更新选择的DSL对象
      sysDatasetObj.updateSingleSelectedDSLObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
      //  向选择的DSL数组中增加DSL名称
      this.selectedDSLArray.push(treeUnitDSLObj.name)
      // sysDatasetObj.updateTreeDSLContentObject(treeUnitDSLObj.name, treeUnitDSLObj.dslObj)
      // 更新在DSLlist中选中的DSL对象
      this.UPDATE_TREEUNIT_DSL_NAME(treeUnitDSLObj.name)
      // 如果当前在DSLlist中选择的DSL对象为null，那么更新当前的选择，否则就不会更新
      if (this.dslListSelectedDSLName == null) {
        this.UPDATE_DSLLIST_SELECTED_DSL_NAME(treeUnitDSLObj.name)
      }
    },
    //  初始化新的DSL对象
    get_new_tree_dsl_obj: function(dslName) {
      let newTreeDSLObj = {}
      addDslDefaultSetting(newTreeDSLObj)
      newTreeDSLObj.Name = dslName
      return newTreeDSLObj
    },
    saveDSL: function() {
      let config = getConfig()
      let cartesianDSLArray = config.cartesianDSLArray
      let polarDSLArray = config.polarDSLArray
      let goTreeName = this.goTreeName
      if (typeof(goTreeName) === 'undefined') {
        goTreeName = this.treeUnitDSLName
      }
      if (this.treeUnitDSLName == null) {
        // 提示创建新的DSL，或者选择某个DSL
        this.selectionAlertDialog = true
      } else {
        let polarDSLArrayExist = (polarDSLArray.indexOf(goTreeName) !== -1)
        let cartesianDSLArrayExist = (cartesianDSLArray.indexOf(goTreeName) !== -1)
        if ((sysDatasetObj.isDSLObjectExist(goTreeName)) && (!polarDSLArrayExist) && (!cartesianDSLArrayExist)) {
          //  如果当前编辑的对象在选择的DSL对象中存在，并且并不是在gallary中存在的对象，那么直接更新
          this.updateSelectedDSLArray()
        } else {
          //  否则显示对话框提示是否需要编辑姓名
          this.saveDialogVisible = true
        }
      }
    },
  	saveAsNewDSL: function() {
      let self = this
      if (this.treeUnitDSLName == null) {
        // 提示创建新的DSL，或者选择某个DSL
        this.selectionAlertDialog = true
      } else {
        this.saveAsDialogVisible = true
        // this.initShowDSLName()
      }
  	},
    cancelOverlapExistingDSL: function() {
      this.overlapDSLDialogVisible = false
    },
    confirmOverlapExistingDSL: function() {
      this.overlapDSLDialogVisible = false
      this.updateDSLArray()
      // 关闭更新当前DSL的对话框
      this.saveAsDialogVisible = false
    },
  	removeCurrentDSL: function() {
  		console.log('remove')
  	},
    cancelGoTreeName: function(GoTree) {
      // 不修改当前的DSL名称
      this.saveAsDialogVisible = false
    },
    confirmGoTreeName: function() {
      let config = getConfig()
      let cartesianDSLArray = config.cartesianDSLArray
      let polarDSLArray = config.polarDSLArray
      let goTreeName = this.goTreeName
      if (typeof(goTreeName) === 'undefined') {
        goTreeName = this.treeUnitDSLName
      }
      // console.log('polarDSLArray', polarDSLArray, 'cartesianDSLArray', cartesianDSLArray, 'goTreeName', this.goTreeName)
      // 判断这个名字是否符合要求，或者与现有的名字重复
      let polarDSLArrayExist = (polarDSLArray.indexOf(goTreeName) !== -1)
      let cartesianDSLArrayExist = (cartesianDSLArray.indexOf(goTreeName) !== -1)
      if (checkDSLName(goTreeName)) {
        if (polarDSLArrayExist || cartesianDSLArrayExist) {
          this.dslNameWarningHint = "The name already exists in the Gallary. Please use another name."          
        } else {
          this.dslNameWarningHint = ""
          if (sysDatasetObj.isDSLObjectExist(goTreeName)) {
            //  如果选择的DSL在当前系统中存在, 那么弹出提示询问用户是否覆盖当前的DSL
            this.overlapDSLDialogVisible = true
          } else {
            //  不存在就直接保存选择的DSL的名称
            this.updateDSLArray()
            this.saveAsDialogVisible = false
            this.saveDialogVisible = false
          }
        }
      } else {
        this.dslNameWarningHint = "The name does not match the above rule."
      }
      function checkDSLName(dslName) {  
        var re =  /^[0-9a-zA-Z]\w*$/;  //判断字符串是否为数字和字母组合     
        if (!re.test(dslName)) {  
          return false;  
        } else {  
          return true;  
        }  
      }  
    },
    //  更新系统中全部相关的DSL数据
    updateDSLArray: function() {
      this.updateTreeUnitDSLArray()
      this.updateSelectedDSLArray()
    },
    //  更新当前的DSL名称
    updateTreeUnitDSLArray: function() {
      let self = this
      let updateDSLName = this.gotreeName
      let galleryDSLObjDict = JSON.parse(JSON.stringify(this.galleryDSLObjDict))
      // 更新treeUnitDSLArray视图中名称的信息
      for (let i = 0;i < this.treeUnitDSLArray.length;i++) {
        let treeUnitDSLObj = this.treeUnitDSLArray[i]
        if (treeUnitDSLObj.name === this.treeUnitDSLName) {
          let treeUnitDSLObjSaveAs = JSON.parse(JSON.stringify(treeUnitDSLObj))
          treeUnitDSLObjSaveAs.name = updateDSLName
          // save the modified tree dsl object as a new one
          galleryDSLObjDict[updateDSLName] = [treeUnitDSLObjSaveAs['dslObj']]
          this.UPDATE_SELECTED_TREE_DSL_OBJ({'index': updateDSLName, 'dsl': treeUnitDSLObjSaveAs['dslObj']})
          this.UPDATE_TREEUNIT_DSL_ARRAY([{ "name": updateDSLName, "dslObj": treeUnitDSLObjSaveAs['dslObj'], "visible": true }])
          // update the gallery view and also update the tree dsl list view
          this.UPDATE_GALLERY_DSL_OBJ_DICT(galleryDSLObjDict)
          //  更新当前显示的DSLName，选择更新之后的对象
          setTimeout(function() {
            self.UPDATE_TREEUNIT_DSL_NAME(updateDSLName)
          }, 200)
          // update the layout of tree unit view
          setTimeout(function() {
            self.UPDATE_TREE_UNIT_LAYOUT_STATE()
          }, 500)
          //  update the tree canvas view
          setTimeout(function() {
            self.UPDATE_TREE_CANVAS_LAYOUT_STATE()
          }, 900)
          break;
        }
      }      
    },
    // 更新DSLlist视图中的DSL预览视图以及DSL
    updateSelectedDSLArray: function() {
      let toSavedDSLName = this.gotreeName
      // sysObj updateSelectedDSLObject
      for (let i = 0;i < this.treeUnitDSLArray.length;i++) {
        if (this.treeUnitDSLArray[i].name === toSavedDSLName) {
          //  这个是新的要保存的DSL
          let dslObj = this.treeUnitDSLArray[i].dslObj
          sysDatasetObj.updateSelectedDSLObject(toSavedDSLName, dslObj)
          sysDatasetObj.updateTreeDSLContentObject(toSavedDSLName, dslObj)          
        }
      }
      // store selectedDSLArray
      if (this.selectedDSLArray.indexOf(toSavedDSLName) === -1) {
        this.selectedDSLArray.push(toSavedDSLName)
      }
      //  发出信号，表示房钱更新了这个DSL
      this.UPDATE_CHANGED_DSL_NAME_STATE()
    },
    changeGoTreeName: function(name) {
      if (typeof(name) !== 'undefined') {
        this.goTreeName = name
      }
    },
    initShowDSLName: function() {
      console.log('initShowDSLName', this.treeUnitDSLName)
      this.gotreeName = this.treeUnitDSLName
      console.log('initShowDSLName this.goTreeName', this.gotreeName)
    },
    ...mapMutations([
      "UPDATE_TREEUNIT_DSL_ARRAY",
      "UPDATE_TREEUNIT_DSL_NAME",
      "UPDATE_CHANGED_DSL_NAME_STATE",
      "UPDATE_DSLLIST_SELECTED_DSL_NAME",
      "UPDATE_GALLERY_DSL_OBJ_DICT",
      "UPDATE_SELECTED_TREE_DSL_OBJ", 
      "UPDATE_TREE_UNIT_LAYOUT_STATE", 
      "UPDATE_TREE_CANVAS_LAYOUT_STATE"
    ])
  }
}
</script>

<style scoped lang="less">
  .treeunit-view-title {
    display: flex; 
    width: 100%; 
    height: 100%; 
    margin: auto; 
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    border-bottom: 1px solid #E4E7ED;
    .text {
       padding-left: 0.5rem;
       margin-left: 0; /* Important */ 
       margin-right: 0; /* Important */ 
       margin-top: auto; /* Important */ 
       margin-bottom: auto; /* Important */ 
       text-align: left;
       font-weight: bold;
    }
    .operation {
       display: flex; 
       flex-direction: row;
       align-items: baseline;
       margin-top: auto; /* Important */ 
       margin-bottom: auto; /* Important */ 
       margin-right: 0.5rem;
       margin-left: auto;
       font-size: 14px;
       .operation-icon {
          padding: 0.2rem;
       }
       .operation-icon:hover {
    	  background: #ccc !important;
  	   }
       .mode-selection {
          margin-left: 0.8rem;
       }
    }
    #dsl-name-dialog {
      text-align: left;
      #dsl-name-hint {
        padding-bottom: 15px;
        .highlight {
          color: red;
        }
      }
      #dsl-name-warning-hint {
        color: red;
      }
    }
    #selection-alert-dialog {
      text-align: left;
    }
  }
 //  .treeunit-view-title {
	// 	
	// 	width: 100%;
	// 	height: 100%;
	// 	border-bottom: 1px solid #E4E7ED;
	// 	.label {
	// 		text-align: left;
	// 		padding-left: 10px;
	// 		font-weight: bold;
	// 		font-size: 1.2rem;
	// 		height: 2rem;
	// 		display: table;
	// 		.inner-title {
	// 		  vertical-align: middle;
	// 		  display: table-cell;
	// 		}
	// 	}
	// 	.operation {
	// 		text-align: right;
	// 		padding-right: 10px;
	// 		font-weight: bold;
	// 		font-size: 1.2rem;
	// 		height: 2rem;
	// 		display: table;
	// 		.inner-title {
	// 		  vertical-align: middle;
	// 		  display: table-cell;
	// 		}
	// 	}
	// }
</style>
