'use strict';

const randtoken = require('rand-token');
const logger = require('libs/logger')('app');


module.exports = async (ctx) => {
	const userId = Number(ctx.params.id);
	const token = `t${randtoken.generate(4, "0123456789")}`;
	const botName = ctx.bot.botName;

	await ctx.usersModel.updateUserField(userId, "token", token);

	async function onUserAccepted(data) {
		logger.info(`Telegram Bot: Accept user with token ${data.token}`);

		const {token, chatID} = data;

		const user = await ctx.usersModel.getByToken(`t${token}`);

		if (user) {
			await ctx.usersModel.updateUserField(user.id, "chatID", chatID);

			ctx.bot.send('message', {
				chatID,
				message: `${user.name} Ваш аккаунт успешно привязан.`
			});
		} else {
			ctx.bot.send('message', {
				chatID,
				message: `Простите, возникла ошибка, попробуйте повторить.`
			});
		}


		ctx.bot.removeListener('user', onUserAccepted)
	}

	ctx.bot.on('user', onUserAccepted);

	ctx.body = {userId, token, botName};
};
