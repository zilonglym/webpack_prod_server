<template>
  <div class="roomDetailLayout">
    <head-top :head-title="headTitle" goBack="true">
      <span class="title_text">{{headTitle}}</span>
    </head-top>
    <!--顶部end-->
    <div class="successTips">
      <span><img src="../../images/勾.png" alt=""></span>
      支付成功
    </div>
    <div class="payLayout">
      <div class="payhotelInfo">
        <div class="payLayoutLabel">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-hotel"></use>
          </svg>
          {{orderDetail.hotelName}}
          <span class="fr">{{orderDetail.orderStatus | showOrderStatus}}</span>
        </div>
        <div class="payLayoutLabel">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tuoyuan"></use>
          </svg>
          &nbsp;&nbsp;{{orderDetail.address}}
        </div>
        <div class="payLayoutLabel">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-phone"></use>
          </svg>
          &nbsp;&nbsp;{{orderDetail.telephoneNo}}
        </div>
        <div class="my-ListLayout-last payLayoutLabel">
          <span>入住：</span>{{orderDetail.checkinDate}}
          &nbsp;&nbsp;<span class="ml10">离店：</span>{{orderDetail.checkoutDate}}
          <i class="fr">{{orderDetail.dateDiff}}晚</i>
        </div>
      </div>
      <div class="payhotelList">
        <ul>
          <li class="clearfix" v-for="iteml in orderDetail.orderRoomTypeList">
            <div class="payhotelListImg fl">
              <img  v-imgsrc="iteml.roomTypeImgUrl" alt=""/>
            </div>
            <div class="payhotelListRight">
              <div class="hotelName payLayoutLabel">
                {{iteml.roomTypeName}}
              </div>
              <div class="hotelPrice ">
                <span class="col999">单&nbsp;价:</span> &nbsp;¥{{iteml.totalPrice}}
                <span class="roomTime" @click="iteml.popupVisibleRoomTime = true"><img src="../../images/time.png" alt=""></span>
                <span class="fr">×{{iteml.roomCount}}间</span>
              </div>
            </div>
            <!--弹出订房时间-->
            <mt-popup v-model="iteml.popupVisibleRoomTime" pop-transition="popup-fade">
              <div class="roomTimeLayout  payLayoutLabel">
                <div class="roomTimeName">{{iteml.roomTypeName}}</div>
                <div class="roomTimeContain clearfix">
                  <span class="fl">{{iteml.stayDatePriceList.length}}晚×{{iteml.roomCount}}间</span>
                  <span class="fr">¥{{iteml.totalPrice}}</span>
                </div>
                <ul class="roompriceList">
                  <li class="clearfix" v-for="dayPrice in iteml.stayDatePriceList">
                    <span class="fl">{{dayPrice.day}}</span>
                    <span class="fr">¥{{dayPrice.price}}</span>
                  </li>
                </ul>
                <div class="popupVisibleRoomTimeClose" @click="iteml.popupVisibleRoomTime = false">关闭</div>
              </div>
            </mt-popup>
          </li>
        </ul>
      </div>
      <!--弹出订房时间-->
      <div class="payhotelStatistics">
        <div class="payLayoutLabel">
          订单总额
          <span class="fr">¥{{orderDetail.orderAmount}}</span>
        </div>
        <div class="payLayoutLabel" v-if="orderDetail.discountAmount">
          优惠券
          <span class="fr">-¥{{orderDetail.discountAmount}}</span>
        </div>
        <div class="payLayoutLabel">
          实付款
          <span class="fr">¥{{orderDetail.orderPayAmount}}</span>
        </div>
        <div class="payLayoutLabel clearfix">
          共计{{orderDetail.roomTotalCount}}间房
          <span class="fr">订单号：{{orderDetail.orderNo}}</span>
          <div class="creatTime fr">下单时间：{{orderDetail.createTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import loading from '../../components/common/loading'
    import {animate,getStore,accSubtr,getDateDiff,isweixin} from '../../config/mUtils'
    import headTop from '../../components/header/head'
    import {getCoupon,addOrder,addOrderAgain,getOrderDetail,getPaymentSign} from '../../service/getData'
    import couponList from '../coupon/coupon'
    import {baseUrl} from '../../config/env'
    export default {
        data(){
            return{
                headTitle:'订房',
                showLoading: true, //显示加载动画
                preventRepeatRequest: false,// 防止多次触发数据请求,
                orderDetail:{}
            }
        },
        mounted(){
            //初始化数据
            this.initData();
        },
        components: {
            headTop,
            loading
        },
        filters: {
          showOrderStatus: function (value) {
            switch(value) {
              case '0':
                return '待支付';
              case '1':
                return '待入住';
              case '2':
                return '已入住';
              case '3':
                return '已离店';
              case '4':
                return '已取消';
            };
          }
        },
        methods: {
            //初始化时获取基本数据
            initData(){
                var orderId = this.$route.query.orderId;
                this.initOrderByRequest(orderId);
            },
            initOrderByRequest(orderId){
              var _self = this;
              getOrderDetail({
                data:{orderId:orderId},
                success:(data)=>{
                  var orderDetail = data;
                  for(var i=0;i<orderDetail.orderRoomTypeList.length;i++){
                    orderDetail.orderRoomTypeList[i].popupVisibleRoomTime=false;
                  }
                  orderDetail.dateDiff = getDateDiff(orderDetail.checkinDate,orderDetail.checkoutDate);
                  _self.orderDetail = orderDetail;
                  if(orderDetail.orderStatus == '1'){
                      _self.showModel.paySuccessIco=true;
                  }
                }
              });
            }
        }
    }
</script>

<style lang="scss" scoped>
  .successTips{
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    text-align: center;
    color: #999;
    font-size: 0.8rem;
    background-color: transparent;
  }
  .successTips img{
    width: 34px;
    display: block;
    margin: 0.3rem auto;
  }
  .payLayout{
    width: 100%;
    height: 100%;
  }
  .payLayout .payLayoutLabel{
    line-height: 34px;
  }
  .payhotelInfo{
    background: #fff;
    /*padding-top: 45px;*/
    font-size: 0.55rem;
  }

  .payhotelStatistics div,
  .payhotelInfo div{
    padding: 5px 15px;
    border-bottom: 1px solid #eee;
  }
  .payhotelInfo div span{
    color: #999;
  }
  .payhotelInfo div i{
    color: #000;
  }
  .payhotelList li{
    margin-top: 15px;
    background: #fff;
    padding: 15px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
  .payhotelList li .payhotelListImg{
    width: 34%;
    height: 68px;
    background-color: #eaeaea;
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
  .payhotelStatistics{
    background: #fff;
    margin-top: 15px;
  }
  .btn-verify {
    width: 92%;
    margin: 20px auto;
    height: 44px;
    line-height: 44px;
    font-size: 0.7rem;
    border-radius: 4px;
    color: #fffefe;
    border: 1px solid #d5d5d5;
    background: #dbdcdd;
    text-align: center;
  }
  .btn-verify.active {
    border: 1px solid #00a1dd;
    background: #21bcf5;
  }
  .roomTime{
    display: inline-block;
    width: 22px;
    margin: 5px 0 0 10px;
    vertical-align: middle;
  }
  .roomTime img{
    width: 100%;
  }
  .col999{
    color: #999 !important;
  }
  /*订房时间价格列表弹窗*/
  .roomTimeLayout{
    border-radius: 4px;
    background-color: #fff;
    margin: 0 auto;
    text-align: center;
  }
  .roomTimeLayout .roomTimeName{
    font-size: 18px;
    color: #222;
    height: 36px;
    line-height: 36px;
  }
  .roomTimeLayout .roompriceList{
    max-height: 15rem;
    overflow-y: auto;
  }
  .roomTimeLayout .roomTimeContain span{
    display: inline-block;
    width: 50%;
    color: #ff7e7e;
    font-size: 13px;
    border-bottom: 1px solid #dadada;
  }
  .roomTimeLayout ul li{
    margin: 0 15px;
    padding: 3px 0;
    border-bottom:  1px solid #eaeaea;
  }
  .roomTimeLayout ul li span{
    display: inline-block;
    width: 50%;
    color: #999;
  }
  .roomTimeLayout .popupVisibleRoomTimeClose{
    height: 44px;
    line-height: 44px;
    color: #fff;
    background-color: #ff7e7e;
    font-size: 18px;
    border-radius: 0 0 4px 4px;
  }
  .payLaybel{
    position: relative;
  }
  .payLaybel img{
    position: absolute;
    left: 18px;
    top:12px;
    width: 22px;
    z-index: 99;
  }
  .payLaybel .alipayImg{
    top:60px;
  }
  .couponLabel .couponbox{
    background-color: #ff7e7e;
    display: inline-block;
    padding: 0.1rem 0.2rem;
    margin-left: 0.3rem;
    line-height:normal;
    border-radius: 4px;
    color: #fff;
  }
  .couponLabel span a{
    color: #ff7e7e;
  }
  .payLaybel .btn-toPay{
    width: 100%;
    height: 44px;
    margin-top: 10px;
    line-height: 44px;
    font-size: 18px;
    color: #ff7e7e;
    text-align: center;
    background: #fff;
  }
    .mint-popup-right{
    width: 100%;
    height: 100%;
    overflow-y: auto;
    background-color: #F3F4F5
  }
  #payDetailLayout{
    width: 100%;
    background-color: #fff;
  }
</style>
