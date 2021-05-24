<template>
  <div>
    <div id="weather-view-he" style="height: 400px"></div>
  </div>

</template>

<script>
  export default {
    name: 'Weather',
    created() {

      window.WIDGET = {ID: 'Lh6lek6fm0'};
      (function (d) {

        let s = d.createElement('script');
        s.src = 'https://apip.weatherdt.com/view/static/js/r.js?v=1111';
        let sn = d.getElementsByTagName('script')[0];

        sn.parentNode.insertBefore(s, sn)
      })(document)
    }
  }


</script>



