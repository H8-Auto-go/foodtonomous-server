const {AutomationSchedule, Restaurant, Foods} = require('../models')

module.exports = class AutomationScheduleController {
    static async getAllSchedules(req, res, next) {
        try {
            const userId = /*req.user.id*/ 1
            const schedules = await AutomationSchedule.findAll({include: [Restaurant, Foods],where: {userId}})
            const editedSchedules = schedules.map(({id, time, isActive, Restaurant: resto, Food: food}) => {
                return {
                    id, time, isActive,
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
            })
            res.status(200).json({automationSchedules: editedSchedules})
        } catch(err) {
            next(err)
        }
    }

    static async getOneSchedule(req, res, next) {
        try {
            const scheduleId = Number(req.params.id)
            const {id, time, isActive, Restaurant: resto, Food: food} = await AutomationSchedule.findOne({include: [Restaurant, Foods],where: {id: scheduleId}})
            res.status(200).json({
                id, time, isActive,
                restaurant: {
                    id: resto.id,
                    name: resto.name,
                    picture: resto.picture,
                    location: JSON.parse(resto.location)
                },
                food: {
                    id: food.id,
                    name: food.name,
                    price: food.price
                }
            })
        } catch(err) {
            next(err)
        }
    }
    static async addSchedule(req, res, next) {
        try {
            const { time, isActive, restaurantId, foodId} = req.body
            const userId = /*req.user.id*/ 1
            const newSchedule = await AutomationSchedule.create({time, isActive, restaurantId, foodId, userId}, {returning: true})
            res.status(201).json({schedule: newSchedule})
        } catch(err) {
            next(err)
        }
    }
    static async updateStatus(req, res, next) {
        try {
            const scheduleId = Number(req.params.id)
            const isActive = req.body.isActive === 'true' //masih harus diganti, ini buat percobaan doang
            const updatedSchedule = await AutomationSchedule.update({isActive}, {where: {id:scheduleId}})
            res.status(200).json({schedule: updatedSchedule})
        } catch(err) {
            next(err)
        }
    }
    static async deleteSchedule(req, res, next) {
        try {
            const scheduleId = Number(req.params.id)
            await AutomationSchedule.destroy({where: {id:scheduleId}})
            res.status(200).json({message: 'automation schedule deleted'})
        } catch(err) {
            next(err)
        }
    }
}
