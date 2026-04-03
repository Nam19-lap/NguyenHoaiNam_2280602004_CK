import { useAppContext } from "../store/AppContext.jsx";

export const useAuth = () => {
  const { auth } = useAppContext();

  return {
    isAuthenticated: Boolean(auth?.accessToken && auth?.user),
    user: auth?.user
  };
};
