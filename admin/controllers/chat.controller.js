const Joi = require("@hapi/joi");
var socketio;
const conversationService = require("../../services/conversation.service");

const sockets = {};
module.exports={startSocketServer};


function startSocketServer(app){
   socketio = require('socket.io')(app);
socketio.on('connection', (socket) => {
console.log('connected');
  socket.on('init', (user) => {
    console.log('init',user);

    sockets[user.Id] = socket;
    // sockets[user.Id].emit('message', 'Hi, Welcome to the Chat');
   console.log(Object.keys(sockets))
      });

  socket.on('onSendMessage', (data) => {
 
    console.log(data);
    const schema = Joi.object().keys({
      userId: Joi.string()
        .min(24)
        .max(24)
        .required(),
      friendId: Joi.string()
        .min(24)
        .max(24)
        .required(),
      messageType: Joi.string().valid(['text','image','video']).required(),
      message: Joi.string().required()
    }); 

    //Validating the schema
    const { error, value } = schema.validate(data);
    //If the request is not in the expected format
    if (error) {    
      return;
    }
    else{
    // if (sockets[data.friendId]) {    
    //   sockets[data.friendId].emit('message', data);
    // }
    conversationService.add2(data).then(res=>{
      console.log(data.friendId);
      if( sockets[data.friendId])
      {
        sockets[data.friendId].emit('onMessageRecieved', res.message);
       console.log('Message recieved');
    }
    if(sockets[data.userId])
    {  sockets[data.userId].emit('onMessageSent', res.message);
      console.log('Message sent');}
    });
    /* handler for creating message */
  }});
  socket.on('disconnect', (user) => {
    console.log('user disconnected');
    delete sockets[user.senderId];
  });
});

}
function chatController(){

}
