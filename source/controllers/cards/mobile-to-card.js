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

	ctx.status = 200;
	ctx.body = transaction;
};
