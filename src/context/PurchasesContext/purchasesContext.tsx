import {createContext, useEffect, useReducer} from 'react';
import {purchasesReducer} from './purchasesReducer';
import {
  dataForVerifySubscription,
  VerifySubscriptionResponse,
  statusSuscriptionResponse,
} from '../../interfaces/interfacesApp';
import {privateDBForIAP} from '../../db/db';
import {AxiosError} from 'axios';
import {
  endConnection,
  getSubscriptions,
  initConnection,
  type Subscription,
} from 'react-native-iap';
import {Platform} from 'react-native';

interface PurchasesContextProps {
  isConnect: boolean;
  expires: string;
  suscriptions: Subscription[];
  isLoadingSuscritions: boolean;
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
  suscriptions: [],
  isLoadingSuscritions: false,
};

export const PurchasesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(purchasesReducer, purchasesInitialState);
  const ANDROID_SUBSCRIPTION_SKUS = ['sofy_connect_895_1m'];

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

  const fetchSubscriptionDetails = async () => {
    //TODO: Solo intentamos la conexión si estamos en Android, ya que el SKU es de Play Console
    if (Platform.OS !== 'android') {
      console.error(
        'Esta prueba solo es válida para Android con el SKU proporcionado.',
      );

      return;
    }
    dispatch({
      type: 'setLoadingSuscriptions',
      payload: {
        isLoadingSuscritions: true,
      },
    });
    try {
      // 1. Inicializar la conexión con el servicio de facturación
      await initConnection();

      //   console.log('✅ Conexión IAP inicializada correctamente.');

      // 2. Obtener la lista de suscripciones (usando tu SKU)
      const subscriptions = await getSubscriptions({
        skus: ANDROID_SUBSCRIPTION_SKUS,
      });

      if (subscriptions.length > 0) {
        // const subscriptionProduct = subscriptions[0] as SubscriptionAndroid;

        // const offerDetails = subscriptionProduct.subscriptionOfferDetails?.[0];

        // 2. Acceder a la lista de fases de precios y obtener la fase principal (índice 0)
        //    Esta fase contiene el precio real (formattedPrice).
        // const pricePhase = offerDetails?.pricingPhases.pricingPhaseList?.[0];

        // const formattedPrice =
        //   pricePhase?.formattedPrice || 'Precio no encontrado';
        // console.warn(
        //   `Producto encontrado con titulo : ${subscriptions[0].title} descripción: ${subscriptions[0].description} y precio: ${formattedPrice}`,
        // );
        dispatch({
          type: 'setSuscriptions',
          payload: {
            suscriptions: subscriptions,
          },
        });
        // 3. Guardar o mostrar los detalles del producto según sea necesario
        // Por ejemplo, puedes guardarlos en el estado para mostrarlos en la UI
      } else {
        console.error(
          '⚠️ Producto no encontrado. Revisa el SKU o el estado de la app en Play Console.',
        );
      }
    } catch (err) {
      console.error('❌ Error al obtener la suscripción:', err);
      console.error(`Fallo de conexión o producto: ${err.message}`);
    } finally {
      dispatch({
        type: 'setLoadingSuscriptions',
        payload: {
          isLoadingSuscritions: false,
        },
      });
    }
  };

  useEffect(() => {
    console.log(state.isConnect);
  }, [state.isConnect]);

  useEffect(() => {
    console.log(state.suscriptions);
  }, [state.suscriptions]);

  useEffect(() => {
    fetchSubscriptionDetails();
    return () => {
      endConnection();
    };
  }, []);
  return (
    <PurchasesContext.Provider
      value={{verifySubscription, getStateSuscription, ...state}}>
      {children}
    </PurchasesContext.Provider>
  );
};
