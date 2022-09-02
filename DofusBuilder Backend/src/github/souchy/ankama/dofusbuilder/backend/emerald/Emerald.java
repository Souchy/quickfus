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

import github.souchy.ankama.dofusbuilder.backend.main.Quickfus;

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
//		connectionString = new ConnectionString("mongodb+srv://visitor:9lRz32NeFXqkq8lf@souchyatlascluster0.bbs5alz.mongodb.net/?retryWrites=true&w=majority");
		
		var settings = MongoClientSettings.builder()
			.applyConnectionString(connectionString) //new ConnectionString(Quickfus.conf.mongo)) 
			.codecRegistry(registry)
		.build();
		clientSync = MongoClients.create(settings);
		
//		DataModifier.modifyItems();
		
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
