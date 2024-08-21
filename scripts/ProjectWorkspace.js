function buildProjectWorkspace(pageTable) {
    activeProjects("Projects", "row2Col2")
    buildProjectCards("Projects")
    buildTaskTable("row5col2", "Project", "")
    buildTaskCard("Project", "row1Col3")
    showStagesTimeline("row2Col1", "Projects", "")

}

function showProjectPreview(ProjectID, cardID, url) {
    sprLib.list({ name: 'Projects', baseUrl: url })
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'EndDate', 'ProjectManager/Id', 'ProjectManager/Title', 'Users/Id', 'Users/Title', 'DocumentRootFolder', 'ViewName', 'Value', 'Client/Id', 'Client/Title', 'ReferenceNo', 'TaskBoard', 'ProjectTasks', 'Stages', 'Timeline', 'Meetings', 'KeyFactsPanel', 'Activities', 'RisksPanel', 'CompetitorPanel', 'SubcontractorPanel', 'ActionAnalysis', 'KeyFactsInfo', 'WinThemes', 'ProjectScores', 'Risks', 'projectPlan', 'projectSetup', 'Checklist', 'Contacts', 'Status', 'ClarificationQuestions', 'Lots', 'LotsPanel', 'Gateways'],
            queryFilter: '(Id eq ' + ProjectID + ')',
            queryLimit: 1
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<h5 class="card-title"><i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i> Project Details</h5>'
            arrItems.forEach(function(obj, idx) {
                var refNo = "&nbsp;";
                if (obj["ReferenceNo"]) {
                    refNo = obj["ReferenceNo"]
                }

                var newDesc = obj["Title"]
                newDesc += '<div class="page-title-subheading">Reference No: ' + refNo + '</div>'
                $('#dashboardTitle').html(newDesc)

                var startDate = formatDates(obj["StartDate"]);
                var endDate = formatDates(obj["EndDate"]);
                var projectManager = "&nbsp;";
                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projectManager = projectManager == "&nbsp;" ? manager.Title : projectManager + "; " + manager.Title
                    })
                }
                var value = 0;
                if (obj["Value"]) {
                    value = obj["Value"]
                }
                var client = "&nbsp;"
                var clientLink = "&nbsp;"
                var clientID = "&nbsp;"
                if (obj["Client"]) {
                    client = obj["Client"].Title;
                }

                var liHtml = "<table class='mb-0 table projectSummary'><tbody><tr><td>Start Date:</td><td>" + startDate + "</td></tr><tr><td>End Date:</td><td>" + endDate +
                    "</td></tr><tr><td>Project Manager:</td><td>" + projectManager + "</td></tr><tr><td>Status:</td><td>" +
                    obj["Status"] + "</td></tr><tr><td>Value:</td><td>" + shortenLargeNumber(parseFloat(value).toFixed(2), 2) +
                    "</td></tr><tr><td>Reference No:</td><td>" + refNo + "</td></tr><tr><td>Client:</td><td>" +
                    client + "</td></tr><tbody></table>";
                card += liHtml
                card += '</div>'
                card += '</div>'
                $('#' + cardID).html(card)
            });
        });

}

function ProjectDetails(ProjectID) {
    sprLib.list({ name: 'Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'EndDate', 'ProjectManager/Id', 'ProjectManager/Title', 'Users/Id', 'Users/Title', 'DocumentRootFolder', 'ViewName', 'Value', 'Client/Id', 'Client/Title', 'ReferenceNo', 'TaskBoard', 'ProjectTasks', 'Stages', 'Timeline', 'Meetings', 'KeyFactsPanel', 'Activities', 'RisksPanel', 'CompetitorPanel', 'SubcontractorPanel', 'ActionAnalysis', 'KeyFactsInfo', 'WinThemes', 'ProjectScores', 'Risks', 'projectPlan', 'projectSetup', 'Checklist', 'Contacts', 'Status', 'ClarificationQuestions', 'Lots', 'LotsPanel', 'Gateways'],
            queryFilter: '(Id eq ' + ProjectID + ')',
            queryLimit: 1
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<a href="javascript:openItem(&#39;Projects&#39;,' + ProjectID + ');"><h5 class="card-title"><i class="header-icon fas fa-archive"></i> Project Details</h5></a>'
            arrItems.forEach(function(obj, idx) {
                var refNo = "&nbsp;";
                if (obj["ReferenceNo"]) {
                    refNo = obj["ReferenceNo"]
                }

                var newDesc = obj["Title"]
                newDesc += '<div class="page-title-subheading">Reference No: ' + refNo + '</div>'
                $('#dashboardTitle').html(newDesc)

                var startDate = formatDates(obj["StartDate"]);
                var endDate = formatDates(obj["EndDate"]);
                var projectManager = "&nbsp;";
                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projectManager = projectManager == "&nbsp;" ? manager.Title : projectManager + "; " + manager.Title
                    })
                }
                var value = 0;
                if (obj["Value"]) {
                    value = obj["Value"]
                }
                var client = "&nbsp;"
                var clientLink = "&nbsp;"
                var clientID = "&nbsp;"
                if (obj["Client"]) {
                    client = obj["Client"].Title;
                    clientID = obj["Client"].Id;
                    clientLink = "<a style='color:#0000cc;text-decoration:underline' href='javascript:openItem(&#39;Clients&#39;," + clientID + ",&#39;client&#39;)'>" + client + "</a>"
                }

                var liHtml = "<table class='mb-0 table'><tbody><tr><td>Start Date:</td><td>" + startDate + "</td></tr><tr><td>End Date:</td><td>" + endDate +
                    "</td></tr><tr><td>Project Manager:</td><td style='text-decoration: underline !important'>" +
                    "<a style='color:#0028aa !important' href='/sites/TenderEyesV3/Lists/Projects/AllItems.aspx#InplviewHash847185cd-433f-403f-b692-f360bc7af085=FilterField1%3DProjectManager-FilterValue1%3D" +
                    projectManager + "' target='_blank'>" + projectManager + "</a></td></tr><tr><td>Status:</td><td>" +
                    obj["Status"] + "</td></tr><tr><td>Value:</td><td>" + shortenLargeNumber(parseFloat(value).toFixed(2), 2) +
                    "</td></tr><tr><td>Reference No:</td><td>" + refNo + "</td></tr><tr><td>Client:</td><td style='text-decoration: underline!important'>" +
                    clientLink + "</td></tr><tbody></table>";
                card += liHtml
                card += '</div>'
                card += '</div>'
                $('#row1Col1').html(card)
                    //Build Project Options
                BuildDocumentMenu(obj["Title"], obj["DocumentRootFolder"])
                DocsDisplay(obj["DocumentRootFolder"], obj["Title"], "row1Col3", "/ProjectDocuments")

                buildTimeline(obj["Id"], 'row2Col1', 'Project')


                if (obj["Stages"]) {
                    showStagesTimeline("row1Col2", "Projects", ProjectID)
                }
                if (obj["LotsPanel"]) {
                    showProjectLots("row3Col1", ProjectID)
                }
                if (obj["Gateways"]) {
                    showProjectGateways("row3Col2", ProjectID)
                }
                if (obj["CompetitorPanel"]) {
                    showCompetitors("row4Col1", ProjectID)
                }
                if (obj["KeyFactsPanel"]) {
                    showKeyFacts("row4Col2", ProjectID, false)
                }
                if (obj["RisksPanel"]) {
                    showRisks("row5Col1", ProjectID)
                }
                if (obj["SubcontractorPanel"]) {
                    showSubcontractors("row5Col2", ProjectID)
                }
                if (obj["Activities"]) {
                    showActivities("row6Col1", ProjectID)
                }
                if (obj["Meetings"]) {
                    $('#Meetings').css('display', '')
                } else { $('#Meetings').css('display', 'none') }
                if (obj["ProjectLots"]) {
                    $('#ProjectLots').css('display', '')
                } else { $('#ProjectLots').css('display', 'none') }
                if (obj["KeyFactsInfo"]) {
                    $('#KeyFacts').css('display', '')
                } else { $('#KeyFacts').css('display', 'none') }
                if (obj["ProjectScores"]) {
                    $('#ProjectScores').css('display', '')
                } else { $('#ProjectScores').css('display', 'none') }
                if (obj["Risks"]) {
                    $('#AllRisks').css('display', '')
                } else { $('#AllRisks').css('display', 'none') }
                if (obj["projectPlan"]) {
                    $('#ProjectPlan').css('display', '')
                } else { $('#ProjectPlan').css('display', 'none') }
                if (obj["projectSetup"]) {
                    $('#ProjectSetup').css('display', '')
                } else { $('#ProjectSetup').css('display', 'none') }
                if (obj["Checklist"]) {
                    $('#Checklist').css('display', '')
                } else { $('#Checklist').css('display', 'none') }
                if (obj["ClarificationQuestions"]) {
                    $('#ClarificationQuestions').css('display', '')
                } else { $('#ClarificationQuestions').css('display', 'none') }
                if (obj["Contacts"]) {
                    $('#Contacts').css('display', '')
                } else { $('#Contacts').css('display', 'none') }
                if (obj["WinThemes"]) {
                    $('#WinThemes').css('display', '')
                } else { $('#WinThemes').css('display', 'none') }
            });


        });
}


function ProjectPartnerDetails(ProjectID) {
    sprLib.list({ name: 'Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'EndDate', 'ProjectManager/Id', 'ProjectManager/Title', 'Users/Id', 'Users/Title', 'DocumentRootFolder', 'ViewName', 'Value', 'Prime/Title', 'Client/Id', 'Client/Title', 'ReferenceNo', 'TaskBoard', 'ProjectTasks', 'Stages', 'Timeline', 'Meetings', 'KeyFactsPanel', 'Activities', 'RisksPanel', 'CompetitorPanel', 'SubcontractorPanel', 'ActionAnalysis', 'KeyFactsInfo', 'WinThemes', 'ProjectScores', 'Risks', 'projectPlan', 'projectSetup', 'Checklist', 'Contacts', 'Status', 'ClarificationQuestions', 'Lots', 'LotsPanel', 'Gateways'],
            queryFilter: '(Id eq ' + ProjectID + ')',
            queryLimit: 1
        })
        .then(function(arrItems) {
            var card = '<div class="main-card mb-3 card">'
            card += '<div class="card-body">'
            card += '<a href="javascript:openItem(&#39;Projects&#39;,' + ProjectID + ');"><h5 class="card-title"><i class="header-icon fas fa-archive"></i> Project Details</h5></a>'
            arrItems.forEach(function(obj, idx) {
                var refNo = "&nbsp;";
                if (obj["ReferenceNo"]) {
                    refNo = obj["ReferenceNo"]
                }

                var newDesc = obj["Title"]
                newDesc += '<div class="page-title-subheading">Reference No: ' + refNo + '</div>'
                $('#dashboardTitle').html(newDesc)

                var startDate = formatDates(obj["StartDate"]);
                var endDate = formatDates(obj["EndDate"]);
                var projectManager = "&nbsp;";
                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projectManager = projectManager == "&nbsp;" ? manager.Title : projectManager + "; " + manager.Title
                    })
                }
                var value = 0;
                if (obj["Value"]) {
                    value = obj["Value"]
                }
                var client = "&nbsp;"
                var clientLink = "&nbsp;"
                var clientID = "&nbsp;"
                if (obj["Client"]) {
                    client = obj["Client"].Title;
                    clientID = obj["Client"].Id;
                    clientLink = "<a style='color:#0000cc;text-decoration:underline' href='javascript:openItem(&#39;Clients&#39;," + clientID + ",&#39;client&#39;)'>" + client + "</a>"
                }
                var Prime = obj["Prime"] ? obj["Prime"].Title : "&nbsp;"
                var liHtml = "<table class='mb-0 table'><tbody><tr><td>Start Date:</td><td>" + startDate + "</td></tr><tr><td>End Date:</td><td>" + endDate +
                    "</td></tr><tr><td>Project Manager:</td><td style='text-decoration: underline !important'>" +
                    "<a style='color:#0028aa !important' href='/sites/TenderEyesV3/Lists/Projects/AllItems.aspx#InplviewHash847185cd-433f-403f-b692-f360bc7af085=FilterField1%3DProjectManager-FilterValue1%3D" +
                    projectManager + "' target='_blank'>" + projectManager + "</a></td></tr><tr><td>Status:</td><td>" +
                    obj["Status"] + "</td></tr><tr><td>Value:</td><td>" + shortenLargeNumber(parseFloat(value).toFixed(2), 2) +
                    "</td></tr><tr><td>Prime:</td><td>" + Prime + "</td></tr><tr><td>Client:</td><td style='text-decoration: underline!important'>" +
                    clientLink + "</td></tr><tbody></table>";
                card += liHtml
                card += '</div>'
                card += '</div>'
                $('#row1Col1').html(card)
                    //Build Project Options
                BuildDocumentMenu(obj["Title"], obj["DocumentRootFolder"])
                DocsDisplay(obj["DocumentRootFolder"], obj["Title"], "row1Col3", "/ProjectDocuments")

                buildTimeline(obj["Id"], 'row2Col1', 'Project')


                if (obj["Stages"]) {
                    showStagesTimeline("row1Col2", "Projects", ProjectID)
                }
                if (obj["KeyFactsPanel"]) {
                    showKeyFacts("row4Col1", ProjectID, false)
                }
                if (obj["KeyFactsInfo"]) {
                    $('#KeyFacts').css('display', '')
                } else { $('#KeyFacts').css('display', 'none') }
                if (obj["ProjectScores"]) {
                    $('#ProjectScores').css('display', '')
                } else { $('#ProjectScores').css('display', 'none') }
                if (obj["WinThemes"]) {
                    $('#WinThemes').css('display', '')
                } else { $('#WinThemes').css('display', 'none') }
            });


        });
}

function BuildDocumentMenu(projectName, DocumentRootFolder) {
    $().SPServices({
        operation: "GetListItems",
        webURL: _spPageContextInfo.webServerRelativeUrl + "/ProjectDocuments/",
        listName: projectName,
        completefunc: function(xData, Status) {
            $(xData.responseXML).SPFilterNode("z:row").each(function() {
                var fileName = ""
                if ($(this).attr("ows_LinkFilename")) {
                    fileName = $(this).attr("ows_LinkFilename")
                    var fileURL = "/" + $(this).attr("ows_FileRef").split("#")[1]
                    menuHTML = "<li id='" + $(this).attr("ows_LinkFilename").replace(/ /g, "") + "'>"
                    menuHTML += "<a href='" + fileURL + "' target='_blank'>"
                    menuHTML += "<div docRootFolder='" + DocumentRootFolder + "' page='" + fileName.replace(/ /g, "") + "' icon='fas fa-book' folder='" + fileName + "' class='docView'>" + fileName + "</div>"
                    menuHTML += "</a>"
                    menuHTML += "</li>"
                    $("#ProjectDocuments").append(menuHTML);
                }
            });
            $('.docView').click(function() {
                openDocument($(this))
            });
        }
    });

}

function openDocument(obj) {
    var newURL = obj.attr("docRootFolder") + "/" + obj.attr("folder")
    window.open(newURL, '_blank');
}

function activeProjects(pageTable, pageCard) {
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Projects/MyProjects.aspx">'
    card += '<i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i>  My Active Projects</a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='activeProjBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'
    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Project</th><th>Manager</th><th>Status</th><th>End Date</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ["Id", "Title", "ProjectManager/Title", "Status", "EndDate", "Client/Title"],
            queryFilter: '(Archive ne 1) and (Status eq "Live") and ((ProjectManager eq "' + objUserId + '") or (Users eq "' + objUserId + '") or (Author eq "' + objUserId + '"))',
            queryOrderby: 'Title'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var projManager = ""

                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projManager = projManager == "" ? manager.Title : projManager + "; " + manager.Title
                    });
                }
                var badge = "badge-info"
                switch (obj["Status"]) {
                    case "Won":
                        badge = 'badge-success'
                        break;
                    case "Live":
                        badge = "badge-info"
                        break;
                    case "Lost":
                        badge = "badge-danger"
                        break;
                    case "Submitted":
                        badge = "badge-warning"
                        break;
                    case "Prospect":
                        badge = "badge-primary"
                        break;
                    case "Withdrawn":
                        badge = "badge-dark"
                        break;
                    case "Cancelled":
                        badge = "badge-secondary"
                        break;
                }
                var client = obj["Client"] ? obj["Client"].Title : "";
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="' + pageTable + '">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;' + pageTable + '&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href=ProjectInfo.aspx?ProjectID=' + obj["Id"] + '&ProjectTitle=' + escapeProperly(obj["Title"]) + " target='_blank'>" + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + client + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + projManager + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + badge + '">' + obj["Status"] + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["EndDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            var table
            if ($.fn.dataTable.isDataTable('#mainTable')) {
                table = $('#mainTable').DataTable();
            } else {
                table = $('#mainTable').DataTable({
                    "order": []
                });
            }
            $('#activeProjBusy').css("display", "none")
        });
}


function activeProjectsPartners(pageTable, pageCard) {
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Projects/MyProjects.aspx">'
    card += '<i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i>  My Active Projects</a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='activeProjBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="mainTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'
    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Prime</th><th>Project</th><th>Manager</th><th>Status</th><th>End Date</th></tr>'

    $('#mainTable thead').append(headers)

    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ["Id", "Title", "ProjectManager/Title", "Status", "EndDate", "Client/Title", "Prime/Title"],
            queryFilter: '(Archive ne 1) and (Status eq "Live") and ((ProjectManager eq "' + objUserId + '") or (Users eq "' + objUserId + '") or (Author eq "' + objUserId + '"))',
            queryOrderby: 'Title'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var projManager = ""

                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projManager = projManager == "" ? manager.Title : projManager + "; " + manager.Title
                    });
                }
                var badge = "badge-info"
                switch (obj["Status"]) {
                    case "Won":
                        badge = 'badge-success'
                        break;
                    case "Live":
                        badge = "badge-info"
                        break;
                    case "Lost":
                        badge = "badge-danger"
                        break;
                    case "Submitted":
                        badge = "badge-warning"
                        break;
                    case "Prospect":
                        badge = "badge-primary"
                        break;
                    case "Withdrawn":
                        badge = "badge-dark"
                        break;
                    case "Cancelled":
                        badge = "badge-secondary"
                        break;
                }
                var prime = obj["Prime"] ? obj["Prime"].Title : "";
                var client = obj["Client"] ? obj["Client"].Title : "";
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="' + pageTable + '">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;' + pageTable + '&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + prime + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href=ProjectSummary.aspx?ProjectID=' + obj["Id"] + '&ProjectTitle=' + escapeProperly(obj["Title"]) + " target='_blank'>" + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + client + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + projManager + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + badge + '">' + obj["Status"] + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["EndDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#mainTable tbody').append(tbleRow)
            });
            $('#mainTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });

            var table
            if ($.fn.dataTable.isDataTable('#mainTable')) {
                table = $('#mainTable').DataTable();
            } else {
                var table = $('#mainTable').DataTable({
                    "order": []
                });
            }
            $('#activeProjBusy').css("display", "none")
        });
}

function buildProjectCards(pageTable) {
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
            card1 += '<div class="widget-subheading">All Projects Created</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col1').html(card1)
            $('#firstCard').click(function() {
                openList("Projects", "All Items")
            });
            arrItems.forEach(function(obj, idx) {
                if (obj["Status"]) {
                    if (jQuery.inArray(obj["Status"], statusValues) != -1) {
                        statusData[jQuery.inArray(obj["Status"], statusValues)] += 1
                    } else {
                        statusValues.push(obj["Status"])
                        statusData.push(1)
                    }
                }
            });
            ProjectStatusChart(statusValues, statusData)
        });

    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59Z"
    sprLib.list({
            name: 'Projects',
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: '(EndDate le "' + today + '")',
        })
        .then(function(arrItems) {
            var card1 = '<div id="secondCard" class="card mb-3 widget-content bg-danger clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Expired ' + pageTable + '</div>'
            card1 += '<div class="widget-subheading">Projects Passed End Date</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col2').html(card1)
            $('#secondCard').click(function() {
                openList("Projects", "Invalid Date")
            });
        });


}

function ProjectStatusChart(statusValues, statusData) {
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i> '
    pieCard += 'Project Statuses'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="card-body">'
    pieCard += '<canvas id="myChart" width="200" height="200"></canvas>'
    pieCard += '</div>'
    pieCard += '</div>'

    $('#row5col1').html(pieCard)
    var ctx = document.getElementById('myChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: statusValues,
            datasets: [{
                label: 'Project Status',
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


function ProjectsAboutToRenew(pageTable, pageCard) {

    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Projects/AboutToRenew.aspx">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-archive" style="color: #c3d98b !important"></i> Projects about to Renew</div></a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='projRenewBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="projectRenewTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Project</th><th>Manager</th><th>Start Date</th><th>Renewal Date</th></tr>'

    $('#projectRenewTable thead').append(headers)

    var quarterly = moment(new Date()).add(91, 'days').format('YYYY-MM-DD') + "T00:00:00";
    sprLib.list('Projects')
        .items({
            listCols: ['Id', 'Title', 'StartDate', 'RenewalDate', 'ProjectManager/Title', 'Client/Title'],
            queryFilter: 'RenewalDate le "' + quarterly + '"',
            queryOrderby: 'RenewalDate'
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var projManager = ""

                if (obj["ProjectManager"]) {
                    obj["ProjectManager"].forEach(function(manager, idx) {
                        projManager = projManager == "" ? manager.Title : projManager + "; " + manager.Title
                    });
                }
                var client = obj["Client"] ? obj["Client"].Title : "";
                var tbleRow = '<tr class="projectRenewTableRow" recid="' + obj["Id"] + '" table="' + pageTable + '">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;' + pageTable + '&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading"><a href=ProjectInfo.aspx?ProjectID=' + obj["Id"] + '&ProjectTitle=' + escapeProperly(obj["Title"]) + " target='_blank'>" + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + client + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>' + projManager + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div>' + formatDates(obj["StartDate"]) + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["RenewalDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#projectRenewTable tbody').append(tbleRow)
            });
            $('#projectRenewTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            var table = $('#projectRenewTable').DataTable();
            $('#projRenewBusy').css("display", "none")
        });
}

function showWinThemesSummary(cardID, RecID, url) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-body">'
    card += '<div class="card-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += ' Win Themes'
    card += '</div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='winthemesBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="WinThemesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div></div>'

    $('#' + cardID).html(card)
    sprLib.list({ name: 'Win Themes', baseUrl: url + "/" })
        .items({
            listCols: ['Id', 'Created', 'Rank', 'Title', 'Description'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Rank',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {

                var Description = "&nbsp;"
                if (obj["Description"]) {
                    Description = obj["Description"];
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var Rank = ""
                if (obj["Rank"]) {
                    Rank = obj["Rank"];
                }
                var kFTbleRow = '<tr>'
                kFTbleRow += '<td><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + Description + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '</tr>'
                $('#WinThemesTable tbody').append(kFTbleRow)

            });
            $('#winthemesBusy').css("display", "none")
        });
}

function showWinThemes(cardID, RecID, readonly) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/WinThemes/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Win Themes'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    if (!readonly) {
        card += '<a href="javascript:newItem(&#39;WinThemes&#39;)"">'
        card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a>'
    }
    card += '</div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='winthemesBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="WinThemesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr>'
    if (!readonly) {
        headers += '<th class="text-center">Edit</th>'
    }
    headers += '<th class="text-center">Rank</th><th>Title</th></tr>'
    $('#WinThemesTable thead').append(headers)
    sprLib.list({ name: 'Win Themes', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Rank', 'Title', 'Description'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Rank',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {

                var Description = "&nbsp;"
                if (obj["Description"]) {
                    Description = obj["Description"];
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var Rank = ""
                if (obj["Rank"]) {
                    Rank = obj["Rank"];
                }
                var kFTbleRow = '<tr>'
                if (!readonly) {
                    kFTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;WinThemes&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                }
                kFTbleRow += '<td class="text-center text-muted">' + Rank + '</td>'
                kFTbleRow += '<td><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + Description + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '</tr>'
                $('#WinThemesTable tbody').append(kFTbleRow)

            });
            $('#winthemesBusy').css("display", "none")
        });
}

function showScoringMethodologySummary(cardID, RecID, url) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-body">'
    card += '<div class="card-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += ' Scoring Methodology'
    card += '</div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='scoringBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="ScoringMethodologyTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div></div>'

    $('#' + cardID).html(card)
    sprLib.list({ name: 'Scoring Methodology', baseUrl: url + "/" })
        .items({
            listCols: ['Id', 'Created', 'Grade', 'Title', 'ScoringMethodology'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Grade',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {

                var ScoringMethodology = "&nbsp;"
                if (obj["ScoringMethodology"]) {
                    ScoringMethodology = obj["ScoringMethodology"];
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var Grade = ""
                if (obj["Grade"]) {
                    Grade = obj["Grade"];
                }
                var kFTbleRow = '<tr>'
                kFTbleRow += '<td><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + Grade + ' ' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + ScoringMethodology + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '</tr>'
                $('#ScoringMethodologyTable tbody').append(kFTbleRow)
            });
            $('#scoringBusy').css("display", "none")
        });
}

function showScoringMethodology(cardID, RecID, readonly) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ScoringMethodology/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Scoring Methodology'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    if (!readonly) {
        card += '<a href="javascript:newItem(&#39;ScoringMethodology&#39;)"">'
        card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a>'
    }
    card += '</div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='scoringBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="ScoringMethodologyTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr>'
    if (!readonly) {
        headers += '<th class="text-center">Edit</th>'
    }
    headers += '<th class="text-center">Grade</th><th>Label</th></tr>'
    $('#ScoringMethodologyTable thead').append(headers)
    sprLib.list({ name: 'Scoring Methodology', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Grade', 'Title', 'ScoringMethodology'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Grade',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {

                var ScoringMethodology = "&nbsp;"
                if (obj["ScoringMethodology"]) {
                    ScoringMethodology = obj["ScoringMethodology"];
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var Grade = ""
                if (obj["Grade"]) {
                    Grade = obj["Grade"];
                }
                var kFTbleRow = '<tr>'
                if (!readonly) {
                    kFTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ScoringMethodology&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                }
                kFTbleRow += '<td class="text-center text-muted">' + Grade + '</td>'
                kFTbleRow += '<td><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + ScoringMethodology + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '</tr>'
                $('#ScoringMethodologyTable tbody').append(kFTbleRow)
            });
            $('#scoringBusy').css("display", "none")
        });
}

function showKeyFactsSummary(cardID, RecID, url) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-body">'
    card += '<div class="card-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += ' Key Facts'
    card += '</div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='keyFactsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="keyFactsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div></div>'

    $('#' + cardID).html(card)
    sprLib.list({ name: 'Key Facts', baseUrl: url })
        .items({
            listCols: ['Id', 'Created', 'Description', 'Title'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var created = formatDates(obj["Created"]);
                if (created)
                    var description = obj["Description"] ? obj["Description"] : "&nbsp;"
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var kFTbleRow = '<tr>'
                kFTbleRow += '<td width="90%"><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + description + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '</tr>'
                $('#keyFactsTable tbody').append(kFTbleRow)

            });
            $('#keyFactsBusy').css("display", "none")
        });
}

function showKeyFacts(cardID, RecID, readonly) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon far fa-file-alt" style="color: #c3d98b !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/KeyFacts/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Key Facts'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    if (!readonly) {
        card += '<a href="javascript:newItem(&#39;KeyFacts&#39;)"">'
        card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a>'
    }
    card += '</div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='keyFactsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="keyFactsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr>'
    if (!readonly) {
        headers += '<th class="text-center">Edit</th>'
    }
    headers += '<th class="text-center">#</th><th>Title</th><th>Created</th></tr>'
    $('#keyFactsTable thead').append(headers)
    sprLib.list({ name: 'Key Facts', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Description', 'Title'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var created = formatDates(obj["Created"]);
                if (created)
                    var description = "&nbsp;"
                if (obj["Description"]) {
                    description = obj["Description"];
                    description = description.length > 225 ? description.substring(0, 223) + "..." : description
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var kFTbleRow = '<tr>'
                if (!readonly) {
                    kFTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;KeyFacts&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                }
                kFTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                kFTbleRow += '<td><div class="widget-content p-0">'
                kFTbleRow += '<div class="widget-content-wrapper">'
                kFTbleRow += '<div class="widget-content-left flex2">'
                kFTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                kFTbleRow += '<div class="widget-subheading opacity-7">' + description + '</div>'
                kFTbleRow += '</div></div></div></td>'
                kFTbleRow += '<td><div class="badge badge-info">' + created + '</div></td>'
                kFTbleRow += '</tr>'
                $('#keyFactsTable tbody').append(kFTbleRow)

            });
            $('#keyFactsBusy').css("display", "none")
        });
}

function showProjectGateways(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<div class="card-header-title">'
    card += '<i class="header-icon fas fa-project-diagram" style="color: #c3d98b !important"></i>'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Gateways/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += 'Gateways'
    card += '</a></div><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Gateways&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='gatewayBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="GatewaysTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Gateway</th><th>Assigned To</th><th>Decision</th><th>Stage</th><th>Due Date</th></tr>'
    $('#GatewaysTable thead').append(headers)

    sprLib.list({ name: 'Gateways', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Decision', 'Title', 'DueDate', 'AssignedTo/Title', 'Stage/Title', 'Stage/Id'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            var todayDate = moment(new Date())
            arrItems.forEach(function(obj, idx) {
                var decision = "&nbsp;"
                if (obj["Decision"]) {
                    decision = obj["Decision"];
                    if (obj["Decision"].length > 25) {
                        // decision = obj["Decision"].substring(0, 22) + "...";
                    }
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                    // title = title.length > 15 ? title.substring(0, 12) + "..." : title;
                }
                var dueDate = formatDates(obj["DueDate"])
                var dteBadge = "badge-light"
                if (obj["DueDate"]) {
                    var dDate = convertSPDate(obj["DueDate"])
                    var chkDate = convertSPDate(obj["DueDate"])

                    var diff = moment(chkDate).diff(todayDate, 'days')
                    if (diff <= 0) {
                        dteBadge = "badge-danger"
                    } else if (diff < 20) {
                        dteBadge = "badge-warning"
                    }
                }
                var assignedTo = "&nbsp;"
                if (obj["AssignedTo"]) {
                    assignedTo = obj['AssignedTo'].Title
                        // assignedTo = assignedTo.length > 20 ? assignedTo.substring(0, 17) + "..." : assignedTo;
                }
                var stage = "&nbsp;"
                var stageID = -1
                if (obj["Stage"]) {
                    stage = obj['Stage'].Title
                    stageID = obj['Stage'].Id
                        // stage = stage.length > 20 ? stage.substring(0, 17) + "..." : stage;
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Gateways&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + assignedTo + '</td>'
                tbleRow += '<td>' + decision + '</td>'
                tbleRow += '<td><a href="javascript:openItem(&#39;Stages&#39;,' + stageID + ')">' + stage + '</a></td>'
                tbleRow += '<td><div class="badge ' + dteBadge + '">' + dueDate + '</div></td>'
                tbleRow += '</tr>'
                $('#GatewaysTable tbody').append(tbleRow)
            });
            $('#gatewayBusy').css("display", "none")
        });
}

function showCompetitors(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CompetitorProjects/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-users" style="color: #c3d98b !important"></i> Competitors'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;CompetitorProfiles&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='projectCompBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="competitorsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Competitor</th><th>Status</th></tr>'
    $('#competitorsTable thead').append(headers)
    sprLib.list({ name: 'Competitor Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Competitor/Id'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var competitorId = obj['Competitor'].Id
                sprLib.list({ name: 'Competitor Profiles', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
                    .items({
                        listCols: ['Id', 'Title', 'Status', 'CompetitorType/Title'],
                        queryFilter: '(Id eq ' + competitorId + ')',
                        queryOrderby: 'Created desc',
                        queryLimit: 5000
                    })
                    .then(function(arrItems) {
                        arrItems.forEach(function(obj, idx) {
                            var title = obj["Title"] ? obj["Title"] : "&nbsp;";
                            var compType = obj["CompetitorType"] ? obj["CompetitorType"].Title : "&nbsp;";
                            var status = "&nbsp;";
                            if (obj["Status"]) {
                                status = obj["Status"];

                                var badge = "badge-info"
                                switch (obj["Status"]) {
                                    case "Current":
                                        badge = 'badge-info'
                                        break;
                                    case "Past":
                                        badge = "badge-Light"
                                        break;
                                    case "Potential":
                                        badge = "badge-primary"
                                        break;
                                }
                            }
                            var competitorTbleRow = '<tr>'
                            competitorTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CompetitorProfiles&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                            competitorTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                            competitorTbleRow += '<td><div class="widget-content p-0">'
                            competitorTbleRow += '<div class="widget-content-wrapper">'
                            competitorTbleRow += '<div class="widget-content-left flex2">'
                            competitorTbleRow += '<div class="widget-heading"><a style="color:#3f6ad8" href="' + _spPageContextInfo.webServerRelativeUrl + '/SitePages/CompetitorInfo.aspx?CompetitorID=' + obj['Id'] + '&CompetitorTitle=' + title + '" target="_blank">' + title + '</a></div>'
                            competitorTbleRow += '<div class="widget-subheading opacity-7">' + compType + '</div>'
                            competitorTbleRow += '</div></div></div></td>'
                            competitorTbleRow += '<td><div class="badge ' + badge + '">' + status + '</div></td>'
                            competitorTbleRow += '</tr>'
                            $('#competitorsTable tbody').append(competitorTbleRow)
                        });
                    });
            });
            $('#projectCompBusy').css("display", "none")
        });
}

function showProjectLots(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/ProjectLots/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-project-diagram" style="color: #c3d98b !important"></i> Project Lots'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;ProjectLots&#39;)">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='lotsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="ProjectLotsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Lot</th><th>Description</th><th>Divisions</th><th>Subcontractors<br>(if prime)</th><th>Main Contractors</th></tr>'
    $('#ProjectLotsTable thead').append(headers)

    sprLib.list({ name: 'Project Lots', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Created', 'Description', 'Title', 'Divisions/Title', 'Subcontractor/Title', 'Subcontractor/Id', 'MainContractor/Title', 'MainContractor/Id'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Title',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var description = "&nbsp;"
                if (obj["Description"]) {
                    description = obj["Description"];
                    // description = description.length > 25 ? description.substring(0, 23) + "..." : description

                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                    // title = title.length > 15 ? title.substring(0, 12) + "..." : title;
                }
                var divisions = "&nbsp;"
                if (obj["Divisions"]) {
                    var divs = obj["Divisions"]
                    divs.forEach(function(div, idx) {
                            divisions = divisions == "&nbsp;" ? div.Title : divisions + "; " + div.Title
                        })
                        // divisions = divisions.length > 20 ? divisions.substring(0, 17) + "..." : divisions;
                }
                var subcontractors = "&nbsp;"
                var subconID = -1
                if (obj["Subcontractor"]) {
                    subcontractors = obj["Subcontractor"].Title
                    subconID = obj["Subcontractor"].Id
                        // subcontractors = subcontractors.length > 20 ? subcontractors.substring(0, 17) + "..." : subcontractors;
                }
                var contractors = "&nbsp;"
                var contractorID = -1
                if (obj["MainContractor"]) {
                    var conts = obj["MainContractor"]
                    conts.forEach(function(cont, idx) {
                            contractors = contractors == "&nbsp;" ? '<a href="javascript:openItem(&#39;PrimeContractors&#39;,' + cont.Id + ')">' + cont.Title + '</a>' : contractors + "; " + '<a href="javascript:openItem(&#39;PrimeContractors&#39;,' + cont.Id + ')">' + cont.Title + '</a>'
                        })
                        // contractors = contractors.length > 20 ? contractors.substring(0, 17) + "..." : contractors;
                }
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;ProjectLots&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + description + '</td>'
                tbleRow += '<td>' + divisions + '</td>'
                tbleRow += '<td><a href="javascript:openItem(&#39;Subcontractors&#39;,' + subconID + ')">' + subcontractors + '</a></td>'
                tbleRow += '<td>' + contractors + '</td>'
                tbleRow += '</tr>'
                $('#ProjectLotsTable tbody').append(tbleRow)
            });
            $('#lotsBusy').css("display", "none")
        });
}

function showSubcontractors(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/SubcontractorProjects/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-sitemap" style="color: #c3d98b !important"></i> Subcontractors'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;SubcontractorProjects&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='projPartnersBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="subcontractorsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center"><i class="far fa-folders"></i></th><th>Subcontractor</th><th>Registration<br> Number</th></tr>'
    $('#subcontractorsTable thead').append(headers)
    sprLib.list({ name: 'Subcontractor Projects', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Subcontractor/Id', 'Subcontractor/Title', 'Subcontractor/RegistrationNo', 'Subcontractor/MainContact'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 5000
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var title = obj["Subcontractor"].Title ? obj["Subcontractor"].Title : "&nbsp;";
                var subconId = obj["Subcontractor"].Id ? obj["Subcontractor"].Id : "&nbsp;";
                var regNo = obj["Subcontractor"].Registration ? obj["Subcontractor"].Registration : "&nbsp;";
                var address = obj["Subcontractor"].MainContact ? obj["Subcontractor"].MainContact : "&nbsp;";
                var subcontractorsTbleRow = '<tr>'
                subcontractorsTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;SubcontractorProjects&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                //subcontractorsTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                subcontractorsTbleRow += '<td class="text-center text-muted"><a href="javascript:openLink(&#39;'+title.replace(/\./g,"")+'&#39;)"><i class="far fa-folder"></i></a></td>'
                subcontractorsTbleRow += '<td><div class="widget-content p-0">'
                subcontractorsTbleRow += '<div class="widget-content-wrapper">'
                subcontractorsTbleRow += '<div class="widget-content-left flex2">'
                subcontractorsTbleRow += '<div class="widget-heading"><a style="color:#3f6ad8" href="' + _spPageContextInfo.webServerRelativeUrl + '/SitePages/SubcontractorInfo.aspx?SubcontractorID=' + subconId + '&SubcontractorTitle=' + title + '" target="_blank">' + title + '</a></div>'
                subcontractorsTbleRow += '<div class="widget-subheading opacity-7">' + address + '</div>'
                subcontractorsTbleRow += '</div></div></div></td>'
                subcontractorsTbleRow += '<td>' + regNo + '</td>'
                subcontractorsTbleRow += '</tr>'
                $('#subcontractorsTable tbody').append(subcontractorsTbleRow)
            });
            $('#projPartnersBusy').css("display", "none")
        });
}

function openLink(name){
    var url = _spPageContextInfo.webServerRelativeUrl + "/Partners/"+ name + "/" + getParameterByName("ProjectTitle").replace(/\./g,"")
    console.log(url)
    window.open(url, '_blank');
}


function showRisks(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Risks/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-exclamation-triangle" style="color: #c3d98b !important"></i> Risks'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Risks&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='risksBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="risksTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Risk</th><th>Category</th></tr>'
    $('#risksTable thead').append(headers)
    sprLib.list({ name: 'Risks', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'Category', 'Description'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 20
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var category = ""
                if (obj["Category"]) {
                    category = obj["Category"];
                    var badge = "badge-info"
                    switch (obj["Category"]) {
                        case "Environment":
                            badge = 'badge-success'
                            break;
                        case "Legal":
                            badge = "badge-danger"
                            break;
                        case "Technical":
                            badge = "badge-warning"
                            break;
                        case "Financial":
                            badge = "badge-primary"
                            break;
                    }
                }
                var description = "&nbsp;"
                if (obj["Description"]) {
                    description = obj["Description"];
                    description = description.length > 225 ? description.substring(0, 223) + "..." : description
                }
                var title = ""
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var risksTbleRow = '<tr>'
                risksTbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Risks&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                risksTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                risksTbleRow += '<td><div class="widget-content p-0">'
                risksTbleRow += '<div class="widget-content-wrapper">'
                risksTbleRow += '<div class="widget-content-left flex2">'
                risksTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                risksTbleRow += '<div class="widget-subheading opacity-7">' + description + '</div>'
                risksTbleRow += '</div></div></div></td>'
                risksTbleRow += '<td><div class="badge ' + badge + '">' + category + '</div></td>'
                risksTbleRow += '</tr>'
                $('#risksTable tbody').append(risksTbleRow)
            });
            $('#risksBusy').css("display", "none")
        });
}

function showActivities(cardID, RecID) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Activities/AllItems.aspx?ProjectTitle=' + getParameterByName("ProjectTitle") + '&ProjectID=' + RecID + '&FilterField1=Project_x003a_ID&FilterValue1=' + RecID + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-thumbtack" style="color: #c3d98b !important"></i> Activities'
    card += '</div></a><div class="btn-actions-pane-right header-icon">'
    card += '<a href="javascript:newItem(&#39;Activity&#39;)"">'
    card += '<i class="far fa-plus-square btn-icon-wrapper"></i></a></div></div>'
    card += '<div class="table-responsive projectDetailTables">'
    card += "<div id='activitiesBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="activitiesTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#' + cardID).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Activity</th><th>Due Date</th></tr>'
    $('#activitiesTable thead').append(headers)
    sprLib.list({ name: 'Activities', baseUrl: _spPageContextInfo.webServerRelativeUrl + "/" })
        .items({
            listCols: ['Id', 'Title', 'DueDate', 'Owner/Title'],
            queryFilter: '(Project/Id eq ' + RecID + ')',
            queryOrderby: 'Created desc',
            queryLimit: 20
        })
        .then(function(arrItems) {
            var todayDate = moment(new Date())
            arrItems.forEach(function(obj, idx) {
                var owner = "";
                if (obj["Owner"]) {
                    owner = obj["Owner"].Title;
                }
                var title = "&nbsp;";
                if (obj["Title"]) {
                    title = obj["Title"];
                }
                var dueDate = formatDates(obj["DueDate"])
                var dteBadge = "badge-light"
                if (obj["DueDate"]) {
                    var dDate = convertSPDate(obj["DueDate"])
                    var chkDate = convertSPDate(obj["DueDate"])

                    var diff = moment(chkDate).diff(todayDate, 'days')
                    if (diff <= 0) {
                        dteBadge = "badge-danger"
                    } else if (diff < 20) {
                        dteBadge = "badge-warning"
                    }
                }
                var activitiesTbleRow = '<tr>'
                activitiesTbleRow += '<td class="text-center text-muted">'
                activitiesTbleRow += '<a href="javascript:openItem(&#39;Activity&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                activitiesTbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                activitiesTbleRow += '<td><div class="widget-content p-0">'
                activitiesTbleRow += '<div class="widget-content-wrapper">'
                activitiesTbleRow += '<div class="widget-content-left flex2">'
                activitiesTbleRow += '<div class="widget-heading">' + title + '</a></div>'
                activitiesTbleRow += '<div class="widget-subheading opacity-7">' + owner + '</div>'
                activitiesTbleRow += '</div></div></div></td>'
                activitiesTbleRow += '<td><div class="badge ' + dteBadge + '">' + dueDate + '</div></td>'
                activitiesTbleRow += '</tr>'
                $('#activitiesTable tbody').append(activitiesTbleRow)
            });
            $('#activitiesBusy').css("display", "none")
        });
}