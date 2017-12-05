<template>
  <div style="height:100%;">
   <!-- <head-top headTitle="订房" toPath="search"></head-top>-->
    <div class="wp100 hp100 of-y" >
        <div class="hotel_list_container hp100" v-infinite-scroll="loadMore"
           infinite-scroll-disabled="loading"
           infinite-scroll-distance="5" >
          <router-link :to="{path: 'datepicker'}">
              <div class="dayPickerLayout clearfix">
                    <span class="fl">
                        <span class="daytime">入住时间&nbsp;{{queryData.checkinDate}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;离店时间&nbsp;{{queryData.checkoutDate}}</span>
                    </span>
                  <svg class="icon fr" aria-hidden="true">
                      <use xlink:href="#icon-juxingkaobei2"></use>
                  </svg>
              </div>
          </router-link>
          <mt-loadmore :top-method="loadTop" :auto-fill="false" @top-status-change="handleTopChange" ref="loadTopMore" :max-distance="100">
              <div class="hotelInfoLayout" v-for="item in hotelList" v-if="hotelList.length != 0" >
                <router-link :to="{path: 'hoteldetail', query:{id: item.hotelId}}">
                    <div class="swiperImgLayout clearfix">
                        <img alt="" v-if="item.hotelImgUrl"  v-imgsrc="item.hotelImgUrl"/>
                    </div>
                  <div class="hotelName">
                    {{item.hotelName}}
                  </div>
                  <div class="hotelAddress clearfix">
                      <span class="fl">{{item.address}}</span>
                      <span class="hotelPrice">
                      <span>¥</span>
                      <span class="hotelPriceNum">{{item.lowestPrice}}</span>&nbsp;起
                      </span>
                  </div>
                </router-link>
              </div>
              <!--暂无数据 start-->
              <div class="noData" v-if="isShowLoadedTips&&hotelList.length == 0">
                  <img src="../../images/nodata.png" alt="暂无数据" />
              </div>
          </mt-loadmore>
        <!--<loading v-show="isShowLoadingTips"></loading>-->
        <!--<p  v-show="isShowLoadingTips" class="ac">
          加载中...
        </p>-->
        <loadtips v-show="isShowLoadingTips"></loadtips>
        <none v-show="isShowLoadedTips&&hotelList.length != 0"></none>
      </div>
    </div>
    <!--v-infinite-scroll="loadMore" infinite-scroll-disabled="loading" infinite-scroll-distance="10" -->

  </div>
</template>

<script>

    import {mapState,mapMutations} from 'vuex'
    import {pageForSale, pageForCoupon} from '../../service/getData'
    import headTop from '../../components/header/head'
    import loading from '../../components/common/loading.vue'
    import none from '../../components/common/none.vue'
    import loadtips from '../../components/common/loadtips.vue'
    import { formatTime, getStore } from '../../config/mUtils'


    let fromPath = '';

    export default {
        data(){
            return {
                isShowLoadingTips:false,
                isShowLoadedTips:false,
                queryData:{},
                timer: null,
            }
        },
        beforeRouteEnter(to, from, next){
            fromPath = from.path;
            next();
        },
        created(){
            const _self = this;
            const queryData = _self.$route.query;

            _self.INIT_HOTEL_LIST();
            queryData.pageSize = 10;
            queryData.pageNum = 0;
            if (fromPath !== '/web/datepicker') {      // search, coupnlist回跳
                if (!queryData.checkinDate||!queryData.checkoutDate) {
                    queryData.checkinDate = formatTime(new Date(), 3);
                    queryData.checkoutDate = formatTime(new Date(new Date().getTime() + 86400000) , 3);
                };
            } else {     // 日历回跳
                let initHotelQuey = JSON.parse(getStore('KKWEBAPP_hotelQuery'));
                if (initHotelQuey) {
                    queryData.checkinDate = initHotelQuey.checkinDate;
                    queryData.checkoutDate = initHotelQuey.checkoutDate;
                };
            };

            _self.queryData = queryData;
        },
        mounted(){
            //初始化数据
            this.INIT_HOTEL_QUERY();
            this.checkinDate = this.hotelQuery.checkinDate;
            this.checkoutDate = this.hotelQuery.checkoutDate;
        },
        components: {
            headTop,
            loading,
            none,
            loadtips
        },
        computed: {
            ...mapState([
                'hotelList','hotelQuery'
            ])
        },
        methods:{
            ...mapMutations([
                'INIT_HOTEL_LIST','SAVE_HOTEL_LIST','INIT_HOTEL_QUERY'
            ]),
            loadTop() {
                var _self = this;
                _self.loadMore();
            },
            handleTopChange() {

            },
            loadMore(elem) {
                var _self = this;
                _self.isShowLoadingTips=true;
                _self.isShowLoadedTips = false;
              /*_self.loading = true;
               console.log('加载...loading');*/
                _self.queryData.pageNum++;
                clearTimeout(_self.timer);
                _self.timer = setTimeout(function () {

                    if (_self.queryData.cityId) {
                        // 搜索酒店列表
                        pageForSale({data:_self.queryData,success:(data)=>{
                            _self.getForSaleList(data, elem);
                        }});
                    } else if (_self.queryData.userCouponId) {
                        // 使用优惠券
                        pageForCoupon({data:_self.queryData,success:(data)=>{
                            _self.getForSaleList(data, elem);
                        }});
                    };

                },100);
            },
            // 获取酒店列表，成功回调
            getForSaleList(data, elem) {
                var _self = this;
                _self.isShowLoadingTips = false;
                if(data.list.length == 0){
                    _self.isShowLoadedTips = true;
                    _self.queryData.pageNum--;
                    if (elem && elem.scrollTop == elem.scrollHeight - elem.clientHeight) {
                        elem.scrollTop = elem.scrollTop - 10;
                    };
                };
                _self.SAVE_HOTEL_LIST({itemList:data.list});
                if (_self.$refs.loadTopMore) {
                    _self.$refs.loadTopMore.onTopLoaded();
                };
            },
        }
    }
</script>

<style lang="scss" scoped>
  @import '../../style/mixin.scss';
  .dayPickerLayout{
      padding: 12px 15px;
      background: #fff;
      color: #222;
      font-size: 0.5rem;
      position: fixed;
      top: 0;
      z-index: 999;
      width: 100%;
  }
  .dayPickerLayout .daytime{
      font-size: 12px;
      color: #696969;
  }
  .noData{
    padding: 100px 0;
    text-align: center;
  }
  .noData img{
    width: 150px;
    max-width: 150px;
  }
  .loading{
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10000;
    width: 16px;
    height: 16px;
    margin: -16px 0 0 -16px;
  }

  /*订房 start*/
  .hotel_list_container{
    padding-top: 1.7rem;
    border-top: 0.025rem solid $bc;
    .shop_header{
      .shop_icon{
        fill: #999;
        margin-left: 0.6rem;
        vertical-align: middle;
        @include wh(0.6rem, 0.6rem);
      }
      .shop_header_title{
        color: #999;
        @include font(0.55rem, 1.6rem);
      }
    }
  }
  .hotelInfoLayout{
    background: #fff;
    margin:10px 0 15px;
    padding: 0 0 10px 0;
    position: relative;
  }
  .hotelInfoLayout img{
    width: 100%;
    max-width: 100%;
    max-height: 200px;
  }
  .swipeLayout{
    height: 175px;
  }
  .hotelInfoLayout .hotelName{
    padding-left: 15px;
    font-size: 0.7rem;
    color: #222;
  }
  .hotelInfoLayout .hotelAddress{
    margin-top: 5px;
    padding:0 15px;
    color: #696969;
    position: relative;
  }
  .hotelInfoLayout .hotelAddress .fl{
    display: inline-block;
    width: 75%;
  }
  .hotelInfoLayout .hotelName.detailAdd,
  .hotelInfoLayout .hotelAddress.detailAdd{
    width: 90%;
  }
  .hotelInfoLayout .toHomeBtn{
    width: 109px;
    position: absolute;
    right: 13px;
    bottom: 30px;
  }
  .hotelInfoLayout .toHome img{
    width: 30px;
    position: absolute;
    left: 15px;
    top: 20px;
  }
  .hotelPrice{
    margin-top: -4px;
    float: right;
    color: #222;
    font-size: 13px;
  }
  .hotelPrice span,
  .roomTypeInfo span{
    color: #ff7e7e;
  }
  .hotelPrice .hotelPriceNum,
  .roomTypeInfo .hotelPriceNum{
    color: #ff5b45;
    font-size: 16px;
  }
    .swiperImgLayout{
        background-color: #EAEAEA;
        margin-bottom: 10px;
        position: relative;
        min-height: 8.5rem;
    }
  .swiperImgLayout img{
     float: left;
  }
  .swiperImgLayout img[lazy=loading]{
      width: 10%;
      top: 3.5rem;
      left: 50%;
      margin-left: -5%;
      position: absolute;
  }
</style>

