export function signInRequest(login, senha, device) {
  return {
    type: '@auth/SIGN_IN_REQUEST',
    payload: { login, senha, device },
  };
}

export function signInSuccess(token, user, advs) {
  return {
    type: '@auth/SIGN_IN_SUCCESS',
    payload: { token, user, advs },
  };
}

export function loadingStart() {
  return {
    type: '@auth/LOADGIN_START',
  };
}

export function loadingEnd() {
  return {
    type: '@auth/LOADGIN_END',
  };
}

export function signOut() {
  return {
    type: '@auth/SIGN_OUT',
  };
}

export function changeAdv(adv) {
  return {
    type: '@auth/CHANGE_ADV',
    payload: { adv },
  };
}

export function setAdv(adv) {
  return {
    type: '@auth/SET_ADV',
    payload: { adv },
  };
}

export function changeFinanceFilter(newValue) {
  return {
    type: '@auth/CHANGE_FINANCE_FILTER',
    payload: { newValue },
  };
}

export function refreshDashboard(dashboard) {
  return {
    type: '@auth/REFRESH_DASHBOARD',
    payload: { dashboard },
  };
}

export function loadPesquisasAction(pesquisas) {
  return {
    type: '@auth/LOAD_PESQUISAS',
    payload: { pesquisas },
  };
}

export function loginMessage(message) {
  return {
    type: '@auth/LOGIN_MESSAGE',
    payload: { message }
  };
}
