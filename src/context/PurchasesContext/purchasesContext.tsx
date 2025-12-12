import {createContext, useReducer} from 'react';
import {purchasesReducer} from './purchasesReducer';
import {dataForVerifySubscription} from '../../interfaces/interfacesApp';
import {privateDBForIAP} from '../../db/db';
import {err} from 'react-native-svg/lib/typescript/xml';
import {Axios, AxiosError} from 'axios';

interface PurchasesContextProps {
  verifySubscription: (
    data: dataForVerifySubscription,
  ) => Promise<{message: string; res: any}>;
}
export const PurchasesContext = createContext<PurchasesContextProps>(
  {} as PurchasesContextProps,
);

const purchasesInitialState = {
  isConnect: false,
  expires: '',
};

export const PurchasesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(purchasesReducer, purchasesInitialState);

  const verifySubscription = async (data: dataForVerifySubscription) => {
    try {
      console.info('Verifying subscription with data:', data);
      const res = await privateDBForIAP.post('/verify-subscription', {
        productId: data.productId,
        token: data.token,
        platform: data.platform,
        userId: data.userId,
      });
      console.info('Subscription verification response:', res.data);
      return Promise.resolve({
        message: 'Subscription verification response',
        res: res.data,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;
          return Promise.reject({
            message: 'Error verifying subscription RESPONSE',
            error: errorData,
          });
        } else if (error.request) {
          return Promise.reject({
            message: 'Error verifying subscription REQUEST',
            error: error.request,
          });
        } else {
          return Promise.reject({
            message: 'Error verifying subscription IN AXIOSERROR UNKNOWN',
            error: error.message,
          });
        }
      } else {
        return Promise.reject({
          message: 'Error verifying subscription',
          error: 'Unexpected error in the server',
        });
      }
    }
  };
  return (
    <PurchasesContext.Provider value={{verifySubscription}}>
      {children}
    </PurchasesContext.Provider>
  );
};
