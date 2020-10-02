const Joi = require("@hapi/joi");
var socketio;
const conversationService = require("../services/conversation.service");
const notificationService = require("../services/notification.service");
const messageService = require("../services/message.service");
const WebSocket = require("ws");
const sockets = {};

exports.checkOnline = function (id) {
  //console.log(id);
  if (sockets[id]) {
    return true;
  }
  return false;
};

function startSocketServerWSS(server) {
  const wss = new WebSocket.Server({ server });
  wss.on("connection", (socket) => {
    console.log("connected");

    let userId;
    socket.on("message", (payload) => {
      console.log(payload);

      const message = JSON.parse(payload);
      const data = message.data;
      try {
        switch (message.type) {
          case "USER_INIT":
            userId = data.Id;
            sockets[data.Id] = socket;
            console.log(Object.keys(sockets));
            break;
          case "ON_SEND_MESSAGE":
            const schema = Joi.object().keys({
              conversationId: Joi.string().min(24).max(24).required(),
              senderId: Joi.string().min(24).max(24).required(),
              recieverId: Joi.string().min(24).max(24).required(),
              messageType: Joi.string()
                .valid(["text", "image", "video"])
                .required(),
              message: Joi.string().required(),
            });

            //Validating the schema
            const { error, value } = schema.validate(data);
            //If the request is not in the expected format
            if (error) {
              return;
            } else {
              messageService.create(data).then((res) => {
                console.log(data.recieverId);
                console.log(res);
                if (res.success) {
                  if (sockets[data.recieverId]) {
                    const payload = {
                      type: "ON_MESSAGE_RECIEVED",
                      data: res.result,
                    };

                    sockets[data.recieverId].send(JSON.stringify(payload));
                  } else {
                    notificationService.onMessageMissed(res.result);
                  }
                  if (sockets[data.senderId]) {
                    const payload = {
                      type: "ON_MESSAGE_SENT",
                      data: res.result,
                    };
                    sockets[data.senderId].send(JSON.stringify(payload));

                    console.log("Message sent");
                  }
                }
              });
            }
        }
      } catch (err) {
        console.log(err);
      }
    });

    socket.on("disconnect", () => {
      delete sockets[userId];
      console.log(Object.keys(sockets));
    });

    socket.on("close", () => {
      delete sockets[userId];
      console.log(Object.keys(sockets));
    });
  });
}

function startSocketServer(app) {
  console.log("socket server started");
  socketio = require("socket.io")(app);
  socketio.on("connection", (socket) => {
    let userId;

    console.log("connected" + socket.id);
    socket.on("init", (user) => {
      console.log("init", user);
      userId = user.Id;

      sockets[user.Id] = socket;

      // sockets[user.Id].emit('message', 'Hi, Welcome to the Chat');
      console.log(Object.keys(sockets));
    });

    socket.on("onSendMessage", (data) => {
      console.log(data);
      const schema = Joi.object().keys({
        conversationId: Joi.string().min(24).max(24).required(),
        senderId: Joi.string().min(24).max(24).required(),
        recieverId: Joi.string().min(24).max(24).required(),
        messageType: Joi.string().valid(["text", "image", "video"]).required(),
        message: Joi.string().required(),
      });

      //Validating the schema
      const { error, value } = schema.validate(data);
      //If the request is not in the expected format
      if (error) {
        return;
      } else {
        // if (sockets[data.friendId]) {
        //   sockets[data.friendId].emit('message', data);
        // }
        messageService.create(data).then((res) => {
          console.log(data.recieverId);
          console.log(res);
          if (res.success) {
            if (sockets[data.recieverId]) {
              sockets[data.recieverId].emit("onMessageRecieved", res.result);
            } else {
              notificationService.onMessageMissed(res.result);
            }
            if (sockets[data.senderId]) {
              sockets[data.senderId].emit("onMessageSent", res.result);
              console.log("Message sent");
            }
          }
        });
        /* handler for creating message */
      }
    });

    socket.on("disconnect", () => {
      delete sockets[userId];
      console.log(Object.keys(sockets));
    });
  });
}

module.exports = { startSocketServer, startSocketServerWSS };
