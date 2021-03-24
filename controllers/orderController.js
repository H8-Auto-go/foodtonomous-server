const {Order, User, Driver, Restaurant, Foods} = require('../models')

class OrderController {
    static async createOrder({userId, foodId, restaurantId}, socketUserId) {
        try {
            const {id} = await Order.create({
                status: 'pending',
                socketUserId,
                restaurantId,
                foodId,
                userId,
            })
            return await Order.findByPk(id, {include: [User, Foods, Restaurant]})
        } catch (err) {
            console.log(err)
        }
    }

    static async addOrderDriver({ id, driverId }, socketDriverId){
        try {
            await Order.update({
                status: 'on going',
                socketDriverId,
                driverId
            }, {where: {id}, returning: true})
            const {status, socketUserId, User: user, Driver: driver, Restaurant: resto, Food: food, quantity, totalPrice} =
              await Order.findByPk(id ,{include: [User, Driver, Restaurant, Foods]})
            return {
                id, status,
                socketUserId,
                socketDriverId,
                quantity,
                totalPrice,
                user: {
                    id: user.id,
                    name: user.name,
                    saldo: user.saldo,
                    role: user.role,
                    avatar: user.avatar,
                    location: JSON.parse(user.location)
                },
                driver: {
                    id: driver.id,
                    name: driver.name,
                    saldo: Number(driver.saldo),
                    avatar: driver.avatar,
                    role: driver.role,
                    location: JSON.parse(driver.location)
                },
                restaurant: {
                    id: resto.id,
                    name: resto.name,
                    picture: resto.picture,
                    location: JSON.parse(resto.location)
                },
                food: {
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    picture: food.picture
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async getOrder(req, res, next) {
        try {
            console.log(req.body, req.headers, req.params, '<<<<< testing')
            const id = Number(req.params.id) || 1
            const {status, socketUserId, socketDriverId, User: user, Driver: driver, Restaurant: resto, Food: food, quantity, totalPrice} = await Order.findOne({where: {id}, include: [User, Driver, Restaurant, Foods]})
            res.status(200).json({
                id, status,
                socketUserId,
                socketDriverId,
                quantity,
                totalPrice,
                user: {
                    id: user.id,
                    name: user.name,
                    saldo: user.saldo,
                    avatar: user.avatar,
                    location: JSON.parse(user.location)
                },
                driver: {
                    id: driver.id,
                    name: driver.name,
                    saldo: Number(driver.saldo),
                    avatar: driver.avatar,
                    location: JSON.parse(driver.location)
                },
                restaurant: {
                    id: resto.id,
                    name: resto.name,
                    picture: resto.picture,
                    location: JSON.parse(resto.location)
                },
                food: {
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    picture: food.picture
                }
            })
        } catch (err) {
            next(err)
        }
    }

    static async updateTotalPrice({totalPrice, id}) {
        try {
            return await Order.update({totalPrice}, {where: {id}})
        } catch(err) {
            console.log(err)
        }
    }

    static async updateStatus({status, id}) {
        try {
            await Order.update({status}, {where: {id}})
            const {socketUserId, socketDriverId, User: user, Driver: driver, Restaurant: resto, Food: food, quantity, totalPrice} =
              await Order.findOne({where: {id}, include: [User, Driver, Restaurant, Foods]})
            return {
                id, status,
                socketUserId,
                socketDriverId,
                quantity,
                totalPrice,
                user: {
                    id: user.id,
                    name: user.name,
                    saldo: user.saldo,
                    avatar: user.avatar,
                    location: JSON.parse(user.location)
                },
                driver: {
                    id: driver.id,
                    name: driver.name,
                    saldo: Number(driver.saldo),
                    avatar: driver.avatar,
                    location: JSON.parse(driver.location)
                },
                restaurant: {
                    id: resto.id,
                    name: resto.name,
                    picture: resto.picture,
                    location: JSON.parse(resto.location)
                },
                food: {
                    id: food.id,
                    name: food.name,
                    price: food.price,
                    picture: food.picture
                }
            }
        } catch (err) {
            console.log(err)
        }
    }

    static async patchLocation(req, res, next) {
        try {
            const orderId = +req.params.id
            const {latitude, longitude} = req.body
            const location = JSON.stringify({latitude, longitude})
            const {driverId} = await Order.findByPk(orderId)
            await Driver.update({location}, {where: {id: driverId}})
            res.status(200).json({message: "location updated"})
        } catch(err) {
            next(err)
        }
    }

    static async deleteOrder(req, res, next) {
        try {
            const orderId = +req.params.id
            await Order.destroy({where: {id:orderId}})
            res.status(200).json({message: 'Success delete order'})
        } catch (err) {
            next(err)
        }
    }

    static async getAllhistoryUser(req, res, next) {
        try {
            const id = req.user.id ||1
            const history = await Order.findAll({where: {userId: id ,status:'done'}, include: [User, Driver, Restaurant, Foods]})
            res.status(200).json(history)
        } catch (err) {
            next(err)
        }
    }
}


module.exports = OrderController
