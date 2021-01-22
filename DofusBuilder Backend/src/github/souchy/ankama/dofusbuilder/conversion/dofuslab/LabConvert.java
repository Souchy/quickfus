package github.souchy.ankama.dofusbuilder.conversion.dofuslab;

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
import github.souchy.ankama.dofusbuilder.backend.jade.Stats;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

public class LabConvert {
	
	public static void modifyItems() {
		var pipe = new ArrayList<Bson>();
		
		var fieldResCount = new Field<Document>("(Pseudo) statistics.(Pseudo) # res", resSizer(true));
		var fieldResTotal = new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res", resSummer(true));
		var fieldResCountEle = new Field<Document>("(Pseudo) statistics.(Pseudo) # res élémentaires", resSizer(false));
		var fieldResTotalEle = new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res élémentaires", resSummer(false));

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
						new BsonString("$$stat.name"), new BsonString(Stats.RES_PER_EARTH.fr) //"% Résistance Terre")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString(Stats.RES_PER_FIRE.fr) //"% Résistance Feu")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString(Stats.RES_PER_WATER.fr) //"% Résistance Eau")
					))
				),
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
						new BsonString("$$stat.name"), new BsonString(Stats.RES_PER_AIR.fr) //"% Résistance Air")
					))
				)
		));
		if(neutre) {
			arr.add(
				new BsonDocument().append("$eq", new BsonArray(Arrays.asList(
					new BsonString("$$stat.name"), new BsonString(Stats.RES_PER_NEUTRAL.fr) //"% Résistance Neutre")
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
