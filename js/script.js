$(document).ready(function() {

    const API_URL = "https://6mvabh1u9g.execute-api.us-west-2.amazonaws.com/dev/slots";

    function fillPanelData(dataObj) {
        
        if(!dataObj.reserved) {

            if(!dataObj.slotsAvailable) {
                dataObj.activeInActivePanelClass = `panel-primary-inactive`
                dataObj.slotsAvailable = `Fully Reserved`
            } else {
                dataObj.activeInActivePanelClass = `panel-primary`
                dataObj.slotsAvailable = dataObj.available_slots + ` Spot Available`
            }

            dataObj.reservedSlots = dataObj.total_slots + ` People Reserved <i class="caret"></i>`
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserve`
            dataObj.reservedLabelClass = `btn btn2`
        } else {
            dataObj.activeInActivePanelClass = `panel-secondary`
            dataObj.reservedSlots = ''
            dataObj.slotsAvailable = ''
            dataObj.dateLabel = dataObj.date
            dataObj.reservedLabel = `Reserved`
            dataObj.reservedLabelClass = `btn btn3`
        }

        const PANELDATA = `
        <div class="panel-group">
            <div class="panel ${dataObj.activeInActivePanelClass}">
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
                        <div class="col-md-2"><button class="${dataObj.reservedLabelClass}"> ${dataObj.reservedLabel} </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    return PANELDATA
    }

    function fillLocationLabel(locationObj) {
        const LOCATIONLABEL = `<div class="btn location-label">${locationObj.locationLabel}</div><br><br>`
        return LOCATIONLABEL
    }

    console.log(
        fillPanelData({
            'total_slots': 25,
            'available_slots': 75,
            'date': 'Monday, May 18',
            'reserved': false
        })
    )

    console.log(
        fillLocationLabel({
            'locationLabel': 'First Floor'
        })
    )

    function callApiUrl(start, end, label) {
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

                function print_val(item) {
                    console.log(fillPanelData(item))
                    // $(dom_elem).appendTo("body");
                }

                for (const [key, value] of Object.entries(result)) {
                    console.log(fillLocationLabel({
                        'locationLabel': key
                    }))
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