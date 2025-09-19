const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb+srv://anautiyal206_db_user:Abhishek2006@cluster0.rwmcdcd.mongodb.net/');

}

const userSchema = new mongoose.Schema({
  name: String,
  email:{
    type:String,
    unique:true
  },
  
  password:String,
  image:String
});

const userModel = mongoose.model('userModel', userSchema);


module.exports = userModel
