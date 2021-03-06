'use strict';

const ApplicationError = require('libs/application-error');

const DbModel = require('./common/dbModel');

class Cards extends DbModel {
	constructor() {
		super('card');
	}

	/**
	 * Добавляет карту
	 *
	 * @param {Object} card описание карты
	 * @returns {Promise.<Object>}
	 */
	async create(card) {
		const isDataValid = card
			&& Object.prototype.hasOwnProperty.call(card, 'cardNumber')
			&& Object.prototype.hasOwnProperty.call(card, 'balance')
			&& Object.prototype.hasOwnProperty.call(card, 'userId');

		if (isDataValid) {
			const newCard = Object.assign({}, card, {
				id: await this._generateId()
			});

			try {
				await this._insert(newCard);
			} catch (error) {
				const status = error.name === 'ValidationError' ? 400 : 500;
				const message = error.message ? error.message : 'Can not create new card';

				throw new ApplicationError(message, status);
			}

			return newCard;
		}

		throw new ApplicationError('Card data is invalid', 400);
	}

	/**
	 * Удалет карту
	 * @param {Number} id идентификатор карты
	 */
	async remove(id) {
		const card = await this.get(id);
		if (!card) {
			throw new ApplicationError(`Card with ID=${id} not found`, 404);
		}
		await this._remove(id);
	}

	/**
	 * Списание средств с карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async withdraw(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) - Number(sum);

		await this._update({id}, {balance: newBalance});
	}

	/**
	 * Пополнение карты
	 * @param {Number} id идентификатор карты
	 * @param {Number} sum сумма
	 */
	async refill(id, sum) {
		const card = await this.get(id);
		const newBalance = Number(card.balance) + Number(sum);

		await this._update({id}, {balance: newBalance});
	}
}

module.exports = Cards;
