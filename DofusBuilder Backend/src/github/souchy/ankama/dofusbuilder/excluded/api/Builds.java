package github.souchy.ankama.dofusbuilder.backend.api;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;

import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;

import org.bson.conversions.Bson;
import com.google.gson.Gson;
import com.mongodb.client.model.Filters;
import com.robyng.ankama.dofusbuilder.backend.Log;
import com.robyng.ankama.dofusbuilder.backend.Stat;
import com.robyng.ankama.dofusbuilder.backend.emerald.Emerald;
import com.robyng.ankama.dofusbuilder.backend.filters.BuildFilter;
import com.robyng.ankama.dofusbuilder.backend.jade.Classes;
import com.robyng.ankama.dofusbuilder.backend.jade.JadeBuild;

@Path("/builds")
public class Builds {

	@GET
//	@Path("/index/{index}")
	@Path("")
	// @Consumes("text/plain")
	@Produces(MediaType.APPLICATION_JSON)
	public List<JadeBuild> get(@QueryParam("page") int page, @QueryParam("filter") String json){ //@PathParam("index") int index) {
		try {
//			Log.info("api.builds/index/" + index);
//			return Emerald.builds().find().skip(index).limit(50).into(new ArrayList<>());

			int maxPerPage = 50;
			Log.info("api.builds?page" + page);

			var filter = new Gson().fromJson(json, BuildFilter.class);
			List<Bson> bsonFilters = new ArrayList<>();
			filter.stats.minimums.forEach((stat, val) -> {
				bsonFilters.add(Filters.gte("baseStats." + stat.name(), val));
			});
			filter.stats.maximums.forEach((stat, val) -> {
				bsonFilters.add(Filters.lte("baseStats." + stat.name(), val));
			});
			
			return Emerald.builds().find(Filters.and(bsonFilters)).skip(maxPerPage * page).limit(maxPerPage).into(new ArrayList<>());
		} catch (Exception e) {
			Log.info("api.builds/index : " + e.toString());
			return null;
		}
	}

	/*
	@GET
	@Path("/filter/{filter}")
	// @Consumes(MediaType.APPLICATION_JSON)
	@Produces(MediaType.APPLICATION_JSON)
	public List<JadeBuild> getMany(@PathParam("filter") String json) {
		var filter = new Gson().fromJson(json, BuildFilter.class);
		List<Bson> bsonFilters = new ArrayList<>();
		filter.stats.minimums.forEach((stat, val) -> {
			bsonFilters.add(Filters.gte("baseStats." + stat.name(), val));
		});
		filter.stats.maximums.forEach((stat, val) -> {
			bsonFilters.add(Filters.lte("baseStats." + stat.name(), val));
		});
		return Emerald.builds().find().filter(Filters.and(bsonFilters)).into(new ArrayList<>());
	}
	*/

	@POST
	@Path("/createBlank")
	public String create() {
		try {
			var build = new JadeBuild();
			// build.creationDate = "2019-09-01-20:47";
			build.name = "sram air";
			build.clazz = Classes.sram.ordinal();
			build.level = 200;
			build.items = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12);
			build.baseStats = Arrays.asList(395, 0, 0, 0, 0, 300);
			build.parcho = Arrays.asList(100, 100, 100, 100, 100, 100);
			build.addedStats = new HashMap<>();
			build.addedStats.put(Stat.ap.name(), 1);
			build.addedStats.put(Stat.mp.name(), 1);
			build.addedStats.put(Stat.range.name(), 1);
			build.addedStats.put(Stat.hp.name(), 500);
			build.addedStats.put(Stat.airResScl.name(), 7);
			Emerald.builds().insertOne(build);
			Log.info("api.builds/create : success");
			return "success";
		} catch (Exception e) {
			Log.info("api.builds/create : " + e.toString());
			return "fail";
		}
	}

}
