import emailjs from "@emailjs/browser";
import { _getSecureLs, getUserToken } from "../helper/storage";
const { AUTH_ENDPOINT, COMPANY_ENDPOINTS } = require("../helper/endpoints");
const { httpAuth, http } = require("../helper/http");

export const getNewWorkspace = async () => {
  const URL = AUTH_ENDPOINT.getNewWorkspace;

  const response = await httpAuth.get(URL);
  return response;
};
export const handleUserLogin = async (userData) => {
  const URL = AUTH_ENDPOINT.login;

  const response = await httpAuth.post(URL, JSON.stringify(userData));
  return response;
};
export const handleUserSignup = async (userData) => {
  const URL = AUTH_ENDPOINT.signup;
  const response = await httpAuth.post(URL, JSON.stringify(userData));
  return response;
};

export const handleCreateCompany = async (companyInfo) => {
  const URL = COMPANY_ENDPOINTS.company;
  getUserToken();
  const response = await http.post(URL, JSON.stringify(companyInfo));
  return response;
};

export const handleEditCompany = async (cid, editedInfo) => {
  const URL = COMPANY_ENDPOINTS.editCompany + "/" + cid;
  getUserToken();
  const response = await http.put(URL, JSON.stringify(editedInfo));
  return response;
};

export const handleRegisterCompany = async (companyInfo, id) => {
  const URL = COMPANY_ENDPOINTS.company + "/" + id;

  const response = await httpAuth.post(URL, JSON.stringify(companyInfo));
  return response;
};

export const handleUserMessage = async (visitorInfo) => {
  const response = await emailjs.send(
    "service_4j7iift",
    "template_9mrpqt5",
    visitorInfo,
    "PLCqtnflXkQA_889q"
  );
  return response;
};

export const getCurrentUser = async () => {
  const userId = _getSecureLs("auth")?.user;
  const userMode = _getSecureLs("auth")?.mode;
  if (userId) {
    try {
      const response = await http.get(
        AUTH_ENDPOINT.getUser + `/${userId}/${userMode}`
      );
      return response?.user;
    } catch (e) {
      console.log(e);
      throw e;
    }
  }
};
