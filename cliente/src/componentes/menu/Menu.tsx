import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Menu.css";

const Menu = () => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const navigate = useNavigate();

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    navigate(`/compromissos/${date.toISOString().split('T')[0]}`);
};

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Agenda</h2>
      </div>
      
      <DatePicker
        selected={selectedDate}
        //@ts-expect-error mesmo declarando que não receberá void continua mostrando um warning mas funciona perfeitamente
        onChange={handleDateClick as (date: Date) => void} 
        inline
        calendarClassName="menu-calendar"
      />

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link">
          Página inicial
        </Link>
        <Link to="/gerenciarvideos" className="sidebar-link">
          Gerenciar vídeos
        </Link>
        <Link to="/gerenciartags" className="sidebar-link">
          Gerenciar tags
        </Link>
      </nav>
    </div>
  );
};

export default Menu;