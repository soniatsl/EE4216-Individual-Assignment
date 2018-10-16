window.onload = function(){
    var choose_table = document.getElementById("chooseTable");
    var choose_btn_div = document.getElementsByClassName("choose_btn_div")[0];
    
    //table modal box
    // Get the modal
    var modal = document.getElementById('myModal');
    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    var okBtn = document.getElementsByClassName("modal-footer")[0];

    var submitBtn = document.getElementsByClassName('submit_btn_div')[0];

    var amount = document.getElementById('base_amount');

    var base = 1;

    var countryArray = [];
    var rateMap = [];
    var hRateMap = [];

    var resultColumn = document.getElementsByClassName('result_column_header');
    var resultRow = document.getElementsByClassName('result_row_header');
    var resultItem = document.getElementsByClassName('result_item');

    
    // set endpoint and your access key
    endpoint = 'latest'
    access_key = 'fa66ac2959b6f2da40879f4df0d618f5';


    // get the most recent exchange rates via the "latest" endpoint:
    $.ajax({
        url: 'http://data.fixer.io/api/' + endpoint + '?access_key=' + access_key,   
        dataType: 'jsonp',
        success: function(json) {

            var rateObject = json.rates;

            //for the rate of the rate table
            rateMap = rateObject;

            var rateObjectKeys = Object.keys(rateObject);
            var rowNo = 0;
            var cellNo = 0;

            var row = choose_table.insertRow(rowNo);

            //illustrating the choose table
            for(var i = 0; i < rateObjectKeys.length; i ++){
                if(i%8 == 0 && i != 0){
                    rowNo++;
                    var row = choose_table.insertRow(rowNo);
                    cellNo = 0;
                }
                var cell = row.insertCell(cellNo);
                cell.innerHTML = rateObjectKeys[i];

                var flagDiv = document.createElement('div');
                flagDiv.className = 'country_flag';
                cell.appendChild(flagDiv);

                var countryFlagDiv = choose_table.rows[rowNo].cells[cellNo]
                                        .getElementsByClassName('country_flag')[0];

                //insert image div
                var img = document.createElement("img"); 
                img.src = "assets/" + rateObjectKeys[i] + ".png";              
                countryFlagDiv.appendChild(img);

                cellNo++;    
            }    

            //for clicking element of table (choosing country)
                for (var k = 0; k < choose_table.rows.length; k++) {
                    for (var j = 0; j < choose_table.rows[k].cells.length; j++){
                        //onclick function for table cell                 
                        choose_table.rows[k].cells[j].onclick = function () {
                            
                            
                                //if table cell clicked
                                if(this.style.background == "rgb(255, 166, 248)"){
                                    this.style.background = "rgb(152, 234, 255)"; //light blue
                                    this.style.color = "blue";

                                    for(var index = 0; index < countryArray.length; index ++){
                                        if(countryArray[index] == this.innerHTML.substring(0,3))
                                            countryArray.splice(index, 1);
                                    }
                            }
                            else{
                                if(countryArray.length < 10){
                                        //not yet clicked
                                        this.style.background = "rgb(255, 166, 248)"; //pink
                                        this.style.color = "rgb(230, 60, 215)";

                                        //put the country into an array
                                        if(countryArray.length == 0){
                                            countryArray[0] = this.innerHTML.substring(0,3);
                                        }
                                        else{
                                            var n = countryArray.length;
                                            countryArray[n] = this.innerHTML.substring(0,3);
                                        }
                                }
                                else{
                                    alert('You can only choose at most 10 countries');
                                }
                            }


                        };
                    }
                }


            //cache the exchange rate in local storage
            for(var cache = 0; cache < rateObjectKeys.length; cache++){
                var cacheKey = Object.keys(rateMap)[cache];
                localStorage[cacheKey] = rateMap[cacheKey];
            }
        }
    });
  

    //onclick the chooseBtn to display the country table
    // When the user clicks on the button, open the modal 
    choose_btn_div.onclick = function() {
        modal.style.display = "block";
        choose_table.style.display = "block";
    }

    var d = new Date();
    var month = d.getMonth() + 1;
    var date = d.getDate();
    var year = d.getFullYear();
    var dateInput = "";
    var addedMonth = "";
    var addedDate = "";

    if(month < 10){
        addedMonth = "0" + month;
    }else{
        addedMonth = month;
    }

    if (date < 10){
        addedDate = "0" + date;
    }
    else{
        addedDate = date;
    }

    dateInput = year + "-" + addedMonth + "-" + addedDate;

    $('.switch_date').val(dateInput);

    getHistoricalRate($('.switch_date').val());

    $('.switch_date').change(function(){
        getHistoricalRate($('.switch_date').val());
    });

    $('.switch_input').change(function(){    
        $('.switch_date').toggle();  
        $('.result_item').toggleClass('historical');
        appendTable();
    });
 
    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    
    okBtn.onclick = function(){
        modal.style.display = "none";
    }

    amount.onkeypress = function(){
        base = amount.value;
        appendTable();
    }

    submitBtn.onclick = function(){
        base = amount.value;
        appendTable();
    }

    function appendTable(){
        $('.result_column_item').remove();
        $('.result_row_item').remove();
        $('.result_item_content').remove();
        $('.result_item_row').remove();

    if(countryArray.length != 0){
        for(var selected = 0; selected < countryArray.length; selected++){
            var countryName = countryArray[selected];

            //add column header (country name)
            var resultColumnItem = document.createElement('div');
            resultColumnItem.className = 'result_column_item';
            resultColumn[0].appendChild(resultColumnItem);


            //add row header (country name)
            var resultRowItem = document.createElement('div');
            resultRowItem.className = 'result_row_item';
            resultRow[0].appendChild(resultRowItem);

            var column = document.getElementsByClassName('result_column_item')[selected];
            var row = document.getElementsByClassName('result_row_item')[selected];
            column.innerHTML = countryName;
            row.innerHTML = countryName;

            //add delete button
            var columnResultDelete = document.createElement('div');
            columnResultDelete.className = 'result_delete';
            column.appendChild(columnResultDelete);
            column.getElementsByClassName('result_delete')[0].innerHTML = 'X';

            var rowResultDelete = document.createElement('div');
            rowResultDelete.className = 'result_delete';
            row.appendChild(rowResultDelete);
            row.getElementsByClassName('result_delete')[0].innerHTML = 'X';

            //add row items (rate)
            var resultItemRow = document.createElement('div');
            resultItemRow.className = 'result_item_row';
            resultItem[0].appendChild(resultItemRow);

            var rowAppend = document.getElementsByClassName('result_item_row')[selected];

            for(var rowItem = 0; rowItem < countryArray.length; rowItem++){
                var resultItemContent = document.createElement('div');
                resultItemContent.className = 'result_item_content';
                rowAppend.appendChild(resultItemContent); 

                if($('.result_item').hasClass('historical')){
                    var a = hRateMap[countryArray[rowItem]];
                    var b = hRateMap[countryName];
                }else{
                    var a = rateMap[countryArray[rowItem]];
                    var b = rateMap[countryName];
                }

                rowAppend.getElementsByClassName('result_item_content')[rowItem].innerHTML = Math.round(base * (a/b) * 100)/100;
            }
        }
    }
    
    }

    function getHistoricalRate(date){

        $.ajax({
            url: 'http://data.fixer.io/api/' + date + '?access_key=' + access_key,   
            dataType: 'jsonp',
            success: function(json) {

                var jsonObject = json.rates;

                hRateMap = jsonObject;
                appendTable();
                
            }
        });
    }
    
};
