import {createContext} from 'react';

function noop() {} // empty function

export const AuthContext = createContext({
   token: null,
   userId: null,
   login: noop,
   logout: noop,
   isAuthenticated: false
});
