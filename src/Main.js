import './main.css';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { IoIosPeople, IoIosPerson } from "react-icons/io";
import { BsChevronRight } from "react-icons/bs";
import React, { useState, useEffect, useRef } from 'react';
import { RiCalendarEventLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { RadioButton } from 'primereact/radiobutton';
import { OverlayPanel } from 'primereact/overlaypanel';
import { AutoComplete } from 'primereact/autocomplete';
import { GiAirplaneDeparture, GiAirplaneArrival } from "react-icons/gi";

import airportsData from './airports.json';

function Main() {
    let navigate = useNavigate();

    const categories = [{ name: 'Economy Class', key: 'eco' }, { name: 'Business Class', key: 'business' }];
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState([]);
    const [toAirport, setToAirport] = useState(sessionStorage.getItem('toAirport') ? JSON.parse(sessionStorage.getItem('toAirport')) : null);
    const [passengerCount, setPassengerCount] = useState(sessionStorage.getItem('passengerCount') ? JSON.parse(sessionStorage.getItem('passengerCount')) < 1 ? 1 : JSON.parse(sessionStorage.getItem('passengerCount')) : 1);
    const [fromAirport, setFromAirport] = useState(sessionStorage.getItem('fromAirport') ? JSON.parse(sessionStorage.getItem('fromAirport')) : null);
    const [filteredAirports, setFilteredAirports] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(sessionStorage.getItem('selectedCategory') ? JSON.parse(sessionStorage.getItem('selectedCategory')) : categories[0]);

    const op = useRef(null);
    const toast = useRef(null);

    useEffect(() => {
        setAirports(airportsData.airports)
        document.body.style.backgroundColor = '#063048'
        getData()
    }, []);

    const getData = () => {
        fetch('flights.json')
            .then(function (response) {
                return response.json();
            })
            .then(function (resFlights) {
                setFlights(resFlights.flights)
            });
    }

    const searchAiport = (event) => {
        setTimeout(() => {
            let _filteredAirports;
            if (!event.query.trim().length) {
                _filteredAirports = [...airports];
            }
            else {
                _filteredAirports = airports.filter((airport) => {
                    return airport.name.toLowerCase().startsWith(event.query.toLowerCase());
                });
            }

            setFilteredAirports(_filteredAirports);
        }, 250);
    }

    const itemTemplate = (item) => {
        return (
            <div>{<GiAirplaneDeparture />}{item.name}</div>
        );
    }

    const updatePassengerCount = (counterType) => {
        if ((counterType === 'decrease' && passengerCount === 1) || (counterType === 'increase' && passengerCount === 9)) return
        setPassengerCount(counterType === 'increase' ? passengerCount + 1 : passengerCount - 1)
    }

    const showFlights = () => {
        if (!fromAirport) return toast.current.show({ severity: 'info', summary: 'Kalkış yerini seçiniz', life: 3000 });
        if (!toAirport) return toast.current.show({ severity: 'info', summary: 'Varış yerini seçiniz', life: 3000 });
        if (fromAirport.code === toAirport.code) return toast.current.show({ severity: 'info', summary: 'Kalkış ve varış noktaları birbirinden farklı olmalıdır', detail: 'Lütfen seçtiğiniz uçuş noktalarından birini değiştirin', life: 3000 });
        if (flights.map(flight => flight.originAirport.code).includes(fromAirport.code) && flights.map(flight => flight.destinationAirport.code).includes(toAirport.code)) {
            sessionStorage.setItem('fromAirport', JSON.stringify(fromAirport))
            sessionStorage.setItem('toAirport', JSON.stringify(toAirport))
            sessionStorage.setItem('passengerCount', JSON.stringify(passengerCount))
            sessionStorage.setItem('flightType', JSON.stringify(selectedCategory))
            navigate('/selectFlight', { state: { passCount: passengerCount, fromPort: fromAirport, toPort: toAirport } })
        } else {
            return toast.current.show({ severity: 'info', summary: 'Seçili yerler için uygun uçuş bulunamadı', life: 3000 });
        }
    }

    return (
        <>
            <Toast ref={toast} />
            <header className='main-header'>
                <span>turkishairlines.com</span>
                <span style={{ float: 'right' }}><span style={{ fontWeight: 'normal' }}>search</span>Flight Challenge</span>
            </header>
            {/* postion fixed, right 50%, transform: trasnlate 50% */}
            <div style={{ position: 'fixed', right: '50%', transform: 'translateX(50%)', marginTop: '5rem' }}>
                {/* <div style={{ position: 'absolute', margin: '5% 25% 0 25%' }}> */}
                <div style={{ textAlign: 'center' }}>
                    <h1 className='header-main'>Merhaba</h1>
                    <h2>Nereyi keşfetmek isterseniz?</h2>
                </div>
                <div className="grid" style={{ padding: '15px', backgroundColor: 'rgb(96 105 119 / 60%)' }}>
                    <div className="col flex py-0">
                        <span className="p-inputgroup-addon" style={{ background: 'white', borderRadius: '0' }}>
                            <GiAirplaneDeparture />
                        </span>
                        <AutoComplete className="autocomp-noborder" value={fromAirport} tooltip={fromAirport ? fromAirport.name : ''} tooltipOptions={{ position: 'bottom' }} placeholder='Nereden' suggestions={filteredAirports} completeMethod={searchAiport} field="name" onChange={(e) => setFromAirport(e.value)} itemTemplate={itemTemplate} />
                    </div>
                    <div className="col flex py-0">
                        <span className="p-inputgroup-addon" style={{ background: 'white', borderRadius: '0' }}>
                            <GiAirplaneArrival />
                        </span>
                        <AutoComplete className="autocomp-noborder" value={toAirport} tooltip={toAirport ? toAirport.name : ''} tooltipOptions={{ position: 'bottom' }} placeholder='Nereye' suggestions={filteredAirports} completeMethod={searchAiport} field="name" onChange={(e) => setToAirport(e.value)} itemTemplate={itemTemplate} />
                    </div>
                    <div className="col date-container">
                        <span className="mr-3">Tarih</span>
                        <RiCalendarEventLine size={30} color='#7c848c' />
                    </div>
                    <button onClick={(e) => op.current.show(e)} className="col passenger-button px-5">
                        <span className='passenger-count'>{`${passengerCount}`}</span>
                        {passengerCount > 1 ? <IoIosPeople className='passenger-icon' /> : <IoIosPerson className='passenger-icon' />}
                        <OverlayPanel ref={op} id="overlay_panel" style={{ borderRadius: '0px' }} onHide={(e) => {
                            console.log(e)
                        }}>
                            <header className="passenger-info">Kabin ve yolcu seçimi</header>
                            <div className="flex py-3">
                                {
                                    categories.map((category) => {
                                        return (
                                            <div key={category.key} className="field-radiobutton pr-4">
                                                <RadioButton inputId={category.key} name="category" value={category} onChange={(e) => setSelectedCategory(e.value)} checked={selectedCategory.key === category.key} />
                                                <label className="radio-label" htmlFor={category.key}>{category.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="flex">
                                <span style={{ fontWeight: 'bold' }}>Yolcu</span>
                                <span className="ml-auto flex align-items-center">
                                    <button onClick={() => updatePassengerCount('decrease')} className="passenger-counter pi pi-minus"></button>
                                    <span className="px-3">{passengerCount}</span>
                                    <button onClick={() => updatePassengerCount('increase')} className="passenger-counter pi pi-plus"></button>
                                </span>
                            </div>
                        </OverlayPanel>
                    </button>
                    <div className="col button-show">
                        <Button style={{ backgroundColor: '#E81932' }} label="" className="p-button-danger" icon={<BsChevronRight size={30} />} onClick={() => showFlights()} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default Main;