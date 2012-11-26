/**
Depends on  Gossamer.utils.ajax
Gossamer.utils.cookies
**/

function GossamerStorage(op) {
    var SESSION_COOKIE_NAME = 'genesis-session';
    var sessionServiceUrl = '/session.svc';

    var options = op || {};
    var deploymentName = options.deploymentName;
    var sessionCookie;
    var sessionId;
    var validSessionExists = false;

    if (!this instanceof GossamerStorage) {
        return new GossamerStorage();
    }

    this.urlFactory = new UrlFactory();

    this.application = {
        searchAll: function (queryParams) {
            var url = Genesis.storage.urlFactory.application.getSearchAllUrl(queryParams);
            Gossamer.utils.ajax.get(url, false, function (data) {
                if (data.status.code) {
                    if (typeof (data.applications) != "undefined" && data.applications != null)
                        EventManager.fire("storage.applicationFetched", this, { applications: data.applications });
                } else {
                    //TODO: Remove this and add some other handling
                    EventManager.fire("root.userLogOut", this, {});
                }
            }, function () {
                //TODO: Remove this and add some other handling
                EventManager.fire("root.userLogOut", this, {});
            });
        },
        get: function (appName, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.application.getGetUrl(appName);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (data.status.code && data.status.code == '200') {
                    if (typeof (data.application) != "undefined" && data.application != null)
                        onSuccess(data.application)
                } else {
                    onError(data)
                }
            }, function () {
                onError({})
            });
        },
        create: function (application, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.application.getCreateUrl(), application, true, function (data) {
                if (typeof (data.applicationid) != "undefined" && data.applicationid != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.applicationid, data.status.referenceid);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        createSession: function (apiKey, onSuccess, onError) {
            var inputs = { __type: "Session", ApiKey: apiKey, IsNonSliding: false, UsageCount: -1, WindowTime: Genesis.config.appSessionTime };
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.application.getCreateSessionUrl(), inputs, true, function (data) {
                if (data && data.status && data.status.code && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess();
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.message);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError(data.message);
                }
            });
        },
        deleteApplication: function (applicationId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.application.getDeleteUrl(applicationId), true, function (data) {
                data = $.parseJSON(data);
                if (data.code != undefined && data.code != null) {
                    var isSuccessful = data.code == "200";
                    if (typeof (onSuccess) == "function") {
                        onSuccess(isSuccessful);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(false);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError(false);
                }
            });
        },
        checkName: function (name, makeAsyncCall, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.application.getCheckNameUrl(name), makeAsyncCall, function (data) {

                if (typeof (data.status.code) != "undefined" && data.status.code != null && data.status.code == '200') {
                    if (typeof (onSuccess) == 'function')
                        onSuccess(data.result);
                } else {
                    if (typeof (onError) == 'function')
                        onError(false);
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError(false);
                }
            });
        },

        hasApp: function (onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.application.getHasAppUrl(), false, function (data) {
                if (data && data != null && data.status.code == '200') {
                    if (typeof (onSuccess) == 'function')
                        onSuccess(data.result);
                } else {
                    if (typeof (onError) == 'function')
                        onError(false);
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError(true);
                }
            });
        },
        getPublishStatus: function (refId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.application.getGetPublishStatusUrl(refId), true, function (data) {
                if (data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.log);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    this.session = {
        createSession: function (loginCredentials, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.session.getCreateSessionUrl(loginCredentials);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null && data.code == '200') {
                    if (typeof (onSuccess) == 'function')
                        onSuccess(data.sessionid);
                    Genesis.utils.cookies.set({ name: SESSION_COOKIE_NAME, value: data.sessionid });
                } else {
                    if (typeof (onError) == 'function')
                        onError();
                }
            });
        }
    };

    //schema storage
    this.schemas = {
        exportSchemas: function (id) {
            var url = Genesis.storage.urlFactory.schema.getExportUrl(id);

            // window.location = url;
            $('<iframe></iframe>').appendTo($(document.body)).attr('src', url).attr('id', 'tmpIFrame').css('width', '0').css('height', '0');

        },
        searchAll: function (catalogName, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.schema.getSearchAllUrl(catalogName, ['orderBy=name']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.schemas) != "undefined" && data.schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getProperties: function (schemaId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.schema.getGetPropertiesUrl(schemaId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        update: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.schema.getUpdateUrl(schema.id), schema, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.schema.getCreateUrl(), schema, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee,[data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteSchema: function (schemaId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.schema.getDeleteUrl(schemaId), false, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null && data.code == '200') {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        addProperty: function (schemaId, property, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.schema.getAddPropertyUrl(schemaId), property, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateProperty: function (schemaId, property, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.schema.getUpdatePropertyUrl(schemaId), property, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteProperty: function (schemaId, propertyId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.schema.getDeletePropertyUrl(schemaId, propertyId), true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateAttributes: function (schema, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.schema.getUpdateAttributesUrl(schema.id), schema.attributes, true, function (data) {
                if (typeof (data.schema) != "undefined" && data.schema != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schema);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getSchemaRawWithProperties: function (schemaId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Genesis.storage.urlFactory.schema.getGetUrl(schemaId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    //relation storage
    this.relations = {
        exportRelations: function (id) {
            var url = Genesis.storage.urlFactory.relation.getExportUrl(id);
            $('<iframe></iframe>').appendTo($(document.body)).attr('src', url).attr('id', 'tmpIFrame').css('width', '0').css('height', '0');
            //window.location = url;
        },

        searchAll: function (catalogName, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.relation.getSearchAllUrl(catalogName, ['orderBy=name']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.relations) != "undefined" && data.relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        searchBySchema: function (blueprintName, schemaName, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.relation.getSearchBySchemaUrl(blueprintName, schemaName);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.relations) != "undefined" && data.relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getProperties: function (relationId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.relation.getGetPropertiesUrl(relationId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee,[data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.relation.getCreateUrl(), relation, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.relation.getUpdateUrl(relation.id), relation, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateEndPoint: function (relationId, endPoint, type, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.relation.getUpdateEndPointUrl(relationId, type), endPoint, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee, [data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteRelation: function (relationId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.relation.getDeleteUrl(relationId), false, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null && data.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        addProperty: function (relationId, property, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.relation.getAddPropertyUrl(relationId), property, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateProperty: function (relationId, property, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.relation.getUpdatePropertyUrl(relationId), property, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteProperty: function (relationId, propertyId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.relation.getDeletePropertyUrl(relationId, propertyId), true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateAttributes: function (relation, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.relation.getUpdateAttributesUrl(relation.id), relation.attributes, true, function (data) {
                if (typeof (data.relation) != "undefined" && data.relation != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relation);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getRelationRawWithProperties: function (relationId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Genesis.storage.urlFactory.relation.getGetUrl(relationId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    //cannedlist storage
    this.cannedLists = {
        exportLists: function (id) {
            var url = Genesis.storage.urlFactory.cannedList.getExportUrl(id);
            window.location = url;
        },

        exportListItems: function (id, cannedListId) {
            var url = Genesis.storage.urlFactory.cannedList.getListItemExportUrl(id, cannedListId);
            window.location = url;
        },

        searchAll: function (catalogName, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.cannedList.getSearchAllUrl(catalogName, ['orderBy=name']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.lists) != "undefined" && data.lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError();
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getListWithItems: function (cannedListId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.cannedList.getGetItemsUrl(cannedListId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.list);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getListItems: function (cannedListId, queryParams, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.cannedList.getSearchListItemsUrl(cannedListId, queryParams), true, function (data) {
                if (typeof (data.listitems) != "undefined" && data.listitems != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.listitems);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },


        create: function (cannedList, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.cannedList.getCreateUrl(), cannedList, true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.list);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee,[data]);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteCannedList: function (cannedListId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.cannedList.getDeleteUrl(cannedListId), true, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateListItemPosition: function (cannedListId, currentPosition, newPosition, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.cannedList.getUpdateListItemPositionUrl(cannedListId, currentPosition, newPosition), true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteListItem: function (cannedListId, listItemName, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.cannedList.getDeleteListItemUrl(cannedListId, listItemName), true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        addListItem: function (cannedListId, listItem, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.cannedList.getAddListItemsUrl(cannedListId), [listItem], true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        updateListItem: function (cannedListId, oldName, listItem, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.cannedList.getUpdateListItemUrl(cannedListId, oldName), listItem, true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (list, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.cannedList.getUpdateUrl(list.id), list, true, function (data) {
                if (typeof (data.list) != "undefined" && data.list != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.list);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getCannedListRawWithItems: function (listId, onSuccess, onError) {
            onSuccess = onSuccess || function () { };
            var url = Genesis.storage.urlFactory.cannedList.getGetUrl(listId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                onSuccess(data, url);
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    var catalogServiceUrl = '/blueprint.svc';
    this.catalogs = {
        searchAll: function (onSuccess, onError) {
            var url = Genesis.storage.urlFactory.catalog.getSearchAllUrl();
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Blueprints) != "undefined" && data.Blueprints != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Blueprints);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    this.blueprints = {
        get: function (bId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.blueprint.getGetUrl(bId), true, function (data) {
                if (typeof (data.blueprint) != "undefined" && data.blueprint != null && data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.blueprint);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        del: function (bId, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.blueprint.getDeleteUrl(bId), true, function (data) {
                if (typeof (data.code) != "undefined" && data.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess();
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (blueprint, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.blueprint.getCreateUrl(), blueprint, true, function (data) {
                if (typeof (data.blueprint) != "undefined" && data.blueprint != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.blueprint);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getAllSchemas: function (blueprintId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.schema.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.schemas) != "undefined" && data.schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllRelations: function (blueprintId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.relation.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.relations) != "undefined" && data.relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllCannedLists: function (blueprintId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.cannedList.getSearchAllUrl(blueprintId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.lists) != "undefined" && data.lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    this.deployments = {
        merge: function (dId, bName, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.deployment.getMergeUrl(dId, bName), {}, true, function (data) {
                if (data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                onError.apply(arguments.callee);
            }, true);
        },

        get: function (depId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.deployment.getGetUrl(depId), true, function (data) {
                if (typeof (data.Deployment) != "undefined" && data.Deployment != null && data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Deployment);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        exportToBlueprint: function (dId, bName, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.deployment.getExportUrl(dId, bName), {}, true, function (data) {
                if (data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                onError.apply(arguments.callee);
            });
        },

        getPublishStatus: function (refId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.deployment.getGetPublishStatusUrl(refId), true, function (data) {
                if (data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.log);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (deployment, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.deployment.getCreateUrl(), deployment, true, function (data) {
                if (typeof (data.DeploymentId) != "undefined" && data.DeploymentId != null && data.status != null && data.status.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        searchAll: function (onSuccess, onError) {
            var url = Genesis.storage.urlFactory.deployment.getFetchAllDeploymentsUrl();
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.deployments) != "undefined" && data.deployments != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.deployments);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllSchemas: function (deploymentId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.deployment.getSearchAllSchemaUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.schemas) != "undefined" && data.schemas != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.schemas);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllRelations: function (deploymentId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.deployment.getSearchAllRelationsUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.relations) != "undefined" && data.relations != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.relations);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        },

        getAllCannedLists: function (deploymentId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.deployment.getSearchAllListsUrl(deploymentId);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.lists) != "undefined" && data.lists != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.lists);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError();
                }
            });
        }
    };

    var tagsServiceUrl = '/tags.svc';
    this.tags = {
        addTag: function (type, entityId, parentEntityId, tagValue, callback) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.tag.getAddTagUrl(type, entityId, parentEntityId, tagValue), true, function (data) {
                if (typeof (callback) == "function") {
                    callback(data);
                }
            }, function () {
                if (typeof (callback) == "function") {
                    callback.apply(arguments.callee);
                }
            });
        },

        removeTag: function (type, entityId, parentEntityId, tagValue, callback) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.tag.getRemoveTagUrl(type, entityId, parentEntityId, tagValue), true, function (data) {
                if (typeof (callback) == "function") {
                    callback(data);
                }
            }, function () {
                if (typeof (callback) == "function") {
                    callback.apply(arguments.callee);
                }
            });
        }
    };

    this.articles = {
        exportArticles: function (id, type) {
            var url = Genesis.storage.urlFactory.article.getExportUrl(id, type);
            window.location = url;
        },

        queryGraph: function(deploymentId, query, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.article.getGraphQueryUrl(deploymentId);
            Gossamer.utils.ajax.post(url, query, true, function(data) {
                if (data && data.status && data.status.code && data.status.code == '200') {
                    console.dir(data.projection)
                    onSuccess(data.projection)
                }
                else 
                    (onError || function(){})(data)
            }, function() {
                (onError || function() {})()
            })
        },

        searchAll: function (deploymentId, schemaId, query, pageNumber, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.article.getSearchAllUrl(deploymentId, schemaId, ['orderBy=__UtcLastUpdatedDate', 'pnum=' + pageNumber, 'freetext=' + query]);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.articles) != "undefined" && data.articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.articles, data.paginginfo.totalrecords);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                } 
            });
        },

        searchAllByProperties: function (deploymentId, schemaId, properties, pageNumber, onSuccess, onError, pageSize) {
            var url = Genesis.storage.urlFactory.article.getSearchAllUrl(deploymentId, schemaId, ['orderBy=__UtcLastUpdatedDate', 'pnum=' + pageNumber, properties], pageSize);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.articles) != "undefined" && data.articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.articles, data.paginginfo.totalrecords);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        deleteArticle: function (deploymentId, articleId, schemaName, onSuccess, onError) {
            Gossamer.utils.ajax.del(Genesis.storage.urlFactory.article.getDeleteUrl(deploymentId, articleId, schemaName), true, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null && data.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        create: function (deploymentId, schemaName, article, onSuccess, onError) {
            Gossamer.utils.ajax.put(Genesis.storage.urlFactory.article.getCreateUrl(deploymentId, schemaName), article, true, function (data) {
                if (typeof (data.article) != "undefined" && data.article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        update: function (deploymentId, article, onSuccess, onError) {
            Gossamer.utils.ajax.post(Genesis.storage.urlFactory.article.getUpdateUrl(deploymentId, article.__id), article, true, function (data) {
                if (typeof (data.article) != "undefined" && data.article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        get: function (deploymentId, schemaId, articleId, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.article.getGetUrl(deploymentId, schemaId, articleId), true, function (data) {
                if (typeof (data.article) != "undefined" && data.article != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.article);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        multiGet: function (deploymentId, schemaId, articleIds, onSuccess, onError) {
            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.article.getMultiGetUrl(deploymentId, schemaId, articleIds), true, function (data) {
                if (typeof (data.articles) != "undefined" && data.articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.articles);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },

        getByProperties: function (deploymentId, schemaName, filters, onSuccess, onError, isAsync) {
            var query = '(';
            for (var x = 0; x < filters.length; x = x + 1) {
                query += '*' + filters[x].key + ' == \'' + escape(filters[x].value) + '\'';
                if (x < filters.length - 1) {
                    query += ' AND ';
                }
            }
            query += ')';

            Gossamer.utils.ajax.get(Genesis.storage.urlFactory.article.getPropertiesSearchUrl(deploymentId, schemaName, query), isAsync, function (data) {
                if (typeof (data.articles) != "undefined" && data.articles != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.articles);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments[0].status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };

    this.connections = {
        searchByArticle: function (deploymentId, relationId, articleId, label, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.connection.getSearchByArticleUrl(deploymentId, relationId, articleId, label, ['orderBy=__UtcLastUpdatedDate', 'pnum=1']);
            Gossamer.utils.ajax.get(url, true, function (data) {
                if (typeof (data.Connections) != "undefined" && data.Connections != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Connections, data.PagingInfo.TotalRecords);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError.apply(arguments.callee);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        create: function (deploymentId, relationId, connection, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.connection.getCreateUrl(deploymentId, relationId);
            Gossamer.utils.ajax.put(url, connection, true, function (data) {
                if (typeof (data.Connection) != "undefined" && data.Connection != null) {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data.Connection);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data.status);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        },
        deleteConnection: function (deploymentId, relationId, connectionId, onSuccess, onError) {
            var url = Genesis.storage.urlFactory.connection.getDeleteUrl(deploymentId, relationId, connectionId);
            Gossamer.utils.ajax.del(url, true, function (data) {
                if (typeof (data.code) != "undefined" && data.code != null && data.code == "200") {
                    if (typeof (onSuccess) == "function") {
                        onSuccess(data);
                    }
                } else {
                    if (typeof (onError) == "function") {
                        onError(data);
                    }
                }
            }, function () {
                if (typeof (onError) == "function") {
                    onError.apply(arguments.callee);
                }
            });
        }
    };
}

if (!window.Genesis) window.Genesis = {};
if (!Genesis.storage) Genesis.storage = new GossamerStorage();

// if (Genesis.services) Genesis.services.authenticationService.setEnvironmentData();