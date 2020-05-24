# coronaofficeplanner

## index.html

index.html contains basic template code that is required to created the basic
structure on the web page.

## data/data.json

JSON File contains sample imput data that is used as the reference to create the
code workflow

reserved - true will populate the details `My Schedule Section`
reserved - false will populate the details `Calender Section`

``` json
{
    "location_name": [
        {
            "date": "DD/MM/YYYY",
            "available_slots": 0,
            "total_slots": 100,
            "reserved": true,
            "person_details": [{
                "image": "image_location",
                "name": "name of the person"
            }]
        }
    ]
}
```

## js/script.js

TO understand the basic workflow - start reading from the Comment - Start Point for code
and navigate to each and every element.
