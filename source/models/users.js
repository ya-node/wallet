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
     * Получает пользователей по yandex id
     * @return {Promise.<Object[]>}
     */
    async getByYandexId(yandexId) {
        const item = await this.getBy({"yandex" : yandexId});
        return item;
    }

    /**
     * Удаление пользователей
     */
    static async remove() {
        throw new ApplicationError('Transaction can\'t be removed', 400);
    }
}

module.exports = Users;