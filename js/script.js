$(document).ready(function() {

    const API_URL = "https://6mvabh1u9g.execute-api.us-west-2.amazonaws.com/dev/slots";

    /** Date Utils */

    function dateForLabel(dateObj) {

        let obj = dateObj
        let dd = String(obj).split('/')[0]
        let mm = String(obj).split('/')[1]
        let yy = String(obj).split('/')[2]
        dateObj = new Date(yy, mm, dd)

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        let month = monthNames[dateObj.getMonth()];
        let dayName = dayNames[dateObj.getDay()];
        let output = `${dayName}, ${month} ${dateObj.getDay()}`;
        return output
    }

    function getDateFormat(obj) {
        let dateObj = new Date(obj)
        let day = String(dateObj.getDate()).padStart(2, '0');
        let month = String(dateObj.getMonth()).padStart(2, '0');
        let year = dateObj.getFullYear();
        let output =  day + '/' + month + '/' + year;
        return output
    }

    /** Dom Element Updates */
    function fillPanelData(dataObj) {
        
        dataObj.date = "20/02/2020"

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

        const PANELDATA = `
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
                        <div class="col-md-2">${dataObj.reservedSlots}
                        </div>
                        <div class="col-md-2">
                            <button type="submit" value="${dataObj.date}" class="${dataObj.reservedLabelClass}" ${dataObj.disabled}> ${dataObj.reservedLabel} </button>
                        </div>
                    </div>
                </div>
            </div>
    `
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
            document.getElementsByClassName("calender-panel-container-removable").innerHTML += key_val;
            document.getElementsByClassName("schedule-panel-container-removable").innerHTML += key_val;
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
        alert(obj)
    }

    function callApiUrl(start, end, label) {

        api_url = API_URL

        if(start != null) {
            startDate = getDateFormat(start)
            endDate = getDateFormat(end)
            api_url += ("?" + "startDate=" + startDate+ "endDate=" + endDate);
            console.log(api_url);
        }

        $.ajax({
            url: api_url,
            async: true,
            success: function(result) {
                updateDOMHtml(result)
            }
        });
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
        });
    });

    var endCallDate = new Date();
    endCallDate.setDate(endCallDate.getDate() + 7);

    callApiUrl(new Date(), endCallDate, null)

});