import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { AiOutlineTool } from 'react-icons/ai';
import {
  FiList,
  FiTag,
  FiUsers,
  FiFileText,
  FiDollarSign,
} from 'react-icons/fi';
import { MdBusiness } from 'react-icons/md';
import { useHistory, useLocation } from 'react-router-dom';

import api from '../services/api';

interface IUser {
  id: string;
  role: 'ADMIN' | 'MANAGER' | 'SELLER' | 'NANOTECH_REPRESENTATIVE';
  profile: {
    id: string;
    company_id: string;
    unit_id: string;
  };
}

interface IAuthState {
  access_token: string;
  refresh_token: string;
  user: IUser;
  buttons: IButton[];
}

interface ISignInCredentials {
  username: string;
  password: string;
}

interface IAuthContextData {
  user: IUser;
  buttons: IButton[];
  signIn(
    credentials: ISignInCredentials,
  ): Promise<{ user: { first_login: boolean } }>;
  signOut(): void;
}

interface IButton {
  name: string;
  enable: boolean;
  route: string;
  icon?: JSX.Element;
}

export const AuthContext = createContext<IAuthContextData>(
  {} as IAuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState<IAuthState>(
    (): IAuthState => {
      const access_token = localStorage.getItem('@TotalClean:access-token');
      const refresh_token = localStorage.getItem('@TotalClean:refresh-token');
      const user = localStorage.getItem('@TotalClean:user');

      if (access_token && refresh_token && user) {
        const userData = JSON.parse(user);

        let buttons: IButton[] = [];

        if (userData.role === 'MANAGER') {
          buttons = [
            {
              name: 'Serviços',
              enable: true,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Registro de vendas',
              enable: true,
              route: '/sales-register',
              icon: <FiDollarSign color="#fff" />,
            },
            {
              name: 'Vendedores',
              enable: true,
              route: '/sellers',
              icon: <FiUsers color="#fff" />,
            },
            {
              name: 'Vendas registradas',
              enable: true,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
            {
              name: 'Relatórios',
              enable: true,
              route: '/reports',
              icon: <FiFileText color="#fff" />,
            },
            {
              name: 'Preços',
              enable: true,
              route: '/prices',
              icon: <FiTag color="#fff" />,
            },
          ];
        }

        if (userData.role === 'ADMIN') {
          buttons = [
            {
              name: 'Concessionárias',
              enable: false,
              route: '/companies',
              icon: <MdBusiness color="#fff" />,
            },
            {
              name: 'Usuários',
              enable: false,
              route: '/users',
              icon: <FiUsers color="#fff" />,
            },
            {
              name: 'Serviços',
              enable: false,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Vendas',
              enable: false,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
            {
              name: 'Relatórios',
              enable: false,
              route: '/reports',
              icon: <FiFileText color="#fff" />,
            },
          ];
        }

        if (userData.role === 'SELLER') {
          buttons = [
            {
              name: 'Serviços',
              enable: false,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Registro de vendas',
              enable: false,
              route: '/sales-register',
              icon: <FiDollarSign color="#fff" />,
            },
            {
              name: 'Vendas',
              enable: false,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
          ];
        }

        return { access_token, refresh_token, user: JSON.parse(user), buttons };
      }

      return {} as IAuthState;
    },
  );

  const signIn = useCallback(async ({ username, password }) => {
    const response = await api.post('/auth/login/', { username, password });

    const { user } = response.data;
    const { access_token, refresh_token } = response.data;
    let buttons: IButton[] = [];

    if (user.role === 'MANAGER') {
      buttons = [
        {
          name: 'Serviços',
          enable: true,
          route: '/services',
          icon: <AiOutlineTool color="#fff" />,
        },
        {
          name: 'Registro de vendas',
          enable: true,
          route: '/sales-register',
          icon: <FiDollarSign color="#fff" />,
        },
        {
          name: 'Vendedores',
          enable: true,
          route: '/sellers',
          icon: <FiUsers colorRendering="#fff" color="#fff" />,
        },
        {
          name: 'Vendas registradas',
          enable: true,
          route: '/sales',
          icon: <FiList color="#fff" />,
        },
        {
          name: 'Relatórios',
          enable: true,
          route: '/reports',
          icon: <FiFileText color="#fff" />,
        },
        {
          name: 'Preços',
          enable: true,
          route: '/prices',
          icon: <FiTag color="#fff" />,
        },
      ];
    }

    if (user.role === 'ADMIN' || user.role === 'NANOTECH_REPRESENTATIVE') {
      buttons = [
        {
          name: 'Concessionárias',
          enable: false,
          route: '/companies',
          icon: <MdBusiness color="#fff" />,
        },
        {
          name: 'Usuários',
          enable: false,
          route: '/users',
          icon: <FiUsers color="#fff" />,
        },
        {
          name: 'Serviços',
          enable: false,
          route: '/services',
          icon: <AiOutlineTool color="#fff" />,
        },
        {
          name: 'Administrar Serviços',
          enable: false,
          route: '/administration-services',
          icon: <FiTag color="#fff" />,
        },
        {
          name: 'Vendas',
          enable: false,
          route: '/sales',
          icon: <FiList color="#fff" />,
        },
        {
          name: 'Relatórios',
          enable: false,
          route: '/reports',
          icon: <FiFileText color="#fff" />,
        },
      ];
    }

    if (user.role === 'SELLER') {
      buttons = [
        {
          name: 'Serviços',
          enable: false,
          route: '/services',
          icon: <AiOutlineTool color="#fff" />,
        },
        {
          name: 'Registro de vendas',
          enable: false,
          route: '/sales-register',
          icon: <FiDollarSign color="#fff" />,
        },
        {
          name: 'Vendas',
          enable: false,
          route: '/sales',
          icon: <FiList color="#fff" />,
        },
      ];
    }

    localStorage.setItem('@TotalClean:access-token', access_token);
    localStorage.setItem('@TotalClean:refresh-token', refresh_token);
    localStorage.setItem('@TotalClean:user', JSON.stringify(user));

    setData({ access_token, refresh_token, user, buttons });
    return response.data;
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem('@TotalClean:access-token');
    localStorage.removeItem('@TotalClean:refresh-token');
    localStorage.removeItem('@TotalClean:user');

    setData({} as IAuthState);
  }, []);

  useEffect(() => {
    const access_token = localStorage.getItem('@TotalClean:access-token');
    const refresh_token = localStorage.getItem('@TotalClean:refresh-token');
    const user = localStorage.getItem('@TotalClean:user');

    if (!access_token || !refresh_token || !user) {
      if (location.pathname !== '/') {
        history.replace('/');
      }
      return;
    }

    if (
      location.pathname === '/' ||
      location.pathname === '/login' ||
      location.pathname === '/app'
    ) {
      history.replace('/services');
    }

    if (!access_token || !refresh_token || !user) {
      history.replace('/');

      signOut();
      return;
    }

    api
      .get('/users/get-profile')
      .then(response => {
        const userData = response.data;

        let buttons;

        if (userData.role === 'MANAGER') {
          buttons = [
            {
              name: 'Serviços',
              enable: true,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Registro de vendas',
              enable: true,
              route: '/sales-register',
              icon: <FiDollarSign color="#fff" />,
            },
            {
              name: 'Vendedores',
              enable: true,
              route: '/sellers',
              icon: <FiUsers color="#fff" />,
            },
            {
              name: 'Vendas registradas',
              enable: true,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
            {
              name: 'Relatórios',
              enable: true,
              route: '/reports',
              icon: <FiFileText color="#fff" />,
            },
            {
              name: 'Preços',
              enable: true,
              route: '/prices',
              icon: <FiTag color="#fff" />,
            },
          ];
        }

        if (
          userData.role === 'ADMIN' ||
          userData.role === 'NANOTECH_REPRESENTATIVE'
        ) {
          buttons = [
            {
              name: 'Concessionárias',
              enable: false,
              route: '/companies',
              icon: <MdBusiness color="#fff" />,
            },
            {
              name: 'Usuários',
              enable: false,
              route: '/users',
              icon: <FiUsers color="#fff" />,
            },
            {
              name: 'Serviços',
              enable: false,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Vendas',
              enable: false,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
            {
              name: 'Relatórios',
              enable: false,
              route: '/reports',
              icon: <FiFileText color="#fff" />,
            },
          ];
        }

        if (userData.role === 'SELLER') {
          buttons = [
            {
              name: 'Serviços',
              enable: false,
              route: '/services',
              icon: <AiOutlineTool color="#fff" />,
            },
            {
              name: 'Registro de vendas',
              enable: false,
              route: '/sales-register',
              icon: <FiDollarSign color="#fff" />,
            },
            {
              name: 'Vendas',
              enable: false,
              route: '/sales',
              icon: <FiList color="#fff" />,
            },
          ];
        }

        if (!buttons) {
          return;
        }

        localStorage.setItem('@TotalClean:user', JSON.stringify(userData));

        setData({
          access_token,
          refresh_token,
          user: userData,
          buttons,
        });
      })
      .catch(() => signOut());
  }, [signOut, location, history]);

  return (
    <AuthContext.Provider
      value={{ user: data.user, buttons: data.buttons, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
