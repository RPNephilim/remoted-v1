import About from "../components/About";
import Login from "../components/Login";
import './css/HomePage.css'

function HomePage() {
    return(
        <>
            <div className="homePage">
                <About/>
                <Login/>
            </div>
        </>
    );
}

export default HomePage;