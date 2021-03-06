'use strict';

const ApplicationError = require('libs/application-error');

const DbModel = require('./common/dbModel');

class Transactions extends DbModel {
	constructor() {
		super('transaction');
	}

	/**
	 * Добавляет новую транзакцию
	 *
	 * @param {Object} transaction описание транзакции
	 * @returns {Promise.<Object>}
	 */
	async create(transaction) {
		const newTransaction = Object.assign({}, transaction, {
			id: await this._generateId()
		});

		await this._insert(newTransaction);
		return newTransaction;
	}

	/**
	 * Получает транзакции по идентификатору карты
	 * @param {Number} cardId Идентификатор карты
	 * @return {Promise.<Object[]>}
	 */
	async getByCard(cardId) {
		const item = await this.getBy({cardId});
		return item;
	}

  /**
   * Получает транзакцию по id
   * @return {Promise.<Object[]>}
   */
  async getById(id) {
      const item = await this.getBy({"id": id});
      return item;
  }


  /**
   * Задает транзакции с id значение поля
	 * @param {Number} id идентификатор транзакции
	 * @param {Object} fieldName имя поля
	 * @param {Object} fieldValue значение поля
   */
  async updateTransactionField(id, fieldName, fieldValue) {
	  const user = await this.getById(id);
		if (!user) {
			throw new ApplicationError(`Transaction with ID=${id} not found`, 404);
		}

		await this._update({"id": id}, {[fieldName]: fieldValue});
  }

	/**
	 * Получает транзакции по идентификатору карты и дате
	 * @param {Number} id Идентификатор карты
	 * @return {Promise.<Object[]>}
	 */
	async getByCardToday(id, startDate, endDate) {
	const item = await this.getFieldsBy({
		cardId: id,
		time: {
			"$gte": startDate,
			"$lte": endDate,
		}
	}, { type: 1, sum: 1, data: 1, time: 1, _id: 0 });
	return item;
}

	/**
	 * Удаление транзакции
	 */
	static async remove() {
		throw new ApplicationError('Transaction can\'t be removed', 400);
	}
}

module.exports = Transactions;
