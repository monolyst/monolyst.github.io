(function() {
    // Create the connector object
    var myConnector = tableau.makeConnector();

    // Define the schema
    myConnector.getSchema = function(schemaCallback) {
        var cols = [{
            id: "weatherID",
            dataType: tableau.dataTypeEnum.string
         }, {
            id: "AMHasPrecipitation",
            dataType: tableau.dataTypeEnum.bool
        }, {
            id: "AMTemperature",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "AMWeather",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "AMWeatherIcon",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "PMHasPrecipitation",
            dataType: tableau.dataTypeEnum.bool
        }, {    
            id: "PMTemperature",
            dataType: tableau.dataTypeEnum.float
        }, {          
            id: "PMWeather",
            dataType: tableau.dataTypeEnum.string
        }, {         
            id: "PMWeatherIcon",
            dataType: tableau.dataTypeEnum.float
        }, {                     
            id: "travel_date",
            dataType: tableau.dataTypeEnum.date
        }];

        var tableSchema = {
            id: "weather",
            alias: "weather",
            columns: cols
        };

        schemaCallback([tableSchema]);
    };

    // Download the data
    myConnector.getData = function(table, doneCallback) {
        $.getJSON("https://ezrhp3xg6f.execute-api.us-east-1.amazonaws.com/v1/weather/", function(resp) {
            var feat = resp["results"],
                tableData = [];

            // Iterate over the JSON object
            for (var i = 0, len = feat.length; i < len; i++) {
                tableData.push({
                    "TrafficID": feat[i].TrafficID,                
                    "hour": feat[i].hour,
                    "baseline_delay_hours": feat[i].baseline_delay_hours,
                    "delay_hours": feat[i].delay_hours,
                    "base_volume_SLU_Inbound": feat[i].base_volume_SLU_Inbound,
                    "base_volume_SLU_Outbound": feat[i].base_volume_SLU_Outbound,
                    "base_volume_Sodo_Inbound": feat[i].base_volume_Sodo_Inbound,                  
                    "base_volume_Sodo_Outbound": feat[i].base_volume_Sodo_Outbound,
                    "volume_SLU_Inbound": feat[i].volume_SLU_Inbound,
                    "volume_SLU_Outbound": feat[i].volume_SLU_Outbound,
                    "volume_Sodo_Inbound": feat[i].volume_Sodo_Inbound,                  
                    "volume_Sodo_Outbound": feat[i].volume_Sodo_Outbound,
                    "TravelDate": feat[i].TravelDate
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
            tableau.connectionName = "SDOT Weather Feed"; // This will be the data source name in Tableau
            tableau.submit(); // This sends the connector object to Tableau
        });
    });
})();
