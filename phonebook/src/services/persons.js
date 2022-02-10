import axios from "axios";
const baseUrl = "/api/persons";

const getAll = () => {
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newElement) => {
  return axios.post(baseUrl, newElement).then((response) => response.data);
};

const update = (newElement, id) => {
  return axios
    .put(`${baseUrl}/${id}`, newElement)
    .then((response) => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`).then((response) => response.data);
};

export default { getAll, create, update, remove };
