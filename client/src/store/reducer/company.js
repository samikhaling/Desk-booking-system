import * as actionTypes from "../action/actionTypes";

const initialState = {
  isEditing: false,
  selectedCompany: null,
};

const editCompany = (state) => {
  return {
    ...state,
    isEditing: true,
  };
};
const finishEditCompany = (state) => {
  return {
    ...state,
    isEditing: false,
  };
};

const selectCompany = (state, action) => {
  return {
    ...state,
    selectedCompany: action.selectedCompany,
  };
};

const companyReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INIT_EDIT_COMPANY:
      return editCompany(state);
    case actionTypes.FINISH_EDITING_COMPANY:
      return finishEditCompany(state);
    case actionTypes.INIT_SELECT_COMPANY:
      return selectCompany(state, action);
    default:
      return state;
  }
};

export default companyReducer;
