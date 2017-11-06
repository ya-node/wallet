'use strict';

module.exports = async (ctx) => {
	const cardId = ctx.params.id;

	const operation = ctx.request.body;
	const {target, sum} = operation;

	await ctx.cardsModel.withdraw(cardId, sum);
	await ctx.cardsModel.refill(target, sum);

	const sourceCard = await ctx.cardsModel.get(cardId);
	const targetCard = await ctx.cardsModel.get(target);

	const transaction = await ctx.transactionsModel.create({
		cardId: sourceCard.id,
		type: 'withdrawCard',
		data: {
			cardNumber: targetCard.cardNumber
		},
		time: new Date().toISOString(),
		sum
	});

	const user = await ctx.usersModel.getById(ctx.session.passport.user);

	if (user && user.chatID) {
		ctx.bot.send('message', {
			chatID: user.chatID,
			message: `Проведен перевод суммы с карты ${sourceCard} на карту ${targetCard} в размере ${sum}`
		});
	}


	ctx.status = 200;
	ctx.body = transaction;
};
