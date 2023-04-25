import QRGenerator from "./QRGenerator";
import AppContainer from "../components/AppContainer";
import Container from "../components/Container";
import cbiLogo from '../assets/images/CBI Logos-01.svg';
import {AppContainerProvider} from "../context/AppContainerProvider";

const Layout = () => {
    return (
        <AppContainerProvider>
            <AppContainer full base>
                <Container className="header">
                    <div className='logo-wrapper'>
                        <img src={cbiLogo} width={200} height={64} alt="cbi-logo"/>
                    </div>
                </Container>
                {/* <NavLinks/> */}
                <QRGenerator />
                <Container style={{marginBotton: '3em'}} className="footer">
                    <p className='bottom-cbi-text'>
                        Center for Business and Innovation <br/>
                        INSPIRE, INNOVATE, IMMERSE
                    </p>
                </Container>
            </AppContainer>
        </AppContainerProvider>
    )
}

export default Layout;
