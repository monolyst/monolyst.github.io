(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "EventID",
            dataType: tableau.dataTypeEnum.string
         }, {
            id: "Description",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "StartDateUTC",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "EndDateUTC",
            dataType: tableau.dataTypeEnum.date
        }, {
            id: "On_street",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "TravelDate",
            dataType: tableau.dataTypeEnum.date
        }, {    
            id: "Lat",
            dataType: tableau.dataTypeEnum.number
        }, {                     
            id: "Lon",
            dataType: tableau.dataTypeEnum.number
        }];

        var tableSchema = {
            id: "events",
            alias: "events",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://ezrhp3xg6f.execute-api.us-east-1.amazonaws.com/v1/events/", function(resp) {
            var feat = resp["results"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "EventID": feat[i].weatherID,                
                    "Description": feat[i].AMHasPrecipitation,
                    "StartDateUTC": feat[i].AMTemperature,
                    "EndDateUTC": feat[i].AMWeather,
                    "On_street": feat[i].AMWeatherIcon,
                    "TravelDate": feat[i].PMHasPrecipitation,
                    "Lat": feat[i].PMWeatherIcon,    
                    "Lon": feat[i].travel_date
                });
            }

            table.appendRows(tableData);
            doneCallback();
        });
    };

    tableau.registerConnector(myConnector);

    // Create event listeners for when the user submits the form
    $(document).ready(function() {
        $("#submitButton").click(function() {
            tableau.connectionName = "SDOT Events Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
