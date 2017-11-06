import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Title, UserInfo} from './';

const HeaderLayout = styled.header`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 74px;
	background: #fff;
	padding: 20px 30px;
	box-sizing: border-box;
	border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const Balance = styled(Title)`
	display: flex;
	align-items: center;
	margin: 0;
`;

const BalanceSum = styled.span`
	font-weight: bold;
`;

const RemoveButton = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100px;
	height: 28px;
	margin-left: 20px;
	font-weight: 400;
	font-size: 11px;
	border: 1px solid rgba(0, 0, 0, 0.10);
	background-color: transparent;
	border-radius: 3px;
	cursor: pointer;
`;

const Header = ({activeCard, user, deleteCard}) => {
	const bankName = activeCard.bankName ? activeCard.bankName : activeCard.number;

	if (activeCard) {
		return (
			<HeaderLayout>
				<Balance>
					{`${bankName}: `}
					<BalanceSum>{`${activeCard.balance ? activeCard.balance : 0} ₽`}</BalanceSum>
					<RemoveButton onClick={() => deleteCard(activeCard.id)}>Удалить карту</RemoveButton>
				</Balance>
				<UserInfo user={user} />
			</HeaderLayout>
		);
	}

	return (
		<HeaderLayout>
			<Balance />
			<UserInfo user={user} />
		</HeaderLayout>
	);
};

Header.propTypes = {
	activeCard: PropTypes.shape({
		bankName: PropTypes.string,
		balance: PropTypes.number.isRequired
	}),
	user: PropTypes.shape({
		login: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		avatar: PropTypes.string,
	}),
	deleteCard: PropTypes.func.isRequired
};

export default Header;
