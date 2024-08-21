function buildReferenceLibraryWorkspace(pageTable, pageCard) {
    QuestionSummary(pageCard, 'Created desc', 'Latest Questions');
    buildRefLibCards("Questions and Answers");
    getPictures('row2Col2');
    DocsDisplay("Documents", "Documents", "row2Col1", "")
}



function QuestionSummary(pageCard, order, header) {

    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/QuestionsAndAnswers/LatestQuestions.aspx">'
    card += '<div class="card-header-title"><i class="header-icon text-muted fas fa-question" style="color: #f4a89a !important"></i> '+header+'</div></a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='qSummaryBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Question</th><th>Category</th><th>Status</th><th>Valid Until</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list({
            name: "Questions and Answers",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ["Id", "Title", "Category/Title", "ValidUntil", "AnswerPreview", "Status"],
            orderBy: order
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var Categories = ""
                if (obj["Category"]) {
                    var cats = obj["Category"]
                    cats.forEach(function(cat, idx) {
                        Categories = Categories == "" ? cat.Title : Categories + "; " + cat.Title
                    })
                }
                var badge = 'badge-info'

                if (obj["Status"]) {
                    switch (obj["Status"]) {
                        case "Under Review":
                            badge = "badge-warning"
                            break;
                        case "Reviewed":
                            badge = "badge-success"
                            break;
                        case "Chased":
                            badge = "badge-danger"
                            break;
                    }
                }
                var QuestionEdit = _spPageContextInfo.webServerRelativeUrl + "/Lists/QuestionsAndAnswers/EditForm.aspx?ID=" + obj["Id"] + "&Source=" + _spPageContextInfo.webServerRelativeUrl + "/SitePages/My Workspace.aspx?Page=ReferenceLibrary"
                var AnswerPreview = obj["AnswerPreview"] ? obj["AnswerPreview"] : "";
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="QuestionsAndAnswers">'
                tbleRow += '<td class="text-center text-muted"><a href="' + QuestionEdit + '" target="_blank"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + obj["Title"] + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + AnswerPreview + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + Categories + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + badge + '">' + obj["Status"] + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["ValidUntil"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            var table = $('#mainTable').DataTable();
            $('#qSummaryBusy').css("display","none")
        });
}

function buildRefLibCards(pageTable) {
    var statusValues = []
    var statusData = []
    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items()
        .then(function(arrItems) {
            var card1 = '<div id="firstCard" class="card mb-3 widget-content bg-midnight-bloom clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Total ' + pageTable + '</div>'
            card1 += '<div class="widget-subheading">All Questions and Answers</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col1').html(card1)
            $('#firstCard').click(function() {
                openList("Questions and Answers", "All Items")
            });
        });

    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59Z"
    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: '(ValidUntil le "' + today + '")',
        })
        .then(function(arrItems) {
            var card1 = '<div id="secondCard" class="card mb-3 widget-content bg-danger clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Expired ' + pageTable + '</div>'
            card1 += '<div class="widget-subheading">Questions passed Vaild Date</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col2').html(card1)
            $('#secondCard').click(function() {
                openList("Questions and Answers", "Invalid Items")
            });
        });
    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: '(Status eq "Under Review")',
        })
        .then(function(arrItems) {
            var card1 = '<div id="thirdCard" class="card mb-3 widget-content bg-warning clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Questions Awaiting Review</div>'
            card1 += '<div class="widget-subheading">All Questions that are not yet Approved </div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col3').html(card1)
            $('#thirdCard').click(function() {
                openList("Questions and Answers", "Under Review")
            });
        });

}

function getPictures(cardRow) {
    var card = '<div class="mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Pictures">'
    card += '<div class="card-header-title"><i class="header-icon text-muted far fa-images" style="color: #f4a89a !important"></i> Pictures</div></a>'
    card += '</div>'
    card += '<div>'
    card += "<div id='picsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<div id="pictureMicroGallery" class="scrollPic">'
    sprLib.list({
            name: "Pictures",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ["Id", "LinkFilename", "FileLeafRef", "FileDirRef", "DocIcon"],
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                if (obj['DocIcon']) {
                    var filename = obj['FileLeafRef'];
                    var dir = obj['FileDirRef'];
                    filename = dir + '/' + filename + "?RenditionID=1";
                    card += '<a href="javascript:openPicture(&#39;' + obj['Id'] + '&#39;);"><div class="pictureGallery"><img src="';
                    card += filename;
                    card += '" style="height:160px; width:160px" class="mx-auto d-block"/><div class="textBox"><div class="text">' + obj['LinkFilename'] + '</div></div></div></a>';
                }
            });
            card += '</div>'
            card += '</div>'
            card += '</div>'
            $('#' + cardRow).html(card)
            opts = {
                "classes": "col-lg-2 col-md-4 col-sm-3",
                "hasModal": false
            }
            $("#refPics").bsPhotoGallery(opts);
            $('#picsBusy').css("display","none")
        });
}
function openPicture(ID){
    refreshTable = "Pictures"
    var url = _spPageContextInfo.webServerRelativeUrl + "/Pictures/Forms/EditForm.aspx?ID="+ID;
    openDialogWithCallBack(url,"Current Picture");            
}