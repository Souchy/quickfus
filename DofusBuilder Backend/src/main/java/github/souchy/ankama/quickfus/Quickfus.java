package github.souchy.ankama.quickfus;


import java.io.IOException;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.glassfish.jersey.netty.httpserver.NettyHttpContainerProvider;
import org.glassfish.jersey.server.ResourceConfig;

import com.google.gson.Gson;

import github.souchy.ankama.quickfus.api.CORSFilter;
import github.souchy.ankama.quickfus.api.Items;
import github.souchy.ankama.quickfus.api.Sets;
import io.netty.channel.Channel;

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
		start();
	}

	private void init() throws Exception {
		boolean executing = true;

		// execute api site
		if(executing)
			new Emerald();

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
			// Server
			server = NettyHttpContainerProvider.createHttp2Server(URI.create("http://" + conf.ip + ":" + conf.port + "/"), rc, null);
			Runtime.getRuntime().addShutdownHook(new Thread(() -> server.close()));
			Thread.currentThread().join();
			throw new InterruptedException("asdf");
		} catch (InterruptedException e) {
			e.printStackTrace();
		}
	}
	
	protected String[] getRootPackages() {
		return new String[] { "github.souchy.ankama.quickfus.api" };
	}
	
	
}
