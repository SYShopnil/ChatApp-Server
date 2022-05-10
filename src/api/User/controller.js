const User = require('../../model/user')
const bcrypt = require("bcrypt")
const {
    uploadImage,
    uploadProfilePicture
} = require('../../../utils/defaultPictureUploader')
const tokenGenerator = require('../../../utils/tokenGenretor')
const makeCookieOptions = require('../../../utils/cookiesOption')


//create a user 
const createUserHandler = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash (req.body.password, 10);
        const {
            profileImage
        }  = req.body
        let imageUrl = "";
        if (profileImage){
            const {
                fileAddStatus,
                fileUrl
            } = await uploadImage (profileImage, "user")
            fileAddStatus ? imageUrl = fileUrl : imageUrl = ""
        }else {
            const {
                fileAddStatus,
                fileUrl
            } = await uploadProfilePicture (req.body.sex, "user")
            fileAddStatus ? imageUrl = fileUrl : imageUrl = ""
        }
        const createInstanceOfUser = new User ({
            ...req.body,
            password:hashedPassword,
            profilePic: imageUrl
        })
        const saveUser = await createInstanceOfUser.save();
        if (saveUser) {
            res.json ({
                message: "User Has been successfully saved",
                status: 201
            })
        }else {
            res.json ({
                message: "User save failed",
                status: 406
            })
        }
    }catch(err){
        res.json({
            message: err.message,
            status: 406
        })
    }
} 


//show all user 
const showALlUserHandlerWithSearch = async (req, res) => {
    try {
        const {
            searchBy
        } =  req.body
        const query = {
            $and: [
                {
                    isDelete: false
                }
            ]
        };
        if (searchBy) {
            const blogSearchRegex = (input) => {
                const str = `${input}`
                const regex = new RegExp (str, 'gi')
                return regex;
            }
            const rgx = blogSearchRegex (searchBy)
            query.$and.push ({
                $or: [
                    {
                        name: rgx
                    },
                    {
                        sex: rgx
                    }
                ]
            })
        }
        const showAllUser = await User.find (query).select (`-password`);
        if (showAllUser.length != 0) {
            res.json ({
                message: `${showAllUser.length} users have found`,
                status: 202,
                users: showAllUser
            })
        }else {
            res.json ({
                message: `User not found`,
                status: 404,
                users: null
            })
        }
        
    }catch(err){
        res.json ({
            message: err.message,
            status: 406,
            users: null
        })
    }
}

//get individual user by id 
const showIndividualUserById = async (req, res) => {
    try {
        const showUserData = await User.findOne (
            {
                isDelete: false,
                _id: req.params.id
            }
        ).select (`-password`)
        if (showUserData){
            res.json ({
                message: `User found`,
                status: 202,
                user: showUserData
            })
        }else {
            res.json ({
                message: `User not found`,
                status: 404,
                user: null
            })
        }
    }catch (err) {
        res.json ({
            message: err.message,
            status: 406,
            user: null
        })
    }
}

//login api 
const loginHandler =  async (req, res) => {
    try {
        const {
            email,
            password:inputPassword
        } = req.body 
        //check user is available or not 
        const findUser = await User.findOne ({
            isDelete: false,
            email
        })
        if (findUser) {
            const {
                password: databasePassword
            } = findUser
            const isPasswordMatch = await bcrypt.compare (inputPassword, databasePassword)
            if (isPasswordMatch) {
                const tokenData = {
                    email: findUser.email,
                    sex: findUser.sex
                }
                const {
                    token
                } = await tokenGenerator (tokenData, "5d")
                const cookieOption = makeCookieOptions (5)
                res.cookie("auth",token, cookieOption).json ({
                    message: 'Login successfully',
                    status: 202,
                    user: findUser
                })
            }else {
                res.json ({
                    message: `Password mismatch`,
                    status: 406,
                    user: null
                })
            }
        }else {
            res.json ({
                message: `User not found`,
                status: 404,
                user: null
            })
        }
    }catch (err) {
        console.log(err)
        res.json ({
            message: err.message,
            status: 406,
            user: null
        })
    }
}

//check user logged in 
const isLoggedInCheckHandler =  async (req, res) => { 
    try {
        loggedInUser = req.user;
        res.json ({
            message: "User is Logged in",
            status: 202,
            user: loggedInUser
        })
    }catch (err) {
        console.log(err)
        res.json ({
            message: err.message,
            status: 406
        })
    }
}



module.exports =  {
    createUserHandler,
    showALlUserHandlerWithSearch,
    showIndividualUserById,
    loginHandler,
    isLoggedInCheckHandler
}