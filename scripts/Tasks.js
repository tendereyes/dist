function extractDate(inpDate) {
    var localDate = new Date(inpDate);
    var nMonth = parseInt(localDate.getMonth()) + 1
    var outDate = localDate.getFullYear() + "-" + padStringLeft(nMonth, 2) + "-" + padStringLeft(localDate.getDate(), 2)
    return outDate
}

function buildTaskCard(recType, showCard) {
    var query = '(Project ne null) and (Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    if (recType == "Contract") {
        query = '(Contract ne null) and (Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    }
    sprLib.list({
            name: "Tasks",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'Title', 'Created', 'DueDate', 'Project/Title', 'Status', 'Contract/Title'],
            queryFilter: query,
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            var card1 = '<div id="taskCard" class="card mb-3 widget-content bg-arielle-smile clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">' + recType + ' Tasks</div>'
            card1 += '<div class="widget-subheading">Total ' + recType + ' Tasks</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#' + showCard).html(card1)
            $('#taskCard').click(function() {
                openList("Tasks", recType + " Tasks")
            });
        });
}

function buildTaskTable(cardNumber, taskTypes, ProjectID) {
    var CardTitle = "My Project Tasks"
    var taskView = "Project%20Tasks.aspx"
    var AdditionalFilter = ""
    if (taskTypes == "AllOutstanding") {
        CardTitle = "My Outstanding Tasks"
        taskView = "OutstandingTasks.aspx"
    } else if (taskTypes == "AllMine") {
        CardTitle = "All My Tasks"
        taskView = "MyTasks.aspx"
    } else if (taskTypes == "Contract") {
        CardTitle = "My Contract Tasks"
        taskView = "ContractTasks.aspx"
        if (ProjectID != "") {
            CardTitle = "Contract Tasks"
            taskView = "ContractTasks.aspx"
            AdditionalFilter = "?FilterField1=Contract_x003a_ID&FilterValue1=" + ProjectID
        }
    } else if (taskTypes == "Subcontractor") {
        CardTitle = "My Subcontractor Tasks"
        taskView = "SubcontractorTasks.aspx"
        if (ProjectID != "") {
            CardTitle = "Subcontractor Tasks"
            taskView = "SubcontractorTasks.aspx"
            AdditionalFilter = "?FilterField1=Subcontractor_x003a_ID&FilterValue1=" + ProjectID
        }
    } else {
        if (ProjectID != "") {
            CardTitle = "Project Tasks"
            taskView = "Project%20Tasks.aspx"
            AdditionalFilter = "?FilterField1=Project_x003a_ID&FilterValue1=" + ProjectID
        }
    }
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Tasks/' + taskView + AdditionalFilter + '">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-tasks opacity-6" style="color: #1799e4 !important"></i> ' + CardTitle + '</div></a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='taskBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="taskTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + cardNumber).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Task</th><th>Status</th><th>Due Date</th></tr>'

    $('#taskTable thead').append(headers)
    var query = ""
    if (taskTypes == "Project") {
        query = '(Project ne null) and (Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    } else if (taskTypes == "AllOutstanding") {
        query = '(Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    } else if (taskTypes == "AllMine") {
        query = '(AssignedTo eq "' + _spPageContextInfo.userId + '")'
    } else if (taskTypes == "Contract") {
        query = '(Contract ne null) and (Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    } else if (taskTypes == "Subcontractor") {
        query = '(Subcontractor ne null) and (Status ne "Completed") and (AssignedTo eq "' + _spPageContextInfo.userId + '")'
    }
    if (ProjectID != "") {
        if (taskTypes == "Contract") {
            query = "(Contract/Id eq " + ProjectID + ")"
        } else if (taskTypes == "Subcontractor") {
            query = "(Subcontractor/Id eq " + ProjectID + ")"
        } else {
            query = "(Project/Id eq " + ProjectID + ")"
        }
    }
console.log("query", query)
    sprLib.list({
            name: "Tasks",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'Title', 'Created', 'DueDate', 'Project/Title', 'Contract/Title', 'Status'],
            queryFilter: query,
            queryOrderby: 'DueDate'
        })
        .then(function(arrItems) {
            var todayDate = moment(new Date())
            arrItems.forEach(function(obj, idx) {
                var projManager = ""

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
                    if (obj["Status"]) {
                        if (obj["Status"] == "Completed") {
                            dteBadge = "badge-success"
                        }
                    }
                }

                var Project = "&nbsp;"
                var fullProject = ""
                if (obj["Project"]) {
                    if (obj["Project"].Title) {
                        Project = obj["Project"].Title;
                    }
                }
                if (obj["Contract"]) {
                    if (obj["Contract"].Title) {
                        Project = obj["Contract"].Title;
                    }
                }
                if (ProjectID != "") {
                    Project = ""
                }

                var badge = "badge-info"
                switch (obj["Status"]) {
                    case "Completed":
                        badge = 'badge-success'
                        break;
                    case "In Progress":
                        badge = "badge-info"
                        break;
                    case "Not Started":
                        badge = "badge-danger"
                        break;
                    case "Deferred":
                        badge = "badge-secondary"
                        break;
                    case "Waiting on someone else":
                        badge = "badge-warning"
                        break;
                }
                var title = obj["Title"] ? obj["Title"] : "";
                var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="Task.aspx?TaskID=' + obj["Id"] + '&TaskTitle=' + escapeProperly(title) + '" target="_blank"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + title + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + Project + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + badge + '">' + obj["Status"] + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge ' + dteBadge + '">' + dueDate + '</div>'
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#taskTable tbody').append(tbleRow)
            });
            if ($.fn.dataTable.isDataTable('#taskTable')) {} else {
                try {
                    var table = $('#taskTable').DataTable({
                        "order": []
                    });
                } catch (err) {}
            }
            $('#taskBusy').css("display", "none")
        });
}