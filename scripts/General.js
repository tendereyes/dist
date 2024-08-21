function SetUserAgent() {
    navigator.__defineGetter__('userAgent', function() {
        return "NONISV|TenderEyes Software|TenderEyes/4.1"
    });
    navigator.__defineGetter__('appName', function() {
        return "TenderEyes"
    });
}

function setHistory(pageName) {
    var stateObj = { TenderEyesV4: pageName };
    var locHref = window.location.href
    if (!locHref.endsWith("#")) {
        locHref = locHref.replace(/#/g, "")
    }
    history.pushState(stateObj, pageName, locHref);
}

function buildRecentItems(ID, Title, AppName, ItemType, InternalName) {

    var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
    fieldXML += "<Method ID='1' Cmd='New'>"
    fieldXML += "<Field Name='Title'>" + Title + "</Field>"
    fieldXML += "<Field Name='ItemID'>" + ID + "</Field>"
    fieldXML += "<Field Name='AppName'>" + AppName + "</Field>"
    fieldXML += "<Field Name='ItemType'>" + ItemType + "</Field>"
    fieldXML += "<Field Name='InternalName'>" + InternalName + "</Field>"
    fieldXML += "<Field Name='ItemTitle'>" + Title + "</Field>"
    fieldXML += "<Field Name='AppVersion'>" + navigator.vendor + "</Field>"
    fieldXML += "<Field Name='Platform'>" + navigator.userAgentData.platform + "</Field>"
    fieldXML += "</Method>"
    fieldXML += "</Batch>"
    updateItem("Recent Items", fieldXML, true);
}

function SetIcon() {
    //$('#pageTitle').css("margin-left", "205px");
    // $('#ctl00_onetidHeadbnnr2').attr("src", _spPageContextInfo.webServerRelativeUrl + "/SiteAssets/V4/NewLogoN.png");
    // $('#ctl00_onetidHeadbnnr2').css("position", "fixed").css("width", "279px").css("left", "23px").css("top", "102px").css("max-width", "279px");

    var lImg = _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/images/TenderEyes Logo.png'
    var sImg = _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/V4/NewLogoT.png'

    var siteImage = '<picture>'
    siteImage += '<source class="logo-mobile-home" srcset="' + sImg + '" media="(max-width: 600px)">'
    siteImage += '<source class="logo-tablet-home" srcset="' + sImg + '" media="(max-width: 900px)">'
    siteImage += '<source class="logo-desktop-home" srcset="' + lImg + '" media="(min-width: 900px)">'

    siteImage += '<img style="position: fixed; left: 23px; top: 95px; max-width:279px" src="' + lImg + '" alt="TenderEyes" style="width:auto;">'
    siteImage += '</picture>'
    $('.ms-siteicon-a').html(siteImage)

}

function setURLParam(param, setting) {
    var queryParams = new URLSearchParams(window.location.search);
    queryParams.set(param, setting);
    history.replaceState(null, null, "?" + queryParams.toString());
}

function setupFavourite(obj) {
    var favouriteID = obj.text() + '#' + getAttributes(obj)
    if (FavouritePagesId.indexOf(favouriteID) != -1) {
        $('#addFavourite').attr("data-original-title", "Remove from Favourites")
    } else {
        $('#addFavourite').attr("data-original-title", "Add to Favourites")
    }
    $('#addFavourite').attr("FavID", favouriteID)
}

function removeFromFavourites(obj) {
    if (FavouritePagesId.indexOf(obj.attr("favid")) != -1) {
        var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
        fieldXML += "<Method ID='1' Cmd='Update'>"
        fieldXML += "<Field Name='ID'>" + userSettingsId + "</Field>"
        var newFavs = FavouritePagesId.replace(obj.attr("favid"), "").replace(/,,/g, ",");
        fieldXML += "<Field Name='FavouritePages'>" + newFavs + "</Field>"
        fieldXML += "</Method></Batch>"
        updateItem("UserSettings", fieldXML, false);
        buildMenu()
    }
}

function addToFavourites(obj) {
    if (FavouritePagesId.indexOf(obj.attr("favid")) == -1) {
        if (userSettingsId == -1) {
            var newFieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
            newFieldXML += "<Method ID='1' Cmd='New'>"
            newFieldXML += "<Field Name='Title'>" + _spPageContextInfo.userId + "</Field>"
            newFieldXML += "<Field Name='FavouritePages'>" + obj.attr("favid") + "</Field>"
            newFieldXML += "</Method></Batch>"
            updateItem("UserSettings", newFieldXML, false);
        } else {
            var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
            fieldXML += "<Method ID='1' Cmd='Update'>"
            fieldXML += "<Field Name='ID'>" + userSettingsId + "</Field>"
            var newFavs = FavouritePagesId == "" ? obj.attr("favid") : FavouritePagesId + "," + obj.attr("favid");
            fieldXML += "<Field Name='FavouritePages'>" + newFavs + "</Field>"
            fieldXML += "</Method></Batch>"
            updateItem("UserSettings", fieldXML, false);
        }
        buildMenu()
    }
}

function saveAllFavourites() {
    var newFaves = ""
    $("[favourite]").each(function() {
        favItem = $(this).text() + '#' + getAttributes($(this))
        newFaves += favItem + ","
    });
    var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
    fieldXML += "<Method ID='1' Cmd='Update'>"
    fieldXML += "<Field Name='ID'>" + userSettingsId + "</Field>"
    fieldXML += "<Field Name='FavouritePages'>" + newFaves + "</Field>"
    fieldXML += "</Method></Batch>"
    updateItem("UserSettings", fieldXML, false);
}

function getAttributes($node) {
    var attrs = "";
    $.each($node[0].attributes, function(index, attribute) {
        if (attribute.name != "favourite") {
            attrs += attribute.name + ";" + attribute.value + "~";
        }
    });

    return attrs;
}

function hideDropDown(obj) {
    if (obj.hasClass("dropdown-item")) {
        $('div[aria-labelledby="' + obj.parent().attr("aria-labelledby") + '"]').removeClass("show")
    }
}

function SaveRecord(List, RecID, columns) {
    if (RecID == "") {
        var Title = ""
        for (i = 0; i < columns.length; i++) {
            if (columns[i].name == "Title") {
                Title = $('#' + columns[i].fieldid).val()
            }
        }
        var newFieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
        newFieldXML += "<Method ID='1' Cmd='New'>"
        newFieldXML += "<Field Name='Title'>" + Title + "</Field>"
        newFieldXML += "</Method></Batch>"
        RecID = updateItem(List, newFieldXML, false, true);
    }

    var fieldXML = "<Batch OnError='Continue' PreCalc='TRUE'>"
    fieldXML += "<Method ID='1' Cmd='Update'>"
    fieldXML += "<Field Name='ID'>" + RecID + "</Field>"
    for (i = 0; i < columns.length; i++) {
        if (columns[i].type == "text") {
            fieldXML += "<Field Name='" + columns[i].name + "'>" + STSHtmlEncode($('#' + columns[i].fieldid).val()) + "</Field>"
        }
        if (columns[i].type == "textarea") {
            console.log(columns[i])
            if (columns[i].TagName == "div") {
                var markupStr = $('#' + columns[i].fieldid).summernote('code');
                console.log(markupStr)
                fieldXML += "<Field Name='" + columns[i].name + "'>" + STSHtmlEncode(markupStr) + "</Field>"
            } else {
                var value = $('#' + columns[i].fieldid).val()
                fieldXML += "<Field Name='" + columns[i].name + "'>" + STSHtmlEncode(value) + "</Field>"
            }
        }
        if (columns[i].type == "select" || columns[i].type == "lookup") {
            if ($("#" + columns[i].fieldid + " :selected").val() != "" && $("#" + columns[i].fieldid + " :selected").val() != "-1") {
                fieldXML += "<Field Name='" + columns[i].name + "'>" + $("#" + columns[i].fieldid + " :selected").val() + "</Field>"
            } else {
                fieldXML += "<Field Name='" + columns[i].name + "'></Field>"
            }
        }
        if (columns[i].type == "date") {
            if ($('#' + columns[i].fieldid).val() != "") {
                fieldXML += "<Field Name='" + columns[i].name + "'>" + $('#' + columns[i].fieldid).val() + "T00:00:00Z" + "</Field>"
            } else {
                fieldXML += "<Field Name='" + columns[i].name + "'></Field>"
            }
        }
        if (columns[i].type == "percent") {
            if ($('#' + columns[i].fieldid).val()) {
                fieldXML += "<Field Name='" + columns[i].name + "'>" + (parseFloat($('#' + columns[i].fieldid).val()) / 100) + "</Field>"
            }
        }
        if (columns[i].type == "url") {
            if ($('#' + columns[i].fieldid).val() != "") {
                var url = $('#' + columns[i].fieldid).val() + ", " + $('#' + columns[i].fieldid + "Text").val()
                fieldXML += "<Field Name='" + columns[i].name + "'>" + STSHtmlEncode(url) + "</Field>"
            } else {
                fieldXML += "<Field Name='" + columns[i].name + "'></Field>"
            }
        }
        if (columns[i].type == "checkbox") {
            var itemCheck = ""
            if ($('#' + columns[i].fieldid).prop('checked')) {
                itemCheck = 1
            } else {
                itemCheck = 0
            }
            fieldXML += "<Field Name='" + columns[i].name + "'>" + itemCheck + "</Field>"
        }
        if (columns[i].type == "userMulti" || columns[i].type == "user") {
            var users = eval($("input[id^='" + columns[i].fieldid + "']").attr('value'))
            var userUpdate = ""
            var lName = ""
            if (users) {
                users.forEach(function(usr, idx) {
                    $().SPServices({
                        operation: "GetUserInfo",
                        async: false,
                        userLoginName: usr.AutoFillKey,
                        completefunc: function(xData, Status) {
                            $(xData.responseXML).find("User").each(function() {
                                if (userUpdate == "") {
                                    userUpdate = $(this).attr("ID") + ";#" + $(this).attr("Name")
                                } else {
                                    userUpdate += ";#" + $(this).attr("ID") + ";#" + $(this).attr("Name")
                                }
                            });
                        }
                    });
                });
            }
            fieldXML += "<Field Name='" + columns[i].name + "'>" + userUpdate + "</Field>"
        }
    }
    if (List == "Projects") {
        fieldXML += "<Field Name='Colour'>" + getRandomColor() + "</Field>"
    }
    fieldXML += "</Method></Batch>"
    RecID = updateItem(List, fieldXML, false, true);
    return RecID
}

function GetLookups(columns, recID) {
    for (i = 0; i < columns.length; i++) {
        if (columns[i].type == "userMulti") {
            BuildUserField(columns[i].fieldid, null, true)
        } else if (columns[i].type == "user") {
            BuildUserField(columns[i].fieldid, null, false)
        } else if (columns[i].type == "lookup") {
            var tmpOBJ
            if (columns[i].fieldName == "Project") {
                if (recID != "") {
                    tmpOBJ = { Id: recID }
                }
            }
            buildLookupSelect(columns[i], tmpOBJ)
        }
    }
}

function GetItemDetails(listName, RecID, columns, setChange, runComplete) {
    var listCols = []
    for (i = 0; i < columns.length; i++) {
        if (columns[i].type == 'lookup' || columns[i].type == 'userMulti') {
            listCols.push(columns[i].name + "/Id")
            listCols.push(columns[i].name + "/Title")
        } else {
            listCols.push(columns[i].name)
        }
    }
    sprLib.list({
            name: listName,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: listCols,
            queryFilter: "(Id eq " + RecID + ")"
        })
        .then(function(arrItems) {
            arrItems.forEach(function(obj, idx) {
                for (i = 0; i < columns.length; i++) {
                    if (columns[i].type == "text" || columns[i].type == "select" || columns[i].type == "textarea") {
                        if (obj[columns[i].name]) {
                            if (columns[i].TagName == "div") {
                                $('#' + columns[i].fieldid).html(obj[columns[i].name])
                                $('#' + columns[i].fieldid).summernote({
                                    tabsize: 2,
                                    height: 100,
                                    toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'underline', 'clear']],
                                        ['color', ['color']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['view', ['codeview']]
                                    ],
                                    popover: {
                                        table: [
                                            ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight', 'toggle']],
                                            ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                                            ['custom', ['tableStyles']]
                                        ],
                                    }
                                });
                            } else {
                                $('#' + columns[i].fieldid).val(obj[columns[i].name])
                            }
                        } else {
                            if (columns[i].TagName == "div") {
                                $('#' + columns[i].fieldid).summernote({
                                    tabsize: 2,
                                    height: 100,
                                    toolbar: [
                                        ['style', ['style']],
                                        ['font', ['bold', 'underline', 'clear']],
                                        ['color', ['color']],
                                        ['para', ['ul', 'ol', 'paragraph']],
                                        ['table', ['table']],
                                        ['view', ['codeview']]
                                    ],
                                    popover: {
                                        table: [
                                            ['add', ['addRowDown', 'addRowUp', 'addColLeft', 'addColRight', 'toggle']],
                                            ['delete', ['deleteRow', 'deleteCol', 'deleteTable']],
                                            ['custom', ['tableStyles']]
                                        ],
                                    }
                                });
                            }
                        }
                    } else if (columns[i].type == "date") {
                        if (obj[columns[i].name]) {
                            $('#' + columns[i].fieldid).val(extractDate(obj[columns[i].name]))
                        }
                    } else if (columns[i].type == "userMulti") {
                        BuildUserField(columns[i].fieldid, obj[columns[i].name], true)
                    } else if (columns[i].type == "user") {
                        BuildUserField(columns[i].fieldid, obj[columns[i].name], false)
                    } else if (columns[i].type == "percent") {
                        var percent = parseFloat(obj[columns[i].name]) * 100
                        $('#' + columns[i].fieldid).val(percent)
                        var barID = columns[i].fieldid + 'Bar'
                        if ($('#' + columns[i].fieldid + 'Bar').length) {
                            $('#' + columns[i].fieldid + 'Bar').text(percent + "%")
                            $('#' + columns[i].fieldid + 'Bar').attr("aria-valuenow", percent)
                            $('#' + columns[i].fieldid + 'Bar').css("width", percent + "%")
                        }
                    } else if (columns[i].type == "lookup") {
                        if (columns[i].name == "Project") {
                            var pID = ""
                            if (obj[columns[i].name]) {
                                if (obj[columns[i].name].Id) {
                                    pID = obj[columns[i].name].Id
                                }
                            }
                            buildProjectSelect(pID)
                        } else {
                            buildLookupSelect(columns[i], obj[columns[i].name])
                        }
                    } else if (columns[i].type == "url") {
                        if (obj[columns[i].name]) {
                            $('#' + columns[i].fieldid).val(obj[columns[i].name].Url)
                            $('#' + columns[i].fieldid + "Text").val(obj[columns[i].name].Description)
                        }
                    }

                }
            });
            if (runComplete) {
                readComplete();
            }
            if (setChange) {
                monitorChanges();
            }
        });
}

function buildLookupSelect(column, currentObj) {
    sprLib.list({
            name: column.lookuplist,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ["Id", column.Lookupcolumn],
            queryFilter: column.Lookupfilter,
            queryOrderby: column.Lookupcolumn,
            queryLimit: 4999
        })
        .then(function(arrItems) {
            var blankOptionRow = "<option value='-1' selected></option>"
            $('#' + column.fieldid).append(blankOptionRow)
            arrItems.forEach(function(obj, idx) {
                var selected = ""
                if (currentObj) {
                    if (currentObj.Id) {
                        if (obj.Id == currentObj.Id) {
                            selected = "selected"
                        }
                    }
                }
                var optionRow = "<option value='" + obj["Id"] + "' " + selected + ">" + obj[column.Lookupcolumn] + "</option>"
                $('#' + column.fieldid).append(optionRow)
            });
        });
}

function BuildUserField(fieldID, users, multiUser) {
    if (users) {
        if (users.length > 0) {
            var noOfUsers = 0
            var addUsers = []
            users.forEach(function(user, idx) {
                sprLib.user({ id: user.Id }).info()
                    .then(function(objUser) {
                        // Set the default user by building an array with one user object
                        var currentUser = new Object();
                        currentUser.AutoFillDisplayText = objUser.Title;
                        currentUser.AutoFillKey = objUser.LoginName;
                        currentUser.Description = objUser.Email
                        currentUser.DisplayText = objUser.Title;
                        currentUser.EntityType = "User";
                        currentUser.IsResolved = true;
                        currentUser.Key = objUser.LoginName;
                        currentUser.Resolved = true;
                        addUsers.push(currentUser);
                        noOfUsers += 1
                        if (noOfUsers == addUsers.length) {
                            initializePeoplePicker(fieldID, multiUser, addUsers);
                        }
                    });
            });
        } else {
            sprLib.user({ id: users.Id }).info()
                .then(function(objUser) {
                    // Set the default user by building an array with one user object
                    var users = new Array(1);
                    var currentUser = new Object();
                    currentUser.AutoFillDisplayText = objUser.Title;
                    currentUser.AutoFillKey = objUser.LoginName;
                    currentUser.Description = objUser.Email
                    currentUser.DisplayText = objUser.Title;
                    currentUser.EntityType = "User";
                    currentUser.IsResolved = true;
                    currentUser.Key = objUser.LoginName;
                    currentUser.Resolved = true;
                    users[0] = currentUser;
                    initializePeoplePicker(fieldID, multiUser, users);
                });
        }
    } else {
        initializePeoplePicker(fieldID, multiUser, null);
    }
}

function initializePeoplePicker(peoplePickerElementId, multiUser, users) {
    var schema = {};
    schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
    schema['SearchPrincipalSource'] = 15;
    schema['ResolvePrincipalSource'] = 15;
    schema['AllowMultipleValues'] = multiUser;
    schema['MaximumEntitySuggestions'] = 50;
    schema['Width'] = '100%';
    this.SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, users, schema);
}

function openList(ListName, viewName, additonalFilter, position) {
    sprLib.rest({
            url: _spPageContextInfo.webServerRelativeUrl + "/_api/web/lists/getbytitle('" + ListName + "')/Views",
            type: "GET",
            headers: { "accept": "application/json; odata=verbose" }
        })
        .then(function(arrItems) {
            var viewURL = ""
            var viewXml = ""
            var orderBy = ""
            var filterby = ""
            arrItems.forEach(function(obj, idx) {
                if (viewName == "") {
                    if (obj.DefaultView) {
                        var tmpURL = obj.ServerRelativeUrl
                        if (additonalFilter) {
                            tmpURL += additonalFilter
                        }
                        window.open(tmpURL, position)
                    }
                } else {
                    if (obj.Title == viewName) {
                        var tmpURL = obj.ServerRelativeUrl
                        if (additonalFilter) {
                            tmpURL += additonalFilter
                        }
                        window.open(tmpURL, position)
                    }
                }
            });
        });
}

function buildNavMenu(MenuOptions, type, view, pageName, list, page, icon, workspaceName, workspacePage) {
    var options = MenuOptions.split(";")
    var navItem = '<nav aria-label="breadcrumb">'
    navItem += '<ol class="breadcrumb">'
    navItem += '<li class="breadcrumb-item"><span class="manualBreadcrumb bMenuHeader" page="' + workspacePage + '">' + workspaceName + '</span></a></li>'
    if (page != workspacePage) {
        if (type == "ListView") {
            if (pageName != "") {
                navItem += '<li class="breadcrumb-item"><span class="manualBreadcrumb bMenuHeader" page="' + page + '" icon="' + icon + '">' + pageName + '</span></li>'
            }
            var menuItem = options[0].split(",")
            var addFilter = ''
            if (getParameterByName("ProjectID") != "") {
                addFilter = "?ProjectID=" + getParameterByName("ProjectID") + "&FilterField1=Project_x003a_ID&FilterValue1=" + getParameterByName("ProjectID")
                if (getParameterByName("ProjectTitle") != "") {
                    addFilter += "&ProjectTitle=" + getParameterByName("ProjectTitle")
                }
            }
            if (getParameterByName("ContractID") != "") {
                addFilter = "?ContractID=" + getParameterByName("ContractID") + "&FilterField1=Contract_x003a_ID&FilterValue1=" + getParameterByName("ContractID")
                if (getParameterByName("ContractTitle") != "") {
                    addFilter += "&ContractTitle=" + getParameterByName("ContractTitle")
                }
            }
            if (getParameterByName("CompetitorID") != "") {
                addFilter = "?CompetitorID=" + getParameterByName("CompetitorID") + "&FilterField1=Competitor_x003a_ID&FilterValue1=" + getParameterByName("CompetitorID")
                if (getParameterByName("CompetitorTitle") != "") {
                    addFilter += "&CompetitorTitle=" + getParameterByName("CompetitorTitle")
                }
            }
            var javaS = "openList('" + menuItem[1] + "','','" + addFilter + "','_self')"
            navItem += '<li class="breadcrumb-item"><span class="manualBreadcrumb"><a href="javascript:' + javaS + ';">' + list + '</a></span></li>'
            javaS = "openList('" + menuItem[1] + "','" + view + "','" + addFilter + "','_self')"
            navItem += '<li class="breadcrumb-item active" aria-current="page"><a href="javascript:' + javaS + ';">' + view + '</a></li>'
        } else if (type == "documentView") {
            var link = _spPageContextInfo.webServerRelativeUrl + "/" + pageName.replace(/ /g, "")
            navItem += '<li class="breadcrumb-item active" aria-current="page"><a href="' + link + '">' + pageName + '</a></li>'
        } else if (type == "multiDocumentView") {
            var link = _spPageContextInfo.webServerRelativeUrl + "/" + pageName.replace(/ /g, "")
            navItem += '<li class="breadcrumb-item active" aria-current="page">' + list + '</li>'
        } else {
            navItem += '<li class="breadcrumb-item active" aria-current="page">' + pageName + '</li>'
        }
    }
    navItem += '</ol>'
    navItem += '</nav>'

    // for (i = 0; i < options.length; i++) {
    //     var menuItem = options[i].split(",")
    //     var javaS = "void(0)"
    //     if (type = 'ListView') {
    //         javaS = "openList('" + menuItem[1] + "','" + view + "')"
    //     }
    //     navItem += '<li class="nav-item">'
    //     navItem += '<a href="javascript:' + javaS + ';" class="nav-link">'
    //     navItem += '<i class="nav-link-icon ' + menuItem[0] + '"> </i>'
    //     navItem += menuItem[1]
    //     navItem += '</a>'
    //     navItem += '</li>'
    // }

    $('#headerMenu').html(navItem)

    $('.bMenuHeader').click(function() {
        menuHeaderClick($(this));
    });
}

function menuHeaderClick(menuObj) {
    $('.mm-active').removeClass("mm-active");
    menuObj.parent().addClass("mm-active");
    buildPage(menuObj.attr("page"), menuObj.attr("icon"), true);
}

function buildDashBoardView(Page, Icon, Dashboard, Text, itemId) {
    var w = document.getElementById("s4-workspace");
    w.scrollTop = 0;
    buildPage(Page, Icon, false)
    if (itemId == 'myDashBody') {
        $('#row0Col1').html("<div id='myDashBody'></div>")
        $("#myDashBody").load(_spPageContextInfo.webServerRelativeUrl + "/SiteAssets/" + Dashboard + ".html", PageName = Page);
    } else {
        $("#" + itemId).load(_spPageContextInfo.webServerRelativeUrl + "/SiteAssets/" + Dashboard + ".html", PageName = Page);
    }
    if (Dashboard == "Tasks") {
        var tmp = ""
        buildTaskTable("row4col1", "AllMine", tmp)
    }
    if (!Dashboard) {
        buildDashboard(Dashboard, Text)
    }
}

function buildTimeline(RecordID, cardID, RecType) {
    var colour = "#c3d98b"
    var targetId = "projectTimelineModal"
    if (RecType == "Contract") {
        colour = "#62b5fa"
        targetId = 'contractTimelineModal'
    }
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon opacity-6 far fa-clock" style="color: ' + colour + ' !important"></i> '
    pieCard += RecType + ' Timeline'
    pieCard += '</div><div class="btn-actions-pane-right header-icon">'
    pieCard += '<button type="button" data-toggle="modal" data-target="#' + targetId + '" class="btn btn-outline-light"><i class="fas fa-expand header-icon mr-0"></i></button></div>'
        // <div><i class="fas fa-expand"></i></div>
    pieCard += '</div>'
    pieCard += '<div class="text-left">'
    pieCard += '<div id="projectTimeline"></div>'
    pieCard += '</div>'
    pieCard += '</div>'

    $("#" + cardID).html(pieCard);

    // Create and populate a data table.
    var data = []
    var strOrder = "<Query><Where><Eq><FieldRef Name='" + RecType + "' LookupId='TRUE'/><Value Type='Lookup'>" + RecordID + "</Value></Eq></Where><OrderBy><FieldRef Name='DueDate' Ascending='True'></FieldRef></OrderBy></Query>"
    $().SPServices({
        operation: "GetListItems",
        listName: "Stages",
        CAMLQuery: strOrder,
        completefunc: function(xData, Status) {
            $(xData.responseXML).find("z\\:row").each(function() {
                if ($(this).attr("ows_DueDate")) {
                    var year1 = $(this).attr("ows_DueDate").substring(0, 4)
                    var month1 = $(this).attr("ows_DueDate").substring(5, 7) - 1
                    var day1 = $(this).attr("ows_DueDate").substring(8, 10)
                    var dueDate = new Date(year1, month1, day1)
                    var link = '<a href="javascript:OpenPopUpPage(&#39;../Lists/Stages/EditForm.aspx?ID=' + $(this).attr('ows_ID') + '&#39;)">' + $(this).attr("ows_Title") + '</a>';
                    if ($(this).attr("ows_StartDate")) {
                        var year2 = $(this).attr("ows_StartDate").substring(0, 4)
                        var month2 = $(this).attr("ows_StartDate").substring(5, 7) - 1
                        var day2 = $(this).attr("ows_StartDate").substring(8, 10)
                        var startDate = new Date(year2, month2, day2)
                        var record = {
                            'start': new Date(year2, month2, day2),
                            'end': new Date(year1, month1, day1),
                            'content': link,
                            'className': 'stagesColorBox'
                        }
                        data.push(record)
                    } else {
                        var record = {
                            'start': new Date(year1, month1, day1),
                            'content': link,
                            'className': 'stagesColorBox'
                        }
                        data.push(record)
                    }
                }
            });
            var options = {
                width: "100%",
                height: "321px",
                editable: false, // enable dragging and editing items
                enableKeys: true,
                axisOnTop: false,
                showNavigation: false,
                style: "box",
                zoomable: false,
                timeline: {
                    colorByRowLabel: true,
                    singleColor: '#8d8'
                },
                backgroundColor: '#35ccd8'
            };
            // Instantiate our timeline object.
            timeline = new links.Timeline(document.getElementById('projectTimeline'));

            // Draw our timeline with the created data and options
            timeline.draw(data, options);
        }
    }); // specify options
}

function showStagesTimeline(cardID, RecType, RecID) {
    var today = moment(new Date()).format('YYYY-MM-DD') + "T00:00:00Z"
    var todayDate = moment(new Date())
    var cardTitle = 'Upcoming Stages'
    var taskView = 'UpcomingStages.aspx'
    var AdditionalFilter = ""
    var query = '(DueDate ge "' + today + '")'
    if (RecType == "Projects") {
        cardTitle = "Project Stages"
        taskView = "ProjectStages.aspx"
        if (RecID != "") {
            query = '(Project/Id eq ' + RecID + ")"
            AdditionalFilter = "?ProjectID=" + RecID + "&FilterField1=Project_x003a_ID&FilterValue1=" + RecID
            if (getParameterByName("ProjectTitle") != "") {
                AdditionalFilter += "&ProjectTitle=" + getParameterByName("ProjectTitle")
            }
        } else {
            query += " and (Project/Id ge 1)"
        }
    } else if (RecType == "Contracts") {
        cardTitle = "Contract Stages"
        taskView = "ContractStages.aspx"
        if (RecID != "") {
            query = '(Contract/Id eq ' + RecID + ")"
            AdditionalFilter = "?ContractID=" + RecID + "&FilterField1=Contract_x003a_ID&FilterValue1=" + RecID
            if (getParameterByName("ContractTitle") != "") {
                AdditionalFilter += "&ContractTitle=" + getParameterByName("ContractTitle")
            }
        } else {
            query += " and (Contract/Id ge 1)"
        }
    }
    sprLib.list({
            name: 'Stages',
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        })
        .items({
            queryFilter: query,
            listCols: ["Id", "Title", "DueDate", "Project/Title", "Contract/Title", "Submitted"],
            queryOrderby: "DueDate"
        })
        .then(function(arrItems) {
            var timeline = '<div class="main-card mb-3 card">'
            timeline += '<div class="card-header">'
            timeline += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/Stages/' + taskView + AdditionalFilter + '">'
            timeline += '<div class="card-header-title"><i class="header-icon fas fa-sitemap opacity-6" style="color: #1799e4 !important"></i>'
            timeline += cardTitle
            timeline += '</div></a></div>'
            timeline += "<div id='stageTimelineBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
            timeline += '<div class="card-body">'
            timeline += '<div class="vertical-time-simple vertical-without-time vertical-timeline vertical-timeline--animate vertical-timeline--one-column">'

            arrItems.forEach(function(obj, idx) {
                var record = ""
                if (obj["Project"]) {
                    record = " (" + obj["Project"].Title + ")"
                }
                if (obj["Contract"]) {
                    record = " (" + obj["Contract"].Title + ")"
                }
                var dot = "dot-warning"
                if (obj["Submitted"]) {
                    dot = "dot-success"
                } else {
                    if (obj["DueDate"]) {
                        var dueDate = convertSPDate(obj["DueDate"])

                        var diff = moment(dueDate).diff(todayDate, 'days')
                        if (diff < 20) {
                            dot = "dot-danger"
                        }
                    }
                }
                timeline += '<div class="vertical-timeline-item ' + dot + ' vertical-timeline-element">'
                timeline += '<div>'
                timeline += '<span class="vertical-timeline-element-icon bounce-in"></span>'
                timeline += '<div class="vertical-timeline-element-content bounce-in">'
                var link = 'javascript:OpenPopUpPage(&#39;../Lists/Stages/EditForm.aspx?ID=' + obj["Id"] + '&#39;)'
                timeline += '<a href="' + link + '"><p id="stage' + obj["Id"] + '" class="stageTitle">' + obj["Title"] + record + ', due on <span class="text-success">' + formatDates(obj["DueDate"]) + '</span></p></a>'
                timeline += '</div>'
                timeline += '</div>'
                timeline += '</div>'
            });
            timeline += '</div>'
            timeline += '</div>'
            timeline += '</div>'
            $('#' + cardID).html(timeline)
            $('#stageTimelineBusy').css("display", "none")
            $.contextMenu({
                selector: '.stageTitle',
                callback: function(key, options) {
                    var m = "clicked: " + key;
                },
                items: {
                    "remind": { name: "Remind", icon: "edit" },
                    "sep1": "---------",
                    "createTask": { name: "Create Task", icon: "cut" }
                }
            });

            $('.context-menu-one').on('click', function(e) {
                console.log('clicked', this);
            })
        });
}

function CalendarDisplay(CalendarList, CardPos, icon) {
    var calRootFolder = _spPageContextInfo.webServerRelativeUrl + "/Lists/" + CalendarList
    var calID = 'cal' + CalendarList.replace(/ /g, "")
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<a class="text-muted" href="' + _spPageContextInfo.webServerRelativeUrl + '/Lists/' + CalendarList + '/AllItems.aspx">'
    pieCard += '<div class="card-header-title"><i class="header-icon opacity-6 ' + icon + '" style="color: #1799e4 !important"></i>' + CalendarList + '</div></a>'
    pieCard += '</div>'
    pieCard += '<div class="text-left">'
    pieCard += '<div id="' + calID + '"></div>'
    pieCard += '</div>'
    pieCard += '</div>'

    $("#" + CardPos).html(pieCard);


    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    $('#' + calID).fullCalendar({
        theme: true,
        header: false,
        editable: true,
        contentHeight: 325,
        eventMouseover: function(event, jsEvent, view) {
            $(jsEvent.target).attr('title', event.title);
        },
        eventClick: function(event) {
            openItem(CalendarList, event.id, 'meeting')
        },
        events: function(start, end, timezone, callback) {
            var events = [];
            $().SPServices({
                operation: "GetListItems",
                listName: CalendarList,
                CAMLQuery: "<Query><Where><DateRangesOverlap><FieldRef Name='EventDate' /><FieldRef Name='EndDate' /><FieldRef Name='RecurrenceID' /><Value Type='DateTime'><Month /></Value></DateRangesOverlap></Where></Query>",
                CAMLQueryOptions: '<QueryOptions><ExpandRecurrence>TRUE</ExpandRecurrence></QueryOptions>',
                completefunc: function(xData, Status) {
                    $(xData.responseXML).find("z\\:row").each(function() {
                        var startDate = $(this).attr("ows_EventDate")
                        var endDate = $(this).attr("ows_EndDate")
                        if ($(this).attr("ows_fRecurrence") == 1) {
                            endDate = startDate
                        }
                        events.push({
                            title: $(this).attr("ows_Title"),
                            start: startDate,
                            end: endDate,
                            id: $(this).attr("ows_UniqueId").split(';')[0],
                            editable: false
                        });
                    })
                    callback(events)
                }
            });
        },
        eventColor: "#F9B017",
        firstDay: 1
    });
}

function DocsDisplay(DocumentLibraryPath, DocumentLibrary, CardPos, subSite) {
    // var documentLookup = DocumentLibraryPath.split('ProjectDocuments/')[1]
    var docRootFolder = _spPageContextInfo.webServerRelativeUrl + "/" + DocumentLibraryPath
    if (DocumentLibraryPath.indexOf(_spPageContextInfo.webServerRelativeUrl) != -1) {
        docRootFolder = DocumentLibraryPath
    }
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon opacity-6 fas fa-folder-open" style="color: #1799e4 !important"></i> '
    pieCard += '<a class="text-muted" href="' + docRootFolder + '" target="_blank">' + DocumentLibrary + "</a>"
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="text-left">'
    pieCard += '<div id="docFolder" class="scroll tree" style="width:100%;overflow-y:auto;"></div>'
    pieCard += '</div>'
    pieCard += '</div>'

    $("#" + CardPos).html(pieCard);

    var libName = docRootFolder.split("/").pop()
    getInternalDocName = libName.replace(/ /g, "%20");
    try {
        sMenuString = "";
        $.ajax({
            url: _spPageContextInfo.webAbsoluteUrl + subSite + "/_api/lists/getbytitle('" + DocumentLibrary + "')/items?$expand=Folder&$select=ID,Title,EncodedAbsUrl,FileRef,FSObjType,FileLeafRef,Folder/ServerRelativeUrl&$top=500&$orderby=FSObjType%20desc, FileRef", //assuming web part is added on same site :)  
            type: "GET",
            headers: {
                "accept": "application/json;odata=verbose"
            },
            async: false,
            success: function(docsData) {
                if (docsData.d.results.length > 0) {
                    var getValues = docsData.d.results;

                    rootFolders = $.grep(getValues, function(e) {
                        if (e.EncodedAbsUrl.split(getInternalDocName + "/")[1] != null) {
                            return e.EncodedAbsUrl.split(getInternalDocName + "/")[1].split('/').length == 1;
                        }
                    });
                    sMenuString += "<ul class='collabDocs todo-list-wrapper list-group list-group-flush'>";
                    $.each(rootFolders, function(i, rootFolder) {
                        switch (rootFolder.FileLeafRef.split('.').pop()) {
                            case 'jpg':
                            case 'jpeg':
                            case 'gif':
                            case 'png':
                                iconDoc = "far fa-file-image";
                                iconColor = '#c47601'
                                break;
                            case 'docx':
                            case 'doc':
                                iconDoc = "far fa-file-word";
                                iconColor = '#034fa5'
                                break;
                            case 'msg':
                                iconDoc = "fas fa-envelope-square";
                                iconColor = '#1f92df'
                                break;
                            case 'zip':
                                iconDoc = "far fa-file-archive";
                                iconColor = '#c401aa'
                                break;
                            case 'pdf':
                                iconDoc = "far fa-file-pdf";
                                iconColor = '#a50303'
                                break;
                            case 'html':
                                iconDoc = "far fa-file-code";
                                iconColor = '#6d007c'
                                break;
                            case 'avi':
                            case 'mov':
                            case 'mp4':
                                iconDoc = "far fa-file-video";
                                iconColor = '#01c4ba'
                                break;
                            case 'xlsx':
                            case 'xls':
                                iconDoc = "far fa-file-excel";
                                iconColor = '#237c00'
                                break;
                            case 'ppt':
                            case 'pptx':
                                iconDoc = "far fa-file-powerpoint";
                                iconColor = '#B7472A'
                                break;
                        }
                        var folderUrl = ""
                        if (rootFolder.Folder.ServerRelativeUrl) {
                            folderUrl = rootFolder.Folder.ServerRelativeUrl
                        } else {
                            folderUrl = DocumentLibraryPath
                        }
                        if (rootFolder.FileRef.indexOf(rootFolder.FileLeafRef) != -1) {
                            var pos = rootFolder.FileRef.indexOf(rootFolder.FileLeafRef)
                                // console.log("717: "+pos+" - "+rootFolder.FileRef)
                            folderUrl = rootFolder.FileRef.substring(0, pos)
                                // console.log("719: "+folderUrl)
                        }
                        var fileLR = rootFolder.FileLeafRef
                        fileLR = fileLR.length > 40 ? fileLR.substring(0, 38) + "..." : fileLR
                        if (rootFolder.FSObjType == 1) {
                            sMenuString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey' class='list-group-item'>" +
                                "<a><i style='color:#fdb900' class='fa-solid fa-folder'></i> <span>" + rootFolder.FileLeafRef + "</span></a><div class='d-flex flex-row-reverse' style='margin-top:-25px'>" +
                                '<a title="Open Library" target="_blank" href="' + folderUrl + '" class="border-0 btn-transition btn btn-outline-danger" role="button">' +
                                '<i class="fas fa-list-ul"></i></a></div>'
                            sMenuString += "<ul style='border-left:2px solid' class='todo-list-wrapper list-group list-group-flush'>";
                            SubFoldersFiles(getValues, rootFolder.FileLeafRef.replace(/ /g, '%20'), rootFolder.EncodedAbsUrl, DocumentLibraryPath, docRootFolder, DocumentLibrary);
                            sMenuString += "</ul>";
                        } else {
                            fileURL = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/WopiFrame2.aspx?sourcedoc=https://tendereyes.sharepoint.com" + encodeURIComponent(rootFolder.FileRef)
                            if (!fileURL) {
                                fileURL = _spPageContextInfo.webAbsoluteUrl + "/Pictures/text%20file.png"
                            }
                            sMenuString += "<li style='padding: 2px 0;border-bottom:0.5px solid lightgrey' class='list-group-item'><div class='widget-content p-0'>" +
                                "<div class='widget-content-wrapper'><div class='widget-content-left mr-2'>" +
                                "<i class='" + iconDoc + " fileIcon' style='color:" + iconColor + "'></i></div><div class='widget-content-left'>" +
                                "<div class='chkTreeView filePreview' fileName='" + rootFolder.FileLeafRef + "' name='TreeView' value='" + rootFolder.FileRef + "' fileURL='" + fileURL + "' href='#'>" + fileLR + "</div></div>" +
                                '<div class="widget-content-right widget-content-actions">' +
                                '<a title="Open Library" target="_blank" href="' + folderUrl + '" role="button" class="border-0 btn-transition btn btn-outline-danger">' +
                                '<i class="fas fa-list-ul"></i></a></div></div>';
                            // sMenuString += "<li><a>"+rootFolder.FileLeafRef+"</a>";
                        }
                        sMenuString += "</li>";

                    });


                    sMenuString += "</ul>";
                    $('#docFolder').html(sMenuString);
                    /*$('.chkTreeView').click(function(){
                        docDetails("this");
                    });*/

                    $('.filePreview').click(function(e) {
                        openDialog($(this).attr("fileURL"), $(this).text(), e, 'Documents')
                    })
                    $('.tree li.parent > a').click(function() {
                        $(this).parent().toggleClass('active');
                        $(this).parent().children('ul').slideToggle('fast');
                    });
                }
            }
        });
    } catch (e) {
        alert(e.message);
    }
    // $(".barMenu").click(function(e) {

    //     openDocMenu($(this).attr('subFolder'), $(this).attr("docURL"), $(this).attr("docId"))
    //     $('#dropdownMenu').dialog("option", "position", {
    //         my: "left+15 top-15",
    //         of: e
    //     });
    //     $("#dropdownMenu").dialog("open");
    // });


    return false;
}

function SubFoldersFiles(listItems, currentItem, fullUrl, DocumentLibraryPath, docRootFolder, DocumentLibrary) {
    var items = [];
    var subItems = $.grep(listItems, function(e) {
        if (e.EncodedAbsUrl.split(fullUrl + "/").length > 1) {
            var fileUrl = e.EncodedAbsUrl.split(fullUrl + "/")[1];
            if (fileUrl.split("/").length == 1) {
                return true;
            }
        }
    });

    if (subItems.length > 0) {
        $.each(subItems, function(i, subItem) {
            switch (subItem.FileLeafRef.split('.').pop()) {
                case 'jpg':
                case 'jpeg':
                case 'gif':
                case 'png':
                    iconDoc = "far fa-file-image";
                    iconColor = '#c47601'
                    break;
                case 'docx':
                case 'doc':
                    iconDoc = "far fa-file-word";
                    iconColor = '#034fa5'
                    break;
                case 'msg':
                    iconDoc = "fas fa-envelope-square";
                    iconColor = '#1f92df'
                    break;
                case 'zip':
                    iconDoc = "far fa-file-archive";
                    iconColor = '#c401aa'
                    break;
                case 'pdf':
                    iconDoc = "far fa-file-pdf";
                    iconColor = '#a50303'
                    break;
                case 'html':
                    iconDoc = "far fa-file-code";
                    iconColor = '#6d007c'
                    break;
                case 'avi':
                case 'mov':
                case 'mp4':
                    iconDoc = "far fa-file-video";
                    iconColor = '#01c4ba'
                    break;
                case 'xlsx':
                case 'xls':
                    iconDoc = "far fa-file-excel";
                    iconColor = '#237c00'
                    break;
                case 'ppt':
                case 'pptx':
                    iconDoc = "far fa-file-powerpoint";
                    iconColor = '#B7472A'
                    break;
                default:
                    iconDoc = "far fa-file-image";
                    iconColor = '#c47601'
                    break;
            }

            var fileLR = subItem.FileLeafRef
            fileLR = fileLR.length > 40 ? fileLR.substring(0, 38) + "..." : fileLR
            if (subItem.FSObjType == 1) {
                sMenuString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey'>" +
                    "<a><i style='color:#fdb900' class='fa-solid fa-folder'></i> <span>" + subItem.FileLeafRef + "</span></a>" +
                    "<div class='d-flex flex-row-reverse' style='margin-top:-25px'>" +
                    '<a title="Open Library" target="_blank" href="' + subItem.FileRef + '" class="border-0 btn-transition btn btn-outline-danger" role="button">' +
                    '<i class="fas fa-list-ul"></i></a></div>'
                sMenuString += "<ul style='border-left:2px solid' class='todo-list-wrapper list-group list-group-flush'>";
                SubFoldersFiles(listItems, subItem.FileLeafRef.replace(/ /g, '%20'), subItem.EncodedAbsUrl, DocumentLibraryPath, docRootFolder, DocumentLibrary);
                sMenuString += "</ul>";
            } else {
                fileURL = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/WopiFrame2.aspx?sourcedoc=https://tendereyes.sharepoint.com" + encodeURIComponent(subItem.FileRef)
                if (!fileURL) {
                    fileURL = _spPageContextInfo.webAbsoluteUrl + "/Pictures/text%20file.png"
                }
                var subFolderDoc = subItem.FileRef.split('/')
                var subFolder = ""
                for (var a = 0; a < subFolderDoc.length - 1; a++) {
                    subFolder += subFolderDoc[a] + "/"
                }
                sMenuString += "<li style='padding:2px 0; border-bottom:0.5px solid lightgrey' class='list-group-item'><div class='widget-content p-0'>" +
                    "<div class='widget-content-wrapper'><div class='widget-content-left mr-2'>" +
                    "<i class='" + iconDoc + " fileIcon' style='color:" + iconColor + "'></i></div><div class='widget-content-left'>" +
                    "<div class='chkTreeView filePreview' name='TreeView' fileName='" + subItem.FileLeafRef + "' value='" + subItem.FileRef + "' fileURL='" + fileURL + "'>" + fileLR + "</div></div>" +
                    '<div class="widget-content-right widget-content-actions">' +
                    '<a title="Open Library" target="_blank" href="' + subFolder + '" class="border-0 btn-transition btn btn-outline-danger" role="button">' +
                    '<i class="fas fa-list-ul"></i></a></div></div></li>';
            }
        });
    }
}


function openDialog(urlWopiFileUrl, title, e, listName) {
    refreshTable = listName
    var callOutContenBodySection = ""
    if (urlWopiFileUrl.indexOf("WopiFrame2") != -1) {
        callOutContenBodySection = getCallOutFilePreviewBodyContent(urlWopiFileUrl, 425, 252);
    } else {
        callOutContenBodySection = getPicContent(urlWopiFileUrl, 425, 252);
    }
    var x = event.clientX;
    var y = event.clientY
    openDialogWithCallBackHTML(callOutContenBodySection, title, 415, 350, x, y)
}

function openDialogWithCallBackHTML(html, theader, width, height, x, y) {
    var options = {
        html: $(html).get(0),
        title: theader,
        width: width,
        heigth: height,
        x: x,
        y: y,
        dialogReturnValueCallback: onPopUpCloseCallBack
    };
    SP.UI.ModalDialog.showModalDialog(options);
}

function getCallOutFilePreviewBodyContent(urlWOPIFrameSrc, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div class="js-callout-bodySection">';
    callOutContenBodySection += '<div class="js-filePreview-containingElement">';
    callOutContenBodySection += '<div class="js-frame-wrapper" style="line-height: 0">';
    callOutContenBodySection += '<iframe style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '&amp;action=interactivepreview&amp;wdSmallView=1" frameborder="0"></iframe>';
    callOutContenBodySection += '</div></div></div>';
    return callOutContenBodySection;
}

function getPicContent(urlWOPIFrameSrc, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div>';
    callOutContenBodySection += '<img style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '" frameborder="0">';
    callOutContenBodySection += '</div>';
    return callOutContenBodySection;
}

function openDocMenu(subFolderDoc, FileRef, ID) {
    $("#docMenuContent").html("")
    var docMenu = "<div class='dropdownMenu'><a href='javascript:openDocument(&#39;" + ID + "&#39;)'>" +
        "<div><i class='fas fa-eye'></i> Open</div></a><a href='" + subFolderDoc + "' target='_blank'>" +
        "<div><i class='fas fa-list-ul'></i> Open Library</div></a>" +
        "<a href='javascript:downloadFile(&#39;" + FileRef + "&#39;)'><div>" +
        "<i class='fas fa-download'></i> Download</div></a>"
        // +"<a href='"+checkOutLink+"'><div title='Check In/Out Document'>"
        // +"<i class='fas fa-check-square'></i> Check In/Out</div></a>"
        +
        "<a href='javascript:openVersionHistory(&#39;" + FileRef + "&#39;)'><div>" +
        "<i class='fas fa-history'></i> History</div></a></div>"
    $("#docMenuContent").append(docMenu)
}

function newItem(listName) {
    var parameter = ""
    if (getParameterByName("AdditionalFilter") != "") {
        parameter = "&" + getParameterByName("AdditionalFilter").replace("Id", "ID").replace("/", "").replace("eq", "=").replace(/ /g, "")
    }
    refreshTable = listName

    var url = _spPageContextInfo.webServerRelativeUrl + "/Lists/" + listName + "/NewForm.aspx?RootFolder=&IsDlg=1" + parameter;
    openDialogWithCallBack(url, "New Item");
}

function openItem(listName, listId) {
    refreshTable = listName
    var url = ""
    if (listName == "Pictures" || listName == "Documents") {
        url = _spPageContextInfo.webServerRelativeUrl + "/" + listName + "/Forms/EditForm.aspx?ID=" + listId;
    } else {
        url = _spPageContextInfo.webServerRelativeUrl + "/Lists/" + listName + "/EditForm.aspx?ID=" + listId;
    }
    if (listName == "QuestionsAndAnswers") {
        var url = _spPageContextInfo.webServerRelativeUrl + "/Lists/" + listName + "/EditForm.aspx?ID=" + listId
        window.open(url, '_blank');
    } else {
        openDialogWithCallBack(url, "Current Item");
    }
}

function openDocument(libraryName, fileID) {
    var url = _spPageContextInfo.webServerRelativeUrl + "/" + libraryName.replace(/\s/g, '') + "/Forms/EditForm.aspx?ID=" + fileID;
    openDialogWithCallBack(url, "Current Document");
}

function openDocumentItem(filterURL, folderName, rootFolder) {
    if (folderName.endsWith("/")) {
        folderName = folderName.slice(0, -1)
    }
    sprLib.list(rootFolder)
        .items({
            listCols: ['Id', 'Title'],
            queryFilter: "(FileRef eq '" + filterURL.replace(/ /g, '%20') + "')",
        })
        .then(function(arrItems) {
            //   console.log(arrItems)
            arrItems.forEach(function(obj, idx) {
                var url = folderName.replace(/ /g, '%20') + "/Forms/EditForm.aspx?ID=" + obj['Id'];
                openDialogWithCallBack(url, "Current Document");
            });
        })
}

function downloadFile(fileLink) {
    var downloadFile = fileLink.replace(/\s/g, '%20')
    $.fileDownload('https://tendereyes.sharepoint.com' + downloadFile)
        .done(function() {
            alert('File download a success!');
        })
        .fail(function() {
            alert('File download failed!');
        })
        .catch(function(strErr) {
            console.error(strErr);
        });


}

function openDialogWithCallBack(tUrl, tTitle) {
    var options = {
        url: tUrl,
        title: tTitle,
        dialogReturnValueCallback: onPopUpCloseCallBack
    };
    SP.UI.ModalDialog.showModalDialog(options);
}

function showHouseRules(cardID, Module, colour) {
    var pieCard = '<div class="mb-3 card" style="margin-bottom: 10px !important">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon opacity-6 fas fa-building" style="color: ' + colour + ' !important"></i> '
    pieCard += Module + ' House Rules'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div class="card-body">'
    pieCard += '<div class="card mb-3 widget-chart widget-chart2 text-left w-100" style="margin-bottom: 10px !important">'
    pieCard += '<div class="widget-chat-wrapper-outer">'
    pieCard += '<div class="widget-chart-wrapper widget-chart-wrapper-lg opacity-10 m-0">'
    pieCard += '<div class="js-frame-wrapper" style="line-height: 0">'
    pieCard += '<iframe style="width: 100%; height: 689px;" src="' + _spPageContextInfo.webAbsoluteUrl + '/_layouts/15/WopiFrame2.aspx?sourcedoc=' + _spPageContextInfo.webServerRelativeUrl + '/HouseRules/' + Module + '.pptx&amp;action=interactivepreview&amp;wdSmallView=1" frameborder="0"></iframe>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    $("#" + cardID).html(pieCard);
}


function showLibraries(listName, cardID, subSite) {
    var documentListID = ""
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-body">'
    pieCard += '<div class="text-left">'
    pieCard += '<div id="docFolder" class="scroll tree" style="height:auto;"></div>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    $("#" + cardID).html(pieCard);

    var idCount = 0

    sprLib.list({ name: listName, baseUrl: _spPageContextInfo.webServerRelativeUrl })
        .items({
            listCols: ['Id', 'Created', 'Title', 'DocumentRootFolder'],
            queryOrderby: "Title"
        })
        .then(function(arrItems) {
            var treeString = "<ul class='collabDocs'>";
            arrItems.forEach(function(obj, idx) {
                var fullTitle = obj["Title"]
                var documentURL = obj['DocumentRootFolder']
                idCount += 1
                treeString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey'><a subsite='" + subSite + "' subFolder='0' id='" + idCount + "' href='javascript:clickTree(" + idCount + ")' project='" + fullTitle + "' rootFolder='" + documentURL + "'>" + fullTitle + "</a>";
                treeString += "<ul style='border-left:2px solid'>";
                treeString += "</ul>";
            });
            treeString + "</ul>"
            $('#docFolder').html(treeString)
        });
}

function ShowDocumentLibrary(listName, cardID, subSite) {
    var pieCard = '<div class="mb-3 card">'
    pieCard += '<div class="card-body">'
    pieCard += '<div class="text-left">'
    pieCard += '<div id="docFolder" class="scroll tree" style="height:auto;"></div>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '</div>'
    $("#" + cardID).html(pieCard);

    var idCount = 1

    var treeString = "<ul class='collabDocs'>";
    treeString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey'><a subsite='" + subSite + "' subFolder='0' id='" + idCount + "' href='javascript:clickTree(" + idCount + ")' project='" + listName + "' rootFolder='" + listName.replace(/ /g, "") + "'>" + "<span class='subItem'>.</span></a><i style='color:#fdb900' class='fa-solid fa-folder'></i> <span class='openFiles subItemFolder' folder='" + idCount + "'>" + listName + "</span>";
    treeString += "<ul style='border-left:2px solid'>";
    treeString += "</ul>";
    treeString + "</ul>"
    $('#docFolder').html(treeString)
    clickTree(idCount)
    openFiles(idCount)
}


function clickTree(Id) {
    $(".openFiles").unbind("click");

    var obj = $('#' + Id)
    if (obj.attr("subFolder") == "0") {
        if (!obj.parent().hasClass("active")) {
            var DocumentLibraryPath = "/" + obj.attr("subsite") + "/" + obj.attr("rootFolder")
            if (obj.attr("subsite") == "") {
                DocumentLibraryPath = "/" + obj.attr("rootFolder")
            }
            var folders = FoldersDisplay(DocumentLibraryPath, obj.attr("project"), obj.attr("subsite"), Id)
            obj.parent().children('ul').html(folders)
        }
    }
    obj.parent().toggleClass('active');
    obj.parent().children('ul').slideToggle('fast');

    $('.openFiles').click(function() {
        openFiles($(this).attr("folder"))
    });
    return false;
}


function FoldersDisplay(docRootFolder, DocumentLibrary, subSite, parentId) {
    var libName = docRootFolder.split("/").pop()
    getInternalDocName = libName.replace(/ /g, "%20");
    var url = _spPageContextInfo.webAbsoluteUrl + "/" + subSite + "/_api/lists/getbytitle('" + DocumentLibrary + "')/items?$expand=Folder&$select=ID,Title,EncodedAbsUrl,FileRef,FSObjType,FileLeafRef,Folder/ServerRelativeUrl&$top=500&$orderby=FSObjType%20desc, FileRef"
        // try {
    var sMenuString = "";
    var IdCount = 0
    $.ajax({
        url: _spPageContextInfo.webAbsoluteUrl + "/" + subSite + "/_api/lists/getbytitle('" + DocumentLibrary + "')/items?$expand=Folder&$select=ID,Title,EncodedAbsUrl,FileRef,FSObjType,FileLeafRef,Folder/ServerRelativeUrl&$top=500&$orderby=FSObjType%20desc, FileRef", //assuming web part is added on same site :)  
        type: "GET",
        headers: {
            "accept": "application/json;odata=verbose"
        },
        async: false,
        success: function(docsData) {
            if (docsData.d.results.length > 0) {
                var getValues = docsData.d.results;
                rootFolders = $.grep(getValues, function(e) {
                    if (e.EncodedAbsUrl.split(getInternalDocName + "/")[1] != null) {
                        return e.EncodedAbsUrl.split(getInternalDocName + "/")[1].split('/').length == 1;
                    }
                });
                $.each(rootFolders, function(i, rootFolder) {
                    var folderUrl = ""
                    if (rootFolder.Folder.ServerRelativeUrl) {
                        folderUrl = rootFolder.Folder.ServerRelativeUrl
                    } else {
                        folderUrl = docRootFolder
                    }
                    var fileLR = rootFolder.FileLeafRef
                    fileLR = fileLR.length > 40 ? fileLR.substring(0, 38) + "..." : fileLR
                    if (rootFolder.FSObjType == 1) {
                        IdCount += 1

                        sMenuString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey'><a subsite='" + subSite + "' rootFolder='" + rootFolder.EncodedAbsUrl + "' subFolder='1' href='javascript:clickTree(&#34;" + parentId + "-" + IdCount + "&#34;)' id='" + parentId + "-" + IdCount + "'><span class='subItem'>.</span></a><i style='color:#fdb900' class='fa-solid fa-folder'></i> <span class='openFiles subItemFolder' folder='" + parentId + "-" + IdCount + "'>" + rootFolder.FileLeafRef + "</span>";
                        sMenuString += "<ul style='border-left:2px solid' class='todo-list-wrapper list-group list-group-flush'>";
                        sMenuString += SubFolders(getValues, rootFolder.FileLeafRef.replace(/ /g, '%20'), rootFolder.EncodedAbsUrl, parentId + "-" + IdCount, subSite);
                        sMenuString += "</ul>";
                        sMenuString += "</li>";
                    }


                });

                // sMenuString += "</ul>";

            }
        }
    });
    // } catch (e) {
    //     alert(e.message);
    // }
    return sMenuString
}

function SubFolders(listItems, currentItem, fullUrl, parentId, subSite) {
    currentItem = currentItem.replace("%20", " ")
    var items = [];
    var subItems = $.grep(listItems, function(e) {
        if (e.EncodedAbsUrl.split(fullUrl + "/").length > 1) {
            var fileUrl = e.EncodedAbsUrl.split(fullUrl + "/")[1];
            if (fileUrl.split("/").length == 1) {
                return true;
            }
        }
    });
    var idCount = 0
    var subString = ""
    if (subItems.length > 0) {
        $.each(subItems, function(i, subItem) {
            var fileLR = subItem.FileLeafRef
            fileLR = fileLR.length > 40 ? fileLR.substring(0, 38) + "..." : fileLR
            if (subItem.FSObjType == 1) {
                idCount += 1
                subString += "<li class='parent collabDocs' style='border-bottom:0.5px solid lightgrey'><a subsite='" + subSite + "' rootFolder='" + subItem.EncodedAbsUrl + "' subFolder='1' href='javascript:clickTree(&#34;" + parentId + "-" + idCount + "&#34;)' id='" + parentId + "-" + idCount + "'><span class='subItem'>.</span></a><i style='color:#fdb900' class='fa-solid fa-folder'></i> <span class='openFiles subItemFolder' folder='" + parentId + "-" + idCount + "'>" + subItem.FileLeafRef + "</span>";
                subString += "<ul style='border-left:2px solid' class='todo-list-wrapper list-group list-group-flush'>";
                subString += SubFolders(listItems, subItem.FileLeafRef.replace(/ /g, '%20'), subItem.EncodedAbsUrl, parentId + "-" + idCount, subSite);
                subString += "</ul>";
            }
        });
    }
    return subString
}

function openFileExplorer(SubFolder) {
    var url = 'file://tendereyes.sharepoint.com@SSL' + _spPageContextInfo.webServerRelativeUrl + "/" + SubFolder
    window.open(url, '_blank');
}

function openFiles(Id) {
    GetDocuments("", $('#' + Id).attr("rootFolder"), $('#' + Id).attr("subsite"))
}

function GetDocuments(libraryName, subFolderDoc, subSite, listStyle) {
    if (!listStyle) {
        listStyle = "list"
    }
    var baseURL = _spPageContextInfo.webAbsoluteUrl + "/" + subSite + "/"
    var libraryURL = ""
    if (subFolderDoc.indexOf(_spPageContextInfo.webAbsoluteUrl) == -1) {
        libraryURL = _spPageContextInfo.webAbsoluteUrl + "/" + subFolderDoc
    } else {
        libraryURL = subFolderDoc
    }
    if (subSite == "") {
        baseURL = _spPageContextInfo.webAbsoluteUrl + "/"
    }
    folderName = subFolderDoc.split("/")[subFolderDoc.split("/").length - 1]
    rootFolder = subFolderDoc.split("/").pop()
    subFolderDoc = subFolderDoc.replace(baseURL, "");
    var libSubFolderDoc = subFolderDoc
    var subFolderArray = subFolderDoc.split("/")
    var tmpSub = ""
    for (h = 0; h < subFolderArray.length; h++) {
        var fold = subFolderArray[h].replace(/([A-Z])/g, ' $1').trim()
        if (tmpSub == "") {
            tmpSub = fold
        } else {
            tmpSub = tmpSub + "/" + fold
        }
    }
    subFolderDoc = tmpSub
    var pieCard = '<div class="main-card mb-3 card">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<a href="' + libraryURL + '" target="_blank">' + subFolderDoc.replace(/%20/g, " ") + "</a>"
    pieCard += '</div>'
    pieCard += '<div class="btn-actions-pane-right header-icon">'
    pieCard += '<a href="javascript:changeDocView()"">'
    pieCard += '<i class="fa-solid fa-list-dropdown"></i></a>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += '<div id="myRecentDocs" viewType="' + listStyle + '" baseURL="' + baseURL + '" libSubFolderDoc="' + libSubFolderDoc + '" libraryName="' + libraryName + '" subFolderDoc="' + subFolderDoc + '" subSite="' + subSite + '" libraryURL="' + libraryURL + '" class="row card-body mr-0" style="height:500px;overflow-y:auto">'
    pieCard += '</div>'
    pieCard += '</div>'
        //var card = '<div class="main-card mb-3 card">'
        //card += '<div class="card-header">'
        //card += '<div class="card-header-title"><i class="header-icon fas fa-tasks opacity-6" style="color: #1799e4 !important"></i> Documents</div></div>'
        // card += '<div class="table-responsive">'
        // card += '<table id="taskTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
        // card += '<thead>'
        // card += '<tr><th><i class="fa-light fa-file"></i></th><th>Document</th><th></th><th>Category</th><th>Branch</th><th>Valid Until</th><th>Modified</th></tr>'
        // card += '</thead>'
        // card += '<tbody>'
        // card += '</tbody>'
        // card += ' </table>'
        // card += '</div>'
        // card += '</div>'
    $("#row2Col2").html(pieCard);
    readDocs(baseURL, libSubFolderDoc, subFolderDoc.split('/')[0], subFolderDoc, subSite, libraryURL, listStyle)

}

function changeDocView() {
    if ($('#myRecentDocs').attr("viewType") == 'card') {
        $('#myRecentDocs').attr("viewType", "list")
    } else {
        $('#myRecentDocs').attr("viewType", "card")
    }
    readDocs($('#myRecentDocs').attr("baseURL"), $('#myRecentDocs').attr("libSubFolderDoc"), $('#myRecentDocs').attr("subFolderDoc").split('/')[0], $('#myRecentDocs').attr("subFolderDoc"), $('#myRecentDocs').attr("subSite"), $('#myRecentDocs').attr("libraryURL"), $('#myRecentDocs').attr("listStyle"))
}

function readDocs(baseURL, libSubFolderDoc, libraryName, subFolderDoc, subSite, libraryURL, listStyle) {
    $("#myRecentDocs").html("")
    if ($('#myRecentDocs').attr("viewType") == 'list') {
        var tble = '<div class="table-responsive"><table id="documentTable" style="width:100%" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
        tble += '<thead><tr><th><i class="fa-light fa-file"></i></th><th>Document</th><th></th><th>Category</th><th>Owner</th><th>Valid Until</th><th>Modified</th></tr></thead><tbody></tbody></table></div>'
        $("#myRecentDocs").html(tble)
    }
    var authorArray = []
    var authorName = []
    sprLib.options({ baseUrl: baseURL })
    sprLib.list({
            name: libraryName,
            baseUrl: _spPageContextInfo.webServerRelativeUrl + "/"
        }).items({
            listCols: ['Id', 'Title', 'EncodedAbsUrl', 'FileRef', 'ValidUntil', 'UniqueId', 'Author/Title', 'Author/Id', 'Modified', 'Category/Title', 'FileSizeDisplay', 'Owner/Title'],
            queryOrderby: 'Title'
        })
        .then(function(arrayResults) {
            var todayDate = moment(new Date())
            arrayResults.forEach(function(obj, idx) {
                var fileName = obj['FileRef'].split('/').pop()
                var directory = obj['FileRef'].replace("/" + fileName, "")
                if (directory.endsWith(libSubFolderDoc)) {
                    var documentID = obj['UniqueId']
                    var filePreview = baseURL + "_layouts/15/Doc.aspx?sourcedoc={" + documentID + "}&action=imagepreview"
                    if (!filePreview) {
                        filePreview = _spPageContextInfo.webAbsoluteUrl + "/Pictures/text%20file.png"
                    }
                    fileURL = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/WopiFrame2.aspx?sourcedoc=" + _spPageContextInfo.portalUrl + encodeURIComponent(obj['FileRef'])
                    if (!fileURL) {
                        fileURL = _spPageContextInfo.webAbsoluteUrl + "/Pictures/text%20file.png"
                    }
                    var owner = ""
                    if (obj["Owner"]) {
                        owner = obj["Owner"].Title ? obj["Owner"].Title : "";
                    }

                    var documentIcon = "";
                    var iconColor = "orangered";
                    var iconDoc = "far fa-file-alt"

                    switch (fileName.split('.').pop()) {
                        case 'jpg':
                        case 'jpeg':
                        case 'gif':
                        case 'png':
                            fileURL = _spPageContextInfo.portalUrl + obj["FileRef"]
                            filePreview = _spPageContextInfo.portalUrl + obj["FileRef"]
                            iconDoc = "far fa-file-image";
                            iconColor = '#c47601'
                            break;

                        case 'docx':
                        case 'doc':
                            iconDoc = "far fa-file-word";
                            iconColor = '#034fa5'
                            break;
                        case 'zip':
                            iconDoc = "far fa-file-archive";
                            iconColor = '#c401aa'
                            break;
                        case 'pdf':
                            iconDoc = "far fa-file-pdf";
                            iconColor = '#a50303'
                            break;
                        case 'html':
                            iconDoc = "far fa-file-code";
                            iconColor = '#6d007c'
                            break;
                        case 'avi':
                        case 'mov':
                        case 'mp4':
                            iconDoc = "far fa-file-video";
                            iconColor = '#01c4ba'
                            break;
                        case 'xlsx':
                        case 'xls':
                            iconDoc = "far fa-file-excel";
                            iconColor = '#237c00'
                            break;
                        case 'ppt':
                        case 'pptx':
                            iconDoc = "far fa-file-powerpoint";
                            iconColor = '#B7472A'
                            break;
                    }
                    var dueDate = formatDates(obj["ValidUntil"])
                    var dteBadge = ""
                    if (obj["ValidUntil"]) {
                        var dDate = convertSPDate(obj["ValidUntil"])
                        var chkDate = convertSPDate(obj["ValidUntil"])
                        dteBadge = 'badge-success'
                        var diff = moment(chkDate).diff(todayDate, 'days')
                        if (diff <= 0) {
                            dteBadge = "badge-danger"
                        } else if (diff < 20) {
                            dteBadge = "badge-warning"
                        }
                    }
                    var date = obj['Modified']
                    var modifiedDate = formatDates(date, true)
                    var docAuthor = obj['Author'].Id
                    var authorIcon = '<div class="widget-heading author' + docAuthor + '"></div>'
                    if (jQuery.inArray(docAuthor, authorArray) == -1) {
                        authorArray.push(docAuthor)
                        authorName.push(obj['Author'].Title)
                    }

                    var docSize = humanFileSize(obj["FileSizeDisplay"]);
                    var fileTitle = ""
                    if (fileName) {
                        fileTitle = fileName
                        if (fileTitle.length > 50) {
                            fileTitle = fileTitle.substring(0, 49) + "..."
                        }
                    }
                    var docViews = 0
                    var CheckedOutByUser = ""
                    var checkOutLink = ""
                    if (obj['CheckedOutByUser']) {
                        CheckedOutByUser = obj['CheckedOutByUser'].Title
                        secondImage = "<div title='Checked out to: " + obj['CheckedOutByUser'].Title + "' class='fas fa-external-link-square fa-rotate-90 checkedOut'></div>"
                            //  checkOutLink = "javascript:CheckInFile(&#39;" + obj['Name'] + "&#39;,&#39;" + subFolderDoc + "&#39;,&#39;" + libraryName + "&#39;,&#39;listView&#39;,&#39;" + baseURL + "&#39;,&#39;" + folderName + "&#39;,&#39;" + rootFolder + "&#39;)"

                    } else {
                        //  checkOutLink = "javascript:CheckOutFile(&#39;" + obj['Name'] + "&#39;,&#39;" + subFolderDoc + "&#39;,&#39;" + libraryName + "&#39;,&#39;listView&#39;,&#39;" + baseURL + "&#39;,&#39;" + folderName + "&#39;,&#39;" + rootFolder + "&#39;)";
                    }
                    var docSearch = docAuthor + ";" + modifiedDate + ";" + fileTitle;
                    if ($('#myRecentDocs').attr("viewType") == 'card') {
                        var recentDocList = '<div class="col-xs-12 col-sm-6 rowCol">' +
                            '<div class="mb-3 card"><div class="card-header">' +
                            '<div class="docCardHeader text-capitalize" ><i class="header-icon ' + iconDoc + ' mr-3 text-muted opacity-6" style="color:' + iconColor + ' !important"></i>' + fileTitle + '</div>' +
                            '<div class="btn-actions-pane-right actions-icon-btn"><div class="btn-group dropdown">' +
                            '<button type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" class="btn-icon btn-icon-only btn btn-link">' +
                            '<i class="btn-icon-wrapper fas fa-bars"></i></button>' +
                            '<div tabindex="-1" role="menu" aria-hidden="true" class="dropdown-menu-shadow dropdown-menu-hover-link dropdown-menu">' +
                            '<h6 tabindex="-1" class="dropdown-header">Document Actions</h6>' +
                            "<a role='button' class='chkTreeView filePreview dropdown-item' fileName='" + fileName + "' name='TreeView' value='" +
                            obj['EncodedAbsUrl'] + "' fileURL='" + fileURL + "' href='#'><i class='dropdown-icon fas fa-eye'></i><span>Open</span></a>" +
                            '<a target="_blank" href=' + libraryURL + '><button type="button" tabindex="0" class="dropdown-item">' +
                            '<i class="dropdown-icon fas fa-list-ul"></i><span>Open Library</span></button></a>' +
                            '<a target="_blank" href="' + obj['EncodedAbsUrl'].replace(/\s+/g, '%20') + '"><button type="button" tabindex="0" class="dropdown-item">' +
                            '<i class="dropdown-icon fas fa-download"> </i><span>Download</span></button></a><div tabindex="-1" class="dropdown-divider"></div></div></div></div></div>' +
                            '<div class="DocumentPic"><img style="display: block; margin: 0 auto;max-width:285px" src="' + filePreview + '"/></div>' +
                            '<div class="pt-2 pb-0 card-body" style="align-self:center"><h6 class="text-muted text-uppercase font-size-md opacity-9 mb-2 font-weight-normal">Information</h6>' +
                            '<div class="scroll-area-md shadow-overflow" style="height:150px !important"><div class="scrollbar-container ps ps--active-y">' +
                            '<ul class="rm-list-borders rm-list-borders-scroll list-group list-group-flush"><li class="list-group-item">' +
                            '<div class="widget-content p-0"><div class="widget-content-wrapper"><div class="widget-content-left mr-3">Modifed</div>' +
                            '<div class="widget-content-left"><div class="widget-heading">' + modifiedDate + '</div></div></div></div></li>' +
                            '<li class="list-group-item"><div class="widget-content p-0"><div class="widget-content-wrapper">' +
                            '<div class="widget-content-left mr-3">Author</div><div class="widget-content-left" style="display:contents">' + obj['Author'].Title + '</div></div></div></li>' +
                            '</ul><div class="grid-menu grid-menu-2col"><div class="no-gutters row"><div class="p-2 col-sm-6">' +
                            '<div class="widget-content-wrapper"><div class="widget-content-left mr-3">Views</div><div class="widget-content-left">' +
                            '<div class="widget-heading">' + docViews + '</div></div></div></div>' +
                            '<div class="p-2 col-sm-6"><div class="widget-content-wrapper"><div class="widget-content-left mr-3">Size</div><div class="widget-content-left">' +
                            '<div class="widget-heading">' + shortenLargeNumber(parseFloat(docSize).toFixed(2), 0) + 'B</div></div></div></div></div></div></div></div></div></div></div>'
                        $("#myRecentDocs").append(recentDocList);
                    } else {
                        var Categories = "";
                        if (obj["Category"]) {
                            obj["Category"].forEach(function(cat, idx) {
                                Categories = Categories == "" ? cat.Title : Categories + "; " + cat.Title
                            })
                        }
                        var source = "https://tendereyes.sharepoint.com" + encodeURIComponent(obj['FileRef'])
                        var recentDocList = GetDocumentLine(obj["Id"], '<div class="badge ' + dteBadge + '">' + dueDate + '</div>', '<i class="header-icon ' + iconDoc + ' mr-3 text-muted opacity-6" style="color:' + iconColor + ' !important"></i>', fileName, Categories, owner, modifiedDate, obj['Author'].Title, source, libraryName, obj["FileSizeDisplay"])
                        $("#documentTable > tbody").append(recentDocList);
                    }
                }
            });
            // $.contextMenu({
            //     selector: '.docMenu',
            //     trigger: 'left',
            //     callback: function(key, options) {
            //         var m = "clicked: " + key + ' ' + $(this).attr("docsource");
            //         window.console && console.log(m) || alert(m);
            //     },
            //     items: {
            //         "edit": { name: "Edit", icon: "far fa-edit" },
            //         "cut": { name: "Beer", icon: "fas fa-beer" },
            //         copy: { name: "Cloud download", icon: "far fa-cloud-download" },
            //         "paste": { name: "Certificate", icon: "far fa-certificate" }
            //     }
            // });
            $('.docMenu').click(function(e) {
                OpenFileInModal($(this), e)
            });
            if ($.fn.dataTable.isDataTable('#documentTable')) {} else {
                try {
                    var table = $('#documentTable').DataTable({
                        "order": [],
                    });
                } catch (err) {}
            }
            for (var a = 0; a < authorArray.length; a++) {
                if (authorArray[a] != "") {
                    $('.author' + authorArray[a]).html('<img width="38" data-toggle="tooltip" data-placement="top" title="' + authorName[a] + '" class="rounded-circle" src="' + _spPageContextInfo.webAbsoluteUrl + '/SiteAssets/Images/defaultUser.png" alt>')
                    SetPersonIcon(authorArray[a], authorName[a])
                }

            }
            $('.DocumentPic').css({ "height": "168px", "overflow-y": "auto", "overflow-x": "hidden", "border": "1px solid #d8d8d8" })
            $('.docCardHeader').css({ "font-size": "13px !important", "max-width": "80%", "display": "flex", "align-items": "end", "height": "40px", "overflow-y": "auto", "overflow-x": "hidden" })
            $('.filePreview').click(function(e) {
                openDialog($(this).attr("fileURL"), $(this).text(), e, 'Documents')
            });
        });
}

function GetDocumentLine(id, validuntil, icon, Title, Category, Branch, Modified, ModifiedBy, source, libraryName, fileSize) {
    var TbleRow = '<tr>'
    TbleRow += '<td class="text-left" style="width:15px;font-size: 20px">' + icon + '</td>'
    TbleRow += '<td class="text-left">' + Title + '</td>'
    TbleRow += '<td class="text-left"><i docversion="" docmodified="' + Modified + '" docmodifiedby="' + ModifiedBy + '" docfilesize="' + fileSize + '" doclibrary="' + libraryName + '" doctitle="' + Title + '" docid="' + id + '" docsource="' + source + '" style="cursor:pointer" class="fa-regular fa-ellipsis-vertical docMenu"></i></td>'
    TbleRow += '<td class="text-left">' + Category + '</td>'
    TbleRow += '<td class="text-left">' + Branch + '</td>'
    TbleRow += '<td class="text-left">' + validuntil + '</td>'
    TbleRow += '<td><div class="widget-content p-0">'
    TbleRow += '<div class="widget-content-wrapper">'
    TbleRow += '<div class="widget-content-left flex2">'
    TbleRow += '<div class="widget-heading">' + Modified + '</a></div>'
    TbleRow += '<div class="widget-subheading opacity-7">' + ModifiedBy + '</div>'
    TbleRow += '</div></div></div></td>'
    TbleRow += '</tr>'
    return TbleRow
}

function OpenFileInModal(thisElement, e) {
    // var myhtml = document.createElement('div');
    // myhtml.innerHTML = '<img src="http://mysite/doc/product.jpg" onclick="SP.UI.ModalDialog.commonModalDialogClose (SP.UI.DialogResult.cancel); return false;" height="300 px " width="98 % ">';
    // var options = SP.UI.$create_DialogOptions();
    var callOutContenBodySection = ""
    var filePath = thisElement.attr("docsource").replace(/%20/g, " ").replace(/%2F/g, "/")
    var filename = filePath.split("/").pop()
    var urlWopiFileUrl = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/WopiFrame2.aspx?sourcedoc=" + filePath
    if (filename.split('.').pop() == "jpg" || filename.split('.').pop() == "jpeg" || filename.split('.').pop() == "gif" || filename.split('.').pop() == "png") {
        urlWopiFileUrl = filePath
    }
    var LibraryPath = filePath.replace(filename, "")
    var LibraryName = thisElement.attr("doclibrary")
    if (urlWopiFileUrl.indexOf("WopiFrame2") != -1) {
        callOutContenBodySection = getCallOutFilePreviewBodyContent(urlWopiFileUrl, filePath, LibraryPath, thisElement.attr("docid"), LibraryName, thisElement.attr("docfilesize"), thisElement.attr("docmodified"), thisElement.attr("docmodifiedby"), thisElement.attr("docversion"), 725, 352);
    } else {
        callOutContenBodySection = getPicFormContent(urlWopiFileUrl, filePath, LibraryPath, thisElement.attr("docid"), LibraryName, thisElement.attr("docfilesize"), thisElement.attr("docmodified"), thisElement.attr("docmodifiedby"), thisElement.attr("docversion"), 725, 352);
    }
    var x = event.clientX;
    var y = event.clientY
    openDialogWithCallBackHTML(callOutContenBodySection, thisElement.attr("doctitle"), 755, 360, x, y)
    if ($(window).scrollTop() > 0) {
        $('.ms-dlgContent').css('top', $(window).scrollTop() + ($(window).height() - $('.ms-dlgContent').height()) / 2 + "px");
    }
}

function getPicFormContent(urlWOPIFrameSrc, filePath, LibraryPath, fileID, LibraryName, fileSize, modified, modifiedby, version, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div style="margin-top:0px !important;" class="js-callout-bodySection">';
    callOutContenBodySection += '<div style="margin-botton:4px !important;" > File Size: ' + humanFileSize(fileSize) + ' Last Modified: ' + modified + " by " + modifiedby + "</div>"
    callOutContenBodySection += '<div class="js-filePreview-containingElement">';
    callOutContenBodySection += '<div class="js-frame-wrapper" style="line-height: 0">';
    callOutContenBodySection += '<img style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '" frameborder="0">';
    callOutContenBodySection += '</div></div>';
    callOutContenBodySection += '<table style="width:100%;">';
    callOutContenBodySection += '<tr>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openDocFile(&#39;' + filePath + '&#39;)"><i class="fa-solid fa-file"></i>&nbsp;Open File</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openItem(&#39;' + LibraryName + '&#39;,&#39;' + fileID + '&#39;)"><i class="fa-solid fa-pen-to-square"></i>&nbsp;Edit Properties</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="CopyLink(&#39;' + filePath + '&#39;)"><i class="fa-solid fa-copy"></i>&nbsp;Copy Link</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="downloadFile(&#39;' + filePath + '&#39;)"><i class="fa-regular fa-file-export"></i>&nbsp;Download File</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openLibrary(&#39;' + LibraryPath + '&#39;)"><i class="fa-regular fa-files"></i>&nbsp;Open Library</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openVersionHistory(&#39;' + LibraryName + '&#39;,&#39;' + fileID + '&#39;)"><i class="fa-solid fa-clock-rotate-left"></i>&nbsp;Version History</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="SP.UI.ModalDialog.commonModalDialogClose (SP.UI.DialogResult.cancel); return false;"><i class="fa-regular fa-circle-xmark"></i>&nbsp;Close</div></td>'
    callOutContenBodySection += '</tr>';
    callOutContenBodySection += '</table></div>';
    return callOutContenBodySection;
}

function openDialog(urlWopiFileUrl, title, e) {

}

function getCallOutFilePreviewBodyContent(urlWOPIFrameSrc, filePath, LibraryPath, fileID, LibraryName, fileSize, modified, modifiedby, version, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div style="margin-top:0px !important;" class="js-callout-bodySection">';
    callOutContenBodySection += '<div style="margin-botton:4px !important;" > File Size: ' + humanFileSize(fileSize) + ' Last Modified: ' + modified + " by " + modifiedby + "</div>"
    callOutContenBodySection += '<div class="js-filePreview-containingElement">';
    callOutContenBodySection += '<div class="js-frame-wrapper" style="line-height: 0">';
    callOutContenBodySection += '<iframe style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '&amp;action=interactivepreview&amp;wdSmallView=1" frameborder="0"></iframe>';
    callOutContenBodySection += '</div></div>';
    callOutContenBodySection += '<table style="width:100%;">';
    callOutContenBodySection += '<tr>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openDocFile(&#39;' + filePath + '&#39;)"><i class="fa-solid fa-file"></i>&nbsp;Open File</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openItem(&#39;' + LibraryName + '&#39;,&#39;' + fileID + '&#39;)"><i class="fa-solid fa-pen-to-square"></i>&nbsp;Edit Properties</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="CopyLink(&#39;' + filePath + '&#39;)"><i class="fa-solid fa-copy"></i>&nbsp;Copy Link</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="downloadFile(&#39;' + filePath + '&#39;)"><i class="fa-regular fa-file-export"></i>&nbsp;Download File</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openLibrary(&#39;' + LibraryPath + '&#39;)"><i class="fa-regular fa-files"></i>&nbsp;Open Library</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="openVersionHistory(&#39;' + LibraryName + '&#39;,&#39;' + fileID + '&#39;)"><i class="fa-solid fa-clock-rotate-left"></i>&nbsp;Version History</div></td>'
    callOutContenBodySection += '<td>&nbsp;</td>'
    callOutContenBodySection += '<td><div style="cursor:pointer;" onclick="SP.UI.ModalDialog.commonModalDialogClose (SP.UI.DialogResult.cancel); return false;"><i class="fa-regular fa-circle-xmark"></i>&nbsp;Close</div></td>'
    callOutContenBodySection += '</tr>';
    callOutContenBodySection += '</table></div>';
    return callOutContenBodySection;
}

function CopyLink(filePath) {
    navigator.clipboard.writeText(filePath);
    alert("Copied the file path: " + filePath);
}

function humanFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + ['B', 'kB', 'MB', 'GB', 'TB'][i];
}

function openVersionHistory(libraryName, ID) {
    var listGUID = GetListId(libraryName)
    var url = _spPageContextInfo.webAbsoluteUrl + "/_layouts/15/Versions.aspx?list=" + listGUID + "&ID=" + ID;
    openDialogWithCallBack(url, "Version History");
}

function downloadFile(fileLink) {
    var downloadFile = fileLink.replace(/\s/g, '%20')
    DownloadpdfFile(downloadFile)
        // $.fileDownload(downloadFile)
        //     .done(function() {
        //         alert('File download a success!');
        //     })
        //     .fail(function() {
        //         alert('File download failed!');
        //     })
        //     .catch(function(strErr) {
        //         console.error(strErr);
        //     });


}

function openDocFile(filePath) {
    if (filePath.split('.').pop() == "jpg" || filePath.split('.').pop() == "jpeg" || filePath.split('.').pop() == "gif" || filePath.split('.').pop() == "png" || filePath.split('.').pop() == "pdf") {
        window.open(filePath, "_blank")
    } else {
        window.open(_spPageContextInfo.webAbsoluteUrl + "/_layouts/15/WopiFrame2.aspx?sourcedoc=" + filePath + "&action=edit", "_blank")
    }
}


function DownloadpdfFile(url) {
    //Set the File URL.
    var fileName = url.split("/").pop()
    $.ajax({
        url: url,
        cache: false,
        xhr: function() {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function() {
                if (xhr.readyState == 2) {
                    if (xhr.status == 200) {
                        xhr.responseType = "blob";
                    } else {
                        xhr.responseType = "text";
                    }
                }
            };
            return xhr;
        },
        success: function(data) {
            //Convert the Byte Data to BLOB object.
            var blob = new Blob([data], { type: "application/octetstream" });

            //Check the Browser type and download the File.
            var isIE = false || !!document.documentMode;
            if (isIE) {
                window.navigator.msSaveBlob(blob, fileName);
            } else {
                var url = window.URL || window.webkitURL;
                link = url.createObjectURL(blob);
                var a = $("<a />");
                a.attr("download", fileName);
                a.attr("href", link);
                $("body").append(a);
                a[0].click();
                $("body").remove(a);
            }
        }
    });
};


function openLibrary(libraryPath) {
    window.open(libraryPath, "_blank")
}

function getPicContent(urlWOPIFrameSrc, pxWidth, pxHeight) {
    var callOutContenBodySection = '<div>';
    callOutContenBodySection += '<img style="width: ' + pxWidth + 'px; height: ' + pxHeight + 'px;" src="' + urlWOPIFrameSrc + '" frameborder="0">';
    callOutContenBodySection += '</div>';
    return callOutContenBodySection;
}

function openDialogWithCallBackHTML(html, theader, width, height, x, y) {
    var options = {
        html: $(html).get(0),
        title: theader,
        width: width,
        heigth: height,
        dialogReturnValueCallback: CloseCallback
    };
    SP.UI.ModalDialog.showModalDialog(options);
}

function CloseCallback() {

}

function SetPersonIcon(personID, personName) {
    sprLib.user({ id: personID }).profile()
        .then(function(objProps) {
            var usrPic = '<img width="38" data-toggle="tooltip" data-placement="top" title="' + personName + '" class="rounded-circle" src="' + objProps.UserProfileProperties.PictureURL + '" alt>'
            $('.author' + personID).each(function(idx) {
                $(this).html(usrPic)
            });
        });

}

function addNewRisk() {
    var url = _spPageContextInfo.webServerRelativeUrl + "/Lists/Risks/NewForm.aspx?RootFolder=&IsDlg=1";
    openDialogWithCallBack(url, "New Risk");
}

function showRSSFeeds(CardPos, competitor, colour) {
    var RootFolder = _spPageContextInfo.webServerRelativeUrl + "/SitePages/RSS Feed.aspx?Competitor=" + competitor
    var pieCard = '<div class="mb-3 card" style="overflow:hidden;">'
    pieCard += '<div class="card-header">'
    pieCard += '<div class="card-header-title">'
    pieCard += '<i class="header-icon fas fa-rss-square" style="color: ' + colour + ' !important"></i> '
    pieCard += '<a class="text-muted" href="' + RootFolder + '" target="_blank">RSS Feed</a>'
    pieCard += '</div>'
    pieCard += '</div>'
    pieCard += "<div id='rssBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    pieCard += '<div id="rss-feeds" style="" class="scroll"></div>'
    pieCard += '</div>'
    pieCard += '</div>'

    $("#" + CardPos).html(pieCard);
    $().SPServices({
        operation: "GetListItems",
        listName: "RSS Feeds",
        CAMLQuery: "<Query><Where><Eq><FieldRef Name='CompetitorFeed'/><Value Type='Integer'>" + competitor + "</Value></Eq></Where></Query>",
        completefunc: function(xData, Status) {
            $(xData.responseXML).find("z\\:row").each(function() {

                $("#rss-feeds").rss($(this).attr("ows_URL"), {
                    ssl: true,
                    limit: 5,
                    entryTemplate: "<a target='_blank' href='{url}'><div class='rssTitle'>{title}<div class='rssDate'>{date}</div></div></a>",
                    tokens: {
                        year: function(entry, tokens) {
                            return new Date(entry.publishedDate).getFullYear()
                        }
                    }
                })
            });
            $('#rssBusy').css("display", "none")
        }
    });
}

function learningSupportHubNews(pageCard) {
    var objUserId = _spPageContextInfo.userId
    var card = '<div class="main-card mb-3 card">'
    card += '<div class="card-header">'
    card += '<img class="header-icon" height="35" src="' + _spPageContextInfo.webServerRelativeUrl + '/SiteAssets/V4/NewLogoT.png">  Learning and Support</div>'
    card += '<div class="table-responsive">'
    card += "<div id='activeNewsBusy' style='text-align:center;'><i style='font-size:32px; margin:10px;' class='fa-solid fa-spinner fa-spin-pulse'></i></div>"
    card += '<table id="newsTable" class="align-middle mb-0 table table-borderless table-striped table-hover table-fixed">'
    card += '<thead>'
    card += '</thead>'
    card += '<tbody>'
    card += '</tbody>'
    card += ' </table>'
    card += '</div>'
    card += '</div>'
    $('#' + pageCard).html(card)

    var headers = '<tr><th class="text-center">#</th><th>Category</th><th>News</th></tr>'

    $('#newsTable thead').append(headers)
    var today = new Date()
    var query = "(ValidFrom le datetime'" + today.toISOString() + "') and (ValidUntil ge datetime'" + today.toISOString() + "')"
    sprLib.list({
            name: "TenderEyes News",
            baseUrl: "/sites/LearningAndSupportHub/"
        }).items({
            listCols: ["Id", "Title", "Description", "Category/Title"],
            queryFilter: query,
            queryOrderby: 'ValidFrom'
        })
        .then(function(arrItems) {
            console.log(arrItems)
            arrItems.forEach(function(obj, idx) {
                var Category = ""
                if (obj["Category"]) {
                    Category = obj["Category"].Title ? obj["Category"].Title : "";
                }
                var desc = obj["Description"] ? obj["Description"] : "";
                var tbleRow = '<tr class="mainTableRow" recid="' + obj["Id"] + '" table="TenderEyes News">'
                tbleRow += '<td class="text-center text-muted">' + obj["Id"] + '</td>'
                tbleRow += '<td class="text-muted">' + Category + '</td>'
                tbleRow += '<td>'
                tbleRow += '<div class="widget-content p-0">'
                tbleRow += '<div class="widget-content-wrapper">'
                tbleRow += '<div class="widget-content-left flex2">'
                tbleRow += '<div class="widget-heading">' + obj["Title"] + '</a></div>'
                tbleRow += '<div class="widget-subheading opacity-7">' + desc + '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</div>'
                tbleRow += '</td>'
                tbleRow += '</tr>'
                $('#newsTable tbody').append(tbleRow)
            });

            var table = $('#newsTable').DataTable({
                "order": []
            });
            $('#activeNewsBusy').css("display", "none")
        });
}