package github.souchy.ankama.dofusbuilder.backend.dofapi;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Paths;

import github.souchy.ankama.dofusbuilder.backend.DofusBuilder;
import github.souchy.ankama.dofusbuilder.backend.Log;

public class ImageDownloader {


	public static void dl(String remoteUrl, String localFolder, String localFileName) {
		Log.info("id : " + localFileName + ", url : " + remoteUrl);

		var dir = Paths.get(DofusBuilder.conf.imageDir + localFolder);
		var path = Paths.get(dir + "/" + localFileName + ".png");

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
