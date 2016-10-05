// On Startup go get the data via ajax and render it via knockout.js

var viewmodel;
var rootfnsite = "http://threeshades-fn.azurewebsites.net/";
var loadedpercent = 0;
var errorpercent = 0;

function updatepercent(addpercent) {

    loadedpercent = loadedpercent + addpercent;

    $('#progbar').width(loadedpercent + '%');

    if (loadedpercent > 98) {

        console.log('over 98%');
        $("#contentdetail").toggle();
        $("#progbardiv").toggle();
    } else {
        console.log(loadedpercent + '%');
    }

}

function updateerrorpercent(addpercent) {

    errorpercent = errorpercent + addpercent;

    $('#progbarerror').width(errorpercent + '%');

    if (updatepercent + loadedpercent > 98) {

        $("#contentheader").html("Error Loading Site data !")
        $("#contentdetail").toggle();

    }

}

function renderlocal() {

    // Get the main page content if we are not on the first page and render the stuff to the DOM
    $.getJSON(rootfnsite + "/api/Articles?FetchSet=" + $.QueryString["Section"], function(data) {

        // Render the title
        $("#contentheader").html("<h3>" + data.Header.Title + "</h3>" + data.Header.Abstract);
        var items = [];
        var element = $('#contentdetail');

        $.each(data.Detail, function(index, datain) {

            // Parse and add the tags

            var tags = [];

            $.each(datain.Tags.split(","), function(index, datain2) {

                if (datain2.search("~") > -1) {
                    tags.push("<span class='label label-danger'>" + datain2.replace('~', '') + "</span>");
                } else {
                    tags.push("<span class='label label-info'>" + datain2 + "</span>");
                }

            });
            items.push("<div class='panel panel-primary'><div class='panel-heading'><h3 class='panel-title'><a class='btn btn-success' href='" + datain['Link'] + "'>" + datain['Title'] + "</a></h3></div><div class='panel-body'><p>" + datain['Narrative'] + "</p><div class='panel-footer'>Posted on: " + datain['Date'] + " <br/>Tags: " + tags.join('') + "</div></div></div>");

        });

        element.html(items.join(''));
        updatepercent(20);

    })


}

function renderknockoutjs() {

    // Get the main page content if we are not on the first page and render the stuff to the DOM
    $.getJSON(rootfnsite + "api/Articles?FetchSet=" + $.QueryString["Section"], function(data) {

        viewmodel = data;
        ko.applyBindings(viewmodel);
        updatepercent(20);

    })
}

var fntopleft = rootfnsite + "api/Menu?Position=TopLeft"
var fntopright = rootfnsite + "api/Menu?Position=TopRight"
var fnbottom = rootfnsite + "api/Menu?Position=Bottom"

//var fntopleft = "json/menu.json"
//var fntopright = "json/menu2.json"
//var fnbottom = "json/menu1.json"

$("#contentdetail").toggle();

// Load the top left links 
$.getJSON(fntopleft, function(data) {

        var items = [];
        var element = $('#menuleft');

        $.each(data, function(index, datain) {

            items.push("<li class='active'> <a href='index.html?Section=" + datain['RowKey'] + "'>" + datain['RowKey'] + "</a></li>");

        });

        element.append(items.join(''));
        updatepercent(25);
    },
    function(errordata, errortitle, errord2) {
        updateerrorpercent(25);
    }
);

// Now load the top-right ones
$.getJSON(fntopright, function(data) {

    var items = [];
    var element = $('#menuright');

    $.each(data, function(index, datain) {


        items.push("<li class='navbar-inverse'> <a href='index.html?Section=" + datain['RowKey'] + "'>" + datain['RowKey'] + "</a></li>");

    });

    element.append(items.join(''));
    updatepercent(25);
})

// Now load the bottom links
$.getJSON(fnbottom, function(data) {

    var items = [];
    var element = $('#menuright');

    $.each(data, function(index, datain) {
        items.push("<li class='navbar-inverse'> <a href='" + datain['Link'] + "'>" + datain['Title'] + "</a></li>");
    });

    element.append(items.join(''));
    updatepercent(25);
})

// If we are on a detail page, rather than the front carousel - then render the content.
if ($.QueryString["Section"] != undefined) {

    renderknockoutjs();

} else {
    $("#contentheader").html("Welcome to my personal evangelism site!");
    updatepercent(20);
}

window.onload = function() {

    updatepercent(5);

};