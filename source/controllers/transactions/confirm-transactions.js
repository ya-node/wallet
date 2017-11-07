'use strict';

module.exports = async (ctx) => {

	const {confirmCode, userId, transactionId} = ctx.request.body;


	const transaction = await ctx.transactionsModel.getById(transactionId);

	if (transaction && (Number(confirmCode) === Number(transaction.code))) {
		await ctx.transactionsModel.updateTransactionField(transactionId, "pending", false);

		ctx.status = 201;
		ctx.body = "Transaction is confirmed";
	} else {
		ctx.status = 404;
		ctx.body = "Unable to confirm transaction";
	}

};
