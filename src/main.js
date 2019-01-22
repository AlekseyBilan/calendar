import './sсss/styles.scss';
import {Datepicker} from "./datepicker/Datepicker";

window.addEventListener('DOMContentLoaded', function () {
    /*Fill select by timeZones*/
    (() => {
        const GMTtoRegionName = {
            'GMT +0': 'Greenwich Mean Time',
            'GMT +1': 'Central European Time',
            'GMT +2': 'Eastern European Time',
            'GMT +3': 'Eastern African Time',
            'GMT +3.5': 'Middle East Time',
            'GMT +4': 'Near East Time',
            'GMT +4.5': 'Afghanistan Time',
            'GMT +5': 'Pakistan Lahore Time',
            'GMT +5.5': 'India Standard Time',
            'GMT +6': 'Bangladesh Standard Time',
            'GMT +6.5': 'Mountain Standard Time',
            'GMT +7': 'Vietnam Standard Time',
            'GMT +8': 'China Taiwan Time',
            'GMT +9': 'Japan Standard Time',
            'GMT +9.5': 'Australia Central Time',
            'GMT +10': 'Australia Eastern Time',
            'GMT +10:5': 'Australian Central Daylight Time',
            'GMT +11': 'Midway Islands Time',
            'GMT +11.5': 'Norfolk Time',
            'GMT +12': 'New Zealand Standard Time',
            'GMT -1': 'Central African Time',
            'GMT -2': 'Brazil Eastern Time',
            'GMT -3': 'Argentina Standard Time',
            'GMT -3.5': 'Canada Newfoundland Time',
            'GMT -4': 'Puerto Rico and US Virgin Islands Time',
            'GMT -4.5': 'Venezuelan Standard Time',
            'GMT -5': 'Indiana Eastern Standard Time',
            'GMT -6': 'Central Standard Time',
            'GMT -7': 'Mountain Standard Time',
            'GMT -8': 'Pacific Standard Time',
            'GMT -9': 'Alaska Standard Time',
            'GMT -9.5': 'Marquesas Islands Time',
            'GMT -10': 'Hawaii Standard Time',
            'GMT -11': 'Midway Islands Time'
        };
        let date = new Date();
        let select = document.getElementById('time-zone');
        let offset = date.getTimezoneOffset() / -60;
        offset = 'GMT' + (offset >= 0 ? ' +' + offset : offset);
        let timezone = GMTtoRegionName[offset];

        let option = '';
        for (let i in GMTtoRegionName) {
            if (timezone === GMTtoRegionName[i]) {
                option += "<option selected='selected'>Timezone: (" + i + ") " + GMTtoRegionName[i] + "</option>";
            } else {
                option += "<option>Timezone: (" + i + ") " + GMTtoRegionName[i] + "</option>";
            }
        }
        select.innerHTML = option;
    })();

    const datepickerFrom = new Datepicker('date-from-container', null, selectDateFromHandler);
    const datepickerTo = new Datepicker('date-to-container', null, selectDateToHandler);
    const monthShortNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const clearDateRange = () => {
        datepickerFrom.clear();
        datepickerTo.clear();
        setCustomOptionSelected(0);
    };

    const selectDateRange = () => {
        console.log('from ', datepickerFrom.date, 'timestamp = (', datepickerFrom.activeTS, ')');
        console.log('to ', datepickerTo.date, 'timestamp = (', datepickerTo.activeTS, ')');
    };

    const changeRange = (e) => {
        let range = e.currentTarget[e.currentTarget.selectedIndex].getAttribute('data-value');
        let date = new Date();
        if (range === 'custom') {
            datepickerTo.render(date, false, true);
        } else {
            date.setDate(date.getDate() - range);
            datepickerFrom.render(date, false, true);
            datepickerTo.render(new Date(), false, true);
        }
    };

    const hideCalendars = (e) => {
        e.stopImmediatePropagation();
        if (!datepickerFrom.isHide || !datepickerTo.isHide) {
            datepickerFrom.hide();
            datepickerTo.hide();
            document.getElementById('date-from-wrap').classList.remove('focus');
            document.getElementById('date-to-wrap').classList.remove('focus');
        }
    };

    const showCalendar = (e) => {
        e.stopImmediatePropagation();
        let dataValue = e.currentTarget.getAttribute('data-value');
        if (dataValue === 'date-to') {
            if (!datepickerFrom.isHide) {
                datepickerFrom.hide();
                document.getElementById('date-from-wrap').classList.remove('focus');
            }
            datepickerTo.toggleShow();
            document.getElementById('date-to-wrap').classList.toggle('focus');

        } else if (dataValue === 'date-from') {
            if (!datepickerTo.isHide) {
                datepickerTo.hide();
                document.getElementById('date-to-wrap').classList.remove('focus');
            }
            datepickerFrom.toggleShow();
            document.getElementById('date-from-wrap').classList.toggle('focus');
        }
    };

    function selectDateToHandler(isCustomDaySelected) {
        if (isCustomDaySelected) setCustomOptionSelected();
        document.getElementById('date-to').value = formatDate(this.getSelectedDate());
    }

    function selectDateFromHandler(isCustomDaySelected) {
        if (isCustomDaySelected) setCustomOptionSelected();
        document.getElementById('date-from').value = formatDate(this.getSelectedDate());
    }

    const setCustomOptionSelected = (value = 'custom') => {
        document.getElementById('date-range').selectedIndex = -1;
        document.getElementById('date-range').selectedIndex = document.querySelector('#date-range option[data-value="' + value + '"]').index;
    };

    const setDateRange = () => {
        document.getElementById('selected-date-range').innerText = `${formatDate(datepickerFrom.getSelectedDate())}  -  ${formatDate(datepickerTo.getSelectedDate())}`;
    };

    const formatDate = (date) => {
        return `${monthShortNames[date.getMonth()]} ${date.getDate()}\,${(date.getFullYear()).toString().slice(-2)}`
    };

    document.getElementById('btn-reset').addEventListener('click', clearDateRange);
    document.getElementById('btn-apply').addEventListener('click', selectDateRange);
    document.getElementById('date-range').addEventListener('change', changeRange);
    document.getElementById('date-picker').addEventListener('click', hideCalendars);
    document.getElementById('date-from-wrap').addEventListener('click', showCalendar);
    document.getElementById('date-to-wrap').addEventListener('click', showCalendar);
    document.addEventListener('set-date-range', setDateRange);
});