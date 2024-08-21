function buildOpportunitiesWorkspace(pageTable, pageCard) {
    lastestNotices("Notices", pageCard, true);
    displayClassifications();
    buildOpportunityCards("Notices");
    ProjectsAboutToRenew("Projects", "row7Col1");
    ContractsAboutToRenew("Contracts", "row7Col2")
    CRMOpportunities("row8Col1")
        // buildTaskTable(true)
}


function CRMOpportunities(cardpos) {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/CRM/AllItems.aspx">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-cloud" style="color: #bde5e3 !important"></i> CRM Opportunities'
    card += '</div></a></div>'
    card += '<div class="table-responsive oppDashTables">'
    card += "<div id='crmBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="crmTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#'+cardpos).html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Title</th><th>Description</th><th>Status</th><th>Owner</th><th>Estimated Start Date</th><th>Estimated Close Date</th><th>Budget Amount</th><th>Client</th></tr>'
    $('#crmTable thead').append(headers)


    sprLib.list('CRM Opportunities')
        .items({
            listCols: ['Id', 'Title', 'Description', 'StartDate', 'CloseDate', 'BudgetAmount', 'Client/Title', 'Owner/Title', 'Status', 'CRMLink'],
            queryOrderby: 'Id',
            queryLimit: 50
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                var Desc = obj["Description"] ? obj["Description"] : "";
                var owner = obj["Owner"] ? obj["Owner"].Title : "";
                var StartDate = obj["StartDate"] ? formatDates(obj["StartDate"]) : "";
                var CloseDate = obj["CloseDate"] ? formatDates(obj["CloseDate"]) : "";
                var BudgetAmount = obj["BudgetAmount"] ? (obj["BudgetAmount"]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') : "";
                var Client = ""
                
                if (obj["Client"]) {
                    if (obj["Client"].Title){
                        Client = obj["Client"].Title
                    }
                }
                var title = obj["Title"]
                if (obj["CRMLink"]){
                    console.log(obj["CRMLink"])
                    title = "<a href='"+obj["CRMLink"].Url+"' target='_blank'>"+ obj["Title"] + "</a>"
                }
            var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;CRM&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj['Id'] + '</td>'
                tbleRow += '<td>' + title + '</td>'
                tbleRow += '<td>' + Desc + '</td>'
                tbleRow += '<td>' + obj["Status"] + '</td>'
                tbleRow += '<td>' + owner + '</td>'
                tbleRow += '<td>' + StartDate + '</td>'
                tbleRow += '<td>' + CloseDate + '</td>'
                tbleRow += '<td>' + BudgetAmount + '</td>'
                tbleRow += '<td>' + Client + '</td>'
                tbleRow += '</tr>'
                $('#crmTable tbody').append(tbleRow)
            });
            $('#crmBusy').css("display","none")
        })
}

function buildNoticeChart(card, statusValues, statusData) {
    var chart = '<div class="mb-3 card">'
    chart += '<div class="card-header">'
    chart += '<div class="card-header-title">'
    chart += '<i class="header-icon text-muted fas fa-clipboard" style="color: #bde5e3 !important"></i> '
    chart += 'New Notices'
    chart += '</div>'
    chart += '</div>'
    chart += '<div class="card-body">'
    chart += '<canvas id="myChart" width="200" height="200"></canvas>'
    chart += '</div>'
    chart += '</div>'

    $('#' + card).html(chart)
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: statusValues,
            datasets: [{
                label: 'New Notices',
                data: statusData,
                backgroundColor: chroma.scale(['#de2366','#0663ae']).mode('lch').colors(statusValues.length),
                borderColor: chroma.scale(['#de2366','#0663ae']).mode('lch').colors(statusValues.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            scales: {
                y: {
                    ticks: {
                        beginAtZero: true,
                        stepSize: 1
                    }
                }
            }
        }
    });

}

function buildOpportunityCards(pageTable) {
    var statusValues = []
    var statusData = []
    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59"
    sprLib.list({
            name: "Notices",
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            queryFilter: '(DueDate le "' + today + '")',
        })
        .then(function(arrItems) {
            var card1 = '<div id="firstCard" class="card mb-3 widget-content bg-danger clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Expired Notices</div>'
            card1 += '<div class="widget-subheading">Notices Passed Their Due Date</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col3').html(card1)
            $('#firstCard').click(function() {
                openList("Notices", "Expired Notices")
            });
        });

    sprLib.list({
            name: 'Notices',
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: "(Status ne 'Approved') and (RequestApproval eq 1)"
        })
        .then(function(arrItems) {
            var card1 = '<div id="secondCard" class="card mb-3 widget-content bg-warning clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Notice Awaiting Approval</div>'
            card1 += '<div class="widget-subheading">Projects that have not yet been approved</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col2').html(card1)
            $('#secondCard').click(function() {
                openList("Notices", "Awaiting Approval")
            });
        });


    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59"
    var lWeek = moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + "T00:00:00";
    var todayDate = moment(new Date())
    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'Title', 'MinimumValue', 'MaximumValue', 'URL', 'Status', 'DueDate', 'Created', 'Modified'],
            queryFilter: '(Modified le "' + today + '") and (Modified ge "' + lWeek + '")',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            var card1 = '<div id="thirdCard" class="card mb-3 widget-content bg-arielle-smile clickLink">'
            card1 += '<div class="widget-content-wrapper text-white">'
            card1 += '<div class="widget-content-left">'
            card1 += '<div class="widget-heading">Latest Notices</div>'
            card1 += '<div class="widget-subheading">Total Notices added in last 7 days</div>'
            card1 += '</div>'
            card1 += '<div class="widget-content-right">'
            card1 += '<div class="widget-numbers text-white"><span>' + arrItems.length + '</span></div>'
            card1 += '</div>'
            card1 += '</div>'
            card1 += '</div>'
            $('#row1Col1').html(card1)
            $('#thirdCard').click(function() {
                openList("Notices", "Latest Notices")
            });

        });


}

function lastestNotices(pageTable, pageCard, showChart) {
    $('#' + pageCard).html("")

    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/'+pageTable+'/LatestNotices.aspx">'
    card += '<i class="header-icon text-muted fas fa-clipboard" style="color: #bde5e3 !important"></i> Latest Notices</a></div>'
    card += '<div class="table-responsive">'
    card += "<div id='latestNoticesBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="latestNoticeTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'

    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Notice</th><th>Value</th><th>Status</th><th>Due Date</th></tr>'

    $('#latestNoticeTable thead').append(headers)
    var today = moment(new Date()).format('YYYY-MM-DD') + "T23:59:59"
    var lWeek = moment(new Date()).add(-7, 'days').format('YYYY-MM-DD') + "T00:00:00";
    var todayDate = moment(new Date())
    sprLib.list({
            name: pageTable,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'Title', 'MinimumValue', 'MaximumValue', 'URL', 'Status', 'DueDate', 'Created', 'Modified'],
            queryFilter: '(ShowInLatestNotices eq 1)',
            queryOrderby: 'Created desc'
        })
        .then(function(arrItems) {
            var statusValues = []

            for (u = 6; u >= 1; u--) {
                statusValues.push(moment(new Date()).subtract(u, 'days').format('DD/MM'))
            }
            statusValues.push(moment(new Date()).format('DD/MM'))
            var statusData = [0, 0, 0, 0, 0, 0, 0]
            arrItems.forEach(function(obj, idx) {

                var cDate
                if (obj["Modified"].indexOf("T") != -1) {
                    var tmp = obj["Modified"].split("T")[0].split("-")
                    cData = tmp[2] + '/' + tmp[1]
                }
                if (obj["Modified"].indexOf(" ") != -1) {
                    var tmp = obj["Modified"].split(" ")[0].split("-")
                    cData = tmp[2] + '/' + tmp[1]
                }

                if (jQuery.inArray(cData, statusValues) !== -1) {
                    statusData[jQuery.inArray(cData, statusValues)] += 1

                }

                var status = ""
                if (obj["Status"]) {
                    status = obj["Status"];
                }
                var maxValue = 0
                if (obj["MaximumValue"]) {
                    maxValue = (obj["MaximumValue"]).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
                }

                var client = ""

                var noticeTitle = obj["Title"]
                if (obj["URL"]){
                    noticeTitle = "<a href='"+obj["URL"]+"' target='_blank'>"+obj["Title"]+"</a>"
                }

                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="' + pageTable + '">'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;'+pageTable+'&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + noticeTitle + '</div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + client + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '<td style="text-align:right;">' + maxValue + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="badge badge-info">' + status + '</div>'
                tbleRow += '</td>'
                tbleRow += '<td>'
                tbleRow += formatDates(obj["DueDate"])
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#latestNoticeTable tbody').append(tbleRow)
            });
            $('#latestNoticeTableRow').click(function() {
                openWorkSpace($(this).attr("recid"), $(this).attr("table"))
            });
            if($('#latestNoticeTable_length').length == 0){
                var table = $('#latestNoticeTable').DataTable({
                    "order": []
                });
            }
            $("#latestNoticeTable thead tr:not(:first)").hide(); 
            if (showChart) {
                buildNoticeChart("row6Col2", statusValues, statusData)
            }
            $('#latestNoticesBusy').css("display","none")
        });
}

function displayClassifications() {
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Classifications/AllItems.aspx">'
    card += '<div class="card-header-title"><i class="header-icon fas fa-binoculars" style="color: #bde5e3 !important"></i> Track Classifications'
    card += '</div></a></div>'
    card += '<div class="table-responsive oppDashTables">'
    card += "<div id='classBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="classificationsTable" class="scrollableTable align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead></thead><tbody></tbody></table></div></div>'

    $('#row6Col1').html(card)
    var headers = '<tr><th class="text-center">Edit</th><th class="text-center">#</th><th>Description</th></tr>'
    $('#classificationsTable thead').append(headers)


    sprLib.list('Classifications')
        .items({
            listCols: ['Id', 'Title', 'Description'],
            queryOrderby: 'Title desc',
            queryLimit: 50
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
            var tbleRow = '<tr>'
                tbleRow += '<td class="text-center text-muted"><a href="javascript:openItem(&#39;Classifications&#39;,' + obj['Id'] + ')"><i class="far fa-edit"></i></a></td>'
                tbleRow += '<td class="text-center text-muted">' + obj["Title"] + '</td>'
                tbleRow += '<td>' + obj["Description"] + '</td>'
                tbleRow += '</tr>'
                $('#classificationsTable tbody').append(tbleRow)
            });
            $('#classBusy').css("display","none")
        })
}
