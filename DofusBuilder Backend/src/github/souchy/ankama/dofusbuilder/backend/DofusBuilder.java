package github.souchy.ankama.dofusbuilder.backend;

import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Paths;

import org.glassfish.jersey.netty.httpserver.NettyHttpContainerProvider;
import org.glassfish.jersey.server.ResourceConfig;

import com.google.gson.Gson;

import github.souchy.ankama.dofusbuilder.backend.dofapi.ItemsConverter;
import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import io.netty.channel.Channel;

public class DofusBuilder {

	private static Channel server;
	private static ResourceConfig rc;
	
	public static Conf conf;
	
	
	public static void main(String[] args) throws Exception {
		new DofusBuilder();
	}

	private DofusBuilder() throws Exception {
		init();
		start();
	}

	private void init() throws Exception {
		rc = new ResourceConfig().packages(getRootPackages());
		Log.info("" + rc.getClasses());
		
		var path = Paths.get("./api.conf");
		var json = Files.readString(path);
		conf = new Gson().fromJson(json, Conf.class);
		
		Log.info("Start DofusBuilder conf : " + json);
		
		boolean executing = true;
		
		// execute api site
		if(executing)
			new Emerald();
		
		// or convert/upload data to mongo
		if(executing) 
			return;

		ItemsConverter.convert("sets");
		ItemsConverter.convert("pets");
		ItemsConverter.convert("mounts");
		ItemsConverter.convert("weapons");
		ItemsConverter.convert("equipments");
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
		return new String[] { "github.souchy.ankama.dofusbuilder.backend.api" };
	}
	
	
}
