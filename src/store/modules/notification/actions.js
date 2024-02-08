export function setLastReceived(notification) {
  return {
    type: '@notification/SET_LAST_RECEIVED',
    payload: {notification},
  };
}

export function clearLastReceived() {
  return {
    type: '@notification/CLEAR_LAST_RECEIVED',
  };
}
