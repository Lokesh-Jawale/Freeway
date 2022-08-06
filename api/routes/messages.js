const router = require("express").Router();
const Message = require("../models/Message");
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const { verify } = require("../authValidation/authVerify");

//add message
router.post("/add", verify, async (req, res) => {
	try {
		const data = JSON.parse(req.body.messageData)
		const newMessage = new Message(data);
		const userId = data.senderId
		const roomId = data.conversationId

		const conversation = await Conversation.findOne({
			roomId: roomId
		})

		if(!conversation){
			const newConversation = new Conversation({
				roomId: roomId,
				members: [userId]
			});

			await newConversation.save();
		}
		else if (!conversation.members.includes(userId)){
			 await Conversation.findOneAndUpdate({roomId: roomId}, {$push : {members: userId}})
		}

		const user = await User.findById(userId)
		if(!user.requestedItems.includes(roomId)) {
			await User.findByIdAndUpdate(userId, {
				$push: {requestedItems : roomId}
			})
		}

		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);
	} catch (err) {
		res.status(500).json(err);
	}
});

//get all messages of conversation with Id
router.get("/:conversationId", verify, async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId,
    });
	
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
