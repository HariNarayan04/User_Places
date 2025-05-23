import { useState, useCallback, useEffect } from "react";

let logoutTimer
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [tokenExpirationDate, setTokenExpirationDate] = useState();
  const [userID, setUserID] = useState(false);

  const login = useCallback((uid, token, expiration) => {
    setToken(token);
    const tokenExpirationDate = expiration || new Date(new Date().getTime() + 1000*60*60);
    setTokenExpirationDate(tokenExpirationDate);
    localStorage.setItem('userData',
      JSON.stringify({userId : uid,
        token : token,
        expiration : tokenExpirationDate.toISOString() 
      })); 
    setUserID(uid);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setTokenExpirationDate(null);
    setUserID(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
      login(storedData.userId, storedData.token, new Date(storedData.expiration));
    }
  },[login]);

  useEffect(() => {
    if(token && tokenExpirationDate){
      const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    }
    else{
      clearTimeout(logoutTimer);
    }
  },[token, logout, tokenExpirationDate]);
 
  return { token, login, logout, userID };
}