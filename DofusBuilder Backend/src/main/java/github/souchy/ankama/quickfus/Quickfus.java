package github.souchy.ankama.quickfus;


import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.glassfish.jersey.jetty.JettyHttpContainerFactory;
import org.glassfish.jersey.netty.httpserver.NettyHttpContainerProvider;
import org.glassfish.jersey.server.ResourceConfig;
import org.glassfish.jersey.servlet.ServletContainer;

import com.google.gson.Gson;

import github.souchy.ankama.quickfus.api.CORSFilter;
import github.souchy.ankama.quickfus.api.Items;
import github.souchy.ankama.quickfus.api.Sets;
import io.netty.channel.Channel;
import jakarta.servlet.http.HttpServlet;

import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.DefaultServlet;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import org.eclipse.jetty.webapp.WebAppContext;

import java.util.logging.Level;
import java.util.logging.Logger;


public class Quickfus {

	private static Channel server;
	private static ResourceConfig rc;
	
	public static Conf conf;
	
	static {
		try {
			var path = Paths.get("./api.conf");
			if(!Files.exists(path)) {
				conf = new Conf();
				var json = new Gson().toJson(conf);
				Files.writeString(path, json);
			}
			var json = Files.readString(path);
			conf = new Gson().fromJson(json, Conf.class);

			try {
				Files.createDirectories(Paths.get(conf.imageDir));
			} catch (IOException e1) {
				e1.printStackTrace();
			}
			
			Log.info("Start DofusBuilder conf : " + json);
		} catch (Exception e) {
			Log.info("" + e);
			System.exit(0);
		}
	}
	
	public static void main(String[] args) throws Exception {
		new Quickfus();
	}

	private Quickfus() throws Exception {
		init();
		// start();
		startJetty();
	}

	private void init() throws Exception {
		boolean executing = true;

		// execute api site
		if(executing)
			Emerald.db();

		rc = new ResourceConfig().packages(getRootPackages());
		// rc.register(CORSFilter.class);
		// rc.register(Items.class);
		// rc.register(Sets.class);
		Log.info("RC Classes: " + rc.getClasses());
		
		// or convert/upload data to mongo
		if(executing) 
			return;
		
		// This is old conversion from dofapi. Run LabImport insteadnow
//		ItemsConverter.convert("sets");
//		ItemsConverter.convert("pets");
//		ItemsConverter.convert("mounts");
//		ItemsConverter.convert("weapons");
//		ItemsConverter.convert("equipments");
		System.exit(0);
	}

	private void start() {
		try {
			String envIP = System.getenv("QUICKFUSIP");
			String envPort = System.getenv("PORT");
			if(envPort == null || envPort.isBlank()) {
				envPort = conf.port + "";
			}
			if(envIP == null || envIP.isBlank()) {
				envIP = conf.ip;
			}
			// String http = "http://";
			// if(!conf.ip.contains("localhost")) {
			// 	http = "https://";
			// }
			// http = "";
			String http = "";
			String url = http + envIP + ":" + envPort + "/";
			Log.info("Binding Netty server to: " + url);
			// Server
			server = NettyHttpContainerProvider.createHttp2Server(URI.create(url), rc, null);
			Runtime.getRuntime().addShutdownHook(new Thread(() -> server.close()));
			Thread.currentThread().join();
			throw new InterruptedException("asdf");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	private void startJetty() {
		String envPort = System.getenv("PORT");
		if(envPort == null || envPort.isBlank()) {
			envPort = Quickfus.conf.port + "";
		}

		Log.info("Hello API " + envPort);

        Server server = new Server(Integer.valueOf(envPort));

        ServletContextHandler ctx = 
                new ServletContextHandler(ServletContextHandler.NO_SESSIONS);
                
        ctx.setContextPath("/");
        server.setHandler(ctx);

        ServletHolder serHol = ctx.addServlet(ServletContainer.class, "/*");
        serHol.setInitOrder(1);
        serHol.setInitParameter(
				"jersey.config.server.provider.packages", 
                "github.souchy.ankama.quickfus.api");

        try {
            server.start();
            server.join();
        } catch (Exception ex) {
            Logger.getLogger(Quickfus.class.getName()).log(Level.SEVERE, null, ex);
        } finally {
            server.destroy();
        }
	}

	protected String[] getRootPackages() {
		return new String[] { "github.souchy.ankama.quickfus.api" };
	}
	
	
}
