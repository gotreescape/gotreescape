<template>
	<div id = 'dsl-dialog'>
		<div class = "content-container">
			<div class = "inner-title first-title">System Library</div>
			<div class = "tree-collection">
				<div class="example"
					 v-for="(exampleObj, index) in systemTreeTemplateArray">
					<div class="preview">
					   	<SinglePreviewFigure
					   		:key="exampleObj.treename"
					   		:dslId="exampleObj.treename"
					   		:getTreeDSLObj="getTreeDSLObj"
					   		:operation="userInfoName==='root'?rootSystemTemplateOperation:systemTemplateOperation"
					   		:add2DSLList="selectTreeDSL"
					 		:defaultOperationFunc="selectTreeDSL">
					   	</SinglePreviewFigure>
					</div>
				</div>
			</div>
			<div class = "inner-title">Your Templates</div>
			<div class = "tree-collection">
				<div class="upload" 
					 @click="addNewTreeDSL()">
					<div class="preview">
					   	<el-upload
						  class="avatar-uploader"
						  action="https://jsonplaceholder.typicode.com/posts/"
						  :show-file-list="false"
						  :http-request="getFile"
						  :on-success="handleTemplateSuccess"
						  :before-upload="beforeTemplateUpload">
						  <i class="el-icon-plus avatar-uploader-icon"></i>
						</el-upload>
					</div>	
				</div>
				<div class="example" 
					 v-for="(exampleObj, index) in userTreeTemplateArray">
					<div class="preview">
					   	<SinglePreviewFigure
					   		:key="exampleObj.treename"
					   		:dslId="exampleObj.treename"
					   		:getTreeDSLObj="getTreeDSLObj"
					   		:operation="userTemplateOperation"
					 		:defaultOperationFunc="selectTreeDSL"
					   		:add2DSLList="selectTreeDSL">
					   	</SinglePreviewFigure>
					</div>
				</div>
			</div>
			<el-dialog
		        width="30%"
		        title="GoTree Template Name"
		        :visible.sync="templateNameDialogVisible"
		        append-to-body>
		        <div id="dsl-name-hint">Please input the name of the import template:</div>
		        <el-input placeholder="GoTreeExample1" v-model="realTemplateName" 
		        	:autofocus="false" @input="changeGoTreeName"></el-input>
      			<div class="template-name-warning-hint">{{templateNameWarningHint}}</div>
		        <span slot="footer" class="dialog-footer">
		           <el-button @click="cancelImportDSLTemplate">Cancel</el-button>
		           <el-button  :disabled="(selectedDSLArray.indexOf(realTemplateName)!==-1)"
		           		type="primary" @click="confirmImportDSLTemplate">Confirm</el-button>
		        </span>
		    </el-dialog>
    	</div>
    	<!-- <div><el-button type="primary">Primary</el-button></div> -->
	</div>
</template>

<script>
  import { getConfig } from '@/config/config.js'
  import { dataset } from '@/dataset/dataset.js'
  import { mapState, mapMutations } from 'vuex';
  import { getHierarchicalDSL } from '@/data-processing/get_hierarchical_dsl.js'
  import SinglePreviewFigure from '@/views/DslList/SinglePreviewFigure.vue';
  // import { addTreeTemplate, removeTreeTemplate } from '@/communication/sendData.js'

  export default {
	name: 'DataDialog',
	components: {
		SinglePreviewFigure
	},
	data() {
	  return {
	  	systemTemplateOperation: ['add2dsllist'],
	  	rootSystemTemplateOperation: ['add2dsllist', 'gallery-remove'],
	  	userTemplateOperation: ['add2dsllist', 'gallery-remove'],//
	  	systemTreeTemplateArray: [],
	  	userTreeTemplateArray: [],
	  	templateNameDialogVisible: false,
	  	realTemplateName: 'gotree',
	  	exampleName: 'gotree',
	  	templateNameWarningHint: '',
	   	// cartesianExampleObjArray: [],
	   	// polarExampleObjectArray: []
   	  }	
	},
	watch: {
		treedslDialogUpdate: function() {
			this.updateSystemTreeTemplateArray()
			this.updateUserTreeTemplateArray()
		}
	},
	props: {
		treedslDialogUpdate: {
			type: Number
		},
		updateCurrentTreeDSLIndex: {
			type: Function
		}
  	},
	created: function () {
	},
	beforeMount: function() {
		let config = getConfig()
		this.updateSystemTreeTemplateArray()
		this.updateUserTreeTemplateArray()
		//	初始化cartesian example Array
		// let cartesianDSLArray = config.cartesianDSLArray
		// let cartesianExampleObjArray = this.initExampleArray(cartesianDSLArray)
		// this.cartesianExampleObjArray = cartesianExampleObjArray
		// //	初始化polar example array
		// let polarDSLArray = config.polarDSLArray
		// let polarExampleObjectArray = this.initExampleArray(polarDSLArray)
		// this.polarExampleObjectArray = polarExampleObjectArray
	},
	mounted: function() {
		console.log('mounted')
	},
	computed: {
		...mapState([
		  // 全部需要展示的层次结构数据类型
	      'selectedDSLArray',
	      'userInfoName'
	    ])
	},
	methods: {
		addNewTreeDSL: function() {
			console.log('add new tree dsl')
		},
		cancelImportDSLTemplate: function() {
			this.templateNameDialogVisible = false
		},
		confirmImportDSLTemplate: function() {
			this.templateNameDialogVisible = false
			let realTemplateName = this.realTemplateName
			let exampleName = this.exampleName
			this.selectedDSLArray.push(realTemplateName)
			let dslObject = sysDatasetObj.getOriginalTreeTemplate(exampleName)
			// 更改在DSLObject中的DSL名称
			dslObject.Name = realTemplateName
			sysDatasetObj.updateSingleSelectedDSLObject(realTemplateName, dslObject)
			this.promptMessage('success', realTemplateName + ' has been added in DSLlist view')
			//	更新选择的DSL的集合
			this.$cookies.set('selected-dsl-array', this.selectedDSLArray)
		},
		getFile: function() {
			console.log('upload file ok')
		},
		//  获取TreeDSL对象
	    getTreeDSLObj: function(dslItem) {
	      let dslObj = sysDatasetObj.getOriginalTreeTemplate(dslItem)
	      return dslObj
	    },
	    changeGoTreeName: function() {
	    	let selectedDSLArray = this.selectedDSLArray 
	    	let realTemplateName = this.realTemplateName
	    	if (selectedDSLArray.indexOf(realTemplateName) !== -1) {
	    		this.templateNameWarningHint = 'The template name has been used.'
	    	} else {
	    		this.templateNameWarningHint = ''
	    	}
	    },
		removeTemplateFromGallery: function(templateName) {
			let removeTemplateObj = sysDatasetObj.removeOriginalTreeTemplate(templateName)
			this.removeOriginalTreeTemplate(templateName)
			//	当前的用户名不是Login的时候才需要删除Treetemplate对象
			if (removeTemplateObj.username !== 'Login') {
				// removeTreeTemplate(removeTemplateObj)
			}
			this.updateUserTreeTemplateArray()
		},
		updateSystemTreeTemplateArray: function() {
			this.systemTreeTemplateArray = sysDatasetObj.getSystemTreeTemplateArray()
			console.log('systemTreeTemplateArray', this.systemTreeTemplateArray)
		},
		updateUserTreeTemplateArray: function() {
			let localUserTreeTemplateArray = this.userTreeTemplateArray
			// this.userTreeTemplateArray - localUserTreeTemplateArray
			// 此时需要将localUserTreeTemplateArray与sysDatasetObj.getUserTreeTemplateArray()两个数组合并
			let remoteUserTreeTemplateArray = sysDatasetObj.getUserTreeTemplateArray()
			let concatMergeUserTreeTemplateArray = this.concatMerge(remoteUserTreeTemplateArray, localUserTreeTemplateArray)
      		this.userTreeTemplateArray = concatMergeUserTreeTemplateArray
		},
		//	根据templateName删除userTreeTemplateArray数组中的Tree template
		removeOriginalTreeTemplate: function(removeTreeTemplateName) {
			//	删除userTreeTemplateArray中的DSL模板
			let userTreeTemplateArray = this.userTreeTemplateArray
			for (let i = 0;i < userTreeTemplateArray.length;i++) {
	    		if (userTreeTemplateArray[i].treename === removeTreeTemplateName) {
	    			userTreeTemplateArray.splice(i, 1)
	    		}
	    	}
	    	//	删除systemTreeTemplateArray中的DSL模板
	    	let systemTreeTemplateArray = this.systemTreeTemplateArray
	    	for (let i = 0;i < systemTreeTemplateArray.length;i++) {
	    		if (systemTreeTemplateArray[i].treename === removeTreeTemplateName) {
	    			systemTreeTemplateArray.splice(i, 1)
	    		}
	    	}
		},
		initExampleArray: function(exampleNameArray) {
			let exampleObjArray = []
			for (let i = 0; i < exampleNameArray.length; i++) {
				let exampleName = exampleNameArray[i]
				let exampleObj = {
					name: exampleName,
					styleObject: {
						backgroundImage: 'url(examples/' + exampleName + '.png)'
					}
				}
				exampleObjArray.push(exampleObj)
			}
			return exampleObjArray
		},
		selectTreeDSL: function(exampleName) {
			exampleName = +exampleName
			this.updateCurrentTreeDSLIndex(exampleName)
		},
		promptMessage: function(type, message) {
			this.$message({
              type: type,
              message: message
            })
		},
		getTreeDSLName: function(addName, nameArray) {
			//	找到所有节点中存在dslItem的字符串，并且计算最大的数值
	    	let nameMax = -1
	    	for (let i = 0; i < nameArray.length; i++) {
	    		let name = nameArray[i]
	    		if (name.indexOf(addName) !== -1) {
	    			let addNameNum = name.replace(addName, '')
	    			if (addNameNum === '') {
	    				addNameNum = 0
	    			} else {
	    				addNameNum = +addNameNum
	    			}
	    			//	放置得到的不是数字
	    			if (!isNaN(addNameNum)) {
	    				if (nameMax < addNameNum) {
		    				nameMax = +addNameNum
		    			}
	    			}
	    		}
	    	}
	    	let addName_Num = addName
	    	//	如果在当前的数组中存在与该名字相同的DSL对象
	    	if (nameMax > -1) {
	    		addName_Num = addName + ((+nameMax) + 1)
	    	}
	    	return addName_Num
		},
		getTreeTemplateInfo: function(templateJsonObj, treename, username) {
			let self = this
			let dateStr = new Date().toISOString().split('T')[0]
			return {
				treename: treename,
				username: username,
				template: templateJsonObj,
				date: dateStr
			}
		},
		handleTemplateSuccess: function(res, file) {
			console.log('upload success')
		},
		addTreeTemplateCallback: function(resData) {
			this.promptMessage(resData.type, resData.message)
		},
		beforeTemplateUpload: function(file) {
			let self = this
			const isJSON = file.type === 'application/json';
			const isLt2M = file.size / 1024 / 1024 < 2;
			let treeTemplateArray = sysDatasetObj.getTreeTemplateArray();
			let userTreeTemplateArray = this.userTreeTemplateArray
			let templateName = file.name.replace('.json', '')
			let templateIndex = treeTemplateArray.findIndex(d => (d.treename === templateName))
			let localTemplateIndex = userTreeTemplateArray.findIndex(d => (d.Name === templateName))
			let notExisted = ((templateIndex === -1) && (localTemplateIndex === -1))
			if (!isJSON) {
	          this.$message.error('The uploaded file must be JSON format!');
	          return
	        }
	        if (!isLt2M) {
	          this.$message.error('The file size can not exceed 2MB!');
	          return
	        }
	        if (!notExisted) {
	          this.$message.error('The file name is existed!');	   
	          return     	
	        }
	        var reader = new FileReader();
		    reader.readAsText(file, 'utf-8');
		    reader.onload = function(e) {
		    	let username = self.userInfoName
		    	// template的名称是由文件的名称决定的
		    	let templateJsonObj = JSON.parse(this.result)
		    	let templateName = file.name.replace('.json', '')
		    	templateJsonObj.Name = templateName
		    	let treeInfoObj = self.getTreeTemplateInfo(templateJsonObj, templateName, username)
		    	sysDatasetObj.addTreeTemplateArray([treeInfoObj])
		    	self.userTreeTemplateArray.push(treeInfoObj)
		    	if (self.userInfoName !== 'Login') {
		    		// 如果用户名不是'Login
		    		// addTreeTemplate(treeInfoObj, self.addTreeTemplateCallback)
		    	}
		    }
			return (isJSON && isLt2M && notExisted);
		},
		// 将两个数组中的对象拼接并且合并相同对象
		concatMerge: function(array1, array2) {
			let concatArray = array1.concat(array2); //两个数组对象合并
			let concatMergeArray = []; //盛放去重后数据的新数组
			for (let item1 of concatArray) {  //循环json数组对象的内容
				let flag = true;  //建立标记，判断数据是否重复，true为不重复
				for (let item2 of concatMergeArray) {  //循环新数组的内容
					if (item1.treename === item2.treename){ //让json数组对象的内容与新数组的内容作比较，相同的话，改变标记为false
						flag = false;
					}
				}
				if (flag) { //判断是否重复
					concatMergeArray.push(item1); //不重复的放入新数组。  新数组的内容会继续进行上边的循环。
				}
			}
			return concatMergeArray
		}
 	}
  }
</script>

<style scoped lang="less">
  #dsl-dialog {
  	  .inner-title {
  	  	font-size: 1.2rem;
  	  	border-bottom: solid 1px #666;
  	  	margin-bottom: 10px;
  	  	margin-top: 10px;  	  	
  	  }
  	  .inner-title.first-title {
  	  	margin-top: 0px; 
  	  }
  	  .el-table td, .el-table th {
	  	padding: 1px 0 !important;
	  }
	  .content-container {
	  	margin-top: 10px;
	  	margin-bottom: 10px;
	  	text-align: left;
	  	.tree-collection {
	  		width: 100%;
	  		display: flex;
	  		flex-direction: row;
	  		flex-wrap: wrap;
	  		.upload {
	  			width: 100px;
	  			margin: 5px;
	  			cursor: pointer;
	  			.preview {
		  			width: 100px;
		  			height: 100px;
					background-size: contain;
					background-position: center;
					background-repeat: no-repeat;	  		
				}
	  		}
	  		.example {
	  			width: 100px;
	  			margin: 5px;
	  			cursor: pointer;
		  		.preview {
		  			width: 100px;
		  			height: 100px;
					background-size: contain;
					background-position: center;
					background-repeat: no-repeat;	  		
				}
				.name {
					padding-top: 5px;
					// margin-top: 3px;
					border-top: solid 1px #666;
					font-size: 12px;
					text-align: center;
				}
				&:hover {
          			box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
				}	  			
			}
			.example[class~='selected'] {
          		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1), 0 6px 20px 0 rgba(0, 0, 0, 0.1);
			}
	  	}
	  }
	  .dialog-footer {
	  	text-align: right;
	  	.el-button {
	  	  padding: 6px 10px;
	  	  border-radius: 0px;
	  	}
	  }
	  .el-button--mini, .el-button--mini.is-round {
	  	padding: 3px 5px;
	  }
	  .avatar-uploader {
	    border: 1px dashed #d9d9d9;
	    border-radius: 6px;
	    cursor: pointer;
	    position: relative;
	    overflow: hidden;
	    &:hover {
	    	border-color: #409EFF;
	    }
	  }
	  .avatar-uploader-icon {
	    font-size: 28px;
	    color: #8c939d;
	    width: 100px;
	    height: 100px;
	    line-height: 100px;
	    text-align: center;
	  }
	  .avatar {
	    width: 100px;
	    height: 100px;
	    display: block;
	  }
  }
  .template-name-warning-hint {
	color: red;
   }
</style>
