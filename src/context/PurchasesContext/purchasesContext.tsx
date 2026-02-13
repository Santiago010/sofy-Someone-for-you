import {createContext, useContext, useEffect, useReducer} from 'react';
import {purchasesReducer} from './purchasesReducer';
import {
  dataForVerifySubscription,
  VerifySubscriptionResponse,
  statusSuscriptionResponse,
  dataForVerifyProduct,
  ResVerifyProduct,
  ConsumeResponse,
  ResBalanceProducts,
} from '../../interfaces/interfacesApp';
import {privateDBForIAP} from '../../db/db';
import {AxiosError} from 'axios';
import {
  endConnection,
  getProducts,
  getSubscriptions,
  initConnection,
  Product,
  type Subscription,
} from 'react-native-iap';
import {Platform} from 'react-native';
import {AuthContext} from '../authContext/authContext';
import { emojiForPlatform } from '../../helpers/emojiForPlatform';

interface PurchasesContextProps {
  isConnect: boolean;
  expires: string;
  suscriptions: Subscription[];
  products: Product[];
  isLoadingProducts: boolean;
  isLoadingSuscritions: boolean;
  amountOfCompliments: number;
  amountOfSuperLikes: number;
  verifyProduct: (
    dataResProduct: dataForVerifyProduct,
  ) => Promise<{message: string; res: any}>;
  verifySubscription: (
    data: dataForVerifySubscription,
  ) => Promise<{message: string; res: any}>;
  getStateSuscription: (userId: number) => Promise<{message: string; res: any}>;
  consume: (
    userId: number,
    field: 'compliments' | 'superlikes',
  ) => Promise<ConsumeResponse>;
  getBalanceProducts: (userId: number) => Promise<void>;
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
  products: [],
  isLoadingProducts: false,
  amountOfCompliments: 0,
  amountOfSuperLikes: 0,
};

export const PurchasesProvider = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) => {
  const [state, dispatch] = useReducer(purchasesReducer, purchasesInitialState);
  const ANDROID_SUBSCRIPTION_SKUS = ['sofy_connect_895_1m'];
  const IOS_SUBSCRIPTION_SKUS = ['rt_899_1m'];
  // Definimos tus nuevos SKUs
  const ANDROID_PRODUCT_SKUS = [
    'sofy_product_superlike_01',
    'sofy_product_superlike_2',
    'sofy_product_superlike_03',
    'sofy_product_compliment_01',
    'sofy_product_compliment_02',
    'sofy_compliments_03',
  ];

  const IOS_PRODUCT_SKUS = [
    'sofy_product_compliment_01', // 5 Compliments
    'sofy_product_compliment_02', // 10 Compliments
    'sofy_product_compliment_03', // 15 Compliments
    'sofy_product_superlike_01',  // 5 Super Like
    'sofy_product_superlike_02',  // 10 Super Like
    'sofy_product_superlike_03',  // 15 Super Like
  ]

  const {status, access_token, transactionId} = useContext(AuthContext);

  const getBalanceProducts = async (userId: number) => {
    try {
      const {data} = await privateDBForIAP.get<ResBalanceProducts>(
        `/balance/${userId}`,
      );

      setAmountProducts(data.superlikes, data.compliments);
    } catch (error) {
      console.error('Error getting balance of products:', error);
    }
  };

  const getStateSuscription = async (userId: number) => {
    try {
      console.info(emojiForPlatform(), 'Verificando suscripción para el usuario:', userId);
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

  const setAmountProducts = (superlikes: number, compliments: number) => {
    dispatch({
      type: 'setAmountProducts',
      payload: {
        superlikes,
        compliments,
      },
    });
  };

  const giveAmountOfProducts = ({message, res}: ResVerifyProduct) => {
    const {addedAmount, newBalance, productId} = res;

    if (productId.includes('compliment') || productId.includes('compliments')) {
      dispatch({type: 'setAmountOfCompliments', payload: newBalance});
    } else if (productId.includes('superlike')) {
      dispatch({type: 'setAmountOfSuperLikes', payload: newBalance});
    }

  };

  const consume = async (
    userId: number,
    field: 'compliments' | 'superlikes',
  ) => {
    try {
      const {data} = await privateDBForIAP.post<ConsumeResponse>('/consume/', {
        userId: userId.toString(),
        field,
      });

      giveAmountOfProducts({
        message: data.message,
        res: {
          addedAmount: -1,
          newBalance: data.newBalance,
          productId: field,
        },
      });

      return Promise.resolve(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;
          return Promise.reject({
            message: 'Error consuming product RESPONSE',
            error: errorData,
          });
        } else if (error.request) {
          return Promise.reject({
            message: 'Error consuming product REQUEST',
            error: error.request,
          });
        } else {
          return Promise.reject({
            message: 'Error consuming product IN AXIOSERROR UNKNOWN',
            error: error.message,
          });
        }
      } else {
        return Promise.reject({
          message: 'Error consuming product',
          error: 'Unexpected error in the server',
        });
      }
    }
  };

  const verifyProduct = async (dataResProduct: dataForVerifyProduct) => {
    console.log({
        origin :'purchaseContext verifyProduct',
      platform: emojiForPlatform(),
      productId: dataResProduct.productId,
      userId: dataResProduct.userId,
    });
    try {
      const {data} = await privateDBForIAP.post<ResVerifyProduct>(
        '/verify-product',
        {
          productId: dataResProduct.productId,
          token: dataResProduct.token,
          platform: dataResProduct.platform,
          userId: dataResProduct.userId,
        },
      );
      giveAmountOfProducts(data);

      return Promise.resolve({
        message: 'Product verified and accredited correctly',
        res: data.res,
      });
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response) {
          const errorData = error.response.data;
          return Promise.reject({
            message: 'Error verifying product RESPONSE',
            error: errorData,
          });
        } else if (error.request) {
          return Promise.reject({
            message: 'Error verifying product REQUEST',
            error: error.request,
          });
        } else {
          return Promise.reject({
            message: 'Error verifying product IN AXIOSERROR UNKNOWN',
            error: error.message,
          });
        }
      } else {
        return Promise.reject({
          message: 'Error verifying product',
          error: 'Unexpected error in the server',
        });
      }
    }
  };

  const verifySubscription = async (dataBody: dataForVerifySubscription) => {
    try {
        // TODO:2 LOG
      console.info('Verifying subscription with data:');
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

  const fetchProducts = async () => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return;

    dispatch({type: 'setLoadingProducts', payload: true});

    try {
      // 1. Nos aseguramos de que la conexión esté abierta
      // await initConnection();

      // 2. Usamos getProducts para productos únicos (NO suscripciones)
      const itemSkus =
        Platform.OS === 'android' ? ANDROID_PRODUCT_SKUS : IOS_PRODUCT_SKUS;

      const items: Product[] = await getProducts({
        skus: itemSkus,
      });

      if (items.length > 0) {
        dispatch({
          type: 'setProducts',
          payload: items,
        });
      }
    } catch (err) {
      console.error('❌ Error al obtener productos únicos:', err);
    } finally {
      dispatch({type: 'setLoadingProducts', payload: false});
    }
  };

  const fetchSubscriptionDetails = async () => {
    //TODO: Solo intentamos la conexión si estamos en Android, ya que el SKU es de Play Console
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') {
      console.error(
        'Esta prueba solo es válida para Android y iOS con el SKU proporcionado.',
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
      // await initConnection();

      //   console.log('✅ Conexión IAP inicializada correctamente.');

      // 2. Obtener la lista de suscripciones (usando tu SKU)
      const skus =
        Platform.OS === 'android'
          ? ANDROID_SUBSCRIPTION_SKUS
          : IOS_SUBSCRIPTION_SKUS;

      const subscriptions = await getSubscriptions({
        skus: skus,
      });

      console.log('✅ Suscripciones obtenidas:', subscriptions.length);

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
    if (status === 'not-authenticated' && !access_token && !transactionId) {
      // Si el usuario no está autenticado, desconectamos la compra
      if (state.isConnect) {
        dispatch({type: 'resetPurchaseState'});
      }
    }
  }, [status, access_token, transactionId, state.isConnect]);

  useEffect(() => {
    const initIAP = async () => {
      try {
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          await initConnection();
          // Hacemos las peticiones de forma secuencial para evitar errores de cancelación
          await fetchSubscriptionDetails();
          await fetchProducts();
        }
      } catch (err) {
        console.error('Error initializing IAP:', err);
      }
    };

    if (!state.isConnect) {
      initIAP();
    }

    return () => {
      endConnection();
    };
  }, [state.isConnect]);
  return (
    <PurchasesContext.Provider
      value={{
        getBalanceProducts,
        verifySubscription,
        getStateSuscription,
        ...state,
        verifyProduct,
        consume,
      }}>
      {children}
    </PurchasesContext.Provider>
  );
};
