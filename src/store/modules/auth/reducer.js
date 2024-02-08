import produce from 'immer';

const INITIAL_STATE = {
  token: null,
  signed: false,
  user: null,
  adv: null,
  loading: false,
  financeFilter: 1,
  dashboard: {},
  pesquisas: [],
  message: '',
};

export default function auth(state = INITIAL_STATE, action) {
  return produce(state, draft => {
    switch (action.type) {
      case '@auth/SIGN_IN_SUCCESS': {
        draft.token = action.payload.token;
        draft.user = action.payload.user;
        draft.adv = null;
        draft.signed = true;
        draft.loading = false;
        break;
      }
      case '@auth/LOADGIN_START': {
        draft.loading = true;
        break;
      }
      case '@auth/LOADGIN_END': {
        draft.loading = false;
        break;
      }
      case '@auth/SIGN_OUT': {
        draft.token = null;
        draft.user = null;
        draft.adv = null;
        draft.signed = false;
        draft.financeFilter = 1;
        draft.dashboard = {};
        break;
      }
      case '@auth/CHANGE_ADV': {
        draft.adv = action.payload.adv;
        break;
      }
      case '@auth/SET_ADV': {
        draft.adv = action.payload.adv;
        break;
      }
      case '@auth/CHANGE_FINANCE_FILTER': {
        draft.financeFilter = action.payload.newValue;
        break;
      }
      case '@auth/REFRESH_DASHBOARD': {
        draft.dashboard = action.payload.dashboard;
        break;
      }
      case '@auth/LOAD_PESQUISAS': {
        draft.pesquisas = action.payload.pesquisas;
        break;
      }
      case '@auth/LOGIN_MESSAGE': {
        draft.message = action.payload.message;
        break;
      }
      default: {
        break;
      }
    }
  });
}
