// ===========================================================================
// eXe
// Copyright 2012, Pedro Peña Pérez, Open Phoenix IT
//
// This program is free software; you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation; either version 2 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program; if not, write to the Free Software
// Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
//===========================================================================

if (!window.translations)
    translations = {};

function _(msg) {
    return translations[msg] || msg;
}

Ext.Loader.setConfig({
    enabled: true,
    paths: { 'Ext.ux': 'jsui/extjs/examples/ux' }
});

var conf = {
    onRender: function() {
        var me = this;
        
        me.callParent(arguments);
        if (me.tooltip) {
            Ext.tip.QuickTipManager.register(Ext.apply({
                target: me.el,
                text: me.tooltip
            }));
        }
    }
};

//Call authoring page when zindex is modified and consider problematic plugins with no zindex support
Ext.override(Ext.WindowManager, {
    bringToFront: function(comp) {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
        if (authoringPanel.isVisible()) {
            var authoring = authoringPanel.getWin();
	        if (authoring && authoring.hideObjectTags)
	            authoring.hideObjectTags();
        }
    },
    onComponentHide: function(comp) {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
        if (authoringPanel.isVisible()) {
            if (!this.getActive()) {
		        var authoring = authoringPanel.getWin();
		        if (authoring && authoring.showObjectTags)
		            authoring.showObjectTags();
            }
        }
    },
    _hideModalMask: function() {
        var me = this, authoringPanel = Ext.ComponentQuery.query('#authoring')[0];

        me.callParent(arguments);
		if (authoringPanel.isVisible()) {
            if (!this.getActive()) {
		        var authoring = authoringPanel.getWin();
		        if (authoring && authoring.showObjectTags)
		            authoring.showObjectTags();
            }
        }
    }
});
Ext.override(Ext.form.field.Text, conf);
Ext.override(Ext.form.field.TextArea, conf);
Ext.override(Ext.form.field.Checkbox, conf);
Ext.override(Ext.form.field.Hidden, conf);

Ext.override(Ext.menu.Menu,{
      onMouseOver: function(e) {
            var me = this,
                  fromEl = e.getRelatedTarget(),
                  mouseEnter = !me.el.contains(fromEl),
                  item = me.getItemFromEvent(e),
                  parentMenu = me.parentMenu,
                  ownerCmp = me.ownerCmp;

            if (mouseEnter && parentMenu) {
                  //original
                  //parentMenu.setActiveItem(ownerCmp);
                  //ownerCmp.cancelDeferHide();
                  //parentMenu.mouseMonitor.mouseenter();
                  //end original

                  //fix
                  if(ownerCmp){
                        parentMenu.setActiveItem(ownerCmp);
                        ownerCmp.cancelDeferHide();
                  }
                  setTimeout(parentMenu.mouseMonitor.mouseenter,5);
                  //end fix
            }

            if (me.disabled) {
                  return;
            }

            if (item && !item.activated) {
                  me.setActiveItem(item);
                  if (item.activated && item.expandMenu) {
                        item.expandMenu();
                  }
            }
            if (mouseEnter) {
                  me.fireEvent('mouseenter', me, e);
            }
            me.fireEvent('mouseover', me, item, e);
      }
});

Ext.application({
    name: 'eXe',

    stores: [
        'OutlineXmlTreeStore',
        'IdeviceXmlStore',
        'filepicker.DirectoryTree',
        'filepicker.File'
    ],

    models: [
    	'filepicker.File'
    ],
    
    controllers: [
        'eXeViewport',
    	'Idevice',
        'MainTab',
    	'Outline',
        'Toolbar',
        'StyleManager',
        'TemplateManager',
    	'filepicker.Directory',
    	'filepicker.File'
    ],
    
    getMaxHeight: function(height) {
        var vheight = Ext.ComponentQuery.query('#eXeViewport')[0].getHeight();

        return height >= vheight? vheight : height;
    },

    quitWarningEnabled: true,

    reload: function() {
        var authoring = Ext.ComponentQuery.query('#authoring')[0].getWin();
        if (authoring && authoring.submitLink) {
        	var outlineTreePanel = eXe.app.getController("Outline").getOutlineTreePanel(),
            	selected = outlineTreePanel.getSelectionModel().getSelection();
        	eXe.app.quitWarningEnabled = false;
        	eXe.app.on({
        		'authoringLoaded': function() {
        			nevow_clientToServerEvent('reload');
        		}
        	});
	        authoring.submitLink("changeNode", selected !== 0? selected[0].data.id : '0');
        }
    },

    gotoUrl: function(location) {
        eXe.app.quitWarningEnabled = false;
        if (location == undefined)
            location = window.top.location.pathname;
        nevow_closeLive('window.top.location = "' + location + '";');
    },
    
    alert: function(msg){
        Ext.Msg.alert(_("Warning"), msg);
    },
    
    showLoadError: function() {
    	if (eXe.app.config.loadErrors.length > 0) {
    		Ext.Msg.alert(_('Load Error'), eXe.app.config.loadErrors.pop(), eXe.app.showLoadError);
    	}
    	else
    		eXe.app.afterShowLoadErrors();
    },
    
    showNewVersionWarning: function(){
        // Show a warning message if a new version is available
        if (navigator.onLine && eXe.app.config.showNewVersionWarning && typeof(eXe.app.config.release)=='string') {
            function openNewVersionWarning(){
                if (typeof(eXeInfo)=='undefined' || typeof(eXeInfo.version)!='string') return;
                
                var latest = eXeInfo.version;
                var current = eXe.app.config.release;
                
                if (latest==current) return;
                
                latest = latest.replace(/\./g,"");
                current = current.replace(/\./g,"");

                while (latest.length>current.length) current += '0';
                while (current.length>latest.length) latest += '0';                
                
                current = parseFloat(current);
                latest = parseFloat(latest);
                
                if (latest>current) {
                    var msg = _('A new version of eXeLearning (%) is available. Would you like to download it now?');
                    msg = msg.replace("%",eXeInfo.version);
                    Ext.Msg.show({
                        title: _('Warning!'),
                        msg: msg,
                        scope: this,
                        modal: true,
                        buttons: Ext.Msg.YESNO,
                        fn: function(button) {
                            if (button == "yes") {
                                window.open("http://exelearning.net/");
                            }
                        }
                    });
                }                
            }
            if (typeof(eXeInfo)=='undefined') {
                var script = document.createElement("script")
                script.type = "text/javascript";
                script.src = "http://exelearning.net/exelearning-info.js";
                if (script.readyState){  // IE
                    script.onreadystatechange = function(){
                        if (script.readyState == "loaded" || script.readyState == "complete"){
                            script.onreadystatechange = null;
                            openNewVersionWarning();
                        }
                    };
                } else {
                    script.onload = function(){
                        openNewVersionWarning();
                    };
                }
                document.getElementsByTagName("head")[0].appendChild(script);            
            }
        }
    },
    
    launch: function() {
        Ext.QuickTips.init();

        try {
            Ext.state.Manager.setProvider(new Ext.state.LocalStorageProvider());
        }
        catch (err) {
            console.log('Local Storage not supported');
            Ext.state.Manager.setProvider(new Ext.state.CookieProvider({expires: null}));
        }
        
        eXe.app = this;
        
        eXe.app.config = config;
        
        Ext.state.Manager.set('filepicker-currentDir', eXe.app.config.lastDir);

        window.onbeforeunload = function() {
            if (eXe.app.quitWarningEnabled)
                return _("If you leave this page eXe application continues to run." +
                        " Please use the menu File->Quit if you really want to exit the application.");
        };
		/*
		window.onunload = function() {
            nevow_clientToServerEvent('quit', '', '');
        };
		*/

        langsStore.sort(function(a, b) {
            return a[1].localeCompare(b[1]);
        });

        if (Ext.isGecko || Ext.isSafari)
        	window.addEventListener('keydown', function(e) {(e.keyCode == 27 && e.preventDefault())});

        var cmp1 = Ext.create('eXe.view.ui.eXeViewport', {
            renderTo: Ext.getBody()
        });
        cmp1.show();

        setTimeout(function(){
		    Ext.get('loading').hide();
		    Ext.get('loading-mask').fadeOut();
		  }, 250);
        
        if (!eXe.app.config.showIdevicesGrouped) {
        	var panel = Ext.ComponentQuery.query('#idevice_panel')[0],
        		button = panel.down('button');
        	
        	panel.view.features[0].disable();
        	button.setText(_('Group iDevices'));
        }

        eXe.app.afterShowLoadErrors = function() {
        	if (eXe.app.config.showPreferences) eXe.app.getController('Toolbar').toolsPreferences(true); // true to open the new version warning
            else eXe.app.showNewVersionWarning();
        };

        eXe.app.showLoadError();
    },

    appFolder: "jsui/app"

});

