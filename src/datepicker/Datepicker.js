'use strict';
import './datepicker.scss';

export class Datepicker {
    constructor(id = date.getTime(), date, selectDateHandler, visible = true) {
        this.date = date || new Date();
        this.selectDateHandler = selectDateHandler;
        this.activeTS = null;
        this.today = new Date();
        this.containerId = id;
        this.datepickerId = this.date.getTime();
        this.isHide = visible;
        this.staticData = {
            monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            daysWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
        };
        this.render();
        this._init();
    }

    /*render(date, markSelectedDay, setSelectedDate) - rebuild calendar
    * date - date obj for build calendar
    * markSelectedDay - flag to mark selected date
    * setSelectedDate - flag to run selectDateHandler callback
    */
    render(date = this.date, markSelectedDay, setSelectedDate) {
        let year = date.getFullYear();
        let month = date.getMonth();
        let firstDay = new Date(year, month, 1);
        let lastDay = new Date(year, month + 1, 0);
        let countDaysPrevMonth = new Date(year, month, 0).getDate();
        let countEmptyDays = firstDay.getDay();
        let countEmptyDaysEnd = 6 - lastDay.getDay();
        let countDaysMonth = lastDay.getDate();
        let className = this.isHide ? 'datepicker-layout hide' : 'datepicker-layout';
        let timestamp, currentDateInLoop;
        let selectedDate = (markSelectedDay) ? (this._tsToDateObj(this.activeTS)) : (date);

        let datepickerHtml =
            `<table id="${this.datepickerId}" class="${className}"> 
                <thead>
                    <tr>
                        <td class="prev-month-wrap"><button class="prev-month"><</button>
                        <td colspan="5" class="month-year-text">${this.staticData.monthNames[month] + ' ' + year}</td>
                        <td class="next-month-wrap"><button class="next-month">></button></td>
                    </tr>
                    <tr class="days-week-name">
                        <td>${this.staticData.daysWeek[0]}</td>
                        <td>${this.staticData.daysWeek[1]}</td>
                        <td>${this.staticData.daysWeek[2]}</td>
                        <td>${this.staticData.daysWeek[3]}</td>
                        <td>${this.staticData.daysWeek[4]}</td>
                        <td>${this.staticData.daysWeek[5]}</td>
                        <td>${this.staticData.daysWeek[6]}</td>
                    </tr>
                </thead>
            <tbody class="content">`;

        let calendarHtml = '';

        for (let i = 1; i <= countEmptyDays; i++) {//fill start days from prev month
            calendarHtml += '<td class="empty">' + (countDaysPrevMonth - (countEmptyDays - i)) + '</td>';
        }

        for (let i = 1; i <= countDaysMonth; i++) {
            currentDateInLoop = new Date(year, month, i);
            timestamp = currentDateInLoop.getTime();
            if (currentDateInLoop.getDay() === 0) {/*check index of day 0=Su, 1=Mo, 2=Th...*/
                if (i === 1 && countEmptyDays === 0) {
                    calendarHtml += '<tr>';
                } else {
                    calendarHtml += '</tr><tr>';
                }
            }
            if (i === this.today.getDate() && this.today.getMonth() === month && this.today.getFullYear() === year) {
                calendarHtml += '<td class="day today" data-timestamp="' + timestamp + '">' + i + '</td>';
            } else if (i === selectedDate.getDate() && selectedDate.getMonth() === month && selectedDate.getFullYear() === year) {
                calendarHtml += '<td class="day active" data-timestamp="' + timestamp + '">' + i + '</td>';
            } else {
                calendarHtml += '<td class="day" data-timestamp="' + timestamp + '">' + i + '</td>';
            }
        }

        for (let i = 1; i <= countEmptyDaysEnd; i++) {//fill end days from next month
            calendarHtml += '<td class="empty">' + i + '</td>';
        }

        datepickerHtml += calendarHtml + '</tr></tbody></table>';
        document.getElementById(this.containerId).innerHTML = datepickerHtml;

        if (setSelectedDate) {
            this.activeTS = date.getTime();
            this.setSelectedDate();
        }
    }

    _init() {
        this._addEventHandler();
    }

    _addEventHandler() {
        document.getElementById(this.containerId).addEventListener('click', this._getActiveDate.bind(this, event));
    }

    _nextMonth() {
        let m = this.date.getMonth() + 1;
        let y = this.date.getFullYear();
        if (m > 11) {
            y += 1;
            m = 0;
        }
        this.date = new Date(y, m);
        this.render(this.date, true);
    }

    _prevMonth() {
        let m = this.date.getMonth() - 1;
        let y = this.date.getFullYear();
        if (m < 0) {
            y -= 1;
            m = 11;
        }
        this.date = new Date(y, m);
        this.render(this.date, true);
    }

    _getActiveDate() {
        arguments[1].preventDefault();
        arguments[1].stopImmediatePropagation();
        let target = arguments[1].target;
        if (target.classList.contains('day')) {
            this.activeTS = target.getAttribute('data-timestamp');
            this._setSelectedDate(target);
        } else if (target.classList.contains('prev-month')) {
            this._prevMonth();
        } else if (target.classList.contains('next-month')) {
            this._nextMonth();
        }
    }

    getSelectedDate(timestamp = this.activeTS) {
        return this._tsToDateObj(timestamp);
    }

    _tsToDateObj(timestamp) {
        let date = new Date();
        date.setTime(timestamp);
        return date;
    }

    _setSelectedDate(target) {
        this.setSelectedDate(true);
        let active = document.querySelector('#' + this.containerId + ' .day.active');
        if (active) {
            active.classList.remove('active')
        }
        target.classList.add('active');
    }

    setSelectedDate(isCustomDaySelected) {
        document.dispatchEvent(new CustomEvent('set-date-range'));
        if (this.selectDateHandler instanceof Function) {
            this.selectDateHandler(isCustomDaySelected);
        }
    }

    clear() {
        this.date = new Date();
        this.activeTS = null;
        this.render(this.date, false, true);
    }

    toggleShow() {
        this.isHide = !this.isHide;
        document.querySelector('#' + this.containerId + ' table').classList.toggle('hide');
    }

    hide() {
        this.isHide = true;
        document.querySelector('#' + this.containerId + ' table').classList.add('hide');
    }
}