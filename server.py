#!/usr/bin/env python

import os
import json
import cherrypy

class StaticAndDynamic(object):
    _cp_config = {'tools.staticdir.on' : True,
                  'tools.staticdir.dir' : os.getcwd(),
                  'tools.staticdir.index' : 'index.html',
    }

    @cherrypy.expose
    def save(self):
    	data = json.loads(cherrypy.request.body.read())
    	fd = open(data['file'], 'w');
    	fd.write(data['content']);
    	fd.close();

cherrypy.config.update({'server.socket_host': '0.0.0.0',})
cherrypy.config.update({'server.socket_port': int(os.environ.get('PORT', '8080')),})
cherrypy.quickstart(StaticAndDynamic())