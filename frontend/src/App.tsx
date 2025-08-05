import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Map from './pages/Map';
import PhotoSpots from './pages/PhotoSpots';
import PhotoSpotDetail from './pages/PhotoSpotDetail';
import WritePost from './pages/WritePost';
import PostDetail from './pages/PostDetail';
import Weather from './pages/Weather';
import MyPage from './pages/MyPage';
import Best from './pages/Best';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/map" element={<Map />} />
              <Route path="/best" element={<Best />} />
              <Route path="/photo-spots" element={<PhotoSpots />} />
              <Route path="/photo-spots/:region" element={<PhotoSpots />} />
              <Route path="/spot/:spotId" element={<PhotoSpotDetail />} />
              <Route path="/write/:spotId" element={<WritePost />} />
              <Route path="/post/:postId" element={<PostDetail />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/mypage" element={<MyPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
