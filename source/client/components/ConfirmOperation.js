import React, {Component}  from 'react';
import PropTypes from 'prop-types';
import styled from 'emotion/react';
import axios from 'axios';
import {Input, Button} from './';

const Layout = styled.div`
	position: fixed;
	display: block;
	width: 100%;
	height: 100%;
	top: 0;
	left: 0;
	padding: 50px;
	background: rgba(0, 0, 0, .6);
	overflow-y: scroll;
	z-index: 100;

	@media(max-width: 767px) {
		padding: 15px;
  	}
`;

const Wrapper = styled.div`
	display: block;
`;

const Container = styled.div`
	position: relative;
	max-width: 500px;
	margin: 0 auto;
	padding: 60px 90px;
	padding-top: 40px;
	text-align: center;
	border-radius: 4px;
	background-color: #FFFFFF;
	box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.05);

	@media(max-width: 640px) {
		padding: 30px 15px;
  	}
`;

const Close = styled.div`
	position: absolute;
	display: block;
	width: 40px;
	height: 40px;
	top: 10px;
	right: 10px;
	background-repeat: no-repeat;
	background-position: 50% 50%;
	background-image: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/PjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDQ3Ljk3MSA0Ny45NzEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDQ3Ljk3MSA0Ny45NzE7IiB4bWw6c3BhY2U9InByZXNlcnZlIj48Zz48cGF0aCBkPSJNMjguMjI4LDIzLjk4Nkw0Ny4wOTIsNS4xMjJjMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MmMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwTDIzLjk4NiwxOS43NDRMNS4xMjEsMC44OGMtMS4xNzItMS4xNzItMy4wNy0xLjE3Mi00LjI0MiwwYy0xLjE3MiwxLjE3MS0xLjE3MiwzLjA3MSwwLDQuMjQybDE4Ljg2NSwxOC44NjRMMC44NzksNDIuODVjLTEuMTcyLDEuMTcxLTEuMTcyLDMuMDcxLDAsNC4yNDJDMS40NjUsNDcuNjc3LDIuMjMzLDQ3Ljk3LDMsNDcuOTdzMS41MzUtMC4yOTMsMi4xMjEtMC44NzlsMTguODY1LTE4Ljg2NEw0Mi44NSw0Ny4wOTFjMC41ODYsMC41ODYsMS4zNTQsMC44NzksMi4xMjEsMC44NzlzMS41MzUtMC4yOTMsMi4xMjEtMC44NzljMS4xNzItMS4xNzEsMS4xNzItMy4wNzEsMC00LjI0MkwyOC4yMjgsMjMuOTg2eiIvPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48Zz48L2c+PGc+PC9nPjxnPjwvZz48L3N2Zz4=);
	background-size: 20px 20px;
	cursor: pointer;
	opacity: .6;
	transition: opacity .2s ease;

	&:hover {
		opacity: 1;
	}
`;

const Preview = styled.div`
	display: block;
	width: 100px;
	margin: 0 auto;
	line-height: 0;
`;

const CardImg = styled.img`
	display: block;
	width: 100%;
	margin-bottom: 30px;
`;

const Title = styled.h1`
	position: relative;
	margin-bottom: 25px;
`;

const Form = styled.form`
	width: 100%;
`;

const NumInput = styled(Input)`
	display: block;
	width: 100%;
	height: 40px;
	margin-bottom: 15px;
	color: '#000';
	border-color: #DCDCDC;
	background-color: #FFFFFF;
`;

const UserInput = styled.input`

`;

const Preloader = styled.div`
	position: relative;
	display: block;
	width: 56px;
	height: 56px;
	margin: 0 auto;
	background-repeat: no-repeat;
	background-position: 50% 50%;
	background-image: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwcHgiICBoZWlnaHQ9IjIwMHB4IiAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJsZHMtcm9sbGluZyIgc3R5bGU9ImJhY2tncm91bmQ6IG5vbmU7Ij4gICAgPGNpcmNsZSBjeD0iNTAiIGN5PSI1MCIgZmlsbD0ibm9uZSIgbmctYXR0ci1zdHJva2U9Int7Y29uZmlnLmNvbG9yfX0iIG5nLWF0dHItc3Ryb2tlLXdpZHRoPSJ7e2NvbmZpZy53aWR0aH19IiBuZy1hdHRyLXI9Int7Y29uZmlnLnJhZGl1c319IiBuZy1hdHRyLXN0cm9rZS1kYXNoYXJyYXk9Int7Y29uZmlnLmRhc2hhcnJheX19IiBzdHJva2U9IiNmYzAiIHN0cm9rZS13aWR0aD0iNSIgcj0iMzUiIHN0cm9rZS1kYXNoYXJyYXk9IjE2NC45MzM2MTQzMTM0NjQxNSA1Ni45Nzc4NzE0Mzc4MjEzOCIgdHJhbnNmb3JtPSJyb3RhdGUoNy45OTk5OSA1MCA1MCkiPiAgICAgIDxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiBjYWxjTW9kZT0ibGluZWFyIiB2YWx1ZXM9IjAgNTAgNTA7MzYwIDUwIDUwIiBrZXlUaW1lcz0iMDsxIiBkdXI9IjEuNXMiIGJlZ2luPSIwcyIgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiPjwvYW5pbWF0ZVRyYW5zZm9ybT4gICAgPC9jaXJjbGU+ICA8L3N2Zz4=);
	background-size: 40px 40px;
`;

const Submit = styled(Button)`
	position: relative;
	display: block;
	width: 100%;
	height: 56px;
	padding-left: 18px;
	padding-right: 18px;
	font-weight: 400;
	font-size: 18px;
    line-height: 56px;
    color: #000000;
	border-radius: 3px;
   	background-color: #ffdb4d;
   	transition: background-color .3s ease;

   	&:hover {
		background-color: #FFD633;
		color: #000000;
	}

	@media(max-width: 640px) {
		font-size: 16px;
	}
`;

const resultMessage = styled.div`
	padding-top: 10px;
	font-size: 16px;
`;

const Success = styled(resultMessage)`
	color: #29af5f;
`;

const Error = styled(resultMessage)`
	color: #FC4F4E;
`;

/**
 * Компонент ConfirmOperation
 */
class ConfirmOperation extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента ConfirmOperation
	 */
	constructor(props) {
		super(props);

		this.state = {
			confirmCode: '',
			userId: props.user.id,
			isLoading: false,
			isDisabled: false,
			successMessage: '',
			errorMessage: ''
		};
	}

	/**
	 * Обработка изменения значения в input
	 * @param {Event} event событие изменения значения input
	 */
	onChangeInputValue(event) {
		if (!event) {
			return;
		}

		const {name, value} = event.target;

		this.setState({
			[name]: value
		});
	}

	/**
	 * Отправка формы
	 * @param {Event} event событие отправки формы
	 */
	onSubmitForm(event) {

		if (event) {
			event.preventDefault();
		}

		const {confirmCode, userId} = this.state;
		const transactionId = this.props.transaction.id;

		this.setState({isLoading: true, successMessage: '', errorMessage: ''});

		axios
			.post('/transactions/confirm', {confirmCode, userId, transactionId})
			.then((response) => {
				const {data} = response;
				const successMessage = 'Операция успешно подтвеждена!';
				const isDisabled = true;

				this.setState({isLoading: false, successMessage, confirmCode, isDisabled});
			})
			.catch((error) => {
				const {response} = error;
				const status = response.status || 500;
				let errorMessage = 'Ошибка. Попробуйте еще раз.';
				const confirmCode = '';
				const isDisabled = false;

				if (status === 400) {
					errorMessage = 'Ошибка. Неверный код подтверждения.';
				}

				this.setState({isLoading: false, errorMessage, confirmCode, isDisabled});
			});
	}

	/**
	 * Спрятать модальное окно
	 */
	hideModalDialog() {
		const {hideModal} = this.props;

		const successMessage = '';
		const errorMessage = '';
		const confirmCode = '';
		const isDisabled = false;

		hideModal();

		this.setState({successMessage, errorMessage, confirmCode, isDisabled});
	}

	render() {
		const {isOperationConfirm} = this.props;
		const {confirmCode, userId, isDisabled, isLoading, successMessage, errorMessage} = this.state;

		if (isOperationConfirm) {
			return (
				<Layout>
					<Wrapper>
						<Container>
							<Close onClick={() => this.hideModalDialog()} />

							<Preview>
								<CardImg src='/assets/credit-card.svg' />
							</Preview>

							<Title>Подтвердить операцию</Title>

							<Form onSubmit={(event) => this.onSubmitForm(event)}>
								<NumInput
									name='confirmCode'
									placeholder='Код подтверждения'
									value={confirmCode}
									onChange={(event) => this.onChangeInputValue(event)}
									disabled={isLoading || isDisabled} />

								<UserInput type='hidden' name='userId' value={userId} />

								{isLoading && <Preloader />}
								{!isLoading && !isDisabled && <Submit
									type='submit'
									style="display: {(isDisabled) ? 'none' : 'block'}">
										Подтвердить
								</Submit>}
								{successMessage && <Success>{successMessage}</Success>}
								{errorMessage && <Error>{errorMessage}</Error>}
							</Form>
						</Container>
					</Wrapper>
				</Layout>
			);
		}

		return false;
	}
}

ConfirmOperation.propTypes = {
	user: PropTypes.object.isRequired,
	isOperationConfirm: PropTypes.bool.isRequired,
	hideModal: PropTypes.func.isRequired,
	transaction: PropTypes.object.isRequired
};

export default ConfirmOperation;
