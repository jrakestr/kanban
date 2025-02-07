import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9', // Primary color
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    gray: {
      50: '#f7fafc', // Light gray
      100: '#f0f2f5',
      200: '#e0e3e7',
      300: '#d0d5dd',
      400: '#c0c4cc',
      500: '#a0a3a9',
      600: '#808389',
      700: '#606266',
      800: '#404244',
      900: '#212325',
    },
    surface: '#ffffff', // Or your desired surface color
    onSurface: '#212325', // Or your desired on-surface color
  },
});

export default theme;
