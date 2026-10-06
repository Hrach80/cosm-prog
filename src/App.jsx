import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import {
  Calendar,
  Clock,
  Phone,
  Trash2,
  Plus,
  ChevronLeft,
  User,
  FileText,
  LogOut,
  Eye,
  EyeOff,
  Edit2
} from 'lucide-react';
import './App.css';

// Ներմուծում ենք եղանակային նկարները src/assets պանակից
import winterImg from './assets/winter.jpg';
import springImg from './assets/spring.jpg';
import summerImg from './assets/summer.jpg';
import autumnImg from './assets/autumn.jpg';

export default function App() {
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [currentView, setCurrentView] = useState('year'); // Սկզբնական տեսքը՝ 'year'
  const [selectedDate, setSelectedDate] = useState(null);

  // Ստանում ենք ընթացիկ տարին, ամիսը և օրը
  const now = new Date();
  const currentSystemYear = String(now.getFullYear());
  const currentSystemMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentSystemDayFormatted = `${currentSystemYear}-${currentSystemMonth}-${String(now.getDate()).padStart(2, '0')}`;

  const [selectedYear, setSelectedYear] = useState(currentSystemYear);
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);

  const [appointments, setAppointments] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientService, setClientService] = useState('');
  const [clientPrice, setClientPrice] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session) {
      fetchAppointments();
    }
  }, [session]);

  const fetchAppointments = async () => {
    if (!session) return;
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .eq('user_id', session.user.id);

    if (error) {
      console.error('Սխալ տվյալներ ստանալիս:', error);
    } else {
      setAppointments(data || []);
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError('');

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setAuthError(error.message);
      else alert('Դուք հաջողությամբ գրանցվեցիք։');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError('Սխալ էլ. փոստ կամ գաղտնաբառ');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const workingHours = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00', '23:00'
  ];

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

  const monthThemes = {
    '12': { image: winterImg, accent: '#38bdf8' },
    '01': { image: winterImg, accent: '#38bdf8' },
    '02': { image: winterImg, accent: '#38bdf8' },
    '03': { image: springImg, accent: '#4ade80' },
    '04': { image: springImg, accent: '#4ade80' },
    '05': { image: springImg, accent: '#4ade80' },
    '06': { image: summerImg, accent: '#facc15' },
    '07': { image: summerImg, accent: '#facc15' },
    '08': { image: summerImg, accent: '#facc15' },
    '09': { image: autumnImg, accent: '#fb923c' },
    '10': { image: autumnImg, accent: '#fb923c' },
    '11': { image: autumnImg, accent: '#fb923c' },
  };

  const currentTheme = monthThemes[selectedMonth] || monthThemes['09'];
  const currentYearNum = new Date().getFullYear();
  const yearsList = Array.from({ length: 21 }, (_, i) => String(currentYearNum + i));

  const getMonthDaysArray = (yearStr, monthStr) => {
    const y = parseInt(yearStr);
    const m = parseInt(monthStr);
    const firstDay = new Date(y, m - 1, 1).getDay();
    const totalDays = new Date(y, m, 0).getDate();

    const arr = [];
    for (let i = 0; i < firstDay; i++) {
      arr.push({ empty: true, id: `empty-${m}-${i}` });
    }
    for (let i = 1; i <= totalDays; i++) {
      const formattedDay = i < 10 ? `0${i}` : `${i}`;
      arr.push({
        empty: false,
        date: `${yearStr}-${monthStr}-${formattedDay}`,
        dayNum: i,
      });
    }
    return arr;
  };

  const daysInMonth = getMonthDaysArray(selectedYear, selectedMonth);

  const getAppointmentsCountForDate = (dateStr) => {
    return appointments.filter(app => {
      if (!app.date) return false;
      const appDate = String(app.date).substring(0, 10);
      return appDate === dateStr;
    }).length;
  };

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setCurrentView('day');
  };

  const handleMonthCardClick = (monthValue) => {
    setSelectedMonth(monthValue);
    setCurrentView('month');
  };

  const handleFreeSlotClick = (hour) => {
    setEditingAppointmentId(null);
    setStartTime(hour);
    const hourNum = parseInt(hour.substring(0, 2), 10);
    const endHourStr = `${hourNum + 1 < 10 ? '0' : ''}${hourNum + 1}:00`;
    setEndTime(endHourStr);

    setClientName('');
    setClientPhone('');
    setClientService('');
    setClientPrice('');
    setIsModalOpen(true);
  };

  const handleEditAppointmentClick = (appointment, e) => {
    e.stopPropagation();
    setEditingAppointmentId(appointment.id);

    if (appointment.time && appointment.time.includes('-')) {
      const parts = appointment.time.split('-').map(p => p.trim());
      setStartTime(parts[0].substring(0, 5));
      setEndTime(parts[1].substring(0, 5));
    } else {
      setStartTime('09:00');
      setEndTime('10:00');
    }

    setClientName(appointment.name || '');
    setClientPhone(appointment.phone === 'EMPTY' ? '' : (appointment.phone || ''));
    setClientService(appointment.service || '');
    setClientPrice(appointment.price !== null && appointment.price !== undefined ? String(appointment.price) : '');
    setIsModalOpen(true);
  };

  const handleSaveAppointment = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const recordData = {
      user_id: session.user.id,
      date: selectedDate,
      time: `${startTime} - ${endTime}`,
      name: clientName,
      phone: clientPhone ? clientPhone : 'EMPTY',
      service: clientService,
      price: clientPrice !== '' ? Number(clientPrice) : 0,
    };

    let error;
    if (editingAppointmentId) {
      const res = await supabase
        .from('appointments')
        .update(recordData)
        .eq('id', editingAppointmentId);
      error = res.error;
    } else {
      const res = await supabase.from('appointments').insert([recordData]);
      error = res.error;
    }

    setIsSubmitting(false);

    if (error) {
      console.error('Սխալ գրանցումը պահպանելիս:', error);
      alert('Չհաջողվեց պահպանել գրանցումը: ' + error.message);
    } else {
      await fetchAppointments();
      setIsModalOpen(false);
      setEditingAppointmentId(null);
    }
  };

  const handleDeleteAppointment = async (id, e) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Վստա՞հ եք, որ ցանկանում եք ջնջել այս գրանցումը:')) return;

    const { error } = await supabase.from('appointments').delete().eq('id', id);

    if (error) {
      console.error('Սխալ գրանցումը ջնջելիս:', error);
      alert('Չհաջողվեց ջնջել գրանցումը: ' + error.message);
    } else {
      await fetchAppointments();
      setIsModalOpen(false);
    }
  };

  const monthlyRevenue = appointments
    .filter(app => {
      if (!app.date) return false;
      const appDate = String(app.date).substring(0, 10);
      return appDate.startsWith(`${selectedYear}-${selectedMonth}`);
    })
    .reduce((sum, app) => sum + Number(app.price || 0), 0);

  const yearlyRevenue = appointments
    .filter(app => {
      if (!app.date) return false;
      const appDate = String(app.date).substring(0, 10);
      return appDate.startsWith(`${selectedYear}`);
    })
    .reduce((sum, app) => sum + Number(app.price || 0), 0);

  if (!session) {
    return (
      <div
        className="auth-container"
        style={{
          backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${winterImg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: '#f8fafc'
        }}
      >
        <div className="auth-card">
          <h2>{isSignUp ? 'Հաշվի ստեղծում' : 'Մուտք Համակարգ'}</h2>
          <p className="modal-subtitle">{isSignUp ? 'Լրացրեք տվյալները գրանցվելու համար' : 'Մուտք գործեք ձեր օրացույցից օգտվելու համար'}</p>

          {authError && <p style={{ color: '#ff453a', fontSize: '0.8rem', textAlign: 'center', marginBottom: '10px' }}>{authError}</p>}

          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>Էլ. փոստ (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
              />
            </div>
            <div className="form-group">
              <label>Գաղտնաբառ (Password)</label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="******"
                  style={{ width: '100%', paddingRight: '40px' }}
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    cursor: 'pointer',
                    color: '#94a3b8',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
            </div>
            <button type="submit" className="save-btn" style={{ width: '100%', marginTop: '10px', background: '#38bdf8', color: '#0f172a' }}>
              {isSignUp ? 'Գրանցվել' : 'Մուտք'}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
            {isSignUp ? 'Արդե՞ն ունեք հաշիվ:' : 'Չունե՞ք հաշիվ:'}{' '}
            <span
              style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? 'Մուտք գործեք' : 'Գրանցվեք'}
            </span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="mobile-container"
      style={{
        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.75)), url(${currentTheme.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'background-image 0.6s ease-in-out',
        color: '#f8fafc'
      }}
    >
      <header className="app-header">
        {currentView === 'day' ? (
          <>
            <button className="back-btn" onClick={() => setCurrentView('month')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronLeft size={18} /> Ամիս
            </button>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <Calendar size={16} color={currentTheme.accent} /> {selectedDate}
            </h1>
            <button className="back-btn" onClick={handleLogout} title="Ելք" style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a' }}>
              <LogOut size={16} />
            </button>
          </>
        ) : currentView === 'month' ? (
          <>
            <button className="back-btn" onClick={() => setCurrentView('year')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronLeft size={18} /> Տարի
            </button>
            <div style={{ display: 'flex', gap: '8px' }}>
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
            <button className="back-btn" onClick={handleLogout} title="Ելք" style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', padding: '8px' }}>
              <LogOut size={16} />
            </button>
          </>
        ) : (
          <div className="header-title-block" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>{selectedYear}</h1>
            <select
              className="select-dropdown"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {yearsList.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <button className="back-btn" onClick={handleLogout} title="Ելք համակարգից" style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', padding: '8px' }}>
              <LogOut size={16} />
            </button>
          </div>
        )}
      </header>

      {/* ՏԱՐԵԿԱՆ ՏԵՍՔ (3 ամիսը կողք կողքի ցանցով) */}
      {currentView === 'year' && (
        <div className="year-grid-container" style={{ overflowY: 'auto', flex: 1, paddingBottom: '10px' }}>
          <div className="months-grid-3cols">
            {monthsList.map(m => {
              const isCurrentMonth = selectedYear === currentSystemYear && m.value === currentSystemMonth;
              const mDays = getMonthDaysArray(selectedYear, m.value);

              return (
                <div
                  key={m.value}
                  onClick={() => handleMonthCardClick(m.value)}
                  style={{
                    background: 'rgba(15, 23, 42, 0.65)',
                    border: isCurrentMonth ? '2px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '12px',
                    padding: '6px',
                    cursor: 'pointer',
                    backdropFilter: 'blur(6px)',
                    boxShadow: isCurrentMonth ? '0 0 12px rgba(56, 189, 248, 0.35)' : 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '4px', textAlign: 'center', color: isCurrentMonth ? '#38bdf8' : '#f8fafc' }}>
                    {m.name}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontSize: '0.5rem', color: '#94a3b8', marginBottom: '2px' }}>
                    <span>Կ</span><span>Ե</span><span>Ե</span><span>Չ</span><span>Հ</span><span>Ո</span><span>Շ</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', textAlign: 'center', fontSize: '0.6rem' }}>
                    {mDays.map((d, idx) => {
                      if (d.empty) return <div key={`e-${idx}`} />;
                      const isToday = d.date === currentSystemDayFormatted;
                      return (
                        <div
                          key={d.date}
                          style={{
                            padding: '2px 0',
                            borderRadius: '3px',
                            background: isToday ? '#38bdf8' : 'transparent',
                            color: isToday ? '#0f172a' : '#f8fafc',
                            fontWeight: isToday ? 'bold' : 'normal'
                          }}
                        >
                          {d.dayNum}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ԱՄՍՎԱ ՏԵՍՔ */}
      {currentView === 'month' && (
        <div className="month-grid-container">
          <div className="weekdays-header">
            <span>Կիր</span><span>Երկ</span><span>Երք</span><span>Չոր</span><span>Հին</span><span>Ուրբ</span><span>Շաբ</span>
          </div>
          <div className="days-grid">
            {daysInMonth.map((d) => {
              if (d.empty) {
                return <div key={d.id} className="calendar-day-cell empty-cell" style={{ opacity: 0, pointerEvents: 'none' }} />;
              }

              const isCurrentDay = d.date === currentSystemDayFormatted;
              const count = getAppointmentsCountForDate(d.date);
              const hasApp = count > 0;

              return (
                <div
                  key={d.date}
                  className={`calendar-day-cell ${hasApp ? 'has-appointment' : ''} ${isCurrentDay ? 'current-day' : ''}`}
                  onClick={() => handleDayClick(d.date)}
                  style={isCurrentDay ? { borderColor: currentTheme.accent, boxShadow: `0 0 10px ${currentTheme.accent}` } : {}}
                >
                  <span>{d.dayNum}</span>
                  {hasApp && <div className="appointment-badge" style={{ background: currentTheme.accent, color: '#0f172a' }}>{count}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ՕՐՎԱ ՏԵՍՔ */}
      {currentView === 'day' && (
        <div className="day-timeline">
          {workingHours.map((hour) => {
            const appointment = appointments.find(app => {
              if (!app.date) return false;
              const appDate = String(app.date).substring(0, 10);
              if (appDate !== selectedDate) return false;
              if (!app.time) return false;

              const parts = app.time.split('-').map(p => p.trim());
              if (parts.length === 2) {
                const startTimeOnly = parts[0].substring(0, 5);
                const endTimeOnly = parts[1].substring(0, 5);
                return hour >= startTimeOnly && hour < endTimeOnly;
              }

              return app.time.startsWith(hour) || app.time.startsWith(hour.substring(0, 2));
            });

            return (
              <div key={hour} className="time-slot-row">
                <div className="slot-time" style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                  <Clock size={20} color={currentTheme.accent} /> {hour}
                </div>
                <div
                  className={`slot-content ${appointment ? 'booked' : 'free-slot'}`}
                  onClick={() => !appointment && handleFreeSlotClick(hour)}
                  style={{ cursor: appointment ? 'default' : 'pointer' }}
                >
                  {appointment ? (
                    <>
                      <div className="client-info-row">
                        <span className="client-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <User size={14} color={currentTheme.accent} /> {appointment.name}
                        </span>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          {appointment.phone && appointment.phone !== 'EMPTY' && (
                            <a href={`tel:${appointment.phone}`} className="call-link" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Phone size={12} /> {appointment.phone}
                            </a>
                          )}
                          <button
                            onClick={(e) => handleEditAppointmentClick(appointment, e)}
                            style={{
                              background: 'rgba(56, 189, 248, 0.2)',
                              color: '#38bdf8',
                              border: 'none',
                              padding: '5px 8px',
                              borderRadius: '10px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title="Խմբագրել"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAppointment(appointment.id, e)}
                            style={{
                              background: 'rgba(255, 59, 48, 0.2)',
                              color: '#ff453a',
                              border: 'none',
                              padding: '5px 8px',
                              borderRadius: '10px',
                              fontSize: '0.75rem',
                              fontWeight: '600',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="service-details">
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FileText size={12} /> {appointment.service} ({appointment.time})
                        </span>
                        <span className="service-price" style={{ color: currentTheme.accent }}>{appointment.price || 0} ֏</span>
                      </div>
                    </>
                  ) : (
                    <div style={{ color: '#94a3b8', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={14} /> Ազատ է (Գրանցել)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-box">
            <div className="modal-header-indicator"></div>
            <h3>{editingAppointmentId ? 'Խմբագրել գրանցումը' : `Գրանցում՝ ${selectedDate}`}</h3>
            <p className="modal-subtitle">Նշեք ժամային միջակայքը և տվյալները</p>

            <form onSubmit={handleSaveAppointment}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Սկիզբ</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="end-group form-group" style={{ flex: 1 }}>
                  <label>Ավարտ</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Հաճախորդի անուն</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Օր. Հաճախորդի անուն"
                />
              </div>
              <div className="form-group">
                <label>Հեռախոսահամար (Կամընտիր)</label>
                <input
                  type="text"
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
                  placeholder="Օր. Ծառայության անվանում"
                />
              </div>
              <div className="form-group">
                <label>Գին (֏) (Կամընտիր)</label>
                <input
                  type="number"
                  value={clientPrice}
                  onChange={(e) => setClientPrice(e.target.value)}
                  placeholder="Ծառայության գինը"
                />
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>Չեղարկել</button>
                {editingAppointmentId && (
                  <button type="button" onClick={(e) => handleDeleteAppointment(editingAppointmentId, e)} style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>
                    <Trash2 size={16} />
                  </button>
                )}
                <button
                  type="submit"
                  className="save-btn"
                  disabled={isSubmitting}
                  style={{ flex: 1, background: currentTheme.accent, color: '#0f172a', opacity: isSubmitting ? 0.7 : 1 }}
                >
                  {isSubmitting ? 'Պահպանվում է...' : 'Պահպանել'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="financial-footer">
        <div className="finance-item">
          <span className="finance-label" style={{ color: '#94a3b8' }}>Ամսվա վաստակ</span>
          <span className="finance-value" style={{ color: currentTheme.accent, display: 'flex', alignItems: 'center', gap: '2px' }}>
            {monthlyRevenue.toLocaleString()} ֏
          </span>
        </div>
        <div className="finance-item" style={{ textAlign: 'right' }}>
          <span className="finance-label" style={{ color: '#94a3b8' }}>Տարեկան վաստակ ({selectedYear})</span>
          <span className="finance-value" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
            {yearlyRevenue.toLocaleString()} ֏
          </span>
        </div>
      </footer>
    </div>
  );
}