<template>
	<svg class = "global-legend">
	</svg>
</template>

<script>
  export default {
	name: 'Legend',
	components: {
	},
	data() {
	  return {}	
	},
	created: function () {
	},
	beforeMount: function() {
	},
	mounted: function() {
		this.computePosLen()
		this.renderLegend()
	},
	computed: {
	},
	methods: {
		computePosLen: function() {
			this.paddingLeft = $(this.$el).width() * 0.05
			this.paddingRight = $(this.$el).width() * 0.05
			this.paddingTop = $(this.$el).height() * 0.15
			this.paddingBottom = $(this.$el).height() * 0.15
			this.canvasWidth = $(this.$el).width() - this.paddingLeft - this.paddingRight
			this.canvasHeight = $(this.$el).height() - this.paddingTop - this.paddingBottom
		},
		renderLegend: function() {
			let legendCanvas = d3.select(this.$el)
				.append('g')
				.attr('class', 'legend-canvas')
				.attr('transform', 'translate(' + this.paddingLeft + ',' + this.paddingTop + ')')
			let rectWidth = this.canvasWidth * 0.26
			let rectPadding = this.canvasWidth * 0.1
			//	绘制root节点
			legendCanvas.append('rect')
				.attr('class', 'root-node')
				.attr('x', 0)
				.attr('y', 0)
				.attr('width', rectWidth)
				.attr('height', this.canvasHeight)
			//	增加root节点的文本
			legendCanvas.append('text')
				.attr('class', 'node-text')
				.attr('x', rectWidth / 2)
				.attr('y', this.canvasHeight / 2)
				.text('root')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
			//	绘制subtree节点
			legendCanvas.append('rect')
				.attr('class', 'subtree-node')
				.attr('x', rectWidth + rectPadding)
				.attr('y', 0)
				.attr('width', rectWidth)
				.attr('height', this.canvasHeight)
			//	增加subtree group节点的文本
			legendCanvas.append('text')
				.attr('class', 'node-text subtree-group-text')
				.attr('x', rectWidth + rectPadding + rectWidth / 2)
				.attr('y', this.canvasHeight / 4)
				.text('subtree')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
			legendCanvas.append('text')
				.attr('class', 'node-text subtree-group-text')
				.attr('x', rectWidth + rectPadding + rectWidth / 2)
				.attr('y', this.canvasHeight * 3 / 4)
				.text('group')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
			//	绘制subtree group的节点
			legendCanvas.append('rect')
				.attr('class', 'subtree-group')
				.attr('x', (rectWidth + rectPadding) * 2)
				.attr('y', 0)
				.attr('width', rectWidth)
				.attr('height', this.canvasHeight)
			//	增加subtree节点的文本
			legendCanvas.append('text')
				.attr('class', 'node-text')
				.attr('x', (rectWidth + rectPadding) * 2 + rectWidth / 2)
				.attr('y', this.canvasHeight / 2)
				.text('subtree')
				.attr('text-anchor', 'middle')
				.attr('alignment-baseline', 'middle')
		}
 	}
  }
</script>

<style lang="less">
	.global-legend {
		width: 100%;
		height: 100%;
		.root-node {
			fill: #eeeeee;
		}
		.subtree-group {
			fill: #ffffff;
			stroke: #000;
			stroke-dasharray: 2,2;
		}
		.subtree-node {
			fill: #eeeeee;
			stroke: #000;
		}
		.subtree-group-text {
			font-size: 0.8rem;
		}
	}
</style>
