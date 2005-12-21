# ===========================================================================
# eXe 
# Copyright 2004-2005, University of Auckland
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
"""
TestOptionElement is responsible for a block of option.  Used by 
TestquestionElement.
"""

import logging
from exe.webui import common
from exe.engine.forumidevice import Forum, Lms, Discussion

log = logging.getLogger(__name__)
# ===========================================================================
class LmsElement(object):
    """
    LmsElement is responsible for a block of lms.  Used by
    ForumElement.
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id      = idevice.id       
        self.idevice = idevice
        self.lms     = idevice.forum.lms 
        
    def process(self, request):
        """
        Process arguments from the web server. 
        """
        if "type"+self.id in request.args:
            self.lms.type = request.args["type"+self.id][0]

            
        if "studentpost"+self.id in request.args:
            self.lms.studentpost = request.args["studentpost"+self.id][0]
            
        if "groupmode"+self.id in request.args:
            self.lms.groupmode = request.args["groupmode"+self.id][0]
       
        if "visible"+self.id in request.args:
            self.lms.visible = request.args["visible"+self.id][0]
        
        if "subscription"+self.id in request.args:
            self.lms.subscription = request.args["subscription"+self.id][0]
            
        if "other"+self.id in request.args:
            self.lms.otherLabel = request.args["other"+self.id][0]
            
        if "url"+self.id in request.args:
            self.lms.otherUrl = request.args["url"+self.id][0]
            
    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """

        if self.lms.lms == "":
            return ""
        
        if self.lms.lms == "moodle":
            typeArr    = [[_(u'A single simple discussion'),       'single'],
                          [_(u'Each person posts one discussion'), 'eachuser'],
                          [_(u'Standard forum for general use'),   'general']]
          
            postArr    = [[_(u'Discussions and replies are allowed'),     '2'],
                          [_(u'No discussions, but replies are allowed'), '1'],
                          [_(u'No discussions, no replies'),              '0']]
              
            subscArr   = [[_(u'No'),             '0'], 
                          [_(u'Yes, forever'),   '1'], 
                          [_(u'Yes, initially'), '2']]
            
            groupArr   = [[_(u'No groups'),       '0'], 
                          [_(u'Separate groups'), '1'], 
                          [_(u'Visible groups'),  '2']]
            
            visibleArr = [[_(u'Show'), '1'], 
                          [_(u'Hide'), '0']]
    
            

            html  = u"<br/><b>%s</b>" % _(u"Forum type:") 
            html += common.elementInstruc("type"+self.id, 
                                          self.lms.typeInstruc)+ u"<br/>"
            html += common.select("type"+self.id, 
                                  typeArr, selection=self.lms.type) 
            
            html += u"<br/><b>%s</b>" % _(u"Can a student post to this forum?:")
            html += common.elementInstruc("studentpost"+self.id, 
                                          self.lms.postInstruc)+ "<br/>"
            html += common.select("studentpost"+self.id, postArr, 
                                  selection=self.lms.studentpost) + "\n"
            html += u"<br/><b>%s</b>" % _(u"Force everyone to be subscribed?:")
            
            html += common.elementInstruc("subscription"+self.id, 
                                          self.lms.subscInstruc)+ "<br/>"
            html += common.select("subscription"+self.id, subscArr, 
                                  selection=self.lms.subscription) + "\n"
            html += u"<br/><b>%s</b>" % _(u"Group mode:")
            html += common.elementInstruc("groupmode"+self.id, 
                                          self.lms.groupInstruc)+ u"<br/>"
            html += common.select("groupmode"+self.id, groupArr, 
                                  selection=self.lms.groupmode) + "\n"
            html += "<br/><b>%s</b>" % _(u"Visible to students:")
            html += common.elementInstruc("visible"+self.id, 
                                          self.lms.visibleInstruc)+ u"<br/>"
            html += common.select("visible"+self.id, visibleArr, 
                                  selection=self.lms.visible) + u"<br/>\n"
            
        else:
            html  = common.textInput("other"+self.id, 
                                     self.lms.otherLabel)
            html += u"http://" + common.textInput("url"+self.id, 
                                        self.lms.otherUrl) + u"<br/>"
        
        return html
    

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """

        html = ""
    
        if self.lms.lms == "other":
            html += "_______________________________<br/>"
            url = "http://%s" % self.lms.otherUrl
            html += "<br/><b>%s </b>" % self.lms.otherLabel
            html += '<a href="%s">%s</a>' % (url, url)  
        return html

# ===========================================================================
class ForumElement(object):
    """
    ForumElement is responsible for a block of forum.  Used by
    Forumblock.
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id                = idevice.id      
        self.forum             = idevice.forum
        self.lmsElement        = LmsElement(idevice) 
        self.discussionElement = DiscussionElement(idevice)
        self.idevice           = idevice
  
        

    def process(self, request):
        """
        Process arguments from the web server.  Return any which apply to this 
        element.
        """
        log.debug("process " + repr(request.args))
        self.idevice.message = ""
        if "fName"+self.id in request.args:
            self.forum.forumName = request.args["fName"+self.id][0]
            
        if "fIntro"+self.id in request.args:
            self.forum.introduction = request.args["fIntro"+self.id][0]
            
        self.discussionElement.process(request)
        self.lmsElement.process(request)
        
                    
    def renderEdit(self):                
        html  = ""
        if self.idevice.message <> "":
            html += '<br/><font color="red">'
            html += '<b>%s</font></b><br/>' % self.idevice.message

        html += '<br/>' + common.textInput("name"+ self.id, self.idevice.title)
        html += '<br/><br/><b>%s</b><br/>' % _(u"Forum Name:")
        html += '<select onchange='
        html += '"submitChange(\'%s\',\'forumSelect%s\');"' % ("changeForum",
                                                               self.id)
                                                       
        html += '"forumSelect%s");"' % self.id
        html += 'name="forumSelect%s" id="forumSelect%s">\n' % (self.id, self.id)
        html += '<option value = "">%s </option>' % _("Select a Forum")
        html += '<option value = "newForum" '
        if self.idevice.isNewForum:
            html += 'selected '
        html += '>'+ _(u"New Forum") + '</option>'
        for prototype in self.idevice.forumsCache.getForums():
            html += '<option value="'+u'%s' % prototype.forumName+'" '
            if self.forum.forumName == prototype.forumName:
                html += 'selected '
            html += '>' + prototype.forumName + '</option>\n'
        html += '</select> \n'
        if not self.idevice.noForum:
            introduction = self.forum.introduction.replace("\r", "")
            introduction = introduction.replace("\n","\\n")
            html += common.textInput("fName"+ self.id, self.forum.forumName)
            html += common.elementInstruc("fName"+ self.id, 
                                          self.forum.nameInstruc)
            html += "<br/><br/><b>%s</b><br/>" % _("Introduction")
            html += common.richTextArea("fIntro"+self.id, 
                                        introduction)
        html += "<br/>\n"
        
        html += '<br/><b>%s</b><br/>' % _(u"Discussion Topic/Thread:")
        html += '<select onchange='
        html += '"submitChange(\'%s\',\'topicSelect%s\');"' % ("changeTopic",
                                                               self.id)
        html += 'name="topicSelect%s" id="topicSelect%s">\n' % (self.id, self.id)
        html += '<option value = "none"'
        html += '>%s </option>' % _("None")
        html += '<option value = "newTopic" '
        if self.idevice.isNewTopic:
            html += 'selected '
        html += '>'+ _(u"New Topic") + '</option>'
        for prototype in self.forum.discussions:
            html += '<option value="'+prototype.name+'" '
            if self.idevice.discussion.topic == prototype.topic:
                html += 'selected '
            html += '>' + prototype.topic + '</option>\n'
        html += '</select> \n'
        html += self.discussionElement.renderEdit()
        
        html += '<br/><br/><b>%s</b><br/>' % _(u"Learning Management System:")
        html += '<select onchange='
        html += '"submitChange(\'%s\',\'lmsSelect%s\');"' % ("changeLms",
                                                               self.id)
        html += 'name="lmsSelect%s" id="lmsSelect%s">\n' % (self.id, self.id)
        html += '<option value="">%s</option>' % _(u"Please select a LMS")
        html += '<option value = "moodle" '
        if self.forum.lms.lms == "moodle":
            html += 'selected '
        html += '>'+ _(u"Moodle") + '</option>'
        html += '<option value = "other" '
        if self.forum.lms.lms == "other":
            html += 'selected '
        html += '>'+ _(u"Other") + '</option>'
        html += '</select>\n'
        html += common.elementInstruc("lms"+ self.id, self.forum.lmsInstruc)
        html += "<br/><br/>"
        html += self.lmsElement.renderEdit()
        
        return html
        
    def renderView(self):
        html  = ""
        if self.forum.lms.lms == "moodle":
            html += "<!--%slink-->\n" % self.forum.forumName
        html += u'<b>%s%s</b>' % (_(u"Forum Name: "),self.forum.forumName)
        html += u"<br/>%s<br/>" % self.forum.introduction
        html += self.discussionElement.renderView()
        html += self.lmsElement.renderView()
                                                
        html += u"<br/><br/>\n"
        
        return html
 
#===========================================================================  
class DiscussionElement(object):
    """ 
    DiscussionElement is a discussion topic
    """
    def __init__(self, idevice):
        """
        Initialize
        """
        self.id = idevice.id
        self.idevice = idevice
        self.discussion = idevice.discussion

 
    def process(self, request):
        """
        Process arguments from the web server. 
        """
        if "topic"+self.id in request.args:
            self.discussion.topic = request.args["topic"+self.id][0]
        if "dIntro"+self.id in request.args:
            self.discussion.intro = request.args["dIntro"+self.id][0]
            

    def renderEdit(self):
        """
        Returns an XHTML string with the form element for editing this field
        """
        if self.discussion.isNone:
            return ""
        
        html  = common.textInput("topic" + self.id, self.discussion.topic)
        html += common.elementInstruc(self.id, self.discussion.instruc)
        html += u"<br/>\n"
        html += common.richTextArea("dIntro" + self.id, self.discussion.intro)

        return html
    

    def renderView(self):
        """
        Returns an XHTML string for viewing or previewing this element
        """
        if self.discussion.isNone:
            return ""
        html = ""
        if self.idevice.forum.lms.lms == "moodle":
            html += u"<!--%slink-->\n" % self.idevice.forum.forumName
        html += u"<br/><b>%s%s</b><br/>" % (_(u"Thread: "), self.discussion.topic)
        html += self.discussion.intro + "<br/>"
        return html    
   
    
# ===========================================================================
