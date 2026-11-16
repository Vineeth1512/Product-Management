import React, { useEffect } from "react";
import { BrowserRouter } from "react-router-dom";
import { Provider, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import store from "./redux/store";
import { checkAuthSession } from "./redux/slices/authSlice";
import AppRoutes from "./routes/AppRoutes";

/**
 * Root Application Content with Session Rehydration
 */
const AppContent = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Rehydrate session from /auth/me or stored token on initial page load
    dispatch(checkAuthSession());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            fontSize: "14px",
            borderRadius: "10px",
            padding: "12px 16px",
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
};

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
