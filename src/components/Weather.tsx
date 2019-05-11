import React from "react"
import { CELSIUS_SYMBOL } from "../constants"
import "./Weather.css"

interface IProps {
  weatherDescription: string
  iconCode: string
  temp: number
  tempMin: number
  tempMax: number
  locationName: string
  locationCountry: string
}

function Weather(props: IProps) {
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
    <article className="Weather">
      <div>
        <h2 className="Weather__location">
          {locationName} {locationCountry}
        </h2>
        <div className="Weather__weather">
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
      <img
        src={imgSrc}
        alt=""
        height={150}
        width={150}
        className="Weather__weatherImage"
      />
    </article>
  )
}

export default Weather
