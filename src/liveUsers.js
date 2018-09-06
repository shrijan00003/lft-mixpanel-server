import client from './redis';
import { promisify } from 'util';

const socketIo = require('socket.io');
const getAsync = promisify(client.get).bind(client);
// let rooms = [];
let liveUsers = {};
let connections = [];
// let liveSiteUsers = [];
let availabeSites = [];

const showLiveUsers = server => {
  const io = socketIo(server);

  // ON CONNECTION OF NEW SOCKET/USER
  io.sockets.on('connection', socket => {
    connections.push(socket);
    console.log('Conected: %s socktes connected', connections.length);

    socket.on('room', async room => {
      // JOINING ROOMS AS SENT BY USER
      try {
        await getAsync('availableSites').then(res => {
          if (res) {
            availabeSites = [...JSON.parse(res)];
            if (checkIfArrayDataExists(availabeSites, room)) {
              availabeSites.push(room);
            }
          } else {
            availabeSites.push(room);
          }
          client.set('availableSites', JSON.stringify(availabeSites));
        });
      } catch (err) {
        console.log(err);
      }

      socket.join(room);
      emitLiveUsers(io);
    });

    socket.on('disconnect', async () => {
      connections.splice(connections.indexOf(socket), 1);
      console.log('Disconnected: %s sockets connected', connections.length);

      // DELETE FRO REDIS IS SOCKET DISCONNECTED
      const appClients = JSON.parse(await getAsync('availableSites'));
      const disconnectedSocket = socket.id;
      if (appClients) {
        appClients.map(async appClient => {
          await getAsync(appClient).then(users => {
            if (users) {
              liveUsers = JSON.parse(users);
              if (liveUsers[disconnectedSocket]) {
                delete liveUsers[disconnectedSocket];
                client.SET(appClient, JSON.stringify(liveUsers));
                io.to(appClient).emit('liveUsers', Object.keys(liveUsers).length);
              }
            }
          });
        });
      }

      io.sockets.emit('testSocketMsg', { msg: liveUsers });
    });

    socket.on('newUser', async data => {
      let socketId = socket.id;
      const { userId, userName, userEmail, clientEmail } = data;

      const appClient = clientEmail.split('@')[0];

      if (appClient) {
        // STORING AVAILABLE APPS IN REDIS
        try {
          await getAsync('availableSites').then(res => {
            if (res) {
              availabeSites = [...JSON.parse(res)];
              if (checkIfArrayDataExists(availabeSites, appClient)) {
                availabeSites.push(appClient);
              }
            } else {
              availabeSites.push(appClient);
            }
            client.set('availableSites', JSON.stringify(availabeSites));
          });
        } catch (err) {
          console.log(err);
        }

        // STORING LIVE USERS IN REDIS
        try {
          await getAsync(appClient).then(res => {
            if (res) {
              liveUsers = Object.assign(JSON.parse(res));
            }

            liveUsers[socketId] = {
              userId,
              userName,
              userEmail,
            };
            client.SET(appClient, JSON.stringify(liveUsers));
          });
        } catch (err) {
          console.log(err);
        }
      }

      // SENDING DATA TO THE CONNECTED ROOMS
      io.sockets.emit('testSocketMsg', { msg: liveUsers });
      io.to(appClient).emit('liveUsers', Object.keys(liveUsers).length);
    });
  });
};

// FUNCTION TO CHECK ROOM IF ALREADY EXISTS
const checkIfArrayDataExists = (parentArr, newChild) => {
  let arrDataExists = true;

  parentArr.map(child => {
    if (child === newChild) {
      arrDataExists = false;
    }
  });

  return arrDataExists;
};

// EMITING LIVE USERS
const emitLiveUsers = async io => {
  try {
    await getAsync('availableSites').then(appClients => {
      if (appClients) {
        JSON.parse(appClients).map(async appClient => {
          await getAsync(appClient).then(users => {
            if (users) {
              liveUsers = JSON.parse(users);
              io.to(appClient).emit('liveUsers', Object.keys(liveUsers).length);
            }
          });
        });
      }
    });
  } catch (err) {
    console.log(err);
  }
};
export default showLiveUsers;