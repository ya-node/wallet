'use strict';

const config = require('config');
const logger = require('libs/logger')('app');
const VerificationBot = require('libs/verification-bot');

const bot = new VerificationBot(config.get('telegramBot.token'));

bot.botName = '@YetAnotherWalletBot';

bot.on('sending_error', (log) => {
	logger.error('Telegram bot error detected', log);
});

module.exports = () => bot;
