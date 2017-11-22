const axios = require('axios');

export const LOAD_MESSAGES = 'LOAD_MESSAGES';
export const LOAD_MESSAGE = 'LOAD_MESSAGE';
export const ADD_MESSAGE = 'ADD_MESSAGE';
export const EDIT_MESSAGE = 'EDIT_MESSAGE';
export const DELETE_MESSAGE = 'DELETE_MESSAGE';
export const VOTE_ON_MESSAGE = 'VOTE_ON_MESSAGE';

export const loadMessages = () => {
  return function(dispatch){
    return axios.get('http://localhost:8080/api/messages')
    .then( messages => {
      dispatch({
        type: LOAD_MESSAGES,
        messages: messages.data
      });
    });
  }
}

export const loadMessage = (id) => {
  return function(dispatch){
    return axios.get(`http://localhost:8080/api/messages/${id}`)
    .then( message => {
      dispatch({
        type: LOAD_MESSAGE,
        message: message.data
      });
    });
  }
}

export const addMessage = (newMessage) => {
  return function(dispatch){
    return axios.post('http://localhost:8080/api/messages', newMessage)
    .then( message => {
      dispatch({
        type: ADD_MESSAGE,
        message: message.data
      });
    });
  }
}

//note: assuming we were sent the id of the message being edited.

export const editMessage = (newInfo) => {
  return function(dispatch){
    return axios.put(`http://localhost:8080/api/messages/${newInfo.id}`, newInfo)
    .then ( message => {
      dispatch({
        type: EDIT_MESSAGE,
        message: message.data
      });
    });
  }
}

export const voteOnMessage = (vote) => {
  return function(dispatch){
    return axios.put(`http://localhost:8080/api/messages/${vote.id}/vote`, vote)
    .then( message => {
      console.log('ACTION', message.data)
      dispatch({
        type: VOTE_ON_MESSAGE,
        message: message.data
      });
    });
  }
}

export const deleteMessage = (id) => {
  return function(dispatch){
    return axios.delete(`http://localhost:8080/api/messages/${id}`)
    .then( message => {
      dispatch({
        type: DELETE_MESSAGE,
        message: message.data
      });
    });
  }
}