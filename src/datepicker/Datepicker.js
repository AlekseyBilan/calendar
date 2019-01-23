'use strict';
import './datepicker.scss';

/**
 * Create instants of Datepicker.
 *
 * @constructor
 * @this  {Datepicker}
 * @param {string} container id - Datepicker instants will be load there.
 * @param {object} date - DateObject for calendar.
 * @param {function} selectDateHandler - call back function, select date action handler.
 * @param {boolean} visible - flag which tell is the instants will we shown.
 */
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

        const smartClickHandler = (event) => {
            event.stopImmediatePropagation();
            let target =  event.target, classList = target.classList;
            if (classList.contains('day')) {
                this.activeTS = target.getAttribute('data-timestamp');
                this._setSelectedDate(target);
            } else if (classList.contains('prev-month')) {
                Datepicker._prevMonth(this);
            } else if (classList.contains('next-month')) {
                Datepicker._nextMonth(this);
            }
        };

        this.render(this.date, false, false);

        this._addEventHandler(smartClickHandler);
    }

    static _tsToDateObj(timestamp) {
        let date = new Date();
        date.setTime(timestamp);
        return date;
    }

    static _nextMonth(that) {
        let m = that.date.getMonth() + 1;
        let y = that.date.getFullYear();
        if (m > 11) {
            y += 1;
            m = 0;
        }
        that.date = new Date(y, m);
        that.render(that.date, true);
    }

    static _prevMonth(that) {
        let m = that.date.getMonth() - 1;
        let y = that.date.getFullYear();
        if (m < 0) {
            y -= 1;
            m = 11;
        }
        that.date = new Date(y, m);
        that.render(that.date, true);
    }

    /**
     * Render instants of Datepicker.
     *
     * @constructor
     * @this  {Datepicker}
     * @param {object} date - DateObject for calendar.
     * @param {boolean} markSelectedDay - flag to mark selected date.
     * @param {boolean} setSelectedDate - flag to run selectDateHandler callback.
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
        let selectedDate = (markSelectedDay) ? (Datepicker._tsToDateObj(this.activeTS)) : (date);

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

    /**
     * _addEventHandler add click Event Listener to the instants of Datepicker.
     *
     * @constructor
     * @this  {Datepicker}
     * @param {function} smartClickHandler - function which get event object and decide how to handle it, using css class for it.
     */
    _addEventHandler(smartClickHandler) {
        document.getElementById(this.containerId).addEventListener('click', smartClickHandler);
    }

    getSelectedDate(timestamp = this.activeTS) {
        return Datepicker._tsToDateObj(timestamp);
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