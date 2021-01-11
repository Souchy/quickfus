package github.souchy.ankama.dofusbuilder.backend.jade;

import java.util.List;
import java.util.Map;

public class JadeItem {

	public int id;
	public String name;
	public String description;
	public int lvl;
	public String type;
	public String imgUrl;
	public String url;
	public int set;
	public int __v;
	public Object recipe;
	public List<Charac> characteristic;
	public List<String> condition;
	public Map<String, String> stats;
	
	
	public static class Charac {
		public String key, value;
	}
	
	public static class Stat {
		String name;
	}
	//public static class 
	
}
