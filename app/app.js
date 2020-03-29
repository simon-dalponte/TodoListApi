import Vue from "nativescript-vue";
import Home from "./components/Home";
import {decode, encode} from "base-64";
import btoa from 'btoa';
import  utf8 from "utf8";
import store from "./store";
if(!global.btoa) {
    global.btoa = encode;

}if (!global.atob) {
    global.atob = decode;
}

Vue.prototype.$store = store;

new Vue({
    store,
    render: h => h('frame', [h(Home)]),
    components: {
        Home
    }
}).$start();
