mongoose = require("mongoose");
//Set Reference to the Schema Constructor
Schema = mongoose.Schema;

//Using the Schema constructor, greate a new UserSchema object, which is similar to a sequelize model
var ResortSchema = new Schema({
    //ResortTitle is Required and of Type String
    resortTitle: {
        type: String,
        required: true
    },
    link: {
        type: String,
        required: true
    },
    favorite: {
        type: Boolean,
        default: false
    },
    comment:{
        type: Schema.Types.ObjectId,
        ref: "comment"
    }
});

var Resort = mongoose.model("Resort", ResortSchema);

module.exports = Resort;

