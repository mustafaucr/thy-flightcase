import './flight.css';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { InputSwitch } from 'primereact/inputswitch';


function Flight() {
  const { state } = useLocation();
  const { passCount, fromPort, toPort } = state;
  const [isPromotion, setIsPromotion] = useState(false);
  const [flights, setFlights] = useState([]);
  const [priceIncreasing, setPriceIncreasing] = useState(true);
  const [timeIncreasing, setTimeIncreasing] = useState(true);
  const [selectedPrice, setSelectedPrice] = useState(null);

  let navigate = useNavigate();

  useEffect(() => {
    document.body.style.backgroundColor = 'white'
    getData()
  }, []);

  const getData = () => {
    fetch('flights.json')
      .then(function (response) {
        return response.json();
      })
      .then(function (resFlights) {
        reOrderFlights(resFlights.flights)
      });
  }

  const reOrderFlights = (_flights = flights, orderType = 'price') => {
    let sortedFlights = []
    if (orderType === 'price') {
      sortedFlights = _flights.sort((a, b) => parseFloat(a.fareCategories.ECONOMY.subcategories.filter(category => category.brandCode === 'ecoFly')[0].price.amount) - parseFloat(b.fareCategories.ECONOMY.subcategories.filter(category => category.brandCode === 'ecoFly')[0].price.amount));
      if (!priceIncreasing) {
        sortedFlights = sortedFlights.reverse();
      }
      setPriceIncreasing(!priceIncreasing)
    } else {
      if (timeIncreasing) {
        // return Date.parse('1970/01/01 ' + a.time.slice(0, -2) + ' ' + a.time.slice(-2)) - Date.parse('1970/01/01 ' + b.time.slice(0, -2) + ' ' + b.time.slice(-2))
        sortedFlights = _flights.sort((a, b) => Date.parse('1970/01/01 ' + a.arrivalDateTimeDisplay) - Date.parse('1970/01/01 ' + b.arrivalDateTimeDisplay));
      } else {
        sortedFlights = _flights.sort((a, b) => Date.parse('1970/01/01 ' + a.arrivalDateTimeDisplay) - Date.parse('1970/01/01 ' + b.arrivalDateTimeDisplay)).reverse();
      }
      setTimeIncreasing(!timeIncreasing)
    }
    setFlights(sortedFlights);
  }

  return (
    <div>
      <header className='child-header'>
        <span>turkishairlines.com</span>
        <span style={{ float: 'right' }}><span style={{ fontWeight: 'normal' }}>search</span>Flight Challenge</span>
      </header>
      <div className='flight-main-container'>
        {/* <div style={{ position: 'fixed', right: '50%', transform: 'translateX(50%)', marginTop: '5rem' }}> */}
        <span className='flight-miniheader'>Uçuş</span>
        <h1 className='header-flight'>{fromPort.city.name} - {toPort.city.name}, {passCount} Yolcu</h1>
        <div className='py-3 flex'>
          <span style={{ fontWeight: '600' }}>Promosyon Kodu</span>
          <InputSwitch className='ml-3 promotion' checked={isPromotion} onChange={(e) => setIsPromotion(e.value)} />
        </div>
        {
          isPromotion &&
          <div style={{ marginBottom: '2rem' }}>
            <h3>Promosyon Kodu seçeneği ile tüm Economy kabini Eco Fly paketlerini %50 indirimle satın alabilirsiniz!</h3>
            <h3>Promosyon Kodu seçeneği aktifken Eco Fly paketi haricinde seçim yapılamamaktadır.</h3>
          </div>
        }
        <nav style={{ textAlign: 'end', backgroundColor: '#242a38', padding: '8px 5px' }}>
          <span style={{ color: 'white', fontSize: '12px' }}>Sıralama Kriteri</span>
          <button className='ml-4' onClick={() => reOrderFlights()}>Ekonomi Kabin Ücreti</button>
          <button className='ml-2' onClick={() => reOrderFlights(flights, 'arrivalTime')}>Kalkış Saati</button>
        </nav>
        <div className='flight-container'>
          {
            flights.map(flight => {
              return (
                <div className='flight-outer-row'>
                  <div className='flight-inner-row'>
                    <div className='flight-outer'>
                      <div className='flight-inner'>
                        <div className='flight-info'>
                          <div className='flight-from-to'>
                            <div className='flight-from'>
                              <div className='time'>{flight.arrivalDateTimeDisplay}</div>
                              <div className='airport' style={{ padding: '0 25px 0 0' }}>{flight.originAirport.code}</div>
                              <div className='city-name' style={{ maxWidth: '70px', position: 'absolute' }}>{flight.originAirport.city.name}</div>
                            </div>
                            <div className='flight-to'>
                              <div className='time'>{flight.departureDateTimeDisplay}</div>
                              <div className='airport' style={{ padding: '0 0 0 25px' }}>{flight.destinationAirport.code}</div>
                              <div className='city-name'>{flight.destinationAirport.city.name}</div>
                            </div>
                          </div>
                        </div>
                        <div className='flight-duration'>
                          <div className='duration-info-text'>Uçuş Süresi</div>
                          <div className='duration-text'>{flight.flightDuration}</div>
                        </div>
                      </div>
                    </div>
                    {
                      ['ECONOMY', 'BUSINESS'].map(fltType => {
                        let price = flight.fareCategories[fltType].subcategories.filter(category => category.brandCode === 'ecoFly')[0].price.amount
                        let currency = flight.fareCategories[fltType].subcategories.filter(category => category.brandCode === 'ecoFly')[0].price.currency
                        let priceDecimal = price.toString().split('.').length > 1 ? price.toString().split('.')[1] : null
                        return (
                          <div id={`${fltType}_${flight.arrivalDateTimeDisplay}`} className={`price ${selectedPrice === `${fltType}_${flight.arrivalDateTimeDisplay}` ? 'opened' : ''}`} onClick={(e) => {
                            setSelectedPrice(e.currentTarget.id === selectedPrice ? null : e.currentTarget.id)
                          }}>
                            <div className='price-inner'>
                              <span className='category-radio'>
                                <input type='radio'></input>
                                <span className={`check ${selectedPrice === `${fltType}_${flight.arrivalDateTimeDisplay}` ? 'checked' : ''}`}></span>
                                <em>{fltType}</em>
                              </span>
                              <div className='price-info'>
                                <div style={{ color: '#697886', fontSize: '10px' }}>Yolcu başına</div>
                                <div style={{ color: '#262e3b', fontSize: '16px', fontWeight: '700' }}>
                                  <span style={{ paddingRight: '6px' }}>{currency}</span>
                                  <span>{Math.trunc(price)}</span>
                                  {priceDecimal && <span style={{ fontSize: '55%', verticalAlign: 'super' }}>{priceDecimal}</span>}
                                </div>
                              </div>
                              <span className='open-details'>
                                <i style={{ transform: `${selectedPrice === `${fltType}_${flight.arrivalDateTimeDisplay}` ? 'rotate(180deg)' : 'rotate(0)'}` }} className={`open-arrow pi pi-chevron-down`}></i>
                              </span>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                  {
                    ['ECONOMY', 'BUSINESS'].map(fltType => {
                      return (
                        <div id={`${fltType}_${flight.arrivalDateTimeDisplay}_options`} className={`flight-options-outer ${`${fltType}_${flight.arrivalDateTimeDisplay}_options`.startsWith(selectedPrice) ? 'visible' : ''}`}>
                          <div className='flight-options-inner'>
                            <div className='flight-options'>
                              {
                                flight.fareCategories[fltType].subcategories.map((flightOption, index) => {
                                  let priceOptDecimal = flightOption.price.amount.toString().split('.').length > 0 ? flightOption.price.amount.toString().split('.')[1] : null
                                  return (
                                    <div className='flight-option-box' style={{ marginLeft: index > 0 ? '10px' : '' }}>
                                      <div className='flight-header'>
                                        <div className='flight-detail'>
                                          <div className='flight-type'>{flightOption.brandCode.charAt(0).toUpperCase() + flightOption.brandCode.slice(1)}</div>
                                        </div>
                                        <div className='flight-price'>
                                          <span className="flight-price-currency">{flightOption.price.currency}</span>
                                          <span className="flight-price-amount">{Math.trunc(flightOption.price.amount)}</span>
                                          {priceOptDecimal && <span style={{ fontSize: '55%', verticalAlign: 'super' }}>.{priceOptDecimal}</span>}
                                        </div>
                                      </div>
                                      <div className='flight-info-box'>
                                        <ul>
                                          {
                                            flightOption.rights.map(currRight => {
                                              return (<li><span>{currRight}</span></li>)
                                            })
                                          }
                                        </ul>
                                      </div>
                                      <a id={`${fltType}_${flight.arrivalDateTimeDisplay}_${flightOption.brandCode}`} onClick={(e) => isPromotion && flightOption.brandCode !== 'ecoFly' ? e.stopPropagation() : navigate('/resultFlight', { state: { availability: flightOption.status, unitPrice: flightOption.price.amount, currency: flightOption.price.currency, passegnerCount: passCount, isPromotion: isPromotion } })} className={`flight-select-button ${isPromotion && flightOption.brandCode !== 'ecoFly' ? 'disabled' : ''}`}>Uçuşu seç</a>
                                    </div>
                                  )
                                })
                              }
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              )
            })
          }

        </div>
      </div>
    </div >
  );
}

export default Flight;
