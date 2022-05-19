const active = []; //keep the active user here

// add a new user into active stack
function addUser (userId, socketId){
  if (active.length != 0) { //if no user active then 
    //1st it will check that is already user id is available or not 
    let isAvailable = false
    active.forEach (users => {
      users.userId == userId && (isAvailable = true);
    })
    // console.log({isAvailable})
    if (isAvailable) { //if user is connected then it will happen
      //first find that user index 
      const editUserIdIndexNumber = active.findIndex (user => user.userId == userId) //it will show the index number of available active user's 
      //update the user 
      active.splice (editUserIdIndexNumber, 1, {
        userId,
        socketId
      })
    }else { //add that user into the active list
      active.push ({
        userId,
        socketId
      })
    }
  }else {
    active.push ({
      userId,
      socketId
    })
  }
}

//remove a user from stack
function removeUser (socketId) {
  if (active.length) {
    //1st it will check that is already user id is available or not 
    let isAvailable = false
    active.forEach (users => {
      users.socketId == socketId && (isAvailable = true);
    })
    if (isAvailable) { //if user is connected then it will happen
      //first find that user index 
      const editUserIdIndexNumber = active.findIndex (user => user.socketId == socketId) //it will show the index number of available active user's 
      //update the user 
      active.splice (editUserIdIndexNumber, 1)
    }
  }
  return false
}

//find sender socket id
function findUserSocketId (userId) {
  return active.find (user => user.userId == userId)
} 

module.exports =  {
    addUser,
    findUserSocketId,
    removeUser
}