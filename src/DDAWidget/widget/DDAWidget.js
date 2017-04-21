/*global logger*/
/*
    Visibility Microflow
    ========================

    @file      : DDAWidget.js
    @version   : 1.0.0
    @author    : Dragos Vrabie
    @date      : Mon, 06 Jun 2016 11:53:29 GMT
    @copyright : AuraQ Ltd
    @license   : Apache 2/MIT

    Documentation
    ========================
    Use to make DOM elements DDA compliant.
*/

require([
    "dojo/_base/declare",
    "mxui/widget/_WidgetBase",
    "DDAWidget/lib/jquery-1.11.2",
    "dojo/_base/lang"
], function (declare, _WidgetBase,_jQuery,lang) {
    "use strict";

    return declare("DDAWidget.widget.DDAWidget", [_WidgetBase], {

        _handle: null,
        _params: null,
        _validationHandle:null,
        _updateFunctions:null,
        _validationFunctions:null,

        postCreate: function () {

            //logger.level(logger.DEBUG);
            logger.debug(this.id + ".postCreate");            

        },

        update: function (obj, callback) {
            logger.debug(this.id + ".update");

            this._updateFunctions=[];
            this._validationFunctions=[];

            if(this.customLabelsEnabled)
            {
                this._replaceCustomLabels();
                this._updateFunctions.push(this._replaceCustomLabels);
            }
            if(this.roleEnabled)
            {
                this._roleAssignment();
                this._updateFunctions.push(this._roleAssignment);
            }
            if(this.fieldsetEnabled)
            {
                this._fieldsetSetup();
                this._updateFunctions.push(this._fieldsetSetup);
            }            
            if(this.errorEnabled)
            {
                this._validationDescription();
                this._validationFunctions.push(this._validationDescription);
            }
            if(this.altTextEnabled)
            {
                this._altTextInit();
                this._updateFunctions.push(this._altTextInit);
            }
            if(this.radioEnabled)
            {
                this._assignRadioLabels();
                this._updateFunctions.push(this._assignRadioLabels);
            }

            if(obj)
            {
                var localguid= obj.getGuid(); 
                if(this._validationHandle == null)
                {
                    logger.debug("Subscribing to obj validation with guid: " + localguid);

                    this._validationHandle= this.subscribe({
                        guid:localguid,
                        val:true,
                        callback:lang.hitch(this,function(validations){
                            for(var i=0;i<this._validationFunctions.length;i++)
                            {this._validationFunctions[i].call(this);}
                        })
                    });
                }
                if(this._handle == null)
                {
                    logger.debug("Subscribing to obj with guid: " + localguid);

                    this._handle= this.subscribe({
                        guid:localguid,
                        callback:lang.hitch(this,function(guid){
                            for(var i=0;i<this._updateFunctions.length;i++)
                            {
                                this._updateFunctions[i].call(this);
                            }
                        })
                    });
                }
            }
            callback();
        },

        _replaceCustomLabels: function(){
            logger.debug(this.id + "._replaceCustomLabels"); 
            this._replaceType(_jQuery(".custom-label").not("label"),"<label />",this._labelAssignment);
        },

        _fieldsetSetup: function(){
            logger.debug(this.id + "._fieldsetSetup");

            _jQuery.each(_jQuery(".form-legend"),function(idx,obj){
                if(!_jQuery(obj).parent().is("legend"))
                {
                    _jQuery(obj).wrap("<legend></legend>");
                }
            });            

            this._replaceType(_jQuery(".form-fieldset").not("fieldset"),"<fieldset/>");
        },

        _validationDescription: function(){
            logger.debug(this.id + "._validationDescription");

            var errorId ="";

            _jQuery.each(_jQuery(".mx-validation-message"),function(idx,obj){
                var jqueryObj = _jQuery(this);
                errorId=jqueryObj.parent().attr("id")+"_error";
                jqueryObj.attr("id",errorId);
                if(this.errorDescribedBy)
                {
                    jqueryObj.prev().attr("aria-describedby",errorId);
                }
                if(this.errorLabelledBy)
                {
                    jqueryObj.prev().attr("aria-labelledby",errorId);
                }

            });
        },

        _roleAssignment:function(){
            logger.debug(this.id + "._roleAssignment");

            _jQuery.each(_jQuery("[class*='elementrole-']"),function(idx,obj){
                if(this.roleOverwrite || typeof(_jQuery(this).attr("role"))=="undefined")
                {
                    var classes=_jQuery(this).attr("class");
                    var startIndex=classes.indexOf("elementrole-");
                    var endIndex= classes.length;
                    for(var i=startIndex;i<endIndex;i++)
                    {
                        if(classes[i]===' ')
                        {
                            endIndex=i;
                        }
                    }
                    var ddaRole=classes.substring(startIndex+12,endIndex);
                    _jQuery(this).attr("role",ddaRole);
                    logger.debug("Role "+ddaRole+" assigned to "+this);
                }
            });
        },

        _labelAssignment:function(){
            var jqueryObj = _jQuery(".custom-label");

            if(typeof jqueryObj != "undefined")
            {
                logger.debug("._labelAssignment");

                _jQuery.each(jqueryObj,function(idx,obj){                    
                    if(typeof(_jQuery(obj).attr("for"))=="undefined")
                    {
                        var inputSiblings = _jQuery(obj).siblings(".input-container");
                        if(typeof inputSiblings != "undefined")
                        {
                            inputSiblings = inputSiblings.length>1 ? inputSiblings[0] :inputSiblings;
                            jqueryObj.attr("for",inputSiblings.attr("id"));
                        } 
                    }

                });

                logger.debug("._labelAssignment completed");
            }            
        },

        _assignRadioLabels:function(){
            logger.debug(this.id + "._assignRadioLabels");

            _jQuery.each(_jQuery('input[type="radio"]'),function(idx,obj){
                var jqueryObj = _jQuery(obj);
                logger.debug("_assignRadioLabels run number "+idx);
                jqueryObj.parent().attr("for",jqueryObj.attr("id"));
            });
        },

        _replaceType: function(jqueryObjArray, newType,callback){
            if(jqueryObjArray.length>0)
            {
                logger.debug("Batch type replacement");

                _jQuery.each(jqueryObjArray,function(id,obj){
                    var attrs = { };
                    _jQuery.each(obj.attributes, function(idx, attr) {
                        attrs[attr.nodeName] = attr.nodeValue;
                    });
                    _jQuery(obj).replaceWith(function () {
                        return _jQuery(newType, attrs).append($(this).contents()).attr("focusindex","0");
                    });
                });

                logger.debug("Batch type replacement completed");
            }
            if(callback)
            {
                callback();
            }
        },

        _altTextInit: function(){
            logger.debug(this.id + "._altTextInit");

            var widget = this;

            _jQuery.each(this.altEntities,function(idx,mxObj){

                var objClass = mxObj.altClass;
                var objText = mxObj.altText;

                _jQuery.each(_jQuery('.'+objClass),function(idy,jqueryObj){

                    jqueryObj=_jQuery(jqueryObj);
                    if(widget.altEnabled)
                    {
                        if(widget.altOverwrite || typeof(jqueryObj.attr("alt"))=="undefined")
                        {
                            jqueryObj.attr("alt",objText);
                        }
                    }
                    if(widget.ariaLabelEnabled)
                    {
                        if(widget.altOverwrite || typeof(jqueryObj.attr("aria-label"))=="undefined")
                        {
                            jqueryObj.attr("aria-label",objText);
                        }
                    }
                    if(widget.titleEnabled)
                    {
                        if(widget.altOverwrite || typeof(jqueryObj.attr("title"))=="undefined")
                        {
                            jqueryObj.attr("title",objText);
                        }
                    }

                });
            });
        },


    });
});