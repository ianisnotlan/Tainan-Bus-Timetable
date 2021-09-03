<template>
  <div id="app">
    <h1 class="title">台南公車時刻表</h1>
    <div class="dropdown">
      <select v-model="selected">
        <option disabled>請選擇路線</option>
        <option v-for="(item, index) in routeName" :key="index">{{item}}</option>
      </select>
      &nbsp;
      <button @click="onSearch()">查詢</button>
    </div>
    <div v-if="routeInfo.length" class="container">
      <div v-for="(info, index) in routeInfo" :key="index" class="each">
        <p>路線： {{info.routeName}}</p>
        <p>站名： {{info.stopName}}</p>
        <p>{{info.estimateTime}}</p>
      </div>
    </div>
  </div>
</template>

<script>
 
import getData from '../../back'
export default {
  name: 'timeTable',
  data() {
    return {
      busData: {},
      routeName: [],
      selected: '請選擇路線',
      routeInfo: [],
      previousUpdate: 0,
    }
  },
  watch: {
    busData() {
      this.getRouteName()
    }
  },
  mounted() {
    let time = new Date()
    this.previousUpdate = time.getTime()
    this.getBusData()
  },
  methods: {
    async getBusData() {
      this.busData = await getData()
      console.log('updateBusData')
    },
    getRouteName() {
      for (let each of this.busData) {
        if (!this.routeName.find(name => name == each.RouteName.Zh_tw))
          this.routeName.push(each.RouteName.Zh_tw)
      }
    },
    async onSearch() {
      this.routeInfo = []
      let time = new Date()
      let currentTime = time.getTime()
      // update bus data only when last update was more than a minute ago
      if (currentTime - this.previousUpdate > 60000) {
        await this.getBusData()
        this.previousUpdate = currentTime
      }

      for (let each of this.busData) {
        if (each.RouteName.Zh_tw == this.selected) {
          let info = {
            routeName: '',
            stopName: '',
            estimateTime: '',
          }
          info.routeName = each.SubRouteName ? each.SubRouteName.Zh_tw : each.RouteName.Zh_tw
          info.stopName = each.StopName.Zh_tw

          if (each.EstimateTime) {
            let time = parseInt(each.EstimateTime);
            let hours = Math.floor(time / 3600) == 0 ? '' : (Math.floor(time / 3600) + ' 時 ')
            let minutes = (Math.floor(time / 60) % 60) == 0 ? '' : ((Math.floor(time / 60) % 60) + ' 分 ')
            let seconds = time % 60 == 0 ? '' : (time % 60 + ' 秒')
            info.estimateTime = `預計到站時間： ${hours}${minutes}${seconds}`
          } else info.estimateTime = '預計到站時間：-'

          this.routeInfo.push(info)
        }
      }
    },
  }
}
</script>

<style scoped>
.title {
    text-align: center;
  }
  .dropdown {
    text-align: center;
  }
  .container {
    display: grid;
    justify-content: space-around;
    grid-template-columns: repeat( auto-fill, 295px);
    margin:4vh 5vw 0;
  }
  .each {
    border: 1px solid black;
    height: 150px;
    margin: 10px 0;
    padding: 5px;
    text-align: center;
  }
</style>
