import {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

const AuthContext =
  createContext();

export const AuthProvider = ({
  children,
}) => {

  const [user, setUser] =
    useState(null);

  const [token, setToken] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  /**
   * LOAD USER FROM LOCAL STORAGE
   */
  useEffect(() => {

    const savedToken =
      localStorage.getItem(
        'token'
      );

    const savedUser =
      localStorage.getItem(
        'user'
      );

    if (
      savedToken &&
      savedUser
    ) {

      setToken(savedToken);

      setUser(
        JSON.parse(savedUser)
      );
    }

    setLoading(false);

  }, []);

  /**
   * LOGIN FUNCTION
   */
  const login = (
    userData,
    userToken
  ) => {

    setUser(userData);

    setToken(userToken);

    localStorage.setItem(
      'token',
      userToken
    );

    localStorage.setItem(
      'user',
      JSON.stringify(userData)
    );
  };

  /**
   * LOGOUT FUNCTION
   */
  const logout = () => {

    setUser(null);

    setToken(null);

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
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
        isAuthenticated:
          !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * CUSTOM HOOK
 */
export const useAuth = () =>
  useContext(AuthContext);