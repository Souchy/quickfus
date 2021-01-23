package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.BsonArray;
import org.bson.BsonString;
import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Field;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

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
	public List<Document> getSets(@QueryParam("skip") int skip, @QueryParam("limit") int limit, String json) {
		List<Document> list = new ArrayList<>();
		Log.info("getSets : skip : " + skip + ", limit : " + limit + ", filter : " + json);
		try {
			var filter = json.isBlank() ? defaultFilter : Document.parse(json);
			
			var pipeline = new ArrayList<Bson>();
//			pipeline.add(Aggregates.sort(Sorts.descending("id"))); // sort by id pour avoir les plus récents sets en premier
			pipeline.add(Aggregates.lookup("items", "id", "setID", "items"));
			pipeline.add(Aggregates.match(filter));
			pipeline.add(Aggregates.skip(skip));
			pipeline.add(Aggregates.limit(limit));


			
			/*
			    "stats": {
			        $reduce: {
			            input: "$items.statistics",
			            initialValue: [],
			            in: { $concatArrays: ["$$value", "$$this"] }
			        }
			    }
			 */

			Emerald.sets().aggregate(pipeline).into(list);
			
		} catch(Exception e) {
			Log.info("" + e);
		}
		Log.info("getSets result size : " + list.size());
		return list;
	
	}
	

}
