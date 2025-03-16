import React, { useState, useEffect } from "react";
import "./App.css";

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";


// hooks
import { useAuthentication } from "./hooks/useAuthentication";

// pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Post from "./pages/Post/Post";
import CreatePost from "./pages/CreatePost/CreatePost";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashbord";
import EditPost from "./pages/EditPost/EditPost";

// components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// context
import { AuthProvider } from "./contexts/AuthContext";


<BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  {/* Seu código de rotas aqui */}
</BrowserRouter>;


const auth = getAuth();

function App() {
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);  // Novo estado de carregamento
  const { auth } = useAuthentication();

  useEffect(() => {
    if (!auth) return; // ✅ Evita tentar acessar `auth` se estiver `null` ou `undefined`.
  
    // 🔹 Firebase está desativado temporariamente, então não chamamos `onAuthStateChanged`
    setLoading(false); // ✅ Simula que o carregamento foi concluído.
  
    return () => {}; // ✅ Não tenta chamar `unsubscribe`, pois ele não foi definido.
  }, [auth]);  
  
  if (loading) {
    return <p>Carregando...</p>;
  }
  

  return (
    <div className="App">
      <AuthProvider value={{ user }}>
        <BrowserRouter>
          <Navbar />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/posts/create" element={user ? <CreatePost /> : <Navigate to="/login" />} />
              <Route path="/posts/edit/:id" element={user ? <EditPost /> : <Navigate to="/login" />} />
              <Route path="/posts/:id" element={<Post />} />
              <Route path="/search" element={<Search />} />
              <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
              <Route path="/register" element={!user ? <Register /> : <Navigate to="/" />} />
              <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/login" />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
}

export default App;
