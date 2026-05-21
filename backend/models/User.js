// const mongoose = require('mongoose')

// const UserSchema = new mongoose.Schema({
//     name:{type:String, required:true,unique:true},
//     email:{type:String, required:true},
//     password:{type:String, required:true},
//     profileImageUrl:{type:String, default:null},
//     role: {type:String, enum: ["admin", "member"], default:"member"},
//     },
//     {timestamps:true}
// );

// module.exports = mongoose.model("User", UserSchema);


const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    company_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    password: { type: String },
    profileImageUrl: { type: String, default: null },

    department: { type: String, required: true },
    phone: { type: String },
    salary: { type: Number },

    role: { type: mongoose.Schema.Types.ObjectId, ref: "Roles" },

    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    


    is_delete: { type: Boolean, default: false },
    isInvited: { type: Boolean, default: false }

}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);