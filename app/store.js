import Vue from 'nativescript-vue'
import Vuex from 'vuex'
import axios from 'axios'
import {decode, encode} from 'base-64'
Vue.use(Vuex);

const Store = new Vuex.Store({
    state: {
        token_api: null,
        todo_list: [],
        uuid: "3989b090-5ee8-11ea-b9bd-110c038ba6ef",
    },
    getters: {
      token : state => {
          return state.token_api
      },
      uuid : state => {
          return state.uuid
      },
      todos : state => {
          return state.todo_list
      }
    },
    mutations : {
      setToken(state,token){
          state.token_api = token
      },
      setTodoList(state,payload){
          state.todo_list = payload
      },
      addTodoInList(state,payload){
          state.todo_list.push(payload)
      }
    },
    actions: {
        async getTodos(context){
            if (!global.btoa) {
                global.btoa = encode;
            }

            if (!global.atob) {
                global.atob = decode;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${context.getters.token}`
                }
            };
            await axios.get("https://api.todolist.sherpa.one/users/"+ context.getters.uuid +"/todos",config)
                .then((res) => {
                    console.log(res.data);
                    context.commit('setTodoList',res.data.todos)
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        async getToken (context){
            let username = 'simon.dalponte@gmail.com';
            let password = 'n+GbIqK1K3';
            const config1 = {
                auth: {
                    username: username,
                    password: password
                }
            };
            await axios.post("https://api.todolist.sherpa.one/users/signin", {},config1)
                .then((res) => {
                    console.log('zinzin1')

                    console.log(res.data.token);
                    context.commit('setToken',res.data.token)
                })
                .catch((err) => {
                    console.log(err);
                });

        },

        onButtonTapDelete(context,todo) {
            const config1 = {
                headers: {
                    Authorization: `Bearer ${context.getters.token}`
                }
            };
            console.log(context.getters.uuid);
            axios.delete("https://api.todolist.sherpa.one/users/" + context.getters.uuid + "/todos/" + todo.uuid, config1)
                .then((res) => {
                    console.log(res.data)
                    setTimeout(()=>{
                        context.dispatch('getTodos')
                    },1000)
                })
                .catch((err) => {
                    console.log(err)
                });
        },
        patchTodo(context,todo){
            const config1 = {
                headers: {
                    Authorization: `Bearer ${context.getters.token}`,
                    'Content-Type': 'application/json'
                }
            };
            console.log("https://api.todolist.sherpa.one/users/"+ context.getters.uuid +"/todos/"+ todo.id)
            axios.patch("https://api.todolist.sherpa.one/users/"+ context.getters.uuid +"/todos/"+ todo.id,todo.edit ,config1)
                .then((res) => {
                    console.log(res.data)
                    setTimeout(()=>{
                        context.dispatch('getTodos')
                    },1000)

                })
                .catch((err) => {
                    console.log(err)
                });
        },

        patchTodoDone(context,todo){
            const config1 = {
                headers: {
                    Authorization: `Bearer ${context.getters.token}`,
                    'Content-Type': 'application/json'
                }
            };
            let patched_todo = {}

            if(todo.done === false){
                console.log('zinzin')
                patched_todo.done = true
            }
            if(todo.done === true){
                patched_todo.done = false
            }
            axios.patch("https://api.todolist.sherpa.one/users/"+ context.getters.uuid +"/todos/"+ todo.uuid,patched_todo ,config1)
                .then((res) => {
                    console.log(res.data)
                    setTimeout(()=>{
                        context.dispatch('getTodos')
                    },1000)
                })
                .catch((err) => {
                    console.log(err)
                });
        },

        addTodo(context,todo){
            const config1 = {
                headers: {
                    Authorization: `Bearer ${context.getters.token}`,
                    'Content-Type': 'application/json'
                }
            };
            axios.post("https://api.todolist.sherpa.one/users/"+ context.getters.uuid +"/todos",todo ,config1
            )
                .then((res) => {
                    console.log(res.data);
                    context.commit('addTodoInList',res.data);
                    setTimeout(()=>{
                        context.dispatch('getTodos')
                    },2000)

                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }
});

export default Store;
