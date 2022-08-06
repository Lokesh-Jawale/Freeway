const mongoose  = require("mongoose")

const ConversationSchema = mongoose.Schema({
    members: {
        type: Array,
    },
    roomId: {
        type: String,
    },
});

module.exports = mongoose.model("Conversation", ConversationSchema)
