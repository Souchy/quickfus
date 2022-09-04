package github.souchy.ankama.quickfus.api;


import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

// import javax.ws.rs.GET;
// import javax.ws.rs.POST;
// import javax.ws.rs.Path;
// import javax.ws.rs.PathParam;
// import javax.ws.rs.Produces;
// import javax.ws.rs.core.MediaType;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import org.bson.BsonValue;
import org.bson.Document;
import org.bson.codecs.BsonArrayCodec;
import org.bson.codecs.DecoderContext;
import org.bson.conversions.Bson;
import org.bson.json.JsonReader;

import com.mongodb.client.model.Filters;

import github.souchy.ankama.quickfus.Emerald;
import github.souchy.ankama.quickfus.Log;


@Path("/items")
public class Items {
	
	private static final Document defaultFilter = Document.parse("{}");

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Document getSet(@PathParam("id") String id) {
		// Log.info("hey items get one: " + id);
		return Emerald.items().find(Filters.eq("ankamaID", id)).first();
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getItems(String jsonPipeline) { //@QueryParam("skip") int skip, @QueryParam("limit") int limit, String json) {
		List<Document> list = new ArrayList<>();
//		Log.info("getItems : " + jsonPipeline); 
		try {
			var pipeline = new ArrayList<Bson>();
			if(jsonPipeline.isBlank()) {
				pipeline.add(defaultFilter);
			} else {
				pipeline.addAll(
						new BsonArrayCodec().decode(new JsonReader(jsonPipeline), DecoderContext.builder().build())
						.stream().map(BsonValue::asDocument).collect(Collectors.toList())
			    );
			}
//			Log.info(pipeline.toString());
			Emerald.items().aggregate(pipeline).into(list);
		} catch(Exception e) {
			Log.info("" + e);
		}
//		Log.info("getItems result size : " + list.size());
		return list;
	}
	
	
}
