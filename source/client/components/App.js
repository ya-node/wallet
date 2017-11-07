import React, {Component} from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {injectGlobal} from 'emotion';
import CardInfo from 'card-info';
import axios from 'axios';

import {CardsBar, Header, History, MobilePayment, Prepaid, Withdraw, Login, CardAdd} from './';
import ConfirmOperation from './ConfirmOperation';

import './fonts.css';

injectGlobal([`
	html,
	body {
		margin: 0
	}

	#root {
		height: 100%
		font-family: 'Open Sans'
		color: #000
	}
`]);

const Wallet = styled.div`
	position: relative;
	display: flex;
	min-height: 100%;
	background-color: #fcfcfc;
`;

const CardPane = styled.div`
	flex-grow: 1;
`;

const Workspace = styled.div`
	display: flex;
	flex-wrap: wrap;
	max-width: 970px;
	padding: 15px;
`;

/**
 * Приложение
 */
class App extends Component {
	/**
	 * Подготавливает данные карт
	 *
	 * @param {Object} cards данные карт
	 * @returns {Object[]}
	 */
	static prepareCardsData(cards) {
		if (!cards) return [];
		return cards.map((card) => {
			const cardInfo = new CardInfo(card.cardNumber, {
				banksLogosPath: '/assets/',
				brandsLogosPath: '/assets/'
			});

			return {
				id: card.id,
				balance: card.balance,
				number: cardInfo.numberNice,
				bankName: cardInfo.bankName,
				theme: {
					bgColor: cardInfo.backgroundColor,
					textColor: cardInfo.textColor,
					bankLogoUrl: cardInfo.bankLogoSvg,
					brandLogoUrl: cardInfo.brandLogoSvg,
					bankSmLogoUrl: `/assets/${cardInfo.bankAlias}-history.svg`
				}
			};
		});
	}

	static prepareHistory(cardsList, transactionsData) {
		return transactionsData.map((data) => {
			const card = cardsList.find((item) => item.id === Number(data.cardId));
			return card ? Object.assign({}, data, {card}) : data;
		});
	}

	/**
	 * Конструктор
	 */
	constructor(props) {
		super();

		const data = props.data;
		const cardsList = App.prepareCardsData(data.cards);
		const cardHistory = App.prepareHistory(cardsList, data.transactions);

		this.state = {
			cardsList,
			cardHistory,
			activeCardIndex: 0,
			removeCardId: 0,
			isCardRemoving: false,
			isCardAdding: false,
			isCardsEditable: false,
			isOperationConfirm: false,
			transaction: {},
			startDate: '',
			endDate: ''
		};
	}

	/**
	 * Обработчик переключения карты
	 *
	 * @param {Number} activeCardIndex индекс выбранной карты
	 */
	onCardChange(activeCardIndex) {
		this.setState({activeCardIndex});
	}

	/**
	* Обработчик события редактирования карт
	* @param {Boolean} isEditable Признак редактируемости
	*/
	onEditChange(isEditable) {
		const isCardsEditable = !isEditable;
		this.setState({
			isCardsEditable,
			isCardRemoving: false
		});
	}

	/**
	* Функция вызывает при успешной транзакции
	*/
	onTransaction(value) {
		axios.get('/cards').then(({data}) => {
			const cardsList = App.prepareCardsData(data);
			this.setState({cardsList});

			axios.get('/transactions').then(({data}) => {
				const cardHistory = App.prepareHistory(cardsList, data);
				this.setState({cardHistory});
			});
		});

		if (value) {
			const startDate = value[0];
			const endDate = value[1];
			this.setState({startDate, endDate});
		}
	}

	/**
	 * Обработчик события переключения режима сайдбара
	 * @param {String} mode Режим сайдбара
	 * @param {String} index Индекс выбранной карты
	 */
	onChangeBarMode(event, removeCardId) {
		event.stopPropagation();
		this.setState({
			isCardRemoving: true,
			removeCardId
		});
	}

	/**
	 * Удаление карты
	 * @param {Number} index Индекс карты
	 */
	deleteCard(id) {
		axios
			.delete(`/cards/${id}`)
			.then(() => {
				axios.get('/cards').then(({data}) => {
					const cardsList = App.prepareCardsData(data);
					this.setState({cardsList, activeCardIndex: 0});
				});
			});
	}

	/**
	 * Добавление новой карты
	 * @param {Object} data
	 */
	addCard(data) {
		const card = App.prepareCardsData([data]);
		const {cardsList} = this.state;
		const newCardsList = [
			...cardsList,
			...card
		];

		this.setState({cardsList: newCardsList});
	}

	/**
	 * Показать модальное окно для добавления новой карты
	 */
	showCardModal() {
		this.setState({isCardAdding: true});
	}

	/**
	 * Спрятать модальное окно добавления новой карты
	 */
	hideCardModal() {
		this.setState({isCardAdding: false});
	}

	/**
	 * Показать модальное окно для подверждения операции
	 */
	showOperationConfirmModal(data) {
		this.setState({isOperationConfirm: true, transaction: data});
	}

	/**
	 * Спрятать модальное окно для подверждения операции
	 */
	hideOperationConfirmModal() {
		this.setState({isOperationConfirm: false});
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const {data} = this.props;
		const {
			transaction,
			cardsList,
			activeCardIndex,
			cardHistory,
			isCardsEditable,
			isCardRemoving,
			isCardAdding,
			isOperationConfirm,
			removeCardId,
			startDate,
			endDate
		} = this.state;

		const activeCard = cardsList[activeCardIndex] || 0;

		const inactiveCardsList = cardsList.filter((card, index) => (index === activeCardIndex ? false : card));
		const filteredHistory = cardHistory.filter((data) => {
			return Number(data.cardId) == activeCard.id;
		});

		if (!data.user.isAuthorized) {
			return (
				<Login />
			);
		}

		let prepaid,
			mobilepayment,
			withdraw;

		if (cardsList.length) {
			mobilepayment = <MobilePayment
				activeCard={activeCard}
				showOperationConfirmModal={(data) => this.showOperationConfirmModal(data)}
				onTransaction={() => this.onTransaction()} />;
		}
		if (cardsList.length > 1) {
			prepaid = <Prepaid
				activeCard={activeCard}
				inactiveCardsList={inactiveCardsList}
				onCardChange={(newActiveCardIndex) => this.onCardChange(newActiveCardIndex)}
				onTransaction={() => this.onTransaction()} />;
			withdraw = <Withdraw
				activeCard={activeCard}
				inactiveCardsList={inactiveCardsList}
				onTransaction={() => this.onTransaction()} />;
		}

		return (
			<Wallet>
				<CardsBar
					activeCardIndex={activeCardIndex}
					removeCardId={removeCardId}
					cardsList={cardsList}
					onCardChange={(index) => this.onCardChange(index)}
					isCardsEditable={isCardsEditable}
					isCardRemoving={isCardRemoving}
					deleteCard={(index) => this.deleteCard(index)}
					addCard={() => this.addCard()}
					showCardModal={() => this.showCardModal()}
					onChangeBarMode={(event, index) => this.onChangeBarMode(event, index)} />
				<CardPane>
					<Header activeCard={activeCard} user={data.user} deleteCard={(cardId) => this.deleteCard(cardId)} />
					<Workspace>
						<History
							cardHistory={filteredHistory}
							activeCard={activeCard}
							startDate={startDate}
							endDate={endDate}
							onTransaction={(value) => this.onTransaction(value)}
						/>
						{prepaid}
						{mobilepayment}
						{withdraw}
					</Workspace>
				</CardPane>
				<CardAdd
					isCardAdding={isCardAdding}
					hideCardModal={() => this.hideCardModal()}
					user={data.user}
					addCard={(newCard) => this.addCard(newCard)} />
				<ConfirmOperation
					transaction={transaction}
					isOperationConfirm={isOperationConfirm}
					hideModal={() => this.hideOperationConfirmModal()}
					user={data.user} />
			</Wallet>
		);
	}
}

App.propTypes = {
	data: PropTypes.shape({
		user: PropTypes.object
	})
};

App.defaultProps = {
	data: {}
};

export default App;
