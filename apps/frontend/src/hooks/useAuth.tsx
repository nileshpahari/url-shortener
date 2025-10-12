import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";

interface User {
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  authLoading: boolean;
  getUser(): Promise<void>;
  login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<void>;
  register({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }): Promise<void>;
  updatePassword({
    newPassword,
    oldPassword,
  }: {
    newPassword: string;
    oldPassword: string;
  }): Promise<void>;
  deleteUser({ password }: { password: string }): Promise<void>;
  logout(): Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  authLoading: false,
  getUser: async () => {},
  login: async () => {},
  register: async () => {},
  updatePassword: async () => {},
  deleteUser: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(false);

  const getUser = async () => {
    try {
      setAuthLoading(true);
      const res = await axios.get(`${API_BASE_URL}/user/current-user`);
      const userData = res.data.user;
      setUser(userData);
    } catch (err) {
      setUser(null);
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to fetch user details");
        console.log("Unexpected error: ", err);
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const login = async ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => {
    try {
      await axios.post(`${API_BASE_URL}/user/login`, {
        email,
        password,
      });
      getUser();
    } catch (err) {
      setUser(null);
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to Login");
        console.log("Unexpected error: ", err);
      }
    }
  };

  const register = async ({
    email,
    password,
    fullName,
  }: {
    email: string;
    password: string;
    fullName: string;
  }) => {
    try {
      await axios.post(`${API_BASE_URL}/user/register`, {
        email,
        password,
        fullName,
      });
      getUser();
    } catch (err) {
      setUser(null);
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to register");
        console.log("Unexpected error: ", err);
      }
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_BASE_URL}/user/logout`);
      setUser(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to logout");
        console.log("Unexpected error: ", err);
      }
    }
  };

  const deleteUser = async ({ password }: { password: string }) => {
    try {
      await axios.delete(`${API_BASE_URL}/user/delete-user`, { data: { password } });
      setUser(null);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to delete the user");
        console.log("Unexpected error: ", err);
      }
    }
  };

  const updatePassword = async ({
    newPassword,
    oldPassword,
  }: {
    newPassword: string;
    oldPassword: string;
  }) => {
    try {
      await axios.patch(`${API_BASE_URL}/user/update-password`, {
        newPassword,
        oldPassword,
      });
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const mssg = err.response?.data.mssg;
        toast(mssg);
        console.error(mssg);
      } else {
        toast("Failed to change the password");
        console.log("Unexpected error: ", err);
      }
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        authLoading,
        login,
        register,
        logout,
        getUser,
        updatePassword,
        deleteUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = ()=>useContext(AuthContext);
