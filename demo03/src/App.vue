<template>
  <transition>
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </transition>
</template>

<script>

    import {wxGetUserInfo} from './service/getData'
    import { setStore,getStore } from './config/mUtils'

  export default {
      data(){
          return {
          }
      },
      created(){
          var queryData = this.$route.query;
          //var code = queryData.code;
//          var code = '001sxUsS1LbVL91IInsS192LsS1sxUsQ';
//          var wxUserInfor = getStore("wxUserInfor");
//          if(this.isweixin() && !wxUserInfor){
//              wxGetUserInfo(code,{success:(data)=>{
//                  setStore('wxUserInfor', data);
//              }});
//          }

          console.log('this.$route.title: ', this.$route.meta.title);
      },
      mounted(){

      },
      components: {
      },
      computed: {
      },
      methods:{
          isweixin(){
              var ua = navigator.userAgent.toLowerCase();
              if (ua.match(/MicroMessenger/i) == "micromessenger") {
                  return true;
              } else {
                  return false;
              }
          }
      }
  }

</script>

<style lang="scss">
</style>
