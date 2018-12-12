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
            id: "TravelDate",
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
                    "weatherID": feat[i].weatherID,                
                    "AMHasPrecipitation": feat[i].AMHasPrecipitation,
                    "AMTemperature": feat[i].AMTemperature,
                    "AMWeather": feat[i].AMWeather,
                    "AMWeatherIcon": feat[i].AMWeatherIcon,
                    "PMHasPrecipitation": feat[i].PMHasPrecipitation,
                    "PMTemperature": feat[i].PMTemperature,                  
                    "PMWeather": feat[i].PMWeather,
                    "PMWeatherIcon": feat[i].PMWeatherIcon,    
                    "TravelDate": feat[i].travel_date
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
