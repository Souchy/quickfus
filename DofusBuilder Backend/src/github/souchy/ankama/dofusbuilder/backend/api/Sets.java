package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.bson.BsonValue;
import org.bson.Document;
import org.bson.codecs.BsonArrayCodec;
import org.bson.codecs.DecoderContext;
import org.bson.conversions.Bson;
import org.bson.json.JsonReader;

import com.mongodb.client.model.Filters;
import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

@Path("/sets")
public class Sets {

	private static final Document defaultFilter = Document.parse("{ }");

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Document getSet(@PathParam("id") int id) {
		return Emerald.sets().find(Filters.eq("id", id)).first();
	}

	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getSets(String jsonPipeline) { //@QueryParam("skip") int skip, @QueryParam("limit") int limit, String json) {
		List<Document> list = new ArrayList<>();
//		Log.info("getSets : skip : " + skip + ", limit : " + limit + ", filter : " + json);
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
			Emerald.sets().aggregate(pipeline).into(list);
		} catch(Exception e) {
			Log.info("" + e);
		}
//		Log.info("getSets result size : " + list.size());
		return list;
	
	}
	

}
