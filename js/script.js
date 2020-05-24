$(document).ready(function() {

    const API_URL = "https://6mvabh1u9g.execute-api.us-west-2.amazonaws.com/dev/slots";

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
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserve`
            dataObj.reservedLabelClass = `btn btn2`
        } else {
            dataObj.activeInActivePanelClass = `row-panel panel-reserved`
            dataObj.reservedSlots = ''
            dataObj.slotsAvailable = ''
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserved`
            dataObj.reservedLabelClass = `btn btn3`
            dataObj.disabled = "disabled"
        }

        const PANELDATA = `
            <div class="${dataObj.activeInActivePanelClass}">
                <div class="panel-body">
                    <div class="row">
                        <div class="col-md-2"><b>${dataObj.dateLabel}</b>
                        </div>
                        <div class="col-md-4">
                        </div>
                        <div class="col-md-2">${dataObj.slotsAvailable}
                        </div>
                        <div class="col-md-2">${dataObj.reservedSlots}
                        </div>
                        <div class="col-md-2"><button class="${dataObj.reservedLabelClass}" ${dataObj.disabled}> ${dataObj.reservedLabel} </button>
                        </div>
                    </div>
                </div>
            </div>
    `
    return PANELDATA
    }

    function fillLocationLabel(locationObj) {
        const LOCATIONLABEL = `<button id="${locationObj.locationLabel}" class="btn location-label" disabled>${locationObj.locationLabel}</button><br><br>`
        return LOCATIONLABEL
    }

    function callApiUrl(start, end, label) {

        api_url = API_URL

        if(start != null) {
            startDate = new Date(start['_d'])
            endDate = new Date(start['_d'])
            api_url += ("?" + "startDate=" + startDate.getMonth()+ "endDate=" + endDate.getMonth());
            console.log(api_url);
        }

        $.ajax({
            url: api_url,
            async: true,
            success: function(result) {

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
                    $('.dropdown-menu').append(`<a class="dropdown-item" href="#` + item + `">'` + item + `'</a>`);
                });
                $('#schedule-panel-container').append(document.getElementsByClassName("schedule-panel-container-removable").innerHTML)
                $('#calender-panel-container').append(document.getElementsByClassName("calender-panel-container-removable").innerHTML)

                console.log('Got here');
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

    callApiUrl(null, null, null)

});