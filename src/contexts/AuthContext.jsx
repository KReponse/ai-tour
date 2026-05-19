import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext = createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // LOAD USER FROM LOCAL STORAGE
  useEffect(() => {

    const savedUser =
      localStorage.getItem('user');

    const savedToken =
      localStorage.getItem('token');

    if (
      savedUser &&
      savedToken
    ) {

      setUser(
        JSON.parse(savedUser)
      );

      setToken(savedToken);
    }

    setLoading(false);

  }, []);

  // LOGIN
  const login = (
    userData,
    userToken
  ) => {

    setUser(userData);

    setToken(userToken);

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );

    localStorage.setItem(
      'token',
      userToken
    );
  };

  // LOGOUT
  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem(
      'user'
    );

    localStorage.removeItem(
      'token'
    );
  };

  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        logout,
      }}
    >

      {children}

    </AuthContext.Provider>
  );
};

export const useAuth = () =>
  useContext(AuthContext);