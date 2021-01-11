package github.souchy.ankama.dofusbuilder.backend.emerald;

import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.pojo.PojoCodecProvider;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

import github.souchy.ankama.dofusbuilder.backend.DofusBuilder;
import github.souchy.ankama.dofusbuilder.backend.dofapi.DataModifier;

/**
 * Database access
 * 
 * @author Souchy
 *
 */
public class Emerald {

	private static final MongoClient clientSync; 

	static {
		var registry = CodecRegistries.fromRegistries(
				MongoClientSettings.getDefaultCodecRegistry(),
				CodecRegistries.fromProviders(PojoCodecProvider.builder().automatic(true).build())
		);

		var settings = MongoClientSettings.builder()
			.applyConnectionString(new ConnectionString(DofusBuilder.conf.mongo)) 
			.codecRegistry(registry)
		.build();
		clientSync = MongoClients.create(settings);
		
		DataModifier.modifyItems();
	}
	
	private static MongoDatabase db() {
		return clientSync.getDatabase(DofusBuilder.conf.root);
	}
	
	public static MongoCollection<Document> items() {
		return db().getCollection("items"); 
	}
	public static MongoCollection<Document> sets() {
		return db().getCollection("sets"); 
	}

	
}
