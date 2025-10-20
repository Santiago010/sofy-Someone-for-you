import {Platform} from 'react-native';

// Variables de colores globales
export const colors = {
  // Colores principales
  primary: '#ff8704', // Rosa/púrpura principal
  secondary: '#2d9fdc', // Azul secundario
  accent: '#ff8704', // Color de acento (igual al primario)

  // Colores de fondo
  background: '#fff', // Fondo principal
  backgroundSecondary: '#f8f8f8',
  surface: '#fff', // Superficie de componentes

  // Colores de texto
  text: '#333', // Texto principal
  textSecondary: '#666', // Texto secundario
  textDisabled: '#999', // Texto deshabilitado

  // Colores de estado
  success: '#4CAF50', // Verde para éxito
  warning: '#FF9800', // Naranja para advertencias
  error: '#F44336', // Rojo para errores

  // Bordes y separadores
  border: '#E0E0E0', // Color de bordes
  divider: '#E0E0E0', // Color de divisores
};

// Estilos comunes reutilizables
export const commonStyles = {
  // Layout principal
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBotton: 20,
    paddingTop: Platform.OS === 'ios' ? 100 : 20,
  },

  // Títulos y textos
  title: {
    textAlign: 'center' as const,
    marginBottom: 40,
    fontWeight: 'bold' as const,
    color: colors.text,
  },

  subtitle: {
    textAlign: 'center' as const,
    marginBottom: 40,
    color: colors.textSecondary,
    lineHeight: 24,
  },

  // Campos de formulario
  field: {
    marginBottom: 20,
  },

  fieldLarge: {
    marginBottom: 30,
  },

  label: {
    marginBottom: 8,
    color: colors.text,
  },

  input: {
    backgroundColor: colors.background,
  },

  inputOutline: {
    borderRadius: 8,
  },

  // Layout de nombres (para Register)
  nameContainer: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 20,
  },

  nameField: {
    flex: 0.48,
  },

  // Contenedor de contraseña con enlace "Forgot"
  passwordContainer: {
    marginBottom: 30,
  },

  forgotPassword: {
    textAlign: 'right' as const,
    marginTop: 8,
    color: colors.textSecondary,
  },

  // Botones principales
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    marginBottom: 20,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },

  // Botones secundarios (outlined)
  secondaryButton: {
    borderColor: colors.secondary,
    borderRadius: 25,
  },

  secondaryButtonText: {
    color: colors.secondary,
    fontSize: 14,
  },

  // Contenedor de botones adicionales (para Login)
  additionalButtons: {
    flexDirection: 'row' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 30,
  },

  outlinedButton: {
    flex: 0.48,
    borderColor: colors.secondary,
    borderRadius: 25,
  },

  outlinedButtonText: {
    color: colors.secondary,
    fontSize: 14,
  },

  // Footer y enlaces
  footer: {
    alignItems: 'center' as const,
  },

  footerText: {
    color: colors.textSecondary,
  },

  link: {
    color: colors.primary,
    fontWeight: 'bold' as const,
  },

  // Estilos específicos para botones de acción
  resetButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    marginBottom: 30,
  },

  resetButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },

  signUpButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    marginBottom: 30,
  },

  signUpButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },

  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    paddingVertical: 8,
    marginBottom: 20,
  },

  loginButtonText: {
    fontSize: 16,
    fontWeight: 'bold' as const,
  },
};

// Tipos para TypeScript
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textDisabled: string;
  success: string;
  warning: string;
  error: string;
  border: string;
  divider: string;
}

export interface CommonStyles {
  container: any;
  content: any;
  title: any;
  subtitle: any;
  field: any;
  fieldLarge: any;
  label: any;
  input: any;
  inputOutline: any;
  nameContainer: any;
  nameField: any;
  passwordContainer: any;
  forgotPassword: any;
  primaryButton: any;
  primaryButtonText: any;
  secondaryButton: any;
  secondaryButtonText: any;
  additionalButtons: any;
  outlinedButton: any;
  outlinedButtonText: any;
  footer: any;
  footerText: any;
  link: any;
  resetButton: any;
  resetButtonText: any;
  signUpButton: any;
  signUpButtonText: any;
  loginButton: any;
  loginButtonText: any;
  sliderTouchable: any;
  slider: any;
  sliderDebug: any;
  sliderInfo: any;
  sliderInfoText: any;
}
