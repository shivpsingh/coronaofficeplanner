$(document).ready(function() {

    const API_URL = "https://6mvabh1u9g.execute-api.us-west-2.amazonaws.com/dev/slots";

    function fillPanelData(dataObj) {
        
        if(!dataObj.reserved) {

            if(dataObj.available_slots == 0) {
                dataObj.activeInActivePanelClass = `panel panel-secondary`
                dataObj.slotsAvailable = `Fully Reserved`
                dataObj.disabled = "disabled"
            } else {
                dataObj.disabled = ""
                dataObj.activeInActivePanelClass = `panel panel-primary`
                dataObj.slotsAvailable = dataObj.available_slots + ` Spot Available`
            }

            dataObj.reservedSlots = dataObj.total_slots + ` People Reserved <i class="caret"></i>`
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserve`
            dataObj.reservedLabelClass = `btn btn2`
            dataObj.panelClass = `calender-panel-container-removable`
        } else {
            dataObj.activeInActivePanelClass = `panel panel-reserved`
            dataObj.reservedSlots = ''
            dataObj.slotsAvailable = ''
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserved`
            dataObj.reservedLabelClass = `btn btn3`
            dataObj.panelClass = `schedule-panel-container-removable`
            dataObj.disabled = "disabled"
        }

        const PANELDATA = `
        <div class="panel-group">
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
        </div>
    `
    return PANELDATA
    }

    function fillLocationLabel(locationObj) {
        const LOCATIONLABEL = `
        <div class="btn location-label">${locationObj.locationLabel}</div><br><br>`
        return LOCATIONLABEL
    }

    function callApiUrl(start, end, label) {

        $('.schedule-panel-container-removable').remove();
        $('.calender-panel-container-removable').remove();

        api_url = API_URL

        if(start) {
            startDate = new Date(start['_d'])
            console.log(startDate.getMonth());
            endDate = new Date(start['_d'])
            console.log(endDate.getMonth());
            console.log(label);
            api_url += ("?" + "startDate=" + startDate.getMonth()+ "endDate=" + endDate.getMonth());
            console.log(api_url);
        }

        $.ajax({
            url: api_url,
            async: true,
            success: function(result) {

                function setDivElem(data, reserved) {
                    if (reserved) {
                        document.getElementById("schedule-panel-container").innerHTML += data;
                    } else {
                        document.getElementById("calender-panel-container").innerHTML += data;
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
                    
                    // document.getElementsByClassName("calender-panel-container-removable").innerHTML += key_val;
                    // document.getElementsByClassName("schedule-panel-container-removable").innerHTML += key_val;
                    document.getElementById("calender-panel-container").innerHTML += key_val;
                    document.getElementById("schedule-panel-container").innerHTML += key_val;
                    value.forEach(print_val);
                }
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

    callApiUrl({}, {}, {})

});