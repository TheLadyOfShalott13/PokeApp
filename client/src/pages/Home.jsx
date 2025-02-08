import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import "../styles/tables.css"

const Homepage = ({ type }) => {
    const [month, setMonth] = useState(new Date().getMonth()+1);
    const [year, setYear] = useState(new Date().getFullYear());

    const monthChange = (e) => { setMonth(e.target.selectedOptions[0].value); }
    const yearChange = (e) => { setYear(e.target.value); }

    return (
        <div>
            <Navbar />
            <div className="table-container">
                <div className="title-and-options">
                    <h1>Calendar</h1>
                    <div id="search-date-calendar">
                        <select id="month" onChange={monthChange}>
                            <option value={year}>Select month</option>
                            <option value="01">January</option>
                            <option value="02">Febuary</option>
                            <option value="03">March</option>
                            <option value="04">April</option>
                            <option value="05">May</option>
                            <option value="06">June</option>
                            <option value="07">July</option>
                            <option value="08">August</option>
                            <option value="09">September</option>
                            <option value="10">October</option>
                            <option value="11">November</option>
                            <option value="12">December</option>
                        </select>
                        <input
                            onChange={yearChange}
                            type="number"
                            id="year"
                            placeholder="Enter year"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Homepage
