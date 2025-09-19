const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/videoCall-user');

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