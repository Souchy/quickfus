package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.bson.Document;

import com.mongodb.client.model.Filters;

import github.souchy.ankama.dofusbuilder.backend.Log;
import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;

@Path("/sets")
public class Sets {

	private static final Document defaultFilter = Document.parse("{ }");

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Document getSet(@PathParam("id") int id) {
		return Emerald.sets().find(Filters.eq("ankamaId", id)).first();
	}

	@GET
	@Path("/")
	@Produces(MediaType.APPLICATION_JSON)
	public List<Document> getSets() {
		List<Document> list = Emerald.sets().find(defaultFilter).into(new ArrayList<>());
		Log.info("getSets result size : " + list.size());
		return list;
	}
	

}
