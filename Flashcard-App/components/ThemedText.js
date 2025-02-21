import { Text, StyleSheet } from 'react-native';
import styles from '@/assets/styles';

export function ThemedText({
  style,
  type = 'default',
  ...rest
}) {

  return (
    <Text
      style={[
        type === 'default' ? styles.defaultText : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'defaultBold' ? styles.defaultBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        style,
      ]}
      {...rest}
    />
  );
}