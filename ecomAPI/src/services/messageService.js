import db from "../models/index";
import { Op } from 'sequelize';

const safeRoomMessageFindAll = async (where) => {
    try {
        return await db.RoomMessage.findAll({ where });
    } catch (error) {
        const original = error && (error.original || error.parent);
        const code = original && original.code;
        const message = (original && (original.sqlMessage || original.message)) || (error && error.message) || '';
        if (code === 'ER_NO_SUCH_TABLE' && String(message).includes('RoomMessages')) {
            return [];
        }
        throw error;
    }
}

const safeRoomMessageFindOne = async (where) => {
    try {
        return await db.RoomMessage.findOne({ where });
    } catch (error) {
        const original = error && (error.original || error.parent);
        const code = original && original.code;
        const message = (original && (original.sqlMessage || original.message)) || (error && error.message) || '';
        if (code === 'ER_NO_SUCH_TABLE' && String(message).includes('RoomMessages')) {
            return null;
        }
        throw error;
    }
}

let createNewRoom = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId1) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                let userAdmin = await db.User.findOne({
                    where:{email:'chat@gmail.com'}
                })
                let room = await safeRoomMessageFindOne({userOne:data.userId1})
                if(room){
                    resolve({
                        errCode: 2,
                        errMessage: 'Da Co Phong'
                    })
                }else{
                    if(userAdmin){
                        // If RoomMessages table is missing, we can't create rooms yet.
                        // Return ok so the rest of the site doesn't break; chat will appear empty.
                        let res;
                        try {
                            res = await db.RoomMessage.create({
                            userOne:data.userId1,
                            userTwo:userAdmin.id
                            })
                        } catch (error) {
                            const original = error && (error.original || error.parent);
                            const code = original && original.code;
                            const message = (original && (original.sqlMessage || original.message)) || (error && error.message) || '';
                            if (code === 'ER_NO_SUCH_TABLE' && String(message).includes('RoomMessages')) {
                                resolve({ errCode: 0, errMessage: 'ok' })
                                return;
                            }
                            throw error;
                        }
                        if(res){
                            resolve({
                                errCode: 0,
                                errMessage: 'ok'
                            })
                        }
                    }
                }
               
               
            }
        } catch (error) {
            reject(error)
        }
    })
}
let sendMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.userId || !data.roomId || !data.text) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
              let res = await db.Message.create({
                text:data.text,
                userId:data.userId,
                roomId:data.roomId,
                unRead:true
              })
               if(res){
                resolve({
                    errCode: 0,
                    errMessage: 'ok'
                })
               }
               
            }
        } catch (error) {
            reject(error)
        }
    })
}
let loadMessage = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.roomId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
               
              await db.Message.update({
                unRead:false
              },{where:{roomId:data.roomId,
               userId:{[Op.not]:data.userId}
            }})
            

              let message = await db.Message.findAll({
                where:{roomId:data.roomId}
              })
              
             for(let i =0 ; i< message.length; i++){
                message[i].userData = await db.User.findOne({where:{id:message[i].userId}})
                if(message[i].userData.image){
                    message[i].userData.image = new Buffer(message[i].userData.image, 'base64').toString('binary');
                }
             }
            resolve({
                errCode: 0,
                data: message
            })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let listRoomOfUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!userId) {
                resolve({
                    errCode: 1,
                    errMessage: 'Missing required parameters !'
                })
            } else {
                            let room = await safeRoomMessageFindAll({userOne:userId})

             for(let i =0 ; i< room.length; i++){
                room[i].messageData = await db.Message.findAll({where:{roomId:room[i].id}})

                room[i].userOneData = await db.User.findOne({where:{id:room[i].userOne}})
                if(room[i].userOneData.image){
                    room[i].userOneData.image = new Buffer(room[i].userOneData.image, 'base64').toString('binary');
                }
                room[i].userTwoData = await db.User.findOne({where:{id:room[i].userTwo}})
                if(room[i].userTwoData.image){
                    room[i].userTwoData.image = new Buffer(room[i].userTwoData.image, 'base64').toString('binary');
                }
             }
            resolve({
                errCode: 0,
                data: room
            })
            }
        } catch (error) {
            reject(error)
        }
    })
}
let listRoomOfAdmin = () => {
    return new Promise(async (resolve, reject) => {
        try {

            let user = await db.User.findOne({where:{email:'chat@gmail.com'}})
            if(user){
                let room = await safeRoomMessageFindAll({userTwo:user.id})
                 for(let i =0 ; i< room.length; i++){
                    room[i].messageData = await db.Message.findAll({where:{roomId:room[i].id}})
                    room[i].userOneData = await db.User.findOne({where:{id:room[i].userOne}})
                    if(room[i].userOneData.image){
                        room[i].userOneData.image = new Buffer(room[i].userOneData.image, 'base64').toString('binary');
                    }
                    room[i].userTwoData = await db.User.findOne({where:{id:room[i].userTwo}})
                    if(room[i].userTwoData.image){
                        room[i].userTwoData.image = new Buffer(room[i].userTwoData.image, 'base64').toString('binary');
                    }
                 }
                resolve({
                    errCode: 0,
                    data: room
                })
            }
              
          
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createNewRoom: createNewRoom,
    sendMessage:sendMessage,
    loadMessage:loadMessage,
    listRoomOfUser:listRoomOfUser,
    listRoomOfAdmin:listRoomOfAdmin
}