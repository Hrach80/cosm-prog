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
  Edit2,
  Globe,
  Search,
  X
} from 'lucide-react';
import './App.css';

// Ներմուծում ենք եղանակային նկարները src/assets պանակից
import winterImg from './assets/winter.jpg';
import springImg from './assets/spring.jpg';
import summerImg from './assets/summer.jpg';
import autumnImg from './assets/autumn.jpg';

// Թարգմանություններ
const translations = {
  am: {
    loginTitle: 'Մուտք Համակարգ',
    signupTitle: 'Հաշվի ստեղծում',
    loginSubtitle: 'Մուտք գործեք ձեր օրացույցից օգտվելու համար',
    signupSubtitle: 'Լրացրեք տվյալները գրանցվելու համար',
    emailLabel: 'Էլ. փոստ (Email)',
    passwordLabel: 'Գաղտնաբառ (Password)',
    loginBtn: 'Մուտք',
    signupBtn: 'Գրանցվել',
    hasAccount: 'Արդե՞ն ունեք հաշիվ:',
    noAccount: 'Չունե՞ք հաշիվ:',
    loginLink: 'Մուտք գործեք',
    signupLink: 'Գրանցվեք',
    month: 'Ամիս',
    year: 'Տարի',
    logout: 'Ելք',
    logoutSystem: 'Ելք համակարգից',
    monthText: 'Ամսվա վաստակ',
    yearlyText: 'Տարեկան վաստակ',
    freeSlot: 'Ազատ է (Գրանցել)',
    edit: 'Խմբագրել',
    delete: 'Ջնջել',
    modalCreateTitle: 'Գրանցում՝',
    modalEditTitle: 'Խմբագրել գրանցումը',
    modalSubtitle: 'Նշեք ժամային միջակայքը և տվյալները',
    startTime: 'Սկիզբ',
    endTime: 'Ավարտ',
    clientName: 'Հաճախորդի անուն',
    clientNamePlaceholder: 'Օր. Հաճախորդի անուն',
    clientPhone: 'Հեռախոսահամար (Կամընտիր)',
    service: 'Ծառայություն',
    servicePlaceholder: 'Օր. Ծառայության անվանում',
    price: 'Գին (֏) (Կամընտիր)',
    pricePlaceholder: 'Ծառայության գինը',
    cancel: 'Չեղարկել',
    save: 'Պահպանել',
    saving: 'Պահպանվում է...',
    deleteConfirm: 'Վստա՞հ եք, որ ցանկանում եք ջնջել այս գրանցումը:',
    chartTitle: 'Ամսական եկամուտների դինամիկան',
    dailyChartTitle: 'Ամսվա օրական եկամուտների դինամիկան',
    searchPlaceholder: 'Որոնել հաճախորդին (անուն կամ հեռախոս)...',
    noResults: 'Արդյունքներ չեն գտնվել',
    call: 'Զանգել',
    weekDays: ['Երկ', 'Երք', 'Չոր', 'Հին', 'Ուրբ', 'Շաբ', 'Կիր'],
    weekDaysShort: ['Ե', 'Ե', 'Չ', 'Հ', 'Ո', 'Շ', 'Կ'],
    monthsList: [
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
    ]
  },
  ru: {
    loginTitle: 'Вход в систему',
    signupTitle: 'Создание аккаунта',
    loginSubtitle: 'Войдите, чтобы пользоваться календарем',
    signupSubtitle: 'Заполните данные для регистрации',
    emailLabel: 'Эл. почта (Email)',
    passwordLabel: 'Пароль (Password)',
    loginBtn: 'Войти',
    signupBtn: 'Зарегистрироваться',
    hasAccount: 'Уже есть аккаунт?',
    noAccount: 'Нет аккаунта?',
    loginLink: 'Войдите',
    signupLink: 'Зарегистрируйтесь',
    month: 'Месяц',
    year: 'Год',
    logout: 'Выход',
    logoutSystem: 'Выход из системы',
    monthText: 'Доход за месяц',
    yearlyText: 'Доход за год',
    freeSlot: 'Свободно (Записать)',
    edit: 'Редактировать',
    delete: 'Удалить',
    modalCreateTitle: 'Запись:',
    modalEditTitle: 'Редактировать запись',
    modalSubtitle: 'Укажите временной интервал и данные',
    startTime: 'Начало',
    endTime: 'Конец',
    clientName: 'Имя клиента',
    clientNamePlaceholder: 'Имя клиента',
    clientPhone: 'Номер телефона (Необязательно)',
    service: 'Услуга',
    servicePlaceholder: 'Название услуги',
    price: 'Цена (֏) (Необязательно)',
    pricePlaceholder: 'Цена услуги',
    cancel: 'Отмена',
    save: 'Сохранить',
    saving: 'Сохранение...',
    deleteConfirm: 'Вы уверены, что хотите удалить эту запись?',
    chartTitle: 'Динамика месячных доходов',
    dailyChartTitle: 'Динамика ежедневных доходов за месяц',
    searchPlaceholder: 'Поиск клиента (имя или телефон)...',
    noResults: 'Результаты не найдены',
    call: 'Позвонить',
    weekDays: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'],
    weekDaysShort: ['П', 'В', 'С', 'Ч', 'П', 'С', 'В'],
    monthsList: [
      { value: '01', name: 'Январь' },
      { value: '02', name: 'Февраль' },
      { value: '03', name: 'Март' },
      { value: '04', name: 'Апрель' },
      { value: '05', name: 'Май' },
      { value: '06', name: 'Июнь' },
      { value: '07', name: 'Июль' },
      { value: '08', name: 'Август' },
      { value: '09', name: 'Сентябрь' },
      { value: '10', name: 'Октябрь' },
      { value: '11', name: 'Ноябрь' },
      { value: '12', name: 'Декабрь' },
    ]
  },
  en: {
    loginTitle: 'Sign In',
    signupTitle: 'Create Account',
    loginSubtitle: 'Sign in to use your calendar',
    signupSubtitle: 'Fill in the details to register',
    emailLabel: 'Email',
    passwordLabel: 'Password',
    loginBtn: 'Sign In',
    signupBtn: 'Sign Up',
    hasAccount: 'Already have an account?',
    noAccount: "Don't have an account?",
    loginLink: 'Sign In',
    signupLink: 'Sign Up',
    month: 'Month',
    year: 'Year',
    logout: 'Logout',
    logoutSystem: 'Logout',
    monthText: 'Monthly Revenue',
    yearlyText: 'Yearly Revenue',
    freeSlot: 'Free (Book)',
    edit: 'Edit',
    delete: 'Delete',
    modalCreateTitle: 'Appointment:',
    modalEditTitle: 'Edit Appointment',
    modalSubtitle: 'Specify time range and details',
    startTime: 'Start',
    endTime: 'End',
    clientName: 'Client Name',
    clientNamePlaceholder: 'Client name',
    clientPhone: 'Phone Number (Optional)',
    service: 'Service',
    servicePlaceholder: 'Service name',
    price: 'Price (֏) (Optional)',
    pricePlaceholder: 'Service price',
    cancel: 'Cancel',
    save: 'Save',
    saving: 'Saving...',
    deleteConfirm: 'Are you sure you want to delete this appointment?',
    chartTitle: 'Monthly Revenue Growth',
    dailyChartTitle: 'Daily Revenue Growth for the Month',
    searchPlaceholder: 'Search client (name or phone)...',
    noResults: 'No results found',
    call: 'Call',
    weekDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    weekDaysShort: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    monthsList: [
      { value: '01', name: 'January' },
      { value: '02', name: 'February' },
      { value: '03', name: 'March' },
      { value: '04', name: 'April' },
      { value: '05', name: 'May' },
      { value: '06', name: 'June' },
      { value: '07', name: 'July' },
      { value: '08', name: 'August' },
      { value: '09', name: 'September' },
      { value: '10', name: 'October' },
      { value: '11', name: 'November' },
      { value: '12', name: 'December' },
    ]
  }
};

const holidays = [
  '01-01', '01-02', '01-03', '01-04', '01-05', '01-06', '01-28',
  '03-08', '04-24', '05-01', '05-09', '05-28', '07-05', '09-21', '12-31'
];

export default function App() {
  const [session, setSession] = useState(null);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  const [lang, setLang] = useState('am');
  const t = translations[lang];

  const [currentView, setCurrentView] = useState('year');
  const [selectedDate, setSelectedDate] = useState(null);

  const now = new Date();
  const currentSystemYear = String(now.getFullYear());
  const currentSystemMonth = String(now.getMonth() + 1).padStart(2, '0');
  const currentSystemDayFormatted = `${currentSystemYear}-${currentSystemMonth}-${String(now.getDate()).padStart(2, '0')}`;

  const [selectedYear, setSelectedYear] = useState(currentSystemYear);
  const [selectedMonth, setSelectedMonth] = useState(currentSystemMonth);

  const [appointments, setAppointments] = useState([]);

  // Որոնման վիճակ (Search State)
  const [searchQuery, setSearchQuery] = useState('');

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
      else alert(lang === 'am' ? 'Դուք հաջողությամբ գրանցվեցիք։' : lang === 'ru' ? 'Вы успешно зарегистрировались.' : 'Successfully registered.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setAuthError(lang === 'am' ? 'Սխալ էլ. փոստ կամ գաղտնաբառ' : lang === 'ru' ? 'Неверный email или пароль' : 'Invalid email or password');
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

  // Տարեկան գրաֆիկի տվյալներ (ըստ ամիսների)
  const getMonthlyRevenueChartData = () => {
    return t.monthsList.map(m => {
      const monthTotal = appointments
        .filter(app => {
          if (!app.date) return false;
          const appDate = String(app.date).substring(0, 10);
          return appDate.startsWith(`${selectedYear}-${m.value}`);
        })
        .reduce((sum, app) => sum + Number(app.price || 0), 0);

      return {
        monthName: m.name.substring(0, 3),
        revenue: monthTotal
      };
    });
  };

  const chartData = getMonthlyRevenueChartData();
  const maxRevenue = Math.max(...chartData.map(d => d.revenue), 1000);

  // Ամսական (օրական) գրաֆիկի տվյալներ (տվյալ ամսվա բոլոր օրերի համար)
  const getDailyRevenueChartData = () => {
    const daysCount = new Date(parseInt(selectedYear), parseInt(selectedMonth), 0).getDate();
    const arr = [];
    for (let i = 1; i <= daysCount; i++) {
      const dayStr = i < 10 ? `0${i}` : `${i}`;
      const fullDate = `${selectedYear}-${selectedMonth}-${dayStr}`;
      const dayTotal = appointments
        .filter(app => {
          if (!app.date) return false;
          return String(app.date).substring(0, 10) === fullDate;
        })
        .reduce((sum, app) => sum + Number(app.price || 0), 0);

      arr.push({
        dayNum: i,
        revenue: dayTotal
      });
    }
    return arr;
  };

  const dailyChartData = getDailyRevenueChartData();
  const maxDailyRevenue = Math.max(...dailyChartData.map(d => d.revenue), 1000);

  // Որոնման արդյունքներ
  const filteredAppointments = searchQuery.trim() === '' ? [] : appointments.filter(app => {
    const q = searchQuery.toLowerCase();
    const nameMatch = app.name && app.name.toLowerCase().includes(q);
    const phoneMatch = app.phone && app.phone.toLowerCase().includes(q);
    return nameMatch || phoneMatch;
  });

  const getMonthDaysArray = (yearStr, monthStr) => {
    const y = parseInt(yearStr);
    const m = parseInt(monthStr);

    const jsFirstDay = new Date(y, m - 1, 1).getDay();
    const firstDay = jsFirstDay === 0 ? 6 : jsFirstDay - 1;

    const totalDays = new Date(y, m, 0).getDate();

    const arr = [];
    for (let i = 0; i < firstDay; i++) {
      arr.push({ empty: true, id: `empty-${m}-${i}` });
    }
    for (let i = 1; i <= totalDays; i++) {
      const formattedDay = i < 10 ? `0${i}` : `${i}`;
      const monthFormatted = m < 10 ? `0${m}` : `${m}`;
      const dateStr = `${yearStr}-${monthFormatted}-${formattedDay}`;
      const mmdd = `${monthFormatted}-${formattedDay}`;

      const dayOfWeek = new Date(y, m - 1, i).getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isSunday = dayOfWeek === 0;
      const isHoliday = holidays.includes(mmdd);

      arr.push({
        empty: false,
        date: dateStr,
        dayNum: i,
        dayOfWeek,
        isWeekend,
        isSunday,
        isHoliday
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
    if (!window.confirm(t.deleteConfirm)) return;

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
          color: '#f8fafc',
          position: 'relative'
        }}
      >
        <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Globe size={16} color="#38bdf8" />
          <select
            className="select-dropdown"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{ padding: '4px 8px', fontSize: '0.8rem' }}
          >
            <option value="am">Հայերեն</option>
            <option value="ru">Русский</option>
            <option value="en">English</option>
          </select>
        </div>

        <div className="auth-card">
          <h2>{isSignUp ? t.signupTitle : t.loginTitle}</h2>
          <p className="modal-subtitle">{isSignUp ? t.signupSubtitle : t.loginSubtitle}</p>

          {authError && <p style={{ color: '#ff453a', fontSize: '0.8rem', textAlign: 'center', marginBottom: '10px' }}>{authError}</p>}

          <form onSubmit={handleAuth}>
            <div className="form-group">
              <label>{t.emailLabel}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@mail.com"
              />
            </div>
            <div className="form-group">
              <label>{t.passwordLabel}</label>
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
              {isSignUp ? t.signupBtn : t.loginBtn}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.8rem', color: '#94a3b8' }}>
            {isSignUp ? t.hasAccount : t.noAccount}{' '}
            <span
              style={{ color: '#38bdf8', cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? t.loginLink : t.signupLink}
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
              <ChevronLeft size={18} /> {t.month}
            </button>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem' }}>
              <Calendar size={16} color={currentTheme.accent} /> {selectedDate}
            </h1>
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                className="select-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{ padding: '4px 6px', fontSize: '0.75rem' }}
              >
                <option value="am">HY</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>
              <button className="back-btn" onClick={handleLogout} title={t.logout} style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a' }}>
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : currentView === 'month' ? (
          <>
            <button className="back-btn" onClick={() => setCurrentView('year')} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <ChevronLeft size={18} /> {t.year}
            </button>
            <div style={{ display: 'flex', gap: '6px' }}>
              <select
                className="select-dropdown"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                {t.monthsList.map(m => (
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
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <select
                className="select-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{ padding: '4px 6px', fontSize: '0.75rem' }}
              >
                <option value="am">HY</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>
              <button className="back-btn" onClick={handleLogout} title={t.logout} style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', padding: '8px' }}>
                <LogOut size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="header-title-block" style={{ justifyContent: 'space-between', alignItems: 'center', width: '100%', display: 'flex' }}>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>{selectedYear}</h1>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <select
                className="select-dropdown"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {yearsList.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
              <select
                className="select-dropdown"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
                style={{ padding: '4px 6px', fontSize: '0.75rem' }}
              >
                <option value="am">HY</option>
                <option value="ru">RU</option>
                <option value="en">EN</option>
              </select>
              <button className="back-btn" onClick={handleLogout} title={t.logoutSystem} style={{ background: 'rgba(255, 59, 48, 0.2)', color: '#ff453a', padding: '8px' }}>
                <LogOut size={16} />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ՈՐՈՆՄԱՆ ՀԱՄԱԿԱՐԳ (Search Bar) */}
      <div style={{ position: 'relative', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(15, 23, 42, 0.7)', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '14px', padding: '8px 12px', backdropFilter: 'blur(6px)' }}>
          <Search size={16} color="#38bdf8" style={{ marginRight: '8px', flexShrink: 0 }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            style={{ background: 'transparent', border: 'none', color: '#f8fafc', fontSize: '0.85rem', outline: 'none', width: '100%' }}
          />
          {searchQuery && (
            <X size={16} color="#94a3b8" style={{ cursor: 'pointer', marginLeft: '6px' }} onClick={() => setSearchQuery('')} />
          )}
        </div>

        {/* Որոնման արդյունքների կախովի ցուցակ */}
        {searchQuery.trim() !== '' && (
          <div style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            background: '#0f172a',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '14px',
            maxHeight: '220px',
            overflowY: 'auto',
            zIndex: 100,
            boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
            padding: '8px'
          }}>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map(app => (
                <div key={app.id} style={{
                  padding: '8px 10px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.85rem'
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <User size={12} color={currentTheme.accent} /> {app.name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                      {app.date} | {app.service} ({app.time})
                    </div>
                  </div>
                  {app.phone && app.phone !== 'EMPTY' ? (
                    <a href={`tel:${app.phone}`} style={{
                      background: 'rgba(56, 189, 248, 0.2)',
                      color: '#38bdf8',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <Phone size={12} /> {t.call}
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>-</span>
                  )}
                </div>
              ))
            ) : (
              <div style={{ padding: '12px', textAlign: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
                {t.noResults}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ՏԱՐԵԿԱՆ ՏԵՍՔ */}
      {currentView === 'year' && (
        <div className="year-grid-container" style={{ overflowY: 'auto', flex: 1, paddingBottom: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

          <div className="months-grid-3cols">
            {t.monthsList.map(m => {
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
                    {t.weekDaysShort.map((wd, i) => (
                      <span key={i} style={{ color: i === 5 || i === 6 ? '#ff453a' : '#94a3b8' }}>{wd}</span>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', textAlign: 'center', fontSize: '0.6rem' }}>
                    {mDays.map((d, idx) => {
                      if (d.empty) return <div key={`e-${idx}`} />;
                      const isToday = d.date === currentSystemDayFormatted;

                      let dayColor = '#f8fafc';
                      if (isToday) dayColor = '#0f172a';
                      else if (d.isHoliday) dayColor = '#ff453a';
                      else if (d.isSunday) dayColor = '#fca5a5';
                      else if (d.isWeekend) dayColor = '#cbd5e1';

                      return (
                        <div
                          key={d.date}
                          style={{
                            padding: '2px 0',
                            borderRadius: '3px',
                            background: isToday ? '#38bdf8' : d.isHoliday ? 'rgba(255, 69, 58, 0.25)' : 'transparent',
                            color: dayColor,
                            fontWeight: isToday || d.isHoliday ? 'bold' : 'normal'
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

          {/* Տարեկան գրաֆիկ */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '10px 14px',
            marginTop: '12px',
            backdropFilter: 'blur(6px)'
          }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 'bold', marginBottom: '8px', color: '#38bdf8', textAlign: 'center' }}>
              {t.chartTitle}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '90px', gap: '3px', paddingTop: '6px' }}>
              {chartData.map((item, index) => {
                const heightPercent = Math.round((item.revenue / maxRevenue) * 100);
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '7px', color: '#94a3b8', marginBottom: '2px', whiteSpace: 'nowrap' }}>
                      {item.revenue > 0 ? (item.revenue >= 1000 ? `${Math.round(item.revenue / 1000)}` : item.revenue) : ''}
                    </div>
                    <div
                      title={`${item.monthName}: ${item.revenue.toLocaleString()} ֏`}
                      style={{
                        width: '100%',
                        maxWidth: '18px',
                        height: `${Math.max(heightPercent, 6)}%`,
                        background: item.revenue > 0 ? 'linear-gradient(to top, #38bdf8, #4ade80)' : 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.4s ease'
                      }}
                    />
                    <span style={{ fontSize: '8px', color: '#cbd5e1', marginTop: '3px' }}>{item.monthName}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* ԱՄՍՎԱ ՏԵՍՔ */}
      {currentView === 'month' && (
        <div className="month-grid-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
          <div>
            <div className="weekdays-header">
              {t.weekDays.map((wd, i) => (
                <span key={i} style={{ color: i === 5 || i === 6 ? '#ff453a' : '#cbd5e1' }}>
                  {wd}
                </span>
              ))}
            </div>
            <div className="days-grid">
              {daysInMonth.map((d) => {
                if (d.empty) {
                  return <div key={d.id} className="calendar-day-cell empty-cell" style={{ opacity: 0, pointerEvents: 'none' }} />;
                }

                const isCurrentDay = d.date === currentSystemDayFormatted;
                const count = getAppointmentsCountForDate(d.date);
                const hasApp = count > 0;

                let cellBackground = 'rgba(15, 23, 42, 0.5)';
                let cellColor = '#f8fafc';
                let cellBorder = '1px solid rgba(255, 255, 255, 0.1)';

                if (isCurrentDay) {
                  cellBackground = 'rgba(56, 189, 248, 0.2)';
                  cellBorder = `2px solid ${currentTheme.accent}`;
                } else if (d.isHoliday) {
                  cellBackground = 'rgba(255, 69, 58, 0.2)';
                  cellBorder = '1px solid rgba(255, 69, 58, 0.4)';
                  cellColor = '#ff453a';
                } else if (d.dayOfWeek === 0) {
                  cellBackground = 'rgba(255, 69, 58, 0.25)';
                  cellColor = '#fca5a5';
                } else if (d.dayOfWeek === 6) {
                  cellBackground = 'rgba(255, 69, 58, 0.12)';
                  cellColor = '#cbd5e1';
                }

                return (
                  <div
                    key={d.date}
                    className={`calendar-day-cell ${hasApp ? 'has-appointment' : ''} ${isCurrentDay ? 'current-day' : ''}`}
                    onClick={() => handleDayClick(d.date)}
                    style={{
                      background: cellBackground,
                      border: cellBorder,
                      color: cellColor,
                      boxShadow: isCurrentDay ? `0 0 10px ${currentTheme.accent}` : 'none'
                    }}
                  >
                    <span style={{ fontWeight: isCurrentDay || d.isHoliday ? 'bold' : 'normal' }}>{d.dayNum}</span>
                    {hasApp && <div className="appointment-badge" style={{ background: currentTheme.accent, color: '#0f172a' }}>{count}</div>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Ամսվա օրական վաստակի գրաֆիկը ներքևի դատարկ տարածքում */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '16px',
            padding: '8px 12px',
            marginTop: '10px',
            backdropFilter: 'blur(6px)'
          }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '6px', color: '#38bdf8', textAlign: 'center' }}>
              {t.dailyChartTitle}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '65px', gap: '1px', paddingTop: '4px', overflowX: 'auto' }}>
              {dailyChartData.map((item, index) => {
                const heightPercent = Math.round((item.revenue / maxDailyRevenue) * 100);
                return (
                  <div key={index} style={{ flex: 1, minWidth: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                    <div
                      title={`${item.dayNum}-րդ օր: ${item.revenue.toLocaleString()} ֏`}
                      style={{
                        width: '100%',
                        height: `${Math.max(heightPercent, 4)}%`,
                        background: item.revenue > 0 ? '#4ade80' : 'rgba(255, 255, 255, 0.08)',
                        borderRadius: '2px 2px 0 0'
                      }}
                    />
                  </div>
                );
              })}
            </div>
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
                            title={t.edit}
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
                            title={t.delete}
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
                      <Plus size={14} /> {t.freeSlot}
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
            <h3>{editingAppointmentId ? t.modalEditTitle : `${t.modalCreateTitle} ${selectedDate}`}</h3>
            <p className="modal-subtitle">{t.modalSubtitle}</p>

            <form onSubmit={handleSaveAppointment}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>{t.startTime}</label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                </div>
                <div className="end-group form-group" style={{ flex: 1 }}>
                  <label>{t.endTime}</label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>{t.clientName}</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder={t.clientNamePlaceholder}
                />
              </div>
              <div className="form-group">
                <label>{t.clientPhone}</label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+374..."
                />
              </div>
              <div className="form-group">
                <label>{t.service}</label>
                <input
                  type="text"
                  required
                  value={clientService}
                  onChange={(e) => setClientService(e.target.value)}
                  placeholder={t.servicePlaceholder}
                />
              </div>
              <div className="form-group">
                <label>{t.price}</label>
                <input
                  type="number"
                  value={clientPrice}
                  onChange={(e) => setClientPrice(e.target.value)}
                  placeholder={t.pricePlaceholder}
                />
              </div>
              <div className="modal-actions" style={{ display: 'flex', gap: '8px' }}>
                <button type="button" className="cancel-btn" onClick={() => setIsModalOpen(false)} style={{ flex: 1 }}>{t.cancel}</button>
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
                  {isSubmitting ? t.saving : t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <footer className="financial-footer">
        <div className="finance-item">
          <span className="finance-label" style={{ color: '#94a3b8' }}>{t.monthText}</span>
          <span className="finance-value" style={{ color: currentTheme.accent, display: 'flex', alignItems: 'center', gap: '2px' }}>
            {monthlyRevenue.toLocaleString()} ֏
          </span>
        </div>
        <div className="finance-item" style={{ textAlign: 'right' }}>
          <span className="finance-label" style={{ color: '#94a3b8' }}>{t.yearlyText} ({selectedYear})</span>
          <span className="finance-value" style={{ color: '#4ade80', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '2px' }}>
            {yearlyRevenue.toLocaleString()} ֏
          </span>
        </div>
      </footer>
    </div>
  );
}