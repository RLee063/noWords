// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var signedRecord = []
  try {
    var signedDate = (await db.collection('User').where({
      Uid: wxContext.OPENID
    }).get()).data[0].SignedRecord
    for (var a of signedDate) {
      var i = a.date
      var record = {}
      record.year = i.getFullYear()
      record.month = i.getMonth()
      record.day = i.getDate()
      signedRecord.push(record)
    }
  }
  catch (e) {
    console.error(e)
  }
  return {
    signedRecord: signedRecord
  }
}