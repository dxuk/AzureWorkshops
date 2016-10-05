// On Startup go get the data via ajax and render it via knockout.js

var viewmodel_Article;
var viewmodel_Question;
var viewmodel_AskQuestion;

var rootfnsite = "http://devdemnfnapp.azurewebsites.net/";
var rootfntmsite = "http://devdemfntm.trafficmanager.net/";

var loadedpercent = 0;
var errorpercent = 0;

// Hide the main panels from display as we won't bind all of them
$("#contentdetail").toggle();
$("#contentdetailArticles").toggle();
$("#contentdetailQuestions").toggle();

function updatepercent(addpercent) {

    loadedpercent = loadedpercent + addpercent;

    $('#progbar').width(loadedpercent + '%');

    if (loadedpercent > 99) {

        console.log('over 99%');
        $("#progbartop").toggle();
    }
    else {

        console.log(loadedpercent + '%');
    }

}
function renderknockoutjsArticles() {

    // Get the main page content if we are not on the first page and render the stuff to the DOM
    $.getJSON(rootfnsite + "api/GetArticles?FetchSet=" + $.QueryString["Section"], function (data) {

        // $("#contentdetail").toggle();
        viewmodel_Article = data;
        ko.applyBindings(viewmodel_Article, document.getElementById("contentdetailArticles"));

    })
}
function renderknockoutjsQuestions() {

    // Get the main page content if we are not on the first page and render the stuff to the DOM
    $.getJSON(rootfnsite + "api/GetQuestions?EventDate=" + $.QueryString["QuestionDate"], function (data) {

        // $("#contentdetail").toggle();
        viewmodel_Question = data;
        ko.applyBindings(viewmodel_Question, document.getElementById("bindingforQuestionlist"));

    })
}

var fntopleft = rootfnsite + "api/GetMenus?Position=TopLeft"
var fntopright = rootfnsite + "api/GetMenus?Position=TopRight"
var fnbottom = rootfnsite + "api/GetMenus?Position=Bottom"

// Load the top left links 
$.getJSON(fntopleft, function (data) {

    var items = [];
    var element = $('#menuleft');

    $.each(data, function (index, datain) {

        items.push("<li class='active'> <a href='index.html?Section=" + datain['RowKey'] + "'>" + datain['RowKey'] + "</a></li>");

    });

    element.append(items.join(''));
    updatepercent(25);
}
);

// Now load the top-right ones
$.getJSON(fntopright, function (data) {

    var items = [];
    var element = $('#menuright');

    $.each(data, function (index, datain) {

        items.push("<li class='navbar-inverse'> <a href='index.html?Section=" + datain['RowKey'] + "'>" + datain['RowKey'] + "</a></li>");

    });

    element.append(items.join(''));
    updatepercent(25);
})

// Now load the bottom links
$.getJSON(fnbottom, function (data) {

    var items = [];
    var element = $('#menuright');

    $.each(data, function (index, datain) {
        items.push("<li class='navbar-inverse'> <a href='" + datain['Link'] + "'>" + datain['Title'] + "</a></li>");
    });

    element.append(items.join(''));
    updatepercent(25);
})

// If we are on a detail page, rather than the front carousel - then render the content.
if ($.QueryString["Section"] != undefined) {
    renderknockoutjsArticles();
    updatepercent(29);
    $("#contentdetailArticles").toggle();
}
else {

    // Or if we are on the question page, render the question stack
    if ($.QueryString["QuestionDate"] != undefined) {
        renderknockoutjsQuestions();
        updatepercent(29);
        $("#contentdetailQuestions").toggle();
    }

    else {

        $("#contentheader").html("Welcome - Azure Performance and Scalability, what to do and what to avoid 04-10-2016");
        $("#contentdetail").html("");
        $("#contentdetail").toggle();

        updatepercent(29);
    }
}
window.onload = function () {

    updatepercent(2);

    var myQuestionVM = {
        SessionDate: '04-10-2016',
        AskedBy: ko.observable(''),
        Question: ko.observable(''),
        SecCode: ko.observable(''),
        Topic: ko.observable('')
    };
    
    myQuestionVM.WriteQuestion = function (data) {

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: rootfnsite + "api/InsertQuestionDirect/",
            // DemoQBLL 
            // url: rootfnsite + "api/ReceiveQuestionToQueue/",
            data: ko.toJSON(this),
            success: function (result) {
                // Success: Clear down old question
                $('#statussend').html("Sent OK");
                myQuestionVM.SessionDate = '04-10-2016';
                myQuestionVM.Question('');
           ;

            },
            error: function (result) {
                $('#statussend').html("Send Failed")
            }
        });
    }
    ko.applyBindings(myQuestionVM,  document.getElementById("askaquestionform"));
}
