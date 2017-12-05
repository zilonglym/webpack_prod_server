import App from '../App'
import NotFoundComponent from '../NotFoundComponent'

const key = r => require.ensure([], () => r(require('../page/key/key')), 'key')
const hotellist = r => require.ensure([], () => r(require('../page/hotellist/hotellist')), 'hotellist')
const keydetail = r => require.ensure([], () => r(require('../page/keydetail/keydetail')), 'keydetail')
const hoteldetail = r => require.ensure([], () => r(require('../page/hoteldetail/hoteldetail')), 'hoteldetail')
const orderdetail = r => require.ensure([], () => r(require('../page/orderdetails/orderdetail')), 'orderdetail')
const ordersucc = r => require.ensure([], () => r(require('../page/orderdetails/ordersucc')), 'ordersucc')

const coupon = r => require.ensure([], () => r(require('../page/coupon/coupon')), 'coupon')
const me = r => require.ensure([], () => r(require('../page/me/me')), 'me')
const ordertab = r => require.ensure([], () => r(require('../page/ordertab/ordertab')), 'ordertab')
const coupontab = r => require.ensure([], () => r(require('../page/coupontab/coupontab')), 'coupontab')
const couponhotel = r => require.ensure([], () => r(require('../page/couponhotel/couponhotel')), 'couponhotel')
const register = r => require.ensure([], () => r(require('../page/register/register')), 'register')
const login = r => require.ensure([], () => r(require('../page/login/login')), 'login')
const search = r => require.ensure([], () => r(require('../page/search/search')), 'search')
const datepicker = r => require.ensure([], () => r(require('../page/datepicker/datepicker')), 'datepicker')
const map = r => require.ensure([], () => r(require('../page/map/map')), 'map')
const roomtypedetail = r => require.ensure([], () => r(require('../page/hoteldetail/children/roomtypedetail')), 'roomtypedetail')
const howtoopen = r => require.ensure([], () => r(require('../page/howtoopen/howtoopen')), 'howtoopen')
const agreement = r => require.ensure([], () => r(require('../page/agreement/agreement')), 'agreement')

const root = '/web';
export default [
  { path: '*', component: NotFoundComponent },{
    path: '/web',
    component: App, //顶层路由，对应index.html
    children: [ //二级路由。对应App.vue
        {
            path: '',
            redirect: root + '/key',
            meta: {
                title: '订单'
            }
        },
        {
            path: root + '/key',
            component: key,
            meta: {
                title: '订单'
            }
        },
        {
          path: root+'/map',
          component: map,
            meta: {
                title: '地图'
            }
        },
        {
            path: root+'/keydetail',
            component: keydetail,
            meta: {
                title: '详情'
            }
        },
        {
            path: root+'/datepicker',
            component: datepicker,
            meta: {
                title: '选择日期'
            }
        },
        {
          path: root+'/hotellist',
          component: hotellist,
            meta: {
                title: '订房'
            }
        },
      {
        path: root+'/hoteldetail',
        component: hoteldetail,
          meta: {
              title: '酒店'
          }
      },
      {
          path: root+'/search',
          component: search,
          meta: {
              title: '订房'
          }
        },
      {
        path: root+'/me',
        component: me,
          meta: {
              title: '我'
          }
      },
      {
        path: root+'/register',
        component: register,
          meta: {
              title: '入住登记'
          }
      },
    {
        path: root+'/orderdetail',
        component: orderdetail,
        meta: {
            title: '订单详情'
        }
    },
    {
        path: root+'/ordersucc',
        component: ordersucc,
        meta: {
            title: '支付成功'
        }
    },
      {
        path: root+'/coupon',
        component: coupon,
          meta: {
              title: ''
          }
      },
        {
            path: root+'/roomtypedetail',
            component: roomtypedetail,
            meta: {
                title: '详情'
            }
        },
        {
            path: root+'/howtoopen',
            component: howtoopen,
            meta: {
                title: '如何开门'
            }
        },
        {
            path: root+'/agreement',
            component: agreement,
            meta: {
                title: '用户注册协议'
            }
        },
        {
            path: root+'/ordertab',
            component: ordertab,
            meta: {
                title: '订单'
            }
        },
        {
            path: root+'/coupontab',
            component: coupontab,
            meta: {
                title: '卡券'
            }
        },
        {
            path: root+'/couponhotel',
            component: couponhotel
        },
      //登陆注册页
      {
          path: root+'/login',
          component: login,
          meta: {
              title: '登录'
          }
      }
    ]
}]
