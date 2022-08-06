import axios from "axios";
import { axiosJWT } from "./AxiosJWT";

axios.defaults.baseURL = 'https://freeway0.herokuapp.com/api/'

let axiosConfig = {
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
};

let axiosJWTConfig = (token) => {
    return {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "authorization" : `Bearer ${token}`
        }
    }
};

// register
export const registerUser = (userCredentials) => {
    return axios.post("auth/register", {
        username:userCredentials.username, 
        email: userCredentials.email, 
        password: userCredentials.password
    }, axiosConfig)
    .then((response) => {
        return response.data
    })
    .catch((err) => {
        return err
    });
}

// login 
export const loginUser = (email, password) => {
    return axios.post("auth/login", { email: email, password: password }, axiosConfig)
    .then((res) => {
        return res
    })
    .catch((err) => {
        return err
    })
}

// logout
export const logoutUser = (accessToken, email) => {
    return axiosJWT.post("auth/logout", {body: {email: email}}, axiosJWTConfig(accessToken))
    .then((res) => {
        return res.status
    })
    .catch((err) => {
        return err
    })
}

// get all items
export const getItems = () => {
    return axios.get("items/all", axiosConfig)
        .then((res) => {
            return res
        })
        .catch((err) => {
            return err
        });
}

// add an item
export const giveItem = (itemData, accessToken) => {
    return axiosJWT.post("items/add", {itemData}, axiosJWTConfig(accessToken))
    .then((res) => {
        return res.status
    })
    .catch((err) => {
        return err
    })
}


// get all messages from a conversation
export const getMessages = (roomId, accessToken) => {
    return axiosJWT.get(`messages/${roomId}`, axiosJWTConfig(accessToken))
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        console.log(err)
    })
}

// add message
export const addMessage = (data, accessToken) => {
    return axiosJWT.post('messages/add', {messageData: data}, axiosJWTConfig(accessToken))
    .then((res) => {
        return res.data
    })
    .catch((err) => {
        return err
    })
}

