import React from "react"
import { CELSIUS_SYMBOL } from "../constants"
import "./NearbyWeather.css"

interface IProps {
  weatherDescription: string
  iconCode: string
  temp: number
  tempMin: number
  tempMax: number
  locationName: string
  locationCountry: string
}

function NearbyWeather(props: IProps) {
  const {
    weatherDescription,
    iconCode,
    temp,
    tempMin,
    tempMax,
    locationName,
    locationCountry,
  } = props
  const imgSrc = `https://openweathermap.org/img/w/${iconCode}.png`
  return (
    <section className="NearbyWeather">
      <div className="NearbyWeather__data">
        <h2 className="NearbyWeather__location">
          {locationName} {locationCountry}
        </h2>
        <div className="NearbyWeather__weather">
          {weatherDescription}, {temp}
          {CELSIUS_SYMBOL}
        </div>
        <div>
          <div>
            Min Temp: {tempMin}
            {CELSIUS_SYMBOL}
          </div>
          <div>
            Max Temp: {tempMax}
            {CELSIUS_SYMBOL}
          </div>
        </div>
      </div>
      <img src={imgSrc} alt="" className="NearbyWeather__weatherImage" />
    </section>
  )
}

export default NearbyWeather
