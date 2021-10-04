import axios from 'axios';
import store from "../store/index";
const qs = require('qs');

const DOMAIN = "https://cinema-api-test.y-media.io/"
const ApiMethods = {
  GetMovies: DOMAIN + 'v1/movies',
  GetSessions: DOMAIN + 'v1/movieShows',
  GetSeats: DOMAIN + 'v1/showPlaces',
  BookSeat: DOMAIN + 'v1/bookPlace',
}
const ResponseCodesEnum = {
  Success: 0,
}

export default class FetestService {
  async getMovies(query){
    try {
      const response = await axios.get(ApiMethods.GetMovies, { params: query, mode: 'no-cors' } );
      if (response.data.error_code === ResponseCodesEnum.Success) {
        return response.data.data
      }else{
        response.data.method = 'GetMovies';
        store.commit('SET_ERROR', response.data)
        return false
      }

    } catch (e) {
      if(e && e.response && e.response.data) e.response.data.method = 'GetMovies';
      store.commit('SET_ERROR',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
      throw e
    }
  }

  async getSessions(query){
    try {
      const response = await axios.get(ApiMethods.GetSessions, { params: query, mode: 'no-cors', } );
      if (response.data.error_code === ResponseCodesEnum.Success) {
        return response.data.data
      }else{
        response.data.method = 'GetSessions';
        store.commit('SET_ERROR', response.data)
        return false
      }

    } catch (e) {
      if(e && e.response && e.response.data) e.response.data.method = 'GetSessions';
      store.commit('SET_ERROR',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
      throw e
    }
  }
  async getSeats(query){
    try {
      const response = await axios.get(ApiMethods.GetSeats, { params: query, mode: 'no-cors', } );
      if (response.data.error_code === ResponseCodesEnum.Success) {
        return response.data.data
      }else{
        response.data.method = 'GetSeats';
        store.commit('SET_ERROR', response.data)
        return false
      }

    } catch (e) {
      if(e && e.response && e.response.data) e.response.data.method = 'GetSeats';
      store.commit('SET_ERROR',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
      throw e
    }
  }
  async bookSeat(query){
    try {
      let data = qs.stringify(query)
      const response = await axios.post(ApiMethods.BookSeat, data, {mode: 'no-cors',} );
      if (response.data.error_code === ResponseCodesEnum.Success) {
        return response.data.data
      }else{
        response.data.method = 'BookSeat';
        store.commit('SET_ERROR', response.data)
        return false
      }

    } catch (e) {
      if(e && e.response && e.response.data) e.response.data.method = 'BookSeat';
      store.commit('SET_ERROR',  !e.response ? e : (!e.response.data) ? e.response : e.response.data)
      throw e
    }
  }
}