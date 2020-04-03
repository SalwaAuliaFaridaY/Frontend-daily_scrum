import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
  		status: '',
  		token: localStorage.getItem('Authorization') || '',
  		user : {}
	},
	// mutation untuk mengubah isi state supaya semua komponen diaplikasi mengenali
	mutations: {
		// cara memanggil mutation menggunakan commit
		auth_request(state){
	    	state.status = 'loading'
	  	},
	  	auth_success(state, token, logged){
		    state.status = 'success'
		    state.token = token
		    state.logged = logged
		},
		userDetail(state, user){
	    	state.user = user
	  	},
	  	auth_error(state){
	    	state.status = 'error'
	  	},
	  	logout(state){
	    	state.status = ''
	    	state.token = ''
	  	},
	},

	// action mengeksekusi data
	actions: {
	  	login({commit}, user){
	        return new Promise((resolve, reject) => {
	            commit('auth_request')
	            axios({url: '/login', data: user, method: 'POST' })
	            .then(response => {
	                const token = response.data.token
	                const logged = response.data.logged
	                localStorage.setItem('Authorization', token)
	                // Add the following line:
	                axios.defaults.headers.common['Authorization'] = token
					commit('auth_success', token)
					//get detail user
					let conf = { headers : {"Authorization" : "Bearer " + token} };
					axios.get("/login/check", conf)
					.then(response => {
						//simpan detail login ke status
						commit('userDetail', response.data.user)
					})
	                resolve(response)
	            })
	            .catch(err => {
	                commit('auth_error')
	                localStorage.removeItem('Authorization')
	                reject(err)
	            })
	        })
	    },
	    register({commit}, user){
	    	return new Promise((resolve, reject) => {
	            commit('auth_request')
	            axios({url: '/register', data: user, method: 'POST' })
	            .then(response => {
	                const token = response.data.token
	                const logged = response.data.logged
	                localStorage.setItem('Authorization', token)
	                // Add the following line:
	                axios.defaults.headers.common['Authorization'] = token
	                commit('auth_success', token)
	                resolve(response)
	            })
	            .catch(err => {
	                commit('auth_error', err)
	                localStorage.removeItem('Authorization')
	                reject(err)
	            })
	        })
	    },
	  	logout({commit}){
		    return new Promise((resolve, reject) => {
		      	commit('logout')
		      	localStorage.removeItem('Authorization')
		      	delete axios.defaults.headers.common['Authorization']
		      	resolve()
		    })
	  	}
	},
	getters : {
	  isLoggedIn: state => !!state.token,
	  authStatus: state => state.status,
	  userDetail: state => state.user,
	}
})

// local storage datanya selama tidak di clear maka tidak akan hilang
// cookies ada batas waktunya
// commit memanggil mutation
// action memanggil dispatch
// variabel nilainya bisa diubah dan diganti ganti
// konstanta nilainya tetap
// localStorage.setItem('Authorization', token) untuk menyimpan token kedalam local storage
// isi auth sukses adalah 
// mounted adalah FUNCTION YANG MENJALANKAN KETIKA VARIABEL DIPANGGIL