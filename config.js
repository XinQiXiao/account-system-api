
const debug = process.env.NODE_ENV == 'development';

// server default port
const serverPort = '4000'

// 数据库地址
// dev
const mongooseConnectDev = 'mongodb://localhost:27017/accountSystem'

// prd
const mongooseConnectPrd = ''

const mongooseConnect = debug ? mongooseConnectDev : mongooseConnectPrd

module.exports = {
	serverPort,
	mongooseConnect
}