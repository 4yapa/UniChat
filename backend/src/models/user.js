import mongoose from "mongoose";

const schema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        fullName: {
            type: String,
            required: true
        },
        password: {
            type: String,
            minlength: 6
        },
        profilePic: {
            type: String,
            default: function() {
                return `https://ui-avatars.com/api/?name=${encodeURIComponent(this.fullName)}&background=random&size=200`;
            }
        }
    },
    {
        timestamps: true
    }
);

const User = mongoose.model("User", schema);
export default User;