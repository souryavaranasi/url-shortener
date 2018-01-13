var mongoose=require('mongoose');
var urlSchema = new mongoose.Schema({
  long_url: String,
  short_url:String,
  created_at: {type: Date, default:Date.now}
});
module.exports=mongoose.model("Url",urlSchema);