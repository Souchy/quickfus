package github.souchy.ankama.dofusbuilder.backend.api;

import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

import org.bson.types.ObjectId;

import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import github.souchy.ankama.dofusbuilder.backend.Log;
import github.souchy.ankama.dofusbuilder.backend.emerald.Emerald;
import github.souchy.ankama.dofusbuilder.backend.jade.JadeBuild;

@Path("/build")
public class Build {

	@GET
	@Path("/{id}")
	// @Consumes("text/plain")
	@Produces(MediaType.APPLICATION_JSON)
	public JadeBuild get(@PathParam("id") String id) {
		try {
			var build = Emerald.builds().find(Filters.eq("_id", new ObjectId(id))).first();
			Log.info("api.builds.id/" + id + " = " + build);
			return build;
		} catch (Exception e) {
			return null;
		}
	}
	

	@POST
	@Path("/")
	@Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.TEXT_PLAIN)
	public String post(JadeBuild build) {
		try {
			var opts = new ReplaceOptions();
			opts.upsert(true); // inserts a new document if none is found
			Emerald.builds().replaceOne(Filters.eq("_id", build._id), build, opts);
			return "builds success update";
		} catch (Exception e) {
			return "builds fail post " + e.getMessage();
		}
	}
	
}
