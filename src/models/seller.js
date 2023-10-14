const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
var sellerSchema= mongoose.Schema(
    {
        firstName:{
            type:String,
            minlength:[2,'min length is 2']
            },
        lastName:{
            type:String,
            minlength:[2,'min length is 2']
        },
        userName:{
            type:String,
            require:true,
            unique:true,
            minlength:[5,'min length is 5'],
            
        },
        email:{
            type:String,
            required:true,
            unique:true,
            minlength:[8,'min length is 8']

        },
        password:{
            type:String,
            require:true,
            minlength:[4,'min length is 4']

        },
        status:{
            type : String , 
            default:"Active",
            enum: ["blocked", "warning","Active"],
        },
        category:{
            type:String,
            default:"Fashion",
            enum: ["Books", "Fashion","Video Games"],
        },
       
        usersReport:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true,
            default:null
        }],
        role:{
            type:String,
            default:"seller"
        }
       
    }
)


sellerSchema.pre("save",async function(next){
    var salt =await bcrypt.genSalt(10)
    var hashedpass=await bcrypt.hash(this.password,salt)
    this.password=hashedpass
    next()
})

var sellerModel = mongoose.model('seller',sellerSchema)

module.exports=sellerModel