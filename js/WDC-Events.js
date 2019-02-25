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
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "EndDateUTC",
            dataType: tableau.dataTypeEnum.datetime
        }, {
            id: "On_street",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "Subtype",
            dataType: tableau.dataTypeEnum.string
        }, {
            id: "TravelDate",
            dataType: tableau.dataTypeEnum.date
        }, {    
            id: "Lat",
            dataType: tableau.dataTypeEnum.float
        }, {                     
            id: "Lon",
            dataType: tableau.dataTypeEnum.float
        }, {
            id: "Geometry",
            dataType: tableau.dataTypeEnum.string  
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
                    "EventID": feat[i].EventID,                
                    "Description": feat[i].Description,
                    "StartDateUTC": feat[i].StartDateUTC,
                    "EndDateUTC": feat[i].EndDateUTC,
                    "On_street": feat[i].On_street,
                    "Subtype": feat[i].Subtype,
                    "TravelDate": feat[i].TravelDate,
                    "Lat": feat[i].Lat,    
                    "Lon": feat[i].Lon,
                    "Geometry": feat[i].Description
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
