import { useEffect } from 'react';

export function useKeyDown(keys: readonly string[], onPress: () => void) {
  useEffect(
    function listenForKeys() {
      function pressWhenKeyMatches(event: KeyboardEvent) {
        if (keys.includes(event.key)) {
          onPress();
        }
      }

      window.addEventListener('keydown', pressWhenKeyMatches);

      return function stopListeningForKeys() {
        window.removeEventListener('keydown', pressWhenKeyMatches);
      };
    },
    [keys, onPress],
  );
}
