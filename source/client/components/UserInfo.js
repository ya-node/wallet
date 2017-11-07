import React from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import {Button} from './';
import axios from 'axios';

const User = styled.div`
	display: flex;
	align-items: center;
	font-size: 15px;
	color: #000;
`;

const Avatar = styled.img`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	margin-right: 10px;
`;

const Telegram = styled.img`
	width: 42px;
	height: 42px;
	margin-right: 10px;
	cursor: pointer;
`;

const Logout = styled.img`
	width: 42px;
	height: 42px;
	margin-right: 10px;
	cursor: pointer;
`;


const UserInfo = ({user}) => {

	const onTelegramBtnClick = function() {
		axios.get(`/bot/${user.id}`)
		.then((response) => {
			const {userId, token, botName} = response.data;
			alert(`Для того, чтобы привязать Telegram бота, отправьте ${botName} код подтверждения: ${token}`);
		})
		.catch((err) => {
			alert(`К сожалению данный сервис временно недоступен.`);
		});
	}
	const onLogoutBtnClick = function() {
		axios.get(`/logout`)
			.then((response) => {
				location.reload();
			});
	}

	if (user.login) {
		return (
			<User>
				<Logout
					src={'/assets/logout.png'}
					onClick={onLogoutBtnClick}
				/>
				<Telegram
					src={'/assets/telegram.svg'}
					onClick={onTelegramBtnClick}
				/>
				<Avatar src={user.avatar || '/assets/avatar.png'} />
				{user.name || user.login}
			</User>
		);
	}

	return <Button>Войти</Button>;
};

UserInfo.propTypes = {
	user: PropTypes.shape({
		login: PropTypes.string,
		name: PropTypes.string,
		avatar: PropTypes.string,
	})
};

UserInfo.defaultProps = {
	user: {}
};

export default UserInfo;
