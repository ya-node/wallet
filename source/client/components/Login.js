import React, {Component} from 'react';
import styled from 'emotion/react';

const Layout = styled.div`
	position: absolute;
	display: table;
	width: 100%;
	height: 100%;
	padding: 50px;
	top: 0;
	left: 0;
	background: #FFFFFF;
	overflow-y: scroll;
	
	@media(max-width: 767px) {
		padding: 15px;
  	}
`;

const Wrapper = styled.div`
	display: table-cell;
	vertical-align: middle;
`;

const Container = styled.div`
	max-width: 600px;
	margin: 0 auto;
	padding: 50px 60px;
	text-align: center;
	border-radius: 4px;
	background-color: #242424;
	box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.05);
	
	@media(max-width: 640px) {
		padding: 30px 15px;
  	}
`;

const Logo = styled.div`
	width: 147px;
	height: 28px;
	margin-left: auto;
	margin-right: auto;
	margin-bottom: 55px;
	background-image: url('/assets/yamoney-logo.svg');
`;

const Box = styled.div`
	margin-bottom: 55px;
`;

const Title = styled.h1`
	margin-bottom: 40px;
	color: #FFFFFF;
	
	@media(max-width: 640px) {
		font-size: 18px;
	}
`;

const Button = styled.a`
	position: relative;
	display: block;
	max-width: 264px;
	margin-left: auto;
	margin-right: auto;
	padding-left: 18px;
	padding-right: 18px;
	font-size: 20px;
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

const Footer = styled.footer`
	color: rgba(255, 255, 255, 0.2);
	font-size: 15px;
`;

/**
 * Компонент Login
 */
class Login extends Component {
	/**
	 * Конструктор
	 * @param {Object} props свойства компонента Login
	 */
	constructor(props) {
		super(props);

		this.state = {};
	}

	/**
	 * Рендер компонента
	 *
	 * @override
	 * @returns {JSX}
	 */
	render() {
		const clientId = (process.env.NODE_ENV === 'production') ? 'b4570521646841fc9afa4bef1172b9b5' : '1c74c610b26045a7af6a9242a2fe0cb7';
		const authEndPoint = `https://oauth.yandex.ru/authorize?response_type=code&client_id=${clientId}`;

		return (
			<Layout>
				<Wrapper>
					<Container>
						<Logo />

						<Box>
							<Title>Зарегистрируйтесь, <br />чтобы воспользоваться приложением</Title>

							<Button href={authEndPoint}>Войти через Яндекс</Button>
						</Box>

						<Footer>Yamoney Node School</Footer>
					</Container>
				</Wrapper>
			</Layout>
		);
	}
}

export default Login;
