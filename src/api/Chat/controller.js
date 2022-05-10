const User = require('../../model/user')
const Chat = require('../../model/chat')
const Message = require('../../model/message')


//get all conversations between two users if not available then create a new one
const getAllConversationsBetweenTwoUsers = async (req, res) => {
    try {
        //check that is there have any conversations exist between two user or not 
        const {
            participant
        } = req.body //for one to one conversation
        const checkExistence = await Chat.findOne (
            {
                $and: [
                    {
                        members: {
                            $in: req.user._id
                        }
                    },
                    {
                        members: {
                            $in: participant
                        }
                    }
                ]
            }
        ).populate ([
            {
                path: "members",
                select: `
                    name
                    profilePic
                `
            },
            {
                path: "admin",
                select: `
                    name
                    profilePic
                `
            }
        ])
        if (checkExistence){  //if previous conversation exist 
            const conversationId = checkExistence._id;
            //get all message by conversation id 
            const getAllMessage = await Message.find (
                {
                    chatId: conversationId
                }
            ).sort ({createdAt: 1}).populate ({
                path: "sendBy",
                select: `
                    name
                    profilePic
                `
            })
            if (Object.values(getAllMessage).length != 0) {
                res.json ({
                    message: "Message found",
                    status: 202,
                    messageDetails: getAllMessage,
                    isConversation: true,
                    conversationDetails: checkExistence
                })
            }else {
                res.json ({
                    message: "No Message found",
                    status: 404,
                    messageDetails: null,
                    isConversation: true,
                    conversationDetails: checkExistence
                })
            }
        }else { //otherwise create a new conversations
            const members = [
                req.user._id,
                participant
            ];
            const admin = req.user._id
            const createNewInstanceOfConversation = new Chat ({ //creat a new conversation
                admin,
                members
            })
            const saveNewConversation = await createNewInstanceOfConversation.save (); 
            if (saveNewConversation) {
                res.json ({
                    message: "A new conversation was created",
                    status: 406,
                    messageDetails: null,
                    isConversation: false,
                    conversationDetails: saveNewConversation
                })
            }else {
                res.json ({
                    message: "Conversation failed to create please try again later",
                    status: 406,
                    messageDetails: null,
                    isConversation: false,
                    conversationDetails: null
                })
            }
        }
    }catch(err) {
        console.log(err)
        res.json ({
            message: err.message,
            status: 406,
            data: null
        })
    }
}

//get only own chat list users
const getOwnChatBoxHandler = async (req, res) => {
    try {
        const {_id:loggedInUseID} = req.user //get the logged in user id 
        const findAllChat = await Chat.find ({
            "members": {
                $in: loggedInUseID
            }
        }).select (`
            latestMessage
            chatName,
            members
        `).populate ({
            path: "members",
            select: `
                name
                profilePic
            `
        })
        if (findAllChat.length != 0) { //if chat found
            res.json ({
                message: "Chat Found",
                status: 202,
                chats: findAllChat
            })
        }else {
            res.json ({
                message: "Chat Not Found",
                status: 404,
                chats: null
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err.message,
            status: 406,
            chats: null
        })
    }
}

module.exports = {
    getAllConversationsBetweenTwoUsers,
    getOwnChatBoxHandler
}