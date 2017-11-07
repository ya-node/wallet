'use strict';

const logger = require('libs/logger')('file-transactions-controller');
const fs = require('fs');
const moment = require('moment');

module.exports = async (ctx) => {

    const user = await ctx.usersModel.getById(ctx.session.passport.user);

    if (user && user.chatID) {

        const date = ctx.request.query;
        const cardId = ctx.params.id;
        const sourceCard = await ctx.cardsModel.get(cardId);
        let startDate;
        let endDate;
        let message = "Выписка по карте "+sourceCard.cardNumber+":\n\n";

        if (date.startDate) {
            startDate = new Date(date.startDate);
        } else {
            startDate = new Date();
        }
        startDate.setHours(0);
        startDate.setMinutes(0);
        startDate.setSeconds(0);

        if (date.endDate) {
            endDate = new Date(date.endDate);
        } else {
            endDate = new Date();
        }
        endDate.setHours(23);
        endDate.setMinutes(59);
        endDate.setSeconds(59);

        const dataTransactions = await ctx.transactionsModel.getByCardToday(cardId, startDate, endDate);
        console.log(dataTransactions);

        dataTransactions.forEach((value, index) => {
            console.log(value);
            const date = moment(value.time, moment.ISO_8601);
            message = message + date.format('DD.MM.YYYY HH:mm:ss') + ": ";
            if (value.type == 'withdrawCard' && value.data.phoneNumber) {
                message = message + "Оплата мобильного телефона ";
                message = message + value.data.phoneNumber;
                message = message + " на сумму ";
            } else if (value.type == 'withdrawCard' && value.data.cardNumber) {
                message = message + "Перевод на карту ";
                message = message + value.data.cardNumber;
                message = message + " суммой ";
            }
            message = message + value.sum + " руб.\n\n";
        });

        if (dataTransactions.length) {
            ctx.bot.send('message', {
                chatID: user.chatID,
                message: message
            });
        }
    }

};