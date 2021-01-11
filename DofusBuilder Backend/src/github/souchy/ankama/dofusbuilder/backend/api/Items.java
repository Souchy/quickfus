package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.Document;
import org.bson.conversions.Bson;

import com.mongodb.client.model.Aggregates;
import com.mongodb.client.model.Sorts;

import github.souchy.ankama.dofusbuilder.backend.Log;
import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;

@Path("/items")
public class Items {
	
	private static final Document defaultFilter = Document.parse("{}");
	
	@POST
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getItems(@QueryParam("skip") int skip, @QueryParam("limit") int limit, String json) {
		List<Document> list = new ArrayList<>();
//		Log.info("getItems : skip : " + skip + ", limit : " + limit + ", filter : " + json);
		try {
			var filter = json.isBlank() ? defaultFilter : Document.parse(json);
			
			var pipeline = new ArrayList<Bson>();
			pipeline.add(Aggregates.sort(Sorts.descending("level", "ankamaId"))); // sort by level puis par ankamaId, ce qui met les items les plus récents en premier et groupe les panos
			pipeline.add(Aggregates.match(filter));
			pipeline.add(Aggregates.skip(skip));
			pipeline.add(Aggregates.limit(limit));

//			Log.info(pipeline.toString());
			
			list = Emerald.items()
					.aggregate(pipeline)
					.into(new ArrayList<>());
			
		} catch(Exception e) {
			Log.info("" + e);
		}
//		Log.info("getItems result size : " + list.size());
		return list;
	}
	
	
}
