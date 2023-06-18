import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Routes } from 'react-router-dom';
import WalletComponent from './Components/ConnectWallet'
import LandingPage from './Components/LandingPage/LandingPageComp';
import PostList from './Components/PostList/PostListComp';
import PostUploadForm from './Components/PostUpload/PostUploadComp';
import { MyProvider } from './Components/Context';
import Header from './Components/Header/HeaderComp';

function App() {
  const handlePostUpload = () => {
    // Update the PostList component by re-rendering it
    // after a new post is uploaded
    window.location.reload();
  };
  return (
    <div>
      <MyProvider>
        <Header></Header>
        <Router>
          
          <Routes>
            <Route path="/" element={<LandingPage></LandingPage>}></Route>
            {/* <Route path="/signup" element={<WalletComponent></WalletComponent>}></Route> */}
            <Route path="/upload" element={<PostUploadForm></PostUploadForm>}></Route>
            <Route path="/feed" element={<PostList></PostList>}></Route>
          </Routes>
        </Router>
      </MyProvider>
    </div>
  );
}

export default App;
