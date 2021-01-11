package github.souchy.ankama.dofusbuilder.backend.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import com.mongodb.client.model.Filters;

import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;

@Path("/item")
public class Item {

	@GET
	@Path("/{id}")
	@Produces(MediaType.APPLICATION_JSON)
	public Object get(@PathParam("id") int id){
		return Emerald.items().find(Filters.eq("ankamaId", id)).first();
	}
	
	
}
