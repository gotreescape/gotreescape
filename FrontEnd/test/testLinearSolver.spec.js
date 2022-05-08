/* eslint-disable no-console */
/* eslint-disable no-undef */
// let m = require('lscg-solver')
/* jslint esversion: 8 */
/* jslint asi: true*/
let mlog = require('mocha-logger')
let axios = require('axios')
let fs = require('fs')

describe('mocha', () => {
	// before(() => m.initialize())
	it('try mocha', () => {
		mlog.log('mocha is OK!')
	})
	it.only('open dir', async function () {
		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		let treeDSLContentObj = JSON.parse(fs.readFileSync('F:/project/TreeDSL/TreeDSLFrontEnd/public/treeDSL/icicle.json'))
		let treeIndexWithDSL = {
			default: 'ICICLE'
		}
		// console.log(treeDSLContentObj)
		mlog.log(treeDSLContentObj)
		let path = 'F:/project/test/test0314/'
		await fs.readdir(path, async (err, files) => {
			// console.log(files)
			for (id in files) {
				let file = files[id]
				// console.log(file, 'begin')
				let hierarchicalData = JSON.parse(fs.readFileSync(path + file))
				let formData = {
					hierarchicalData: hierarchicalData,
					treeDSLContentObj: {
						ICICLE: treeDSLContentObj
					},
					treeIndexWithDSL: treeIndexWithDSL
				}
				let t0 = new Date().getTime()
				// console.log('axios begin', file)
				// mlog.log(file)
				await axios({
					method: 'post',
					url: 'http://0.0.0.0:14452/api/linear',
					data: formData,
					// data: qs.stringify(payload, {allowDots: true}),
					timeout: 10000
				})
				.then((res) => {
					// mlog.log('  server time(ms)=', res.data.time)
					let t1 = new Date().getTime()
					let allTime = t1 - t0
					// mlog.log('  all time(ms)=', allTime)
					// console.log(file, 'end')
					console.log(file, res.data.time, allTime)
				})
				.catch((err) => {
					// mlog.log('  axios failed')
					console.log(file, 'failed')
				});
				// console.log('data', data)
			}
			// files.forEach(async function (file) {
				
			// })
		})
	})
	it('big-data', () => {
		// let hierarchicalData = JSON.parse(fs.readFileSync('F:/project/TreeDSL/TreeDSLFrontEnd/public/test/n1000_0.json'))
		let hierarchicalData = JSON.parse(fs.readFileSync('F:/project/TreeDSL/TreeDSLFrontEnd/public/hierarchicalData/test2.json'))
		let treeDSLContentObj = JSON.parse(fs.readFileSync('F:/project/TreeDSL/TreeDSLFrontEnd/public/hierarchicalData/icicle.json'))
		let treeIndexWithDSL = {
			default: 'ICICLE'
		}
		let formData = {
			hierarchicalData: hierarchicalData,
			treeDSLContentObj: {
				ICICLE: treeDSLContentObj
			},
			treeIndexWithDSL: treeIndexWithDSL
		}
		let t0 = new Date().getTime()
		axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
		axios({
			method: 'post',
			url: 'http://0.0.0.0:14452/api/linear',
			data: formData,
			// data: qs.stringify(payload, {allowDots: true}),
			timeout: 10000
		})
		.then((res) => {
			console.log('receive the layouts from server', res.data.length)
			let t1 = new Date().getTime()
			console.log('time(ms)=', t1 - t0)
		})
		.catch((err) => {
			console.log('axios failed', err)
		});
	})
	it('front-end communication', () => {
		let treeDsl = JSON.parse(fs.readFileSync('F:\\project\\TreeDSL\\TreeDSLFrontEnd\\public\\treeLayout\\example.json'))
		let treeData = JSON.parse(fs.readFileSync('F:\\project\\TreeDSL\\TreeDSLFrontEnd\\public\\treeLayout\\treeData0306.json'))
		let formData = {
			tree: treeData,
			treedsl: treeDsl
		}
		console.log('formData', formData)
		axios.post('http://0.0.0.0:14452/linear', {
			data: formData
		}).then((res) => {
			console.log(res.data)
			res.data.forEach((d, i) => {
				console.log(i, '   ', d)
			})
			// for (let id in res.data) {
			// 	console.log(res.data[id])
			// }
			let s = JSON.stringify(res.data, null, 3)
			console.log(s)
			fs.writeFileSync('F:\\project\\TreeDSL\\TreeDSLFrontEnd\\public\\treeLayout\\result.json', s)
		}).catch((err) => {
			console.log(err)
		})
	})
})
