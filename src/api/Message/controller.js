const User = require('../../model/user')
const Chat = require('../../model/chat')
const Message = require('../../model/message')

//create a new message 
const createNewMessageHandler = async (req, res) => {
    try {
        const {
            chatId
        } = req.params 
        const {
            content
        } = req.body
        const createNewMessageInstance = new Message ({
            content,
            sendBy: req.user._id,
            chatId
        })
        const saveNewMessage = await createNewMessageInstance.save()
        if (saveNewMessage) {
            //store latest message 
            const updateChatDetails = await Chat.updateOne (
                {
                    _id: chatId
                },
                {
                    $set: {
                        "latestMessage": content
                    }
                },
                {
                    multi: true
                }
            )
            if (updateChatDetails.modifiedCount != 0) {
                res.json ({
                    message: "New message sent",
                    status: 201
                })
            }else {
                res.json ({
                    message: "New message sent but latest message has not set",
                    status: 201
                })
            }
        }else {
            res.json ({
                message: "Message sent failed",
                status: 406
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err.message,
            status: 406
        })
    }
}

module.exports = {
    createNewMessageHandler
}