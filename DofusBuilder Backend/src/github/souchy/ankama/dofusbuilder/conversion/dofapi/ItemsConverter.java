package github.souchy.ankama.dofusbuilder.conversion.dofapi;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;

import org.json.JSONArray;

import github.souchy.ankama.dofusbuilder.backend.main.Quickfus;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

/**
 * Takes json data taken from dofapi.fr and converts it to a format that MongoDB can import
 * 
 * @author Souchy
 *
 */
public class ItemsConverter {

	public static final boolean downloadImages = false;

	public static void convert(String filename) {
		try {
			var path = Path.of(Quickfus.conf.jsonDir + filename + ".json");
			var json = Files.readString(path);
			
			var lines = new ArrayList<String>();
			var data = new JSONArray(json); 
			Log.info("data size : " + data.length());
			
			for (int i = 0; i < data.length(); i++) {
				var item = data.getJSONObject(i);

				item.remove("_id");
				
				if (downloadImages)
					ImageDownloader.dl(item.getString("imgUrl"), item.getString("type"), item.getInt("ankamaId") + "");
				
				// set bonuses
				if (item.has("bonus")) {
					var bonus = item.getJSONObject("bonus");
					var stats = bonus.getJSONArray("stats");
					convertStats(stats);
				}
				
				// characteristics (weapons-specific, ex : base damage, base crit chance, base crit dmg..)
				if (item.has("characteristics")) {
					/*
					 "characteristics": [
						 {"PA":"3 (1 utilisation par tour)"},
						 {"Portée":"1"},
						 {"CC":"1/30 (+5)"}
					 ],
					 */
				}
				
				// recipe
				if(item.has("recipe")) {
					var ressources = item.getJSONArray("recipe");
					for(int j = 0; j < ressources.length(); j++) {
						var res = ressources.getJSONObject(j);
						var key = res.keys().next(); // exemple "Bois de Frêne"
						var vals = res.optJSONObject(key); // propriétés du bois de frêne
						if(vals == null) continue;

						res.put("name", key);
						for(var valkey : vals.keySet()) {
							res.put(valkey, vals.get(valkey));
						}
						res.remove(key);
					}
				}
				
				// stats
				if (item.has("statistics")) {
					var stats = item.getJSONArray("statistics");
					convertStats(stats);
				}
				
				lines.add(item.toString());
			}
			Files.write(Path.of(Quickfus.conf.jsonDir + filename + "-output.json"), lines);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
	
	private static void convertStats(JSONArray stats) {
		for(int j = 0; j < stats.length(); j++) {
			var stat = stats.getJSONObject(j);
			for(var key : stat.keySet()) {
				var vals = stat.optJSONObject(key);
				if (vals == null) break;
				
				var name = convertStatName(key);
				stat.put("name", name);
				
				for(var valkey : vals.keySet()) {
					stat.put(valkey, vals.get(valkey));
				}
				
				stat.remove(key);
			}
		}
	}

	private static String convertStatName(String stat) {
		int percentIndex = stat.indexOf("%");
		if(percentIndex != -1) {
			return stat.substring(percentIndex);
		}
//		if(stat.contains("% Critique")) {
//			return "% Critique";
//		}
		return stat;
	}
	

}
