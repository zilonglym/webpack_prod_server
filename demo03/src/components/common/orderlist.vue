<template>
  <div class="orderTabContain" >
    <div class="hotel_list_container" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="5">
      <!--:top-status.sync="topStatus"-->
      <mt-loadmore :top-method="loadTop" :auto-fill="false" @top-status-change="handleTopChange" ref="loadTopMore" :max-distance="100">
        <!--<div slot="top" class="mint-loadmore-top">
          <span v-show="topStatus !== 'loading'" :class="{ 'rotate': topStatus === 'drop' }">↓</span>
          <span v-show="topStatus === 'loading'">Loading...</span>
        </div>-->
        <div class="orderTabContainStayIn">
          <div class="orderTabContainStayInList" v-for="item in list">
            <div class="payLayoutLabel">
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-hotel"></use>
              </svg>
              {{item.hotelName}}
              <span class="fr" :style="{color: showColor(item.orderStatus)}">{{item.orderStatus | showStatus}}</span>
            </div>
            <div class="my-ListLayout-last payLayoutLabel">
              <span>入住：</span>{{item.checkinDate}}
              <span class="ml10">离店：</span>{{item.checkoutDate}}
              <i class="fr">{{item.dateDiff}}晚</i>
            </div>
            <div class="payhotelList">
              <ul>
                  <li class="clearfix" v-for="iteml in item.orderRoomTypeList" @click="routerToPaySuccess(item)">
                    <div class="payhotelListImg fl">
                      <img  v-imgsrc="iteml.roomTypeImgUrl" alt="" v-if="iteml.roomTypeImgUrl"/>
                    </div>
                    <div class="payhotelListRight">
                      <div class="hotelName">
                        {{iteml.roomTypeName}}
                        <span class="col999 fr">¥{{iteml.totalPrice}}</span>
                      </div>
                      <div class="hotelPrice ">
                        <span class="fr">×{{iteml.roomCount}}间</span>
                      </div>
                    </div>
                  </li>
              </ul>
            </div>
            <div class="payLayoutLabel my-ListLayout-last">
              共计{{item.roomTotalCount}}间房
              <span class="fr">订单总费用：¥{{item.orderAmount}}</span>
            </div>
            <div class="btn-layout bdtl clearfix">
              <router-link :to="{path: 'ordertabdetail', query:{orderId: item.orderId}}">
                <button class="fr" v-if="item.orderStatus == 0">去支付</button>
              </router-link>
              <button class="fr" v-if="item.orderStatus == 4" @click="queryOrder(item.orderId)">重新下单</button>
              <button class="fr mr30" v-if="item.orderStatus == 4" @click="deleteOrder(item)">删除</button>
            </div>
          </div>
        </div>
        <div class="ac nodataLayout hp100" v-bind:class="[noPicStatus? 'show':'']">
          <img src="../../images/nodata.png" alt="">
        </div>
        <loadtips v-show="isShowLoadingTips"></loadtips>
        <none v-show="isShowLoadedTips && list.length > 0"></none>
      </mt-loadmore>
    </div>
  </div>
</template>

<script>
    import {mapMutations} from 'vuex'
    import {getOrderList,deleteOrder,getqueryOrder} from '../../service/getData'
    import {getDateDiff} from '../../config/mUtils'
    // import infiniteScroll from 'vue-infinite-scroll'
    import none from './none.vue'
    import loadtips from './loadtips.vue'

    const stautsMap = {
        '0':'待支付',
        '1':'未入住',
        '2':'已入住',
        '3':'已离店',
        '4':'已取消'
    };
    const colorMap = {
        '0':'red',
        '1':'lightblue',
        '2':'grey',
        '3':'grey',
        '4':'black'
    };
    export default {
        data(){
            return {
                list:[],
                pageNum:0,
                noPicStatus:false,
                timer: null,
                isShowLoadingTips:false,
                isShowLoadedTips: false,
            }
        },
        filters: {
            showStatus(val) {
                return stautsMap[val];
            }
        },
        props:['status'],
        mounted(){
        },
        components: {
            // infiniteScroll,
            loadtips,
            none
        },
        methods:{
            showColor(val) {
                return colorMap[val];
            },
            loadTop() {
                this.getOrderList();
            },
            handleTopChange(topStatus) {
                const _self = this;
                _self.isShowLoadingTips = false;
                if (topStatus == "drop") {
                    _self.isShowLoadedTips = false;
                };
            },
            deleteOrder(item){
                deleteOrder({
                    data:{
                        orderId:item.orderId
                    },
                    success:(data)=>{
                        this.$emit('freshList',this.status);
                        this.getOrderList();
                    }
                })
            },
            routerToPaySuccess(item){
                if(item.orderStatus == 0){
                    this.$router.push({ path: 'ordertabdetail', query: { orderId: item.orderId }})
                }else{
                    this.$router.push({ path: 'ordersuccessdetail', query: { orderId: item.orderId }})
                }
            },
            loadMore(elem) {
                this.getOrderList(elem);
            },
            getOrderList(elem){
                const _self = this;
                console.log(_self.status);
                _self.isShowLoadingTips = true;
                _self.isShowLoadedTips = false;
                clearTimeout(_self.timer);
                _self.timer = setTimeout(function () {
                    _self.pageNum ++;
                    getOrderList({
                        data:{
                            orderStatus:_self.status,
                            pageNum:1,
                            pageSize:5*_self.pageNum
                        },
                        success:(data)=>{
                            let list = data.list;

                            for(let i=0; i<list.length; i++){
                                list[i].dateDiff = getDateDiff(list[i].checkinDate,list[i].checkoutDate);
                            }
                            _self.list = list;

                            _self.isShowLoadingTips = false;
                            // 没数据
                            if (_self.list.length == 0) {
                                _self.noPicStatus = true;
                            };

                            if(data.total == list.length){
                                _self.isShowLoadedTips = true;
                                _self.pageNum --;

                                if (elem && elem.scrollTop == elem.scrollHeight - elem.clientHeight) {
                                    elem.scrollTop = elem.scrollTop - 10;
                                };
                            } else {
                                _self.isShowLoadedTips = false;
                            };

                            if (_self.$refs.loadTopMore) {
                                _self.$refs.loadTopMore.onTopLoaded();
                            };
                        }
                    });
                }, 1000);
            },
            queryOrder(orderid){
                let _self = this;
                getqueryOrder({
                    data:{
                        orderId:orderid
                    },
                    success:(data)=>{
                        this.$router.push({ path: 'ordertabdetail', query: { orderId: orderid }})
                    }
                });
            }
        }
    }

</script>

<style lang="scss" scoped>
  .hotel_list_container {
    height: 100%;
  }
  .orderTabContain{
    overflow-y: scroll;
    height:100%;
    padding-top: 2.7em;
    background: #f5f5f5;
  }
  /*.orderTabContain{
    margin-top: 1.7rem;
  }*/
  .orderTabContainStayIn{
    padding-bottom: 10px;
  }
  .orderTabContainStayInList{
    margin-top: 0.7rem;
    background-color: #fff;
  }
  .payLayoutLabel{
    line-height: 1.9rem;
    margin: 0 0.7rem;
    border-bottom: 1px solid #eee;
  }
  .my-ListLayout-last{
    border:none;
  }
  .payhotelList li{
    padding: 0 0.7rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .payhotelList li .payhotelListImg{
    width: 34%;
    height: 68px;
    border-radius: 6px;
    background-color: #eaeaea;
  }
  .hotelName{
    padding: 0.7rem 0;
  }
  .bdtl{
    border-top: 1px solid #eee;
  }
  .payhotelList li .payhotelListImg img{
    width: 100%;
    border-radius: 6px;
    max-width: 100%;
    vertical-align: middle;
  }
  .payhotelList li .payhotelListRight{
    margin-left: 10px;
    flex:1;
  }
  .payhotelList li .payhotelListRight span{
    color: #000;
  }
  .payhotelListRight .hotelName{
    color: #000;
  }
  .payhotelListRight .hotelPrice{
    width: 100%;
    line-height: 34px;
  }
  .btn-layout{
    margin: 0 0.7rem;
    padding: 0.3rem 0;
    background-color: #fff;
  }
  .btn-layout button{
    width: 4.5rem;
    height: 1.3rem;
    border-radius: 4px;
    border: 1px solid #ff7e7e;
    color: #ff7e7e;
    background-color: transparent;
    margin-right: 0.7rem;
  }
  .nodataLayout {
    display: none;
  }
  .nodataLayout img{
    width: 6.5rem;
    margin-top: 5rem;
  }
  .btn-layout .mr30{
    margin-right: 4rem;
  }
  .swiper-pagination .swiper-pagination-bullet-custom{
    display: inline-block;
    width: 25% !important;
  }
</style>
