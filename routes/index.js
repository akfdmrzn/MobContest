/**
 * Module Dependencies
 */
const errors = require('restify-errors');
/**
 * Model Schema
 */
const User = require('../models/user');
const Rate = require('../models/rate');
const Country = require('../models/country');
const mongoose = require('mongoose');

module.exports = function(server){


    //Register User
   server.post('/registerUser', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};
        let user = new User(data);

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı",
            userId : data._id
        };

        user.mail = req.body.mail.toLowerCase();
        user.save(function(err,response) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(responseBody);
            next();
        });
    });
    /**
     * LOGIN
     */

    server.post('/login', function(req, res) {
        User.findOne({
                mail: req.body.mail
            }, function(err, user) {
                
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    if(user.mail ==  req.body.mail && user.password==req.body.password){
                res.json({
                        success: true,
                        message: "Login İşlemi Başarılı",
                        data: user._id
                        
                    }); }
                } else {
                    res.json({
                        success: false,
                        message: "Hatalı Şifre Veya Kullanıcı Adı"
                    });    
                }
            }
        });
    });


 /**
     * Karşılastırmayı getir il ilçeye göre
     */

    server.post('/compare', function(req, res) {
        User.find({
                country : req.body.country,
                city : req.body.city
            }, function(err, user) {
                
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    if (user.length % 2 != 0){
                        user.pop()
                    }

                res.json({
                        'Users': user
                    }); }
            }
        });
    });

    /**
     * Karşılastırmayı beğenme servisi
     */

    server.post('/rateUser', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};
        let rate = new Rate(data);
        

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı"
        };

        rate.save(function(err,response) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(responseBody);
            next();
        });
    });


     /**
     * LIST
     */
    server.get('/usersList', (req, res, next) => {
        User.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(docs);
            next();
        });
    });

    /**
     * GET
     */
    server.post('/getRatedUserByCity', async (req, res, next) => {

    Rate.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "toId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        { "$unwind": "$user" },
        { "$match":
            {
            "user.country": req.body.country
            }
        },
        { "$match":
          {
            "user.city": req.body.city
          }
        },
        { "$match":
            {
            "user.gender": req.body.gender
            },
        },    
        {
          $project:{
          userId:"$user._id",
          detail:"$user"
            },
        },
        { "$group": {
            "_id": "$userId",
            "Count": { $sum: 1 },
            "Detail" : { "$first": "$detail" },
          }
        },
        {
             $sort: { Count: -1 }
        }
        
    ]).exec().then((result) => {
        
        return res.send({'Users':result});
          
        }).catch((err) => {
            console.error(err);
          });
 });

    /**
     * UPDATE
     */
    server.put('/todos/:todo_id', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};

        if (!data._id) {
            data = Object.assign({}, data, { _id: req.params.todo_id });
        }

        Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            } else if (!doc) {
                return next(
                    new errors.ResourceNotFoundError(
                        'The resource you requested could not be found.',
                    ),
                );
            }

            Todo.update({ _id: data._id }, data, function(err) {
                if (err) {
                    console.error(err);
                    return next(
                        new errors.InvalidContentError(err.errors.name.message),
                    );
                }

                res.send(200, data);
                next();
            });
        });
    });



    //Register Countries
    server.post('/addCountries', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı",
        };

        req.body.forEach(function(obj) {
            var country = new Country(obj);
            
    country.save(function(err,response) {
            if (err) {
                 console.error(err);
                 return next(new errors.InternalError(err.message));
                 next();
                }
                res.send(responseBody);
                next();
            });
       });
    });

     /**
     * GET ALL COUNTRIES LIST
     */
    server.get('/countriesList', (req, res, next) => {
        Country.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );/**
 * Module Dependencies
 */
const errors = require('restify-errors');
/**
 * Model Schema
 */
const User = require('../models/user');
const Rate = require('../models/rate');
const Country = require('../models/country');
const mongoose = require('mongoose');

module.exports = function(server){


    //Register User
   server.post('/registerUser', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};
        let user = new User(data);

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı",
            userId : data._id
        };

        user.mail = req.body.mail.toLowerCase();
        user.save(function(err,response) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(responseBody);
            next();
        });
    });
    /**
     * LOGIN
     */

    server.post('/login', function(req, res) {
        User.findOne({
                mail: req.body.mail
            }, function(err, user) {
                
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    if(user.mail ==  req.body.mail && user.password==req.body.password){
                res.json({
                        success: true,
                        message: "Login İşlemi Başarılı",
                        data: user._id
                        
                    }); }
                } else {
                    res.json({
                        success: false,
                        message: "Hatalı Şifre Veya Kullanıcı Adı"
                    });    
                }
            }
        });
    });


 /**
     * Karşılastırmayı getir il ilçeye göre
     */

    server.post('/compare', function(req, res) {
        User.find({
                country : req.body.country,
                city : req.body.city
            }, function(err, user) {
                
            if (err) {
                res.json({
                    type: false,
                    data: "Error occured: " + err
                });
            } else {
                if (user) {
                    if (user.length % 2 != 0){
                        user.pop()
                    }

                res.json({
                        'Users': user
                    }); }
            }
        });
    });

    /**
     * Karşılastırmayı beğenme servisi
     */

    server.post('/rateUser', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};
        let rate = new Rate(data);
        

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı"
        };

        rate.save(function(err,response) {
            if (err) {
                console.error(err);
                return next(new errors.InternalError(err.message));
                next();
            }

            res.send(responseBody);
            next();
        });
    });


     /**
     * LIST
     */
    server.get('/usersList', (req, res, next) => {
        User.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(docs);
            next();
        });
    });

    /**
     * GET
     */
    server.post('/getRatedUserByCity', async (req, res, next) => {

    Rate.aggregate([
        {
            "$lookup": {
                "from": "users",
                "localField": "toId",
                "foreignField": "_id",
                "as": "user"
            }
        },
        { "$unwind": "$user" },
        { "$match":
            {
            "user.country": req.body.country
            }
        },
        { "$match":
          {
            "user.city": req.body.city
          }
        },
        { "$match":
            {
            "user.gender": req.body.gender
            },
        },    
        {
          $project:{
          userId:"$user._id",
          detail:"$user"
            },
        },
        { "$group": {
            "_id": "$userId",
            "Count": { $sum: 1 },
            "Detail" : { "$first": "$detail" },
          }
        },
        {
             $sort: { Count: -1 }
        }
        
    ]).exec().then((result) => {
        
        return res.send({'Users':result});
          
        }).catch((err) => {
            console.error(err);
          });
 });

    /**
     * UPDATE
     */
    server.put('/todos/:todo_id', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let data = req.body || {};

        if (!data._id) {
            data = Object.assign({}, data, { _id: req.params.todo_id });
        }

        Todo.findOne({ _id: req.params.todo_id }, function(err, doc) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            } else if (!doc) {
                return next(
                    new errors.ResourceNotFoundError(
                        'The resource you requested could not be found.',
                    ),
                );
            }

            Todo.update({ _id: data._id }, data, function(err) {
                if (err) {
                    console.error(err);
                    return next(
                        new errors.InvalidContentError(err.errors.name.message),
                    );
                }

                res.send(200, data);
                next();
            });
        });
    });



    //Register Countries
    server.post('/addCountries', (req, res, next) => {
        if (!req.is('application/json')) {
            return next(
                new errors.InvalidContentError("Expects 'application/json'"),
            );
        }

        let responseBody =  {
            success : true,
            message : "Kayıt Başarılı",
        };

        req.body.forEach(function(obj) {
            var country = new Country(obj);
            
    country.save(function(err,response) {
            if (err) {
                 console.error(err);
                 return next(new errors.InternalError(err.message));
                 next();
                }
                res.send(responseBody);
                next();
            });
       });
    });

     /**
     * GET ALL COUNTRIES LIST
     */
    server.get('/countriesList', (req, res, next) => {
        Country.apiQuery(req.params, function(err, docs) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }
            res.send(docs);
            next();
        });
    });
    /**
     * DELETE
     */
    server.del('/todos/:todo_id', (req, res, next) => {
        Todo.remove({ _id: req.params.todo_id }, function(err) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(204);
            next();
        });
    });
}

            }
            res.send(docs);
            next();
        });
    });
    /**
     * DELETE
     */
    server.del('/todos/:todo_id', (req, res, next) => {
        Todo.remove({ _id: req.params.todo_id }, function(err) {
            if (err) {
                console.error(err);
                return next(
                    new errors.InvalidContentError(err.errors.name.message),
                );
            }

            res.send(204);
            next();
        });
    });
}
