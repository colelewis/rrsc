import React, { useState, useEffect } from 'react';
import SunCalc from 'suncalc';
import useGeolocation from 'react-hook-geolocation';
import './bootstrap.min.css';

export default function Droplet() {

  const prettyMilliseconds = require('pretty-ms');

  function formatSunsetTimeDifference(timeDifference) {
    var timeResult = Math.abs(timeDifference);
    if (timeDifference >= 0) {
      return (
        "Sunset is in " + prettyMilliseconds(timeResult) + "."
      )
    }
    else if (timeDifference < 0) {
      return (
        "Sunset was " + prettyMilliseconds(timeResult) + " ago."
      )
    }
  }

  const UtilDate = () => {
    const [now, setDate] = useState(new Date()); //use current date when triggering an update

    useEffect(() => {
      const timer = setInterval(() => {
        setDate(new Date());
      }, 1000);
      return () => {
        clearInterval(timer);
      }
    }, []);
    const timeInMs = now.getTime();
    const currentLocalDateTime = now.toLocaleTimeString();
    const currentDate = now.toUTCString();

    return {
      timeInMs,
      currentLocalDateTime,
      currentDate,
    };
  };

  const useCurrentLocation = () => { // second half of page
    const geolocation = useGeolocation();
    var times = SunCalc.getTimes(new Date(), geolocation.latitude, geolocation.longitude);
    var timeDifference = times.sunset.getTime() - UtilDate().timeInMs
    return (
      <div class="col-lg rounded-2 p-4 text-white" style={{backgroundColor: '#F49F0A'}}>
        <h4>At your location:</h4>
        <p class="lead fs-4">The Sun will set at {times.sunset.toUTCString()}.{"\n"}</p>
        <p class="lead fs-4">This will occur in your time zone at {times.sunset.toLocaleTimeString()}.{"\n"}</p>
        <p class="lead fs-4">
          {formatSunsetTimeDifference(timeDifference)}
        </p>
      </div>
    );
  };

  function LocationForm() { // first half of page
    const [latitude, setLatitude] = useState(''); //initial value
    const [longitude, setLongitude] = useState('');

    var times = SunCalc.getTimes(new Date(), latitude, longitude);
    var timeDifference = times.sunset.getTime() - UtilDate().timeInMs

    if (latitude === '' || longitude === '') {
      return (
        <div class="container-fluid text-secondary col-lg mb-4" style={{backgroundColor: '#F08700'}}>
          <input style={{border: '0px solid rgba(0, 0, 0, 0.05)'}} class="form-control form-control-sm rounded-1 p-1 mb-3" type="text" placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input style={{border: '0px solid rgba(0, 0, 0, 0.05)'}} class="form-control form-control-sm rounded-1 p-1" type="text" placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
        </div>
      );
    } else {
      return (
        <div class="container-fluid text-secondary col-lg mt-auto p-3 mb-2 text-white">
          <input style={{border: '0px solid rgba(0, 0, 0, 0.05)'}} class="form-control form-control-sm rounded-1 p-1 mb-3" type="text" placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input style={{border: '0px solid rgba(0, 0, 0, 0.05)'}} class="form-control form-control-sm rounded-1 p-1" type="text" placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
          <div class="mt-4">
            <p class="lead">The Sun will set at {times.sunset.toUTCString()} at the given coordinates.{"\n"}</p>
            <p class="lead">This will occur at {times.sunset.toLocaleTimeString()} in your time zone.{"\n"}</p>
            <p class="lead">
              {formatSunsetTimeDifference(timeDifference)}
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <div style={{backgroundColor: '#F08700'}}>
        <div class="container-fluid rounded-2 p-3 text-white">
          <h1>Remaining Sunlight Calculator</h1>
          <p class="lead fs-4">The time is currently: {UtilDate().currentDate}</p>
          <p class="lead fs-4">Your local time is: {UtilDate().currentLocalDateTime}</p>
          <p class="lead fs-4">Please provide a location in decimal longitude and latitude below.</p>
        </div>
        <div>
          {LocationForm()}
        </div>
        <div>
          {useCurrentLocation()}
        </div>
      </div>
      <footer id="sticky-footer" class="flex-shrink-0 py-3 sticky-bottom text-muted">
          <a href="https://github.com/colelewis/rrsc"><div class="container-fluid">
            <svg xmlns="http://www.w3.org/2000/svg" width="8%" height="8%" fill="white" class="bi bi-github mx-auto d-block fixed-bottom mb-1" viewBox="0 0 16 16" role="img">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
          </div></a>
      </footer>
    </>
  );

}