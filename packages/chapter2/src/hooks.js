import { render } from "./render";

export function createHooks(callback) {
  let _val = [];
  let currentStateKey = 0;
  // let _memoVal;
  // let _memoRefs = [];

  const stateContext = {
    current: 0,
    states: [],
  };

  const memoContext = {
    current: 0,
    memos: [],
  };

  function resetContext() {
    stateContext.current = 0;
    memoContext.current = 0;
  }

  const useState = (initState) => {
    console.log("useState 처음", currentStateKey, _val);
    if (_val.length === currentStateKey) {
      _val.push(initState);
    }
    let state = _val[currentStateKey];

const index = currentStateKey;

    const setState = (newState) => {
      console.log("setState 처음", currentStateKey, _val);
      if (newState === state) return;
      _val[index] = newState;
      currentStateKey = 0;

      callback();
      console.log("setState 마지막", currentStateKey, _val);
    };
    currentStateKey += 1;
    console.log("useState 마지막", currentStateKey, _val, state);

    return [state, setState];
  };

  const useMemo = (fn, refs) => {

    const { current, memos } = memoContext;
    memoContext.current += 1;

    const memo = memos[current];

    const resetAndReturn = () => {
      const value = fn();
      memos[current] = {
        value,
        refs,
      };
      return value;
    };

    if (!memo) {
      return resetAndReturn();
    }

    if (refs.length > 0 && memo.refs.find((v, k) => v !== refs[k])) {
      return resetAndReturn();
    }
    return memo.value;

    // if (refs.every((item, idx) => item === _memoRefs[idx])) {
    //   return _memoVal;
    // }
    // _memoRefs = refs;
    // _memoVal = fn();
    // return fn();
  };

  // const resetContext = () => {};

  return { useState, useMemo, resetContext };
}