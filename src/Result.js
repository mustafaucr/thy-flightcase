import './result.css';
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { AiFillCheckCircle, AiFillCloseCircle } from "react-icons/ai";

function Main() {
    const { state } = useLocation();
    let navigate = useNavigate();

    const { availability, unitPrice, currency, passegnerCount, isPromotion } = state;

    const [isAvailable, setIsAvailable] = useState(availability === 'ERROR' ? false : true);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        document.body.style.backgroundColor = 'white'
        let _totalPrice = isPromotion ? (unitPrice * passegnerCount) / 2 : unitPrice * passegnerCount
        setTotalPrice(_totalPrice)
    }, []);

    return (
        <div>
            <header className='result-main-header'>
                <span>turkishairlines.com</span>
                <span style={{ float: 'right' }}><span style={{ fontWeight: 'normal' }}>search</span>Flight Challenge</span>
            </header>
            <div className='mr-auto ml-auto result-main-container'>
                <div className='result-header'>
                    {
                        isAvailable ? <AiFillCheckCircle size={25} color='#53c172' /> : <AiFillCloseCircle size={25} color='#E81932' />
                    }
                    <span className='ml-4' style={{ fontWeight: '600' }}>{`${isAvailable ? 'Kabin seçiminiz tamamlandı' : 'Kabin seçiminiz tamamlanamadı'}`}</span>
                </div>
                <div className='mt-2'>
                    {
                        isAvailable ?
                            <>
                                <span style={{ fontSize: '30px', fontWeight: '100' }}>Toplam tutar</span>
                                <span className='result-amount'>{currency} {totalPrice}</span>
                            </>
                            :
                            <button className='result-backbutton' onClick={() => navigate('/')}>Başa Dön</button>
                    }
                </div>
            </div>
        </div >
    );
}

export default Main;