import axios from "axios";

export const axiosJWT = axios.create({
    baseURL : 'https://freeway0.herokuapp.com/api/',
});
