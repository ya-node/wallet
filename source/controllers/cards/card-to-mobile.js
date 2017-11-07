'use strict';

const randtoken = require('rand-token');
const commission = 3;

module.exports = async (ctx) => {
	const cardId = ctx.params.id;

	const operation = ctx.request.body;
	const {sum, phoneNumber} = operation;

	ctx.cardsModel.withdraw(cardId, parseInt(sum, 10) + commission);

	const user = await ctx.usersModel.getById(ctx.session.passport.user);

	const transactionCode = `${randtoken.generate(4, "0123456789")}`;

	const transaction = await ctx.transactionsModel.create({
		cardId,
		type: 'withdrawCard',
		data: {phoneNumber},
		time: new Date().toISOString(),
		pending: Boolean(user && user.chatID),
		code: transactionCode,
		sum
	});


	if (user && user.chatID) {

		ctx.bot.send('touch', {
			chatID: user.chatID,
			code: transactionCode,
			operationID: transaction.id,
			message: `Необходимо подтвердить пополненние баланса мобильного телефона ${phoneNumber} на сумму ${sum} рублей.`
		});
	}

	ctx.status = 200;
	ctx.body = transaction;
};
