import produce from 'immer';

const INITIAL_STATE = {
  lastReceived: null,
  lastAction: '@EMPTY',
};

export default function notification(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@notification/SET_LAST_RECEIVED': {
        let data = action.payload.notification?.content?.data || action.payload.notification
        draft.lastReceived = data;
        draft.lastAction = data?.action || '@EMPTY';
        break;
      }
      case '@notification/CLEAR_LAST_RECEIVED': {
        draft.lastReceived = null;
        draft.lastAction = '@EMPTY';
        break;
      }
      default: {
        break;
      }
    }
  });
}
