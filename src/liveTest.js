// try {
//   await getAsync(clientEmail).then(async clientId => {
//     await getAsync('availableSites').then(res => {
//       if (res) {
//         availabeSite = [...JSON.parse(res), clientId];
//         // if (checkIfArrayDataExists(availabeSite, clientId)) {
//         // }
//       } else {
//         availabeSite.push(clientId);
//       }
//       client.set('availableSites', JSON.stringify(availabeSite));
//     });

//     await getAsync(clientId).then(async res => {
//       if (res) {
//         liveUsers = Object.assign(JSON.parse(res));
//       }
//       console.log(liveUsers);
//       liveUsers[socketId] = {
//         userId,
//         userName,
//         userEmail,
//       };
//       console.log(await getAsync('availableSites'));
//       client.SET(clientId, JSON.stringify(liveUsers));
//     });
//   });
// } catch (err) {
//   console.log(err);
// }

// import client from './redis';
// import { promisify } from 'util';

// const socketIo = require('socket.io');
// const getAsync = promisify(client.get).bind(client);
// let rooms = [];
// let liveUsers = {};
// let connections = [];
// // let liveSiteUsers = [];
// let availabeSites = [];

// const showLiveUsers = server => {
//   const io = socketIo(server);

//   // ON CONNECTION OF NEW SOCKET/USER
//   io.sockets.on('connection', async socket => {
//     connections.push(socket);
//     console.log('Conected: %s socktes connected', connections.length);

//     socket.on('room', async room => {
//       // JOINING ROOMS AS SENT BY USER
//       await getAsync('rooms').then(res => {
//         if (res) {
//           rooms = [...JSON.parse(res)];
//           if (checkIfArrayDataExists(rooms, room)) {
//             rooms.push(room);
//           }
//         } else {
//           rooms.push(room);
//         }
//         client.set('rooms', JSON.stringify(rooms));
//       });

//       socket.join(room);
//     });

//     socket.on('disconnect', async () => {
//       connections.splice(connections.indexOf(socket), 1);
//       console.log('Disconnected: %s sockets connected', connections.length);

//       // DELETE FRO REDIS IS SOCKET DISCONNECTED
//       const appClients = JSON.parse(await getAsync('availableSites'));
//       const disconnectedSocket = socket.id;
//       if (appClients) {
//         appClients.map(async (appClient, key) => {
//           liveUsers = JSON.parse(await getAsync(appClient));

//           if (liveUsers[disconnectedSocket]) {
//             // console.log('===================', liveUsers[socket.id]);
//             delete liveUsers[disconnectedSocket];
//             client.SET(appClient, JSON.stringify(liveUsers));
//             io.to(appClient).emit('liveUsers', liveUsers);
//           }
//         });
//       }

//       // io.sockets.emit('testSocketMsg', { msg: liveUsers });
//     });

//     socket.on('newUser', async data => {
//       let socketId = socket.id;
//       const { userId, userName, userEmail, clientEmail } = data;

//       const appClient = clientEmail.split('@')[0];

//       if (appClient) {
//         // STORING AVAILABLE APPS IN REDIS
//         try {
//           await getAsync('availableSites').then(res => {
//             if (res) {
//               availabeSites = [...JSON.parse(res)];
//               if (checkIfArrayDataExists(availabeSites, appClient)) {
//                 availabeSites.push(appClient);
//               }
//             } else {
//               availabeSites.push(appClient);
//             }
//             client.set('availableSites', JSON.stringify(availabeSites));
//           });
//         } catch (err) {
//           console.log(err);
//         }

//         // STORING LIVE USERS IN REDIS
//         try {
//           await getAsync(appClient).then(async res => {
//             if (res) {
//               liveUsers = Object.assign(JSON.parse(res));
//             }
//             // console.log(liveUsers);
//             liveUsers[socketId] = {
//               userId,
//               userName,
//               userEmail,
//             };
//             // console.log(await getAsync('availableSites'));
//             client.SET(appClient, JSON.stringify(liveUsers));
//           });
//         } catch (err) {
//           console.log(err);
//         }
//       }
//       // SENDING DATA TO THE CONNECTED ROOMS
//       // io.sockets.emit('testSocketMsg', { msg: liveUsers });
//       io.to(appClient).emit('liveUsers', liveUsers);
//     });

//     // try {
//     //   availabeSites = JSON.parse(await getAsync('availableSites'));
//     //   if (availabeSites) {
//     //     availabeSites.map(async (availableSite, key) => {
//     //       liveUsers = JSON.parse(await getAsync(availableSite));
//     //       io.to(availableSite).emit('liveUsers', liveUsers);
//     //     });
//     //   } else {
//     //     availabeSites = [];
//     //   }
//     // } catch (err) {
//     //   console.log(err);
//     // }
//   });
// };

// // FUNCTION TO CHECK ROOM IF ALREADY EXISTS
// const checkIfArrayDataExists = (parentArr, newChild) => {
//   let arrDataExists = true;

//   parentArr.map((child, key) => {
//     if (child === newChild) {
//       arrDataExists = false;
//     }
//   });
//   return arrDataExists;
// };

// // EMIT LIVE DATA TO RECEIVE IN FRONTEND
// // const emitLiveUsers = async io => {
// // availabeSites = JSON.parse(await getAsync('availableSites'));
// // if (availabeSites !== undefined) {
// //   availabeSites.map(async (availableSite, key) => {
// //     liveSiteUsers = JSON.parse(await getAsync(availableSite));
// //     io.to(availableSite).emit('liveUsers', liveSiteUsers);
// //   });
// // }

// // };

// export default showLiveUsers;
