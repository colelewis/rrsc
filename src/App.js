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
    const currentLocalDateTime = now.toTimeString();
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
      <div class="col-lg rounded-2 bg-secondary text-white p-4">
        <h4>At your location:</h4>
        <p class="lead">The Sun will set at {times.sunset.toUTCString()}!{"\n"}</p>
        <p class="lead">This will occur at {times.sunset.toLocaleTimeString()}!{"\n"}</p>
        <p class="lead">
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
        <div class="container-fluid bg-light text-secondary col-lg mb-4">
          <input class="form-control form-control-sm" type="text" placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input class="form-control form-control-sm" type="text" placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
        </div>
      );
    } else {
      return (
        <div class="container-fluid bg-light text-secondary col-lg mt-auto p-3 mb-2">
          <input placeholder="latitude" onChange={e => setLatitude(e.target.value)} />
          <input placeholder="longitude" onChange={e => setLongitude(e.target.value)} />
          <div class="mt-4">
            <p class="lead">The Sun will set at {times.sunset.toUTCString()} for the given location!{"\n"}</p>
            <p class="lead">This will occur at {times.sunset.toLocaleTimeString()} in your time!{"\n"}</p>
            <p class="lead">
              {formatSunsetTimeDifference(timeDifference)}
            </p>
          </div>
        </div>
      );
    }
  }

  return (
    <div class="bg-light">
      <div class="container-fluid rounded-2 p-4">
        <h1>Remaining Sunlight Calculator</h1>
        <p class="lead">The time is currently: {UtilDate().currentDate}</p>
        <p class="lead">Your local time is: {UtilDate().currentLocalDateTime}</p>
        <p class="lead">Please provide a location in decimal longitude and latitude below!</p>
      </div>
      <div>
        {LocationForm()}
      </div>
      <div>
        {useCurrentLocation()}
      </div>
    </div>
  );

}