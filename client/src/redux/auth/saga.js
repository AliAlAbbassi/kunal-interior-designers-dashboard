import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
// import { auth } from '../../helpers/Firebase';
import {
  accountsPassword,
  accountsClient,
  accountsGraphQL,
} from '../../utils/accounts';
import {
  LOGIN_USER,
  REGISTER_USER,
  LOGOUT_USER,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
} from '../actions';

import {
  loginUserSuccess,
  loginUserError,
  registerUserSuccess,
  registerUserError,
  forgotPasswordSuccess,
  forgotPasswordError,
  resetPasswordSuccess,
  resetPasswordError,
} from './actions';

import { adminRoot } from '../../constants/defaultValues';
import { setCurrentUser, getCurrentUser } from '../../helpers/Utils';

export function* watchLoginUser() {
  yield takeEvery(LOGIN_USER, loginWithEmailPassword);
}

const loginWithEmailPasswordAsync = async (email, password) => {
  try {
    await accountsPassword
      .login({
        user: {
          email,
        },
        password,
      })
      .then((user) => user)
      .catch((err) => err);
  } catch (err) {
    return err.message;
  }
};

function* loginWithEmailPassword({ payload }) {
  const { email, password } = payload.user;
  const { history } = payload;
  try {
    const loginUser = yield call(loginWithEmailPasswordAsync, email, password);
    if (!loginUser.message) {
      const item = {
        uid: loginUser.user.id,
        id: loginUser.user.id,
        name: loginUser.user.firstName,
        ...getCurrentUser(),
      };
      setCurrentUser(item);
      yield put(loginUserSuccess(item));
      // history.push(adminRoot);
      history.push('/');
    } else {
      yield put(loginUserError(loginUser));
    }
  } catch (error) {
    yield put(loginUserError(error.message));
  }
}

export function* watchRegisterUser() {
  yield takeEvery(REGISTER_USER, registerWithEmailPassword);
}

const registerWithEmailPasswordAsync = async (
  email,
  password,
  firstName,
  lastName
) => {
  try {
    await accountsGraphQL.createUser({
      email,
      password,
      firstName,
      lastName,
    });
    return {
      email,
      password,
      firstName,
      lastName,
    };
  } catch (err) {
    return err;
  }
};

function* registerWithEmailPassword({ payload }) {
  const { email, password, firstName, lastName } = payload.user;
  const { history } = payload;
  try {
    const registerUser = yield call(
      registerWithEmailPasswordAsync,
      email,
      password,
      firstName,
      lastName
    );
    if (!registerUser.message) {
      const item = { uid: registerUser.user.uid, ...getCurrentUser() };
      setCurrentUser(item);
      yield put(registerUserSuccess(item));
      history.push(adminRoot);
    } else {
      yield put(registerUserError(registerUser.message));
    }
  } catch (error) {
    yield put(registerUserError(error));
  }
}

export function* watchLogoutUser() {
  yield takeEvery(LOGOUT_USER, logout);
}

const logoutAsync = async (history) => {
  await accountsClient.logout();
  history.push('/user');
};

function* logout({ payload }) {
  const { history } = payload;
  setCurrentUser();
  yield call(logoutAsync, history);
}

export function* watchForgotPassword() {
  yield takeEvery(FORGOT_PASSWORD, forgotPassword);
}

const forgotPasswordAsync = async (email) => {
  return await accountsGraphQL
    .sendResetPasswordEmail(email)
    .then((user) => user)
    .catch((error) => error);
};

function* forgotPassword({ payload }) {
  const { email } = payload.forgotUserMail;
  try {
    const forgotPasswordStatus = yield call(forgotPasswordAsync, email);
    if (!forgotPasswordStatus) {
      yield put(forgotPasswordSuccess('success'));
    } else {
      yield put(forgotPasswordError(forgotPasswordStatus.message));
    }
  } catch (error) {
    yield put(forgotPasswordError(error));
  }
}

export function* watchResetPassword() {
  yield takeEvery(RESET_PASSWORD, resetPassword);
}

const resetPasswordAsync = async (resetPasswordCode, newPassword) => {
  await accountsGraphQL.resetPassword(resetPasswordCode, newPassword);
};

function* resetPassword({ payload }) {
  const { newPassword, resetPasswordCode } = payload;
  try {
    const resetPasswordStatus = yield call(
      resetPasswordAsync,
      resetPasswordCode,
      newPassword
    );
    if (!resetPasswordStatus) {
      yield put(resetPasswordSuccess('success'));
    } else {
      yield put(resetPasswordError(resetPasswordStatus.message));
    }
  } catch (error) {
    yield put(resetPasswordError(error));
  }
}

export default function* rootSaga() {
  yield all([
    fork(watchLoginUser),
    fork(watchLogoutUser),
    fork(watchRegisterUser),
    fork(watchForgotPassword),
    fork(watchResetPassword),
  ]);
}
