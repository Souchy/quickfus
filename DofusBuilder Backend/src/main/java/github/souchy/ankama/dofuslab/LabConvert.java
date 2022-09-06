package github.souchy.ankama.dofuslab;


import java.util.ArrayList;
import java.util.Arrays;

import org.bson.BsonArray;
import org.bson.BsonDocument;
import org.bson.BsonInt32;
import org.bson.BsonString;
import org.bson.BsonValue;
import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Field;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Updates;

import github.souchy.ankama.jade.Stats;
import github.souchy.ankama.quickfus.Emerald;
import github.souchy.ankama.quickfus.Log;

public class LabConvert {

	private static Document map(Object input, String as, String in) {
		Document root = new Document();
		root.append("$map", new Document()
				.append("input", input)
				.append("as", as)
				.append("in", in)
		);
		return root;
	}
	private static Document filter(Object input, String as, Document cond) {
		Document root = new Document();
		root.append("$filter", new Document()
				.append("input", input)
				.append("as", as)
				.append("cond", cond)
		);
		return root;
	}

	private static Document sum(Document root, Document child) {
		return root
		.append("$sum", child
		);
	}
	
	
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
	
	public static void modifySets() {
		var pipe = new ArrayList<Bson>();
		
		pipe = new ArrayList<Bson>();
		// temporary list of item stats

		pipe.add(new Document().append("$unset", Arrays.asList("statistics")));
		pipe.add(Aggregates.lookup("items", "id", "setID", "items"));
		pipe.add(Aggregates.addFields(new Field<Document>("stats", new Document()
		   		.append("$reduce", new Document()
						.append("input", "$items.statistics")
						.append("initialValue", new BsonArray())
						.append("in", new Document()
								.append("$concatArrays", new BsonArray(Arrays.asList(
											new BsonString("$$value"), new BsonString("$$this")
										))
							    )
						)
				)
			)));
		// temporary list of stats in the max bonus
		pipe.add(Aggregates.addFields(new Field<Document>("maxBonus", new Document().append(
				"$arrayElemAt", new BsonArray(Arrays.<BsonValue>asList(
							new BsonString("$bonuses"), new BsonInt32(0)
						))
				)
		)));
		
		var totalStats = new ArrayList<Document>();
		
		for(var e : Stats.values()) {
			var d = new Document();
			totalStats.add(d);
			d.append("name", e.fr);
			d.append("max", new Document().append("$add", Arrays.asList(
							sum(new Document(), 
									map(
											filter(
													"$stats",
													"stat", 
													new Document()
														.append("$eq", 
																new BsonArray(Arrays.asList(
																		new BsonString("$$stat.name"), new BsonString(e.fr)
																))
														)
											),
											"stat",
											"$$stat.max"
									)
							),
							sum(new Document(),
									map(
											filter(
													"$maxBonus",
													"stat", 
													new Document()
														.append("$eq", 
																new BsonArray(Arrays.asList(
																		new BsonString("$$stat.name"), new BsonString(e.fr)
																))
														)
											),
											"stat",
											"$$stat.max"
									)
							)
				))
			);
		}

		
		pipe.add(Aggregates.addFields(new Field<Document>("statistics", filter(
				totalStats,
				"stat", 
				new Document()
					.append("$ne", 
							new BsonArray(Arrays.asList(
									new BsonString("$$stat.max"), new BsonInt32(0)
							))
					)
		)
		)));

		pipe.add(new Document().append("$unset", Arrays.asList("stats", "maxBonus")));
		

		pipe.add(Aggregates.addFields(new Field<Document>("(Pseudo) statistics.(Pseudo) # res", resSizer(true))));
		pipe.add(Aggregates.addFields(new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res", resSummer(true))));
		pipe.add(Aggregates.addFields(new Field<Document>("(Pseudo) statistics.(Pseudo) # res élémentaires", resSizer(false))));
		pipe.add(Aggregates.addFields(new Field<Document>("(Pseudo) statistics.(Pseudo) Total #% res élémentaires", resSummer(false))));
		
		
		var output = Emerald.sets().aggregate(pipe).into(new ArrayList<Document>());
		output.forEach(d -> {
			Emerald.sets().replaceOne(Filters.eq("_id", d.get("_id")), d);
		});
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
