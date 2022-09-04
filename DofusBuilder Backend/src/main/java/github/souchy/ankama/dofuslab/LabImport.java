package github.souchy.ankama.dofuslab;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.function.Function;

import org.bson.Document;
import org.json.JSONArray;
import org.json.JSONObject;

import com.google.gson.JsonObject;
import com.mongodb.client.model.Filters;

import github.souchy.ankama.jade.ItemTypes;
import github.souchy.ankama.jade.Stats;
import github.souchy.ankama.jade.WeaponStats;
import github.souchy.ankama.quickfus.Emerald;
import github.souchy.ankama.quickfus.Quickfus;
import github.souchy.ankama.quickfus.Log;

public class LabImport {

	public static void main(String[] args) throws IOException {
		// Emerald.db().drop();
		Emerald.items().deleteMany(Filters.empty());
		Emerald.sets().deleteMany(Filters.empty());

		importItems("items", "items");
		importItems("weapons", "items");
		importItems("pets", "items");
		importItems("mounts", "items");
		importItems("rhineetles", "items");

		importSets("sets", "sets");
		// importFile("spells", "spells");

		LabConvert.modifyItems();
		LabConvert.modifySets();
	}

	private static final String urls[] = new String[] {
		"https://d2iuiayak06k8j.cloudfront.net/item/", 				// dofuslab
		// "https://static.ankama.com/dofus/www/game/items/200/", 	// ankama
		// "https://api.dofusdb.fr/img/items/"						// dofusdb
	};

	public static void dlImg(JSONObject item) {
		String imgId = item.getString("imgUrl");
		var type = ItemTypes.getKeyEnglish(item.getString("type"));
		if(type == null) {
			System.err.println("dlImg type null for: " + item.getString("type"));
			return;
		}
		var typeFolder = type.key.toLowerCase();
		var dir = Paths.get(Quickfus.conf.imageDir + "/" + typeFolder);
		var path = Paths.get(dir + "/" + imgId);
		// System.out.println("path: " + path);
		if(!Files.exists(dir)) {
			try {
				Files.createDirectories(dir);
			} catch(Exception e){
				e.printStackTrace();
			}
		}
		if (path.toFile().exists())
			return;
			
		Log.info("try dl [" + item.getJSONObject("name").getString("fr") + "] img: " + imgId);
		for(String url : urls) {
			try (InputStream in = new URL(url + imgId).openStream()) {
				Files.copy(in, path);
				break;
			} catch (Exception e2) {
				System.err.println("Error downloading img: " + e2.getMessage());
			} 
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

			var id = set.get("id");
			// set.put("id", Long.parseLong(id + ""));
			set.put("id", id);

			var ranks = set.getJSONObject("bonuses");
			var ranksArray = new JSONArray();
			int r = 1;
			for (var rank : ranks.keySet()) {
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

			var ankamaID = item.get("ankamaID");
			// item.put("ankamaID", Long.parseLong(ankamaID + ""));
			item.put("ankamaID", ankamaID);

			if (item.has("setID")) {
				var setID = item.get("setID") + "";
				if (!setID.isBlank() && !setID.equalsIgnoreCase("null")) {
					// Log.info("item " + item.get("name") + ", setID " + setID);
					// item.put("setID", Long.parseLong(setID));
					item.put("setID", setID);
				}
			}

			if (item.has("imgUrl")) {
				// change url
				var img = item.getString("imgUrl");
				item.put("imgUrl", img.substring(img.indexOf("/") + 1));
				// download img if missing
				// Log.info("img " + item.getJSONObject("name").getString("fr"));
				dlImg(item);
			}

			if (item.has("type")) {
				var type = item.getString("type");
				item.put("type", ItemTypes.en_to_fr.get(type));
			}

			// stats
			if (item.has("stats")) {
				rename(item, "stats", "statistics");
				var stats = item.getJSONArray("statistics");
				convertStats(stats, (name) -> Stats.en_to_fr.get(name));
			}

			// weaponStats
			if (item.has("weaponStats")) {
				var weaponStats = item.getJSONObject("weaponStats");
				rename(weaponStats, "weapon_effects", "effects");
				var effects = weaponStats.getJSONArray("effects");
				convertStats(effects, (name) -> WeaponStats.en_to_fr.get(name));
			}

			// characteristics (weapons-specific, ex : base damage, base crit chance, base
			// crit dmg..)
			// if (item.has("characteristics")) {
			/*
			 * "characteristics": [
			 * {"PA":"3 (1 utilisation par tour)"},
			 * {"Port�e":"1"},
			 * {"CC":"1/30 (+5)"}
			 * ],
			 */
			// }

			list.add(Document.parse(item.toString()));
		}
		
		Emerald.db().getCollection(collection).insertMany(list);
	}


	private static void rename(JSONObject o, String key1, String key2) {
		if (!o.has(key1))
			return;
		var val = o.get(key1);
		o.remove(key1);
		o.put(key2, val);
	}

	private static final Object onull = null;

	private static void convertStats(JSONArray stats, Function<String, String> translator) {
		for (int j = 0; j < stats.length(); j++) {
			var stat = stats.getJSONObject(j);

			// rename keys
			rename(stat, "stat", "name");
			rename(stat, "minStat", "min");
			rename(stat, "maxStat", "max");

			// translate name
			var name = stat.get("name").toString();
			var trans = translator.apply(name.toLowerCase());
			if(trans == null || trans.isBlank()) {
				trans = name;
				Log.info("Translating error on: " + name);
			}
			stat.put("name", trans); // Stats.en_to_fr.get(name));

			// if there's only 1 value, put it in max instead of min
			if (stat.get("min") == null) {
				stat.put("min", stat.get("max"));
				stat.put("max", onull);
			}

		}
	}

	private static void convertBonuses(JSONArray bonuses) {
		for (int j = 0; j < bonuses.length(); j++) {
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
