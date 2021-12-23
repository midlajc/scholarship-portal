const userHelper = require('../helpers/user_helper')
const adminHelper = require('../helpers/admin_helper')
const localStrategy = require('passport-local').Strategy
const {ObjectId} = require('mongodb');

module.exports =
    function(passport) {
        passport.use('user', new localStrategy(
            function(email, password, done) {
                userHelper.getUserByEmailForLogin(email, (err, user) => {
                    if (err) {
                        throw err;
                    }
                    if (!user) {
                        return done(null, false, { message: "User not Found" })
                    }
                    userHelper.comparePassword(password, user.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            return done(null, user)
                        } else {
                            return done(null, false, { message: "Password not Match" })
                        }
                    });
                })
            }
        ));

        passport.use('admin', new localStrategy(
            function(username, password, done) {
                adminHelper.getAdminByUserName(username, (err, admin) => {
                    if (err) {
                        throw err;
                    }
                    if (!admin) {
                        return done(null, false, { message: "User not Found" })
                    }
                    adminHelper.comparePassword(password, admin.password, (err, isMatch) => {
                        if (err) {
                            throw err;
                        }
                        if (isMatch) {
                            return done(null, admin)
                        } else {
                            return done(null, false, { message: "Password not Match" })
                        }
                    });
                })
            }
        ));
        passport.serializeUser(function(user, done) {
            done(null, user);
        });

        passport.deserializeUser(function(user, done) {
            if (user.type === 'user') {
                userHelper.getUserById(ObjectId(user._id), function(err, user) {
                    done(err, user);
                });
            } else if (user.type === 'admin') {
                adminHelper.getUserById(ObjectId(user._id), function(err, admin) {
                    done(err, admin);
                });
            }
        });
    }