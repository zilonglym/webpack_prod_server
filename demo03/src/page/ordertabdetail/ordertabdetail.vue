<template>
    <div class="roomDetailLayout">
        <head-top headTitle="订单详情" goBack="true"></head-top>
        <!--顶部end-->
        <div class="payLayout">
            <div class="payhotelInfo">
                <div class="payLayoutLabel">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-hotel"></use>
                    </svg>
                    {{orderDetail.hotelName}}
                </div>
                <div class="payLayoutLabel">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-tuoyuan"></use>
                    </svg>
                    {{orderDetail.address}}
                </div>
                <div class="payLayoutLabel">
                    <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-phone"></use>
                    </svg>
                    {{orderDetail.telephoneNo}}
                </div>
                <div class="my-ListLayout-last payLayoutLabel">
                    <span>入住：</span>{{orderDetail.checkinDate}}
                    <span class="ml10">离店：</span>{{orderDetail.checkoutDate}}
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
            <mt-popup v-model="popupVisibleCoupon" position="right">
                <coupon-list :my-message.sync="couponInfo" @transferUser="changePopupVisibleCoupon" @transferCoupon="transferCoupon"></coupon-list>
            </mt-popup>
            <div class="payhotelStatistics">
                <div class="payLayoutLabel">
                    订单总额
                    <span class="fr">¥{{orderDetail.orderAmount}}</span>
                </div>
                <div class="payLayoutLabel" v-if="orderDetail.orderStatus!='0'&&orderDetail.orderStatus!='4'">
                  优惠券
                  <span class="fr" style="color: #FF7E7E">{{orderDetail.discountAmount?orderDetail.discountAmount:0}}</span>
                </div>
                <div class="payLayoutLabel" v-if="(orderDetail.orderStatus=='0'||orderDetail.orderStatus=='4')&&couponInfo.length == 0">
                    无可用优惠券
                    <span class="fr" style="color: #FF7E7E">0</span>
                </div>
                <div class="payLayoutLabel couponLabel" v-if="(orderDetail.orderStatus=='0'||orderDetail.orderStatus=='4')&&couponInfo.length > 0" @click="popupVisibleCoupon = true">
                    优惠券
                    <span class="couponbox">{{couponInfo.length}}张可用</span>
                    <span class="fr">
                      <span style="color: #FF7E7E" v-if="discountAmount != 0">-¥{{discountAmount}}</span>
                      <span style="color: #FF7E7E" v-else>0</span>
                      <svg class="icon" aria-hidden="true">
                        <use xlink:href="#icon-juxingkaobei2"></use>
                      </svg>
                  </span>
                </div>
                <div class="payLayoutLabel">
                    实付款
                    <span class="fr">¥{{orderDetail.orderPayAmount}}</span>
                </div>
                <div class="payLayoutLabel bdnone">
                    共计{{orderDetail.roomTotalCount}}间房
                    <span class="fr">订单号：{{orderDetail.orderNo}}</span>
                </div>
                <div class="payLayoutLabel clearfix">
                    <span class="fr">订单时间：{{orderDetail.createTime}}</span>
                </div>
            </div>
            <div class="ac" v-show="orderDetail.orderStatus=='0'||orderDetail.orderStatus=='4'">
                <button class="btn-verify active"  @click="submitPay">去支付</button>
            </div>
            <!--弹出支付方式-->
            <mt-popup v-model="popupPayment" position="bottom">
                <div class="payLaybel">
                    <img src="../../images/wechat.png" alt="">
                    <img class="alipayImg" src="../../images/zhifubiao.png" alt="" v-if="!isweixin()">
                    <mt-radio align="right" v-if="!isweixin()" v-model="payTypeValue" :options="[{label: '　      微信支付',value: 'wechat'},{label: '　      支付宝',value: 'alipay'}]">
                    </mt-radio>
                    <mt-radio align="right" v-else v-model="payTypeValue" :options="[{label: '　      微信支付',value: 'wechat'}]">
                    </mt-radio>
                    <div class="btn-toPay" @click="toPayment">去支付</div>
                </div>
            </mt-popup>
            <mt-popup v-model="popupPaymentDetail" position="right">
                <div id="payDetailLayout">
                </div>
            </mt-popup>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations} from 'vuex'
    import loading from '../../components/common/loading'
    import {animate,getStore,accSubtr,getDateDiff} from '../../config/mUtils'
    import headTop from '../../components/header/head'
    import {getCoupon,addOrderAgain,getPaymentSign,getOrderDetail} from '../../service/getData'
    import {baseUrl} from '../../config/env'
    import couponList from '../coupon/coupon'

    export default {
        data(){
            return{
                orderDetail:{},
                payTypeValue:'alipay',
                couponInfo:'',
                paymentSignInfo:{},
                popupVisibleCoupon:false,
                popupPayment:false,
                popupPaymentDetail:false,
                discountAmount:null,
                userCouponId:null,
                orderId:null,
            }
        },
        created(){
          this.orderId = this.$route.query.orderId;
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
        methods: {
            //初始化时获取基本数据
            initData(){
                let _self = this;
                getOrderDetail({
                    data:{
                        orderId:this.orderId
                    },
                    success:(data)=>{
                        var orderDetail = data;
                        for(var i=0;i<orderDetail.orderRoomTypeList.length;i++){
                            orderDetail.orderRoomTypeList[i].popupVisibleRoomTime=false;
                        }
                        orderDetail.dateDiff = getDateDiff(orderDetail.checkinDate,orderDetail.checkoutDate);
                        _self.orderDetail = orderDetail;
                        _self.paymentSignInfo.hotelId = orderDetail.hotelId;
                        _self.paymentSignInfo.orderId = orderDetail.orderId;
                        _self.paymentSignInfo.userCoupondId = orderDetail.userCouponId;
                        if(orderDetail.orderStatus == '0' || orderDetail.orderStatus == '4'){
                          getCoupon({
                            data:{
                              hotelId:_self.orderDetail.hotelId,
                              orderAmount:_self.orderDetail.orderAmount,
                              userCouponId:_self.orderDetail.userCouponId
                            },
                            success:(data)=>{
                              if(data.list.length != 0){
                                for(let i=0; i<data.list.length; i++){
                                  data.list[i].checkStatus = false;
                                }
                                data.list[0].checkStatus = true;
                                _self.discountAmount=data.list[0].discountAmount;
                                _self.userCouponId=data.list[0].userCouponId;
                              }
                              _self.couponInfo = data.list;
                              _self.orderDetail.orderPayAmount = accSubtr(_self.orderDetail.orderAmount,_self.discountAmount);
                              if(_self.orderDetail.orderPayAmount < 0){
                                _self.orderDetail.orderPayAmount = 0;
                              }
                            }
                          });
                        }
                    }
                });
            },
            isweixin(){
                var ua = navigator.userAgent.toLowerCase();
                if (ua.match(/MicroMessenger/i) == "micromessenger") {
                    return true;
                } else {
                    return false;
                }
            },
            submitPay(){
                if(this.orderDetail.orderStatus == '0'){
                  this.popupPayment = true;
                }else if(this.orderDetail.orderStatus == '4'){
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
                    userCouponId:this.userCouponId,
                    preOrderId:this.orderDetail.orderId,
                    orderRoomList:orderRoomList,
                  }
                  addOrderAgain({data:data,success:(data)=>{
                      if(data.orderPayAmount == 0){
                          _self.$router.push({path: 'ordersuccessdetail',query: { orderId: data.orderId }, replace: true});
                      }else {
                          this.popupPayment = true;
                          this.paymentSignInfo.hotelId = _self.orderDetail.hotelId;
                          this.paymentSignInfo.orderId = data.orderId;
                          this.paymentSignInfo.userCoupondId = _self.userCouponId;
                          this.paymentSignInfo.payTypeCode = _self.payTypeValue;
                          this.orderId = data.orderId;
                          this.initData();
                      }
                  }});
                }
            },
            transferCoupon(userCouponId,price) {
              this.userCouponId = userCouponId;
              this.popupVisibleCoupon = false;
              this.discountAmount = price;
              this.orderDetail.orderPayAmount = accSubtr(this.orderDetail.orderAmount,this.discountAmount);
              if(this.orderDetail.orderPayAmount < 0){
                this.orderDetail.orderPayAmount = 0;
              }
            },
            changePopupVisibleCoupon:function (status) {
              this.popupVisibleCoupon = status;
            },
            //支付提交
            toPayment() {
                var _self = this;
                this.paymentSignInfo = {
                    hotelId:this.paymentSignInfo.hotelId,
                    orderId:this.paymentSignInfo.orderId,
                    userCoupondId:this.userCouponId,
                    payTypeCode:this.payTypeValue
                }
                if(getStore('wxUserInfo')){
                    this.paymentSignInfo.openId=JSON.parse(getStore('wxUserInfo')).openid;
                }
                this.paymentSignInfo.clientUrl=window.location.href;
                getPaymentSign({data:this.paymentSignInfo,success:(data)=>{
                    if(data.orderPayAmount == 0){
                        _self.$router.push({path: 'ordersuccessdetail',query: { orderId: data.orderId }, replace: true});
                    }else{
                        if (this.paymentSignInfo.payTypeCode == 'alipay') {
                            var cont = document.getElementById('payDetailLayout');
                            cont.innerHTML = data.sign;
                            var oldScript = cont.getElementsByTagName('script')[0];
                            cont.removeChild(oldScript);
                            var scriptText = oldScript.innerHTML;
                            eval(scriptText);
                            this.popupPaymentDetail = true;
                        } else if (this.paymentSignInfo.payTypeCode == 'wechat') {
                            wx.config({
                                debug: true,
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
                                    }
                                });
                            });
                            wx.error(function(res) {
                                if (res.errMsg == "config:invalid url domain") {
                                    alert("微信支付(测试)授权目录设置有误");
                                } else {
                                    alert("检测出问题:" + res.errMsg);
                                }
                            });
                        }
                    }
                    _self.popupPaymentDetail = true;
                }});
            }
        }
    }
</script>

<style lang="scss" scoped>
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
    }
    .payhotelList li .payhotelListImg img{
        width: 100%;
        height: 68px;
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
        font-size: 13px;
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
        font-size: 18px;
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
