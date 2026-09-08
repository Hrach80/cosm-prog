import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import './App.css';

export default function App() {
  const [currentView, setCurrentView] = useState('month'); // 'month' | 'day'
  const [selectedDate, setSelectedDate] = useState(null);

  // Տարվա և ամսվա ընտրության վիճակներ
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('08'); // Օգոստոս

  // Գրանցումների զանգվածը բազայից
  const [appointments, setAppointments] = useState([]);

  // Նոր գրանցման մոդալի (պատուհանի) վիճակներ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHourForNew, setSelectedHourForNew] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientService, setClientService] = useState('');
  const [clientPrice, setClientPrice] = useState('');

  // Բազայից տվյալների բեռնում բացվելիս
  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    const { data, error } = await supabase.from('appointments').select('*');
    if (error) {
      console.error('Սխալ տվյալներ ստանալիս:', error);
    } else {
      setAppointments(data || []);
    }
  };

  // Աշխատանքային ժամեր
  const workingHours = ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'];

  // Ամիսների ցանկ
  const monthsList = [
    { value: '01', name: 'Հունվար' },
    { value: '02', name: 'Փետրվար' },
    { value: '03', name: 'Մարտ' },
    { value: '04', name: 'Ապրիլ' },
    { value: '05', name: 'Մայիս' },
    { value: '06', name: 'Հունիս' },
    { value: '07', name: 'Հուլիս' },
    { value: '08', name: 'Օգոստոս' },
    { value: '09', name: 'Սեպտեմբեր' },
    { value: '10', name: 'Հոկտեմբեր' },
    { value: '11', name: 'Նոյեմբեր' },
    { value: '12', name: 'Դեկտեմբեր' },
  ];

  // Տարիների ցանկ
  const yearsList = ['2024', '2025', '2026', '2027'];

  // Ընտրված ամսվա օրերի գեներացիա
  const daysInMonth = Array.from({ length: 31 }, (_, i) => {
    const dayNum = i + 1;
    const formattedDay = dayNum < 10 ? `0${dayNum}` : `${dayNum}`;
    return {
      date: `${selectedYear}-${selectedMonth}-${formattedDay}`,
      dayNum: dayNum,
    };
  });

  // Ստանալ տվյալ օրվա գրանցումների քանակը
  const getAppointmentsCountForDate = (dateStr) => {
    return appointments.filter(app => app.date === dateStr).length;
  };

  // Օրվա վրա սեղմելիս
  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setCurrentView('day');
  };

  // Երբ սեղմում են ազատ ժամի վրա՝ բացել ֆորման
  const handleFreeSlotClick = (hour) => {
    setSelectedHourForNew(hour);
    setClientName('');
    setClientPhone('');
    setClientService('');
    setClientPrice('');
    setIsModalOpen(true);
  };

  // Նոր գրանցման պահպանում Supabase-ում (առանց .select()-ի, ուղղակի fetch)
  const handleSaveAppointment = async (e) => {
    e.preventDefault();

    const newRecord = {
      date: selectedDate,
      time: selectedHourForNew,
      name: clientName,
      phone: clientPhone,
      service: clientService,
      price: Number(clientPrice),
    };

    const { error } = await supabase.from('appointments').insert([newRecord]);

    if (error) {
      console.error('Սխալ գրանցումը պահպանելիս:', error);
      alert('Չհաջողվեց պահպանել գրանցումը: ' + error.message);
    } else {
      await fetchAppointments();
      setIsModalOpen(false);
    }
  };

  // ՖԻՆԱՆՍԱԿԱՆ ՀԱՇՎԱՐԿՆԵՐ ԲԱԶԱՅԻՑ
  const monthlyRevenue = appointments
    .filter(app => app.date && app.date.startsWith(`${selectedYear}-${selectedMonth}`))
    .reduce((sum, app) => sum + Number(app.price || 0), 0);

  const yearlyRevenue = appointments
    .filter(app => app.date && app.date.startsWith(`${selectedYear}`))
    .reduce((sum, app) => sum + Number(app.price || 0), 0);

  return (
    <div className="mobile-container">
      {/* Վերնագիր և Նավիգացիա */}
      <header className="app-header">
        {currentView === 'day' ? (
          <>
            <button className="back-btn" onClick={() => setCurrentView('month')}>
              ← Ամիս
            </button>
            <h1>{selectedDate}</h1>
            <div style={{ width: '40px' }}></div>
          </>
        ) : (
          <div className="header-title-block">
            <select
              className="select-dropdown"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              {monthsList.map(m => (
                <option key={m.value} value={m.value}>{m.name}</option>
              ))}
            </select>

            <select
              className="select-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearsList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        )}
      </header>

      {/* 1. Ամսվա տեսք (Month View) */}
      {currentView === 'month' && (
        <div className="month-grid-container">
          <div className="weekdays-header">
            <span>Կիր</span><span>Երկ</span><span>Երք</span><span>Չոր</span><span>Հին</span><span>Ուրբ</span><span>Շաբ</span>
          </div>
          <div className="days-grid">
            {daysInMonth.map((d) => {
              const count = getAppointmentsCountForDate(d.date);
              const hasApp = count > 0;
              return (
                <div
                  key={d.date}
                  className={`calendar-day-cell ${hasApp ? 'has-appointment' : ''}`}
                  onClick={() => handleDayClick(d.date)}
                >
                  <span>{d.dayNum}</span>
                  {hasApp && <div className="appointment-badge">{count}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. Օրվա ժամային տեսք (Day Hourly View) */}
      {currentView === 'day' && (
        <div className="day-timeline">
          {workingHours.map((hour) => {
            const appointment = appointments.find(
              app => app.date === selectedDate && app.time && app.time.startsWith(hour.substring(0, 2))
            );

            return (
              <div key={hour} className="time-slot-row">
                <div className="slot-time">{hour}</div>
                <div
                  className={`slot-content ${appointment ? 'booked' : 'free-slot'}`}
                  onClick={() => !appointment && handleFreeSlotClick(hour)}
                  style={{ cursor: appointment ? 'default' : 'pointer' }}
                >
                  {appointment ? (
                    <>
                      <div className="client-info-row">
                        <span className="client-name">{appointment.name}</span>
                        <a href={`tel:${appointment.phone}`} className="call-link" onClick={(e) => e.stopPropagation()}>
                          📞 {appointment.phone}
                        </a>
                      </div>
                      <div className="service-details">
                        <span>{appointment.service}</span>
                        <span className="service-price">{appointment.price} ֏</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#8e8e93', fontSize: '0.85rem' }}>Ազատ է (սեղմեք գրանցելու համար)</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Նոր գրանցման Մոդալ (Modal) պատուհան */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header-indicator"></div>
            <h3>Գրանցում՝ {selectedDate}</h3>
            <p className="modal-subtitle">Ժամը՝ {selectedHourForNew}</p>

            <form onSubmit={handleSaveAppointment}>
              <div className="form-group">
                <label>Հաճախորդի անուն</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Օր. Աննա Սարգսյան"
                />
              </div>
              <div className="form-group">
                <label>Հեռախոսահամար</label>
                <input
                  type="text"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+374..."
                />
              </div>
              <div className="form-group">
                <label>Ծառայություն</label>
                <input
                  type="text"
                  required
                  value={clientService}
                  onChange={(e) => setClientService(e.target.value)}
                  placeholder="Օր. Դեմքի մաքրություն"
                />
              </div>
              <div className="form-group">
                <label>Գին (֏)</label>
                <input
                  type="number"
                  required
                  value={clientPrice}
                  onChange={(e) => setClientPrice(e.target.value)}
                  placeholder="15000"
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)}>Չեղարկել</button>
                <button type="submit" className="save-btn">Պահպանել</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Ներքևի հատված՝ Ամսական և Տարեկան եկամուտների ցուցիչով */}
      <footer className="financial-footer">
        <div className="finance-item">
          <span className="finance-label">Ամսվա վաստակ</span>
          <span className="finance-value" style={{ color: '#0071e3' }}>{monthlyRevenue.toLocaleString()} ֏</span>
        </div>
        <div className="finance-item" style={{ textAlign: 'right' }}>
          <span className="finance-label">Տարեկան վաստակ ({selectedYear})</span>
          <span className="finance-value" style={{ color: '#34c759' }}>{yearlyRevenue.toLocaleString()} ֏</span>
        </div>
      </footer>
    </div>
  );
}