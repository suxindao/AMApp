/**
 * Created by Joe on 2017/7/14.
 */
const EDITCONTACT_SETSTATE = 'haoqix/EDITCONTACT_SETSTATE'
const EDITCONTACT_RSETSTATE = 'haoqix/EDITCONTACT_RSETSTATE'
const EDITCONTACT_LOAD_START = 'haoqix/EDITCONTACT_LOAD_START'
const EDITCONTACT_LOAD_SUCCESS = 'haoqix/EDITCONTACT_LOAD_SUCCESS'
const EDITCONTACT_LOAD_FAIL = 'haoqix/EDITCONTACT_LOAD_FAIL'

const initialState = {
  isRender:true,
  loading: false,
  loading_success: false,
  contacts: []
}

export default function reducer(state = initialState, action = {}){
  switch(action.type){
    case EDITCONTACT_LOAD_START:
      return {
        ...state,
        loading: true,
        loading_success: false,
      }
    case EDITCONTACT_LOAD_SUCCESS:
      return {
        ...state,
        loading: false,
        loading_success: true,
      }
    case EDITCONTACT_LOAD_FAIL:
      return {
        ...state,
        loading: false,
        loading_success: false,
      }
    case EDITCONTACT_SETSTATE:
      return {
        ...state,
        ...action.obj
      }
    case EDITCONTACT_RSETSTATE:
      state = {
        isRender:true,
        loading: false,
        loading_success: false,
        contacts: []
      };
      return state
    default:
      return {
        ...state,
      }
  }
}

export function loadData(path, param, fun){
  return{
    types: [ EDITCONTACT_LOAD_START, EDITCONTACT_LOAD_SUCCESS, EDITCONTACT_LOAD_FAIL ],
    promise: (client) => fun(client, path, param),
  }
}

export function setState(obj, isRender){
  typeof isRender != 'undefined' ? obj.isRender = isRender : null;
  return {
    type: EDITCONTACT_SETSTATE,
    obj,
  }
}

export function rsetState(){
  return {
    type: EDITCONTACT_RSETSTATE
  }
}