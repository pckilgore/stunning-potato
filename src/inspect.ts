import { inspect } from '@xstate/inspect';

export function startInspector(){
  inspect({
    iframe: false // open in new window
  });
}

