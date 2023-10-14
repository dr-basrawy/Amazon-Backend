const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var adminSchema = mongoose.Schema(
  {
    adminName: {
      type: String,
      required: true,
      unique: true,
      minlength: [8,"Username should have a minimum of 8 characters"]
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Please enter a valid email",
      },
      required: [true, "Email required"],
    },
    role:{
        type :String ,
        default:"admin"
      },
      refreshToken: {
        type: String,
        default: "",
      },

  },
  { timestamps: true },

  
);

// adminSchema.pre('save', async function (next){
//     var salt = await bcrypt.genSalt(10)
//     var hashedPass = await bcrypt.hash(this.password, salt)
//   this.password= hashedPass
//   next()
// })

const AdminModel = mongoose.model("admin", adminSchema);

module.exports = AdminModel;
