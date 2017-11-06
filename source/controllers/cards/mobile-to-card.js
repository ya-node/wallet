'use strict';

module.exports = async (ctx) => {
	const cardId = ctx.params.id;

	const operation = ctx.request.body;
	const {phoneNumber, sum} = operation;

	ctx.cardsModel.refill(cardId, sum);

	const transaction = await ctx.transactionsModel.create({
		cardId,
		type: 'paymentMobile',
		data: {phoneNumber},
		time: new Date().toISOString(),
		sum
	});

	const user = await ctx.usersModel.getById(ctx.session.passport.user);
	const card = await ctx.cardsModel.getById(cardId);


	if (user && user.chatID) {
		ctx.bot.send('message', {
			chatID: user.chatID,
			message: `Проведен перевод на карту ${card.cardNumber} с телефона ${phoneNumber} на сумму ${sum} рублей`
		});
	}

	ctx.status = 200;
	ctx.body = transaction;
};
