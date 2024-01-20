const mongoose = require("mongoose");

const NotificationSchema = mongoose.Schema({
  message:{type :String , required:true},
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'Admin',
  },
},
{
  timestamps:true
});

module.exports = mongoose.model("Notification", NotificationSchema);