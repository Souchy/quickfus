package github.souchy.ankama.quickfus;

import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.pojo.PojoCodecProvider;

import com.mongodb.ConnectionString;
import com.mongodb.MongoClientSettings;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;


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

		ConnectionString connectionString = new ConnectionString(Quickfus.conf.mongo);
		var settings = MongoClientSettings.builder()
			.applyConnectionString(connectionString)
			.codecRegistry(registry)
		.build();
		clientSync = MongoClients.create(settings);
		
		Log.info("Emerald Item count: " + items().countDocuments());
		Log.info("Emerald Set count: " + sets().countDocuments());
		
	}
	
	public static MongoDatabase db() {
		return clientSync.getDatabase(Quickfus.conf.root);
	}
	
	public static MongoCollection<Document> items() {
		return db().getCollection("items"); 
	}
	
	public static MongoCollection<Document> sets() {
		return db().getCollection("sets"); 
	}

	
}
