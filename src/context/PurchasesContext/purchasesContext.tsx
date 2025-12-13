import {createContext, useReducer} from 'react';
import {purchasesReducer} from './purchasesReducer';
import {
  dataForVerifySubscription,
  VerifySubscriptionResponse,
  statusSuscriptionResponse,
} from '../../interfaces/interfacesApp';
import {privateDBForIAP} from '../../db/db';
import {AxiosError} from 'axios';

interface PurchasesContextProps {
  isConnect: boolean;
  expires: string;
  verifySubscription: (
    data: dataForVerifySubscription,
  ) => Promise<{message: string; res: any}>;
  getStateSuscription: (userId: number) => Promise<{message: string; res: any}>;
}
export const PurchasesContext = createContext<PurchasesContextProps>(
  {} as PurchasesContextProps,
);

const purchasesInitialState = {
  isConnect: false,
  expires: '',
  error: null,
};

export const PurchasesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(purchasesReducer, purchasesInitialState);

  const getStateSuscription = async (userId: number) => {
    try {
      console.info('Getting subscription status for user:', userId);
      const {data} = await privateDBForIAP.get<statusSuscriptionResponse>(
        `/status?userId=${userId}`,
      );

      dispatch({
        type: 'setStateSuscription',
        payload: {
          isConnect: data.isConnect,
          expires: data.expires,
        },
      });

      return Promise.resolve({
        message: 'Subscription status retrieved successfully',
        res: data,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;
          return Promise.reject({
            message: 'Error getting subscription status RESPONSE',
            error: errorData,
          });
        } else if (error.request) {
          return Promise.reject({
            message: 'Error getting subscription status REQUEST',
            error: error.request,
          });
        } else {
          return Promise.reject({
            message: 'Error getting subscription status IN AXIOSERROR UNKNOWN',
            error: error.message,
          });
        }
      } else {
        return Promise.reject({
          message: 'Error getting subscription status',
          error: 'Unexpected error in the server',
        });
      }
    }
  };

  const verifySubscription = async (dataBody: dataForVerifySubscription) => {
    try {
      console.info('Verifying subscription with data:', dataBody);
      const {data} = await privateDBForIAP.post<VerifySubscriptionResponse>(
        '/verify-subscription',
        {
          productId: dataBody.productId,
          token: dataBody.token,
          platform: dataBody.platform,
          userId: dataBody.userId,
        },
      );
      console.info('Subscription verification response:', data);
      dispatch({
        type: 'setStateSuscription',
        payload: {
          isConnect: data.isConnect,
          expires: data.expires,
        },
      });
      return Promise.resolve({
        message: 'Subscription verification response',
        res: data,
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
    <PurchasesContext.Provider
      value={{verifySubscription, getStateSuscription, ...state}}>
      {children}
    </PurchasesContext.Provider>
  );
};
