<template>
  <div id="app">
    <h1 class="title">台南公車時刻表</h1>
    <div class="dropdown">
      <select v-model="selected">
        <option disabled>請選擇路線</option>
        <option v-for="item in routeName" :key="item">{{item}}</option>
      </select>
      &nbsp;
      <button @click="onSearch()">查詢</button>
    </div>
    <template v-if="routeInfo.length">
      <div v-for="info in routeInfo" :key="info" class="box">
        <h2 class="name">路線： {{info.routeName}}</h2>
        <div class="container">
          <div v-for="(stop) in info.stop" :key="stop" class="each"> 
            <p>站名： {{stop.name}}</p>
            <p>預計到站時間：</p>
            <p>{{stop.estimateTime}}</p>
          </div>
        </div>
      </div>
    </template>
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
      previousUpdate: false,
    }
  },
  watch: {
    busData() {
      this.getRouteName()
    }
  },
  mounted() {
    this.getBusData()
  },
  methods: {
    timer() {
      setTimeout(() => {
        this.timeToUpdate = true
        console.log('next search will update Bus data')
      }, 60000)
    },
    async getBusData() {
      this.busData = await getData()
      this.timeToUpdate = false
      this.timer()
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
      // update bus data only when last update was more than a minute ago
      if (this.timeToUpdate) {
        await this.getBusData()
      }

      for (let each of this.busData) {
        if (each.RouteName.Zh_tw == this.selected) {
          let routeName = each.SubRouteName ? each.SubRouteName.Zh_tw : each.RouteName.Zh_tw
          let stopName = each.StopName.Zh_tw
          let estimateTime

          if (each.EstimateTime) {
            let time = parseInt(each.EstimateTime);
            let hours = Math.floor(time / 3600) == 0 ? '' : (Math.floor(time / 3600) + ' 時 ')
            let minutes = (Math.floor(time / 60) % 60) == 0 ? '' : ((Math.floor(time / 60) % 60) + ' 分 ')
            let seconds = time % 60 == 0 ? '' : (time % 60 + ' 秒')
            estimateTime = hours + minutes + seconds
          } else estimateTime = '-'

          let found = this.routeInfo.findIndex(item => item.routeName == routeName)

          if(found != -1) {
            this.routeInfo[found].stop.push({name: stopName, estimateTime: estimateTime})
          } else {
            this.routeInfo.push({
              routeName: routeName,
              stop: [{name: stopName, estimateTime: estimateTime}],
            })
          }
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
.box {
  margin:4vh 5vw 0;
  border: 1px solid black;
}
.name {
  margin: 0 7px;
}
.container {
  display: grid;
  justify-content: space-around;
  grid-template-columns: repeat( auto-fill, 200px);
}
.each {
  border: 1px solid black;
  margin: 5px 0;
  padding: 5px;
  text-align: left;
}
</style>
