function buildCollaboration() {
    //ShowTwitter()
    DocsDisplay("CollaborationDocuments", "Collaboration Documents", "row1Col1", "")
    CalendarDisplay("Meetings", "row1Col2", "far fa-calendar-times")
    CalendarDisplay("Availability", "row1Col3", "far fa-calendar-check")

    HowToDisplay("row2Col1")
    NewsDisplay("row2Col2")
    showRSSFeeds("row10Col1", "0", "#fcdf9a")
    BlogDisplay("row10Col2")
    ShowTwitter("row11Col1")
}


function ShowTwitter(CardPos) {
    $("#" + CardPos).html("<div id='myDashBody'></div>");
    $("#myDashBody").load(_spPageContextInfo.webServerRelativeUrl + "/SiteAssets/V4/twitter.html");
}



function openNewsPost(newsTitle) {
    var url = _spPageContextInfo.webServerRelativeUrl + "/Lists/News/Flat.aspx?RootFolder=%2Fsites%2FTenderEyesV3%2FLists%2FNews%2F" + newsTitle + "&FolderCTID=0x0120020053BAA1EAA3FECC478352266299FB81C3"
    openedWindow = "news"
    openDialogWithCallBack(url, "Current News Report");
}

function BlogDisplay(CardPos) {
    var RootFolder = _spPageContextInfo.webServerRelativeUrl + "/Lists/Blog"
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + RootFolder + '">'
    card += '<i class="header-icon fas fa-comment" style="color: #fcdf9a !important"></i> Blog</div></a>'
    card += '<div class="table-responsive oppDashTables">'
    card += "<div id='blogBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="blogTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $("#" + CardPos).html(card);
    var today = new Date()
    var d = today.toISOString()
    sprLib.list({
            name: 'Blog',
            baseUrl: _spPageContextInfo.webServerRelativeUrl
        })
        .items({
            listCols: ['Id', 'Title', 'Body', 'Published'],
            queryFilter: '(Expires ge "' + d + '") or (Expires eq null)',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            console.log(arrItems)
            arrItems.forEach(function(obj, idx) {
                var published = formatDates(obj["Published"]);
                var body = "&nbsp;"
                var fullBody = ""
                if (obj["Body"]) {
                    body = obj["Body"];
                    if (obj["Body"].length > 200) {
                        body = obj["Body"].substring(0, 200) + "...";
                        fullBody = obj["Body"]
                    }
                }
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="Blog">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Blog&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + obj["Title"] + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + body + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + published + '</td>'
                tbleRow += '</tr>'

                $('#blogTable tbody').append(tbleRow)
            });
            $('#blogBusy').css("display","none")
        });

}

function NewsDisplay(CardPos) {
    var RootFolder = _spPageContextInfo.webServerRelativeUrl + "/Lists/News"
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + RootFolder + '">'
    card += '<i class="header-icon far fa-newspaper" style="color: #fcdf9a !important"></i> News</div></a>'
    card += '<div class="table-responsive oppDashTables">'
    card += "<div id='newsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="newsTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $("#" + CardPos).html(card);


    sprLib.list({
            name: 'News',
            baseUrl: _spPageContextInfo.webServerRelativeUrl
        })
        .items({
            listCols: ['Id', 'Title', 'Created', 'Body', 'LastReplyBy/Title'],
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var created = formatDates(obj["Created"]);
                var body = "&nbsp;"
                var title = "&nbsp;"
                if (obj["Title"]) {
                    title = obj["Title"]
                }
                if (obj["Body"]) {
                    body = obj["Body"];
                }
                var replied = ""
                if (obj["LastReplyBy"]) {
                    replied = 'Last Reply: ' + obj["LastReplyBy"].Title
                }
                var itemChild = obj["Folder"] ? obj["Folder"].ItemCount : "0"
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="News">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;News&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + title + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + body + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-heading">' + created+ '</div>'
                tbleRow += '<div title="' + replied + '" class="widget-subheading opacity-7">Replies: ' + itemChild + '</div>'
                tbleRow += '</td>'
                tbleRow += '</tr>'

                $('#newsTable tbody').append(tbleRow)
            });
            $('#newsBusy').css("display","none")
        });
}

function HowToDisplay(CardPos) {
    var RootFolder = _spPageContextInfo.webServerRelativeUrl + "/Lists/HowTos"
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + RootFolder + '">'
    card += '<i class="header-icon fas fa-question" style="color: #fcdf9a !important"></i> How To</div></a>'
    card += '<div class="table-responsive oppDashTables">'
    card += "<div id='howToBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="howTosTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $("#" + CardPos).html(card);
    sprLib.list({
            name: 'How Tos',
            baseUrl: _spPageContextInfo.webServerRelativeUrl
        })
        .items({
            listCols: ['Id', 'Title', 'Created', 'Description', 'Author/Title'],
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var created = formatDates(obj["Created"]);
                var body = "&nbsp;"
                if (obj["Description"]) {
                    body = obj["Description"];
                }
                var author = "&nbsp;";
                if (obj["Author"]) {
                    author = obj["Author"].Title;
                }
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="How Tos">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;HowTos&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + obj["Title"] + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + body + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-heading">' + created + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + author + '</div>'
                tbleRow += '</td>'
                tbleRow += '</tr>'

                $('#howTosTable tbody').append(tbleRow)
            });
            $('#howToBusy').css("display","none")
        });
}