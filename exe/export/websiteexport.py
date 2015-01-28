# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
# Copyright 2004-2008 eXe Project, http://eXeLearning.org/
#
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation; either version 2 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program; if not, write to the Free Software
# Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
# ===========================================================================
from exe.engine.resource import Resource
"""
WebsiteExport will export a package as a website of HTML pages
"""

import logging
import re
import imp
from shutil                   import rmtree
from exe.engine.path          import Path, TempDirPath
from exe.export.pages         import uniquifyNames
from exe.export.websitepage   import WebsitePage
from zipfile                  import ZipFile, ZIP_DEFLATED
from exe.webui                import common
from exe.webui.livepage       import allSessionClients
from exe                      import globals as G
import os
import mimetypes
from tempfile                 import mkdtemp
from exe.engine.persist       import encodeObject
from exe.engine.persistxml    import encodeObjectToXML

from twisted.internet         import threads

import httplib2
from oauth2client.client      import AccessTokenCredentials
from apiclient                import errors
from apiclient.discovery      import build
from apiclient.http           import MediaFileUpload

log = logging.getLogger(__name__)

# ===========================================================================
class WebsiteExport(object):
    """
    WebsiteExport will export a package as a website of HTML pages
    """
    def __init__(self, config, styleDir, filename, prefix="", report=False):
        """
        'stylesDir' is the directory where we can copy the stylesheets from
        'outputDir' is the directory that will be [over]written
        with the website
        """
        self.config          = config
        self.imagesDir       = config.webDir/"images"
        self.scriptsDir      = config.webDir/"scripts"
        self.cssDir          = config.webDir/"css"
        self.templatesDir    = config.webDir/"templates"
        self.stylesDir       = Path(styleDir)
        self.filename        = Path(filename)
        self.pages           = []
        self.prefix          = prefix
        self.report          = report
        self.styleSecureMode = config.styleSecureMode
        
    def gDriveNotificationStatus(self, client, mesg):
        client.sendScript("eXe.controller.eXeViewport.prototype.gDriveNotificationStatus('%s');" % (mesg), filter_func=allSessionClients)
        
    def gDriveNotificationNotice(self, client, mesg, type):
        client.sendScript("eXe.controller.eXeViewport.prototype.gDriveNotificationNotice('%s', '%s');" % (mesg, type), filter_func=allSessionClients)
        
    def exportGoogleDrive(self, package, client, auth_token, user_agent):
        """
        Creates an authorized HTTP conexion, exports the current package as
        'webSite' to a temporary directory and uploads the exported files to
        Google Drive
        """
        num_total = 0;
        file_num = 0;
        
        def finishExport(public_folder, outputDir):
            self.gDriveNotificationStatus(client, _(u'Deleting temporary directory'))
            rmtree(outputDir)
            
            link_url = 'http://googledrive.com/host/%s'%(public_folder['id'])
            link_text = public_folder['title']
            self.gDriveNotificationStatus(client, _(u'Package exported to <a href="%s" target="_blank" title="Click to visit exported site">%s</a>') %(link_url,link_text))
            return public_folder
        
        def insertFile(public_folder, drive, upload_file, file_num):
            """
            Creates the deferred that will upload files to the public folder
            once it is created
            """
            upload_content_d = threads.deferToThread(uploadContent, public_folder, drive, upload_file, file_num)
            upload_content_d.addCallbacks(uploadContent_onSuccess, uploadContent_onFail)
            
            return upload_content_d
        
        def uploadContent(public_folder, drive, upload_file, file_num):
            """
            Uploads one file to the given GDrive folder
            """ 
            try :
                filepath = os.path.join(self.filename, upload_file)
                filetype = mimetypes.guess_type(filepath, False)
                
                if filetype[0] is None :
                    # Hard-coded types for special cases not detected by mimetypes.guess_type() 
                    if upload_file == 'content.data' :
                        filetype = ('application/octet-stream', None)
                    
                    
                if filetype[0] is not None :
                    link_url = 'http://googledrive.com/host/%s'%(public_folder['id'])
                    link_text = public_folder['title']
                    #self.gDriveNotificationStatus(client, _(u'Package exported to <a href="%s" target="_blank" title="Click to visit exported site">%s</<a>') %(link_url,link_text))
                    self.gDriveNotificationStatus(client, _(u'Uploading <em>%s</em> to public folder <a href="%s" target="_blank" title="Click to visit exported site">%s</a> (%d/%d)') 
                                                             %(upload_file, link_url, link_text, file_num, num_total))
                    mimetype = filetype[0]
                    meta = {
                      'title': upload_file,
                      'mimeType': mimetype,
                      'parents' : [{'id' : public_folder['id']}]
                    }
                    media_body = MediaFileUpload(filepath, mimetype, resumable=True)
                    drive.files().insert(body=meta, media_body=media_body).execute()
                else :
                    self.gDriveNotificationNotice(client, _(u'File <em>%s</em> skipped, unknown filetype (%d/%d)') %(upload_file, file_num, num_total), 'warning')
            except Exception, e :
                log.error(str(e))
                self.gDriveNotificationNotice(client, _(u'Failed upload of file %s (%d/%d)') % (upload_file, file_num, num_total), 'error')
            
            return public_folder
            
        def uploadContent_onFail(err):
            log.error(str(err))
            self.gDriveNotificationNotice(client, _(u'Failed exporting to GoogleDrive'), 'error')
            return err
            
        def uploadContent_onSuccess(public_folder):
#            self.gDriveNotificationStatus(client, _(u'Exported to GoogleDrive: %s') % public_folder['title'])
            return public_folder
                
        def publicFolder(drive, folder_name):
            """
            Creates a Public Web folder, that can be read as a web site with any
            web browser, and populates it with the content of the given directory
            """
            
            # Create public folder
            self.gDriveNotificationStatus(client, _(u'Creating public folder to host published web site'))
            body = {
                'title': folder_name,
                'mimeType': 'application/vnd.google-apps.folder'
            }
            public_folder = drive.files().insert(body=body).execute()
            
            permission = {
                'value': '',
                'type': 'anyone',
                'role': 'reader'
            }
            drive.permissions().insert(fileId=public_folder['id'], body=permission).execute()
            
            return public_folder
            
        def publicFolder_onFail(err):
            log.error(str(err))
            self.gDriveNotificationNotice(client, _(u'Failed exporting to GoogleDrive'), 'error')
            return err
            
        def publicFolder_onSuccess(public_folder):
            self.gDriveNotificationStatus(client, _(u'Created public folder to host published web site: %s') % (public_folder['title']))
            return public_folder
            
        try:
            # Creates a new temporary dir to export the package to, it will be deleted
            # once the export process is finished
            self.filename = Path(mkdtemp())
            self.gDriveNotificationStatus(client, _(u'Exporting package as web site in: %s') % (self.filename))
            outputDir = self.export(package)
            
            self.gDriveNotificationStatus(client, _(u'Starting authorized connection to Google Drive API'))
            credentials = AccessTokenCredentials(auth_token, user_agent)
            http = httplib2.Http()
            http = credentials.authorize(http)
            drive_service = build('drive', 'v2', http=http)
            
            publicFolder_d = threads.deferToThread(publicFolder, drive_service, package.name)
            publicFolder_d.addCallbacks(publicFolder_onSuccess, publicFolder_onFail)
            
            # Loop through files in exportDir, each upload will be called from
            # a chained callback function. These callbacks will return a 
            # deferred so the file N upload will start when file N-1 has 
            # successfully called its own callback 
            # (Deferred chain, see: http://krondo.com/?p=2159#attachment_2196)
            for upload_file in os.listdir(outputDir):
                file_num = file_num + 1
                publicFolder_d.addCallback(insertFile, drive_service, upload_file, file_num)
                
            num_total = file_num
            publicFolder_d.addCallback(finishExport, outputDir)
            
            # TODO clean exportDir after uploading has finished
            
        except Exception, e:
            log.error(str(e))
            self.gDriveNotificationNotice(client, _('EXPORT FAILED!'), 'error')
            raise
        #client.alert(_(u'Exported to %s') % filename)

    def exportZip(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        
        outputDir = TempDirPath()

        # Import the Website Page class , if the secure mode is off.  If the style has it's own page class
        # use that, else use the default one.
        if self.styleSecureMode=="0":
            if (self.stylesDir/"websitepage.py").exists():
                global WebsitePage
                module = imp.load_source("websitepage", 
                                         self.stylesDir/"websitepage.py")
                WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage("index", 0, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]

        for nextPage in self.pages[1:]:
            thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage
            

        thisPage.save(outputDir, prevPage, None, self.pages)
        self.copyFiles(package, outputDir)
        # Zip up the website package
        self.filename.safeSave(self.doZip, _('EXPORT FAILED!\nLast succesful export is %s.'), outputDir)
        # Clean up the temporary dir
        outputDir.rmtree()

    def doZip(self, fileObj, outputDir):
        """
        Actually saves the zip data. Called by 'Path.safeSave'
        """
        zipped = ZipFile(fileObj, "w")
        for scormFile in outputDir.files():
            zipped.write(scormFile, scormFile.basename().encode('utf8'), ZIP_DEFLATED)
        zipped.close()

    def appendPageReport(self, page, package):
        if not page.node.idevices:self.report += u'"%s","%s",%d,"%s",,,,,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html')
        for idevice in page.node.idevices:
            if not idevice.userResources:self.report += u'"%s","%s",%d,"%s","%s","%s",,,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title)
            for resource in idevice.userResources:
                if type(resource) == Resource:
                    self.report += u'"%s","%s",%d,"%s","%s","%s","%s","%s","%s","%s"\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title, resource.storageName, resource.userName, resource.path, resource.checksum)
                else:
                    self.report += u'"%s",%d,"%s","%s","%s","%s",,,\n' % (package.filename,page.node.title, page.depth, page.name + '.html', idevice.klass, idevice.title, resource)

    def export(self, package):
        """ 
        Export web site
        Cleans up the previous packages pages and performs the export
        """
        if not self.report:
            outputDir = self.filename
            if not outputDir.exists():
                outputDir.mkdir()

        # Import the Website Page class.  If the style has it's own page class
        # use that, else use the default one.
        if (self.stylesDir/"websitepage.py").exists():
            global WebsitePage
            module = imp.load_source("websitepage", 
                                     self.stylesDir/"websitepage.py")
            WebsitePage = module.WebsitePage

        self.pages = [ WebsitePage(self.prefix + "index", 0, package.root) ]
        self.generatePages(package.root, 1)
        uniquifyNames(self.pages)

        prevPage = None
        thisPage = self.pages[0]
        if self.report:
            self.report = u'"%s","%s","%s","%s","%s","%s","%s","%s","%s","%s"\n' % ('File','Page Name', 'Level', 'Page File Name', 'Idevice Type', 'Idevice Title', 'Resource File Name', 'Resource User Name', 'Resource Path', 'Resource Checksum')
            self.appendPageReport(thisPage,package)

        for nextPage in self.pages[1:]:
            if self.report:
                self.appendPageReport(nextPage,package)
            else:
                thisPage.save(outputDir, prevPage, nextPage, self.pages)
            prevPage = thisPage
            thisPage = nextPage

        if not self.report:
            thisPage.save(outputDir, prevPage, None, self.pages)

            if self.prefix == "":
                self.copyFiles(package, outputDir)
        else:
            self.filename.write_text(self.report, 'utf-8')
            
        return outputDir


    def copyFiles(self, package, outputDir):
        """
        Copy all the files used by the website.
        """
       
        if os.path.isdir(self.stylesDir):
            # Copy the style sheet files to the output dir
            styleFiles  = [self.stylesDir/'..'/'base.css']
            styleFiles += [self.stylesDir/'..'/'popup_bg.gif']
            styleFiles += self.stylesDir.files("*.css")
            styleFiles += self.stylesDir.files("*.jpg")
            styleFiles += self.stylesDir.files("*.gif")
            styleFiles += self.stylesDir.files("*.png")
            styleFiles += self.stylesDir.files("*.js")
            styleFiles += self.stylesDir.files("*.html")
            styleFiles += self.stylesDir.files("*.ico")
            styleFiles += self.stylesDir.files("*.ttf")
            styleFiles += self.stylesDir.files("*.eot")
            styleFiles += self.stylesDir.files("*.otf")
            styleFiles += self.stylesDir.files("*.woff")
            self.stylesDir.copylist(styleFiles, outputDir)

        # copy the package's resource files
        package.resourceDir.copyfiles(outputDir)
            
        # copy script files.
        my_style = G.application.config.styleStore.getStyle(package.style)
        # jQuery
        if my_style.hasValidConfig:
            if my_style.get_jquery() == True:
                jsFile = (self.scriptsDir/'exe_jquery.js')
                jsFile.copyfile(outputDir/'exe_jquery.js')
        else:
            jsFile = (self.scriptsDir/'exe_jquery.js')
            jsFile.copyfile(outputDir/'exe_jquery.js')
            
        jsFile = (self.scriptsDir/'common.js')
        jsFile.copyfile(outputDir/'common.js')
        #dT = common.getExportDocType()
        dT=common.getExportDocType();
        if dT == "HTML5":
            jsFile = (self.scriptsDir/'exe_html5.js')
            jsFile.copyfile(outputDir/'exe_html5.js')

        # Incluide eXe's icon if the Style doesn't have one
        themePath = Path(G.application.config.stylesDir/package.style)
        themeFavicon = themePath.joinpath("favicon.ico")
        if not themeFavicon.exists():
            faviconFile = (self.imagesDir/'favicon.ico')
            faviconFile.copyfile(outputDir/'favicon.ico')
        
        # copy players for media idevices.                
        hasFlowplayer     = False
        hasMagnifier      = False
        hasXspfplayer     = False
        hasGallery        = False
        hasWikipedia      = False
        isBreak           = False
        hasInstructions   = False
        hasMediaelement   = False
        
        for page in self.pages:
            if isBreak:
                break
            for idevice in page.node.idevices:
                if (hasFlowplayer and hasMagnifier and hasXspfplayer and hasGallery and hasWikipedia and hasInstructions and hasMediaelement):
                    isBreak = True
                    break
                if not hasFlowplayer:
                    if 'flowPlayer.swf' in idevice.systemResources:
                        hasFlowplayer = True
                if not hasMagnifier:
                    if 'mojomagnify.js' in idevice.systemResources:
                        hasMagnifier = True
                if not hasXspfplayer:
                    if 'xspf_player.swf' in idevice.systemResources:
                        hasXspfplayer = True
                if not hasGallery:
                    hasGallery = common.ideviceHasGallery(idevice)
                if not hasWikipedia:
                    if 'WikipediaIdevice' == idevice.klass:
                        hasWikipedia = True
                if not hasInstructions:
                    if 'TrueFalseIdevice' == idevice.klass or 'MultichoiceIdevice' == idevice.klass or 'VerdaderofalsofpdIdevice' == idevice.klass or 'EleccionmultiplefpdIdevice' == idevice.klass:
                        hasInstructions = True
                if not hasMediaelement:
                    hasMediaelement = common.ideviceHasMediaelement(idevice)

        if hasFlowplayer:
            videofile = (self.templatesDir/'flowPlayer.swf')
            videofile.copyfile(outputDir/'flowPlayer.swf')
            controlsfile = (self.templatesDir/'flowplayer.controls.swf')
            controlsfile.copyfile(outputDir/'flowplayer.controls.swf')
        if hasMagnifier:
            videofile = (self.templatesDir/'mojomagnify.js')
            videofile.copyfile(outputDir/'mojomagnify.js')
        if hasXspfplayer:
            videofile = (self.templatesDir/'xspf_player.swf')
            videofile.copyfile(outputDir/'xspf_player.swf')
        if hasGallery:
            imageGalleryCSS = (self.cssDir/'exe_lightbox.css')
            imageGalleryCSS.copyfile(outputDir/'exe_lightbox.css') 
            imageGalleryJS = (self.scriptsDir/'exe_lightbox.js')
            imageGalleryJS.copyfile(outputDir/'exe_lightbox.js') 
            self.imagesDir.copylist(('exe_lightbox_close.png', 'exe_lightbox_loading.gif', 'exe_lightbox_next.png', 'exe_lightbox_prev.png'), outputDir)
        if hasWikipedia:
            wikipediaCSS = (self.cssDir/'exe_wikipedia.css')
            wikipediaCSS.copyfile(outputDir/'exe_wikipedia.css')
        if hasInstructions:
            common.copyFileIfNotInStyle('panel-amusements.png', self, outputDir)
            common.copyFileIfNotInStyle('stock-stop.png', self, outputDir)
        if hasMediaelement:
            mediaelement = (self.scriptsDir/'mediaelement')
            mediaelement.copyfiles(outputDir)
            dT = common.getExportDocType()
            if dT != "HTML5":
                jsFile = (self.scriptsDir/'exe_html5.js')
                jsFile.copyfile(outputDir/'exe_html5.js')

        if hasattr(package, 'exportSource') and package.exportSource:
            (G.application.config.webDir/'templates'/'content.xsd').copyfile(outputDir/'content.xsd')
            (outputDir/'content.data').write_bytes(encodeObject(package))
            (outputDir/'contentv3.xml').write_bytes(encodeObjectToXML(package))

        if package.license == "license GFDL":
            # include a copy of the GNU Free Documentation Licence
            (self.templatesDir/'fdl.html').copyfile(outputDir/'fdl.html')


    def generatePages(self, node, depth):
        """
        Recursively generate pages and store in pages member variable
        for retrieving later
        """           
        for child in node.children:
            # assure lower pagename, without whitespaces or alphanumeric characters:
            pageName = child.titleShort.lower().replace(" ", "_")
            pageName = re.sub(r"\W", "", pageName)
            if not pageName:
                pageName = "__"

            self.pages.append(WebsitePage(self.prefix + pageName, depth, child))
            self.generatePages(child, depth + 1)

