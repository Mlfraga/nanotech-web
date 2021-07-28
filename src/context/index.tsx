import React from 'react';

import { AuthProvider } from './auth';
import { SalesFilteredReportProvider } from './sales-filtered-report';
import { ToastProvider } from './toast';

const AppProvider: React.FC = ({ children }) => (
  <AuthProvider>
    <SalesFilteredReportProvider>
      <ToastProvider>{children}</ToastProvider>
    </SalesFilteredReportProvider>
  </AuthProvider>
);

export default AppProvider;
