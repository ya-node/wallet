'use strict';

module.exports = async (ctx) => {
	ctx.body = await ctx.cardsModel.getAllFromUser(ctx.session.passport.user);
};
