//	在DSL对象中增加默认的参数设定
export function addDslDefaultSetting(dslObj) {
	if (!('Element' in dslObj)) {
		dslObj.Element = {}
	}
	if (!('CoordinateSystem' in dslObj)) {
		dslObj.CoordinateSystem = {}
	}
	if (!('Layout' in dslObj)) {
		dslObj.Layout = {}
	}
	add_node_default_setting(dslObj.Element)
	add_link_default_setting(dslObj.Element)
	add_label_default_setting(dslObj.Element)
	add_coordinate_system_default_setting(dslObj.CoordinateSystem)
	add_layout_default_setting(dslObj.Layout)
	return dslObj
}
//	在DSL中的element增加默认参数设定
function add_node_default_setting(elementDsl) {
	let DefaultStaticSize = 5
	let DefaultSizeOption = ['fill', 'static']
	let DefaultStaticColor = '#6baed6'
	let DefaultColorRange = ['#2171b5','#deebf7']
	let DefaultColorSchemaOption = ['option1', 'option2']
	if (!('Node' in elementDsl)) { 
		elementDsl.Node = 'hidden'
	}
	if (!('SizeOption' in elementDsl)) { 
		elementDsl.SizeOption = DefaultSizeOption[0]
	}
	if (!('RootWidth' in elementDsl)) { 
		elementDsl.RootWidth = 'adaptive'
	}
	if (!('RootHeight' in elementDsl)) { 
		elementDsl.RootHeight = 'adaptive'
	}
	if (!('StaticSize' in elementDsl)) { 
		elementDsl.StaticSize = DefaultStaticSize
	}
	if (!('Color' in elementDsl)) { 
		elementDsl.Color = 'static'
	}
	if (!('StaticColor' in elementDsl)) {
		elementDsl.StaticColor = DefaultStaticColor
	}
	if (!('ColorRange' in elementDsl)) {
		elementDsl.ColorRange = DefaultColorRange
	}
	if (!('ColorSchema' in elementDsl)) {
		elementDsl.ColorSchema = DefaultColorSchemaOption[0]
	} 
}
//	在DSL的element中增加关于label的默认参数设定
function add_label_default_setting(elementDsl) {
	let DefaultLabelAnchor = 'middle'
	let DefaultTextDx = 0
	let DefaultTextDy = 0
	let DefaultTextRotation = 0
	if (!('Label' in elementDsl)) {
		elementDsl.Label = 'hidden'
	}
	if (!('LabelAnchor' in elementDsl)) {
		elementDsl.LabelAnchor = 'middle'
	}
	if (!('TextDx' in elementDsl)) {
		elementDsl.TextDx = DefaultTextDx
	}
	if (!('LabelDy' in elementDsl)) {
		elementDsl.TextDy = DefaultTextDy
	}
	if (!('TextRotation' in elementDsl)) {
		elementDsl.TextRotation = DefaultTextRotation
	}
	// elementDsl.TextDx = Math.floor(elementDsl.TextDx * 100)
	// elementDsl.TextDy = Math.floor(elementDsl.TextDy * 100)
	// elementDsl.TextRotation = Math.floor(elementDsl.TextRotation * 100)	
}
//	在DSL的element中增加关于link的默认参数设定
function add_link_default_setting(elementDsl) {
	let DefaultStaticThickness = 2
	let DefaultMinThickness = 1
	let DefaultMaxThickness = 10
	let ArcDirectionOptions = ['top', 'bottom']
	if (!('Link' in elementDsl)) {
		elementDsl.Link = 'hidden'
	}
	if (!('Thickness' in elementDsl)) {
        elementDsl.Thickness = 'static'
    }
    if (!('StaticThickness' in elementDsl)) {
        elementDsl.StaticThickness = DefaultStaticThickness
    } 
    if (!('MinThickness' in elementDsl)) {
        elementDsl.MinThickness = DefaultMinThickness
    } 
    if (!('MaxThickness' in elementDsl)) {
        elementDsl.MaxThickness = DefaultMaxThickness
    } 
    if (!('ArcDirection' in elementDsl)) {
        elementDsl.ArcDirection = ArcDirectionOptions[0]
    }
}
//	在DSL的CoordinateSystem中增加关于link的默认参数设定
function add_coordinate_system_default_setting(CoordDsl) {
	let DirectionOptions = ['clockwise', 'anticlockwise']
	let PolarAxisOptions = ['y-axis', 'x-axis']
	let DefaultPolarCenterPara = 'top'
	let DefaultCategoryPara = "cartesian"
	let DefaultCentralAngle = 1
	let DefaultStartAngle = 0
	let DefaultInnerRadius = 0
	if (!('Category' in CoordDsl)) {
		CoordDsl.Category = DefaultCategoryPara
	}
	if (!('Direction' in CoordDsl)) {
        CoordDsl.Direction = DirectionOptions[0]
    }
    if (!('CentralAngle' in CoordDsl)) {
        CoordDsl.CentralAngle = DefaultCentralAngle
    }
    if (!('StartAngle' in CoordDsl)) {
    	CoordDsl.StartAngle = DefaultStartAngle
    }
    if (!('InnerRadius' in CoordDsl)) {
    	CoordDsl.InnerRadius = DefaultInnerRadius
    }
    if (!('PolarAxis' in CoordDsl)) {
        CoordDsl.PolarAxis = PolarAxisOptions[0]
    }
    if (!('PolarCenter' in CoordDsl)) {
        CoordDsl.PolarCenter = DefaultPolarCenterPara
    }
    // CoordDsl.CentralAngle = Math.floor(CoordDsl.CentralAngle * 100)
    // CoordDsl.StartAngle = Math.floor(CoordDsl.StartAngle * 100)
    // CoordDsl.InnerRadius = Math.floor(CoordDsl.InnerRadius * 100)
}
//	在DSL的布局中增加默认的参数设定
function add_layout_default_setting(LayoutDsl) {
	//	如果用户没有设定layout的参数，那么就将其设定为“Undefined”
	//	具体计算时将父子之间的关系设定为include，将兄弟之间的关系设定为align
	let defaultCategory = 'AxisIndependent'
	let defaultMode = 'bottom-up'
	if (!('Category' in LayoutDsl)) {
		LayoutDsl.Category = defaultCategory
	}
	if (!('Mode' in LayoutDsl)) {
		LayoutDsl.Mode = defaultMode
	}
	if (!('X' in LayoutDsl)) {
		LayoutDsl.X = {}
	}
	if (!('Y' in LayoutDsl)) {
		LayoutDsl.Y = {}
	}
	add_root_layout_default_setting(LayoutDsl)
	add_subtree_layout_default_setting(LayoutDsl)
}
//	增加父子的默认参数设定
function add_root_layout_default_setting(LayoutDsl) {
	// 	增加沿'X'轴方向的参数
	if (!('Root' in LayoutDsl['X'])) {
		LayoutDsl['X']['Root'] = {}
	}
	add_axis_layout_default_setting(LayoutDsl['X']['Root'], 'X')
	//	增加padding和margin的参数
	add_margin_unit(LayoutDsl['X']['Root'])
	add_padding_unit(LayoutDsl['X']['Root'])
	// 	增加沿'Y'轴方向的参数
	if (!('Root' in LayoutDsl['Y'])) {
		LayoutDsl['Y']['Root'] = {}
	}	
	add_axis_layout_default_setting(LayoutDsl['Y']['Root'], 'Y')
	//	增加padding和margin的参数
	add_margin_unit(LayoutDsl['Y']['Root'])
	add_padding_unit(LayoutDsl['Y']['Root'])
	function add_axis_layout_default_setting(AxisRootLayoutDsl, axisType) {
		let defaultRelation = 'Undefined'
		let defaultMargin = 0
		let defaultMarginUnit = ""
		let defaultPadding = [0, 0]
		let defaultPaddingUnit = ["", ""]
		let defaultPosition = 'left'
		if (axisType === 'Y') {
			defaultPosition = 'top'
		}
		let defaultAlignment = 'middle'
		if (!('Relation' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Relation'] = defaultRelation
		}
		if (!('Alignment' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Alignment'] = defaultAlignment
		}
		if (!('Position' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Position'] = defaultPosition
		}
		if (!('Margin' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Margin'] = defaultMargin
		}
		if (!('Padding' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Padding'] = defaultPadding
		}
		if (!('Margin_' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Margin_'] = defaultMarginUnit
		}
		if (!('Padding_' in AxisRootLayoutDsl)) {
			AxisRootLayoutDsl['Padding_'] = defaultPaddingUnit
		}
	}
}
//	增加子树之间的默认参数设定
function add_subtree_layout_default_setting(LayoutDsl) {
	//	增加沿X轴方向的参数
	if (!('Subtree' in LayoutDsl['X'])) {
		LayoutDsl['X']['Subtree'] = {}
	}
	add_axis_layout_default_setting(LayoutDsl['X']['Subtree'])
	//	增加margin的参数
	add_margin_unit(LayoutDsl['X']['Subtree'])
	//	增加沿Y轴方向的参数
	if (!('Subtree' in LayoutDsl['Y'])) {
		LayoutDsl['Y']['Subtree'] = {}
	}
	add_axis_layout_default_setting(LayoutDsl['Y']['Subtree'])
	//	增加margin的参数
	add_margin_unit(LayoutDsl['Y']['Subtree'])
	function add_axis_layout_default_setting(AxisSubtreeLayoutDsl) {
		let defaultRelation = 'Undefined'
		let defaultAlignment = 'middle'
		let defaultMargin = 0
		let defaultMarginUnit = ""		
		let DefaultSortingCriteria = 'null'
		let defaultSortingOrder = 'asc'
		if (!('Relation' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['Relation'] = defaultRelation
		}
		if (!('Alignment' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['Alignment'] = defaultAlignment
		}
		if (!('Margin' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['Margin'] = defaultMargin
		}
		if (!('Margin_' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['Margin_'] = defaultMarginUnit
		}
		if (!('SortingCriteria' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['SortingCriteria'] = DefaultSortingCriteria
		}
		if (!('SortingOrder' in AxisSubtreeLayoutDsl)) {
			AxisSubtreeLayoutDsl['SortingOrder'] = defaultSortingOrder
		}
	}
}
//	在DSL中增加padding的单位
function add_padding_unit(AxisLayoutDsl) {
	if ('Padding' in AxisLayoutDsl) {
		if (isNaN(AxisLayoutDsl.Padding[0])) {
			AxisLayoutDsl.Padding_ = [AxisLayoutDsl.Padding[0].slice(-1), '']
			AxisLayoutDsl.Padding[0] = +AxisLayoutDsl.Padding[0].slice(0, -1)
		}
		if (isNaN(AxisLayoutDsl.Padding[1])) {
			AxisLayoutDsl.Padding_[1] = AxisLayoutDsl.Padding[1].slice(-1)
			AxisLayoutDsl.Padding[1] = +AxisLayoutDsl.Padding[1].slice(0, -1)
		}
	}
}
//	在DSL中增加margin的单位
function add_margin_unit(AxisLayoutDsl) {
	if ('Margin' in AxisLayoutDsl) {
		if (isNaN(AxisLayoutDsl.Margin)) {
			AxisLayoutDsl.Margin_ = AxisLayoutDsl.Margin.slice(-1)
			AxisLayoutDsl.Margin = +AxisLayoutDsl.Margin.slice(0, -1)
		}
	}
}
