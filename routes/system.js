let express = require('express')
let router = express.Router()

let User = require('../models/user')
let utils = require('../utils')

router.post('/logup', function(req, res, next){
	let userInfo = req.body
	User.findByUserName(userInfo['username'], (err, userList)=>{
		if(err){
			res.send({
				success: false,
				error: err
			})
		} else {
			if(userList.length > 0){
				// 该用户已经存在
				res.send({
					success: false,
					code: 3
				})
			} else {
				let user = new User(userInfo)
				user.save(function(err, user){
					if(err){
						res.send({
							error: err
						})
					} else {
						let { _id, username, admin} = user
						let authToken = utils.getAuthToken(10)
						//注册成功将用户信息写入 session
						req.session.userInfo = {
							_id, username, admin
						}
						res.send({
							success: true,
							userInfo: {
								username: userInfo['username'],
								authToken: authToken
							}
						})
					}
				})
			}
		}
	})
})

module.exports = router
