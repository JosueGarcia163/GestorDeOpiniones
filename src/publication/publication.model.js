import { Schema, model } from "mongoose";

const publicationSchema = Schema({
    title: {
        type: String,
        required: [true, "Name is required"],
        maxLength: [25, "Name cannot exceed 25 characters"]
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    text: {
        type: String,
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


export default model("Publication", publicationSchema)