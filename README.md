# ymEnlargeZoom--jquery放大镜效果

magnifierImgUrl:用于单张图片的放大效果。

imgArray:图片数组，存放图片路径，使用次属性可以出现列表，用于切换。

magnifierImgUrl和imgArray二选一，只能使用一个，同时使用以imgArray属性为准。

size:设置像素大小，范围800-250之间。

maskBackground:放大镜颜色，默认：#333。

```js
<div class="magnifier_effect"></div>
<script type="text/javascript">
  $('.magnifier_effect').ymEnlargeZoom({
    size: 400, // 大小,范围800-250之间
    // maskBackground: 'red', // 放大镜颜色，默认：#333
    // magnifierImgUrl: 'image/3.jpg', // 不需要需要轮播时，填写放大镜的url
    imgArray: ['image/0.jpg', 'image/1.jpg', 'image/2.jpg', 'image/3.jpg', 'image/4.jpg'] // 需要需要轮播时，填写放大镜的url数组
  })
</script>
```
