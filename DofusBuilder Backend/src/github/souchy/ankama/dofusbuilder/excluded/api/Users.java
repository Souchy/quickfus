package github.souchy.ankama.dofusbuilder.backend.api;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;

@Path("/users/")
public class Users {

	@GET
	public Users get(@PathParam("username") String username, @PathParam("password") String password) {
		return null;
	}

	@GET
	@Path("salt")
	public String getSalt(@PathParam("username") String username) {
		return "";
	}
	
}
