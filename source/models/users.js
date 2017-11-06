'use strict';

const ApplicationError = require('libs/application-error');
const logger = require('libs/logger')('users-model');

const DbModel = require('./common/dbModel');

class Users extends DbModel {
    constructor() {
        super('user');
    }

    /**
     * Добавляет нового пользователя
     */
    async create(user) {
        const newUser = Object.assign({}, user, {
            id: await this._generateId()
        });

        await this._insert(newUser);
        return newUser;
    }

    /**
     * Получает пользователей по id
     * @return {Promise.<Object[]>}
     */
    async getById(userId) {
        const item = await this.getBy({"id": userId});
        return item;
    }

     /**
     * Получает пользователей по token
     * @return {Promise.<Object[]>}
     */
    async getByToken(token) {
        const item = await this.getBy({"token": token});
        return item;
    }

     /**
     * Задает пользователю с id значение поля
	 * @param {Number} id идентификатор пользователя
	 * @param {Object} fieldName имя поля
	 * @param {Object} fieldValue значение поля
     */
    async updateUserField(userId, fieldName, fieldValue) {
    	const user = await this.getById(userId);
		if (!user) {
			throw new ApplicationError(`User with ID=${userId} not found`, 404);
		}

		await this._update({"id": userId}, {[fieldName]: fieldValue});
    }

    /**
     * Получает пользователей по yandex id
     * @return {Promise.<Object[]>}
     */
    async getByYandexId(yandexId) {
        const item = await this.getBy({"yandex" : yandexId});
        return item;
    }

    /**
     * Удаление пользователей
	 * @param {Number} id идентификатор пользователя
	 */
    static async remove(userId) {
		const user = await this.getById(userId);
		if (!user) {
			throw new ApplicationError(`User with ID=${userId} not found`, 404);
		}
		await this._remove(userId);
    }
}

module.exports = Users;
