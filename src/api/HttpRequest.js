import axios from 'axios'

const BASE_URL = 'http://3.142.141.114:8080/api'

export function getCurrentCityWeather(lat, lon) {
  return axios({
    url: BASE_URL + '/weather/current?lat=' + lat + '&lon=' + lon,
    method: 'get'
  })
}

export function getAllCity() {
  return axios({
    url: BASE_URL + '/city/list',
    method: 'get'
  })
}

export function getOneCity(id) {
  return axios({
    url: BASE_URL + '/city?cityId=' + id,
    method: 'get'
  })
}


export function getSelectDateCityWeather(lat, lon, date) {
  return axios({
    url: BASE_URL + '/weather/date?lat=' + lat + '&lon=' + lon + '&date=' + date,
    method: 'get'
  })
}

export function createCity(data) {
  return axios({
    url: BASE_URL + '/city/save',
    method: 'post',
    data
  })
}

export function deleteCity(id) {
  return axios({
    url: BASE_URL + '/city/delete?cityId=' + id,
    method: 'delete',
  })
}

export function editCity(data) {
  return axios({
    url: BASE_URL + '/city/update',
    method: 'post',
    data
  })
}



// export default { add, edit, del }