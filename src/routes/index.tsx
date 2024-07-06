import React from 'react';
import { Switch } from 'react-router-dom';

import Companies from '../pages/Companies';
import CompaniesPrices from '../pages/CompaniesPrices';
import FirstLogin from '../pages/FirstLogin';
import Login from '../pages/Login';
import ProviderSales from '../pages/ProviderSales';
import Reports from '../pages/Reports';
import Sales from '../pages/Sales';
import SalesRegister from '../pages/SalesRegister';
import Sellers from '../pages/Sellers';
import SellersRegister from '../pages/SellersRegister';
import Services from '../pages/Services';
import Service from '../pages/Services/Vitrificação';
import SetCompanyFirstPrices from '../pages/SetCompanyFirstPrices';
import UpdateCompanyPrices from '../pages/UpdateCompanyPrices';
import Users from '../pages/Users';
import Route from './Route';
import Layout from '../components/Layout';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={() => <Login />} />
    <Route
      path="/home"
      exact
      component={() => (
        <Layout>
          <Login />
        </Layout>
      )}
    />
    <Route
      path="/first-login"
      component={() => (
        <Layout>
          <FirstLogin />
        </Layout>
      )}
      isPrivate
    />
    <Route
      path="/rewards"
      component={() => (
        <Layout>
          deprecated route
          {/* <Rewards /> */}
        </Layout>
      )}
      isPrivate
      permissions={['COMMISSIONER', 'MANAGER', 'ADMIN']}
    />
    <Route
      path="/services"
      component={() => (
        <Layout>
          <Services />
        </Layout>
      )}
      isPrivate
      permissions={[
        'MANAGER',
        'SELLER',
        'ADMIN',
        'NANOTECH_REPRESENTATIVE',
        'COMMISSIONER',
      ]}
    />
    <Route
      path="/service/vitrificacao"
      component={() => (
        <Layout>
          <Service />
        </Layout>
      )}
      isPrivate
    />
    <Route
      path="/set-prices"
      component={() => (
        <Layout>
          <SetCompanyFirstPrices />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sales-register"
      component={() => (
        <Layout>
          <SalesRegister />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER', 'SELLER']}
    />
    <Route
      path="/sellers"
      component={() => (
        <Layout>
          <Sellers />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sellers-register"
      component={() => (
        <Layout>
          <SellersRegister />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sales"
      component={() => (
        <Layout>
          <Sales />
        </Layout>
      )}
      isPrivate
      permissions={[
        'MANAGER',
        'SELLER',
        'ADMIN',
        'NANOTECH_REPRESENTATIVE',
        'COMMISSIONER',
      ]}
    />
    <Route
      path="/sales-by-provider"
      component={() => (
        <Layout>
          <ProviderSales />
        </Layout>
      )}
      isPrivate
      permissions={['SERVICE_PROVIDER']}
    />
    <Route
      path="/prices"
      component={() => (
        <Layout>
          <UpdateCompanyPrices />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/companies"
      component={() => (
        <Layout>
          <Companies />
        </Layout>
      )}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      exact
      path="/company/prices/:id"
      component={() => (
        <Layout>
          <CompaniesPrices />
        </Layout>
      )}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/users"
      component={() => (
        <Layout>
          <Users />
        </Layout>
      )}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/reports"
      component={() => (
        <Layout>
          <Reports />
        </Layout>
      )}
      isPrivate
      permissions={['MANAGER', 'ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
  </Switch>
);

export default Routes;
