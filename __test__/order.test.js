const request = require('supertest');
const app = require('../app');
const { generateToken } = require('../helpers/jwt');
const { sequelize, Driver, User, Order } = require("../models");
const { queryInterface } = sequelize
let id
let token
let tokenDrive
let idUser
let idOrder
afterAll((done) => {
    console.log('TERAKIR')
    User.destroy({ where: { id: idUser } })
        .then(_ => {
            return queryInterface.bulkDelete('Orders', {})
        })
        .then((_) => {
            done()
        })
        .catch((err) => done(err))
})

beforeAll( done => {
        User.create({
            email: 'agung5@mail.com',
            password: '123',
            role: 'user'
        })
        .then((user) => {
            return User.findOne({
                where:{email:user.email}
            })
        })
        .then((user) => {
            idUser = user.id 
            token = generateToken({
                id: user.id,
                email: user.email,
                role: user.role
            })
            return Driver.findOne({
                where: {
                    email: 'amos@xavier.com'
                }
            })
        })
        .then((driver) => {
            tokenDrive = generateToken({
                id: driver.id,
                email: driver.email,
                role: driver.role
            })
            return Order.create({

                "status": "pending",
                "userId": idUser,
                "restaurantId": 2,
                "driverId":1,
                "foodId": 4,
                socketUserId: 1,
                restaurantId: 1
    
            })
        })
        .then(( order) => {
            idOrder = order.id
            done()
        })
        .catch((err) => {
            done(err)
        })
})


describe('order routes', () => {
    
    describe('get order', () => {
        console.log(idOrder, 'INIHORDER');
        test('should ', (done) => {
            console.log(idOrder, 'inihDI DALAM');
            request(app)
            .get(`/orders/${idOrder}`)
            .set('access_token', token)
                .end((err, res) => {
                    if (err) done(err)

                    expect(res.status).toBe(200)
                    done()
                })
        })
    })
    describe('server error', () => {
        test('should ', (done) => {
            request(app)
            .get(`/orders/1`)
            .set('access_token', token)
                .end((err, res) => {
                    if (err) done(err)

                    expect(res.status).toBe(500)
                    done()
                })
        })
        
    })
    describe('get all history user', () => {
        test('should ', (done) => {
            request(app)
            .get(`/orders/${idOrder}`)
            .set('access_token', token)
                .end((err, res) => {
                    if (err) done(err)

                    expect(res.status).toBe(200)
                    done()
                })
        })
    })
})