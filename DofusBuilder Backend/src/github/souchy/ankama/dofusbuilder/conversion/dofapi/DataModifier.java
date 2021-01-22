package github.souchy.ankama.dofusbuilder.conversion.dofapi;

import java.util.ArrayList;
import java.util.Arrays;

import org.bson.BsonArray;
import org.bson.BsonDocument;
import org.bson.BsonString;
import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Field;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;

import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import github.souchy.ankama.dofusbuilder.backend.jade.JadeStatistic;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

/**
 * Fixes some wrong stats and adds Pseudo stats
 * 
 * @author Souchy
 *
 */
public class DataModifier {

	public static void modifyItems() {
		var items = Emerald.items()
				.find(Document.parse("{statistics: {$elemMatch: { $or: [ { name: 'PA', min: { $lte: -1 } }, { name: 'PM', min: { $lte: -1 } } ]}},type: {$in: [ '�p�e', 'Marteau', 'Pelle', 'Hache', 'B�ton', 'Dagues', 'Arc', 'Baguette', 'Faux', 'Pioche', 'Arme magique', 'Outil']}}"))
				.into(new ArrayList<Document>());
		
		Log.info("fixItemsRetrait count : " + items.size());
		items.forEach((Document d) -> {
			var stats = d.getList("statistics", Document.class);
//			Log.info("fix d : " + d);
			stats.forEach(s -> {
//				Log.info("fix stat : [" + s.getString("name") + "] = " + s.getInteger("min"));
				if(s.getString("name").contentEquals("PA") && s.getInteger("min") == -1) {
					s.put("name", "(PA)");
				}
			});
			Emerald.items().replaceOne(Filters.eq("_id", d.get("_id")), d);
		});
		
		var pipe = new ArrayList<Bson>();
		
		var fieldResCount = new Field<Document>("(Pseudo) statistics.(Pseudo) # res", resSizer(true));
		var fieldResTotal = new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res", resSummer(true));
		var fieldResCountEle = new Field<Document>("(Pseudo) statistics.(Pseudo) # res �l�mentaires", resSizer(false));
		var fieldResTotalEle = new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res �l�mentaires", resSummer(false));

		pipe.add(Aggregates.addFields(fieldResCount));
		pipe.add(Aggregates.addFields(fieldResTotal));
		pipe.add(Aggregates.addFields(fieldResCountEle));
		pipe.add(Aggregates.addFields(fieldResTotalEle));

		Emerald.items().updateMany(Document.parse("{}"), Updates.unset("(Pseudo) statistics"));
		var output = Emerald.items().aggregate(pipe).into(new ArrayList<Document>());
		output.forEach(d -> {
			Emerald.items().replaceOne(Filters.eq("_id", d.get("_id")), d);
		});

		Log.info("Added Pseudo stats");
		
		Emerald.items().updateOne(Filters.eq("name", "Dofus Ivoire"), 
				Updates.set("statistics", Arrays.asList(
						new JadeStatistic("R�sistance Neutre", 40, null),
						new JadeStatistic("R�sistance Terre", 40, null),
						new JadeStatistic("R�sistance Feu", 40, null),
						new JadeStatistic("R�sistance Eau", 40, null),
						new JadeStatistic("R�sistance Air", 40, null)
						))
				);
		Emerald.items().updateOne(Filters.eq("name", "Dofus �b�ne"), 
				Updates.set("statistics", Arrays.asList(
						new JadeStatistic("Fuite", 40, null)
						))
				);
		Emerald.items().updateOne(Filters.eq("name", "Dofus Vulbis"), 
				Updates.set("statistics", Arrays.asList(
						new JadeStatistic("PM", 1, null),
						new JadeStatistic("% pendant 1 tour si aucune attaque occasionnant des dommages n'a �t� subie depuis le pr�c�dent tour de jeu.Le tacle est augment� de 20 pendant 1 tour si une attaque occasionnant des dommages a �t� subie depuis le tour pr�c�dent de jeu.",
								10, null)
						))
				);

		Log.info("Updated items");
	}

	private static Document resSizer(boolean neutre) {
		return new Document()
				.append("$size", new Document()
						.append("$ifNull", 
								Arrays.asList(resFilter(neutre), new ArrayList<>())
						)
				);
		
	}
	private static Document resSummer(boolean neutre) {
		return new Document()
		.append("$sum", new Document()
				.append("$map", new Document()
						.append("input", resFilter(neutre)) //"$" + resPseudo)
						.append("as", "stat")
						.append("in", "$$stat.max")
				)
		);
	}
	private static Document resFilter(boolean neutre) {
		var arr = new BsonArray(Arrays.asList(
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString("% R�sistance Terre")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString("% R�sistance Feu")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString("% R�sistance Eau")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString("% R�sistance Air")
					))
				)
		));
		if(neutre) {
			arr.add(
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
					new BsonString("$$stat.name"), new BsonString("% R�sistance Neutre")
				))
			));
		}
		
		var resFilter = new Document()
				.append("$filter", new Document()
					.append("input", new BsonString("$statistics"))
					.append("as", new BsonString("stat"))
					.append("cond", 
							new Document()
								.append("$or", arr)
					)
				);
		return resFilter;
		
	}
	
}
