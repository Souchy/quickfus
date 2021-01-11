package github.souchy.ankama.dofusbuilder.backend.jade;

import java.util.List;
import java.util.Map;

import org.bson.types.ObjectId;

public class JadeBuild {
	
	//@BsonId
	public ObjectId _id;

	/** build name */
	public String name;
	
	/** creation date */   // it's already in the ObjectId when the document is created on mongodb
	//public String creationDate; 
	
	/** character class */
	public int clazz;
	
	/** character level */
	public int level;
	
	/** item ids */
	public List<Integer> items;
	
	/** parchos { vit, wis, str, int, luck, agi } */
	public List<Integer> parcho;
	
	/** where capital is spent on { vit, wis, str, int, luck, agi } */
	public List<Integer> baseStats; 
	
	/** exo & fixing */
	public Map<String, Integer> addedStats;
	
	/** calculated total stats used for filtering only */
	//public Map<Stat, Integer> totalStats;
	
}
