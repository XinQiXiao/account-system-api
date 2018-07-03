let express = require('express')
let router = express.Router()
let Product = require('../models/products')
let constants = require('../constants')

router.route('/')
	.get((req, res, next)=>{
		let {page, productName} = req.query
		let limit = constants.PAGE_SIZE
		let skip = (page - 1) * limit
		let currentUser = req.session.userInfo
		let queryCondition = {
			userId: currentUser['_id']
		}
		if(productName){
			queryCondition['productName'] = new RegExp(productName)
		}
		Product.count(queryCondition, (err, count)=>{
			Product.find(queryCondition)
				.limit(limit)
				.skip(skip)
				.exec((err, products)=>{
					if(err){
						res.send({
							success: false,
							error: err
						})
					} else {
						res.send({
							success: true,
							products: products,
							page: {
								total: count,
								current: page
							}
						})
					}
				})
		})
	})

module.exports = router