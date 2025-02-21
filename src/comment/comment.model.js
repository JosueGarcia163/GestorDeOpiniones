import { Schema, model } from "mongoose";

const commentSchema = Schema({
    content: {
        type: String,
        maxLength: [75, "Name cannot exceed 75 characters"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    publication: {
        type: Schema.Types.ObjectId,
        ref: "Publication",
        required: true,
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        versionKey: false,
        timeStamps: true
    })


export default model("Comment", commentSchema)