module DofusBuilder.Backend {

	exports github.souchy.ankama.dofusbuilder.backend;
	exports github.souchy.ankama.dofusbuilder.backend.api;
	exports github.souchy.ankama.dofusbuilder.backend.emerald;
	exports github.souchy.ankama.dofusbuilder.backend.jade;
	
	
	requires transitive org.mongodb.driver.sync.client;
	requires transitive org.mongodb.bson;
	requires transitive org.mongodb.driver.core;

	
	requires transitive java.ws.rs;
	requires jersey.common;
	requires jersey.container.netty.http;
	requires jersey.server;
	requires netty.all;
	requires java.xml;
	requires jersey.mvc;
	requires jersey.mvc.freemarker;
	
	requires jersey.container.servlet.core;
	requires jersey.media.jaxb;
	
	requires java.json.bind;
	requires jdk.httpserver;
	requires freemarker;
	requires jakarta.servlet.api;
	
	requires jersey.container.grizzly2.http;
	requires grizzly.http.server;
	requires java.annotation;
	requires grizzly.framework;
	requires jakarta.inject;
	
	requires java.xml.bind;
	requires com.google.common;
	requires java.json;
	requires gson;
	requires org.json;
	
}