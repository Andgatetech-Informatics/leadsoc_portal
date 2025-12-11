// 🌐 External Imports
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


// 🧩 Internal  Imports
import AppRouter from "./router/Router";
import Loading from "./components/Loading";
import { initializeAuth } from "./utils/auth";
import "./App.css";

const App = () => {
  const dispatch = useDispatch();

  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    initializeAuth({ dispatch, setIsAuth, setLoading, setError });
  }, [dispatch]);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="App text-red-600 p-4">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="App">
      <AppRouter isAuth={isAuth} />
      <ToastContainer />
    </div>
  );
};

export default App;
