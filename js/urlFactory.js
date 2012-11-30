function UrlFactory() {
    var baseUrl = 'http://apis.appacitive.com/v0.9/core';
    this.session = {

        sessionServiceUrl: baseUrl + '/sessionservice.svc',

        getCreateSessionUrl: function (deploymentName) {
            return String.format("{0}/create?deploymentName={1}", this.sessionServiceUrl, deploymentName);
        },
        getPingSessionUrl: function () {
            return String.format("{0}/ping", this.sessionServiceUrl);
        },
        getValidateTokenUrl: function (token) {
            return String.format("{0}/validatetoken?token={1}", this.sessionServiceUrl, token);
        },
        getDeleteSessionUrl: function (deploymentName) {
            return String.format("{0}/delete?deploymentName={1}", this.sessionServiceUrl, deploymentName);
        }
    };
    this.application = {

        applicationServiceUrl: baseUrl + '/application.svc/',

        getSearchAllUrl: function (queryParams) {
            var url = String.format('{0}/find/{1}/all', this.applicationServiceUrl, Genesis.bag.accountName);

            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    if (queryParams[i].trim().length > 0) {
                        url = url + "&" + queryParams[i];
                    }
                }
            }

            return url;
        },

        getCreateUrl: function () {
            return String.format('{0}/create', this.applicationServiceUrl);
        },
        getCreateSessionUrl: function () {
            return String.format('{0}/session', this.applicationServiceUrl);
        },
        getDeleteUrl: function (applicationId) {
            return String.format('{0}/{1}', this.applicationServiceUrl, applicationId);
        },
        getCheckNameUrl: function (name) {
            return String.format('{0}/doesNameExist/{1}/{2}', this.applicationServiceUrl, Genesis.bag.accountName, name);
        },
        getHasAppUrl: function () {
            return String.format('{0}/hasApp', this.applicationServiceUrl);
        },
        getGetPublishStatusUrl: function (refId) {
            return String.format('{0}/status/{1}', this.applicationServiceUrl, refId);
        },
        getGetUrl: function (name) {
            return String.format('{0}/{1}', this.applicationServiceUrl, name);
        }
    };
    this.article = {
        articleServiceUrl: baseUrl + '/article.svc/',

        getExportUrl: function (id, type) {
            return 'Articles.exp?ctype=Article&blueprintid=' + id + '&type=' + type;
        },

        getEntityId: function () {
            return Genesis.bag.selectedCatalog.id;
        },
        getGetUrl: function (deploymentId, schemaId, articleId) {
            return String.format('{0}/{1}/{2}', this.articleServiceUrl, schemaId, articleId);
        },
        getMultiGetUrl: function (deploymentId, schemaId, articleIds) {
            return String.format('{0}/multiGet/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, schemaId, articleIds);
        },
        getBlobUploadUrl: function () {
            return String.format('{0}/blob/upload?deploymentid={1}', this.articleServiceUrl, this.getEntityId());
        },
        getBlobUpdateUrl: function () {
            return String.format('{0}/blob/update?deploymentid={1}', this.articleServiceUrl, this.getEntityId());
        },
        getGraphQueryUrl: function(deploymentId) {
            return String.format('{0}/Search.svc/project', baseUrl, deploymentId);
        },

        getSearchAllUrl: function (deploymentId, schemaId, queryParams) {
            var url = '';

            url = String.format('{0}/{1}/find/all', this.articleServiceUrl, schemaId);

            url = url + '?psize=100';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    if (queryParams[i].trim().length == 0) continue;
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },
        getPropertiesSearchUrl: function (deploymentId, schemaName, query) {
            var url = String.format('{0}/search/{1}/{2}/all', this.articleServiceUrl, deploymentId, schemaName);
            url += '?properties=' + query;

            return url;
        },
        getDeleteUrl: function (deploymentId, articleId, schemaName) {
            return String.format('{0}/delete/{1}/{2}/{3}', this.articleServiceUrl, deploymentId, articleId, schemaName);
        },
        getCreateUrl: function (deploymentId, schemaName) {
            return String.format('{0}{1}', this.articleServiceUrl, schemaName);
        },
        getUpdateUrl: function (deploymentId, articleId) {
            return String.format('{0}/update/{1}/{2}', this.articleServiceUrl, deploymentId, articleId);
        }
    };

    this.connection = {
        connectionServiceUrl: baseUrl + '/connection.svc',

        getEntityId: function () {
            return Genesis.bag.selectedCatalog.id;
        },
        getCreateUrl: function (deploymentId, relationId) {
            return String.format('{0}/{1}', this.connectionServiceUrl, relationId);
        },
        getDeleteUrl: function (deploymentId, relationId, connectionId) {
            return String.format('{0}/{1}/{2}/{3}', this.connectionServiceUrl, deploymentId, relationId, connectionId);
        },
        getSearchByArticleUrl: function (deploymentId, relationId, articleId, label, queryParams) {
            var url = '';

            url = String.format('{0}/search/{1}/{2}/{3}/{4}', this.connectionServiceUrl, deploymentId, relationId, articleId, label);

            url = url + '?psize=1000';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        }
    };

    this.schema = {

        schemaServiceUrl: baseUrl + '/schemaservice.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Genesis.bag.selectedType == 'deployment') {
                return Genesis.bag.selectedCatalog.blueprintid;
            }
            return Genesis.bag.selectedCatalog.id;
        },

        getExportUrl: function (id) {
            return 'Schemas.exp?ctype=Schema&blueprintid=' + id;
        },



        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.schemaServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetPropertiesUrl: function (schemaId) {
            return String.format('{0}/get/{1}/{2}/true', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.schemaServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (schemaId) {
            return String.format('{0}/delete/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getUpdateUrl: function (schemaId) {
            return String.format('{0}/update/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getUpdateAttributesUrl: function (schemaId) {
            return String.format('{0}/updateAttributes/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getAddPropertyUrl: function (schemaId) {
            return String.format('{0}/addProperty/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getDeletePropertyUrl: function (schemaId, propertyId) {
            return String.format('{0}/deleteProperty/{1}/{2}/{3}', this.schemaServiceUrl, this.getEntityId(), schemaId, propertyId);
        },

        getUpdatePropertyUrl: function (schemaId) {
            return String.format('{0}/updateProperty/{1}/{2}', this.schemaServiceUrl, this.getEntityId(), schemaId);
        },

        getGetUrl: function (schemaId) {
            var eId = Genesis.bag.selectedType == 'blueprint' ? Genesis.bag.selectedCatalog.Id : Genesis.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.schemaServiceUrl, eId, schemaId);
        }
    };

    this.relation = {

        relationServiceUrl: baseUrl + '/relationservice.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Genesis.bag.selectedType == 'deployment') {
                return Genesis.bag.selectedCatalog.blueprintid;
            }
            return Genesis.bag.selectedCatalog.id;
        },

        getExportUrl: function (id) {
            return 'Relations.exp?ctype=Relation&blueprintid=' + id;
        },

        getSearchBySchemaUrl: function (blueprintName, schemaName, queryParams) {
            var url = '';
            url = String.format('{0}/{1}/find/{2}', this.relationServiceUrl, blueprintName, schemaName);
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.relationServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetPropertiesUrl: function (relationId) {
            return String.format('{0}/get/{1}/{2}/true', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.relationServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (relationId) {
            return String.format('{0}/delete/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateUrl: function (relationId) {
            return String.format('{0}/update/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateAttributesUrl: function (relationId) {
            return String.format('{0}/updateAttributes/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getAddPropertyUrl: function (relationId) {
            return String.format('{0}/addProperty/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getDeletePropertyUrl: function (relationId, propertyId) {
            return String.format('{0}/deleteProperty/{1}/{2}/{3}', this.relationServiceUrl, this.getEntityId(), relationId, propertyId);
        },

        getUpdatePropertyUrl: function (relationId) {
            return String.format('{0}/updateProperty/{1}/{2}', this.relationServiceUrl, this.getEntityId(), relationId);
        },

        getUpdateEndPointUrl: function (relationId, type) {
            return String.format('{0}/updateEndpoint/{1}/{2}/{3}', this.relationServiceUrl, this.getEntityId(), relationId, type);
        },

        getGetUrl: function (relationId) {
            var eId = Genesis.bag.selectedType == 'blueprint' ? Genesis.bag.selectedCatalog.Id : Genesis.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.relationServiceUrl, eId, relationId);
        }
    };

    this.cannedList = {

        cannedListServiceUrl: baseUrl + '/listservice.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Genesis.bag.selectedType == 'deployment') {
                return Genesis.bag.selectedCatalog.blueprintid;
            }
            return Genesis.bag.selectedCatalog.id;
        },

        getExportUrl: function (id) {
            return 'CannedLists.exp?ctype=List&blueprintid=' + id;
        },

        getListItemExportUrl: function (id, cannedListId) {
            return 'CannedLists.exp?ctype=ListItems&blueprintid=' + id + '&type=' + cannedListId;
        },

        getSearchAllUrl: function (catalogName, queryParams) {
            var url = '';
            if (catalogName) {
                url = String.format('{0}/find/all/{1}', this.cannedListServiceUrl, catalogName);
            }
            url = url + '?psize=200';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        },

        getGetItemsUrl: function (cannedListId) {
            return String.format('{0}/get/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create/{1}', this.cannedListServiceUrl, this.getEntityId());
        },

        getDeleteUrl: function (cannedListId) {
            return String.format('{0}/delete/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getSearchListItemsUrl: function (cannedListId, queryParams) {
            var url = String.format('{0}/searchListItems/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                url = url + '?';
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + queryParams[i] + "&";
                }
                url = url.substring(0, url.length - 1);
            }
            return url;
        },

        getUpdateListItemPositionUrl: function (cannedListId, currentPosition, newPosition) {
            return String.format('{0}/updateListItemPosition/{1}/{2}/{3}/{4}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, currentPosition, newPosition);
        },

        getDeleteListItemUrl: function (cannedListId, listItemName) {
            return String.format('{0}/removeListItem/{1}/{2}/{3}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, listItemName);
        },

        getAddListItemsUrl: function (cannedListId) {
            return String.format('{0}/addListItems/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), cannedListId);
        },

        getUpdateListItemUrl: function (cannedListId, oldName) {
            return String.format('{0}/updateListItem/{1}/{2}/{3}', this.cannedListServiceUrl, this.getEntityId(), cannedListId, oldName);
        },

        getUpdateUrl: function (listId) {
            return String.format('{0}/update/{1}/{2}', this.cannedListServiceUrl, this.getEntityId(), listId);
        },

        getGetUrl: function (relationId) {
            var eId = Genesis.bag.selectedType == 'blueprint' ? Genesis.bag.selectedCatalog.Id : Genesis.bag.selectedCatalog.BlueprintId;
            return String.format('{0}/get/{1}/{2}', this.cannedListServiceUrl, eId, relationId);
        }

    };

    this.catalog = {

        catalogServiceUrl: baseUrl + '/blueprintservice.svc',

        getSearchAllUrl: function (queryParams) {
            var url = String.format('{0}/find/all?', this.catalogServiceUrl);
            url = url + '?psize=1000';
            if (typeof (queryParams) !== 'undefined' && queryParams.length > 0) {
                for (var i = 0; i < queryParams.length; i = i + 1) {
                    url = url + "&" + queryParams[i];
                }
            }
            return url;
        }
    };

    this.blueprint = {

        blueprintServiceUrl: baseUrl + '/blueprintservice.svc',

        getGetUrl: function (id) {
            return String.format('{0}/get/{1}', this.blueprintServiceUrl, id);
        },

        getDeleteUrl: function (id) {
            return String.format('{0}/delete/{1}', this.blueprintServiceUrl, id);
        },

        getCreateUrl: function () {
            return String.format('{0}/create', this.blueprintServiceUrl);
        },

        getSchemasUrl: function (bId) {
            var url = String.format('{0}/getSchemas/{1}?', this.blueprintServiceUrl, bId);
            url = url + '?psize=1000';
            return url
        },

        getRelationsUrl: function (bId) {
            var url = String.format('{0}/{1}/contents/relations?', this.blueprintServiceUrl, bId);
            url = url + '?psize=1000';
            return url;
        },

        getCannedListsUrl: function (bId) {
            var url = String.format('{0}/{1}/contents/lists?', this.blueprintServiceUrl, bId);
            url = url + '?psize=1000';
            return url;
        }
    };

    this.deployment = {

        deploymentServiceUrl: baseUrl + '/deploymentservice.svc',

        getGetUrl: function (id) {
            return String.format('{0}/get/{1}', this.deploymentServiceUrl, id);
        },

        getGetPublishStatusUrl: function (refId, onSuccess, onError) {
            return String.format('{0}/status/{1}', this.deploymentServiceUrl, refId);
        },

        getCreateUrl: function () {
            return String.format('{0}/create', this.deploymentServiceUrl);
        },

        getFetchAllDeploymentsUrl: function () {
            var url = String.format('{0}/fetchAll', this.deploymentServiceUrl);
            return url;
        },

        getSearchAllSchemaUrl: function (dId) {
            var url = String.format('{0}/getSchemas/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        },

        getSearchAllRelationsUrl: function (dId) {
            var url = String.format('{0}/getRelations/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        },

        getSearchAllListsUrl: function (dId) {
            var url = String.format('{0}/getLists/{1}', this.deploymentServiceUrl, dId);
            url = url + '?psize=1000';
            return url;
        },

        getExportUrl: function (dId, bName) {
            var url = String.format('{0}/{1}/{2}', this.deploymentServiceUrl, dId, bName);
            return url;
        },

        getMergeUrl: function (dId, bName) {
            var url = String.format('{0}/{1}/{2}', this.deploymentServiceUrl, dId, bName);
            return url;
        }
    };

    this.tag = {

        tagServiceUrl: baseUrl + '/tagsservice.svc',

        //Return  blueprint Id or deployments blueprint Id
        getEntityId: function () {
            if (Genesis.selectedType == 'deployment') {
                return Genesis.bag.selectedCatalog.blueprintid;
            }
            return Genesis.bag.selectedCatalog.id;
        },

        getAddTagUrl: function (type, entityId, parentEntityId, tagValue) {
            return String.format("{0}/addTag/{1}/{2}/{3}/{4}?tag={5}", this.tagServiceUrl, this.getEntityId(), type, entityId, parentEntityId, tagValue);
        },

        getRemoveTagUrl: function (type, entityId, parentEntityId, tagValue) {
            return String.format("{0}/removeTag/{1}/{2}/{3}/{4}?tag={5}", this.tagServiceUrl, this.getEntityId(), type, entityId, parentEntityId, tagValue);
        }
    };

    this.invoice = {
        invoiceServiceUrl: baseUrl + '/invoiceservice.svc',

        getUsageStatsUrl: function() {
            //
            return this.invoiceServiceUrl + '/usage/' + Genesis.bag.accountName + '/' + Genesis.bag.apps.selected.name
        }
    };

    this.account = {
        accountServiceUrl: baseUrl + '/accountservice.svc',

        getCreateNewAccountUrl: function (queryParam) {
            return String.format("{0}/createaccount?skipValid={1}", this.accountServiceUrl, queryParam);
        },

        getAccountIdUrl: function (accName) {
            return this.accountServiceUrl + '/accountId/' + accName;
        },
        checkAccountNameUrl: function (accName) {
            return this.accountServiceUrl + '/exists/' + accName;
        },
        createInvite: function (token) {
            return String.format("{0}/createInvite?args={1}", this.accountServiceUrl, token);
        },
        checkToken: function (token, queryParam) {
            return String.format("{0}/searchToken/{1}?skipValid={2}", this.accountServiceUrl, token, queryParam);
        },
        isHuman: function (challenge, userResponse) {
            return this.accountServiceUrl + '/captcha/' + challenge + '/' + userResponse;
        }
    };
    this.query = {
        params: function (key) {
            var match = [];
            if (location.search == "" || location.search.indexOf("?") == -1) return match;
            if (!key) return location.search.split("?")[1].split("=");
            else {
                key = key.toLowerCase();
                var splitQuery = location.search.split("?")[1].split("&");
                $.each(splitQuery, function (i, k) {
                    var splitKey = k.split("=");
                    var value = splitKey[1];
                    if (splitKey.length > 2) {
                        $.each(splitKey, function (ii, kk) {
                            if (ii == 0 || ii == 1) return;
                            value = value + "=" + splitKey[ii];
                        });
                    }
                    if (splitKey[0].toLowerCase() == key) match = [splitKey[0], value];
                });
                return match;
            }
        }
    };
    //TODO: Is it required
//    this.userAccount = {
//        accountServiceUrl: baseUrl + '/account.svc',

//        getUpdateUrl: function () {
//            return this.accountServiceUrl + '/update?token=' + Genesis.services.authenticationService.getUserSessionToken();
//        }
//    }

    this.graphite = {
        graphiteBaseUrl: baseUrl + '/sessionservice.svc/getGraph',

        getBaseUrl: function () {
            return this.graphiteBaseUrl;
        }
    };
}