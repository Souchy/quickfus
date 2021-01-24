package github.souchy.ankama.dofusbuilder.conversion.dofapi;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import github.souchy.ankama.dofusbuilder.backend.main.Quickfus;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

public class ImageDownloader {


	public static void dl(String remoteUrl, String localFolder, String localFileName) {
		Log.info("id : " + localFileName + ", url : " + remoteUrl);

		var dir = Paths.get(Quickfus.conf.imageDir + localFolder);
		var path = Paths.get(dir + "/" + localFileName + ".png");
		
		if(path.toFile().exists()) {
			return;
		}

		try (InputStream in = new URL(remoteUrl).openStream()) {
			Files.createDirectories(dir);
			Files.copy(in, path);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
