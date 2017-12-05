<template>
  <div class="roomDetailLayout">
    <head-top :head-title="headTitle" goBack="true">
      <span class="title_text">{{headTitle}}</span>
    </head-top>
    <!--顶部end-->
    <div class="successTips" v-if="showModel.paySuccessIco">
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
          <span class="fr" v-if="showModel.orderStatusTxt">{{orderDetail.orderStatus | showOrderStatus}}</span>
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
      <mt-popup v-model="showModel.couponPopup" position="right">
        <coupon-list :my-message.sync="couponList" @transferUser="changePopupVisibleCoupon" @transferCoupon="transferCoupon"></coupon-list>
      </mt-popup>
      <div class="payhotelStatistics">
        <div class="payLayoutLabel">
          订单总额
          <span class="fr">¥{{orderDetail.orderAmount}}</span>
        </div>
        <div class="payLayoutLabel" v-if="!showModel.couponInfo&&orderDetail.discountAmount">
          优惠券
          <span class="fr">-¥{{orderDetail.discountAmount}}</span>
        </div>
        <div class="payLayoutLabel" v-if="showModel.couponInfo&&couponList.length == 0">
          无可用优惠券
          <span class="fr" style="color: #FF7E7E">0</span>
        </div>
        <div class="payLayoutLabel couponLabel" v-if="showModel.couponInfo&&couponList.length > 0" @click="showModel.couponPopup = true">
          优惠券
          <span class="couponbox fz12">{{couponList.length}}张可用</span>
          <span class="fr">
              <span style="color: #FF7E7E" v-if="orderDetail.discountAmount != 0">-¥{{orderDetail.discountAmount}}</span>
              <span style="color: #FF7E7E" v-else>0</span>
              <svg class="icon icon-small" aria-hidden="true">
                <use xlink:href="#icon-juxingkaobei2"></use>
              </svg>
          </span>
        </div>
        <div class="payLayoutLabel">
          实付款
          <span class="fr">¥{{orderDetail.orderPayAmount}}</span>
        </div>
        <div class="payLayoutLabel clearfix" v-if="showModel.orderNo">
          共计{{orderDetail.roomTotalCount}}间房
          <span class="fr">订单号：{{orderDetail.orderNo}}</span>
          <div class="creatTime fr">下单时间：{{orderDetail.createTime}}</div>
        </div>
      </div>
      <div class="ac" v-if="showModel.submitButton">
        <button class="btn-verify active"  @click="submitOrder">下单</button>
      </div>
      <!--弹出支付方式-->
      <mt-popup v-model="showModel.payTypePopup" position="bottom">
        <div class="payLaybel">
          <img src="../../images/zhifubiao.png" alt="" v-if="showModel.alipay">
          <img src="../../images/wechat.png" alt="" v-if="showModel.wechat">
          <mt-radio align="right" v-if="showModel.alipay" v-model="payTypeValue" :options="[{label: '　      支付宝',value: 'alipay'}]">
          </mt-radio>
          <mt-radio align="right" v-if="showModel.wechat" v-model="payTypeValue" :options="[{label: '　      微信支付',value: 'wechat'}]">
          </mt-radio>
          <div class="btn-toPay" @click="toPayment">去支付</div>
        </div>
      </mt-popup>
      <div id="payDetailLayout">
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
                orderDetail:{},
                couponList:[],
                payTypeValue:'',
                paymentSignInfo:{},
                showModel:{
                  alipay:false,
                  wechat:false,
                  paySuccessIco:false,
                  orderStatusTxt:false,
                  submitButton:false,
                  orderNo:false,
                  couponInfo:false,
                  payTypePopup:false,
                  couponPopup:false
                }
            }
        },
        mounted(){
            //初始化数据
            this.initData();
        },
        components: {
            headTop,
            loading,
            couponList
        },
        filters: {
          showOrderStatus: function (value) {
            switch(value) {
              case '0':
                return '待支付';
              case '1':
                return '未入住';
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
                if(!orderId) {
                  this.initOrderByStore();
                }else{
                  this.initOrderByRequest(orderId);
                }
                if(isweixin()){
                  this.showModel.wechat=true;
                  this.payTypeValue = 'wechat';
                }else{
                  this.showModel.alipay=true;
                  this.payTypeValue = 'alipay';
                }
            },
            initOrderByStore(){
              let orderInfo = getStore('ORDER_INFO')
              if (orderInfo) {
                var orderDetail = JSON.parse(orderInfo);
                for (var i = 0; i < orderDetail.orderRoomTypeList.length; i++) {
                  orderDetail.orderRoomTypeList[i].popupVisibleRoomTime = false;
                }
                this.orderDetail = orderDetail;
                this.initCouponList(this.orderDetail.hotelId, this.orderDetail.orderAmount);

                this.showModel.submitButton = true;
                this.showModel.couponInfo = true;
              }
            },
            initOrderByRequest(orderId){
              var _self = this;
              getOrderDetail({
                data:{
                  orderId:orderId
                },
                success:(data)=>{
                  var orderDetail = data;
                  for(var i=0;i<orderDetail.orderRoomTypeList.length;i++){
                    orderDetail.orderRoomTypeList[i].popupVisibleRoomTime=false;
                  }
                  orderDetail.dateDiff = getDateDiff(orderDetail.checkinDate,orderDetail.checkoutDate);
                  _self.orderDetail = orderDetail;

                  _self.showModel.orderStatusTxt = true;
                  _self.showModel.orderNo = true;

                  if(orderDetail.orderStatus == '0'||orderDetail.orderStatus == '4'){
                    _self.initCouponList(orderDetail.hotelId,orderDetail.orderAmount,orderDetail.userCouponId);
                    _self.showModel.submitButton = true;
                    _self.showModel.couponInfo = true;
                  }
                  if(orderDetail.orderStatus == '1'){
                    var paySuccess = _self.$route.query.paySuccess;
                    if(paySuccess){
                      _self.showModel.paySuccessIco=true;
                    }
                  }
                }
              });
            },
            initCouponList(hotelId,orderAmount,userCouponId){
              var _self = this;
              _self.orderDetail.orderPayAmount = orderAmount;
              getCoupon({
                data: {
                  hotelId: hotelId,
                  orderAmount: orderAmount,
                  userCouponId:userCouponId
                },
                success: (data) => {
                  if (data.list.length != 0) {
                    for (var i = 0; i < data.list.length; i++) {
                      data.list[i].checkStatus = false;
                    }
                    data.list[0].checkStatus = true;
                    _self.orderDetail.discountAmount = data.list[0].discountAmount;
                    _self.orderDetail.userCouponId = data.list[0].userCouponId;

                    _self.couponList = data.list;
                    _self.orderDetail.orderPayAmount = accSubtr(orderAmount, _self.orderDetail.discountAmount);
                    if (_self.orderDetail.orderPayAmount < 0) {
                      _self.orderDetail.orderPayAmount = 0;
                    }
                  }
                }
              });
            },
            submitOrder(){
                if(!this.orderDetail.orderId){
                  this.addOrder();
                }else{
                    if(this.orderDetail.orderStatus == '0'){
                      this.showModel.payTypePopup = true;
                    }else if(this.orderDetail.orderStatus == '4'){
                      this.addOrderAgain();
                    }
                }
            },
            addOrderAgain(){
              var _self = this;
              var orderRoomList = [];
              for(let i=0; i<this.orderDetail.orderRoomTypeList.length; i++){
                orderRoomList.push({
                  'roomTypeId':this.orderDetail.orderRoomTypeList[i].roomTypeId,
                  'roomTypeName':this.orderDetail.orderRoomTypeList[i].roomTypeName,
                  'roomCount':this.orderDetail.orderRoomTypeList[i].roomCount,
                });
              }
              var data = {
                hotelId:this.orderDetail.hotelId,
                checkinDate:this.orderDetail.checkinDate,
                checkoutDate:this.orderDetail.checkoutDate,
                userCouponId:this.orderDetail.userCouponId,
                preOrderId:this.orderDetail.orderId,
                orderRoomList:orderRoomList,
              }
              addOrderAgain({data:data,success:(data)=>{
                if(data.orderPayAmount == 0){
                  _self.$router.push({path: 'ordersucc',query: { orderId: data.orderId}, replace: true});
                }else {
                  _self.showModel.payTypePopup = true;
                  _self.initOrderByRequest(data.orderId);
                }
              }});
            },
            addOrder(){
              var _self = this;
              var orderRoomList = [];
              for (let i = 0; i < this.orderDetail.orderRoomTypeList.length; i++) {
                orderRoomList.push({
                  'roomTypeId': this.orderDetail.orderRoomTypeList[i].roomTypeId,
                  'roomTypeName': this.orderDetail.orderRoomTypeList[i].roomTypeName,
                  'roomCount': this.orderDetail.orderRoomTypeList[i].roomCount,
                });
              }
              var submitOrder = {
                hotelId: this.orderDetail.hotelId,
                checkinDate: this.orderDetail.checkinDate,
                checkoutDate: this.orderDetail.checkoutDate,
                userCouponId: this.orderDetail.userCouponId,
                orderRoomList: orderRoomList,
              }
              addOrder({
                data: submitOrder, success: (data) => {
                  if (data.orderPayAmount == 0) {
                    _self.$router.push({path: 'ordersucc',query: {orderId: data.orderId},replace: true});
                  } else {
                    _self.orderDetail.orderId =  data.orderId;
                    _self.showModel.payTypePopup = true;
                  }
                }
              });
            },
            changePopupVisibleCoupon: function (status) {
                this.showModel.couponPopup = status;
            },
            transferCoupon: function (userCouponId, discountAmount) {
                this.orderDetail.userCouponId = userCouponId;
                this.orderDetail.discountAmount = discountAmount;
                this.orderDetail.orderPayAmount = accSubtr(this.orderDetail.orderAmount, this.orderDetail.discountAmount);
                if (this.orderDetail.orderPayAmount < 0) {
                  this.orderDetail.orderPayAmount = 0;
                }
            },
            //支付提交
            toPayment () {
                this.paymentSignInfo.hotelId = this.orderDetail.hotelId;
                this.paymentSignInfo.orderId = this.orderDetail.orderId;
                this.paymentSignInfo.userCouponId = this.orderDetail.userCouponId;
                this.paymentSignInfo.clientUrl=window.location.href;
                this.paymentSignInfo.payTypeCode = this.payTypeValue;
                var _self = this;
                getPaymentSign({
                    data: this.paymentSignInfo, success: (data) => {
                        if(data.orderPayAmount == 0){
                          _self.$router.push({path: 'ordersucc',query: { orderId: _self.orderDetail.orderId}, replace: true});
                          return;
                        }
                        if (_self.paymentSignInfo.payTypeCode == 'alipay') {
                            var cont = document.getElementById('payDetailLayout');
                            cont.innerHTML = data.sign;
                            var oldScript = cont.getElementsByTagName('script')[0];
                            cont.removeChild(oldScript);
                            var scriptText = oldScript.innerHTML;
                            eval(scriptText);
                        } else if (_self.paymentSignInfo.payTypeCode == 'wechat') {
                            wx.config({
                                debug: false,
                                appId: data.config_appId, // 必填，公众号的唯一标识
                                timestamp: data.config_timestamp, // 必填，生成签名的时间戳
                                nonceStr: data.config_nonceStr, // 必填，生成签名的随机串
                                signature: data.config_signature,// 必填，签名，见附录1
                                jsApiList: ['chooseWXPay'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
                          });
                          wx.ready(function() {
                            wx.chooseWXPay({
                              timestamp: data.timeStamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
                              nonceStr: data.nonceStr, // 支付签名随机串，不长于 32 位
                              package: data.package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
                              signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
                              paySign: data.paySign, // 支付签名
                              success: function (res) {
                                // 支付成功后的回调函数
                                _self.$router.push({path: 'ordersucc',query: { orderId: _self.paymentSignInfo.orderId}, replace: true});
                              }
                            });
                          });
                        }
                    }
                })
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
