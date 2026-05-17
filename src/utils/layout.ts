import { Platform, Dimensions } from 'react-native';

export const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 70;
export const BOTTOM_PADDING = TAB_BAR_HEIGHT + 16;

export const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } =
  Dimensions.get('window');