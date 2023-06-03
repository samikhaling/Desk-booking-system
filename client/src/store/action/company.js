import * as actionTypes from "./actionTypes";

export const editCompany = () => {
  return {
    type: actionTypes.INIT_EDIT_COMPANY,
  };
};
export const finishEditCompany = () => {
  return {
    type: actionTypes.FINISH_EDITING_COMPANY,
  };
};
export const selectCompany = (company) => {
  return {
    type: actionTypes.INIT_SELECT_COMPANY,
    selectedCompany: company,
  };
};
