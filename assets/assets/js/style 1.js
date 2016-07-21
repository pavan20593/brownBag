function fnFormatDetails(table_id, html) {
    var sOut = "<table id=\"exampleTable_" + table_id + "\">";
    sOut += html;
    sOut += "</table>";
    return sOut;
}

//////////////////////////////////////////////////////////// EXTERNAL DATA - Array of Objects 

var terranImage = "https://i.imgur.com/HhCfFSb.jpg"; 
var jaedongImage = "https://i.imgur.com/s3OMQ09.png";
var grubbyImage = "https://i.imgur.com/wnEiUxt.png";
var stephanoImage = "https://i.imgur.com/vYJHVSQ.jpg";
var scarlettImage = "https://i.imgur.com/zKamh3P.jpg";

// DETAILS ROW A 
var detailsRowAPlayer1 = { pic: jaedongImage, name: "Jaedong", team: "evil geniuses", server: "NA" };
var detailsRowAPlayer2 = { pic: scarlettImage, name: "Scarlett", team: "acer", server: "Europe" };
var detailsRowAPlayer3 = { pic: stephanoImage, name: "Stephano", team: "evil geniuses", server: "Europe" };
                         
var detailsRowA = [ detailsRowAPlayer1, detailsRowAPlayer2, detailsRowAPlayer3 ];

// DETAILS ROW B 
var detailsRowBPlayer1 = { pic: grubbyImage, name: "Grubby", team: "independent", server: "Europe" };
                         
var detailsRowB = [ detailsRowBPlayer1 ];
                    
// DETAILS ROW C 
var detailsRowCPlayer1 = { pic: terranImage, name: "Bomber", team: "independent", server: "NA" };
                         
var detailsRowC = [ detailsRowCPlayer1 ];

var rowA = { race: "Zerg", year: "2014", total: "3", details: detailsRowA};
var rowB = { race: "Protoss", year: "2014", total: "1", details: detailsRowB};
var rowC = { race: "Terran", year: "2014", total: "1", details: detailsRowC};

var newRowData = [rowA, rowB, rowC] ;

////////////////////////////////////////////////////////////

var iTableCounter = 1;
    var oTable;
    var oInnerTable;
    var detailsTableHtml;

    //Run On HTML Build
    $(document).ready(function () {
        
        // you would probably be using templates here
        detailsTableHtml = $("#detailsTable").html();

        //Insert a 'details' column to the table
        var nCloneTh = document.createElement('th');
        var nCloneTd = document.createElement('td');
        nCloneTd.innerHTML = '<img src="http://i.imgur.com/SD7Dz.png">';
        nCloneTd.className = "center";

        $('#exampleTable thead tr').each(function () {
            this.insertBefore(nCloneTh, this.childNodes[0]);
        });

        $('#exampleTable tbody tr').each(function () {
            this.insertBefore(nCloneTd.cloneNode(true), this.childNodes[0]);
        });
        
       
        //Initialse DataTables, with no sorting on the 'details' column
        var oTable = $('#exampleTable').dataTable({
            "bJQueryUI": true,
            "aaData": newRowData,
            "bPaginate": false,
            "aoColumns": [
                {
                   "mDataProp": null,
                   "sClass": "control center",
                   "sDefaultContent": '<img src="http://i.imgur.com/SD7Dz.png">'
                },
                { "mDataProp": "race" },
                { "mDataProp": "year" },
                { "mDataProp": "total" }
            ],
            "oLanguage": {
          "sInfo": "_TOTAL_ entries"
      },
            "aaSorting": [[1, 'asc']]
        });

        /* Add event listener for opening and closing details
        * Note that the indicator for showing which row is open is not controlled by DataTables,
        * rather it is done here
        */
        $('#exampleTable tbody td img').live('click', function () {
            var nTr = $(this).parents('tr')[0];
            var nTds = this;
            
            if (oTable.fnIsOpen(nTr)) {
                /* This row is already open - close it */
                this.src = "http://i.imgur.com/SD7Dz.png";
                oTable.fnClose(nTr);
            }
            else {
                /* Open this row */
                var rowIndex = oTable.fnGetPosition( $(nTds).closest('tr')[0] ); 
              var detailsRowData = newRowData[rowIndex].details;
               
                this.src = "http://i.imgur.com/d4ICC.png";
                oTable.fnOpen(nTr, fnFormatDetails(iTableCounter, detailsTableHtml), 'details');
                oInnerTable = $("#exampleTable_" + iTableCounter).dataTable({
                    "bJQueryUI": true,
                    "bFilter": false,
                    "aaData": detailsRowData,
                    "bSort" : true, // disables sorting
                    "aoColumns": [
                    { "mDataProp": "pic" },
                  { "mDataProp": "name" },
                  { "mDataProp": "team" },
                  { "mDataProp": "server" }
              ],
                    "bPaginate": false,
                    "oLanguage": {
            "sInfo": "_TOTAL_ entries"
              },
                    "fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
                      var imgLink = aData['pic']; 
                      var imgTag = '<img width="100px" src="' + imgLink + '"/>';
                      $('td:eq(0)', nRow).html(imgTag);  
                     return nRow;
                    }
                });
                iTableCounter = iTableCounter + 1;
            }
        });


    });