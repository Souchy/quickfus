package github.souchy.ankama.dofusbuilder.conversion.dofuslab;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;

import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import github.souchy.ankama.dofusbuilder.backend.jade.ItemTypes;
import github.souchy.ankama.dofusbuilder.backend.jade.Stats;
import github.souchy.ankama.dofusbuilder.backend.main.Quickfus;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

public class LabImport {
	
	
	public static void main(String[] args) throws IOException {
		Emerald.db().drop();
		
		importItems("items", "items");
		importItems("weapons", "items");
		importItems("pets", "items");
		importItems("mounts", "items");
		importItems("rhineetles", "items");
		
		importSets("sets", "sets");
//		importFile("spells", "spells");
		
		
		LabConvert.modifyItems();
	}


	private static final String url = "http://static.ankama.com/dofus/www/game/items/200/";
	public static void dlImg(String imgId) {
		var dir = Paths.get(Quickfus.conf.imageDir);
		var path = Paths.get(dir + "/" + imgId);
		if(path.toFile().exists()) return;

		try (InputStream in = new URL(url + imgId).openStream()) {
			Log.info("dl " + imgId);
			Files.copy(in, path);
		} catch (MalformedURLException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	private static void importSets(String filename, String collection) throws IOException {
		var path = Path.of(Quickfus.conf.jsonDir + filename + ".json");
		var json = Files.readString(path);
		var data = new JSONArray(json); 
		var list = new ArrayList<Document>();
		Log.info("data size (" + filename + " -> " + collection + ") : " + data.length());

		for (int i = 0; i < data.length(); i++) {
			var set = data.getJSONObject(i);
			
			var ranks = set.getJSONObject("bonuses");
			var ranksArray = new JSONArray();
			int r = 1;
			for(var rank : ranks.keySet()) {
				var bonuses = ranks.getJSONArray(rank);
				
				convertBonuses(bonuses);
				
				ranksArray.put(ranks.length() - r, bonuses); // en ordre inverse
				r++;
			}
			set.put("bonuses", ranksArray);
			
			list.add(Document.parse(set.toString()));
		}

		Emerald.db().getCollection(collection).insertMany(list);
	}
	
	private static void importItems(String filename, String collection) throws IOException {
		var path = Path.of(Quickfus.conf.jsonDir + filename + ".json");
		var json = Files.readString(path);
		var data = new JSONArray(json); 
		var list = new ArrayList<Document>();
		Log.info("data size (" + filename + " -> " + collection + ") : " + data.length());

		for (int i = 0; i < data.length(); i++) {
			var item = data.getJSONObject(i);

			rename(item, "dofusID", "ankamaID");
			rename(item, "itemType", "type");
			rename(item, "imageUrl", "imgUrl");
			
			if (item.has("imgUrl")) {
				// change url
				var img = item.getString("imgUrl");
				item.put("imgUrl", img.substring(img.indexOf("/") + 1));
				// download img if missing
//				Log.info("img " + item.getJSONObject("name").getString("fr"));
//				dlImg(item.getString("imgUrl"));
			}
			
			if(item.has("type")) {
				var type = item.getString("type");
				item.put("type", ItemTypes.en_to_fr.get(type));
			}
			
			
			// stats
			if (item.has("stats")) {
				rename(item, "stats", "statistics");
				var stats = item.getJSONArray("statistics");
				convertStats(stats);
			}
			
			// characteristics (weapons-specific, ex : base damage, base crit chance, base crit dmg..)
//			if (item.has("characteristics")) {
				/*
				 "characteristics": [
					 {"PA":"3 (1 utilisation par tour)"},
					 {"Portée":"1"},
					 {"CC":"1/30 (+5)"}
				 ],
				 */
//			}
			
			list.add(Document.parse(item.toString()));
		}
		
		Emerald.db().getCollection(collection).insertMany(list);
	}
	
	private static void rename(JSONObject o, String key1, String key2) {
		if(!o.has(key1)) return;
		var val = o.get(key1);
		o.remove(key1);
		o.put(key2, val);
	}
	

	private static final Object onull = null;
	private static void convertStats(JSONArray stats) {
		for(int j = 0; j < stats.length(); j++) {
			var stat = stats.getJSONObject(j);
			
			// rename keys
			rename(stat, "stat", "name");
			rename(stat, "minStat", "min");
			rename(stat, "maxStat", "max");
			
			// translate name
			var name = stat.get("name");
			stat.put("name", Stats.en_to_fr.get(name));
			
			// if there's only 1 value, put it in max instead of min
			if(stat.get("min") == null) {
				stat.put("min", stat.get("max"));
				stat.put("max", onull);
			}
			
		}
	}
	private static void convertBonuses(JSONArray bonuses) {
		for(int j = 0; j < bonuses.length(); j++) {
			var stat = bonuses.getJSONObject(j);
			
			// rename keys
			rename(stat, "stat", "name");
			rename(stat, "value", "max");
			stat.remove("altStat");
			
			// translate name
			var name = stat.get("name");
			stat.put("name", Stats.en_to_fr.get(name));
			
		}
	}
	
}
