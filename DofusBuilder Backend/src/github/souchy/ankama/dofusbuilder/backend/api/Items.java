package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;

import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import github.souchy.ankama.dofusbuilder.backend.main.Log;

@Path("/items")
public class Items {
	
	private static final Document defaultFilter = Document.parse("{}");

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Document getSet(@PathParam("id") int id) {
		return Emerald.items().find(Filters.eq("ankamaId", id)).first();
	}
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getItems(@QueryParam("skip") int skip, @QueryParam("limit") int limit, String json) {
		List<Document> list = new ArrayList<>();
//		Log.info("getItems : skip : " + skip + ", limit : " + limit + ", filter : " + json);
		try {
			var filter = json.isBlank() ? defaultFilter : Document.parse(json);
			
			var pipeline = new ArrayList<Bson>();
			pipeline.add(Aggregates.sort(Sorts.descending("level", "ankamaId"))); // sort by level puis par ankamaId, ce qui met les items les plus r�cents en premier et groupe les panos
//			pipeline.add(Aggregates.match(filter));
			var adds = filter.get("a", Document.class);
			var match = filter.get("m", Document.class);
			if(adds != null) pipeline.add(adds);
			if(match != null) pipeline.add(match);
			
			pipeline.add(Aggregates.skip(skip));
			pipeline.add(Aggregates.limit(limit));

//			Log.info(pipeline.toString());
			
			Emerald.items().aggregate(pipeline).into(list);
			
		} catch(Exception e) {
			Log.info("" + e);
		}
//		Log.info("getItems result size : " + list.size());
		return list;
	}
	
	
}
