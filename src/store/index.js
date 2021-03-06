import Vue from 'vue'
import Vuex from 'vuex'
import MoviesService from '@/services/MoviesService'
import FavoritesService from '@/services/FavoritesService'

import { SET_SEARCH_RESULTS, SET_SEARCH_TERM, SET_SEARCH_CURRENT_PAGE, SET_MOVIE_DETAILS, SET_RESULT_ERROR, SET_RESULT_TOTAL, SET_FAVORITES_MOVIES, SET_LOADING_STATUS } from './mutation-types'
import { GET_MOVIE_INFO, SEARCH_MOVIES_BY_TERM, SEARCH_MOVIES_BY_PAGE, GET_FAVORITES_MOVIES, ADD_FAVORITE_MOVIE, REMOVE_FAVORITE_MOVIE, CLEAR_ALL } from './actions-types'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    favorites: [],
    searchResult: [],
    searchTerm: '',
    total: 0,
    error: '',
    currentPage: 1,
    movieDetails: {},
    loading: false
  },
  mutations: {
    [SET_LOADING_STATUS] (state, status) {
      state.loading = status
    },
    [SET_SEARCH_RESULTS] (state, result) {
      state.searchResult = result
    },
    [SET_SEARCH_TERM] (state, term) {
      state.searchTerm = term
    },
    [SET_SEARCH_CURRENT_PAGE] (state, page) {
      state.currentPage = page
    },
    [SET_MOVIE_DETAILS] (state, movie) {
      state.movieDetails = movie
    },
    [SET_RESULT_ERROR] (state, error) {
      state.error = error
    },
    [SET_RESULT_TOTAL] (state, total) {
      state.total = total
    },
    [SET_FAVORITES_MOVIES] (state, favorites) {
      state.favorites = favorites
    }
  },
  actions: {
    [CLEAR_ALL] (context) {
      context.commit(SET_SEARCH_CURRENT_PAGE, 1)
      context.commit(SET_SEARCH_RESULTS, [])
      context.commit(SET_SEARCH_TERM, '')
      context.commit(SET_RESULT_ERROR, '')
      context.commit(SET_RESULT_TOTAL, 0)
    },
    async [GET_MOVIE_INFO] (context, payload) {
      try {
        context.commit(SET_LOADING_STATUS, true)
        const response = await MoviesService.getMoviesById({ movieId: payload.movieId })
        context.commit(SET_MOVIE_DETAILS, response.data)
        context.commit(SET_LOADING_STATUS, false)
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    },
    async [SEARCH_MOVIES_BY_TERM] (context, payload) {
      try {
        context.dispatch(CLEAR_ALL)
        context.commit(SET_LOADING_STATUS, true)
        context.commit(SET_SEARCH_TERM, payload.term)
        const response = await MoviesService.getMovies({ term: payload.term })
        context.commit(SET_SEARCH_RESULTS, response.data.Search)
        context.commit(SET_RESULT_TOTAL, parseInt(response.data.totalResults))
        context.commit(SET_RESULT_ERROR, ('Error' in response.data) ? response.data.Error : '')
        context.commit(SET_LOADING_STATUS, false)
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    },
    async [SEARCH_MOVIES_BY_PAGE] (context, payload) {
      try {
        context.commit(SET_LOADING_STATUS, true)
        context.commit(SET_SEARCH_TERM, payload.term)
        context.commit(SET_SEARCH_CURRENT_PAGE, payload.page)
        const response = await MoviesService.getMoviesByPage({ term: payload.term, page: payload.page })
        context.commit(SET_SEARCH_RESULTS, response.data.Search)
        context.commit(SET_RESULT_TOTAL, parseInt(response.data.totalResults))
        context.commit(SET_RESULT_ERROR, ('Error' in response.data) ? response.data.Error : '')
        context.commit(SET_LOADING_STATUS, false)
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    },
    async [GET_FAVORITES_MOVIES] (context) {
      try {
        context.commit(SET_LOADING_STATUS, true)
        FavoritesService.getFavoritesMovies()
          .then((querySnapshot) => {
            const favorites = []
            querySnapshot.forEach((doc) => {
              favorites.push({ id: doc.id, ...doc.data() })
            })
            context.commit(SET_FAVORITES_MOVIES, favorites)
            context.commit(SET_LOADING_STATUS, false)
          })
          .catch((error) => {
            context.commit(SET_RESULT_ERROR, error)
          })
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    },
    async [ADD_FAVORITE_MOVIE] (context, payload) {
      try {
        FavoritesService.addFavoritesMovies(payload)
          .then(() => {})
          .catch((error) => {
            context.commit(SET_RESULT_ERROR, error)
          })
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    },
    async [REMOVE_FAVORITE_MOVIE] (context, movieId) {
      try {
        FavoritesService.removeFavoritesMovies(movieId)
          .then(() => {
            context.dispatch(GET_FAVORITES_MOVIES)
          })
          .catch((error) => {
            context.commit(SET_RESULT_ERROR, error)
          })
      } catch (error) {
        context.commit(SET_RESULT_ERROR, error)
      }
    }

  },
  modules: {
  }
})
