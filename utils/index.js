
function getAuthToken(len){
	let tokenStr = '0123456789abcdefghijklmnopqrstuvwxy'
	let token = ''
	for(let i=0 ; i<len ; i++ ){
		token += tokenStr[Math.floor(Math.random()*tokenStr.length)]
	}
	return token
}

module.exports = {
	getAuthToken: getAuthToken
}