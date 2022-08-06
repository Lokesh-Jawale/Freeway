const mongoose  = require("mongoose")

const MessagesSchema = mongoose.Schema({
    conversationId: {
        type: String,
    },
    senderId: {
        type: String,
    },
    senderEmail: {
        type: String,
    },
    message: {
        type: String,
    },
},
{timestamps: true}
);

module.exports = mongoose.model("Message", MessagesSchema)
