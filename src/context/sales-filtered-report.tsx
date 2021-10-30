import React, { createContext, useCallback, useContext, useState } from 'react';

interface ISales {
  id: string;
  availabilityDate: string;
  deliveryDate: string;
  status: string;
  companyPrice: number;
  costPrice: number;
  comments: string;
  seller: {
    name: string;
    company: {
      id: string;
      name: string;
      telephone: string;
      cnpj: string;
    };
  };
  person: {
    name: string;
  };
  car: {
    car: string;
    carPlate: string;
  };
  serviceSale: Array<{
    id: string;
    service: {
      id: string;
      name: string;
      price: number;
    };
  }>;
}

interface IFilters {
  company?: string;
  period?: string;
  service: string;
}

interface ISalesFilteredReportContextData {
  sales?: ISales[];
  filters: IFilters;
  setSalesFilteredReport(newSales: ISales[]): void;
  setReportFilters(newFilters: IFilters): void;
}

const SalesFilteredReportContext = createContext<ISalesFilteredReportContextData>(
  {} as ISalesFilteredReportContextData,
);

export const SalesFilteredReportProvider: React.FC = ({ children }) => {
  const [sales, setSales] = useState<ISales[]>([]);
  const [filters, setFilters] = useState<IFilters>({} as IFilters);

  const setSalesFilteredReport = useCallback((newSales: ISales[]) => {
    setSales(newSales);
  }, []);

  const setReportFilters = useCallback((newFilters: IFilters) => {
    setFilters(newFilters);
  }, []);

  return (
    <SalesFilteredReportContext.Provider
      value={{
        sales,
        filters,
        setSalesFilteredReport,
        setReportFilters,
      }}
    >
      {children}
    </SalesFilteredReportContext.Provider>
  );
};

export function useSalesFilteredReport(): ISalesFilteredReportContextData {
  const context = useContext(SalesFilteredReportContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
