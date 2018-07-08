const exp = require('express')
const messageroute = exp.Router();
const Seq = require('../db').Seq;
const Chats = require('../db').Chats;
const Messages = require('../db').Messages;
const Listings = require('../db').Listings;
const User = require('../db').User;
//when retrieve messages of single chat
messageroute.get('/retrieve', (req, res) => {
    let chatId = req.query.id;
    let email = req.query.email;

    Messages.findAll({
        where: {
            'chatId': chatId
        }
    })
        .then(data => {
            //for retrieving other person's name
            let otherPersonName;
            if (data[0]['from'] === email) {
                Chats.find({
                    where: {
                        'id': chatId
                    }
                })
                    .then(data1 => {
                        otherPersonName = data1['sellername']
                        res.json({
                            otherPerson: otherPersonName,
                            msgdata: data
                        });
                    })
            }
            else {
                User.find({
                    where: {
                        'email': data[0]['from']
                    }
                })
                    .then(data1 => {
                        otherPersonName = data1['firstName'] + " " + data1['lastName'];
                        res.json({
                            otherPerson: otherPersonName,
                            msgdata: data
                        })
                    })
            }
        })
})

//when request for retrieving chats including regarding listings
messageroute.get('/', (req, res) => {
    Chats.findAll({
        where: {
            'users': {[Seq.Op.like]: '%' + req.query.email + '%'}
        },
        order: [['updatedAt', 'DESC']],
        include: [Listings]

    })
        .then((data) => res.send(data))
})
//when send message request from single listing page
messageroute.post('/', (req, res) => {

    let to = req.body.params.to;
    let from = req.body.params.from;
    let bid = req.body.params.bookId;
    let msg = req.body.params.message;
    let sellername = req.body.params.sellername;
    Chats.find({
        where: {
            [Seq.Op.or]: [{'users': from + ":" + to}, {'users': to + ":" + from}],
            'listingBookid': bid
        }
    })
        .then(data => {
            if (data === null) {
                //when there is new chat b/w persons
                Chats.create({
                    'users': from + ":" + to,
                    'listingBookid': bid,
                    'lastMessage': msg,
                    'from': from,
                    'sellername': sellername
                })
                    .then((data1) => {
                    //entry in all messages table
                        Messages.create({
                            'from': from,
                            'message': msg,
                            'chatId': data1['id']
                        })
                            .then(rec => {
                                res.send(rec)
                            })
                    })
            }
            else {
                //only lastMessage is updated in chat tables
                data.update({
                    'from': from,
                    'lastMessage': msg
                })
                    .then(() => {
                        Messages.create({
                            'from': from,
                            'message': msg,
                            'chatId': data['id']
                        })
                            .then(rec => {
                                res.send(rec)
                            })
                    })
            }

        })

})
//when send message is from chat component,we have chat id no need of checking the old and new chat
messageroute.post('/chatmsg', (req, res) => {
    let chatId = req.body.params.id;
    let msg = req.body.params.msg;
    let from = req.body.params.from;
    Chats.find({
        where: {
            'id': chatId
        }
    })
        .then(resp => {
            //only updation is required
            resp.update(
                {
                    'lastMessage': msg,
                    'from': from
                })
                .then(() => {
                    Messages.create({
                        'from': from,
                        'message': msg,
                        'chatId': chatId
                    })
                        .then(data => {

                            res.send(data)
                        })


                })

        })
})


module.exports = messageroute;