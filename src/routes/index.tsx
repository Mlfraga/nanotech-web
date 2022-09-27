import React from 'react';
import { Switch } from 'react-router-dom';

import Companies from '../pages/Companies';
import CompaniesPrices from '../pages/CompaniesPrices';
import CompaniesRegister from '../pages/CompaniesRegister';
import FirstLogin from '../pages/FirstLogin';
import Login from '../pages/Login';
import NotFound from '../pages/NotFound';
import Reports from '../pages/Reports';
import Sales from '../pages/Sales';
import SalesRegister from '../pages/SalesRegister';
import Sellers from '../pages/Sellers';
import SellersRegister from '../pages/SellersRegister';
import Services from '../pages/Services';
import Service from '../pages/Services/Vitrificação';
import ServicesRegister from '../pages/ServicesRegister';
import SetCompanyFirstPrices from '../pages/SetCompanyFirstPrices';
import UnitiesRegister from '../pages/UnitiesRegister';
import UpdateCompanyPrices from '../pages/UpdateCompanyPrices';
import Users from '../pages/UsersByCompanies';
import UsersRegister from '../pages/UsersRegister';
import Route from './Route';

const Routes: React.FC = () => (
  <Switch>
    <Route path="/" exact component={Login} />
    <Route path="/home" exact component={Login} />
    <Route path="/first-login" component={FirstLogin} isPrivate />
    <Route path="/services" component={Services} isPrivate />
    <Route path="/service/vitrificacao" component={Service} isPrivate />
    <Route
      path="/services-register/:company_id"
      component={ServicesRegister}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/set-prices"
      component={SetCompanyFirstPrices}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sales-register"
      component={SalesRegister}
      isPrivate
      permissions={['MANAGER', 'SELLER']}
    />
    <Route
      path="/sellers"
      component={Sellers}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sellers-register"
      component={SellersRegister}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/sales"
      component={Sales}
      isPrivate
      permissions={['MANAGER', 'SELLER', 'ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/prices"
      component={UpdateCompanyPrices}
      isPrivate
      permissions={['MANAGER']}
    />
    <Route
      path="/companies"
      component={Companies}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      exact
      path="/company/prices/:id"
      component={CompaniesPrices}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/companies-register"
      component={CompaniesRegister}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/unities-register"
      component={UnitiesRegister}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/users"
      component={Users}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />
    <Route
      path="/users-register"
      component={UsersRegister}
      isPrivate
      permissions={['ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />

    <Route
      path="/reports"
      component={Reports}
      isPrivate
      permissions={['MANAGER', 'ADMIN', 'NANOTECH_REPRESENTATIVE']}
    />

    <Route path="*" component={NotFound} exact />
  </Switch>
);

export default Routes;
