const mongoose = require('mongoose');
const User = mongoose.model('User', {
    id: {
        type: Number,
        required: true
    },
    login: {
        type: String
    },
    name: {
        type: String
    },
    yandex: {
        type: Number,
        required: true
    },
    avatar: {
        type: String
    },
    token: {
    	type: String,
        required: false
    },
    chatID: {
    	type: Number,
        required: false
    }
});

module.exports = User;
