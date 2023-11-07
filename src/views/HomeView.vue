<template>
  <div style="padding:30px;text-algin:center; width: 100%; align-items: center; display: flex; font-weight: 600;">
    <el-form ref="form" :model="form" style="width: 80%; margin-left: auto; margin-right: auto;">
      <el-container>
        <el-header>
          <font style="font-size:30px"><b>Trip Planner</b></font>
        </el-header>
      </el-container>

      <el-form-item>
        <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleAdmin">
            Manage Cities
          </el-button>
      </el-form-item>

      <el-form-item label="Select City" prop="cities"
        style="width: 50%; margin-left: auto; margin-right: auto; display: flex;">
        <el-col :span="11">
          <el-select v-model="citiesDatas" style="width: 300px; box-shadow: 4px;" placeholder="Select a city"
            @change="getOneCurrCityData">
            <el-option v-for="item in cities" :key="item.id" :label="item.name + ' (' + item.country + ')'"
              :value="item.id" />
          </el-select>
        </el-col>
      </el-form-item>

      

      <el-form-item label="Select Date" style="width: 50%; margin-left: auto; margin-right: auto; ">
        <el-col :span="11">
          <el-date-picker v-model="selectDate" type="date" placeholder="Select a date"
            style="width: 100%; box-shadow: 0 2px 4px rgba;" :picker-options="pickerOptions"
            @input="getOneFutureCityData" />
        </el-col>
      </el-form-item>

      <el-form-item style="width: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba;">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="background-color: darkgray;">
            <span>City Description</span>
          </div>
          <div type="textarea" class="text item">
            {{ this.desc }}
          </div>
        </el-card>
      </el-form-item>

      <el-form-item style="width: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba;">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="background-color: rgb(146, 161, 118);">
            <span>Temperature</span>
          </div>
          <div type="textarea" class="text item">
            {{ this.temp }}
          </div>
        </el-card>
      </el-form-item>

      <el-form-item style="width: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba;">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="background-color: rgb(146, 161, 118);">
            <span>Feels Like</span>
          </div>
          <div type="textarea" class="text item">
            {{ this.feelTemp }}
          </div>
        </el-card>
      </el-form-item>

      <el-form-item style="width: 50%; margin-left: auto; margin-right: auto; box-shadow: 0 2px 4px rgba;">
        <el-card class="box-card">
          <div slot="header" class="clearfix" style="background-color: rgb(146, 161, 118);">
            <span>Description</span>
          </div>
          <div type="textarea" class="text item">
            {{ this.main }}
          </div>
        </el-card>
      </el-form-item>


      
    </el-form>
  </div>
</template>

<script>
import { getAllCity } from '@/api/HttpRequest'
import { getOneCity } from '@/api/HttpRequest'
import { getCurrentCityWeather } from '@/api/HttpRequest'
import { getSelectDateCityWeather } from '@/api/HttpRequest'
import { format, addDays } from 'date-fns'
export default {
  data() {
    return {
      cities: [],
      citiesDatas: '',
      theCity: {},
      desc: '',
      lon: '',
      lat: '',
      temp: '',
      feelTemp: '',
      main: '',
      sunSet: '',
      sunRise: '',
      selectDate: '',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24 * 1 || time.getTime() > Date.now() + 3600 * 1000 * 24 * 3
        }
      }
    }
  },
  created() {
    this.getAllCityData()
    this.selectDate = this.getToday()
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    },

    getToday() {
      return format(addDays(new Date(), 1), 'yyyy-MM-dd')
    },

    getAllCityData() {
      getAllCity().then(res => {
        this.cities = res.data.data
      }).catch(() => {console.error('Error fetching cities:', error)})
    },

    getDateIndex(timestamp) {
      const date = new Date(timestamp)
      const year = date.getFullYear()
      const month = date.getMonth()
      const day = date.getDate()
      const specificDate = new Date(year, month, day, 0, 0)
      const specificTimestamp = specificDate.getTime()

      const currDate = new Date()
      const currYear = currDate.getFullYear()
      const currMonth = currDate.getMonth()
      const currDay = currDate.getDate()
      const currSpecificDate = new Date(currYear, currMonth, currDay, 0, 0)
      const currSpecificTimestamp = currSpecificDate.getTime()

      return specificTimestamp - currSpecificTimestamp === 0 ? 0 : (specificTimestamp - currSpecificTimestamp) / (3600 * 24 * 1000)
    },

    getOneCurrCityData(cityId) {
      getOneCity(cityId).then(res => {
        this.desc = res.data.data.description
        this.lat = res.data.data.lat
        this.lon = res.data.data.lon
        getCurrentCityWeather(this.lat, this.lon).then(res => {
          this.selectDate = this.getToday()
          this.temp = res.data.data.temp + '°C'
          this.sunSet = res.data.data.sunset
          this.sunRise = res.data.data.sunrise
          this.main = res.data.data.main
          this.feelTemp = res.data.data.feelsLike + '°C'
        }).catch(() => { console.error('Error fetching future city data:', error) })
      }).catch(() => { console.error('Error fetching future city data:', error) })
    },

    getOneFutureCityData() {
      const dateIndex = this.getDateIndex(this.selectDate)
      console.log(dateIndex)
      getSelectDateCityWeather(this.lat, this.lon, dateIndex).then(res => {
        this.temp = res.data.data.temp + '°C'
        this.sunSet = res.data.data.sunset
        this.sunRise = res.data.data.sunrise
        this.main = res.data.data.main
        this.feelTemp = res.data.data.feelsLike + '°C'
      }).catch(() => { console.error('Error fetching future city data:', error) })
    },

    handleAdmin() {
      this.$router.push({
        path: '/admin',
      });
    }
  }

}
</script>

<style>
.el-header,
.el-footer {
  background-color: #B3C0D1;
  color: #333;
  text-align: center;
  line-height: 60px;
  margin: 10px;
}

input::-webkit-input-placeholder {
  font-weight: 700;
}
</style>