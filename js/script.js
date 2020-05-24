$(document).ready(function() {

    const API_HOST_NAME = "http://localhost:5000";
    const API_GET_SLOTS = `${API_HOST_NAME}/slots`
    const API_POST_RESERVE = `${API_HOST_NAME}/reserve`

    var id_count = 0

    /** Date Utils */

    function dateForLabel(dateObj) {

        let obj = dateObj
        let dd = Number(String(obj).split('/')[0])
        let mm = Number(String(obj).split('/')[1] - 1)
        let yy = Number(String(obj).split('/')[2])
        dateObj = new Date(yy, mm, dd)

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        let month = monthNames[dateObj.getMonth()];
        let dayName = dayNames[dateObj.getDay()];
        let output = `${dayName}, ${month} ${dateObj.getDate()}`;
        return output
    }

    function getDateFormat(obj) {
        let dateObj = new Date(obj)
        let day = String(dateObj.getDate()).padStart(2, '0');
        let month = String(dateObj.getMonth() + 1).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output =  day + '/' + month + '/' + year;
        return output
    }

    /** Dom Element Updates */
    function fillPanelData(dataObj) {

        if(!dataObj.reserved) {

            if(dataObj.available_slots == 0) {
                dataObj.activeInActivePanelClass = `row-panel panel-secondary`
                dataObj.slotsAvailable = `Fully Reserved`
                dataObj.disabled = "disabled"
            } else {
                dataObj.disabled = ""
                dataObj.activeInActivePanelClass = `row-panel panel-primary`
                dataObj.slotsAvailable = dataObj.available_slots + ` Spot Available`
            }

            dataObj.reservedSlots = dataObj.total_slots + ` People Reserved <i class="caret"></i>`
            dataObj.reservedLabel = `Reserve`
            dataObj.reservedLabelClass = `btn btn2 reserve-trigger`
        } else {
            dataObj.activeInActivePanelClass = `row-panel panel-reserved`
            dataObj.reservedSlots = ''
            dataObj.slotsAvailable = ''
            dataObj.reservedLabel = `Reserved`
            dataObj.reservedLabelClass = `btn btn3`
            dataObj.disabled = "disabled"
        }

        dataObj.dateLabel = dateForLabel(dataObj.date)
        people_image_arr = ""
        dataObj.person_details.forEach(function(item) {
            let img_data = `<img src="${item.image}" class="slider-img" data-toggle="tooltip" title="${item.name}">`
            people_image_arr += img_data
        })

        PANELDATA = `
<div class="${dataObj.activeInActivePanelClass}">
    <div class="panel-body">
        <div class="row">
            <div class="col-md-2">
                <b>${dataObj.dateLabel}</b>
            </div>
            <div class="col-md-4">
            </div>
            <div class="col-md-2">${dataObj.slotsAvailable}
            </div>
            <div class="col-md-2" data-toggle="collapse" data-target="#collapse-${id_count}">${dataObj.reservedSlots}
            </div>
            <div class="col-md-2">
                <button type="submit" value="${dataObj.date}" class="${dataObj.reservedLabelClass}" ${dataObj.disabled}> ${dataObj.reservedLabel} </button>
            </div>
        </div>
        <div class="row col-md-12">
            <div id="collapse-${id_count}" class="collapse">
                ${people_image_arr}
            </div>
        </div>
    </div>
</div>
`
    id_count += 1
    return PANELDATA
    }

    function fillLocationLabel(locationObj) {
        let ref_id = String(locationObj.locationLabel).replace(' ', '_').toLowerCase()
        const LOCATIONLABEL = `<button id="${ref_id}" class="btn location-label" disabled>${locationObj.locationLabel}</button><br><br>`
        return LOCATIONLABEL
    }

    function updateDOMHtml(result) {

        $('#schedule-panel-container').empty();
        $('#calender-panel-container').empty();
        document.getElementsByClassName("schedule-panel-container-removable").innerHTML = ""
        document.getElementsByClassName("calender-panel-container-removable").innerHTML = ""

        let drop_list = []

        function setDivElem(data, reserved) {
            if (reserved) {
                document.getElementsByClassName("schedule-panel-container-removable").innerHTML += data;
            } else {
                document.getElementsByClassName("calender-panel-container-removable").innerHTML += data;
            }
        }

        function print_val(item) {
            let data = fillPanelData(item);
            setDivElem(data, item['reserved']);
        }

        for (const [key, value] of Object.entries(result)) {
            let key_val = fillLocationLabel({
                'locationLabel': key
            })
            let reserved = false
            value.forEach(function(item) {
                if(item.reserved) {
                    reserved = true
                }
            })
            if(value != []) {
                document.getElementsByClassName("calender-panel-container-removable").innerHTML += key_val;
            }
            if(reserved) {
                document.getElementsByClassName("schedule-panel-container-removable").innerHTML += key_val;
            }
            value.forEach(print_val);
            drop_list.push(key)
        }

        $('.dropdown-menu').empty();
        drop_list.forEach(function(item) {
            let ref_id = String(item).replace(' ', '_').toLowerCase()
            $('.dropdown-menu').append(`<li><a class="dropdown-item" href="#${ref_id}">${item}</a></li>`);
        });

        $('#schedule-panel-container').append(document.getElementsByClassName("schedule-panel-container-removable").innerHTML)
        $('#calender-panel-container').append(document.getElementsByClassName("calender-panel-container-removable").innerHTML)

        let button_elem = document.getElementsByClassName('reserve-trigger')
        for(bt of button_elem) {
            bt.onclick = function(event) {
                callApiUrlForReserve(this.value)
            }
        }
    }

    function callApiUrlForReserve(obj) {

        let api_url = API_POST_RESERVE

        $.ajax({
            type: "POST",
            url: api_url,
            data: {
                'reserveForDate': obj
            },
            success: function(result) {
                for (const [key, value] of Object.entries(result)) {
                    // console.log(`${key} -> ${value}`);
                }
                callApiUrlForNextSevenDaysData()
            }
          });
    }

    function callApiUrl(start, end, label) {

        let api_url = API_GET_SLOTS

        if(start != null) {
            startDate = getDateFormat(start)
            endDate = getDateFormat(end)
            api_url += `?startDate=${startDate}&endDate=${endDate}`
        }

        $.ajax({
            url: api_url,
            async: true,
            success: function(result) {
                updateDOMHtml(result)
            }
        });
    }

    function callApiUrlForNextSevenDaysData() {
        var endCallDate = new Date();
        endCallDate.setDate(endCallDate.getDate() + 7);
    
        let start = new Date()
        let end = endCallDate

        callApiUrl(start, end, null)

        let start_date_to_set = dateForLabel(getDateFormat(start)).split(', ')[1]
        let end_date_to_set = dateForLabel(getDateFormat(end)).split(', ')[1]
        let dateRangeDom = `${start_date_to_set} - ${end_date_to_set}`

        $('.date-picker-style').empty()
        $('.date-picker-style').append(`<b class="gray">${dateRangeDom}</b>`);
    }

    $(".nav-tabs a").click(function() {
        $(this).tab('show');
    });
    $('.nav-tabs a').on('shown.bs.tab', function(event) {
        var x = $(event.target).text();
        var y = $(event.relatedTarget).text();
        $(".act span").text(x);
        $(".prev span").text(y);
    });
    $(function() {
        $('button[name="daterange"]').daterangepicker({
            opens: 'left'
        }, function(start, end, label) {
            callApiUrl(start, end, label)
            let start_date_to_set = dateForLabel(getDateFormat(start)).split(', ')[1]
            let end_date_to_set = dateForLabel(getDateFormat(end)).split(', ')[1]
            let dateRangeDom = `${start_date_to_set} - ${end_date_to_set}`

            $('.date-picker-style').empty()
            $('.date-picker-style').append(`<b class="gray">${dateRangeDom}</b>`);
        });
    });

    $('[data-toggle="tooltip"]').tooltip();
    callApiUrlForNextSevenDaysData();

});