import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import moment from 'moment';
import axios from 'axios';
import Picker from 'rc-calendar/lib/Picker';
import RangeCalendar from 'rc-calendar/lib/RangeCalendar';
import ruLocate from 'rc-calendar/lib/locale/ru_RU';
import 'rc-calendar/assets/index.css';
import 'rc-time-picker/assets/index.css';
import 'moment/locale/ru';

import {Island} from './';

const HistoryLayout = styled(Island)`
	width: 530px;
	max-height: 622px;
	overflow-y: scroll;
	padding: 0;
	background-color: rgba(0, 0, 0, 0.05);
	display: flex;
	flex-direction: column;
`;

const HistoryEmpty = styled.div`
	margin: 10px 0 10px 12px;
`

const HistoryTitle = styled.div`
	padding: 5px 0;
	color: rgba(0, 0, 0, 0.4);
	font-size: 15px;
	line-height: 30px;
	text-transform: uppercase;
	position: relative;
`;

const HistoryContent = styled.div`
	color: rgba(0, 0, 0, 0.4);
	font-size: 15px;
	line-height: 30px;
`;

const HistoryItem = styled.div`
	display: flex;
	justify-content: space-around;
	align-items: center;
	height: 74px;
	font-size: 15px;
	white-space: nowrap;
	min-height: 74px;

	&:nth-child(even) {
		background-color: #fff;
	}

	&:nth-child(odd) {
		background-color: rgba(255, 255, 255, 0.72);
	}
`;

const HistoryItemIcon = styled.div`
	width: 50px;
	height: 50px;
	border-radius: 25px;
	background-color: #159761;
	background-image: url(${({bankSmLogoUrl}) => bankSmLogoUrl});
	background-size: contain;
	background-repeat: no-repeat;
`;

const HistoryItemTitle = styled.div`
	width: 260px;
	overflow: hidden;
	text-overflow: ellipsis;
`;

const HistoryItemTime = styled.div`
	width: 70px;
`;

const HistoryItemSum = styled.div`
	width: 60px;
	overflow: hidden;
	text-overflow: ellipsis;
	font-weight: bold;
`;

const HistoryTitleIcon = styled.div`
	width: initial;
	border-bottom: 1px dashed #b2b2b2;
	color: #b2b2b2;
	position: absolute;
	top: 12px;
	right: 15px;
	cursor: pointer;
	text-transform: lowercase;
    line-height: 15px;
    display: inline;
`;


const History = ({cardHistory, activeCard, startDate, endDate, onTransaction}) => {

	let startDateValue = startDate || moment('00:00:00', 'HH:mm:ss');
	let endDateValue = endDate || moment('23:59:59', 'HH:mm:ss');
	let dateTitle;

	if (startDate && endDate) {
		const today = moment().format('L');
		if (startDateValue.format('L') === today && endDateValue.format('L') === today) {
			dateTitle = 'Сегодня';
		} else {
			dateTitle = startDate.format('DD.MM.YYYY') + ' - ' + endDate.format('DD.MM.YYYY');
		}
	} else {
		dateTitle = 'Сегодня';
	}

	const getHistoryItemTitle = (item) => {
		let typeTitle = '';

		if (item.type == 'withdrawCard' && item.data.phoneNumber) {
			typeTitle = 'Оплата телефона';
		} else if (item.type == 'withdrawCard' && item.data.cardNumber) {
			typeTitle = 'Перевод на карту';
		} else {
			typeTitle = 'Операция';
		}

		return `${typeTitle}: ${item.data.cardNumber || item.data.phoneNumber}`;
	};

	const loadCsv = (activeCard) => {
		axios
			.get(`/cards/${activeCard.id}/file-transactions/?startDate=${startDateValue.format('YYYY-MM-DD')}&endDate=${endDateValue.format('YYYY-MM-DD')}`)
			.then(() => {});
	};

	const getContent = (list) => {
		const content = list.reduce((result, item, index) => {
			const historyItemDate = moment(item.time, moment.ISO_8601);

			const isAfter = historyItemDate.isAfter(startDateValue);
			const isBefore = historyItemDate.isBefore(endDateValue);


			if (isAfter && isBefore) {
				result.push((
					<HistoryItem key={index}>
					<HistoryItemIcon bankSmLogoUrl={item.card.theme.bankSmLogoUrl} />
			<HistoryItemTitle>
				{getHistoryItemTitle(item)}
				</HistoryItemTitle>
				<HistoryItemTime>
				{historyItemDate.format('DD.MM HH:mm')}
			</HistoryItemTime>
				<HistoryItemSum>
				{`${item.sum} ₽`}
			</HistoryItemSum>
				</HistoryItem>
			));
			}

			return result;
		}, []);
		return content.length === 0
			? <HistoryContent><HistoryEmpty>История операций пуста</HistoryEmpty></HistoryContent>
		: <HistoryContent>{content}</HistoryContent>;
	};

	const onChange = (value) => {

		startDateValue = value[0];
		startDateValue.hour(0);
		startDateValue.minute(0);
		startDateValue.second(0);

		endDateValue = value[1];
		endDateValue.hour(23);
		endDateValue.minute(59);
		endDateValue.second(59);

		onTransaction([startDateValue, endDateValue]);
	};

	const calendar = (
		<RangeCalendar
	showWeekNumber={false}
	dateInputPlaceholder={['Начало','Конец']}
	locale={ruLocate}
		/>
	);

	return (
		<HistoryLayout>
		<HistoryTitle>
		<Picker
	onChange={onChange}
	animation="slide-up"
	calendar={calendar}
		>
		{
		({ value }) => {
		return (
			<span>
				<i
			style={{
				border: '5px solid transparent',
					borderTop: '5px solid #bcbcbc',
					position: 'relative',
					top: 3,
					display: 'inline-block',
					marginLeft: 10,
					cursor: 'pointer'
			}}
			></i>
				<input
				placeholder={dateTitle}
				style={{
					width: 'initial',
						background: 'transparent',
						border: 'none',
						fontSize: 15,
						padding: '15px 15px 15px 10px',
						cursor: 'pointer'
				}}
				readOnly
				className="ant-calendar-picker-input ant-input"
					/>
					</span>);
			}
		}
	</Picker>
	<HistoryTitleIcon onClick={(event) => loadCsv(activeCard)}>
	выгрузить в Telegram
	</HistoryTitleIcon>
	</HistoryTitle>
	{getContent(cardHistory)}
	</HistoryLayout>
	);
};

History.propTypes = {
	activeCard: PropTypes.shape({
		id: PropTypes.number,
	}).isRequired,
	cardHistory: PropTypes.arrayOf(PropTypes.object).isRequired,
	onTransaction: PropTypes.func.isRequired
};

export default History;