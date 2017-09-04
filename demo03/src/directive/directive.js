
/**
 * Created by Administrator on 2017/8/30 0030.
 */
import Vue from 'vue';

Vue.directive('imgsrc', {
    inserted: function (el, binding) {
        let img = new Image();
        img.src = binding.value;

        img.onload = function () {
            el.src = binding.value;
        };

        img.onerror = function () {
            el.src = require('../images/error.png');
        };
    }
})