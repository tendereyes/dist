function buildCompetitors() {
    showCompetitors("row2Col2")
    competitorNews("row2Col1", "")
    showRSSFeeds("row6Col2", "1", "#f09ebb")
}

function showCompetitors(pageCard) {
    var typeName = [];
    var typeData = [];
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorProfiles/AllItems.aspx">'
    card += '<i class="header-icon fas fa-chart-line" style="color: #f09ebb !important"></i> Competitor Profiles</a></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='compBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Name</th><th>Sector</th><th>Status</th><th>Country</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list({
            name: 'Competitor Profiles',
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            listCols: ['Id', 'Status', 'CompetitorType/Title', 'Title', 'Sectors/Title', 'Countries/Title'],
            queryOrderby: 'Title'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var status = obj["Status"] ? obj["Status"] : ""
                var sector = ""
                if (obj["Sectors"]) {
                    var sectors = obj["Sectors"]
                    sectors.forEach(function(sec, idx) {
                        sector = sector == "" ? sec.Title : sector + "; " + sec.Title
                    })
                }
                var type = ""
                if (obj["CompetitorType"]) {
                    type = obj["CompetitorType"].Title
                    if (jQuery.inArray(type, typeName) == -1) {
                        typeName.push(type)
                        typeData.push(1)
                    } else {
                        typeData[jQuery.inArray(type, typeName)] += 1
                    }
                }
                var country = ""
                if (obj["Countries"]) {
                    var countries = obj["Countries"]
                    countries.forEach(function(count, idx) {
                        country = country == "" ? count.Title : country + "; " + count.Title
                    })
                }
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="Competitors">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorProfiles&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href=CompetitorInfo.aspx?CompetitorID=' + obj["Id"] + '&CompetitorTitle=' + escapeProperly(obj["Title"]) + " target='_blank'>" + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + type + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + sector + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div>' + status + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += country
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            if ($.fn.dataTable.isDataTable('#mainTable')) {} else {
                var table = $('#mainTable').DataTable({
                    "order": []
                });
            }
            CompetitorsChart(typeName, typeData)
            $('#compBusy').css("display", "none")
        });
}

function competitorNews(pageCard, competitorId) {
    var filterTable = '(Title ne null)'
    var newsLink = _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorNews/'
    if (competitorId) {
        filterTable = '(Competitor/Id eq ' + competitorId + ')'
        newsLink = _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorNews/Flat.aspx?FilterField1=Competitor_x003a_ID&FilterValue1=' + competitorId
    }
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + newsLink + '">'
    card += '<i class="header-icon far fa-newspaper" style="color: #f09ebb !important"></i> Competitor News</div></a>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='compNewsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="newsTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>News</th><th>Published</th></tr>'
    $('#newsTable thead').append(headers)
    sprLib.list({ name: 'Competitor News', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Body', 'Title', 'FileRef', 'LastReplyBy/Title', 'Folder/ItemCount'],
            queryFilter: filterTable,
            queryLimit: "10",
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var body = obj["Body"].length > 200 ? obj["Body"].substring(0, 200) + "..." : obj['Body']
                    // var status = obj["Status"] ? obj["Status"] : "&nbsp;"
                var styling = body == "&nbsp;" ? "style='padding-bottom:16px'" : ""
                var replied = obj["LastReplyBy"] ? obj["LastReplyBy"].Title : "&nbsp;"
                var fileRef = obj["FileRef"].split('/CompetitorNews/')[1]
                var created = formatDates(obj["Created"]);
                var itemChild = obj["Folder"] ? obj["Folder"].ItemCount : "0"

                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="CompetitorNews">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorNews&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
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
                tbleRow += '<td><div class="badge badge-info">' + formatDates(obj["Created"]) + '</div></td>'
                tbleRow += '</tr>'

                $('#newsTable tbody').append(tbleRow)

            });
            $('#compNewsBusy').css("display", "none")
        });
}


function CompetitorsChart(statusValues, statusData) {
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon fas fa-flag" style="color: #f09ebb !important"></i>'
    pieCard += 'Competitors'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="card-body">'
    pieCard += '<canvas id="myChart" width="200" height="200"></canvas>'
    pieCard += '</div>'
    pieCard += '</div>'

    $('#row6Col1').html(pieCard)
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statusValues,
            datasets: [{
                label: 'Competitors',
                data: statusData,
                backgroundColor: chroma.scale(['#de2366', '#0663ae']).mode('lch').colors(statusValues.length)
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            }
        }
    });

}

function CompetitorDetails(CompetitorID) {
    sprLib.list({ name: 'Competitor Profiles', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Status', 'DocumentRootFolder', 'Title', 'CompetitorType/Title', 'Sectors/Title', 'Website', 'Countries/Title', 'Services'],
            queryFilter: '(Id eq ' + CompetitorID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<a href="javascript:openItem(&#39;CompetitorProfiles&#39;,' + CompetitorID + ');"><h5 class="card-title"><i class="header-icon fas fa-archive"></i> Competitor Details</h5></a>'
            arrItems.forEach(function(obj, idx) {
                // $('.compLink').each(function(){
                //     $(this).attr("href", $(this).attr("href") + "?CompetitorTitle="+escapeProperly(getParameterByName("CompetitorTitle"))+"&CompetitorID="+getParameterByName("CompetitorID")+"&FilterField1=Competitor%5Fx003a%5FID&FilterValue1="+getParameterByName("CompetitorID"))
                // });
                // $('#compScoreLink').attr("href", $('#compScoreLink').attr("href") + "&CompetitorTitle="+escapeProperly(getParameterByName("CompetitorTitle"))+"&CompetitorID="+getParameterByName("CompetitorID")+"&FilterField1=Company%5Fx003a%5FID&FilterValue1="+getParameterByName("CompetitorID"))
                // var competitorDocumentsLink
                // if(obj["DocumentRootFolder"]){
                //     bindTreeView(obj["Title"].trim(), obj["DocumentRootFolder"])
                //     competitorDocumentsLink = obj["DocumentRootFolder"]+"/Competitor Documents"
                // }
                // $('#compDocuments').attr('href', competitorDocumentsLink).attr("target","_blank")
                var status = "&nbsp;";
                if (obj["Status"]) {
                    status = obj["Status"];
                }
                var type = "&nbsp;";
                if (obj["CompetitorType"]) {
                    type = obj["CompetitorType"].Title
                }
                var sector = "&nbsp;";
                if (obj["Sectors"]) {
                    var sectors = obj["Sectors"]
                    sectors.forEach(function(sec, idx) {
                        sector = sector == "&nbsp;" ? sec.Title : sector + "; " + sec.Title
                    })
                }
                var country = "&nbsp;";
                if (obj["Countries"]) {
                    var places = obj["Countries"]
                    places.forEach(function(places, idx) {
                        country = country == "&nbsp;" ? places.Title : country + "; " + places.Title
                    })
                }
                var website = "&nbsp;";
                var websiteLink = "&nbsp;"
                if (obj["Website"]) {
                    website = obj["Website"].Url;
                    websiteLink = "<a style='color:#0028aa !important' href='" + website + "' target='_blank'>" + website + "</a>"
                }
                var service = "&nbsp;";
                if (obj["Services"]) {
                    service = obj["Services"];
                }
                var liHtml = "<table class='mb-0 table'><tbody><tr><td>Type:</td><td>" + type + "</td></tr>" +
                    "<tr><td>Sector:</td><td>" + sector + "</td></tr>" +
                    "<tr><td>Country:</td><td>" + country + "</td></tr>" +
                    "<tr><td>Services:</td><td>" + service + "</td></tr>" +
                    "<tr><td>Status:</td><td>" + status + "</td></tr>" +
                    "<tr><td>Website:</td><td>" + websiteLink + "</td></tr><tbody></table>";
                card += liHtml
            });
            card += '</div>'
            card += '</div>'
            $('#compRow1Col1').html(card)
        });
}

function showProjects(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorProjects/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-clipboard" style="color: #f09ebb !important"></i> Projects'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorProjects&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="projectsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Project</th><th>Status</th></tr>'
    $('#projectsTable thead').append(headers)
    sprLib.list({ name: 'Competitor Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Project/Id', 'Project/Title', 'Status'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            console.log(arrItems)
            arrItems.forEach(function(obj, idx) {
                var projectID
                if (obj["Project"]) {
                    var project = obj["Project"].Title
                    projectID = obj["Project"].Id
                }
                var status = '&nbsp;'
                if (obj["Status"]) {
                    status = obj["Status"];
                }
                var badge = "badge-info"
                switch (obj["Status"]) {
                    case "Won":
                        badge = 'badge-primary'
                        break;
                    case "Live":
                        badge = "badge-info"
                        break;
                    case "Lost":
                        badge = "badge-danger"
                        break;
                    case "Submitted":
                        badge = "badge-success"
                        break;
                    case "Prospect":
                        badge = "badge-warning"
                        break;
                    case "Withdrawn":
                        badge = "badge-dark"
                        break;
                    case "Cancelled":
                        badge = "badge-secondary"
                        break;
                }
                var competitorTbleRow = '<tr>'
                competitorTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorProjects&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                competitorTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                competitorTbleRow += '<td><a href="ProjectInfo.aspx?ProjectID=' + projectID + '&ProjectTitle=' + escapeProperly(project) + '" target="_blank">' + project + '</a></td>'
                competitorTbleRow += '<td><div class="badge ' + badge + '">' + status + '</div></td>'
                competitorTbleRow += '</tr>'
                $('#projectsTable tbody').append(competitorTbleRow)
            });

        });
}

function showContacts(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-address-card" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Contacts/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Contacts'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Contacts&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ContactsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Name</th><th>Title</th><th>Email</th><th>Sector of<br>Interest</th></tr>'
    $('#ContactsTable thead').append(headers)
    sprLib.list({ name: 'Contacts', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'SectorsOfInterest/Title', 'ContactTitle', 'EmailAddress', 'FileRef'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var name = "&nbsp;";
                var fullName = ""
                if (obj["Title"]) {
                    fullName = obj["Title"];
                    name = obj["Title"];
                    // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var email = "&nbsp;";
                var fullEmail = ""
                if (obj["EmailAddress"]) {
                    fullEmail = obj["EmailAddress"];
                    email = obj["EmailAddress"];
                    // email = email.length > 30 ? email.substring(0, 28) + "..." : email
                }
                var sector = "&nbsp;"
                var fullSector = "&nbsp;"
                if (obj["SectorsOfInterest"]) {
                    var sectors = obj["SectorsOfInterest"]
                    sectors.forEach(function(sec, idx) {
                            sector = sector == "&nbsp;" ? sec.Title : sector + "; " + sec.Title
                            fullSector = fullSector == "&nbsp;" ? sec.Title : fullSector + "; " + sec.Title
                        })
                        // sector = sector.length > 30 ? sector.substring(0, 28) + "..." : sector
                }
                var title = "&nbsp;";
                var fullTitle = ""
                if (obj["ContactTitle"]) {
                    title = obj["ContactTitle"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Contacts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + email + '</td>'
                tbleRow += '<td>' + sector + '</td>'
                tbleRow += '</tr>'
                $('#ContactsTable tbody').append(tbleRow)

            });
        });
}

function showProducts(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-cube" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorProducts/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Products'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorProducts&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ProductsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Section</th><th>Test</th></tr>'
    $('#ProductsTable thead').append(headers)
    sprLib.list({ name: 'Competitor Products', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Title', 'Section', 'Tests/Title'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var name = "&nbsp;";
                var title = "&nbsp;";
                if (obj["Title"]) {
                    name = obj["Title"];
                    title = obj["Title"]
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var section = "&nbsp;";
                var fullSection = "&nbsp;";
                if (obj["Section"]) {
                    section = obj["Section"];
                    fullSection = obj["Section"];
                    // section = section.length > 30 ? section.substring(0, 28) + "..." : section

                }
                var tests = "&nbsp;"
                if (obj["Tests"]) {
                    var testsName = obj["Tests"]
                    testsName.forEach(function(testsName, idx) {
                            tests = tests == "&nbsp;" ? testsName.Title : tests + "; " + testsName.Title
                        })
                        // tests = tests.length > 30 ? tests.substring(0, 28) + "..." : tests
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorProducts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + section + '</td>'
                tbleRow += '<td>' + tests + '</td>'
                tbleRow += '</tr>'
                $('#ProductsTable tbody').append(tbleRow)
            });
        });

}

function showPortfolio(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-briefcase" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorPortfolios/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Portfolios'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorPortfolios&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="PortfoliosTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Title</th><th>Sector</th><th>Fund</th><th>Focus Area</th></tr>'
    $('#PortfoliosTable thead').append(headers)
    var titleName = [];
    var titleData = [];
    var courseData = [];
    var scheduleTitle = "";
    sprLib.list({ name: 'Competitor Portfolios', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'FundValue', 'Title', 'FocusArea/Title', 'Sector/Title'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = "&nbsp;";
                var fullTitle = ""
                if (obj["Title"]) {
                    fullTitle = obj["Title"];
                    title = obj["Title"];
                    // title = title.length > 25 ? title.substring(0, 23) + "..." : title
                }
                var sector = "&nbsp;"
                var fullSector = "&nbsp;"
                if (obj["Sector"]) {
                    var sectors = obj["Sector"]
                    sectors.forEach(function(sec, idx) {
                            sector = sector == "&nbsp;" ? sec.Title : sector + "; " + sec.Title
                            fullSector = fullSector == "&nbsp;" ? sec.Title : fullSector + "; " + sec.Title
                        })
                        // sector = sector.length > 30 ? sector.substring(0, 28) + "..." : sector
                }
                var focus = "&nbsp;"
                var fullFocus = ""
                if (obj["FocusArea"]) {
                    var focusName = obj["FocusArea"]
                    focusName.forEach(function(focusName, idx) {
                            focus = focus == "&nbsp;" ? focusName.Title : focus + "; " + focusName.Title
                            fullFocus = fullFocus == "&nbsp;" ? focusName.Title : fullFocus + "; " + focusName.Title
                        })
                        // focus = focus.length > 30 ? focus.substring(0, 28) + "..." : focus
                }
                var fund = 0
                if (obj["FundValue"]) {
                    fund = obj["FundValue"]
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorPortfolios&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + sector + '</td>'
                tbleRow += '<td>' + shortenLargeNumber(parseFloat(fund).toFixed(2), 2) + '</td>'
                tbleRow += '<td>' + focus + '</td>'
                tbleRow += '</tr>'
                $('#PortfoliosTable tbody').append(tbleRow)
            });
        });
}

function showCompetitorScores(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-clipboard-list" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ProjectScores/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Company_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Competitor Scores'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ProjectScores&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ScoresTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Project</th><th>Section</th><th>Available<br>Marks</th><th>Evaluated<br>Score</th></tr>'
    $('#ScoresTable thead').append(headers)
    sprLib.list({ name: 'Project Scores', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Section', 'Project/Title', 'Project/Id', 'EvaluatedScore', 'AvailableMarks'],
            queryFilter: '(Company/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var competitor = "";
                var EvaluatedScore = 0;
                if (obj["EvaluatedScore"]) {
                    EvaluatedScore = obj["EvaluatedScore"];
                }
                var project = "&nbsp;";
                var projectID;
                if (obj["Project"]) {
                    if (obj["Project"].Title) {
                        project = obj["Project"].Title;
                        projectID = obj["Project"].Id;
                    }
                }
                var title = "&nbsp;";
                if (obj["Section"]) {
                    title = obj["Section"];
                }
                var availableMarks = 0;
                if (obj["AvailableMarks"]) {
                    availableMarks = obj["AvailableMarks"];
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ProjectScores&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td><a href=ProjectInfo.aspx?ProjectID=' + projectID + '&ProjectTitle=' + escapeProperly(project) + '" target="_blank">' + project + '</a></td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + parseInt(availableMarks) + '</td>'
                tbleRow += '<td>' + parseInt(EvaluatedScore) + '</td>'
                tbleRow += '</tr>'
                $('#ScoresTable tbody').append(tbleRow)
            })
        })
}

function showKeyMessages(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-key" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorKeyMessages/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Key Messages'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorKeyMessages&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="KeyMessagesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Key Message</th><th>Our Response</th></tr>'
    $('#KeyMessagesTable thead').append(headers)
    sprLib.list({ name: 'Competitor Key Messages', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Product/Title', 'KeyMessage', 'OurResponse'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var product = "&nbsp;";
                var name = "&nbsp;";
                if (obj["Product"]) {
                    name = obj["Product"].Title;
                    product = obj["Product"].Title
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var keyMessage = "&nbsp;";
                var fullKey = "&nbsp;"
                if (obj["KeyMessage"]) {
                    keyMessage = obj["KeyMessage"];
                    fullKey = obj["KeyMessage"];
                    // keyMessage = keyMessage.length > 30 ? keyMessage.substring(0, 28) + "..." : keyMessage
                }
                var ourResponse = "&nbsp;";
                var fullResponse = "&nbsp;";
                if (obj["OurResponse"]) {
                    ourResponse = obj["OurResponse"];
                    fullResponse = obj["OurResponse"];
                    // ourResponse = ourResponse.length > 30 ? ourResponse.substring(0, 28) + "..." : ourResponse
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorKeyMessages&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + keyMessage + '</td>'
                tbleRow += '<td>' + ourResponse + '</td>'
                tbleRow += '</tr>'
                $('#KeyMessagesTable tbody').append(tbleRow)
            });
        });
}

function showPainPoints(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-map-pin" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorPainPoints/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Pain Points'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorPainPoints&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="PainPointsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Pain Point</th><th>Our Response</th></tr>'
    $('#PainPointsTable thead').append(headers)
    sprLib.list({ name: 'Competitor Pain Points', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Product/Title', 'PainPoint', 'OurResponse'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var product = "&nbsp;";
                var name = "&nbsp;";
                if (obj["Product"]) {
                    name = obj["Product"].Title;
                    product = obj["Product"].Title
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var painPoint = "&nbsp;";
                var fullPPoint = "&nbsp;";
                if (obj["PainPoint"]) {
                    painPoint = obj["PainPoint"];
                    fullPPoint = obj["PainPoint"];
                    // painPoint = painPoint.length > 30 ? painPoint.substring(0, 28) + "..." : painPoint
                }
                var ourResponse = "&nbsp;";
                var fullResponse = "&nbsp;";
                if (obj["OurResponse"]) {
                    ourResponse = obj["OurResponse"];
                    fullResponse = obj["OurResponse"];
                    // ourResponse = ourResponse.length > 30 ? ourResponse.substring(0, 28) + "..." : ourResponse
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorPainPoints&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + painPoint + '</td>'
                tbleRow += '<td>' + ourResponse + '</td>'
                tbleRow += '</tr>'
                $('#PainPointsTable tbody').append(tbleRow)
            });
        });
}

function showStrategy(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-map" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorStrategy/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Strategy'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorStrategy&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="StrategyTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Strategy</th><th>Our Response</th></tr>'
    $('#StrategyTable thead').append(headers)
    sprLib.list({ name: 'Competitor Strategy', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Product/Title', 'Strategy', 'OurResponse'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var product = "&nbsp;";
                var name = "&nbsp;";
                if (obj["Product"]) {
                    name = obj["Product"].Title;
                    product = obj["Product"].Title
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var strategy = "&nbsp;";
                var fullStrategy = "&nbsp;";
                if (obj["Strategy"]) {
                    strategy = obj["Strategy"];
                    fullStrategy = obj["Strategy"];
                    // strategy = strategy.length > 30 ? strategy.substring(0, 28) + "..." : strategy
                }
                var ourResponse = "&nbsp;";
                var fullResponse = "&nbsp;";
                if (obj["OurResponse"]) {
                    ourResponse = obj["OurResponse"];
                    fullResponse = obj["OurResponse"];
                    // ourResponse = ourResponse.length > 30 ? ourResponse.substring(0, 28) + "..." : ourResponse
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorStrategy&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + strategy + '</td>'
                tbleRow += '<td>' + ourResponse + '</td>'
                tbleRow += '</tr>'
                $('#StrategyTable tbody').append(tbleRow)
            });
        });
}

function showResponse(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-comments" style="color: #f09ebb !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorResponse/AllItems.aspx?CompetitorTitle=' + getParameterByName("CompetitorTitle") + '&CompetitorID=' + RecID + '&FilterField1=Competitor_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Responses to our Products'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorResponse&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += '<table id="ResponseTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Product</th><th>Message</th><th>Our Response</th></tr>'
    $('#ResponseTable thead').append(headers)
    sprLib.list({ name: 'Competitor Response', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Product/Title', 'Message', 'OurResponse'],
            queryFilter: '(Competitor/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var product = "&nbsp;";
                var name = "&nbsp;";
                if (obj["Product"]) {
                    name = obj["Product"].Title;
                    product = obj["Product"].Title
                        // name = name.length > 30 ? name.substring(0, 28) + "..." : name
                }
                var Message = "&nbsp;";
                var fullMessage = "&nbsp;";
                if (obj["Message"]) {
                    Message = obj["Message"];
                    fullMessage = obj["Message"];
                    // Message = Message.length > 30 ? Message.substring(0, 28) + "..." : Message
                }
                var ourResponse = "&nbsp;";
                var fullResponse = "&nbsp;";
                if (obj["OurResponse"]) {
                    ourResponse = obj["OurResponse"];
                    fullResponse = obj["OurResponse"];
                    // ourResponse = ourResponse.length > 30 ? ourResponse.substring(0, 28) + "..." : ourResponse
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorResponse&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + name + '</td>'
                tbleRow += '<td>' + Message + '</td>'
                tbleRow += '<td>' + ourResponse + '</td>'
                tbleRow += '</tr>'
                $('#ResponseTable tbody').append(tbleRow)
            });
        });
}