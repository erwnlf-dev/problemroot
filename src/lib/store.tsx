// FILE: src/lib/store.tsx
'use client';
import { createContext, useContext, useReducer, useEffect } from 'react';
import { validateInput } from './validate';

const initialState = {
  incidents: [],
  actionItems: [],
  timelineEvents: [],
  settings: {},
  loaded: false,
  toast: null,
};

const StoreContext = createContext(initialState);

function storeReducer(state, action) {
  switch (action.type) {
    case 'SEED':
      return { ...state, ...action.payload, loaded: true };
    case 'ADD_ENTITY':
      return {
        ...state,
        [action.payload.entity]: [...state[action.payload.entity], action.payload.data],
      };
    case 'UPDATE_ENTITY':
      return {
        ...state,
        [action.payload.entity]: state[action.payload.entity].map((item) =>
          item.id === action.payload.data.id ? { ...item, ...action.payload.data } : item
        ),
      };
    case 'DELETE_ENTITY':
      return {
        ...state,
        [action.payload.entity]: state[action.payload.entity].filter(
          (item) => item.id !== action.payload.id
        ),
      };
    case 'TOAST':
      return { ...state, toast: action.payload };
    case 'DISMISS_TOAST':
      return { ...state, toast: null };
    default:
      return state;
  }
}

function StoreProvider({ children }) {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('app_data'));
    if (storedData) {
      dispatch({ type: 'SEED', payload: storedData });
    } else {
      dispatch({
        type: 'SEED',
        payload: {
          incidents: [],
          actionItems: [],
          timelineEvents: [],
          settings: {},
        },
      });
    }
  }, []);

  useEffect(() => {
    if (state.loaded) {
      localStorage.setItem('app_data', JSON.stringify({ incidents: state.incidents, actionItems: state.actionItems, timelineEvents: state.timelineEvents, settings: state.settings }));
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  );
}

function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}

export { StoreProvider, useStore };