/*******************************************************************
 * @authors yanmo
 * @web
 * @email
 * @date
 * @version Beta 1.0
 *******************************************************************/
(function($) {
    // 下面  是插件的名字，可以任意命名
    $.fn.ymEnlargeZoom = function(F) {
        F = $.extend({
            // 这里是参数设置，根据需要随便命名
            size: 400, // 大小
            magnifierImgUrl: '',  // 不需要需要轮播时，填写放大镜的url
            imgArray: [], // 需要需要轮播时，填写放大镜的url数组
            maskBackground: '#333',
            magnifierMode: 'WHsameadaption' // 放大镜模式-宽高相等自适应
        }, F);

        // 仔细看这个 F 这个是必须一致的。
        // 将插件赋值设置为变量（没必要这么做，但是我习惯这样）

        // 定义共用变量----------------------
        var $mClass = '.' + this[0].className, // 放大镜的class
          $showClass = $mClass + ' .ym_show_layer' // jquery

        var showSize = F.size, // 大小
          imgArray = F.imgArray // 放大镜的url数组

        var isCarousel = false // 是否需要轮播列表
        if (imgArray.length > 0) {
          if (F.magnifierImgUrl !== '') {alert('不能同时使用magnifierImgUrl和imgArray属性，同时使用以imgArray属性为准')}
          isCarousel = true
        }
        // 定义共用变量----------------------

        if (showSize > 800 || showSize < 250) {
          alert('超出插件所允许的大小范围，无意义不能使用')
          return
        }

        var magnifierImgUrl
        var imgLi = ''
        var imgNum = 0
        var imgArrLength = imgArray.length

        if (isCarousel) {
          if (imgArray.length === 0) {alert('需要轮播列表时，请填写imgArray字段长度最少为1')}
          magnifierImgUrl = imgArray[0]
          for (var i = 0; i < imgArray.length; i ++) {
            imgLi = imgLi + '<li><a><img src="' + imgArray[i] + '" alt=""></a></li>'
          }
        } else {
          if (F.magnifierImgUrl === '') {alert('不需要轮播列表时，请填写magnifierImgUrl字段')}
          magnifierImgUrl = F.magnifierImgUrl
        }
        var showMapped = '<div class="ym_show_layer"><a><img class="ym_show_layer_img" src="' + magnifierImgUrl + '" alt=""><div class="ym_mask_layer"></div></a></div><div class="ym_mapped_layer"><div class="ym_mapped_layer_box"><img class="ym_mapped_layer_img" src="' + magnifierImgUrl + '" alt=""></div></div>';

        /* 你的插件代码开始 */

        function init() { // 初始化
          domInit(); // dom初始化
          cssInit(); // css初始化
          domshow(); // dom期望得到的样子
        }
        function domInit () { // dom初始化
          if (isCarousel) {
            var showList = '<div class="ym_show_list"><a class="ym_page_turn ym_last"><i class="icon iconfont icon-fanhui"></i></a><div class="img_list_box"><ul>' + imgLi + '</ul></div><a class="ym_page_turn ym_next"><i class="icon iconfont icon-gengduo"></i></a></div>'
            $($mClass).prepend(showList)
            // 赋予点击切换图片事件
            $($mClass + ' .ym_show_list ul li a').on('click', function () {
              $($mClass + ' .ym_show_layer .ym_show_layer_img').attr('src', $(this).children('img').attr('src'));
              $($mClass + ' .ym_mapped_layer .ym_mapped_layer_img').attr('src', $(this).children('img').attr('src'));
              domshow(); // dom期望得到的样子
            })
            // 翻页轮播
            $($mClass + ' .ym_show_list > a.ym_page_turn').on('click', function () {
              $(this).attr('class') === 'ym_page_turn ym_last' ? (
                imgNum > 0 ? imgNum-- : imgNum = imgNum
              ) : (
                imgNum < (imgArrLength - 3) ? imgNum++ : imgNum = imgNum
              )

              $($mClass + ' .ym_show_list ul').css({'margin-left': -(showSize*(1/4)*imgNum) + 'px'})
            })
          }
          $($mClass).prepend(showMapped)
        }
        function cssInit () { // css初始化
          if (isCarousel) {
            // 图片列表自适应
            $($mClass + ' .ym_show_list').css({height: (showSize/4) + 'px', width: showSize + 'px', padding: '0 ' + showSize*(1/8) + 'px'})
            $($mClass + ' .ym_mask_layer').css({background: F.maskBackground})
            $($mClass + ' .ym_show_list > a.ym_page_turn').css({height: (showSize/5) + 'px', width: (showSize/5)/2 + 'px', margin: (showSize/4 - showSize/5)/2 - 1 + 'px 5px'})
            $($mClass + ' .ym_show_list > a.ym_page_turn i').css({'font-size': (showSize/5)/2 + 'px'})
            $($mClass + ' .ym_show_list .img_list_box').css({height: (showSize/4) + 'px', width: showSize*(3/4) + 'px'})
            $($mClass + ' .ym_show_list ul li').css({width: (showSize/5) + 'px', height: (showSize/5) + 'px', margin: (showSize/4 - showSize/5)/2 - 1 + 'px'})
            // 图片列表自适应
          }
          $($showClass).css({
            width: showSize + 'px', height: showSize + 'px'
          })
          $($mClass + ' .ym_mapped_layer').css({
            left: (showSize + 40) + 'px', width: showSize + 'px', height: showSize + 'px'
          })
        }
        function domshow() { // dom期望得到的样子
          var pageOffsetTop = $($showClass)[0].offsetTop // 相对于页面顶部的偏移量，是数字
          var pageOffsetLeft = $($showClass)[0].offsetLeft // 相对于页面左边的偏移量，是数字
          var screenImage = $($mClass + ' .ym_show_layer .ym_show_layer_img');
          screenImage.on('load', function () {
            var imgInfo = imgLoad(showSize, $(this).attr("src"))
            showCSS(imgInfo.wGTh, imgInfo.maskLayerRatio); // 显示的css设置
            mouseoverEvent(pageOffsetTop, pageOffsetLeft, imgInfo.maskLayerRatio);
          })
        }
        function imgLoad (size, src) { // 图片加载信息
          var theImage = new Image();
          theImage.src = src;
          var ratio = size/theImage.width; // 遮罩层缩放比例
          if (ratio > 0.5) {ratio = 0.5}
          var wGTh = (theImage.width - theImage.height) // 判断宽是否大于高，大于为正数，等于为0，小于为负数
          return {imageWidth: theImage.width, imageHeight: theImage.height, maskLayerRatio: ratio, wGTh: wGTh} // 图片大小，比例，宽减高
        }
        function showCSS(wGTh, maskLayerRatio) { // 显示的css设置
          // 设置放大镜层大小
          $($mClass + ' .ym_mask_layer').css({
            width: maskLayerRatio*showSize + 'px',
            height: maskLayerRatio*showSize + 'px'
          })
          // 映射层大小---------------
          $($mClass + ' .ym_mapped_layer_box').css({
            width: showSize/maskLayerRatio + 'px',
            height: showSize/maskLayerRatio + 'px'
          })
          // 映射层大小---------------
        }
        function mouseoverEvent(pageOffsetTop, pageOffsetLeft, maskLayerRatio) { // 触发的鼠标事件
          $($showClass).on('mousemove', function (event) {
            $($mClass + ' .ym_mask_layer').css('display', 'block')
            $($mClass + ' .ym_mapped_layer').css('display', 'block')
            var maskHalfWidth = $($mClass + ' .ym_mask_layer').width()/2 // 遮罩层的一半宽度
            var locationX = event.pageX - pageOffsetLeft
            var locationY = event.pageY - pageOffsetTop
            var rBLimit = showSize - maskHalfWidth // 右和下界限区域
            var lTLimit = maskHalfWidth // 左和上界限区域
            if ((0 < locationX && locationX < showSize) && (0 < locationY && locationY < showSize)) {
              var maskTop
              var maskLeft
              // 三目运算
              locationX <= lTLimit ? maskLeft = 0 : (locationX >= rBLimit ? maskLeft = (showSize - maskHalfWidth*2) : maskLeft = (locationX - maskHalfWidth))
              locationY <= lTLimit ? maskTop = 0 : (locationY >= rBLimit ? maskTop = (showSize - maskHalfWidth*2) : maskTop = (locationY - maskHalfWidth))
              $($mClass + ' .ym_mask_layer').css({
                top: maskTop + 'px',
                left: maskLeft + 'px'
              })
              // 映射盒子
              $($mClass + ' .ym_mapped_layer_box').css({
                'top': -maskTop/maskLayerRatio + 'px',
                'left': -maskLeft/maskLayerRatio + 'px'
              })
            } else {
              $($mClass + ' .ym_mask_layer').css('display', 'none')
              $($mClass + ' .ym_mapped_layer').css('display', 'none')
            }
          })
          $($showClass).on('mouseleave', function (event) {
            $($mClass + ' .ym_mask_layer').css('display', 'none')
            $($mClass + ' .ym_mapped_layer').css('display', 'none')
          })
        }
        init();

        /* 你的插件代码结束 */
    }
})(jQuery);
